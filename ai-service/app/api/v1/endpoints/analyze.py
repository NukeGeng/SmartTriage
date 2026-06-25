from fastapi import APIRouter, Depends

from app.schemas.analyze import AnalyzeTicketRequest
from app.schemas.common import ApiResponse
from app.services.analysis_service import AnalysisService, get_analysis_service

router = APIRouter(tags=["analysis"])


@router.post("/analyze-ticket", response_model=ApiResponse)
def analyze_ticket(
    payload: AnalyzeTicketRequest,
    service: AnalysisService = Depends(get_analysis_service),
) -> ApiResponse:
    result = service.analyze(payload)
    return ApiResponse(success=True, message="Ticket analyzed successfully", data=result)
