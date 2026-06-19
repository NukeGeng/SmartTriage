from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.training_pipeline import DatasetVersionStatus, TrainingReviewStatus


class TrainingSampleUpdateRequest(BaseModel):
    category: str | None = Field(default=None, min_length=2, max_length=100)
    priority: str | None = Field(default=None, max_length=50)
    review_status: TrainingReviewStatus


class DatasetVersionCreateRequest(BaseModel):
    version: str | None = Field(default=None, min_length=3, max_length=100, pattern=r"^[a-zA-Z0-9._-]+$")
    minimum_samples: int = Field(default=1, ge=1, le=1_000_000)


class TrainingSampleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    source_ticket_id: UUID | None
    dataset_version_id: UUID | None
    title: str
    description: str
    category: str
    priority: str | None
    label_source: str
    review_status: TrainingReviewStatus
    is_anonymized: bool
    approved_by_id: UUID | None
    approved_at: datetime | None
    created_at: datetime


class DatasetVersionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    version: str
    status: DatasetVersionStatus
    sample_count: int
    category_distribution: dict[str, int]
    created_by_id: UUID
    created_at: datetime
