from app.ml.category_metadata import CATEGORY_LABELS

CATEGORY_SIGNAL_HINTS = {
    "account_system": ["đăng nhập", "mật khẩu", "tài khoản", "hệ thống"],
    "learning_platform": ["lms", "bài tập", "lớp học trực tuyến", "học online"],
    "network": ["wifi", "mạng", "internet", "kết nối"],
    "classroom_device": ["máy chiếu", "loa", "micro", "hdmi", "thiết bị"],
    "facility": ["phòng học", "nhà vệ sinh", "máy lạnh", "đèn", "cơ sở vật chất"],
    "schedule_exam": ["lịch thi", "lịch học", "phòng thi", "ca thi"],
    "tuition_payment": ["học phí", "thanh toán", "biên lai", "chuyển khoản"],
    "document_profile": ["hồ sơ", "giấy xác nhận", "giấy tờ", "bảng điểm"],
    "feedback": ["góp ý", "đề xuất", "phản hồi", "cải thiện"],
    "other": [],
}


def _unique(values: list[str]) -> list[str]:
    result: list[str] = []
    for value in values:
        if value and value not in result:
            result.append(value)
    return result


def _confidence_text(confidence: float) -> str:
    if confidence >= 0.75:
        return "độ tin cậy cao"
    if confidence >= 0.45:
        return "độ tin cậy trung bình"
    return "độ tin cậy thấp"


def build_analysis_explanation(
    text: str,
    category: str,
    category_label: str,
    confidence: float,
    priority: str,
    priority_score: int,
    suggested_department: str,
    detected_signals: list[str],
) -> dict:
    category_hints = [
        keyword
        for keyword in CATEGORY_SIGNAL_HINTS.get(category, [])
        if keyword in text
    ]
    signals = _unique(detected_signals + category_hints)
    confidence_label = _confidence_text(confidence)

    if signals:
        signal_text = ", ".join(f"'{signal}'" for signal in signals[:4])
        category_reason = (
            f"Nội dung chứa các tín hiệu như {signal_text}, phù hợp với nhóm {category_label}. "
            f"Mô hình trả về {confidence_label}."
        )
    else:
        category_reason = (
            f"Mô hình phân loại phản ánh vào nhóm {category_label} với {confidence_label}; "
            "chưa phát hiện nhiều từ khóa đặc trưng rõ ràng."
        )

    if priority == "high":
        priority_reason = (
            f"Mức ưu tiên cao vì tổng điểm đạt {priority_score}/100, có dấu hiệu ảnh hưởng cần xử lý sớm."
        )
    elif priority == "medium":
        priority_reason = (
            f"Mức ưu tiên trung bình vì tổng điểm đạt {priority_score}/100, cần theo dõi và xử lý theo hàng đợi."
        )
    else:
        priority_reason = (
            f"Mức ưu tiên thấp vì tổng điểm đạt {priority_score}/100 và chưa có tín hiệu khẩn cấp mạnh."
        )

    department_reason = (
        f"{suggested_department} là đơn vị phù hợp để xử lý nhóm {category_label} theo quy tắc điều phối."
    )

    summary = (
        f"Phản ánh được phân loại là {category_label}, mức ưu tiên {priority} "
        f"với điểm {priority_score}/100 và được đề xuất chuyển đến {suggested_department}."
    )

    return {
        "summary": summary,
        "category_reason": category_reason,
        "priority_reason": priority_reason,
        "department_reason": department_reason,
        "detected_signals": signals,
    }
