from datetime import datetime

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.models.ticket import Ticket, TicketStatus
from app.models.ticket_analysis import TicketAnalysis
from app.models.user import User, UserRole
from app.schemas.dashboard import (
    DashboardStatsResponse,
    RecentTicketResponse,
    TicketCategoryStat,
    TicketPriorityStat,
    TicketStatusStat,
)


class DashboardService:
    @staticmethod
    def get_stats(db: Session, current_user: User) -> DashboardStatsResponse:
        total_tickets = DashboardService._count_tickets(db, current_user)
        open_tickets = DashboardService._count_tickets(db, current_user, Ticket.status == TicketStatus.OPEN)
        resolved_tickets = DashboardService._count_tickets(
            db,
            current_user,
            Ticket.status == TicketStatus.RESOLVED,
        )
        high_priority_tickets = DashboardService._count_high_priority(db, current_user)
        avg_resolution_hours = DashboardService._avg_resolution_hours(db, current_user)

        return DashboardStatsResponse(
            total_tickets=total_tickets,
            open_tickets=open_tickets,
            resolved_tickets=resolved_tickets,
            high_priority_tickets=high_priority_tickets,
            avg_resolution_hours=avg_resolution_hours,
        )

    @staticmethod
    def tickets_by_category(db: Session, current_user: User) -> list[TicketCategoryStat]:
        statement = (
            select(TicketAnalysis.predicted_category, func.count())
            .join(Ticket, Ticket.id == TicketAnalysis.ticket_id)
            .group_by(TicketAnalysis.predicted_category)
            .order_by(func.count().desc())
        )
        statement = DashboardService._apply_visibility(statement, current_user)
        rows = db.execute(statement).all()
        return [TicketCategoryStat(category=row[0], count=row[1]) for row in rows]

    @staticmethod
    def tickets_by_priority(db: Session, current_user: User) -> list[TicketPriorityStat]:
        statement = (
            select(TicketAnalysis.priority, func.count())
            .join(Ticket, Ticket.id == TicketAnalysis.ticket_id)
            .group_by(TicketAnalysis.priority)
            .order_by(func.count().desc())
        )
        statement = DashboardService._apply_visibility(statement, current_user)
        rows = db.execute(statement).all()
        return [TicketPriorityStat(priority=row[0], count=row[1]) for row in rows]

    @staticmethod
    def tickets_by_status(db: Session, current_user: User) -> list[TicketStatusStat]:
        statement = select(Ticket.status, func.count()).group_by(Ticket.status)
        statement = DashboardService._apply_visibility(statement, current_user)
        rows = db.execute(statement).all()
        return [TicketStatusStat(status=row[0], count=row[1]) for row in rows]

    @staticmethod
    def recent_tickets(db: Session, current_user: User, limit: int = 10) -> list[RecentTicketResponse]:
        statement = (
            select(Ticket)
            .options(joinedload(Ticket.analysis))
            .order_by(Ticket.created_at.desc())
            .limit(limit)
        )
        statement = DashboardService._apply_visibility(statement, current_user)
        tickets = db.execute(statement).scalars().all()
        return [
            RecentTicketResponse(
                id=ticket.id,
                title=ticket.title,
                status=ticket.status,
                priority=ticket.manual_priority or (ticket.analysis.priority if ticket.analysis else None),
                category=ticket.manual_category
                or (ticket.analysis.predicted_category if ticket.analysis else None),
                assigned_department=ticket.assigned_department,
                created_at=ticket.created_at,
            )
            for ticket in tickets
        ]

    @staticmethod
    def _count_tickets(db: Session, current_user: User, *conditions) -> int:
        statement = select(func.count()).select_from(Ticket).where(*conditions)
        statement = DashboardService._apply_visibility(statement, current_user)
        return db.execute(statement).scalar_one()

    @staticmethod
    def _count_high_priority(db: Session, current_user: User) -> int:
        statement = (
            select(func.count())
            .select_from(Ticket)
            .join(TicketAnalysis, TicketAnalysis.ticket_id == Ticket.id)
            .where(TicketAnalysis.priority == "high")
        )
        statement = DashboardService._apply_visibility(statement, current_user)
        return db.execute(statement).scalar_one()

    @staticmethod
    def _avg_resolution_hours(db: Session, current_user: User) -> float:
        statement = select(Ticket.created_at, Ticket.resolved_at).where(Ticket.resolved_at.is_not(None))
        statement = DashboardService._apply_visibility(statement, current_user)
        rows: list[tuple[datetime, datetime]] = list(db.execute(statement).all())
        if not rows:
            return 0.0
        total_hours = sum((resolved_at - created_at).total_seconds() / 3600 for created_at, resolved_at in rows)
        return round(total_hours / len(rows), 2)

    @staticmethod
    def _apply_visibility(statement, current_user: User):
        if current_user.role == UserRole.STAFF:
            return statement.where(
                or_(
                    Ticket.assigned_department.is_(None),
                    Ticket.assigned_department == current_user.department,
                )
            )
        return statement
