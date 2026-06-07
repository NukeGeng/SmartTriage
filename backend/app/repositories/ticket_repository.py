from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.models.ticket import Ticket, TicketStatus
from app.models.ticket_analysis import TicketAnalysis
from app.models.user import User, UserRole


class TicketRepository:
    @staticmethod
    def create(db: Session, ticket: Ticket) -> Ticket:
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        return ticket

    @staticmethod
    def get_by_id(db: Session, ticket_id: UUID) -> Ticket | None:
        statement = (
            select(Ticket)
            .options(joinedload(Ticket.analysis))
            .where(Ticket.id == ticket_id)
        )
        return db.execute(statement).scalar_one_or_none()

    @staticmethod
    def add_analysis(db: Session, analysis: TicketAnalysis) -> TicketAnalysis:
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        return analysis

    @staticmethod
    def save(db: Session, ticket: Ticket) -> Ticket:
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        return ticket

    @staticmethod
    def list_visible(
        db: Session,
        current_user: User,
        status: TicketStatus | None = None,
        category: str | None = None,
        priority: str | None = None,
        assigned_department: str | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[Ticket], int]:
        statement = select(Ticket).outerjoin(TicketAnalysis).options(joinedload(Ticket.analysis))

        if current_user.role == UserRole.STUDENT:
            statement = statement.where(Ticket.created_by_id == current_user.id)
        elif current_user.role == UserRole.STAFF:
            statement = statement.where(
                or_(
                    Ticket.assigned_department.is_(None),
                    Ticket.assigned_department == current_user.department,
                )
            )

        if status is not None:
            statement = statement.where(Ticket.status == status)
        if category:
            statement = statement.where(TicketAnalysis.predicted_category == category)
        if priority:
            statement = statement.where(TicketAnalysis.priority == priority)
        if assigned_department:
            statement = statement.where(Ticket.assigned_department == assigned_department)
        if search:
            pattern = f"%{search}%"
            statement = statement.where(
                or_(Ticket.title.ilike(pattern), Ticket.description.ilike(pattern))
            )

        count_statement = select(func.count()).select_from(statement.order_by().subquery())
        total = db.execute(count_statement).scalar_one()

        items = db.execute(
            statement.order_by(Ticket.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        ).scalars().all()
        return list(items), total

    @staticmethod
    def list_open_for_ai(db: Session, limit: int = 100) -> list[Ticket]:
        statement = (
            select(Ticket)
            .options(joinedload(Ticket.analysis))
            .where(Ticket.status.in_([TicketStatus.OPEN, TicketStatus.IN_PROGRESS]))
            .order_by(Ticket.created_at.desc())
            .limit(limit)
        )
        return list(db.execute(statement).scalars().all())

    @staticmethod
    def list_for_training_export(db: Session) -> list[Ticket]:
        statement = (
            select(Ticket)
            .options(joinedload(Ticket.analysis))
            .outerjoin(TicketAnalysis)
            .order_by(Ticket.created_at.desc())
        )
        return list(db.execute(statement).scalars().all())
