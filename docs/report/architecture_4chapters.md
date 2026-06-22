# SmartTriage — Tổng hợp kiến trúc cho báo cáo (4 chương)

> Bộ tư liệu kiến trúc tổng hợp **đúng theo codebase thực tế** (đối chiếu `docker-compose.yml`,
> `requirements.txt`, `package.json`, router API, module ML và models DB). Các sơ đồ viết bằng
> **Mermaid** — render trực tiếp trên Notion/Typora/VS Code/GitLab hoặc export ảnh chèn Word.

## Bố cục 4 chương

| Chương | Nội dung | Sơ đồ dùng |
|---|---|---|
| **C1. Tổng quan đề tài** | Bài toán, mục tiêu, phạm vi, tác nhân | Use case tổng quát |
| **C2. Công nghệ & cơ sở lý thuyết** | Tech stack, thuật toán ML | Bảng tech stack, sơ đồ ML |
| **C3. Phân tích & thiết kế hệ thống** | Kiến trúc phân tầng, pipeline, sequence, CSDL | Kiến trúc phân tầng + Pipeline + Sequence + ERD |
| **C4. Triển khai & kết quả** | Container hóa, luồng vận hành, đánh giá | Sơ đồ deployment |

---

# CHƯƠNG 1 — Use case tổng quát

**Tác nhân:** Student (sinh viên), Staff (cán bộ phòng ban), Admin (quản trị/điều phối), và
**AI Service** (tác nhân hệ thống thực hiện phân tích).

```mermaid
flowchart LR
    student(["👤 Student"])
    staff(["👤 Staff"])
    admin(["👤 Admin"])
    ai(["⚙️ AI Service"])

    subgraph SYS["Hệ thống SmartTriage"]
        UC1(("Đăng nhập / Xác thực"))
        UC2(("Gửi phản ánh"))
        UC3(("Xem danh sách / chi tiết phản ánh"))
        UC4(("Xem kết quả AI Triage Analysis"))
        UC5(("Cập nhật trạng thái / định tuyến"))
        UC6(("Dashboard thống kê"))
        UC7(("Smart Triage Cockpit"))
        UC8(("Quản lý nhóm sự cố (Incident Groups)"))
        UC9(("AI Review Queue / sửa nhãn"))
        UC10(("ML Feedback & Training Pipeline"))
        UC11(("Xem Model Info"))
        UC12(("Phân tích lại toàn bộ (Re-analyze)"))
        UC13(("Phân loại & chấm điểm ticket"))
    end

    student --- UC1 & UC2 & UC3 & UC4
    staff --- UC1 & UC3 & UC5 & UC7 & UC8
    admin --- UC1 & UC6 & UC7 & UC8 & UC9 & UC10 & UC11 & UC12
    UC2 -. "«include»" .-> UC13
    UC12 -. "«include»" .-> UC13
    UC13 --- ai
```

> UC2 (gửi phản ánh) và UC12 (re-analyze) đều **«include»** UC13 (AI phân tích) — điểm thể hiện
> giá trị ML cốt lõi, không phải CRUD thuần.

---

# CHƯƠNG 2 — Tech stack & thuật toán ML

## 2.1 Bảng công nghệ (đối chiếu thực tế)

| Tầng | Công nghệ | Phiên bản/ghi chú |
|---|---|---|
| **Frontend** | Next.js (App Router), React, TypeScript, Tailwind CSS, lucide-react | Next 16.2.7 · React 19 · TS 5.7 · Tailwind 3.4 |
| **Backend** | FastAPI, SQLAlchemy 2.x, Alembic, Pydantic v2 / pydantic-settings, python-jose (JWT), passlib+bcrypt, httpx | Auth JWT HS256, token 60' |
| **AI Service** | FastAPI, scikit-learn, pandas, numpy, joblib | TF-IDF + Logistic Regression |
| **CSDL** | PostgreSQL | postgres:16-alpine |
| **Giao tiếp** | REST/JSON; Frontend→Backend (JWT Bearer); Backend→AI (HTTP httpx) | FE **không** gọi trực tiếp AI |
| **Hạ tầng** | Docker, Docker Compose, healthcheck | 4 service |
| **Artifact ML** | joblib (`.joblib`) + metadata JSON | versioned dataset & model |

## 2.2 Thành phần thuật toán ML (module trong `ai-service/app/ml/`)

