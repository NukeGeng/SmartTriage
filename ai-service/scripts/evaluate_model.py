import json
import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, precision_recall_fscore_support
from sklearn.model_selection import train_test_split

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.config import settings
from app.ml.preprocessing import combine_title_description

REPORT_DIR = Path("reports")


def main() -> None:
    model_dir = Path(settings.MODEL_DIR)
    dataset_path = Path(settings.DATASET_PATH)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    model = joblib.load(model_dir / "category_classifier.joblib")
    vectorizer = joblib.load(model_dir / "tfidf_vectorizer.joblib")
    label_encoder = joblib.load(model_dir / "label_encoder.joblib")

    df = pd.read_csv(dataset_path)
    texts = [
        combine_title_description(row.title, row.description)
        for row in df.itertuples(index=False)
    ]
    y = label_encoder.transform(df["category"])
    _, x_test, _, y_test = train_test_split(
        texts,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    predictions = model.predict(vectorizer.transform(x_test))
    target_names = list(label_encoder.classes_)
    report = classification_report(y_test, predictions, target_names=target_names)
    precision, recall, macro_f1, _ = precision_recall_fscore_support(
        y_test,
        predictions,
        average="macro",
        zero_division=0,
    )
    accuracy = accuracy_score(y_test, predictions)
    summary = {
        "accuracy": round(float(accuracy), 4),
        "macro_precision": round(float(precision), 4),
        "macro_recall": round(float(recall), 4),
        "macro_f1": round(float(macro_f1), 4),
    }

    report_text = f"Summary metrics:\n{json.dumps(summary, ensure_ascii=False, indent=2)}\n\n{report}"
    (REPORT_DIR / "category_classification_report.txt").write_text(report_text, encoding="utf-8")

    matrix = confusion_matrix(y_test, predictions)
    matrix_df = pd.DataFrame(matrix, index=target_names, columns=target_names)
    matrix_df.to_csv(REPORT_DIR / "category_confusion_matrix.csv", encoding="utf-8")
    print(report_text)


if __name__ == "__main__":
    main()
