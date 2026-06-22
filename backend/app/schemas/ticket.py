import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.ticket import TicketStatus


class TicketCreateRequest(BaseModel):
    title: str = Field(min_length=5, max_length=255)
    description: str = Field(min_length=10)


class TicketUpdateRequest(BaseModel):
    manual_category: str | None = Field(default=None, max_length=100)
    manual_priority: str | None = Field(default=None, max_length=50)
    assigned_department: str | None = Field(default=None, max_length=255)
    assigned_to_id: uuid.UUID | None = None


class TicketStatusUpdateRequest(BaseModel):
    status: TicketStatus


class TicketReanalyzeResponse(BaseModel):
    total: int
    updated: int
    created: int
    failed: int
    model_version: str | None = None


class AnalysisExplanation(BaseModel):
    summary: str
    category_reason: str
    priority_reason: str
    department_reason: str
    detected_signals: list[str]


class PriorityBreakdownItem(BaseModel):
    name: str
    score: int
    reason: str
    matched_terms: list[str] = Field(default_factory=list)


class PriorityBreakdown(BaseModel):
    total_score: int
    level: str
    items: list[PriorityBreakdownItem]


class TicketAnalysisResponse(BaseModel):
    id: uuid.UUID
    ticket_id: uuid.UUID
    predicted_category: str
    category_label: str
    category_confidence: float
    priority: str
    priority_score: int
    suggested_department: str
    duplicate_candidates: list[dict[str, Any]]
    suggested_actions: list[str]
    explanation: AnalysisExplanation | None = None
    priority_breakdown: PriorityBreakdown | None = None
    analysis_metadata: dict[str, Any] = Field(default_factory=dict)
    model_version: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TicketResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    status: TicketStatus
    created_by_id: uuid.UUID
    assigned_department: str | None = None
    assigned_to_id: uuid.UUID | None = None
    manual_category: str | None = None
    manual_priority: str | None = None
    created_at: datetime
    updated_at: datetime
    resolved_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class TicketDetailResponse(TicketResponse):
    analysis: TicketAnalysisResponse | None = None


class TicketListItemResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None = None
    status: TicketStatus
    assigned_department: str | None = None
    manual_category: str | None = None
    manual_priority: str | None = None
    category: str | None = None
    category_label: str | None = None
    category_confidence: float | None = None
    ai_category: str | None = None
    ai_priority: str | None = None
    priority: str | None = None
    priority_score: int | None = None
    created_at: datetime
    updated_at: datetime


class TicketListResponse(BaseModel):
    items: list[TicketListItemResponse]
    total: int
    page: int
    page_size: int
