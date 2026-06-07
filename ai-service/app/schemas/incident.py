from pydantic import BaseModel, Field


class IncidentTicketInput(BaseModel):
    id: str | None = None
    ticket_id: str | None = None
    title: str
    description: str
    category: str | None = None


class IncidentGroupSuggestionRequest(BaseModel):
    new_ticket: IncidentTicketInput
    existing_tickets: list[IncidentTicketInput] = Field(default_factory=list)


class IncidentRelatedTicket(BaseModel):
    ticket_id: str
    title: str
    similarity: float
    reason: str


class IncidentGroupSuggestionResponse(BaseModel):
    has_incident_suggestion: bool
    suggested_group_title: str
    suggested_category: str | None = None
    average_similarity: float
    related_tickets: list[IncidentRelatedTicket]
    recommendation: str
