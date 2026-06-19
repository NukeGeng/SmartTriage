import hashlib
import json
import random
import shutil
from collections import Counter
from datetime import UTC, datetime
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    precision_recall_fscore_support,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from app.ml.training_data import load_training_dataset

ARTIFACT_NAMES = (
    "category_classifier.joblib",
    "tfidf_vectorizer.joblib",
    "label_encoder.joblib",
    "model_metadata.json",
)


def split_training_frame(
    frame: pd.DataFrame,
    test_size: float = 0.2,
    random_state: int = 42,
) -> tuple[pd.DataFrame, pd.DataFrame, str]:
    if "scenario_group" in frame.columns:
        group_counts = frame.groupby("category")["scenario_group"].nunique()
        if not group_counts.empty and int(group_counts.min()) >= 2:
            rng = random.Random(random_state)
            test_groups: set[str] = set()
            for _, category_frame in frame.groupby("category"):
                groups = sorted(category_frame["scenario_group"].astype(str).unique())
                rng.shuffle(groups)
                test_count = max(1, round(len(groups) * test_size))
                test_groups.update(groups[:test_count])
            test_mask = frame["scenario_group"].astype(str).isin(test_groups)
            return frame[~test_mask].copy(), frame[test_mask].copy(), "stratified_scenario_group"

    train_indices, test_indices = train_test_split(
        frame.index,
        test_size=test_size,
        random_state=random_state,
        stratify=frame["category"],
    )
    return frame.loc[train_indices].copy(), frame.loc[test_indices].copy(), "stratified_random"


def train_category_model(
    dataset_path: str | Path,
    output_dir: str | Path,
    dataset_version: str,
    run_id: str,
    random_state: int = 42,
) -> dict[str, object]:
    frame, fingerprint = load_training_dataset(dataset_path)
    train_frame, test_frame, split_strategy = split_training_frame(frame, random_state=random_state)

    label_encoder = LabelEncoder()
    label_encoder.fit(frame["category"])
    y_train = label_encoder.transform(train_frame["category"])
    y_test = label_encoder.transform(test_frame["category"])

    vectorizer = TfidfVectorizer(
        max_features=20_000,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.97,
        sublinear_tf=True,
    )
    x_train = vectorizer.fit_transform(train_frame["text"])
    x_test = vectorizer.transform(test_frame["text"])
    model = LogisticRegression(max_iter=1500, class_weight="balanced", random_state=random_state)
    model.fit(x_train, y_train)

    predictions = model.predict(x_test)
    precision, recall, macro_f1, _ = precision_recall_fscore_support(
        y_test,
        predictions,
        average="macro",
        zero_division=0,
    )
    accuracy = accuracy_score(y_test, predictions)
    run_suffix = hashlib.sha256(run_id.encode("utf-8")).hexdigest()[:8]
    label_sources = (
        Counter(frame["label_source"].fillna("unknown").astype(str))
        if "label_source" in frame.columns
        else Counter({"legacy_unknown": len(frame)})
    )
    synthetic_count = sum(count for source, count in label_sources.items() if "synthetic" in source)
    model_version = f"tfidf-logreg-{dataset_version}-{run_suffix}"
    metadata: dict[str, object] = {
        "run_id": run_id,
        "model_version": model_version,
        "algorithm": "TF-IDF + Logistic Regression",
        "dataset_version": dataset_version,
        "dataset_path": str(dataset_path),
        "dataset_fingerprint": fingerprint,
        "sample_count": int(len(frame)),
        "train_count": int(len(train_frame)),
        "test_count": int(len(test_frame)),
        "split_strategy": split_strategy,
        "evaluation_scope": "internal_holdout",
        "category_distribution": dict(Counter(frame["category"])),
        "label_source_distribution": dict(label_sources),
        "synthetic_ratio": round(synthetic_count / len(frame), 4),
        "accuracy": round(float(accuracy), 4),
        "macro_precision": round(float(precision), 4),
        "macro_recall": round(float(recall), 4),
        "macro_f1": round(float(macro_f1), 4),
        "categories": list(label_encoder.classes_),
        "created_at": datetime.now(UTC).isoformat(),
    }

    target = Path(output_dir)
    target.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, target / "category_classifier.joblib")
    joblib.dump(vectorizer, target / "tfidf_vectorizer.joblib")
    joblib.dump(label_encoder, target / "label_encoder.joblib")
    (target / "model_metadata.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    report = classification_report(
        y_test,
        predictions,
        labels=range(len(label_encoder.classes_)),
        target_names=list(label_encoder.classes_),
        zero_division=0,
    )
    (target / "classification_report.txt").write_text(report, encoding="utf-8")
    matrix = confusion_matrix(y_test, predictions, labels=range(len(label_encoder.classes_)))
    pd.DataFrame(matrix, index=label_encoder.classes_, columns=label_encoder.classes_).to_csv(
        target / "confusion_matrix.csv",
        encoding="utf-8",
    )
    return metadata


def promote_training_run(run_dir: str | Path, model_dir: str | Path) -> dict[str, object]:
    source = Path(run_dir)
    target = Path(model_dir)
    target.mkdir(parents=True, exist_ok=True)
    for artifact_name in ARTIFACT_NAMES:
        shutil.copy2(source / artifact_name, target / artifact_name)

    metadata = json.loads((source / "model_metadata.json").read_text(encoding="utf-8"))
    marker = {
        "run_id": metadata["run_id"],
        "model_version": metadata["model_version"],
        "dataset_version": metadata["dataset_version"],
        "dataset_fingerprint": metadata["dataset_fingerprint"],
        "promoted_at": datetime.now(UTC).isoformat(),
    }
    (target / "current_model.json").write_text(
        json.dumps(marker, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return marker
