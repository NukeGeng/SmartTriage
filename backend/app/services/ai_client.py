import logging
from typing import Any

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class AIServiceClient:
    def __init__(self, base_url: str | None = None, timeout_seconds: float = 5.0) -> None:
        self.base_url = (base_url or settings.AI_SERVICE_URL).rstrip("/")
        self.timeout_seconds = timeout_seconds

    def health_check(self) -> bool:
        try:
            with httpx.Client(timeout=self.timeout_seconds) as client:
                response = client.get(f"{self.base_url}/api/v1/health")
                response.raise_for_status()
                return True
        except httpx.HTTPError as exc:
            logger.warning("AI service health check failed: %s", exc)
            return False

    def analyze_ticket(
        self,
        ticket_id: str,
        title: str,
        description: str,
        created_by_role: str = "student",
        open_tickets: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any] | None:
        payload = {
            "ticket_id": ticket_id,
            "title": title,
            "description": description,
            "created_by_role": created_by_role,
            "open_tickets": open_tickets or [],
        }
        try:
            with httpx.Client(timeout=self.timeout_seconds) as client:
                response = client.post(f"{self.base_url}/api/v1/analyze-ticket", json=payload)
                response.raise_for_status()
                data = response.json()
                if isinstance(data, dict) and "data" in data and "category" not in data:
                    return data["data"]
                return data
        except httpx.HTTPError as exc:
            logger.exception("AI analysis request failed for ticket %s: %s", ticket_id, exc)
            return None
