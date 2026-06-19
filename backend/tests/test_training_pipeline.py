import csv
from io import StringIO
from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.api.v1.endpoints import tickets as ticket_endpoints
from app.main import app
from app.services.ticket_service import TicketService


class FakeTrainingAIClient:
    def analyze_ticket(self, **_: Any) -> dict[str, Any]:
        return {
            "category": "account_system",
            "category_label": "Tài khoản / Hệ thống",
            "confidence": 0.91,
            "priority": "high",
            "priority_score": 82,
            "suggested_department": "Phòng CNTT",
            "duplicate_candidates": [],
            "suggested_actions": ["Kiểm tra tài khoản"],
            "model_version": "test-v1",
        }


@pytest.fixture
def client_with_training_ai(client: TestClient):
    app.dependency_overrides[ticket_endpoints.get_ticket_service] = lambda: TicketService(
        ai_client=FakeTrainingAIClient(),
    )
    yield client
    app.dependency_overrides.pop(ticket_endpoints.get_ticket_service, None)


def register_and_login(client: TestClient, email: str, role: str) -> str:
    register = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Training Pipeline User",
            "email": email,
            "password": "12345678",
            "role": role,
        },
    )
    assert register.status_code == 201
    login = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "12345678"},
    )
    assert login.status_code == 200
    return str(login.json()["data"]["access_token"])


def auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_resolved_ticket_becomes_anonymized_versioned_training_sample(
    client_with_training_ai: TestClient,
) -> None:
    student = register_and_login(client_with_training_ai, "pipeline-student@example.com", "student")
    admin = register_and_login(client_with_training_ai, "pipeline-admin@example.com", "admin")

    created = client_with_training_ai.post(
        "/api/v1/tickets",
        headers=auth(student),
        json={
            "title": "MSSV 22123456 không đăng nhập được",
            "description": "Liên hệ sv22123456@example.com hoặc 0912345678. Sáng mai em thi online.",
        },
    )
    assert created.status_code == 201
    ticket_id = created.json()["data"]["id"]

    corrected = client_with_training_ai.patch(
        f"/api/v1/tickets/{ticket_id}",
        headers=auth(admin),
        json={"manual_category": "account_system", "manual_priority": "high"},
    )
    assert corrected.status_code == 200
    resolved = client_with_training_ai.patch(
        f"/api/v1/tickets/{ticket_id}/status",
        headers=auth(admin),
        json={"status": "resolved"},
    )
    assert resolved.status_code == 200

    synchronized = client_with_training_ai.post(
        "/api/v1/admin/training-pipeline/sync",
        headers=auth(admin),
    )
    assert synchronized.status_code == 200
    assert synchronized.json()["data"] == {"created": 1, "skipped": 0}

    samples = client_with_training_ai.get(
        "/api/v1/admin/training-pipeline/samples?review_status=approved",
        headers=auth(admin),
    )
    assert samples.status_code == 200
    sample = samples.json()["data"]["items"][0]
    assert sample["label_source"] == "manual"
    assert "[MA_SINH_VIEN]" in sample["title"]
    assert "[EMAIL]" in sample["description"]
    assert "[SO_DIEN_THOAI]" in sample["description"]

    version_response = client_with_training_ai.post(
        "/api/v1/admin/training-pipeline/datasets",
        headers=auth(admin),
        json={"version": "production-test-v1", "minimum_samples": 1},
    )
    assert version_response.status_code == 200
    dataset = version_response.json()["data"]
    assert dataset["sample_count"] == 1
    assert dataset["category_distribution"] == {"account_system": 1}

    exported = client_with_training_ai.get(
        f"/api/v1/admin/training-pipeline/datasets/{dataset['id']}/export",
        headers=auth(admin),
    )
    assert exported.status_code == 200
    rows = list(csv.DictReader(StringIO(exported.text)))
    assert rows[0]["dataset_version"] == "production-test-v1"
    assert rows[0]["review_status"] == "approved"
    assert rows[0]["source_ticket_id"].startswith("PROD-")
    assert ticket_id not in rows[0]["source_ticket_id"]
    assert ticket_id not in rows[0]["scenario_group"]
    assert "example.com" not in rows[0]["description"]

    synchronized_again = client_with_training_ai.post(
        "/api/v1/admin/training-pipeline/sync",
        headers=auth(admin),
    )
    assert synchronized_again.json()["data"] == {"created": 0, "skipped": 1}


def test_student_cannot_access_training_pipeline(client: TestClient) -> None:
    student = register_and_login(client, "pipeline-denied@example.com", "student")
    response = client.get(
        "/api/v1/admin/training-pipeline/summary",
        headers=auth(student),
    )
    assert response.status_code == 403
