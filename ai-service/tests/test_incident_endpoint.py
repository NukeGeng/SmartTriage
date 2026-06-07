from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_suggest_incident_group_endpoint() -> None:
    response = client.post(
        "/api/v1/suggest-incident-group",
        json={
            "new_ticket": {
                "id": "TCK-1",
                "title": "Wifi phòng B305 rất yếu",
                "description": "Không vào được mạng ở phòng B305.",
                "category": "network",
            },
            "existing_tickets": [
                {
                    "id": "TCK-2",
                    "title": "Wifi khu B tầng 3 yếu",
                    "description": "Mạng khu B tầng 3 chập chờn.",
                    "category": "network",
                },
                {
                    "id": "TCK-3",
                    "title": "Không vào được mạng phòng B304",
                    "description": "Wifi phòng B304 bị lỗi liên tục.",
                    "category": "network",
                },
            ],
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert "related_tickets" in body["data"]
