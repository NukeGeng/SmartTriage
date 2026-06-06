import csv
from pathlib import Path

OUTPUT_PATH = Path("data/tickets_index/sample_existing_tickets.csv")

BASE_TICKETS = [
    ("TCK-001", "Không đăng nhập được hệ thống thi online", "Không thể đăng nhập vào hệ thống thi trước lịch thi sáng mai."),
    ("TCK-002", "Lỗi đăng nhập tài khoản sinh viên", "Tài khoản sinh viên báo sai mật khẩu dù đã nhập đúng."),
    ("TCK-003", "Wifi phòng B305 rất yếu", "Wifi tại phòng B305 mất kết nối nhiều lần trong buổi học."),
    ("TCK-004", "Mạng ký túc xá chậm", "Internet ký túc xá không ổn định vào buổi tối."),
    ("TCK-005", "Máy chiếu phòng A402 không hoạt động", "Máy chiếu không nhận tín hiệu HDMI từ laptop."),
    ("TCK-006", "Loa giảng đường bị rè", "Loa trong phòng học phát âm thanh rè và nhỏ."),
    ("TCK-007", "Đèn phòng học bị hỏng", "Một số bóng đèn trong phòng học không sáng."),
    ("TCK-008", "Máy lạnh phòng C201 không mát", "Máy lạnh hoạt động yếu, cả lớp thấy nóng."),
    ("TCK-009", "Trùng lịch thi hai môn", "Sinh viên bị trùng hai lịch thi trong cùng một buổi."),
    ("TCK-010", "Sai phòng thi trên hệ thống", "Phòng thi hiển thị trên cổng sinh viên không đúng."),
]


def main() -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    rows = []
    for index in range(50):
        ticket_id, title, description = BASE_TICKETS[index % len(BASE_TICKETS)]
        rows.append(
            {
                "ticket_id": f"{ticket_id}-{index + 1:02d}",
                "title": title,
                "description": f"{description} Mẫu ghi nhận số {index + 1}.",
                "status": "open",
            }
        )
    with OUTPUT_PATH.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=["ticket_id", "title", "description", "status"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {len(rows)} rows to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
