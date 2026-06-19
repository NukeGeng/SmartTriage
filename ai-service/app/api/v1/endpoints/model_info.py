import json
from pathlib import Path

from fastapi import APIRouter

from app.core.config import settings
from app.schemas.analyze import ModelInfoResponse
from app.schemas.common import ApiResponse

router = APIRouter(tags=["model"])


@router.get("/model-info", response_model=ApiResponse)
def model_info() -> ApiResponse:
    model_dir = Path(settings.MODEL_DIR)
    metadata_path = model_dir / "model_metadata.json"
    model_loaded = all(
        (model_dir / filename).exists()
        for filename in [
            "category_classifier.joblib",
            "tfidf_vectorizer.joblib",
            "label_encoder.joblib",
        ]
    )
    metadata: dict = {}
    if metadata_path.exists():
        metadata = json.loads(metadata_path.read_text(encoding="utf-8"))

    data = ModelInfoResponse(
        model_version=metadata.get("model_version"),
        algorithm=metadata.get("algorithm", "TF-IDF + Logistic Regression"),
        accuracy=metadata.get("accuracy"),
        macro_f1=metadata.get("macro_f1"),
        categories=metadata.get("categories", []),
        model_loaded=model_loaded,
        run_id=metadata.get("run_id"),
        dataset_version=metadata.get("dataset_version"),
        dataset_fingerprint=metadata.get("dataset_fingerprint"),
        sample_count=metadata.get("sample_count"),
        split_strategy=metadata.get("split_strategy"),
        synthetic_ratio=metadata.get("synthetic_ratio"),
    )
    return ApiResponse(success=True, message="Model information retrieved", data=data)
