import csv
from io import StringIO
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
            "category_confidence": 0.91,
            "priority": "high",
            "priority_score": 82,
            "priority_breakdown": {
                "total_score": 82,
                "level": "high",
                "items": [
                    {
                        "name": "Issue group",
                        "score": 25,
                        "reason": "Account system issue.",
                        "matched_terms": ["account_system"],
                    }
                ],
            },
            "suggested_department": "IT Department",
            "duplicate_candidates": [],
            "suggested_actions": [
                "Check student account status",
                "Reset password if needed",
            ],
            "explanation": {
                "summary": "Account login issue before online exam.",
                "category_reason": "Login terms indicate account system.",
                "priority_reason": "Exam context raises priority.",
                "department_reason": "IT handles account systems.",
                "detected_signals": ["login", "exam"],
            },
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
    assert ticket["analysis"]["explanation"]["summary"] == "Account login issue before online exam."
    assert ticket["analysis"]["priority_breakdown"]["total_score"] == 82


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


def test_admin_exports_training_data_with_manual_labels(client_with_fake_ai: TestClient) -> None:
    student_token = _register_and_login(client_with_fake_ai, "ticket-export-student@example.com")
    admin_token = _register_and_login(
        client_with_fake_ai,
        "ticket-export-admin@example.com",
        role="admin",
    )
    created_ticket = _create_ticket(client_with_fake_ai, student_token)

    update_response = client_with_fake_ai.patch(
        f"/api/v1/tickets/{created_ticket['id']}",
        headers=_auth_headers(admin_token),
        json={
            "manual_category": "learning_platform",
            "manual_priority": "medium",
            "assigned_department": "IT Department",
        },
    )
    assert update_response.status_code == 200

    response = client_with_fake_ai.get(
        "/api/v1/tickets/export-training-data",
        headers=_auth_headers(admin_token),
    )

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    rows = list(csv.DictReader(StringIO(response.text)))
    assert rows == [
        {
            "title": "Cannot login to online exam system",
            "description": "Student cannot login before tomorrow online exam.",
            "category": "learning_platform",
            "priority": "medium",
            "source": "manual",
        }
    ]


class RetrainedAIClient:
    """Simulates a freshly retrained model returning different predictions."""

    def analyze_ticket(self, **kwargs: Any) -> dict[str, Any]:
        return {
            "category": "network",
            "category_label": "Network",
            "confidence": 0.42,
            "category_confidence": 0.42,
            "priority": "low",
            "priority_score": 21,
            "suggested_department": "IT Department",
            "duplicate_candidates": [],
            "suggested_actions": ["Check campus wifi"],
            "model_version": "test-v2",
        }


def test_admin_reanalyze_overwrites_stored_analysis(client_with_fake_ai: TestClient) -> None:
    student_token = _register_and_login(client_with_fake_ai, "reanalyze-student@example.com")
    admin_token = _register_and_login(client_with_fake_ai, "reanalyze-admin@example.com", role="admin")
    created_ticket = _create_ticket(client_with_fake_ai, student_token)
    assert created_ticket["analysis"]["priority"] == "high"
    assert created_ticket["analysis"]["model_version"] == "test-v1"

    # Swap in the "retrained" model, then run the bulk re-analysis.
    app.dependency_overrides[ticket_endpoints.get_ticket_service] = lambda: TicketService(
        ai_client=RetrainedAIClient(),
    )
    response = client_with_fake_ai.post(
        "/api/v1/tickets/reanalyze",
        headers=_auth_headers(admin_token),
    )

    assert response.status_code == 200
    summary = response.json()["data"]
    assert summary["total"] == 1
    assert summary["updated"] == 1
    assert summary["model_version"] == "test-v2"

    detail = client_with_fake_ai.get(
        f"/api/v1/tickets/{created_ticket['id']}",
        headers=_auth_headers(admin_token),
    ).json()["data"]
    assert detail["analysis"]["priority"] == "low"
    assert detail["analysis"]["priority_score"] == 21
    assert detail["analysis"]["category_confidence"] == 0.42
    assert detail["analysis"]["model_version"] == "test-v2"


def test_student_cannot_reanalyze(client_with_fake_ai: TestClient) -> None:
    student_token = _register_and_login(client_with_fake_ai, "reanalyze-denied@example.com")

    response = client_with_fake_ai.post(
        "/api/v1/tickets/reanalyze",
        headers=_auth_headers(student_token),
    )

    assert response.status_code == 403


def test_student_cannot_export_training_data(client_with_fake_ai: TestClient) -> None:
    student_token = _register_and_login(client_with_fake_ai, "ticket-export-denied@example.com")

    response = client_with_fake_ai.get(
        "/api/v1/tickets/export-training-data",
        headers=_auth_headers(student_token),
    )

    assert response.status_code == 403
