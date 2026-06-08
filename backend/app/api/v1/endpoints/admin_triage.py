from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import require_staff_or_admin
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import ApiResponse
from app.services.triage_service import TriageService

router = APIRouter(prefix="/admin/triage", tags=["admin-triage"])


@router.get("/overview", response_model=ApiResponse)
def triage_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
) -> ApiResponse:
    overview = TriageService.get_overview(db, current_user)
    return ApiResponse(success=True, message="Triage overview retrieved", data=overview)
