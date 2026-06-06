from typing import Literal

from pydantic import BaseModel, Field


class ExistingTicket(BaseModel):
    ticket_id: str
    title: str
    description: str


class OpenTicketContext(ExistingTicket):
    category: str | None = None


class AnalyzeTicketRequest(BaseModel):
    ticket_id: str
    title: str = Field(min_length=5)
    description: str = Field(min_length=10)
    created_by_role: str | None = None
    existing_tickets: list[ExistingTicket] = Field(default_factory=list)
    open_tickets: list[OpenTicketContext] = Field(default_factory=list)


class DuplicateCandidate(BaseModel):
    ticket_id: str
    title: str
    similarity: float


class AnalyzeTicketResponse(BaseModel):
    category: str
    category_label: str
    confidence: float
    priority: Literal["low", "medium", "high"]
    priority_score: int
    suggested_department: str
    duplicate_candidates: list[DuplicateCandidate]
    suggested_actions: list[str]
    model_version: str


class ModelInfoResponse(BaseModel):
    model_version: str | None = None
    algorithm: str
    accuracy: float | None = None
    macro_f1: float | None = None
    categories: list[str]
    model_loaded: bool
