import httpx

from app.services.ai_client import AIServiceClient


def test_ai_client_sends_existing_tickets(monkeypatch) -> None:
    captured_payload = {}

    class FakeResponse:
        def raise_for_status(self) -> None:
            return None

        def json(self) -> dict:
            return {
                "success": True,
                "data": {
                    "category": "account_system",
                    "confidence": 0.91,
                },
            }

    class FakeHttpClient:
        def __init__(self, timeout: float) -> None:
            self.timeout = timeout

        def __enter__(self) -> "FakeHttpClient":
            return self

        def __exit__(self, *args) -> None:
            return None

        def post(self, url: str, json: dict) -> FakeResponse:
            captured_payload["url"] = url
            captured_payload["json"] = json
            return FakeResponse()

    monkeypatch.setattr("app.services.ai_client.httpx.Client", FakeHttpClient)

    result = AIServiceClient(base_url="http://ai-service:8001").analyze_ticket(
        ticket_id="TCK-001",
        title="Cannot login to exam system",
        description="Student cannot login before an online exam.",
        created_by_role="student",
        existing_tickets=[
            {
                "ticket_id": "TCK-OLD",
                "title": "Exam login error",
                "description": "Login fails before online exam.",
            }
        ],
    )

    assert captured_payload["url"] == "http://ai-service:8001/api/v1/analyze-ticket"
    assert "existing_tickets" in captured_payload["json"]
    assert "open_tickets" not in captured_payload["json"]
    assert captured_payload["json"]["existing_tickets"][0]["ticket_id"] == "TCK-OLD"
    assert result == {"category": "account_system", "confidence": 0.91}


def test_ai_client_returns_none_when_ai_service_fails(monkeypatch) -> None:
    class FakeHttpClient:
        def __init__(self, timeout: float) -> None:
            self.timeout = timeout

        def __enter__(self) -> "FakeHttpClient":
            return self

        def __exit__(self, *args) -> None:
            return None

        def post(self, url: str, json: dict) -> None:
            raise httpx.ConnectError("connection failed")

    monkeypatch.setattr("app.services.ai_client.httpx.Client", FakeHttpClient)

    result = AIServiceClient(base_url="http://ai-service:8001").analyze_ticket(
        ticket_id="TCK-001",
        title="Cannot login to exam system",
        description="Student cannot login before an online exam.",
    )

    assert result is None


def test_ai_client_get_model_info_unwraps_api_response(monkeypatch) -> None:
    class FakeResponse:
        def raise_for_status(self) -> None:
            return None

        def json(self) -> dict:
            return {
                "success": True,
                "data": {
                    "model_version": "tfidf-logreg-v1",
                    "algorithm": "TF-IDF + Logistic Regression",
                    "accuracy": 0.95,
                    "macro_f1": 0.94,
                    "categories": ["account_system"],
                    "model_loaded": True,
                },
            }

    class FakeHttpClient:
        def __init__(self, timeout: float) -> None:
            self.timeout = timeout

        def __enter__(self) -> "FakeHttpClient":
            return self

        def __exit__(self, *args) -> None:
            return None

        def get(self, url: str) -> FakeResponse:
            assert url == "http://ai-service:8001/api/v1/model-info"
            return FakeResponse()

    monkeypatch.setattr("app.services.ai_client.httpx.Client", FakeHttpClient)

    result = AIServiceClient(base_url="http://ai-service:8001").get_model_info()

    assert result["model_loaded"] is True
    assert result["algorithm"] == "TF-IDF + Logistic Regression"


def test_ai_client_get_model_info_returns_safe_fallback(monkeypatch) -> None:
    class FakeHttpClient:
        def __init__(self, timeout: float) -> None:
            self.timeout = timeout

        def __enter__(self) -> "FakeHttpClient":
            return self

        def __exit__(self, *args) -> None:
            return None

        def get(self, url: str) -> None:
            raise httpx.ConnectError("connection failed")

    monkeypatch.setattr("app.services.ai_client.httpx.Client", FakeHttpClient)

    result = AIServiceClient(base_url="http://ai-service:8001").get_model_info()

    assert result["model_loaded"] is False
    assert result["algorithm"] == "unavailable"
