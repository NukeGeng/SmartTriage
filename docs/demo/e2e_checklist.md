# SmartTriage E2E Demo Checklist

Checklist này dùng để kiểm thử luồng demo đầy đủ: PostgreSQL, backend, AI service, frontend, đăng nhập, tạo ticket, xem phân tích AI, dashboard và cập nhật trạng thái.

## 1. Chuẩn Bị Môi Trường

Yêu cầu:

- Python 3.11+
- Node.js 22+
- Docker Desktop hoặc PostgreSQL local
- Backend dependencies đã cài trong `backend/.venv`
- AI service dependencies đã cài trong `ai-service/.venv`
- Frontend đã chạy `npm install`

Tạo file env local nếu chưa có:

```bash
cp backend/.env.example backend/.env
cp ai-service/.env.example ai-service/.env
cp frontend/.env.local.example frontend/.env.local
```

## 2. Chạy PostgreSQL

```bash
docker compose up -d postgres
docker compose ps
```

Kết quả mong đợi:

- Container `smarttriage-postgres` chạy.
- Port `5432` mở ở local.

## 3. Migration Và Seed Backend

```bash
cd backend
python -m alembic upgrade head
python scripts/seed_users.py
```

Kết quả mong đợi:

- Alembic upgrade không lỗi.
- Có user demo trong database.

## 4. Generate Dataset Và Train Model

```bash
cd ai-service
python scripts/generate_sample_dataset.py
python scripts/train_category_model.py
python scripts/build_duplicate_index.py
```

Kết quả mong đợi:

- Có dataset tại `ai-service/data/raw/ticket_samples.csv`.
- Có model artifacts trong `ai-service/models/`.
- Có duplicate index tại `ai-service/data/tickets_index/sample_existing_tickets.csv`.

## 5. Chạy AI Service

```bash
cd ai-service
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Kiểm tra:

```bash
curl http://localhost:8001/api/v1/health
curl http://localhost:8001/api/v1/model-info
```

Kết quả mong đợi:

- Health trả `service: ai-service`, `status: ok`.
- Model info trả algorithm và danh sách categories.

## 6. Chạy Backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Kiểm tra:

```bash
curl http://localhost:8000/api/v1/health
```

Kết quả mong đợi:

- Health trả `service: backend`, `status: ok`.
- Backend dùng `AI_SERVICE_URL=http://localhost:8001`.

## 7. Chạy Frontend

```bash
cd frontend
npm run dev
```

Mở:

```txt
http://localhost:3000/login
```

Kết quả mong đợi:

- Trang login hiển thị.
- Có demo accounts dưới form.

## 8. Account Demo

```txt
student@example.com / 12345678
admin@example.com / 12345678
it.staff@example.com / 12345678
```

## 9. Dữ Liệu Ticket Demo

Title:

```txt
Không đăng nhập được hệ thống thi online
```

Description:

```txt
Em không đăng nhập được vào hệ thống thi online, sáng mai em có lịch thi nên cần hỗ trợ gấp.
```

Kết quả AI mong đợi:

- Category gần với `account_system`.
- Priority là `high`.
- Suggested department là phòng CNTT hoặc bộ phận tương ứng.
- Có suggested actions.
- Nếu có ticket tương tự đang mở, duplicate candidates xuất hiện.

## 10. Luồng E2E Chính

1. Login bằng `student@example.com`.
2. Vào `/tickets/new`.
3. Tạo ticket với dữ liệu demo ở trên.
4. Sau khi submit, frontend hiển thị trạng thái đang gửi và phân tích bằng AI.
5. Mở ticket detail.
6. Kiểm tra AI analysis panel có category, confidence, priority score, suggested department, duplicate candidates, suggested actions và model version.
7. Logout.
8. Login bằng `admin@example.com`.
9. Vào `/dashboard`.
10. Kiểm tra tổng số ticket, ticket theo category, priority, status và recent tickets.
11. Vào `/admin/tickets`.
12. Đổi status ticket sang `in_progress`.
13. Mở detail ticket để xác nhận status đã cập nhật.

## 11. Kiểm Tra Qua API

Login student:

```bash
curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"12345678"}'
```

Analyze ticket trực tiếp ở AI service:

```bash
curl -X POST http://localhost:8001/api/v1/analyze-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TCK-DEMO-001",
    "title": "Không đăng nhập được hệ thống thi online",
    "description": "Em không đăng nhập được vào hệ thống thi online, sáng mai em có lịch thi.",
    "created_by_role": "student",
    "existing_tickets": []
  }'
```

## 12. Chạy Bằng Docker Compose

Khi Docker Desktop đang chạy:

```bash
docker compose build
docker compose up -d
docker compose ps
```

Kiểm tra:

```bash
curl http://localhost:8000/api/v1/health
curl http://localhost:8001/api/v1/health
```

## 13. Lỗi Thường Gặp

Docker daemon không chạy:

```txt
failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine
```

Cách xử lý:

- Mở Docker Desktop.
- Chờ Docker báo `Running`.
- Chạy lại `docker compose build`.

Database chưa migration:

```txt
relation "users" does not exist
```

Cách xử lý:

```bash
cd backend
python -m alembic upgrade head
python scripts/seed_users.py
```

Frontend login lỗi network:

- Kiểm tra backend đang chạy ở `http://localhost:8000`.
- Kiểm tra `frontend/.env.local` có `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`.
- Restart `npm run dev` sau khi đổi env.

AI analysis không xuất hiện:

- Kiểm tra AI service ở `http://localhost:8001/api/v1/health`.
- Kiểm tra backend env `AI_SERVICE_URL=http://localhost:8001` khi chạy local.
- Nếu AI service tắt, backend vẫn tạo ticket nhưng analysis có thể rỗng.
