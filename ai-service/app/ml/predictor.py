import json
import logging
from pathlib import Path
from typing import Any

import joblib
import numpy as np

from app.core.config import settings
from app.ml.category_metadata import CATEGORY_LABELS
from app.ml.preprocessing import combine_title_description

logger = logging.getLogger(__name__)


class CategoryPredictor:
    def __init__(self, model_dir: str | None = None) -> None:
        self.model_dir = Path(model_dir or settings.MODEL_DIR)
        self.model_version = "rule-based-fallback"
        self.model = None
        self.vectorizer = None
        self.label_encoder = None
        self.metadata: dict[str, Any] = {}
        self._load_artifacts()

    def predict(self, title: str, description: str) -> dict[str, Any]:
        text = combine_title_description(title, description)
        if self.model is None or self.vectorizer is None or self.label_encoder is None:
            category = self._fallback_category(text)
            return {
                "category": category,
                "category_label": CATEGORY_LABELS.get(category, CATEGORY_LABELS["other"]),
                "confidence": 0.55,
                "model_version": self.model_version,
            }

        vector = self.vectorizer.transform([text])
        encoded_prediction = self.model.predict(vector)[0]
        category = str(self.label_encoder.inverse_transform([encoded_prediction])[0])
        confidence = 0.75
        if hasattr(self.model, "predict_proba"):
            probabilities = self.model.predict_proba(vector)[0]
            confidence = float(np.max(probabilities))
        return {
            "category": category,
            "category_label": CATEGORY_LABELS.get(category, CATEGORY_LABELS["other"]),
            "confidence": round(confidence, 3),
            "model_version": self.model_version,
        }

    def _load_artifacts(self) -> None:
        try:
            model_path = self.model_dir / "category_classifier.joblib"
            vectorizer_path = self.model_dir / "tfidf_vectorizer.joblib"
            encoder_path = self.model_dir / "label_encoder.joblib"
            metadata_path = self.model_dir / "model_metadata.json"
            if not (model_path.exists() and vectorizer_path.exists() and encoder_path.exists()):
                logger.warning("Category model artifacts not found; using rule-based fallback")
                return
            self.model = joblib.load(model_path)
            self.vectorizer = joblib.load(vectorizer_path)
            self.label_encoder = joblib.load(encoder_path)
            if metadata_path.exists():
                self.metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
                self.model_version = self.metadata.get("model_version", "tfidf-logreg-v1")
            else:
                self.model_version = "tfidf-logreg-v1"
            logger.info("Loaded category predictor model from %s", self.model_dir)
        except Exception as exc:
            logger.exception("Failed to load category model artifacts: %s", exc)
            self.model = None
            self.vectorizer = None
            self.label_encoder = None
            self.model_version = "rule-based-fallback"

    @staticmethod
    def _fallback_category(text: str) -> str:
        rules = [
            ("network", ["wifi", "mạng", "internet", "kết nối"]),
            ("account_system", ["đăng nhập", "mật khẩu", "tài khoản", "không truy cập"]),
            ("classroom_device", ["máy chiếu", "loa", "hdmi", "micro"]),
            ("learning_platform", ["moodle", "lms", "học trực tuyến", "bài tập online"]),
            ("schedule_exam", ["lịch thi", "lịch học", "phòng thi", "ca thi"]),
            ("tuition_payment", ["học phí", "thanh toán", "biên lai", "chuyển khoản"]),
            ("document_profile", ["giấy xác nhận", "bảng điểm", "hồ sơ", "giấy tờ"]),
            ("facility", ["đèn", "bàn ghế", "máy lạnh", "nhà vệ sinh"]),
            ("feedback", ["góp ý", "đề xuất", "cải thiện", "phản hồi"]),
        ]
        for category, keywords in rules:
            if any(keyword in text for keyword in keywords):
                return category
        return "other"
