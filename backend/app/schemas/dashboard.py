import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.ticket import TicketStatus


class DashboardStatsResponse(BaseModel):
    total_tickets: int
    open_tickets: int
    resolved_tickets: int
    high_priority_tickets: int
    avg_resolution_hours: float


class TicketCategoryStat(BaseModel):
    category: str
    count: int


class TicketPriorityStat(BaseModel):
    priority: str
    count: int


class TicketStatusStat(BaseModel):
    status: TicketStatus
    count: int


class RecentTicketResponse(BaseModel):
    id: uuid.UUID
    title: str
    status: TicketStatus
    priority: str | None = None
    category: str | None = None
    assigned_department: str | None = None
    created_at: datetime
