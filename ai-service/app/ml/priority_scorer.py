from app.ml.preprocessing import combine_title_description

CATEGORY_WEIGHTS = {
    "account_system": 25,
    "learning_platform": 22,
    "lms": 22,
    "network": 20,
    "classroom_device": 20,
    "schedule_exam": 24,
    "tuition_payment": 16,
    "facility": 14,
    "document_profile": 12,
    "feedback": 5,
    "other": 8,
}

CATEGORY_REASONS = {
    "account_system": "Lỗi tài khoản/hệ thống ảnh hưởng trực tiếp đến khả năng sử dụng dịch vụ.",
    "learning_platform": "Sự cố nền tảng học tập có thể ảnh hưởng việc học, nộp bài hoặc kiểm tra.",
    "lms": "Sự cố nền tảng học tập có thể ảnh hưởng việc học, nộp bài hoặc kiểm tra.",
    "network": "Sự cố mạng ảnh hưởng đến truy cập tài liệu, lớp học trực tuyến hoặc hệ thống nội bộ.",
    "classroom_device": "Thiết bị phòng học lỗi có thể làm gián đoạn buổi học trực tiếp.",
    "schedule_exam": "Lịch học/lịch thi tác động trực tiếp đến kế hoạch học tập và thi cử.",
    "tuition_payment": "Vấn đề học phí/thanh toán cần đối soát nhưng thường ít khẩn hơn sự cố thi.",
    "facility": "Cơ sở vật chất cần được xử lý theo mức độ ảnh hưởng và an toàn.",
    "document_profile": "Hồ sơ/giấy tờ cần xử lý đúng hạn theo nhu cầu hành chính của sinh viên.",
    "feedback": "Góp ý dịch vụ thường cần ghi nhận và điều phối cải tiến.",
    "other": "Nhóm khác được ưu tiên ở mức nền để bộ phận tiếp nhận phân loại tiếp.",
}

URGENT_KEYWORDS = [
    "gấp",
    "khẩn cấp",
    "ngay",
    "không thể",
    "bị lỗi",
    "không đăng nhập được",
    "không truy cập được",
]

DEADLINE_KEYWORDS = [
    "hôm nay",
    "sáng nay",
    "chiều nay",
    "tối nay",
    "ngày mai",
    "sáng mai",
    "chiều mai",
    "trước giờ học",
    "sắp thi",
    "deadline",
]

DEADLINE_HIGH = [
    "hôm nay",
    "sáng nay",
    "chiều nay",
    "tối nay",
    "ngày mai",
    "sáng mai",
    "chiều mai",
    "trước giờ học",
    "sắp thi",
]

EXAM_KEYWORDS = [
    "thi",
    "kiểm tra",
    "thi online",
    "thi trực tuyến",
    "lịch thi",
    "phòng thi",
]

IMPACT_KEYWORDS = [
    "cả lớp",
    "nhiều bạn",
    "toàn bộ",
    "nhiều sinh viên",
    "lớp em",
    "hàng loạt",
]


def _matched_terms(text: str, keywords: list[str]) -> list[str]:
    return [keyword for keyword in keywords if keyword in text]


def _level_from_score(priority_score: int) -> str:
    if priority_score >= 70:
        return "high"
    if priority_score >= 40:
        return "medium"
    return "low"


def score_priority(title: str, description: str, category: str) -> dict:
    text = combine_title_description(title, description)

    category_weight = CATEGORY_WEIGHTS.get(category, CATEGORY_WEIGHTS["other"])
    category_reason = CATEGORY_REASONS.get(category, CATEGORY_REASONS["other"])

    urgent_matches = _matched_terms(text, URGENT_KEYWORDS)
    urgent_keyword_score = min(len(urgent_matches) * 10, 25)

    deadline_matches = _matched_terms(text, DEADLINE_KEYWORDS)
    if any(term in deadline_matches for term in DEADLINE_HIGH):
        deadline_score = 20
    elif deadline_matches:
        deadline_score = 15
    else:
        deadline_score = 0

    exam_matches = _matched_terms(text, EXAM_KEYWORDS)
    exam_context_score = 15 if exam_matches else 0

    scope_matches = _matched_terms(text, IMPACT_KEYWORDS)
    affected_scope_score = 10 if scope_matches else 1
    duplicate_cluster_score = 0

    priority_score = min(
        category_weight
        + urgent_keyword_score
        + deadline_score
        + exam_context_score
        + affected_scope_score
        + duplicate_cluster_score,
        100,
    )
    priority = _level_from_score(priority_score)

    breakdown_items = [
        {
            "name": "Nhóm vấn đề",
            "score": category_weight,
            "reason": category_reason,
            "matched_terms": [category],
        },
        {
            "name": "Từ khóa khẩn cấp",
            "score": urgent_keyword_score,
            "reason": "Nội dung có tín hiệu cần xử lý gấp."
            if urgent_matches
            else "Chưa phát hiện từ khóa khẩn cấp rõ ràng.",
            "matched_terms": urgent_matches,
        },
        {
            "name": "Deadline gần",
            "score": deadline_score,
            "reason": "Phản ánh nhắc đến thời điểm gần cần xử lý."
            if deadline_matches
            else "Chưa phát hiện deadline gần.",
            "matched_terms": deadline_matches,
        },
        {
            "name": "Ngữ cảnh thi/kiểm tra",
            "score": exam_context_score,
            "reason": "Sự cố liên quan đến thi/kiểm tra nên cần ưu tiên."
            if exam_matches
            else "Chưa phát hiện ngữ cảnh thi/kiểm tra.",
            "matched_terms": exam_matches,
        },
        {
            "name": "Tín hiệu phạm vi ảnh hưởng",
            "score": affected_scope_score,
            "reason": "Nội dung cho thấy nhiều người hoặc cả lớp bị ảnh hưởng."
            if scope_matches
            else "Chưa phát hiện nhiều người bị ảnh hưởng.",
            "matched_terms": scope_matches,
        },
        {
            "name": "Cụm phản ánh liên quan",
            "score": duplicate_cluster_score,
            "reason": "Điểm này sẽ tăng khi phản ánh thuộc cụm sự cố lớn.",
            "matched_terms": [],
        },
    ]

    detected_signals: list[str] = []
    for term in urgent_matches + deadline_matches + exam_matches + scope_matches:
        if term not in detected_signals:
            detected_signals.append(term)

    return {
        "priority_score": priority_score,
        "priority": priority,
        "priority_breakdown": {
            "total_score": priority_score,
            "level": priority,
            "items": breakdown_items,
        },
        "detected_signals": detected_signals,
        "reasons": [f"{item['name']}: +{item['score']}" for item in breakdown_items if item["score"]],
    }
