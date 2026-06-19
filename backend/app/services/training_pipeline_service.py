import hashlib
import re
from collections import Counter
from datetime import UTC, datetime
from typing import Any
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.training_pipeline import DatasetVersion, TrainingReviewStatus, TrainingSample
from app.models.user import User
from app.repositories.training_pipeline_repository import TrainingPipelineRepository
from app.schemas.training_pipeline import DatasetVersionCreateRequest, TrainingSampleUpdateRequest


class TrainingPipelineService:
    EMAIL_PATTERN = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE)
    PHONE_PATTERN = re.compile(r"(?<!\d)(?:\+?84|0)(?:[ .-]?\d){9,10}(?!\d)")
    STUDENT_ID_PATTERN = re.compile(r"\b(?:mssv|msv|sv)\s*[:#-]?\s*[a-z]?\d{6,12}\b|\b\d{8,12}\b", re.IGNORECASE)
    URL_PATTERN = re.compile(r"https?://\S+|www\.\S+", re.IGNORECASE)

    def sync_resolved_tickets(self, db: Session, current_user: User) -> dict[str, int]:
        created = 0
        skipped = 0
        for ticket in TrainingPipelineRepository.list_resolved_tickets(db):
            if TrainingPipelineRepository.get_sample_by_source_ticket(db, ticket.id):
                skipped += 1
                continue

            analysis = ticket.analysis
            category = ticket.manual_category or (analysis.predicted_category if analysis else None)
            if not category:
                skipped += 1
                continue

            title = self.anonymize(ticket.title)
            description = self.anonymize(ticket.description)
            content_hash = self.content_hash(title, description)
            if TrainingPipelineRepository.get_sample_by_hash(db, content_hash):
                skipped += 1
                continue

            has_manual_label = bool(ticket.manual_category)
            now = datetime.now(UTC) if has_manual_label else None
            sample = TrainingSample(
                source_ticket_id=ticket.id,
                title=title,
                description=description,
                category=category,
                priority=ticket.manual_priority or (analysis.priority if analysis else None),
                label_source="manual" if has_manual_label else "predicted_candidate",
                review_status=(
                    TrainingReviewStatus.APPROVED if has_manual_label else TrainingReviewStatus.CANDIDATE
                ),
                is_anonymized=True,
                content_hash=content_hash,
                approved_by_id=current_user.id if has_manual_label else None,
                approved_at=now,
            )
            TrainingPipelineRepository.add_sample(db, sample)
            created += 1
        return {"created": created, "skipped": skipped}

    def list_samples(
        self,
        db: Session,
        review_status: TrainingReviewStatus | None,
        page: int,
        page_size: int,
    ) -> dict[str, Any]:
        items, total = TrainingPipelineRepository.list_samples(db, review_status, page, page_size)
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    def update_sample(
        self,
        db: Session,
        sample_id: UUID,
        payload: TrainingSampleUpdateRequest,
        current_user: User,
    ) -> TrainingSample:
        sample = TrainingPipelineRepository.get_sample_by_id(db, sample_id)
        if sample is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Training sample not found")
        if sample.dataset_version_id is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Versioned samples are immutable")

        if payload.category is not None:
            sample.category = payload.category
            sample.label_source = "manual"
        if payload.priority is not None:
            sample.priority = payload.priority
        sample.review_status = payload.review_status
        if payload.review_status == TrainingReviewStatus.APPROVED:
            if sample.label_source == "predicted_candidate":
                sample.label_source = "manual_review"
            sample.approved_by_id = current_user.id
            sample.approved_at = datetime.now(UTC)
        else:
            sample.approved_by_id = None
            sample.approved_at = None
        return TrainingPipelineRepository.save_sample(db, sample)

    def create_dataset_version(
        self,
        db: Session,
        payload: DatasetVersionCreateRequest,
        current_user: User,
    ) -> DatasetVersion:
        samples = TrainingPipelineRepository.list_unversioned_approved(db)
        if len(samples) < payload.minimum_samples:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Need at least {payload.minimum_samples} approved samples; found {len(samples)}",
            )
        version = payload.version or datetime.now(UTC).strftime("dataset-%Y%m%d-%H%M%S")
        distribution = dict(Counter(sample.category for sample in samples))
        dataset = DatasetVersion(
            version=version,
            sample_count=len(samples),
            category_distribution=distribution,
            created_by_id=current_user.id,
        )
        return TrainingPipelineRepository.create_dataset_version(db, dataset, samples)

    @staticmethod
    def export_rows(dataset: DatasetVersion) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        for sample in dataset.samples:
            source_reference = f"PROD-{sample.content_hash[:16]}"
            rows.append(
                {
                    "sample_id": str(sample.id),
                    "source_ticket_id": source_reference,
                    "title": sample.title,
                    "description": sample.description,
                    "category": sample.category,
                    "priority": sample.priority or "",
                    "label_source": sample.label_source,
                    "review_status": sample.review_status.value,
                    "is_anonymized": str(sample.is_anonymized).lower(),
                    "dataset_version": dataset.version,
                    "scenario_group": f"production-{sample.content_hash[:16]}",
                    "created_at": sample.created_at.isoformat(),
                }
            )
        return rows

    @staticmethod
    def anonymize(value: str) -> str:
        text = TrainingPipelineService.EMAIL_PATTERN.sub("[EMAIL]", value)
        text = TrainingPipelineService.PHONE_PATTERN.sub("[SO_DIEN_THOAI]", text)
        text = TrainingPipelineService.STUDENT_ID_PATTERN.sub("[MA_SINH_VIEN]", text)
        return TrainingPipelineService.URL_PATTERN.sub("[URL]", text)

    @staticmethod
    def content_hash(title: str, description: str) -> str:
        normalized = " ".join(f"{title} {description}".lower().split())
        return hashlib.sha256(normalized.encode("utf-8")).hexdigest()
