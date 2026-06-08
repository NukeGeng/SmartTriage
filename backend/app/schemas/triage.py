from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.ticket import TicketStatus


class TriageSummary(BaseModel):
    total_open: int
    high_priority: int
    low_confidence: int
    possible_incidents: int


class TriageTicketItem(BaseModel):
    id: UUID
    title: str
    description: str
    status: TicketStatus
    assigned_department: str | None = None
    category: str | None = None
    category_label: str | None = None
    priority: str | None = None
    priority_score: int | None = None
    category_confidence: float | None = None
    suggested_department: str | None = None
    created_at: datetime
    updated_at: datetime


class IncidentRelatedTicket(BaseModel):
    ticket_id: str
    title: str
    similarity: float
    reason: str


class IncidentGroupSuggestion(BaseModel):
    group_key: str
    title: str
    category: str | None = None
    average_similarity: float
    related_count: int
    related_tickets: list[IncidentRelatedTicket]
    recommendation: str


class RoutingRecommendation(BaseModel):
    ticket: TriageTicketItem
    recommended_department: str
    reason: str


class TriageOverviewResponse(BaseModel):
    summary: TriageSummary
    critical_queue: list[TriageTicketItem]
    low_confidence_cases: list[TriageTicketItem]
    possible_incident_groups: list[IncidentGroupSuggestion]
    routing_recommendations: list[RoutingRecommendation]
    recent_tickets: list[TriageTicketItem]
