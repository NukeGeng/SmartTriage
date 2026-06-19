from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.ticket import Ticket, TicketStatus
from app.models.training_pipeline import DatasetVersion, TrainingReviewStatus, TrainingSample


class TrainingPipelineRepository:
    @staticmethod
    def list_resolved_tickets(db: Session) -> list[Ticket]:
        statement = (
            select(Ticket)
            .options(joinedload(Ticket.analysis))
            .where(Ticket.status == TicketStatus.RESOLVED)
            .order_by(Ticket.resolved_at.asc())
        )
        return list(db.execute(statement).scalars().all())

    @staticmethod
    def get_sample_by_id(db: Session, sample_id: UUID) -> TrainingSample | None:
        return db.execute(select(TrainingSample).where(TrainingSample.id == sample_id)).scalar_one_or_none()

    @staticmethod
    def get_sample_by_source_ticket(db: Session, ticket_id: UUID) -> TrainingSample | None:
        return db.execute(
            select(TrainingSample).where(TrainingSample.source_ticket_id == ticket_id)
        ).scalar_one_or_none()

    @staticmethod
    def get_sample_by_hash(db: Session, content_hash: str) -> TrainingSample | None:
        return db.execute(
            select(TrainingSample).where(TrainingSample.content_hash == content_hash)
        ).scalar_one_or_none()

    @staticmethod
    def add_sample(db: Session, sample: TrainingSample) -> TrainingSample:
        db.add(sample)
        db.commit()
        db.refresh(sample)
        return sample

    @staticmethod
    def save_sample(db: Session, sample: TrainingSample) -> TrainingSample:
        db.add(sample)
        db.commit()
        db.refresh(sample)
        return sample

    @staticmethod
    def list_samples(
        db: Session,
        review_status: TrainingReviewStatus | None,
        page: int,
        page_size: int,
    ) -> tuple[list[TrainingSample], int]:
        statement = select(TrainingSample)
        if review_status is not None:
            statement = statement.where(TrainingSample.review_status == review_status)
        total = db.execute(select(func.count()).select_from(statement.subquery())).scalar_one()
        items = db.execute(
            statement.order_by(TrainingSample.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        ).scalars().all()
        return list(items), total

    @staticmethod
    def status_counts(db: Session) -> dict[str, int]:
        rows = db.execute(
            select(TrainingSample.review_status, func.count(TrainingSample.id)).group_by(
                TrainingSample.review_status
            )
        ).all()
        return {status.value: count for status, count in rows}

    @staticmethod
    def list_unversioned_approved(db: Session) -> list[TrainingSample]:
        statement = (
            select(TrainingSample)
            .where(
                TrainingSample.review_status == TrainingReviewStatus.APPROVED,
                TrainingSample.dataset_version_id.is_(None),
            )
            .order_by(TrainingSample.created_at.asc())
        )
        return list(db.execute(statement).scalars().all())

    @staticmethod
    def create_dataset_version(
        db: Session,
        dataset: DatasetVersion,
        samples: list[TrainingSample],
    ) -> DatasetVersion:
        db.add(dataset)
        db.flush()
        for sample in samples:
            sample.dataset_version_id = dataset.id
            db.add(sample)
        db.commit()
        return TrainingPipelineRepository.get_dataset_version(db, dataset.id) or dataset

    @staticmethod
    def get_dataset_version(db: Session, dataset_id: UUID) -> DatasetVersion | None:
        statement = (
            select(DatasetVersion)
            .options(selectinload(DatasetVersion.samples))
            .where(DatasetVersion.id == dataset_id)
        )
        return db.execute(statement).scalar_one_or_none()

    @staticmethod
    def list_dataset_versions(db: Session) -> list[DatasetVersion]:
        return list(
            db.execute(select(DatasetVersion).order_by(DatasetVersion.created_at.desc()))
            .scalars()
            .all()
        )
