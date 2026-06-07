import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository


DEMO_USERS = [
    {
        "email": "admin@example.com",
        "full_name": "Demo Admin",
        "role": UserRole.ADMIN,
        "department": None,
    },
    {
        "email": "it.staff@example.com",
        "full_name": "IT Staff",
        "role": UserRole.STAFF,
        "department": "Phòng CNTT",
    },
    {
        "email": "facility@example.com",
        "full_name": "Facility Staff",
        "role": UserRole.STAFF,
        "department": "Phòng Cơ sở vật chất",
    },
    {
        "email": "training@example.com",
        "full_name": "Training Staff",
        "role": UserRole.STAFF,
        "department": "Phòng Đào tạo",
    },
    {
        "email": "finance@example.com",
        "full_name": "Finance Staff",
        "role": UserRole.STAFF,
        "department": "Phòng Tài chính",
    },
    {
        "email": "student@example.com",
        "full_name": "Demo Student",
        "role": UserRole.STUDENT,
        "department": None,
    },
]


def main() -> None:
    password_hash = hash_password("12345678")
    with SessionLocal() as db:
        for item in DEMO_USERS:
            existing_user = UserRepository.get_by_email(db, item["email"])
            if existing_user is not None:
                print(f"exists  {item['email']} ({existing_user.role.value})")
                continue

            user = User(
                full_name=item["full_name"],
                email=item["email"],
                hashed_password=password_hash,
                role=item["role"],
                department=item["department"],
            )
            UserRepository.create(db, user)
            print(f"created {item['email']} ({item['role'].value})")


if __name__ == "__main__":
    main()
