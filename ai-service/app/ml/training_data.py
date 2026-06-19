import hashlib
from pathlib import Path

import pandas as pd

from app.ml.category_metadata import CATEGORIES
from app.ml.preprocessing import combine_title_description

REQUIRED_COLUMNS = {"title", "description", "category"}


def load_training_dataset(dataset_path: str | Path) -> tuple[pd.DataFrame, str]:
    path = Path(dataset_path)
    if not path.exists():
        raise FileNotFoundError(f"Training dataset not found: {path}")

    frame = pd.read_csv(path)
    missing = REQUIRED_COLUMNS.difference(frame.columns)
    if missing:
        raise ValueError(f"Training dataset is missing columns: {sorted(missing)}")

    if "review_status" in frame.columns:
        frame = frame[frame["review_status"].fillna("").astype(str).str.lower() == "approved"]
    if "is_anonymized" in frame.columns:
        anonymized = frame["is_anonymized"].fillna(False).astype(str).str.lower()
        frame = frame[anonymized.isin({"true", "1", "yes"})]

    frame = frame.dropna(subset=["title", "description", "category"]).copy()
    for column in ("title", "description", "category"):
        frame[column] = frame[column].astype(str).str.strip()
    frame = frame[(frame["title"] != "") & (frame["description"] != "")]

    invalid_categories = sorted(set(frame["category"]) - set(CATEGORIES))
    if invalid_categories:
        raise ValueError(f"Unknown training categories: {invalid_categories}")

    frame["text"] = [
        combine_title_description(row.title, row.description)
        for row in frame.itertuples(index=False)
    ]
    frame = frame[frame["text"] != ""].drop_duplicates(subset=["text"], keep="first")
    frame = frame.reset_index(drop=True)
    if frame.empty:
        raise ValueError("Training dataset has no approved, anonymized, valid samples")

    fingerprint_frame = frame[["title", "description", "category"]].sort_values(
        ["category", "title", "description"]
    )
    fingerprint_csv = fingerprint_frame.to_csv(index=False, lineterminator="\n")
    fingerprint = hashlib.sha256(fingerprint_csv.encode("utf-8")).hexdigest()
    return frame, fingerprint
