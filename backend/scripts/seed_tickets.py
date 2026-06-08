import csv
import sys
from pathlib import Path

from sqlalchemy import select

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.db.session import SessionLocal
from app.models.ticket import Ticket, TicketStatus
from app.models.ticket_analysis import TicketAnalysis
from app.repositories.user_repository import UserRepository


SAMPLE_PATH = (
    Path(__file__).resolve().parents[2]
    / "datasets"
    / "samples"
    / "vietnamese_ticket_feedback_100.csv"
)
STUDENT_EMAIL = "student@example.com"

DEPARTMENT_BY_CATEGORY = {
    "account_system": "Phòng CNTT",
    "network": "Phòng CNTT",
    "learning_platform": "Phòng CNTT",
    "classroom_device": "Phòng Cơ sở vật chất",
    "facility": "Phòng Cơ sở vật chất",
    "schedule_exam": "Phòng Đào tạo",
    "tuition_payment": "Phòng Tài chính",
    "document_profile": "Phòng Công tác sinh viên",
    "feedback": "Bộ phận tiếp nhận phản ánh",
    "other": "Bộ phận tiếp nhận phản ánh",
}

PRIORITY_SCORE = {
    "low": 25,
    "medium": 55,
    "high": 85,
}

ACTION_BY_CATEGORY = {
    "account_system": [
        "Kiểm tra trạng thái tài khoản sinh viên",
        "Xác minh thông tin đăng nhập và phân quyền",
        "Hướng dẫn sinh viên reset mật khẩu nếu cần",
    ],
    "network": [
        "Kiểm tra điểm phát wifi tại khu vực phản ánh",
        "Xác minh tình trạng kết nối trong khung giờ cao điểm",
        "Chuyển kỹ thuật viên kiểm tra thiết bị mạng",
    ],
    "classroom_device": [
        "Kiểm tra thiết bị phòng học trước buổi học tiếp theo",
        "Chuẩn bị thiết bị thay thế nếu lỗi chưa khắc phục",
        "Thông báo tình trạng xử lý cho giảng viên phụ trách",
    ],
    "facility": [
        "Ghi nhận vị trí cơ sở vật chất cần xử lý",
        "Chuyển bộ phận vận hành kiểm tra hiện trường",
        "Ưu tiên xử lý nếu ảnh hưởng an toàn sinh viên",
    ],
    "schedule_exam": [
        "Đối chiếu dữ liệu lịch học và lịch thi trên hệ thống",
        "Liên hệ phòng đào tạo để xác nhận lịch chính thức",
        "Thông báo lại sinh viên sau khi có kết quả kiểm tra",
    ],
    "tuition_payment": [
        "Đối soát giao dịch thanh toán với mã sinh viên",
        "Kiểm tra trạng thái công nợ trên hệ thống",
        "Cập nhật hoặc phản hồi biên lai cho sinh viên",
    ],
    "document_profile": [
        "Kiểm tra hồ sơ sinh viên và minh chứng đính kèm",
        "Đối chiếu thông tin với giấy tờ cá nhân",
        "Hướng dẫn bổ sung hồ sơ nếu còn thiếu",
    ],
    "learning_platform": [
        "Kiểm tra quyền truy cập lớp học trên LMS",
        "Đối chiếu trạng thái đăng ký học phần",
        "Thông báo giảng viên nếu lỗi ảnh hưởng bài kiểm tra",
    ],
    "feedback": [
        "Ghi nhận góp ý vào danh sách cải tiến dịch vụ",
        "Phân loại nhóm phản hồi để chuyển đơn vị liên quan",
        "Phản hồi sinh viên khi góp ý được tiếp nhận",
    ],
    "other": [
        "Xác định phòng ban phù hợp để tiếp nhận yêu cầu",
        "Bổ sung thông tin nếu phản ánh chưa đủ rõ",
        "Chuyển phản ánh đến bộ phận điều phối",
    ],
}