```mermaid
flowchart TD
    IN["Title + Description"] --> PRE["preprocessing<br/>(combine_title_description)"]
    PRE --> VEC["TF-IDF Vectorizer"]
    VEC --> CLF["Logistic Regression<br/>predict_proba"]
    CLF --> CAT["Category + Confidence"]

    PRE --> PRIO["priority_scorer (rule-based)<br/>category weight + urgent keyword<br/>+ deadline + scope + duplicate cluster"]
    CAT --> PRIO
    PRIO --> PR["Priority + Priority Score (0–100)"]

    CAT --> DEP["department_recommender<br/>(rule map theo category)"]
    PRE --> DUP["duplicate_detector<br/>(TF-IDF + Cosine Similarity)"]
    CAT --> ACT["action_recommender<br/>(templates theo category+priority)"]
    CAT --> EXP["explanation_builder<br/>(summary + lý do + tín hiệu)"]

    PR & DEP & DUP & ACT & EXP --> OUT["AnalyzeTicketResponse"]
```

- **Phân loại:** TF-IDF + Logistic Regression → `category` + `confidence` (max `predict_proba`);
  có fallback rule-based bằng từ khóa khi thiếu artifact.
- **Phát hiện trùng:** TF-IDF + Cosine Similarity với ticket đang mở (ngưỡng ~0.70 trùng mạnh /
  0.50–0.69 liên quan).
- **Chấm ưu tiên:** cộng điểm rule-based → map `0–39 low · 40–69 medium · 70–100 high`.
- **Đề xuất phòng ban / hành động:** rule-based theo category (+priority).

---

# CHƯƠNG 3 — Thiết kế hệ thống

## 3.1 Kiến trúc phân tầng

```mermaid
flowchart TB
    subgraph L1["① Tầng trình diễn — Next.js 16 (Client)"]
        FE["Landing · Login · Tickets · Ticket Detail · Create<br/>Dashboard · Triage Cockpit · Incidents · Review · ML Feedback · Model Info"]
    end

    subgraph L2["② Tầng nghiệp vụ / API — FastAPI Backend (:8000)"]
        AUTH["Auth & Users (JWT, RBAC)"]
        TIC["Tickets (CRUD + workflow + reanalyze + export)"]
        DASH["Dashboard aggregation"]
        TRI["Admin Triage / Incident Groups"]
        TP["Training Pipeline (sync/review/dataset)"]
        CLIENT["AI Service Client (httpx)"]
    end

    subgraph L3["③ Tầng AI/ML — FastAPI AI Service (:8001)"]
        ANALYZE["/analyze-ticket · /model-info · /health"]
        MLCORE["ML core: predictor · priority_scorer<br/>duplicate_detector · recommenders · incident_grouper"]
    end

    subgraph L4["④ Tầng dữ liệu"]
        PG[("PostgreSQL 16<br/>users · tickets · ticket_analyses<br/>incident_groups · dataset_versions · training_samples")]
        ART[["Model artifacts (joblib)<br/>+ datasets versioned (đĩa)"]]
    end

    FE -->|REST/JSON + JWT| L2
    CLIENT -->|HTTP POST| ANALYZE
    ANALYZE --> MLCORE
    MLCORE -.->|load| ART
    L2 -->|SQLAlchemy ORM| PG
    AUTH --- TIC --- DASH --- TRI --- TP --- CLIENT
```

> Nguyên tắc tách tầng: **Frontend chỉ gọi Backend**; Backend giao tiếp AI Service qua HTTP
> (không import chéo code ML); AI Service không truy cập DB nghiệp vụ.

## 3.2 Pipeline ML — Offline (huấn luyện) & Online (suy luận)

```mermaid
flowchart LR
    subgraph OFF["Offline — Training Pipeline (Admin)"]
        R["Ticket resolved"] --> SYNC["Sync → training_samples (candidate)"]
        SYNC --> REV["Admin review:<br/>approve / exclude / sửa nhãn"]
        REV --> DS["Dataset version<br/>(synthetic-v2 + curated)"]
        DS --> TRAIN["Train: TF-IDF + LogReg"]
        TRAIN --> RUN["Run artifacts + metadata<br/>(accuracy, macro_f1, confusion)"]
        RUN --> PROMOTE["Promote → MODEL_DIR<br/>(current_model.json)"]
    end

    subgraph ON["Online — Inference (mỗi ticket)"]
        T["Ticket mới"] --> AN["analyze-ticket"]
        AN --> SAVE["Lưu ticket_analyses"]
    end

    PROMOTE -. "model phục vụ" .-> AN
    SAVE -. "khi resolved" .-> R
    PROMOTE -. "Re-analyze hàng loạt" .-> AN
```

