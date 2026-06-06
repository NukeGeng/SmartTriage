import pandas as pd

from app.ml.duplicate_detector import DuplicateDetector


def test_duplicate_detector_finds_similar_ticket(tmp_path) -> None:
    index_path = tmp_path / "tickets.csv"
    pd.DataFrame(
        [
            {
                "ticket_id": "TCK-001",
                "title": "Không đăng nhập được hệ thống thi online",
                "description": "Không thể đăng nhập vào hệ thống thi trước giờ kiểm tra.",
                "status": "open",
            },
            {
                "ticket_id": "TCK-002",
                "title": "Đèn phòng học bị hỏng",
                "description": "Phòng học bị tối do đèn không sáng.",
                "status": "open",
            },
        ]
    ).to_csv(index_path, index=False)
    detector = DuplicateDetector(index_path=str(index_path))

    result = detector.find_duplicates(
        ticket_id="TCK-NEW",
        title="Lỗi đăng nhập hệ thống thi online",
        description="Em không thể đăng nhập vào hệ thống thi.",
        threshold=0.2,
    )

    assert result
    assert result[0]["ticket_id"] == "TCK-001"


def test_duplicate_detector_missing_index_returns_empty(tmp_path) -> None:
    detector = DuplicateDetector(index_path=str(tmp_path / "missing.csv"))

    assert detector.find_duplicates("TCK-1", "Wifi yếu", "Mạng chậm") == []
