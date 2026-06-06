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
            "open_tickets": [],
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["category"] == "account_system"
    assert body["data"]["priority"] == "high"


def test_model_info_endpoint_without_model_is_safe(tmp_path, monkeypatch) -> None:
    monkeypatch.setattr("app.api.v1.endpoints.model_info.settings.MODEL_DIR", str(tmp_path))

    response = client.get("/api/v1/model-info")

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["model_loaded"] is False
