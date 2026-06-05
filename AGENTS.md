# AGENTS.md - Rulebase cho SmartTriage AI Agents

Tài liệu này là quy tắc làm việc bắt buộc cho AI agents khi xây dựng hệ thống **SmartTriage: Hệ thống phân loại và ưu tiên phản ánh sinh viên bằng Machine Learning**.

Hệ thống được xây dựng theo kiến trúc tách service:

```txt
smarttriage/
├── frontend/        # Next.js + TypeScript + Tailwind CSS
├── backend/         # Python FastAPI - nghiệp vụ, auth, ticket, database
├── ai-service/      # Python FastAPI - ML inference, model, duplicate detection
├── datasets/        # Dataset huấn luyện / dữ liệu mẫu
├── docs/            # Tài liệu kỹ thuật, API, ML pipeline, demo script
├── scripts/         # Script setup/dev/demo
├── docker-compose.yml
├── Makefile
├── README.md
└── AGENTS.md
```

---

## 1. Nguyên tắc quan trọng nhất

Mỗi agent khi nhận một task/prompt phải làm theo quy trình sau:

1. Đọc task hiện tại và xác định đúng **branch tương ứng** trong bảng phân branch ở mục 8.
2. Kiểm tra trạng thái Git trước khi làm.
3. Tự tạo branch mới nếu branch chưa tồn tại.
4. Tự checkout sang branch đó trước khi sửa file.
5. Chỉ sửa các file nằm trong phạm vi task.
6. Chạy lệnh kiểm tra phù hợp sau khi hoàn thành.
7. Commit với message rõ ràng.
8. Không merge branch nếu chưa có yêu cầu.

Không được làm trực tiếp trên `main`.

---

## 2. Quy tắc Git bắt buộc

### 2.1. Kiểm tra trạng thái trước khi làm

Trước mỗi task, chạy:

```bash
git status
```

Nếu đang ở `main`, phải tạo hoặc checkout branch task.

### 2.2. Tạo và checkout branch mới

Nếu branch chưa tồn tại:

```bash
git checkout -b <branch-name>
```

Nếu branch đã tồn tại:

```bash
git checkout <branch-name>
```

### 2.3. Không ghi đè code chưa commit

Nếu `git status` cho thấy có thay đổi chưa commit không thuộc task hiện tại, không được tự ý ghi đè. Agent phải:

- đọc các file thay đổi,
- tránh sửa chồng lên vùng không liên quan,
- hoặc tạo commit riêng nếu thay đổi đó là kết quả hợp lệ của task trước.

### 2.4. Quy ước commit message

Dùng format:

```txt
<type>(<scope>): <summary>
```

Ví dụ:

```txt
feat(backend): add ticket workflow and ai analysis integration
feat(ai-service): add tfidf logistic regression training pipeline
feat(frontend): add ticket submission page
fix(docker): update service healthchecks
```

Các `type` hợp lệ:

```txt
feat      thêm chức năng
fix       sửa lỗi
refactor  tái cấu trúc không đổi behavior
docs      tài liệu
style     UI/style hoặc format code
test      test
chore     cấu hình, scripts, dependency
ci        workflow, docker, deployment
```

### 2.5. Commit sau mỗi prompt

Sau khi hoàn thành mỗi prompt, chạy:

```bash
git add .
git commit -m "<type>(<scope>): <summary>"
```

Nếu không có thay đổi:

```bash
git status
```

và ghi chú trong output task rằng không có file cần commit.

---

## 3. Quy tắc phạm vi service

### 3.1. `frontend/`

Chỉ chứa mã giao diện Next.js:

- App Router
- TypeScript
- Tailwind CSS
- UI components
- API client
- auth storage
- pages/routes
- dashboard UI

Không được đưa logic ML vào frontend.

### 3.2. `backend/`

Chỉ chứa backend nghiệp vụ:

- FastAPI API chính
- authentication / authorization
- user management
- ticket CRUD
- ticket workflow
- database models
- Alembic migrations
- AI service client
- dashboard aggregation API

Không được train model trong `backend/`.
Không được import trực tiếp code ML từ `ai-service/`.
Backend chỉ giao tiếp với AI service qua HTTP API.

