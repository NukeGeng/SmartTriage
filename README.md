# SmartTriage

SmartTriage là hệ thống phân loại và ưu tiên phản ánh sinh viên bằng Machine Learning. Dự án được thiết kế theo kiến trúc tách service để phần nghiệp vụ, giao diện và AI/ML có thể phát triển độc lập nhưng vẫn tích hợp qua HTTP API.

## Kiến Trúc Service

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

Ba service chính:

- `frontend/`: giao diện Next.js App Router cho sinh viên, nhân viên và quản trị viên.
- `backend/`: FastAPI business API xử lý authentication, ticket workflow, database và dashboard.
- `ai-service/`: FastAPI ML inference API xử lý phân loại ticket, priority scoring, duplicate detection và gợi ý phòng ban/hành động.

## Stack Công Nghệ

- Frontend: Next.js, TypeScript, Tailwind CSS.
- Backend: Python 3.11+, FastAPI, SQLAlchemy, Alembic, PostgreSQL, JWT.
- AI Service: Python 3.11+, FastAPI, scikit-learn, pandas, numpy, joblib.
- ML: TF-IDF Vectorizer, Logistic Regression, Cosine Similarity, rule-based scoring.
- Local infrastructure: Docker Compose, PostgreSQL 16 Alpine.

## Cách Chạy Local

Hiện tại repository mới khởi tạo PostgreSQL nền tảng cho local development:

```bash
docker compose up -d postgres
docker compose config
```

Khi các service được triển khai ở những prompt tiếp theo, dự kiến chạy:

```bash
cd backend
uvicorn app.main:app --reload --port 8000

cd ../ai-service
uvicorn app.main:app --reload --port 8001

cd ../frontend
npm run dev
```

## Service Và Port

| Service | URL | Mô tả |
| --- | --- | --- |
| Frontend | http://localhost:3000 | Giao diện người dùng |
| Backend | http://localhost:8000 | API nghiệp vụ chính |
| AI Service | http://localhost:8001 | API phân tích ML |
| PostgreSQL | localhost:5432 | Database chính |

## Cấu Trúc Thư Mục

```txt
smarttriage/
├── frontend/
├── backend/
├── ai-service/
├── infra/
│   ├── postgres/
│   └── nginx/
├── docs/
│   ├── report/
│   ├── api/
│   └── demo/
├── datasets/
│   ├── raw/
│   ├── processed/
│   └── samples/
├── scripts/
├── docker-compose.yml
├── Makefile
└── README.md
```
