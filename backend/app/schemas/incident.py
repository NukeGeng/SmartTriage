from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.incident_group import IncidentGroupStatus
from app.models.ticket import TicketStatus


class IncidentGroupTicketResponse(BaseModel):
    id: UUID
    ticket_id: UUID
    title: str
    status: TicketStatus
    similarity_score: float | None = None
    reason: str | None = None
    created_at: datetime


class IncidentGroupResponse(BaseModel):
    id: UUID
    title: str
    description: str | None = None
    category: str | None = None
    priority: str | None = None
    suggested_department: str | None = None
    status: IncidentGroupStatus
    related_count: int
    created_at: datetime
    updated_at: datetime


class IncidentGroupDetailResponse(IncidentGroupResponse):
    tickets: list[IncidentGroupTicketResponse]


class IncidentGroupCreateRequest(BaseModel):
    title: str = Field(min_length=5, max_length=255)
    description: str | None = None
    category: str | None = Field(default=None, max_length=100)
    priority: str | None = Field(default=None, max_length=50)
    suggested_department: str | None = Field(default=None, max_length=255)
    ticket_ids: list[UUID] = Field(default_factory=list)


class IncidentGroupFromSuggestionRequest(BaseModel):
    title: str = Field(min_length=5, max_length=255)
    description: str | None = None
    category: str | None = Field(default=None, max_length=100)
    priority: str | None = Field(default=None, max_length=50)
    suggested_department: str | None = Field(default=None, max_length=255)
    ticket_ids: list[UUID]
    similarity_scores: dict[str, float] = Field(default_factory=dict)


class IncidentGroupStatusUpdateRequest(BaseModel):
    status: IncidentGroupStatus


class IncidentGroupTicketAddRequest(BaseModel):
    similarity_score: float | None = Field(default=None, ge=0, le=1)
    reason: str | None = None
