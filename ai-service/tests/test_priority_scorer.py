from app.ml.priority_scorer import score_priority


def test_priority_low() -> None:
    result = score_priority("Góp ý giao diện", "Em đề xuất cải thiện màu nút.", "feedback")

    assert result["priority"] == "low"


def test_priority_medium() -> None:
    result = score_priority("Wifi phòng B305 yếu", "Nhiều sinh viên không truy cập được tài liệu.", "network")

    assert result["priority"] == "medium"


def test_priority_high() -> None:
    result = score_priority(
        "Không đăng nhập được hệ thống thi",
        "Em không thể truy cập, sáng mai có lịch thi, cần hỗ trợ gấp.",
        "account_system",
    )

    assert result["priority"] == "high"
    assert result["priority_score"] >= 70
    assert result["reasons"]
