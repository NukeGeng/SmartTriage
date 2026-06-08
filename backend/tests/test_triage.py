from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.api.v1.endpoints import tickets as ticket_endpoints
from app.main import app
from app.services.ticket_service import TicketService


class FakeTriageAIClient:
    def analyze_ticket(self, **kwargs: Any) -> dict[str, Any]:
        title = str(kwargs.get("title", "")).lower()
        if "unclear" in title:
            confidence = 0.42
            priority = "medium"
            priority_score = 55
        else:
            confidence = 0.91
            priority = "high"
            priority_score = 86

        return {
            "category": "account_system",
            "category_label": "Account / System",
            "confidence": confidence,
            "priority": priority,
            "priority_score": priority_score,
            "suggested_department": "IT Department",
            "duplicate_candidates": [],
            "suggested_actions": ["Check account status"],
            "model_version": "test-v1",
        }


@pytest.fixture
def client_with_fake_ai(client: TestClient):
    app.dependency_overrides[ticket_endpoints.get_ticket_service] = lambda: TicketService(
        ai_client=FakeTriageAIClient(),
    )
    yield client
    app.dependency_overrides.pop(ticket_endpoints.get_ticket_service, None)


def _register_and_login(client: TestClient, email: str, role: str = "student") -> str:
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Triage User",
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


def _create_ticket(client: TestClient, token: str, title: str) -> None:
    response = client.post(
        "/api/v1/tickets",
        headers=_auth_headers(token),
        json={
            "title": title,
            "description": "Student needs support before tomorrow online exam.",
        },
    )
    assert response.status_code == 201


def test_triage_overview_for_admin(client_with_fake_ai: TestClient) -> None:
    student_token = _register_and_login(client_with_fake_ai, "triage-student@example.com")
    admin_token = _register_and_login(client_with_fake_ai, "triage-admin@example.com", role="admin")
    _create_ticket(client_with_fake_ai, student_token, "Cannot login to online exam system")
    _create_ticket(client_with_fake_ai, student_token, "Unclear portal information request")

    response = client_with_fake_ai.get(
        "/api/v1/admin/triage/overview",
        headers=_auth_headers(admin_token),
    )

    assert response.status_code == 200
    data = response.json()["data"]
    assert data["summary"]["total_open"] == 2
    assert data["summary"]["high_priority"] == 1
    assert len(data["critical_queue"]) == 1
    assert len(data["low_confidence_cases"]) == 1
    assert data["recent_tickets"]


def test_student_cannot_view_triage_overview(client_with_fake_ai: TestClient) -> None:
    student_token = _register_and_login(client_with_fake_ai, "triage-denied@example.com")

    response = client_with_fake_ai.get(
        "/api/v1/admin/triage/overview",
        headers=_auth_headers(student_token),
    )

    assert response.status_code == 403
