from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import require_staff_or_admin
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import ApiResponse
from app.schemas.incident import (
    IncidentGroupCreateRequest,
    IncidentGroupFromSuggestionRequest,
    IncidentGroupStatusUpdateRequest,
    IncidentGroupTicketAddRequest,
)
from app.services.incident_group_service import IncidentGroupService

router = APIRouter(prefix="/admin/incident-groups", tags=["incident-groups"])


@router.get("", response_model=ApiResponse)
def list_incident_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    return ApiResponse(
        success=True,
        message="Incident groups retrieved",
        data=IncidentGroupService.list_groups(db),
    )


@router.get("/{group_id}", response_model=ApiResponse)
def get_incident_group(
    group_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    return ApiResponse(
        success=True,
        message="Incident group retrieved",
        data=IncidentGroupService.get_group(db, group_id),
    )


@router.post("", response_model=ApiResponse)
def create_incident_group(
    payload: IncidentGroupCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    return ApiResponse(
        success=True,
        message="Incident group created",
        data=IncidentGroupService.create_group(db, payload),
    )


@router.post("/from-suggestion", response_model=ApiResponse)
def create_incident_group_from_suggestion(
    payload: IncidentGroupFromSuggestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    return ApiResponse(
        success=True,
        message="Incident group created from suggestion",
        data=IncidentGroupService.create_from_suggestion(db, payload),
    )


@router.patch("/{group_id}/status", response_model=ApiResponse)
def update_incident_group_status(
    group_id: UUID,
    payload: IncidentGroupStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    return ApiResponse(
        success=True,
        message="Incident group status updated",
        data=IncidentGroupService.update_status(db, group_id, payload),
    )


@router.post("/{group_id}/tickets/{ticket_id}", response_model=ApiResponse)
def add_ticket_to_incident_group(
    group_id: UUID,
    ticket_id: UUID,
    payload: IncidentGroupTicketAddRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    return ApiResponse(
        success=True,
        message="Ticket added to incident group",
        data=IncidentGroupService.add_ticket(db, group_id, ticket_id, payload),
    )


@router.delete("/{group_id}/tickets/{ticket_id}", response_model=ApiResponse)
def remove_ticket_from_incident_group(
    group_id: UUID,
    ticket_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    return ApiResponse(
        success=True,
        message="Ticket removed from incident group",
        data=IncidentGroupService.remove_ticket(db, group_id, ticket_id),
    )
