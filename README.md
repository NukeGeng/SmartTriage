# SmartTriage

SmartTriage là hệ thống phân loại và ưu tiên phản ánh sinh viên bằng Machine Learning. Dự án mô phỏng một helpdesk nội bộ cho trường học, nơi sinh viên gửi phản ánh, hệ thống tự phân loại vấn đề, tính độ ưu tiên, phát hiện phản ánh tương tự và gợi ý phòng ban xử lý.

## Problem Statement

Trong môi trường trường học, phản ánh của sinh viên thường đến từ nhiều nhóm vấn đề khác nhau như tài khoản, hệ thống thi, mạng, thiết bị phòng học, cơ sở vật chất, học phí, hồ sơ hoặc lịch thi. Nếu xử lý thủ công, bộ phận tiếp nhận dễ gặp các vấn đề:

- Mất thời gian đọc và phân loại từng phản ánh.
- Khó xác định ticket nào cần xử lý gấp.
- Dễ bỏ sót các phản ánh trùng lặp hoặc liên quan.
- Khó tổng hợp số liệu theo category, priority và status.
- Khó chứng minh quy trình xử lý có dữ liệu và có thể đo lường.

SmartTriage giải quyết bài toán này bằng workflow ticket kết hợp AI service riêng.

## Features

- Đăng ký, đăng nhập bằng JWT.
- Phân quyền `student`, `staff`, `admin`.
- Sinh viên tạo và theo dõi ticket.
- Backend tự gọi AI service khi tạo ticket.
- AI service phân loại category bằng TF-IDF + Logistic Regression.
- Tính priority score bằng rule-based scoring.
- Phát hiện duplicate candidates bằng cosine similarity.
- Gợi ý phòng ban xử lý.
- Gợi ý hành động ban đầu cho staff/admin.
- Staff/admin cập nhật status, department, manual category và manual priority.
- Admin export training data từ nhãn AI và nhãn chỉnh thủ công để cải thiện model.
- Admin/staff xem Model Info để giải trình thuật toán, metrics và trạng thái model.
- Dashboard và admin ticket management tự refresh định kỳ để tạo cảm giác realtime.
- Dashboard thống kê ticket theo category, priority, status.
- Docker Compose cho local infrastructure.
- Test suite cho backend, AI service và frontend build/lint.

## Architecture

```txt
Next.js Frontend
    |
    | HTTP REST
    v
FastAPI Backend Service
    |                    |
    | PostgreSQL         | HTTP REST nội bộ
    v                    v
PostgreSQL          FastAPI AI Service
                         |
                         v
             TF-IDF + Logistic Regression
             Cosine Similarity Duplicate Detection
             Rule-based Priority Scoring
```

Service chính:

| Service | Vai trò | Port |
| --- | --- | --- |
| Frontend | Next.js UI cho student/staff/admin | 3000 |
| Backend | FastAPI nghiệp vụ, auth, ticket, dashboard | 8000 |
| AI Service | FastAPI ML inference và recommenders | 8001 |
| PostgreSQL | Database chính | 5432 |

Chi tiết kiến trúc: [docs/report/system_architecture.md](docs/report/system_architecture.md)

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS.
- Backend: Python 3.11, FastAPI, SQLAlchemy 2.x, Alembic, PostgreSQL, JWT.
- AI Service: Python 3.11, FastAPI, scikit-learn, pandas, numpy, joblib.
- ML: TF-IDF Vectorizer, Logistic Regression, cosine similarity, rule-based scoring.
- Infrastructure: Docker Compose, PostgreSQL 16 Alpine.
- Tests: pytest, FastAPI TestClient, frontend lint/build.

## ML Algorithms

SmartTriage dùng pipeline ML/rule-based gồm:

1. Text preprocessing: chuẩn hóa title + description, giữ dấu tiếng Việt.
2. Category classification: TF-IDF Vectorizer + Logistic Regression.
3. Priority scoring: category weight + urgent keywords + deadline signal + affected scope.
4. Duplicate detection: TF-IDF vectorization + cosine similarity.
5. Department recommendation: rule-based mapping theo category.
6. Action recommendation: template xử lý theo category và priority.

Chi tiết ML pipeline: [docs/report/ml_pipeline.md](docs/report/ml_pipeline.md)

Pipeline hai luồng, dataset versioning và model promotion: [docs/report/offline_training_pipeline.md](docs/report/offline_training_pipeline.md)

## Folder Structure