> Vòng phản hồi ML khép kín: ticket đã xử lý → dữ liệu huấn luyện → model mới → promote →
> (re-analyze) cập nhật lại ticket cũ.

## 3.3 Sequence — Gửi phản ánh + AI phân tích (luồng lõi)

```mermaid
sequenceDiagram
    actor S as Student
    participant FE as Frontend
    participant BE as Backend (FastAPI)
    participant AI as AI Service
    participant DB as PostgreSQL

    S->>FE: Nhập tiêu đề + mô tả
    FE->>BE: POST /api/v1/tickets (JWT)
    BE->>DB: Lưu ticket (status=analyzing)
    BE->>DB: Lấy danh sách ticket đang mở (context trùng lặp)
    BE->>AI: POST /api/v1/analyze-ticket (title, desc, open_tickets)
    AI->>AI: TF-IDF→LogReg, priority, duplicate, department, actions
    AI-->>BE: category, confidence, priority_score, duplicates, actions, model_version
    BE->>DB: Lưu ticket_analyses + set status=open, assigned_department
    BE-->>FE: TicketDetail (kèm analysis)
    FE-->>S: Hiển thị AI Triage Analysis
```

## 3.4 Sequence — Re-analyze sau khi train model mới (Admin)

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend (Model Info)
    participant BE as Backend
    participant AI as AI Service
    participant DB as PostgreSQL

    A->>FE: Bấm "Phân tích lại"
    FE->>BE: POST /api/v1/tickets/reanalyze (admin)
    BE->>DB: list_all tickets + analysis
    loop mỗi ticket
        BE->>AI: analyze-ticket (model mới)
        AI-->>BE: kết quả mới
        BE->>DB: ghi đè ticket_analyses (giữ nhãn tay & phòng ban)
    end
    BE-->>FE: {total, updated, created, failed, model_version}
```

## 3.5 ERD — Lược đồ CSDL

```mermaid
erDiagram
    USERS ||--o{ TICKETS : "tạo"
    TICKETS ||--o| TICKET_ANALYSES : "có 1"
    INCIDENT_GROUPS ||--o{ INCIDENT_GROUP_TICKETS : "gồm"
    TICKETS ||--o{ INCIDENT_GROUP_TICKETS : "thuộc"
    TICKETS ||--o{ TRAINING_SAMPLES : "sinh ra"
    DATASET_VERSIONS ||--o{ TRAINING_SAMPLES : "gom"

    USERS { uuid id; string full_name; string email; string role; string department }
    TICKETS { uuid id; string title; text description; enum status; uuid created_by_id; string assigned_department; string manual_category; string manual_priority }
    TICKET_ANALYSES { uuid id; uuid ticket_id; string predicted_category; float category_confidence; string priority; int priority_score; string suggested_department; json duplicate_candidates; json suggested_actions; json analysis_metadata; string model_version }
    INCIDENT_GROUPS { uuid id; string title; enum status }
    DATASET_VERSIONS { uuid id; string version; enum status }
    TRAINING_SAMPLES { uuid id; uuid source_ticket_id; string category; string priority; string label_source; enum review_status }
```

---

# CHƯƠNG 4 — Triển khai (Deployment)

```mermaid
flowchart TB
    subgraph DC["Docker Compose"]
        F["frontend :3000<br/>Next.js"]
        B["backend :8000<br/>FastAPI + Alembic"]
        A["ai-service :8001<br/>FastAPI + sklearn"]
        P[("postgres :5432<br/>postgres:16-alpine<br/>volume: smarttriage_pgdata")]
    end
    U(["Người dùng / Browser"]) --> F
    F -->|NEXT_PUBLIC_BACKEND_URL| B
    B -->|AI_SERVICE_URL| A
    B -->|DATABASE_URL| P
    B -. "depends_on healthy" .-> P
    B -. "depends_on healthy" .-> A
    F -. "depends_on healthy" .-> B
```

- Mỗi service có **healthcheck**; backend khởi động chạy `alembic upgrade head` rồi `uvicorn`.
- Khởi chạy toàn hệ thống: `docker compose up --build` → FE `:3000`,
  BE `:8000/api/v1/health`, AI `:8001/api/v1/health`.
- Biến môi trường chính: `DATABASE_URL`, `AI_SERVICE_URL`, `JWT_SECRET_KEY`, `MODEL_DIR`, `DATASET_PATH`.
