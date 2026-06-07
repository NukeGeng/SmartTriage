import csv
from io import StringIO
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_admin, require_staff_or_admin
from app.db.session import get_db
from app.models.ticket import TicketStatus
from app.models.user import User
from app.schemas.common import ApiResponse
from app.schemas.ticket import TicketCreateRequest, TicketStatusUpdateRequest, TicketUpdateRequest
from app.services.ticket_service import TicketService

router = APIRouter(prefix="/tickets", tags=["tickets"])


def get_ticket_service() -> TicketService:
    return TicketService()


@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    payload: TicketCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: TicketService = Depends(get_ticket_service),
) -> ApiResponse:
    ticket = service.create_ticket(db, payload, current_user)
    return ApiResponse(success=True, message="Ticket created", data=ticket)


@router.get("", response_model=ApiResponse)
def list_tickets(
    status_filter: TicketStatus | None = Query(default=None, alias="status"),
    category: str | None = None,
    priority: str | None = None,
    assigned_department: str | None = None,
    search: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: TicketService = Depends(get_ticket_service),
) -> ApiResponse:
    tickets = service.list_tickets(
        db=db,
        current_user=current_user,
        status_filter=status_filter,
        category=category,
        priority=priority,
        assigned_department=assigned_department,
        search=search,
        page=page,
        page_size=page_size,
    )
    return ApiResponse(success=True, message="Tickets retrieved", data=tickets)


@router.get("/export-training-data")
def export_training_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    service: TicketService = Depends(get_ticket_service),
) -> StreamingResponse:
    output = StringIO()
    writer = csv.DictWriter(
        output,
        fieldnames=["title", "description", "category", "priority", "source"],
    )
    writer.writeheader()
    writer.writerows(service.export_training_data(db))
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=smarttriage_training_data.csv"},
    )


@router.get("/{ticket_id}", response_model=ApiResponse)
def get_ticket(
    ticket_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: TicketService = Depends(get_ticket_service),
) -> ApiResponse:
    ticket = service.get_ticket_detail(db, ticket_id, current_user)
    return ApiResponse(success=True, message="Ticket retrieved", data=ticket)


@router.patch("/{ticket_id}/status", response_model=ApiResponse)
def update_ticket_status(
    ticket_id: UUID,
    payload: TicketStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
    service: TicketService = Depends(get_ticket_service),
) -> ApiResponse:
    ticket = service.update_status(db, ticket_id, payload, current_user)
    return ApiResponse(success=True, message="Ticket status updated", data=ticket)


@router.patch("/{ticket_id}", response_model=ApiResponse)
def update_ticket(
    ticket_id: UUID,
    payload: TicketUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
    service: TicketService = Depends(get_ticket_service),
) -> ApiResponse:
    ticket = service.update_ticket(db, ticket_id, payload, current_user)
    return ApiResponse(success=True, message="Ticket updated", data=ticket)