### 3.3. `ai-service/`

Chỉ chứa AI/ML service:

- FastAPI AI inference API
- text preprocessing
- TF-IDF vectorizer
- Logistic Regression classifier
- LinearSVC nếu có phương án phụ
- duplicate detection bằng cosine similarity
- priority scoring
- department recommender
- action recommender
- model info endpoint

AI service không được truy cập trực tiếp database nghiệp vụ của backend, trừ khi task yêu cầu rõ. Backend sẽ gửi dữ liệu cần thiết qua request.

### 3.4. `datasets/`

Chứa dữ liệu huấn luyện và dữ liệu demo:

```txt
datasets/
├── raw/
├── processed/
└── README.md
```

Không commit dữ liệu nhạy cảm, thông tin cá nhân thật, mật khẩu, token hoặc dữ liệu không có quyền sử dụng.

### 3.5. `docs/`

Chứa tài liệu:

- kiến trúc hệ thống,
- API documentation,
- ML pipeline,
- demo script,
- báo cáo kỹ thuật draft,
- hướng dẫn setup.

---

## 4. Quy tắc kỹ thuật tổng thể

### 4.1. Backend

Backend dùng:

- Python 3.11+
- FastAPI
- SQLAlchemy 2.x
- Alembic
- PostgreSQL
- Pydantic v2
- JWT authentication
- httpx để gọi AI service
- pytest cho test

Backend phải có cấu trúc tối thiểu:

```txt
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   └── main.py
├── alembic/
├── tests/
├── requirements.txt
└── .env.example
```

### 4.2. AI Service

AI service dùng:

- Python 3.11+
- FastAPI
- scikit-learn
- pandas
- numpy
- joblib
- Pydantic v2
- pytest

AI service phải có cấu trúc tối thiểu:

```txt
ai-service/
├── app/
│   ├── api/
│   │   └── v1/
│   ├── core/
│   ├── ml/
│   │   ├── preprocessing.py
│   │   ├── predictor.py
│   │   ├── priority_scorer.py
│   │   ├── duplicate_detector.py
│   │   ├── department_recommender.py
│   │   └── action_recommender.py
│   ├── schemas/
│   ├── services/
│   └── main.py
├── data/
├── models/
├── scripts/
├── tests/
├── requirements.txt
└── .env.example
```

### 4.3. Frontend

Frontend dùng:

- Next.js App Router
- TypeScript
- Tailwind CSS
- fetch hoặc axios
- component-based structure

Frontend phải có cấu trúc tối thiểu:

```txt
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── lib/
│   ├── types/
│   └── styles/
├── public/
├── package.json
└── .env.local.example
```

---

## 5. Quy tắc ML bắt buộc

ML phải có mô hình, thuật toán và pipeline rõ ràng.

### 5.1. Category Classification

Mô hình chính:

```txt
TF-IDF Vectorizer + Logistic Regression
```

Nhiệm vụ:

```txt
Input: title + description của ticket
Output: category + confidence
```

Các nhãn gợi ý:

```txt
account_system
network
classroom_device
facility
schedule_exam
tuition_payment
document_profile
learning_platform
feedback
other
```

### 5.2. Duplicate Detection

Thuật toán:

```txt
TF-IDF Vectorization + Cosine Similarity
```

Nhiệm vụ:

```txt
So sánh ticket mới với danh sách ticket đang mở để tìm phản ánh tương tự.
```

Ngưỡng similarity mặc định:

```txt
0.70 trở lên: nghi ngờ trùng hoặc liên quan mạnh
0.50 - 0.69: liên quan vừa
Dưới 0.50: không coi là trùng
```

### 5.3. Priority Scoring

Thuật toán:

```txt
Rule-based scoring + category weight + urgent keyword weight + deadline signal + duplicate cluster signal
```

Công thức gợi ý:

```txt
priority_score =
    category_weight
  + urgent_keyword_score
  + deadline_score
  + affected_scope_score
  + duplicate_cluster_score
```

Mapping:

```txt
0 - 39     low
40 - 69    medium
70 - 100   high
```

### 5.4. Department Recommendation

Thuật toán:

```txt
Rule-based mapping theo category
```

Ví dụ:

