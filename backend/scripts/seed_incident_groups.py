import sys
from pathlib import Path

from sqlalchemy import select

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.db.session import SessionLocal
from app.models.incident_group import IncidentGroup, IncidentGroupTicket
from app.models.ticket import Ticket


DEMO_GROUPS = [
    {
        "title": "Sự cố hệ thống thi online",
        "description": "Nhiều phản ánh liên quan đến đăng nhập, tài khoản và lịch thi trực tuyến.",
        "category": "account_system",
        "priority": "high",
        "department": "Phòng CNTT",
        "keywords": ["thi", "đăng nhập", "tài khoản"],
    },
    {
        "title": "Sự cố Wifi khu B",
        "description": "Nhiều sinh viên phản ánh wifi/mạng khu B yếu hoặc chập chờn.",
        "category": "network",
        "priority": "medium",
        "department": "Phòng CNTT",
        "keywords": ["wifi", "b305", "mạng"],
    },
    {
        "title": "Sự cố thiết bị trình chiếu phòng học",
        "description": "Các phản ánh liên quan đến máy chiếu, HDMI và thiết bị trình chiếu.",
        "category": "classroom_device",
        "priority": "medium",
        "department": "Phòng Cơ sở vật chất",
        "keywords": ["máy chiếu", "hdmi", "trình chiếu"],
    },
]


def _matches(ticket: Ticket, keywords: list[str]) -> bool:
    text = f"{ticket.title} {ticket.description}".lower()
    return any(keyword in text for keyword in keywords)


def main() -> None:
    created = 0
    skipped = 0

    with SessionLocal() as db:
        tickets = list(db.execute(select(Ticket).order_by(Ticket.created_at.asc())).scalars().all())
        for item in DEMO_GROUPS:
            existing = db.execute(
                select(IncidentGroup).where(IncidentGroup.title == item["title"])
            ).scalar_one_or_none()
            if existing is not None:
                skipped += 1
                continue

            related_tickets = [ticket for ticket in tickets if _matches(ticket, item["keywords"])][:4]
            if len(related_tickets) < 2:
                skipped += 1
                continue

            group = IncidentGroup(
                title=item["title"],
                description=item["description"],
                category=item["category"],
                priority=item["priority"],
                suggested_department=item["department"],
            )
            db.add(group)
            db.flush()
            for index, ticket in enumerate(related_tickets):
                db.add(
                    IncidentGroupTicket(
                        incident_group_id=group.id,
                        ticket_id=ticket.id,
                        similarity_score=round(0.88 - index * 0.05, 2),
                        reason="Dữ liệu demo cùng chủ đề/sự cố.",
                    )
                )
            created += 1

        db.commit()

    print(f"seeded incident groups: created={created}, skipped={skipped}")


if __name__ == "__main__":
    main()
