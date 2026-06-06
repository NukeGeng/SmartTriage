from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.api.v1.endpoints import tickets as ticket_endpoints
from app.main import app
from app.services.ticket_service import TicketService


class FakeAIClient:
    def analyze_ticket(self, **kwargs: Any) -> dict[str, Any]:
        return {
            "category": "account_system",
            "category_label": "Account / System",
            "confidence": 0.91,
            "priority": "high",
            "priority_score": 82,
            "suggested_department": "IT Department",
            "duplicate_candidates": [],
            "suggested_actions": [
                "Check student account status",
                "Reset password if needed",
            ],
            "model_version": "test-v1",
        }


@pytest.fixture
def client_with_fake_ai(client: TestClient):
    app.dependency_overrides[ticket_endpoints.get_ticket_service] = lambda: TicketService(
        ai_client=FakeAIClient(),
    )
    yield client
    app.dependency_overrides.pop(ticket_endpoints.get_ticket_service, None)


def _register_and_login(
    client: TestClient,
    email: str,
    role: str = "student",
    department: str | None = None,
) -> str:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Workflow User",
            "email": email,
            "password": "12345678",
            "role": role,
            "department": department,
        },
    )
    assert register_response.status_code == 201

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "12345678"},
    )
    assert login_response.status_code == 200
    return str(login_response.json()["data"]["access_token"])


def _auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _create_ticket(client: TestClient, token: str) -> dict:
    response = client.post(
        "/api/v1/tickets",
        headers=_auth_headers(token),
        json={
            "title": "Cannot login to online exam system",
            "description": "Student cannot login before tomorrow online exam.",
        },
    )
    assert response.status_code == 201
    return response.json()["data"]


def test_create_ticket_requires_auth(client: TestClient) -> None:
    response = client.post(
        "/api/v1/tickets",
        json={
            "title": "Cannot login",
            "description": "Student cannot login before exam.",
        },
    )

    assert response.status_code == 401
    assert response.json()["success"] is False


def test_create_ticket_success(client_with_fake_ai: TestClient) -> None:
    token = _register_and_login(client_with_fake_ai, "ticket-create@example.com")

    ticket = _create_ticket(client_with_fake_ai, token)

    assert ticket["status"] == "open"
    assert ticket["assigned_department"] == "IT Department"
    assert ticket["analysis"]["predicted_category"] == "account_system"
    assert ticket["analysis"]["priority"] == "high"


def test_list_tickets_success(client_with_fake_ai: TestClient) -> None:
    token = _register_and_login(client_with_fake_ai, "ticket-list@example.com")
    created_ticket = _create_ticket(client_with_fake_ai, token)

    response = client_with_fake_ai.get("/api/v1/tickets", headers=_auth_headers(token))

    assert response.status_code == 200
    body = response.json()["data"]
    assert body["total"] == 1
    assert body["items"][0]["id"] == created_ticket["id"]


def test_get_ticket_detail_success(client_with_fake_ai: TestClient) -> None:
    token = _register_and_login(client_with_fake_ai, "ticket-detail@example.com")
    created_ticket = _create_ticket(client_with_fake_ai, token)

    response = client_with_fake_ai.get(
        f"/api/v1/tickets/{created_ticket['id']}",
        headers=_auth_headers(token),
    )

    assert response.status_code == 200
    ticket = response.json()["data"]
    assert ticket["id"] == created_ticket["id"]
    assert ticket["analysis"]["model_version"] == "test-v1"


def test_update_status_as_staff_success(client_with_fake_ai: TestClient) -> None:
    student_token = _register_and_login(client_with_fake_ai, "ticket-student@example.com")
    staff_token = _register_and_login(
        client_with_fake_ai,
        "ticket-staff@example.com",
        role="staff",
        department="IT Department",
    )
    created_ticket = _create_ticket(client_with_fake_ai, student_token)

    response = client_with_fake_ai.patch(
        f"/api/v1/tickets/{created_ticket['id']}/status",
        headers=_auth_headers(staff_token),
        json={"status": "in_progress"},
    )

    assert response.status_code == 200
    assert response.json()["data"]["status"] == "in_progress"