```txt
account_system      -> Phòng CNTT
network             -> Phòng CNTT
learning_platform   -> Phòng CNTT
classroom_device    -> Phòng Cơ sở vật chất
facility            -> Phòng Cơ sở vật chất
schedule_exam       -> Phòng Đào tạo
tuition_payment     -> Phòng Tài chính
document_profile    -> Phòng Công tác sinh viên
feedback            -> Bộ phận tiếp nhận phản ánh
other               -> Bộ phận tiếp nhận phản ánh
```

### 5.5. Action Recommendation

Thuật toán:

```txt
Rule-based action templates theo category + priority
```

Mỗi category nên có tối thiểu 3 gợi ý xử lý ban đầu.

---

## 6. Quy tắc API giữa backend và AI service

Backend gọi AI service qua HTTP.

Endpoint chính:

```http
POST /api/v1/analyze-ticket
```

Request từ backend sang AI service:

```json
{
  "ticket_id": "TCK-001",
  "title": "Không đăng nhập được hệ thống thi",
  "description": "Em không đăng nhập được vào hệ thống thi online, sáng mai em có lịch thi.",
  "created_by_role": "student",
  "open_tickets": [
    {
      "ticket_id": "TCK-018",
      "title": "Lỗi đăng nhập hệ thống thi online",
      "description": "Không thể đăng nhập vào hệ thống thi.",
      "category": "account_system"
    }
  ]
}
```

Response từ AI service:

```json
{
  "category": "account_system",
  "category_label": "Tài khoản / Hệ thống",
  "confidence": 0.87,
  "priority": "high",
  "priority_score": 82,
  "suggested_department": "Phòng CNTT",
  "duplicate_candidates": [
    {
      "ticket_id": "TCK-018",
      "similarity": 0.78,
      "title": "Lỗi đăng nhập hệ thống thi online"
    }
  ],
  "suggested_actions": [
    "Kiểm tra trạng thái tài khoản sinh viên",
    "Reset mật khẩu nếu thông tin xác thực hợp lệ",
    "Xác minh lịch thi để ưu tiên xử lý"
  ],
  "model_version": "v1.0.0"
}
```

Backend phải lưu kết quả này vào bảng/phần `ticket_analysis`.

---

## 7. Quy tắc chất lượng code

### 7.1. Không hardcode secret

Không commit:

- JWT secret thật,
- database password thật,
- API key,
- token,
- file `.env` thật.

Chỉ commit `.env.example`.

### 7.2. API phải có schema rõ

Mọi request/response FastAPI phải dùng Pydantic schema.

Không trả dict tùy tiện ở nhiều nơi nếu đã có schema.

### 7.3. Error handling

Backend và AI service phải có error response thống nhất:

```json
{
  "detail": "Human readable error message"
}
```

### 7.4. Logging

Các điểm cần log:

- backend start,
- AI service start,
- ticket created,
- AI analysis requested,
- AI analysis failed,
- model loaded,
- prediction completed.

Không log password/token.

### 7.5. Test tối thiểu

Backend cần test:

- health check,
- auth login,
- create ticket,
- ticket triggers AI analysis,
- dashboard summary.

AI service cần test:

- health check,
- preprocessing,
- category prediction,
- priority scoring,
- duplicate detection,
- analyze-ticket endpoint.

Frontend cần ít nhất kiểm tra:

- TypeScript build,
- lint,
- các route chính render không lỗi.

---

## 8. Bảng phân branch theo prompt/task

Agent phải dùng đúng branch tương ứng với prompt. Nếu prompt được mở rộng hoặc task có liên quan nhiều prompt, chọn branch gần nhất theo nhóm tính năng.

