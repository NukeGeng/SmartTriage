import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class TicketAnalysis(Base):
    __tablename__ = "ticket_analyses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    ticket_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tickets.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    predicted_category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    category_label: Mapped[str] = mapped_column(String(255), nullable=False)
    category_confidence: Mapped[float] = mapped_column(Float, nullable=False)
    priority: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    priority_score: Mapped[int] = mapped_column(Integer, nullable=False)
    suggested_department: Mapped[str] = mapped_column(String(255), nullable=False)
    duplicate_candidates: Mapped[list[dict[str, Any]]] = mapped_column(
        JSON().with_variant(JSONB, "postgresql"),
        nullable=False,
        default=list,
    )
    suggested_actions: Mapped[list[str]] = mapped_column(
        JSON().with_variant(JSONB, "postgresql"),
        nullable=False,
        default=list,
    )
    analysis_metadata: Mapped[dict[str, Any]] = mapped_column(
        JSON().with_variant(JSONB, "postgresql"),
        nullable=False,
        default=dict,
    )
    model_version: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    ticket: Mapped["Ticket"] = relationship("Ticket", back_populates="analysis")

    @property
    def explanation(self) -> dict[str, Any] | None:
        return self.analysis_metadata.get("explanation")

    @property
    def priority_breakdown(self) -> dict[str, Any] | None:
        return self.analysis_metadata.get("priority_breakdown")
