import json
import sys
from datetime import UTC, datetime
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.config import settings
from app.ml.preprocessing import combine_title_description

MODEL_VERSION = "tfidf-logreg-v1"


def main() -> None:
    dataset_path = Path(settings.DATASET_PATH)
    model_dir = Path(settings.MODEL_DIR)
    model_dir.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(dataset_path)
    texts = [
        combine_title_description(row.title, row.description)
        for row in df.itertuples(index=False)
    ]
    labels = df["category"].to_numpy()

    label_encoder = LabelEncoder()
    encoded_labels = label_encoder.fit_transform(labels)
    x_train, x_test, y_train, y_test = train_test_split(
        texts,
        encoded_labels,
        test_size=0.2,
        random_state=42,
        stratify=encoded_labels,
    )

    # TF-IDF converts short Vietnamese support text into sparse lexical features.
    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), min_df=2, max_df=0.95)
    x_train_vectors = vectorizer.fit_transform(x_train)
    x_test_vectors = vectorizer.transform(x_test)

    # Logistic Regression is fast, explainable enough for a small labeled ticket dataset.
    model = LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42)
    model.fit(x_train_vectors, y_train)

    predictions = model.predict(x_test_vectors)
    accuracy = float(accuracy_score(y_test, predictions))
    macro_f1 = float(f1_score(y_test, predictions, average="macro"))

    joblib.dump(model, model_dir / "category_classifier.joblib")
    joblib.dump(vectorizer, model_dir / "tfidf_vectorizer.joblib")
    joblib.dump(label_encoder, model_dir / "label_encoder.joblib")

    metadata = {
        "model_version": MODEL_VERSION,
        "algorithm": "TF-IDF + Logistic Regression",
        "dataset_path": str(dataset_path),
        "accuracy": round(accuracy, 4),
        "macro_f1": round(macro_f1, 4),
        "categories": list(label_encoder.classes_),
        "created_at": datetime.now(UTC).isoformat(),
    }
    (model_dir / "model_metadata.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(json.dumps(metadata, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
