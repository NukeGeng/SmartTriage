from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_root_endpoint() -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "SmartTriage Backend API",
        "data": {"service": "backend", "status": "ok"},
    }


def test_health_endpoint() -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "Backend service is healthy",
        "data": {"service": "backend", "status": "ok"},
    }
