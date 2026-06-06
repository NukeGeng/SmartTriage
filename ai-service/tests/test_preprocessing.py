from app.ml.preprocessing import combine_title_description, normalize_text


def test_normalize_text_keeps_vietnamese_accents() -> None:
    value = normalize_text("Em không đăng nhập được vào hệ thống thi online!!!  ")

    assert value == "em không đăng nhập được vào hệ thống thi online"


def test_normalize_text_removes_url_and_email() -> None:
    value = normalize_text("Liên hệ test@example.com hoặc https://example.com ngay.")

    assert "example.com" not in value
    assert "https" not in value
    assert value == "liên hệ hoặc ngay"


def test_combine_title_description() -> None:
    assert combine_title_description("Wifi yếu", "Phòng B305") == "wifi yếu phòng b305"
