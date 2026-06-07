from app.ml.action_recommender import recommend_actions


def test_action_templates_have_minimum_actions() -> None:
    actions = recommend_actions("account_system", "medium", "Không đăng nhập được", "Sai mật khẩu")

    assert len(actions) >= 3
    assert any("tài khoản" in action.lower() for action in actions)


def test_high_priority_action_first() -> None:
    actions = recommend_actions("network", "high", "Wifi lỗi", "Không thể truy cập")

    assert actions[0].startswith("Ưu tiên xử lý")
