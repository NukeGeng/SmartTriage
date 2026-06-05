# SmartTriage Backend

FastAPI service for SmartTriage business workflows. This service owns authentication, ticket APIs, dashboard aggregation, database access, and HTTP integration with the AI service.

## Setup Environment

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

## Database Migrations

Start PostgreSQL from the repository root, then run Alembic from `backend/`:

```bash
docker compose up -d postgres
alembic upgrade head
```

## Seed Demo Users

```bash
python scripts/seed_users.py
```

Demo password for all accounts:

```txt
12345678
```

Demo accounts:

```txt
admin@example.com      admin
it.staff@example.com   staff  Phòng CNTT
facility@example.com   staff  Phòng Cơ sở vật chất
training@example.com   staff  Phòng Đào tạo
finance@example.com    staff  Phòng Tài chính
student@example.com    student
```

## Start Server

```bash
uvicorn app.main:app --reload --port 8000
```

API documentation:

```txt
http://localhost:8000/docs
http://localhost:8000/redoc
```

## Health Check

```bash
curl http://localhost:8000/api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "Backend service is healthy",
  "data": {
    "service": "backend",
    "status": "ok"
  }
}
```
