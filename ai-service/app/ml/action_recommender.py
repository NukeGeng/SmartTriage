from app.ml.preprocessing import combine_title_description

ACTION_TEMPLATES = {
    "account_system": [
        "Kiểm tra trạng thái tài khoản sinh viên.",
        "Xác minh thông tin đăng nhập.",
        "Reset mật khẩu nếu cần.",
        "Ưu tiên xử lý nếu liên quan lịch thi/kiểm tra.",
    ],
    "network": [
        "Xác định khu vực/phòng bị ảnh hưởng.",
        "Kiểm tra thiết bị mạng tại khu vực.",
        "Ghi nhận số lượng sinh viên bị ảnh hưởng.",
    ],
    "classroom_device": [
        "Kiểm tra mã phòng học.",
        "Kiểm tra máy chiếu/cáp HDMI/loa.",
        "Chuyển kỹ thuật viên nếu thiết bị không hoạt động.",
    ],
    "facility": [
        "Xác minh vị trí cơ sở vật chất bị lỗi.",
        "Ghi nhận mức độ ảnh hưởng đến lớp học.",
        "Chuyển đội cơ sở vật chất kiểm tra hiện trường.",
    ],
    "schedule_exam": [
        "Kiểm tra lịch học/lịch thi trên hệ thống đào tạo.",
        "Đối chiếu thông tin lớp, môn học và ca thi.",
        "Phản hồi hướng xử lý cho sinh viên trước thời hạn liên quan.",
    ],
    "tuition_payment": [
        "Kiểm tra trạng thái thanh toán học phí.",
        "Đối chiếu mã giao dịch hoặc biên lai nếu có.",
        "Chuyển phòng tài chính xác minh khoản thu.",
    ],
    "document_profile": [
        "Kiểm tra loại giấy tờ sinh viên yêu cầu.",
        "Xác minh thông tin hồ sơ sinh viên.",
        "Thông báo thời gian dự kiến hoàn tất giấy tờ.",
    ],
    "learning_platform": [
        "Kiểm tra tài khoản trên hệ thống học tập trực tuyến.",
        "Xác minh môn học/lớp học bị ảnh hưởng.",
        "Ghi nhận lỗi truy cập hoặc lỗi nộp bài để kỹ thuật kiểm tra.",
    ],
    "feedback": [
        "Ghi nhận góp ý vào danh sách cải tiến dịch vụ.",
        "Phân loại nội dung góp ý theo phòng ban liên quan.",
        "Phản hồi sinh viên sau khi đánh giá khả năng thực hiện.",
    ],
    "other": [
        "Tiếp nhận và xác minh thêm thông tin phản ánh.",
        "Phân loại lại nếu có thêm dữ liệu.",
        "Chuyển bộ phận phù hợp sau khi xác minh.",
    ],
}


def recommend_actions(category: str, priority: str, title: str, description: str) -> list[str]:
    actions = list(ACTION_TEMPLATES.get(category, ACTION_TEMPLATES["other"]))
    text = combine_title_description(title, description)
    if priority == "high":
        actions.insert(0, "Ưu tiên xử lý do phản ánh có mức độ cao.")
    if "thi" in text or "kiểm tra" in text:
        actions.append("Xác minh lịch thi/kiểm tra để ưu tiên thời gian xử lý.")
    return actions[:5]
