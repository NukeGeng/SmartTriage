from app.ml.predictor import CategoryPredictor


def test_predictor_fallback_network(tmp_path) -> None:
    predictor = CategoryPredictor(model_dir=str(tmp_path))

    result = predictor.predict("Wifi phòng B305 yếu", "Mạng mất kết nối liên tục")

    assert result["category"] == "network"
    assert result["confidence"] > 0


def test_predictor_fallback_account_system(tmp_path) -> None:
    predictor = CategoryPredictor(model_dir=str(tmp_path))

    result = predictor.predict("Không đăng nhập được", "Tài khoản báo sai mật khẩu")

    assert result["category"] == "account_system"
