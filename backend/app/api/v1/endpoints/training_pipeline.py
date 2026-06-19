import csv
from io import StringIO
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.db.session import get_db
from app.models.training_pipeline import TrainingReviewStatus
from app.models.user import User
from app.repositories.training_pipeline_repository import TrainingPipelineRepository
from app.schemas.common import ApiResponse
from app.schemas.training_pipeline import (
    DatasetVersionCreateRequest,
    DatasetVersionResponse,
    TrainingSampleResponse,
    TrainingSampleUpdateRequest,
)
from app.services.training_pipeline_service import TrainingPipelineService

router = APIRouter(prefix="/admin/training-pipeline", tags=["training-pipeline"])


def get_training_pipeline_service() -> TrainingPipelineService:
    return TrainingPipelineService()


@router.post("/sync", response_model=ApiResponse)
def sync_resolved_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    service: TrainingPipelineService = Depends(get_training_pipeline_service),
) -> ApiResponse:
    result = service.sync_resolved_tickets(db, current_user)
    return ApiResponse(success=True, message="Resolved tickets synchronized", data=result)


@router.get("/summary", response_model=ApiResponse)
def training_pipeline_summary(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> ApiResponse:
    counts = TrainingPipelineRepository.status_counts(db)
    versions = TrainingPipelineRepository.list_dataset_versions(db)
    return ApiResponse(
        success=True,
        message="Training pipeline summary retrieved",
        data={
            "samples": {
                "candidate": counts.get("candidate", 0),
                "approved": counts.get("approved", 0),
                "excluded": counts.get("excluded", 0),
            },
            "dataset_versions": len(versions),
        },
    )


@router.get("/samples", response_model=ApiResponse)
def list_training_samples(
    review_status: TrainingReviewStatus | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=30, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
    service: TrainingPipelineService = Depends(get_training_pipeline_service),
) -> ApiResponse:
    result = service.list_samples(db, review_status, page, page_size)
    result["items"] = [TrainingSampleResponse.model_validate(item).model_dump(mode="json") for item in result["items"]]
    return ApiResponse(success=True, message="Training samples retrieved", data=result)


@router.patch("/samples/{sample_id}", response_model=ApiResponse)
def update_training_sample(
    sample_id: UUID,
    payload: TrainingSampleUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    service: TrainingPipelineService = Depends(get_training_pipeline_service),
) -> ApiResponse:
    sample = service.update_sample(db, sample_id, payload, current_user)
    return ApiResponse(
        success=True,
        message="Training sample updated",
        data=TrainingSampleResponse.model_validate(sample).model_dump(mode="json"),
    )


@router.post("/datasets", response_model=ApiResponse)
def create_dataset_version(
    payload: DatasetVersionCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    service: TrainingPipelineService = Depends(get_training_pipeline_service),
) -> ApiResponse:
    dataset = service.create_dataset_version(db, payload, current_user)
    return ApiResponse(
        success=True,
        message="Dataset version created",
        data=DatasetVersionResponse.model_validate(dataset).model_dump(mode="json"),
    )


@router.get("/datasets", response_model=ApiResponse)
def list_dataset_versions(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> ApiResponse:
    datasets = TrainingPipelineRepository.list_dataset_versions(db)
    data = [DatasetVersionResponse.model_validate(item).model_dump(mode="json") for item in datasets]
    return ApiResponse(success=True, message="Dataset versions retrieved", data=data)


@router.get("/datasets/{dataset_id}/export")
def export_dataset_version(
    dataset_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> StreamingResponse:
    dataset = TrainingPipelineRepository.get_dataset_version(db, dataset_id)
    if dataset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset version not found")

    fieldnames = [
        "sample_id",
        "source_ticket_id",
        "title",
        "description",
        "category",
        "priority",
        "label_source",
        "review_status",
        "is_anonymized",
        "dataset_version",
        "scenario_group",
        "created_at",
    ]
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(TrainingPipelineService.export_rows(dataset))
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f"attachment; filename={dataset.version}.csv"},
    )
