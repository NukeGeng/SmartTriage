from fastapi import APIRouter, Depends

from app.core.security import require_staff_or_admin
from app.models.user import User
from app.schemas.common import ApiResponse
from app.services.ai_client import AIServiceClient

router = APIRouter(prefix="/ai", tags=["ai"])


def get_ai_client() -> AIServiceClient:
    return AIServiceClient()


@router.get("/model-info", response_model=ApiResponse)
def model_info(
    current_user: User = Depends(require_staff_or_admin),
    ai_client: AIServiceClient = Depends(get_ai_client),
) -> ApiResponse:
    return ApiResponse(
        success=True,
        message="AI model info retrieved",
        data=ai_client.get_model_info(),
    )