| Prompt | Nội dung chính | Branch bắt buộc |
|---:|---|---|
| 1 | Khởi tạo monorepo và tài liệu gốc | `chore/p01-monorepo-init` |
| 2 | Makefile điều phối lệnh toàn dự án | `chore/p02-root-makefile` |
| 3 | Khởi tạo Backend FastAPI project | `feat/p03-backend-init` |
| 4 | Backend settings, database session, Alembic | `feat/p04-backend-db-config` |
| 5 | Database models User, Ticket, TicketAnalysis | `feat/p05-backend-models` |
| 6 | Backend Pydantic schemas | `feat/p06-backend-schemas` |
| 7 | Authentication JWT backend | `feat/p07-backend-auth` |
| 8 | Seed dữ liệu user mẫu | `feat/p08-backend-seed-users` |
| 9 | AI client trong backend | `feat/p09-backend-ai-client` |
| 10 | Ticket CRUD và workflow gọi AI service | `feat/p10-backend-ticket-workflow` |
| 11 | Dashboard API backend | `feat/p11-backend-dashboard-api` |
| 12 | Backend error handling, logging, API docs | `feat/p12-backend-observability-docs` |
| 13 | Khởi tạo AI Service FastAPI project | `feat/p13-ai-service-init` |
| 14 | Schemas cho AI Service analyze-ticket | `feat/p14-ai-service-schemas` |
| 15 | Tiền xử lý văn bản tiếng Việt | `feat/p15-ai-text-preprocessing` |
| 16 | Dataset mẫu cho ML | `feat/p16-ml-dataset` |
| 17 | Train model TF-IDF + Logistic Regression | `feat/p17-ml-training-category` |
| 18 | Evaluate model và metrics report | `feat/p18-ml-evaluation` |
| 19 | Predictor module cho AI Service | `feat/p19-ai-predictor` |
| 20 | Priority Scorer | `feat/p20-ai-priority-scorer` |
| 21 | Department Recommender | `feat/p21-ai-department-recommender` |
| 22 | Action Recommender | `feat/p22-ai-action-recommender` |
| 23 | Duplicate Detector bằng Cosine Similarity | `feat/p23-ai-duplicate-detector` |
| 24 | Analysis Service kết hợp ML modules | `feat/p24-ai-analysis-service` |
| 25 | Endpoint analyze-ticket | `feat/p25-ai-analyze-endpoint` |
| 26 | Endpoint model-info | `feat/p26-ai-model-info-endpoint` |
| 27 | Backend gọi AI service thật khi tạo ticket | `feat/p27-backend-ai-integration` |
| 28 | Duplicate detection với ticket thực tế từ backend | `feat/p28-backend-duplicate-context` |
| 29 | Khởi tạo Next.js frontend | `feat/p29-frontend-init` |
| 30 | Frontend layout và theme | `feat/p30-frontend-layout-theme` |
| 31 | Frontend API client và auth storage | `feat/p31-frontend-api-auth-client` |
| 32 | Trang Login | `feat/p32-frontend-login` |
| 33 | Trang danh sách ticket | `feat/p33-frontend-ticket-list` |
| 34 | Form gửi phản ánh mới | `feat/p34-frontend-ticket-create` |
| 35 | Trang chi tiết ticket | `feat/p35-frontend-ticket-detail` |
| 36 | Dashboard frontend | `feat/p36-frontend-dashboard` |
| 37 | Admin Ticket Management page | `feat/p37-frontend-admin-tickets` |
| 38 | Dockerfile backend và ai-service | `ci/p38-service-dockerfiles` |
| 39 | Docker Compose toàn hệ thống | `ci/p39-docker-compose` |
| 40 | Scripts setup nhanh cho demo | `chore/p40-demo-setup-scripts` |
| 41 | Backend tests auth và ticket workflow | `test/p41-backend-tests` |
| 42 | AI service tests | `test/p42-ai-service-tests` |
| 43 | End-to-end test toàn hệ thống | `test/p43-e2e-system-test` |
| 44 | Tài liệu kiến trúc hệ thống | `docs/p44-system-architecture` |
| 45 | Tài liệu ML pipeline và thuật toán | `docs/p45-ml-pipeline` |
| 46 | API documentation markdown | `docs/p46-api-documentation` |
| 47 | Demo script 3-5 phút | `docs/p47-demo-script` |
| 48 | README cuối cùng | `docs/p48-final-readme` |
| 49 | Feedback loop cho ML | `feat/p49-ml-feedback-loop` |
| 50 | Trang Model Info frontend | `feat/p50-frontend-model-info` |
| 51 | Realtime notification đơn giản | `feat/p51-realtime-notification` |
| 52 | Docker production polish | `ci/p52-docker-production-polish` |
| 53 | Final polish trước khi nộp | `chore/p53-final-polish` |

