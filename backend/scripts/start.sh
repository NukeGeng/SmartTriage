#!/usr/bin/env sh
# Khởi động backend trên Render: chạy migration + seed user demo rồi mới chạy API.
# Dùng làm Docker Command trên Render:  sh scripts/start.sh
set -e

echo "[start] alembic upgrade head..."
alembic upgrade head

echo "[start] seed demo users..."
python scripts/seed_users.py || echo "[start] seed bỏ qua (có thể đã tồn tại)"

echo "[start] launching uvicorn on port ${PORT:-8000}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
