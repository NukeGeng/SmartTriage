from app.ml.preprocessing import combine_title_description

CATEGORY_WEIGHTS = {
    "account_system": 25,
    "learning_platform": 25,
    "schedule_exam": 25,
    "network": 20,
    "classroom_device": 20,
    "tuition_payment": 15,
    "document_profile": 15,
    "facility": 10,
    "feedback": 5,
    "other": 5,
}

URGENT_KEYWORDS = [
    "khẩn cấp",
    "gấp",
    "ngay",
    "không thể",
    "thi",
    "kiểm tra",
    "deadline",
    "hôm nay",
    "sáng mai",
    "chiều nay",
    "bị lỗi toàn bộ",
    "không truy cập được",
]

DEADLINE_RULES = [
    (["hôm nay", "sáng nay", "chiều nay", "tối nay"], 20),
    (["ngày mai", "sáng mai", "chiều mai"], 15),
    (["tuần này"], 10),
]

IMPACT_KEYWORDS = ["cả lớp", "nhiều bạn", "toàn bộ", "nhiều sinh viên", "phòng học", "lớp em"]


def score_priority(title: str, description: str, category: str) -> dict:
    text = combine_title_description(title, description)
    reasons: list[str] = []

    category_weight = CATEGORY_WEIGHTS.get(category, CATEGORY_WEIGHTS["other"])
    if category_weight:
        reasons.append(f"Category weight {category}: +{category_weight}")

    urgent_matches = [keyword for keyword in URGENT_KEYWORDS if keyword in text]
    urgent_keyword_score = min(len(urgent_matches) * 10, 25)
    if urgent_keyword_score:
        reasons.append(f"Urgent keywords {urgent_matches}: +{urgent_keyword_score}")

    deadline_score = 0
    for keywords, value in DEADLINE_RULES:
        if any(keyword in text for keyword in keywords):
            deadline_score = value
            reasons.append(f"Deadline signal {keywords}: +{value}")
            break

    impact_score = 20 if any(keyword in text for keyword in IMPACT_KEYWORDS) else 0
    if impact_score:
        reasons.append("Affected scope signal: +20")

    exam_deadline_score = 10 if deadline_score and any(keyword in text for keyword in ["thi", "kiểm tra"]) else 0
    if exam_deadline_score:
        reasons.append("Exam or test deadline signal: +10")

    priority_score = min(
        category_weight
        + urgent_keyword_score
        + deadline_score
        + impact_score
        + exam_deadline_score,
        100,
    )
    if priority_score >= 70:
        priority = "high"
    elif priority_score >= 40:
        priority = "medium"
    else:
        priority = "low"

    return {
        "priority_score": priority_score,
        "priority": priority,
        "reasons": reasons,
    }