---

## 9. Quy trình chạy bắt buộc cho mỗi prompt

Agent phải bắt đầu bằng template sau:

```bash
# 1. Kiểm tra branch hiện tại và thay đổi đang có
git status
git branch --show-current

# 2. Tạo hoặc checkout branch theo bảng phân branch
# Ví dụ Prompt 17:
git checkout -b feat/p17-ml-training-category || git checkout feat/p17-ml-training-category

# 3. Kiểm tra lại
git status
git branch --show-current
```

Sau khi hoàn thành code:

```bash
# Chạy kiểm tra phù hợp
# Backend
cd backend && pytest

# AI service
cd ai-service && pytest

# Frontend
cd frontend && npm run lint && npm run build

# Toàn hệ thống nếu có Docker
make test
```

Sau đó commit:

```bash
git add .
git commit -m "feat(scope): clear summary"
```

---

## 10. Lệnh kiểm tra theo service

### 10.1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest
uvicorn app.main:app --reload --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```

### 10.2. AI Service

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest
uvicorn app.main:app --reload --port 8001
```

Health check:

```bash
curl http://localhost:8001/health
```

Model info:

```bash
curl http://localhost:8001/api/v1/model-info
```

Analyze ticket:

```bash
curl -X POST http://localhost:8001/api/v1/analyze-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TCK-DEMO-001",
    "title": "Không đăng nhập được hệ thống thi",
    "description": "Em không đăng nhập được vào hệ thống thi online, sáng mai em có lịch thi.",
    "created_by_role": "student",
    "open_tickets": []
  }'
```

### 10.3. Frontend

```bash
cd frontend
npm install
npm run lint
npm run build
npm run dev
```

### 10.4. Docker

```bash
docker compose up --build
```

Kiểm tra service:

```bash
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:3000
```

---

## 11. Quy tắc thiết kế database

Backend cần các bảng cốt lõi:

```txt
users
- id
- full_name
- email
- password_hash
- role
- created_at
- updated_at

tickets
- id
- code
- title
- description
- status
- created_by_id
- assigned_department
- assigned_to_id
- created_at
- updated_at

ticket_analyses
- id
- ticket_id
- category
- category_label
- confidence
- priority
- priority_score
- suggested_department
- suggested_actions_json
- duplicate_candidates_json
- model_version
- created_at

ticket_comments
- id
- ticket_id
- author_id
- content
- created_at
```

Status ticket gợi ý:

```txt
new
analyzing
open
in_progress
resolved
closed
rejected
```

Role gợi ý:

```txt
student
staff
admin
```

---

## 12. Quy tắc UI/UX frontend

Frontend phải thể hiện được giá trị ML, không chỉ CRUD.

Các màn hình bắt buộc:

1. Login
2. Student ticket list
3. Create ticket form
4. Ticket detail with AI analysis
5. Admin ticket management
6. Dashboard
7. Model Info page nếu làm prompt 50

Ticket detail phải hiển thị:

- category,
- confidence,
- priority,
- priority score,
- suggested department,
- duplicate candidates,
- suggested actions,
- status workflow.

Dashboard phải hiển thị:

- tổng số ticket,
- ticket theo category,
- ticket theo priority,
- ticket theo status,
- top vấn đề nổi bật,
- ticket ưu tiên cao.

---

## 13. Quy tắc tài liệu

Mọi thay đổi lớn phải cập nhật tài liệu tương ứng.

Tài liệu bắt buộc:

```txt
docs/system-architecture.md
docs/ml-pipeline.md
docs/api-documentation.md
docs/demo-script.md
README.md
```

Trong `docs/ml-pipeline.md` phải có:

- bài toán ML,
- dataset,
- preprocessing,
- thuật toán,
- công thức priority scoring,
- duplicate detection,
- metrics,
- limitation,
- hướng phát triển.

---

## 14. Quy tắc không bỏ sót khi làm task

Trước khi kết thúc mỗi prompt, agent phải tự kiểm tra checklist:

