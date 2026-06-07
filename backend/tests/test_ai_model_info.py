from fastapi.testclient import TestClient

from app.api.v1.endpoints import ai as ai_endpoints
from app.main import app


class FakeAIClient:
    def get_model_info(self) -> dict:
        return {
            "model_version": "tfidf-logreg-v1",
            "algorithm": "TF-IDF + Logistic Regression",
            "accuracy": 0.95,
            "macro_f1": 0.94,
            "categories": ["account_system", "network"],
            "model_loaded": True,
        }


def _admin_token(client: TestClient) -> str:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Model Admin",
            "email": "model-admin@example.com",
            "password": "12345678",
            "role": "admin",
            "department": None,
        },
    )
    assert register_response.status_code == 201
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "model-admin@example.com", "password": "12345678"},
    )
    assert login_response.status_code == 200
    return str(login_response.json()["data"]["access_token"])


def test_model_info_proxy_success(client: TestClient) -> None:
    app.dependency_overrides[ai_endpoints.get_ai_client] = lambda: FakeAIClient()
    token = _admin_token(client)

    try:
        response = client.get(
            "/api/v1/ai/model-info",
            headers={"Authorization": f"Bearer {token}"},
        )
    finally:
        app.dependency_overrides.pop(ai_endpoints.get_ai_client, None)

    assert response.status_code == 200
    data = response.json()["data"]
    assert data["model_loaded"] is True
    assert data["categories"] == ["account_system", "network"]
