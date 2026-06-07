from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.api.v1.endpoints import tickets as ticket_endpoints
from app.main import app
from app.services.ticket_service import TicketService


class FakeIncidentAIClient:
    def analyze_ticket(self, **kwargs: Any) -> dict[str, Any]:
        return {
            "category": "network",
            "category_label": "Network",
            "confidence": 0.88,
            "priority": "medium",
            "priority_score": 58,
            "suggested_department": "IT Department",
            "duplicate_candidates": [],
            "suggested_actions": ["Check wifi access point"],
            "model_version": "test-v1",
        }


@pytest.fixture
def client_with_fake_ai(client: TestClient):
    app.dependency_overrides[ticket_endpoints.get_ticket_service] = lambda: TicketService(
        ai_client=FakeIncidentAIClient(),
    )
    yield client
    app.dependency_overrides.pop(ticket_endpoints.get_ticket_service, None)


def _register_and_login(client: TestClient, email: str, role: str = "student") -> str:
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Incident User",
            "email": email,
            "password": "12345678",
            "role": role,
            "department": "IT Department" if role == "staff" else None,
        },
    )
    assert response.status_code == 201
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "12345678"},
    )
    assert response.status_code == 200
    return str(response.json()["data"]["access_token"])


def _auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _create_ticket(client: TestClient, token: str, title: str) -> str:
    response = client.post(
        "/api/v1/tickets",
        headers=_auth_headers(token),
        json={
            "title": title,
            "description": "Wifi in building B is unstable during class.",
        },
    )
    assert response.status_code == 201
    return str(response.json()["data"]["id"])


def test_incident_group_workflow(client_with_fake_ai: TestClient) -> None:
    student_token = _register_and_login(client_with_fake_ai, "incident-student@example.com")
    admin_token = _register_and_login(client_with_fake_ai, "incident-admin@example.com", role="admin")
    ticket_one = _create_ticket(client_with_fake_ai, student_token, "Wifi room B305 is weak")
    ticket_two = _create_ticket(client_with_fake_ai, student_token, "Network in building B is unstable")

    response = client_with_fake_ai.post(
        "/api/v1/admin/incident-groups/from-suggestion",
        headers=_auth_headers(admin_token),
        json={
            "title": "Building B wifi incident",
            "category": "network",
            "priority": "medium",
            "suggested_department": "IT Department",
            "ticket_ids": [ticket_one],
            "similarity_scores": {ticket_one: 1.0},
        },
    )
    assert response.status_code == 200
    group = response.json()["data"]
    assert group["related_count"] == 1

    group_id = group["id"]
    response = client_with_fake_ai.post(
        f"/api/v1/admin/incident-groups/{group_id}/tickets/{ticket_two}",
        headers=_auth_headers(admin_token),
        json={"similarity_score": 0.79, "reason": "Same building network issue."},
    )
    assert response.status_code == 200
    assert response.json()["data"]["related_count"] == 2

    response = client_with_fake_ai.patch(
        f"/api/v1/admin/incident-groups/{group_id}/status",
        headers=_auth_headers(admin_token),
        json={"status": "in_progress"},
    )
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "in_progress"

    response = client_with_fake_ai.get(
        f"/api/v1/admin/incident-groups/{group_id}",
        headers=_auth_headers(admin_token),
    )
    assert response.status_code == 200
    assert len(response.json()["data"]["tickets"]) == 2

    response = client_with_fake_ai.delete(
        f"/api/v1/admin/incident-groups/{group_id}/tickets/{ticket_two}",
        headers=_auth_headers(admin_token),
    )
    assert response.status_code == 200
    assert response.json()["data"]["related_count"] == 1


def test_student_cannot_manage_incident_groups(client_with_fake_ai: TestClient) -> None:
    student_token = _register_and_login(client_with_fake_ai, "incident-denied@example.com")

    response = client_with_fake_ai.get(
        "/api/v1/admin/incident-groups",
        headers=_auth_headers(student_token),
    )

    assert response.status_code == 403
