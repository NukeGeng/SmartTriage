import logging
from datetime import UTC, datetime
from typing import Any
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.ticket import Ticket, TicketStatus
from app.models.ticket_analysis import TicketAnalysis
from app.models.user import User, UserRole
from app.repositories.ticket_repository import TicketRepository
from app.schemas.ticket import (
    TicketCreateRequest,
    TicketDetailResponse,
    TicketListItemResponse,
    TicketListResponse,
    TicketStatusUpdateRequest,
    TicketUpdateRequest,
)
from app.services.ai_client import AIServiceClient

logger = logging.getLogger(__name__)


class TicketService:
    def __init__(self, ai_client: AIServiceClient | None = None) -> None:
        self.ai_client = ai_client or AIServiceClient()

    def create_ticket(
        self,
        db: Session,
        payload: TicketCreateRequest,
        current_user: User,
    ) -> TicketDetailResponse:
        ticket = Ticket(
            title=payload.title,
            description=payload.description,
            status=TicketStatus.ANALYZING,
            created_by_id=current_user.id,
        )
        ticket = TicketRepository.create(db, ticket)
        logger.info("Ticket created: id=%s created_by=%s", ticket.id, current_user.id)

        analysis_payload = self.ai_client.analyze_ticket(
            ticket_id=str(ticket.id),
            title=ticket.title,
            description=ticket.description,
            created_by_role=current_user.role.value,
            existing_tickets=self._build_existing_ticket_context(db),
        )

        if analysis_payload:
            analysis = self._create_analysis_from_payload(ticket.id, analysis_payload)
            ticket.assigned_department = analysis.suggested_department
            ticket.status = TicketStatus.OPEN
            TicketRepository.add_analysis(db, analysis)
            TicketRepository.save(db, ticket)
        else:
            ticket.status = TicketStatus.OPEN
            TicketRepository.save(db, ticket)

        saved_ticket = TicketRepository.get_by_id(db, ticket.id)
        if saved_ticket is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Ticket not found")
        return TicketDetailResponse.model_validate(saved_ticket)

    def list_tickets(
        self,
        db: Session,
        current_user: User,
        status_filter: TicketStatus | None = None,
        category: str | None = None,
        priority: str | None = None,
        assigned_department: str | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> TicketListResponse:
        tickets, total = TicketRepository.list_visible(
            db=db,
            current_user=current_user,
            status=status_filter,
            category=category,
            priority=priority,
            assigned_department=assigned_department,
            search=search,
            page=page,
            page_size=page_size,
        )
        return TicketListResponse(
            items=[self._to_list_item(ticket) for ticket in tickets],
            total=total,
            page=page,
            page_size=page_size,
        )

    def get_ticket_detail(
        self,
        db: Session,
        ticket_id: UUID,
        current_user: User,
    ) -> TicketDetailResponse:
        ticket = self._get_visible_ticket(db, ticket_id, current_user)
        return TicketDetailResponse.model_validate(ticket)

    def update_status(
        self,
        db: Session,
        ticket_id: UUID,
        payload: TicketStatusUpdateRequest,
        current_user: User,
    ) -> TicketDetailResponse:
        ticket = self._get_visible_ticket(db, ticket_id, current_user)
        ticket.status = payload.status
        if payload.status == TicketStatus.RESOLVED:
            ticket.resolved_at = datetime.now(UTC)
        TicketRepository.save(db, ticket)
        refreshed = TicketRepository.get_by_id(db, ticket.id)
        if refreshed is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Ticket not found")
        return TicketDetailResponse.model_validate(refreshed)

    def update_ticket(
        self,
        db: Session,
        ticket_id: UUID,
        payload: TicketUpdateRequest,
        current_user: User,
    ) -> TicketDetailResponse:
        ticket = self._get_visible_ticket(db, ticket_id, current_user)
        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(ticket, field, value)
        TicketRepository.save(db, ticket)
        refreshed = TicketRepository.get_by_id(db, ticket.id)
        if refreshed is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Ticket not found")
        return TicketDetailResponse.model_validate(refreshed)

    def _get_visible_ticket(self, db: Session, ticket_id: UUID, current_user: User) -> Ticket:
        ticket = TicketRepository.get_by_id(db, ticket_id)
        if ticket is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
        if not self._can_view(ticket, current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this ticket",
            )
        return ticket

    @staticmethod
    def _can_view(ticket: Ticket, current_user: User) -> bool:
        if current_user.role == UserRole.ADMIN:
            return True
        if current_user.role == UserRole.STUDENT:
            return ticket.created_by_id == current_user.id
        if current_user.role == UserRole.STAFF:
            return ticket.assigned_department in {None, current_user.department}
        return False

    @staticmethod
    def _to_list_item(ticket: Ticket) -> TicketListItemResponse:
        analysis = ticket.analysis
        return TicketListItemResponse(
            id=ticket.id,
            title=ticket.title,
            status=ticket.status,
            assigned_department=ticket.assigned_department,
            category=ticket.manual_category or (analysis.predicted_category if analysis else None),
            priority=ticket.manual_priority or (analysis.priority if analysis else None),
            priority_score=analysis.priority_score if analysis else None,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at,
        )

    @staticmethod
    def _create_analysis_from_payload(ticket_id: UUID, payload: dict[str, Any]) -> TicketAnalysis:
        return TicketAnalysis(
            ticket_id=ticket_id,
            predicted_category=str(payload.get("category") or "other"),
            category_label=str(payload.get("category_label") or "Khác"),
            category_confidence=float(payload.get("confidence") or 0.0),
            priority=str(payload.get("priority") or "medium"),
            priority_score=int(payload.get("priority_score") or 50),
            suggested_department=str(payload.get("suggested_department") or "Bộ phận tiếp nhận phản ánh"),
            duplicate_candidates=payload.get("duplicate_candidates") or [],
            suggested_actions=payload.get("suggested_actions") or [],
            model_version=str(payload.get("model_version") or "unknown"),
        )

    @staticmethod
    def _build_existing_ticket_context(db: Session) -> list[dict[str, Any]]:
        tickets = TicketRepository.list_open_for_ai(db)
        return [
            {
                "ticket_id": str(ticket.id),
                "title": ticket.title,
                "description": ticket.description,
            }
            for ticket in tickets
        ]
