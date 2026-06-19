import argparse
import json
import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, precision_recall_fscore_support

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.config import settings
from app.ml.training_data import load_training_dataset


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evaluate a SmartTriage model against an external dataset")
    parser.add_argument("--dataset-path", default=settings.DATASET_PATH)
    parser.add_argument("--model-dir", default=settings.MODEL_DIR)
    parser.add_argument("--report-dir", default="reports")
    parser.add_argument("--report-name", default="external-evaluation")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    model_dir = Path(args.model_dir)
    report_dir = Path(args.report_dir)
    report_dir.mkdir(parents=True, exist_ok=True)

    model = joblib.load(model_dir / "category_classifier.joblib")
    vectorizer = joblib.load(model_dir / "tfidf_vectorizer.joblib")
    label_encoder = joblib.load(model_dir / "label_encoder.joblib")
    frame, dataset_fingerprint = load_training_dataset(args.dataset_path)
    y_true = label_encoder.transform(frame["category"])
    predictions = model.predict(vectorizer.transform(frame["text"]))
    precision, recall, macro_f1, _ = precision_recall_fscore_support(
        y_true,
        predictions,
        average="macro",
        zero_division=0,
    )
    summary = {
        "evaluation_scope": "external_dataset",
        "dataset_path": str(args.dataset_path),
        "dataset_fingerprint": dataset_fingerprint,
        "sample_count": int(len(frame)),
        "accuracy": round(float(accuracy_score(y_true, predictions)), 4),
        "macro_precision": round(float(precision), 4),
        "macro_recall": round(float(recall), 4),
        "macro_f1": round(float(macro_f1), 4),
    }
    target_names = list(label_encoder.classes_)
    report = classification_report(y_true, predictions, target_names=target_names, zero_division=0)
    (report_dir / f"{args.report_name}.txt").write_text(
        f"{json.dumps(summary, ensure_ascii=False, indent=2)}\n\n{report}",
        encoding="utf-8",
    )
    matrix = confusion_matrix(y_true, predictions)
    pd.DataFrame(matrix, index=target_names, columns=target_names).to_csv(
        report_dir / f"{args.report_name}-confusion-matrix.csv",
        encoding="utf-8",
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
