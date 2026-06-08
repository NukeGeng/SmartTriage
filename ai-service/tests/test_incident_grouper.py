from app.ml.incident_grouper import suggest_incident_group


def test_incident_grouper_suggests_related_topic() -> None:
    result = suggest_incident_group(
        new_ticket={
            "id": "TCK-1",
            "title": "Wifi phòng B305 rất yếu",
            "description": "Em không vào được mạng ở phòng B305.",
            "category": "network",
        },
        existing_tickets=[
            {
                "id": "TCK-2",
                "title": "Không vào được mạng khu B tầng 3",
                "description": "Wifi khu B tầng 3 bị lỗi liên tục.",
                "category": "network",
            },
            {
                "id": "TCK-3",
                "title": "Mạng phòng B304 chập chờn",
                "description": "Internet phòng B304 bị rớt nhiều lần.",
                "category": "network",
            },
        ],
        threshold=0.1,
    )

    assert result["has_incident_suggestion"] is True
    assert result["suggested_category"] == "network"
    assert len(result["related_tickets"]) == 2
