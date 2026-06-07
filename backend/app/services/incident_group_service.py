from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.incident_group import IncidentGroup, IncidentGroupTicket
from app.models.ticket import Ticket
from app.schemas.incident import (
    IncidentGroupCreateRequest,
    IncidentGroupDetailResponse,
    IncidentGroupFromSuggestionRequest,
    IncidentGroupResponse,
    IncidentGroupStatusUpdateRequest,
    IncidentGroupTicketAddRequest,
    IncidentGroupTicketResponse,
)


class IncidentGroupService:
    @staticmethod
    def list_groups(db: Session) -> list[IncidentGroupResponse]:
        groups = db.execute(
            select(IncidentGroup)
            .options(joinedload(IncidentGroup.tickets))
            .order_by(IncidentGroup.created_at.desc())
        ).unique().scalars().all()
        return [IncidentGroupService._to_response(group) for group in groups]

    @staticmethod
    def get_group(db: Session, group_id: UUID) -> IncidentGroupDetailResponse:
        return IncidentGroupService._to_detail(IncidentGroupService._get_group(db, group_id))

    @staticmethod
    def create_group(db: Session, payload: IncidentGroupCreateRequest) -> IncidentGroupDetailResponse:
        group = IncidentGroup(
            title=payload.title,
            description=payload.description,
            category=payload.category,
            priority=payload.priority,
            suggested_department=payload.suggested_department,
        )
        db.add(group)
        db.flush()
        for ticket_id in payload.ticket_ids:
            IncidentGroupService._add_ticket_link(
                db=db,
                group=group,
                ticket_id=ticket_id,
                similarity_score=None,
                reason="Added during incident group creation.",
            )
        db.commit()
        db.refresh(group)
        return IncidentGroupService.get_group(db, group.id)

    @staticmethod
    def create_from_suggestion(
        db: Session,
        payload: IncidentGroupFromSuggestionRequest,
    ) -> IncidentGroupDetailResponse:
        create_payload = IncidentGroupCreateRequest(
            title=payload.title,
            description=payload.description,
            category=payload.category,
            priority=payload.priority,
            suggested_department=payload.suggested_department,
            ticket_ids=[],
        )
        group = IncidentGroup(
            title=create_payload.title,
            description=create_payload.description,
            category=create_payload.category,
            priority=create_payload.priority,
            suggested_department=create_payload.suggested_department,
        )
        db.add(group)
        db.flush()
        for ticket_id in payload.ticket_ids:
            IncidentGroupService._add_ticket_link(
                db=db,
                group=group,
                ticket_id=ticket_id,
                similarity_score=payload.similarity_scores.get(str(ticket_id)),
                reason="Created from incident suggestion.",
            )
        db.commit()
        db.refresh(group)
        return IncidentGroupService.get_group(db, group.id)

    @staticmethod
    def update_status(
        db: Session,
        group_id: UUID,
        payload: IncidentGroupStatusUpdateRequest,
    ) -> IncidentGroupDetailResponse:
        group = IncidentGroupService._get_group(db, group_id)
        group.status = payload.status
        db.add(group)
        db.commit()
        return IncidentGroupService.get_group(db, group.id)

    @staticmethod
    def add_ticket(
        db: Session,
        group_id: UUID,
        ticket_id: UUID,
        payload: IncidentGroupTicketAddRequest,
    ) -> IncidentGroupDetailResponse:
        group = IncidentGroupService._get_group(db, group_id)
        IncidentGroupService._add_ticket_link(
            db=db,
            group=group,
            ticket_id=ticket_id,
            similarity_score=payload.similarity_score,
            reason=payload.reason or "Manually added by staff/admin.",
        )
        db.commit()
        return IncidentGroupService.get_group(db, group.id)

    @staticmethod
    def remove_ticket(db: Session, group_id: UUID, ticket_id: UUID) -> IncidentGroupDetailResponse:
        group = IncidentGroupService._get_group(db, group_id)
        link = db.execute(
            select(IncidentGroupTicket).where(
                IncidentGroupTicket.incident_group_id == group.id,
                IncidentGroupTicket.ticket_id == ticket_id,
            )
        ).scalar_one_or_none()
        if link is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket link not found")
        db.delete(link)
        db.commit()
        return IncidentGroupService.get_group(db, group.id)

    @staticmethod
    def _get_group(db: Session, group_id: UUID) -> IncidentGroup:
        group = db.execute(
            select(IncidentGroup)
            .options(joinedload(IncidentGroup.tickets).joinedload(IncidentGroupTicket.ticket))
            .where(IncidentGroup.id == group_id)
        ).unique().scalar_one_or_none()
        if group is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident group not found")
        return group

    @staticmethod
    def _add_ticket_link(
        db: Session,
        group: IncidentGroup,
        ticket_id: UUID,
        similarity_score: float | None,
        reason: str,
    ) -> None:
        ticket = db.get(Ticket, ticket_id)
        if ticket is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
        existing = db.execute(
            select(IncidentGroupTicket).where(
                IncidentGroupTicket.incident_group_id == group.id,
                IncidentGroupTicket.ticket_id == ticket_id,
            )
        ).scalar_one_or_none()
        if existing is not None:
            existing.similarity_score = similarity_score
            existing.reason = reason
            db.add(existing)
            return
        db.add(
            IncidentGroupTicket(
                incident_group_id=group.id,
                ticket_id=ticket_id,
                similarity_score=similarity_score,
                reason=reason,
            )
        )

    @staticmethod
    def _to_response(group: IncidentGroup) -> IncidentGroupResponse:
        return IncidentGroupResponse(
            id=group.id,
            title=group.title,
            description=group.description,
            category=group.category,
            priority=group.priority,
            suggested_department=group.suggested_department,
            status=group.status,
            related_count=len(group.tickets),
            created_at=group.created_at,
            updated_at=group.updated_at,
        )

    @staticmethod
    def _to_detail(group: IncidentGroup) -> IncidentGroupDetailResponse:
        response = IncidentGroupService._to_response(group)
        tickets = [
            IncidentGroupTicketResponse(
                id=link.id,
                ticket_id=link.ticket_id,
                title=link.ticket.title,
                status=link.ticket.status,
                similarity_score=link.similarity_score,
                reason=link.reason,
                created_at=link.created_at,
            )
            for link in sorted(group.tickets, key=lambda item: item.created_at)
            if link.ticket
        ]
        return IncidentGroupDetailResponse(**response.model_dump(), tickets=tickets)
