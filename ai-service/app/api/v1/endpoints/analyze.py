from fastapi import APIRouter

from app.schemas.analyze import AnalyzeTicketRequest
from app.schemas.common import ApiResponse
from app.services.analysis_service import AnalysisService

router = APIRouter(tags=["analysis"])


@router.post("/analyze-ticket", response_model=ApiResponse)
def analyze_ticket(payload: AnalyzeTicketRequest) -> ApiResponse:
    result = AnalysisService().analyze(payload)
    return ApiResponse(success=True, message="Ticket analyzed successfully", data=result)
