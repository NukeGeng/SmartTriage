from fastapi import APIRouter

from app.ml.incident_grouper import suggest_incident_group
from app.schemas.common import ApiResponse
from app.schemas.incident import IncidentGroupSuggestionRequest, IncidentGroupSuggestionResponse

router = APIRouter(tags=["incidents"])


@router.post("/suggest-incident-group", response_model=ApiResponse)
def suggest_incident(payload: IncidentGroupSuggestionRequest) -> ApiResponse:
    result = suggest_incident_group(
        new_ticket=payload.new_ticket.model_dump(),
        existing_tickets=[ticket.model_dump() for ticket in payload.existing_tickets],
    )
    return ApiResponse(
        success=True,
        message="Incident group suggestion generated",
        data=IncidentGroupSuggestionResponse(**result),
    )
