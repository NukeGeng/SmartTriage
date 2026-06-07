from app.ml.department_recommender import recommend_department


def test_department_mapping() -> None:
    assert recommend_department("network", "high") == "Phòng CNTT"
    assert recommend_department("facility", "medium") == "Phòng Cơ sở vật chất"
    assert recommend_department("unknown", "low") == "Bộ phận tiếp nhận"
