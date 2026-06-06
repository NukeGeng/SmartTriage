from app.ml.preprocessing import combine_title_description, normalize_text


def test_normalize_text_keeps_real_vietnamese_accents() -> None:
    value = normalize_text(
        "Kh\u00f4ng \u0111\u0103ng nh\u1eadp \u0111\u01b0\u1ee3c v\u00e0o h\u1ec7 th\u1ed1ng thi."
    )

    assert "kh\u00f4ng" in value
    assert "\u0111\u0103ng nh\u1eadp" in value
    assert "h\u1ec7 th\u1ed1ng" in value


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