```txt
smarttriage/
├── frontend/        # Next.js + TypeScript + Tailwind CSS
├── backend/         # FastAPI business API, auth, ticket, dashboard
├── ai-service/      # FastAPI ML inference service
├── datasets/        # Dataset huấn luyện và dữ liệu demo
├── docs/
│   ├── api/         # API documentation
│   ├── demo/        # E2E checklist và video script
│   └── report/      # System architecture và ML pipeline
├── scripts/         # Setup, seed, train helpers
├── docker-compose.yml
├── Makefile
├── README.md
└── AGENTS.md
```

## Setup Local

### Quick Start Một Lệnh

```bash
npm start
```

Lệnh này sẽ:

1. Tạo các file env local từ `.env.example` nếu còn thiếu.
2. Tạo virtual environment và cài dependencies cho backend/AI service nếu còn thiếu.
3. Cài frontend dependencies nếu `node_modules` chưa có.
4. Chạy PostgreSQL bằng Docker Compose.
5. Chạy migration, seed user demo, 100 phản ánh demo và incident groups demo.
6. Train AI model nếu artifacts chưa có.
7. Chạy AI service, backend và frontend cùng lúc.

Muốn chạy toàn bộ bằng container Docker:

```bash
npm run start:docker
```

### 1. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python scripts/seed_users.py
```

Windows PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
python scripts\seed_users.py
```

### 3. Setup AI Service

```bash
cd ../ai-service
cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/generate_sample_dataset.py
python scripts/train_category_model.py --dataset-path data/training/versions/synthetic-v2/training.csv --dataset-version synthetic-v2 --promote
python scripts/build_duplicate_index.py
```

Windows PowerShell:

```powershell
cd ..\ai-service
Copy-Item .env.example .env
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts\generate_sample_dataset.py
python scripts\train_category_model.py --dataset-path data\training\versions\synthetic-v2\training.csv --dataset-version synthetic-v2 --promote
python scripts\build_duplicate_index.py
```

### 4. Setup Frontend

```bash
cd ../frontend
cp .env.local.example .env.local
npm install
```

Windows PowerShell:

```powershell
cd ..\frontend
Copy-Item .env.local.example .env.local
npm install
```

## Run Services

Terminal 1, AI service:

```bash
cd ai-service
uvicorn app.main:app --reload --port 8001
```

Terminal 2, backend:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Terminal 3, frontend:

```bash
cd frontend
npm run dev
```

Open:

```txt
http://localhost:3000/login
```

## Docker Compose

Khi Docker Desktop đang chạy:

```bash
docker compose build
docker compose up -d
docker compose ps
```

Health checks:

```bash
curl http://localhost:8000/api/v1/health
curl http://localhost:8001/api/v1/health
```

## Demo Accounts

Seed script tạo các tài khoản demo:

```txt
student@example.com / 12345678
admin@example.com / 12345678
it.staff@example.com / 12345678
facility@example.com / 12345678
training@example.com / 12345678
finance@example.com / 12345678
```

## Demo Ticket

```txt
Title: Không đăng nhập được hệ thống thi online
Description: Em không đăng nhập được vào hệ thống thi online, sáng mai em có lịch thi. Mong phòng CNTT hỗ trợ gấp.
```

Kết quả AI mong đợi:

- Category: Tài khoản / Hệ thống.
- Priority: High.
- Department: Phòng CNTT.
- Suggested actions: kiểm tra tài khoản, reset mật khẩu, xác minh lịch thi.

## API Docs

- Backend API: [docs/api/backend_api.md](docs/api/backend_api.md)
- AI Service API: [docs/api/ai_service_api.md](docs/api/ai_service_api.md)

## Demo Docs

- E2E checklist: [docs/demo/e2e_checklist.md](docs/demo/e2e_checklist.md)
- Video demo script: [docs/demo/video_demo_script.md](docs/demo/video_demo_script.md)

## Tests

Backend:

```bash
cd backend
pytest
```

AI service:

```bash
cd ai-service
pytest
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Screenshots Placeholder

Thêm screenshot vào phần này khi quay demo hoặc hoàn thiện báo cáo:

- Login page.
- Student ticket list.
- Create ticket form.
- Ticket detail with AI analysis.
- Admin dashboard.
- Admin ticket management.

## Team Info Placeholder

```txt
Team name:
Members:
School:
Course/Class:
Instructor:
Submission date:
```

## Known Limitations

- Dataset hiện là dữ liệu mẫu, chưa đại diện đầy đủ cho phản ánh thật.
- TF-IDF + Logistic Regression là baseline, phù hợp MVP nhưng chưa hiểu ngữ nghĩa sâu như embedding/transformer.
- Priority scoring hiện là rule-based, cần hiệu chỉnh bằng feedback thực tế.
- Docker build/up cần Docker Desktop đang chạy trên máy local.
