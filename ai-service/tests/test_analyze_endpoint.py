from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_analyze_ticket_endpoint() -> None:
    response = client.post(
        "/api/v1/analyze-ticket",
        json={
            "ticket_id": "TCK-001",
            "title": "Không đăng nhập được hệ thống thi online",
            "description": "Em không đăng nhập được vào hệ thống thi online, sáng mai em có lịch thi.",
            "existing_tickets": [],
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    data = body["data"]
    assert {
        "category",
        "category_label",
        "confidence",
        "priority",
        "priority_score",
        "priority_breakdown",
        "suggested_department",
        "duplicate_candidates",
        "suggested_actions",
        "explanation",
        "model_version",
    }.issubset(data)
    assert data["category"] == "account_system"
    assert data["priority"] == "high"
    assert data["category_confidence"] == data["confidence"]
    assert data["priority_breakdown"]["total_score"] == data["priority_score"]
    assert data["explanation"]["detected_signals"]
    assert isinstance(data["suggested_actions"], list)


def test_model_info_endpoint_without_model_is_safe(tmp_path, monkeypatch) -> None:
    monkeypatch.setattr("app.api.v1.endpoints.model_info.settings.MODEL_DIR", str(tmp_path))

    response = client.get("/api/v1/model-info")

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["model_loaded"] is False