```txt
[ ] Đã checkout đúng branch.
[ ] Đã tạo/sửa đúng file theo phạm vi task.
[ ] Không sửa file ngoài phạm vi nếu không cần thiết.
[ ] Không commit secret hoặc file .env thật.
[ ] Đã chạy lệnh kiểm tra phù hợp.
[ ] Đã cập nhật tài liệu nếu task ảnh hưởng kiến trúc/API/ML.
[ ] Đã commit với message đúng format.
[ ] Đã ghi chú những phần chưa hoàn thành nếu có.
```

---

## 15. Quy tắc xử lý khi task phụ thuộc task trước

Nếu task hiện tại phụ thuộc code chưa có từ task trước:

1. Không tự ý bỏ qua yêu cầu.
2. Tạo phần interface/schema tối thiểu để task hiện tại chạy được.
3. Ghi rõ TODO trong code nếu cần.
4. Ghi chú trong output task rằng task trước chưa có hoặc chưa đầy đủ.

Ví dụ:

```python
# TODO(p27): replace mock AI response with real ai-service client once p25 is complete.
```

Nhưng không được lạm dụng TODO để né việc chính.

---

## 16. Quy tắc integration

Backend và AI service phải tích hợp qua HTTP, không import chéo.

Đúng:

```txt
backend/services/ai_client.py -> httpx.post(AI_SERVICE_URL + "/api/v1/analyze-ticket")
```

Sai:

```txt
backend imports ai-service/app/ml/predictor.py
```

Frontend chỉ gọi backend.

Đúng:

```txt
frontend -> backend -> ai-service
```

Sai:

```txt
frontend -> ai-service
```

Lý do: frontend không nên gọi trực tiếp AI service vì AI service là internal service.

---

## 17. Quy tắc demo

Luồng demo phải ổn định:

1. Đăng nhập student.
2. Tạo ticket phản ánh lỗi hệ thống thi.
3. Backend gọi AI service.
4. AI service trả phân loại, priority, duplicate, suggested actions.
5. Student xem trạng thái.
6. Admin xem dashboard.
7. Admin xử lý ticket.
8. Dashboard cập nhật số liệu.

Dữ liệu demo nên có sẵn tối thiểu:

- 2 user student,
- 1 user staff,
- 1 user admin,
- 20-50 ticket mẫu,
- vài ticket trùng/chủ đề tương tự.

---

## 18. Quy tắc ưu tiên khi có xung đột

Nếu có xung đột giữa prompt và AGENTS.md:

1. Nếu liên quan đến an toàn dữ liệu, secret, branch, Git workflow: ưu tiên AGENTS.md.
2. Nếu liên quan đến nội dung chức năng cụ thể: ưu tiên prompt hiện tại.
3. Nếu prompt yêu cầu sửa kiến trúc lớn: cập nhật AGENTS.md hoặc ghi chú cần cập nhật.

---

## 19. Definition of Done toàn dự án

Dự án được xem là hoàn thành khi:

```txt
[ ] docker compose up --build chạy được.
[ ] Frontend mở được tại http://localhost:3000.
[ ] Backend health check chạy tại http://localhost:8000/health.
[ ] AI service health check chạy tại http://localhost:8001/health.
[ ] Student tạo ticket được.
[ ] Backend lưu ticket vào database.
[ ] Backend gọi AI service khi tạo ticket.
[ ] AI service trả category, confidence, priority, duplicate candidates, suggested department, suggested actions.
[ ] Admin xem dashboard được.
[ ] Admin cập nhật trạng thái ticket được.
[ ] Dataset và model training script có trong repo.
[ ] Có file model hoặc có script train model rõ ràng.
[ ] Có tài liệu kiến trúc.
[ ] Có tài liệu ML pipeline.
[ ] Có API documentation.
[ ] Có demo script 3-5 phút.
[ ] Không có secret trong repo.
[ ] README hướng dẫn setup rõ ràng.
```

---

## 20. Ghi chú cho AI agents

Mục tiêu của hệ thống không phải chỉ là CRUD ticket. Mục tiêu là chứng minh một hệ thống backend Python có tích hợp ML thực tế:

```txt
Ticket workflow + Machine Learning classification + Priority scoring + Duplicate detection + Dashboard
```

Vì vậy, mọi agent phải đảm bảo phần ML được thể hiện rõ trong code, API, UI và tài liệu.
