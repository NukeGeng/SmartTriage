import csv
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.ml.category_metadata import CATEGORY_LABELS

OUTPUT_PATH = Path("data/raw/ticket_samples.csv")

CATEGORY_SCENARIOS = {
    "account_system": [
        ("Không đăng nhập được tài khoản sinh viên", "Em nhập đúng mật khẩu nhưng hệ thống báo lỗi đăng nhập."),
        ("Quên mật khẩu cổng sinh viên", "Em cần reset mật khẩu để truy cập cổng thông tin."),
        ("Tài khoản bị khóa trước giờ thi", "Tài khoản của em bị khóa, sáng mai em có lịch thi online."),
    ],
    "network": [
        ("Wifi phòng B305 rất yếu", "Wifi thường xuyên mất kết nối, nhiều sinh viên không truy cập được tài liệu."),
        ("Mạng ký túc xá chập chờn", "Internet ở khu ký túc xá bị chậm vào buổi tối."),
        ("Không kết nối được wifi trường", "Thiết bị của em không thể kết nối wifi trong phòng học."),
    ],
    "classroom_device": [
        ("Máy chiếu phòng A402 không lên hình", "Giảng viên cắm HDMI nhưng máy chiếu không hiển thị."),
        ("Loa phòng học bị rè", "Âm thanh trong phòng học quá rè nên sinh viên khó nghe bài giảng."),
        ("Micro giảng đường không hoạt động", "Micro không thu tiếng trong buổi học sáng nay."),
    ],
    "facility": [
        ("Đèn phòng học bị hỏng", "Một số bóng đèn trong phòng học bị hỏng làm phòng khá tối."),
        ("Máy lạnh phòng C201 không mát", "Máy lạnh hoạt động yếu, cả lớp rất khó tập trung."),
        ("Nhà vệ sinh tầng 3 thiếu nước", "Khu vệ sinh tầng 3 không có nước trong giờ học."),
    ],
    "schedule_exam": [
        ("Trùng lịch thi hai môn", "Em bị trùng lịch thi hai môn trong cùng buổi sáng."),
        ("Sai phòng thi trên hệ thống", "Thông tin phòng thi hiển thị khác với thông báo của khoa."),
        ("Chưa thấy lịch học tuần này", "Lớp em chưa thấy lịch học cập nhật trên cổng sinh viên."),
    ],
    "tuition_payment": [
        ("Đã chuyển khoản nhưng chưa cập nhật học phí", "Em đã thanh toán học phí nhưng hệ thống vẫn báo chưa đóng."),
        ("Không in được biên lai học phí", "Em cần biên lai để nộp hồ sơ nhưng hệ thống báo lỗi."),
        ("Sai số tiền học phí phải đóng", "Số tiền học phí hiển thị cao hơn thông báo của phòng tài chính."),
    ],
    "document_profile": [
        ("Xin giấy xác nhận sinh viên", "Em cần giấy xác nhận sinh viên để bổ sung hồ sơ thực tập."),
        ("Bảng điểm chưa cập nhật", "Điểm học kỳ trước chưa hiển thị trong bảng điểm điện tử."),
        ("Hồ sơ sinh viên thiếu thông tin", "Thông tin ngày sinh trong hồ sơ của em đang bị sai."),
    ],
    "learning_platform": [
        ("Không vào được lớp trên LMS", "Em không thấy môn học trên hệ thống học tập trực tuyến."),
        ("Không nộp được bài tập online", "Trang nộp bài báo lỗi khi em tải file lên."),
        ("Video bài giảng không phát", "Video bài giảng trên nền tảng học online bị đứng liên tục."),
    ],
    "feedback": [
        ("Góp ý giao diện cổng sinh viên", "Em thấy mục lịch học hơi khó tìm, nên có thanh tìm kiếm rõ hơn."),
        ("Đề xuất thêm thông báo qua email", "Sinh viên nên nhận email khi lịch thi thay đổi."),
        ("Góp ý quy trình hỗ trợ", "Mong bộ phận hỗ trợ phản hồi tiến độ xử lý rõ ràng hơn."),
    ],
    "other": [
        ("Cần tư vấn thông tin chung", "Em chưa biết phản ánh này nên gửi cho phòng ban nào."),
        ("Hỏi về hoạt động sinh viên", "Em muốn hỏi thêm thông tin về hoạt động ngoại khóa."),
        ("Yêu cầu hỗ trợ khác", "Em cần nhà trường hỗ trợ một vấn đề chưa có trong danh mục."),
    ],
}

EXTRA_PHRASES = [
    "Mong được hỗ trợ sớm.",
    "Vấn đề xảy ra từ hôm qua.",
    "Nhiều bạn trong lớp cũng gặp tình trạng tương tự.",
    "Em đã thử lại nhiều lần nhưng chưa được.",
    "Nếu cần thêm thông tin em có thể bổ sung.",
    "Tình trạng này ảnh hưởng đến việc học.",
    "Em cần xử lý trong tuần này.",
    "Nhờ phòng ban kiểm tra giúp em.",
    "Hiện tại em vẫn chưa thể sử dụng bình thường.",
    "Cảm ơn bộ phận hỗ trợ.",
]

PRIORITY_HINTS = [
    ("low", ""),
    ("medium", "Tình trạng này ảnh hưởng đến việc học của lớp em."),
    ("high", "Em cần xử lý gấp vì sáng mai có thi/kiểm tra."),
]


def build_rows() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for category, scenarios in CATEGORY_SCENARIOS.items():
        label = CATEGORY_LABELS[category]
        for index in range(30):
            title, description = scenarios[index % len(scenarios)]
            priority, hint = PRIORITY_HINTS[index % len(PRIORITY_HINTS)]
            extra = EXTRA_PHRASES[index % len(EXTRA_PHRASES)]
            variant_number = index // len(scenarios) + 1
            rows.append(
                {
                    "title": f"{title} lần {variant_number}" if variant_number > 1 else title,
                    "description": f"{description} {extra} {hint}".strip(),
                    "category": category,
                    "category_label": label,
                    "priority": priority,
                }
            )
    return rows


def main() -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    rows = build_rows()
    with OUTPUT_PATH.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=["title", "description", "category", "category_label", "priority"],
        )
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {len(rows)} rows to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
