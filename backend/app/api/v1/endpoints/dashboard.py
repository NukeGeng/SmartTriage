from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.security import require_staff_or_admin
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import ApiResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=ApiResponse)
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    stats = DashboardService.get_stats(db, current_user)
    return ApiResponse(success=True, message="Dashboard stats retrieved", data=stats)


@router.get("/tickets-by-category", response_model=ApiResponse)
def tickets_by_category(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    stats = DashboardService.tickets_by_category(db, current_user)
    return ApiResponse(success=True, message="Ticket category stats retrieved", data=stats)


@router.get("/tickets-by-priority", response_model=ApiResponse)
def tickets_by_priority(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    stats = DashboardService.tickets_by_priority(db, current_user)
    return ApiResponse(success=True, message="Ticket priority stats retrieved", data=stats)


@router.get("/tickets-by-status", response_model=ApiResponse)
def tickets_by_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    stats = DashboardService.tickets_by_status(db, current_user)
    return ApiResponse(success=True, message="Ticket status stats retrieved", data=stats)


@router.get("/recent-tickets", response_model=ApiResponse)
def recent_tickets(
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    tickets = DashboardService.recent_tickets(db, current_user, limit)
    return ApiResponse(success=True, message="Recent tickets retrieved", data=tickets)