def get_existing_ticket(db, title: str, created_by_id) -> Ticket | None:
    statement = select(Ticket.id).where(
        Ticket.title == title,
        Ticket.created_by_id == created_by_id,
    )
    ticket_id = db.execute(statement).scalar_one_or_none()
    if ticket_id is None:
        return None
    return db.get(Ticket, ticket_id)


def build_analysis_metadata(row: dict[str, str]) -> dict:
    category = row["category"].strip()
    priority = row["priority"].strip()
    department = DEPARTMENT_BY_CATEGORY.get(category, "Bộ phận tiếp nhận phản ánh")
    priority_score = PRIORITY_SCORE.get(priority, 50)
    category_label = row["category_label"].strip()
    return {
        "explanation": {
            "summary": (
                f"Phản ánh mẫu được phân loại là {category_label}, mức ưu tiên {priority} "
                f"và được đề xuất chuyển đến {department}."
            ),
            "category_reason": f"Dữ liệu demo đã gắn nhãn phản ánh này vào nhóm {category_label}.",
            "priority_reason": f"Điểm ưu tiên demo là {priority_score}/100 dựa trên nhãn mẫu.",
            "department_reason": f"{department} là đơn vị xử lý phù hợp với nhóm {category_label}.",
            "detected_signals": [category],
        },
        "priority_breakdown": {
            "total_score": priority_score,
            "level": priority,
            "items": [
                {
                    "name": "Nhãn demo",
                    "score": priority_score,
                    "reason": "Điểm ưu tiên được seed để phục vụ demo dữ liệu mẫu.",
                    "matched_terms": [category],
                }
            ],
        },
    }


def add_analysis(db, ticket: Ticket, row: dict[str, str]) -> None:
    category = row["category"].strip()
    priority = row["priority"].strip()
    department = DEPARTMENT_BY_CATEGORY.get(category, "Bộ phận tiếp nhận phản ánh")
    priority_score = PRIORITY_SCORE.get(priority, 50)
    category_label = row["category_label"].strip()

    ticket.assigned_department = ticket.assigned_department or department
    db.add(
        TicketAnalysis(
            ticket_id=ticket.id,
            predicted_category=category,
            category_label=category_label,
            category_confidence=0.86,
            priority=priority,
            priority_score=priority_score,
            suggested_department=department,
            duplicate_candidates=[],
            suggested_actions=ACTION_BY_CATEGORY.get(category, ACTION_BY_CATEGORY["other"]),
            analysis_metadata=build_analysis_metadata(row),
            model_version="seed-v1.0.0",
        )
    )


def main() -> None:
    if not SAMPLE_PATH.exists():
        raise FileNotFoundError(f"Sample file not found: {SAMPLE_PATH}")

    created = 0
    updated = 0
    skipped = 0

    with SessionLocal() as db:
        student = UserRepository.get_by_email(db, STUDENT_EMAIL)
        if student is None:
            raise RuntimeError("Demo student not found. Run backend/scripts/seed_users.py first.")

        with SAMPLE_PATH.open("r", encoding="utf-8", newline="") as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                title = row["title"].strip()
                description = row["description"].strip()
                category = row["category"].strip()

                existing_ticket = get_existing_ticket(db, title, student.id)
                if existing_ticket is not None:
                    if existing_ticket.analysis is None:
                        add_analysis(db, existing_ticket, row)
                        updated += 1
                    elif not existing_ticket.analysis.analysis_metadata:
                        existing_ticket.analysis.analysis_metadata = build_analysis_metadata(row)
                        updated += 1
                    else:
                        skipped += 1
                    continue

                department = DEPARTMENT_BY_CATEGORY.get(category, "Bộ phận tiếp nhận phản ánh")
                ticket = Ticket(
                    title=title,
                    description=description,
                    status=TicketStatus(row["status"].strip()),
                    created_by_id=student.id,
                    assigned_department=department,
                )
                db.add(ticket)
                db.flush()

                add_analysis(db, ticket, row)
                created += 1

        db.commit()

    print(f"seeded tickets: created={created}, updated={updated}, skipped={skipped}")


if __name__ == "__main__":
    main()
