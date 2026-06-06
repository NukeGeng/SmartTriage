CATEGORY_TO_DEPARTMENT = {
    "account_system": "Phòng CNTT",
    "learning_platform": "Phòng CNTT",
    "network": "Phòng CNTT",
    "classroom_device": "Phòng Cơ sở vật chất",
    "facility": "Phòng Cơ sở vật chất",
    "schedule_exam": "Phòng Đào tạo",
    "tuition_payment": "Phòng Tài chính",
    "document_profile": "Phòng Công tác sinh viên",
    "feedback": "Phòng Công tác sinh viên",
    "other": "Bộ phận tiếp nhận",
}


def recommend_department(category: str, priority: str) -> str:
    return CATEGORY_TO_DEPARTMENT.get(category, CATEGORY_TO_DEPARTMENT["other"])
