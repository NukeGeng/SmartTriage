import logging

from app.ml.action_recommender import recommend_actions
from app.ml.category_metadata import CATEGORY_LABELS
from app.ml.department_recommender import recommend_department
from app.ml.duplicate_detector import DuplicateDetector
from app.ml.predictor import CategoryPredictor
from app.ml.priority_scorer import score_priority
from app.schemas.analyze import AnalyzeTicketRequest, AnalyzeTicketResponse, DuplicateCandidate

logger = logging.getLogger(__name__)


class AnalysisService:
    def __init__(
        self,
        predictor: CategoryPredictor | None = None,
        duplicate_detector: DuplicateDetector | None = None,
    ) -> None:
        self.predictor = predictor or CategoryPredictor()
        self.duplicate_detector = duplicate_detector or DuplicateDetector()

    def analyze(self, payload: AnalyzeTicketRequest) -> AnalyzeTicketResponse:
        try:
            prediction = self.predictor.predict(payload.title, payload.description)
        except Exception as exc:
            logger.exception("Category prediction failed for ticket %s: %s", payload.ticket_id, exc)
            prediction = {
                "category": "other",
                "category_label": CATEGORY_LABELS["other"],
                "confidence": 0.0,
                "model_version": "fallback-error",
            }

        category = prediction["category"]
        priority_result = score_priority(payload.title, payload.description, category)
        priority = priority_result["priority"]
        department = recommend_department(category, priority)

        try:
            duplicate_candidates = self.duplicate_detector.find_duplicates(
                ticket_id=payload.ticket_id,
                title=payload.title,
                description=payload.description,
                existing_tickets=[ticket.model_dump() for ticket in payload.open_tickets]
                if payload.open_tickets
                else None,
            )
        except Exception as exc:
            logger.exception("Duplicate detection failed for ticket %s: %s", payload.ticket_id, exc)
            duplicate_candidates = []

        actions = recommend_actions(category, priority, payload.title, payload.description)
        return AnalyzeTicketResponse(
            category=category,
            category_label=prediction.get("category_label", CATEGORY_LABELS.get(category, CATEGORY_LABELS["other"])),
            confidence=prediction.get("confidence", 0.0),
            priority=priority,
            priority_score=priority_result["priority_score"],
            suggested_department=department,
            duplicate_candidates=[
                DuplicateCandidate(**candidate) for candidate in duplicate_candidates
            ],
            suggested_actions=actions,
            model_version=prediction.get("model_version", "unknown"),
        )
