import json

import pandas as pd

from app.ml.category_metadata import CATEGORIES
from app.ml.training_data import load_training_dataset
from app.ml.training_pipeline import promote_training_run, train_category_model


def test_training_data_loader_filters_unapproved_and_duplicates(tmp_path) -> None:
    dataset_path = tmp_path / "training.csv"
    pd.DataFrame(
        [
            {
                "title": "Wifi phòng B305 yếu",
                "description": "Cả lớp không truy cập được tài liệu.",
                "category": "network",
                "review_status": "approved",
                "is_anonymized": "true",
            },
            {
                "title": "Wifi phòng B305 yếu",
                "description": "Cả lớp không truy cập được tài liệu.",
                "category": "network",
                "review_status": "approved",
                "is_anonymized": "true",
            },
            {
                "title": "Dự đoán chưa duyệt",
                "description": "Không được dùng để train.",
                "category": "other",
                "review_status": "candidate",
                "is_anonymized": "true",
            },
        ]
    ).to_csv(dataset_path, index=False)

    frame, fingerprint = load_training_dataset(dataset_path)

    assert len(frame) == 1
    assert frame.iloc[0]["category"] == "network"
    assert len(fingerprint) == 64


def test_versioned_training_run_writes_artifacts(tmp_path) -> None:
    dataset_path = tmp_path / "training.csv"
    rows = []
    for category in CATEGORIES:
        for group in range(5):
            for variant in range(4):
                rows.append(
                    {
                        "title": f"{category} tình huống {group} biến thể {variant}",
                        "description": f"Nội dung thực tế của nhóm {category}, trường hợp {group}, lần {variant}.",
                        "category": category,
                        "priority": "medium",
                        "label_source": "curated_synthetic",
                        "review_status": "approved",
                        "is_anonymized": "true",
                        "scenario_group": f"{category}-{group}",
                    }
                )
    pd.DataFrame(rows).to_csv(dataset_path, index=False)
    run_dir = tmp_path / "models" / "runs" / "test-run"

    metadata = train_category_model(
        dataset_path=dataset_path,
        output_dir=run_dir,
        dataset_version="test-v1",
        run_id="test-run",
    )

    assert metadata["sample_count"] == 200
    assert metadata["dataset_version"] == "test-v1"
    assert metadata["split_strategy"] == "stratified_scenario_group"
    assert (run_dir / "category_classifier.joblib").exists()
    assert (run_dir / "tfidf_vectorizer.joblib").exists()
    assert (run_dir / "label_encoder.joblib").exists()
    saved_metadata = json.loads((run_dir / "model_metadata.json").read_text(encoding="utf-8"))
    assert saved_metadata["run_id"] == "test-run"
    assert len(saved_metadata["dataset_fingerprint"]) == 64

    model_dir = tmp_path / "models"
    marker = promote_training_run(run_dir, model_dir)

    assert marker["run_id"] == "test-run"
    saved_marker = json.loads((model_dir / "current_model.json").read_text(encoding="utf-8"))
    assert saved_marker["dataset_version"] == "test-v1"
