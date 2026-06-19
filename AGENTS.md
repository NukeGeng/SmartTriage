# AGENTS.md - Rulebase cho SmartTriage AI Agents

> Phiên bản hợp nhất: giữ toàn bộ rulebase cũ của dự án và bổ sung quy tắc frontend redesign, skill loading, mascot/TriageBot.

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

## 0. Skill files bắt buộc

Dự án sử dụng skill files trong thư mục `.ai/skills/`. Agent phải đọc skill **trước khi viết code**, không đọc sau khi đã sinh code.

### 0.1. Frontend task

Với mọi task liên quan đến frontend, UI, UX, layout, component, page, styling, animation, theme, dashboard, form, navigation hoặc redesign, agent phải đọc đủ **3 skill theo đúng thứ tự**:

```txt
.ai/skills/component-structure/SKILL.md
.ai/skills/anti-slop-ui/SKILL.md
.ai/skills/redesign/SKILL.md
```

Không được làm frontend nếu chưa đọc 3 file trên.

### 0.2. Ý nghĩa từng skill

#### `component-structure`

Phụ trách cấu trúc component:

- chia UI thành `layout`, `sections`, `features`, `ui`;
- không viết page/component nguyên khối;
- component dùng PascalCase;
- page route chỉ compose component;
- static content đưa vào `data/` hoặc config;
- mỗi component nên dưới 150 dòng;
- ưu tiên import alias `@/`.

#### `anti-slop-ui`

Phụ trách chất lượng thị giác:

- UI phải có hệ màu, typography, spacing, radius token rõ ràng;
- animation tối thiểu 5/10;
- có hover, stagger, scroll reveal hoặc ambient motion phù hợp;
- không dùng giao diện dashboard chung chung;
- không dùng background grid/dot matrix rẻ tiền;
- không dùng style copy-paste kiểu AI slop.

#### `redesign`

Phụ trách định hướng riêng của SmartTriage:

- frontend phải truyền tải cảm giác **AI-assisted triage command center**;
- không được biến app thành CRUD ticket dashboard tẻ nhạt;
- các màn phải làm nổi bật AI analysis, priority breakdown, incident grouping, review queue, ML feedback;
- nếu có mascot/floating assistant, phải là **TriageBot** có ngữ cảnh nghiệp vụ, không phải hình trang trí vô nghĩa.

### 0.3. Quy tắc bắt buộc khi làm frontend redesign

Mỗi frontend redesign task phải bắt đầu bằng các bước:

```bash
# 1. Đọc skills
cat .ai/skills/component-structure/SKILL.md
cat .ai/skills/anti-slop-ui/SKILL.md
cat .ai/skills/redesign/SKILL.md

# 2. Kiểm tra branch
git status
git branch --show-current
```

Agent phải tự thực hiện pre-flight audit trước khi sửa code:

```txt
[ ] Màn này phục vụ flow nào của SmartTriage?
[ ] AI/ML value được nhìn thấy ở đâu?
[ ] Component tree đã rõ chưa?
[ ] Có component nào quá 150 dòng không?
[ ] Có dùng token màu/spacing/radius/motion nhất quán không?
[ ] Mascot nếu xuất hiện có message theo ngữ cảnh không?
[ ] UI có còn giống CRUD dashboard thường không?
```

### 0.4. Khi nào phải đọc redesign skill?

Bắt buộc đọc `.ai/skills/redesign/SKILL.md` khi task có một trong các nội dung:

- redesign frontend;
- sửa giao diện hiện tại;
- làm layout/dashboard;
- làm Ticket Detail;
- làm AI Analysis Panel;
- làm Triage Cockpit;
- làm Incident Groups;
- làm AI Review Queue;
- làm ML Feedback Loop;
- làm Demo Flow;
- thêm mascot/TriageBot/Floating AI Guide;
- chỉnh màu, animation, typography, responsive;
- refactor UI component.

### 0.5. Frontend output protocol

Khi làm frontend, agent phải ghi trong output task:

```txt
Skills used:
- component-structure
- anti-slop-ui
- redesign

Aesthetic direction:
- <mô tả ngắn>

Component tree:
- <liệt kê cây component chính>

Files changed:
- <danh sách file>

Checks:
- npm run lint
- npm run build
```

Nếu không thể chạy check, phải ghi rõ lý do.


## 1. Nguyên tắc quan trọng nhất

Agent **không được tạo một branch mới cho mỗi prompt nhỏ**. Một branch đại diện cho **một feature/module lớn**. Nhiều prompt nhỏ có cùng phạm vi kỹ thuật phải được thực hiện trên cùng một branch feature.

Ví dụ:

- Prompt 3 → Prompt 12 đều thuộc backend nền tảng, dùng chung các branch backend theo nhóm ở mục 8.
- Prompt 13 → Prompt 26 thuộc AI service, dùng các branch AI/ML theo nhóm ở mục 8.
- Prompt 29 → Prompt 37 thuộc frontend, dùng các branch frontend theo nhóm ở mục 8.

Quy trình bắt buộc:

1. Đọc prompt/task hiện tại.
2. Xác định task thuộc **nhóm tính năng** nào trong bảng phân branch ở mục 8.
3. Kiểm tra Git status trước khi sửa code.
4. Đảm bảo tồn tại branch `develop`. Nếu chưa có thì tạo `develop` từ `main`.
5. Checkout hoặc tạo branch feature tương ứng từ `develop`.
6. Nếu đang làm tiếp một prompt cùng nhóm, tiếp tục dùng branch feature hiện tại, không tạo branch mới.
7. Chỉ sửa file trong phạm vi feature/module đó.
8. Chạy lệnh kiểm tra phù hợp.
9. Commit theo từng phần logic nhỏ nếu cần, nhưng vẫn trong cùng branch feature.
10. Chỉ tạo Pull Request khi **hoàn thành toàn bộ nhóm feature/module**, không tạo PR sau từng prompt nhỏ.
11. Khi kiểm tra pass, merge Pull Request vào `develop`.

Không được làm trực tiếp trên `main` hoặc `develop`, trừ các thao tác tạo branch, cập nhật branch hoặc merge Pull Request đã hoàn tất kiểm tra.
---

## 2. Quy tắc Git bắt buộc

### 2.1. Kiểm tra trạng thái trước khi làm

Trước mỗi task, chạy:

```bash
git status
```

Nếu đang ở `main`, phải chuyển sang `develop` hoặc tạo `develop` trước; không tạo branch task trực tiếp từ `main`.

### 2.2. Tạo và checkout branch mới

Branch task luôn phải được tạo từ `develop`.

Nếu branch chưa tồn tại:

```bash
git checkout develop
git pull origin develop || true
git checkout -b <branch-name>
```

Nếu branch đã tồn tại:

```bash
git fetch origin
git checkout <branch-name>
git rebase develop || git merge develop
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

### 2.5. Commit theo từng phần logic, không commit máy móc theo từng prompt

Không bắt buộc mỗi prompt phải có một commit riêng. Agent nên commit khi hoàn thành một phần logic có ý nghĩa, ví dụ:

- hoàn thành backend settings + database session,
- hoàn thành ticket models + schemas,
- hoàn thành ML training pipeline,
- hoàn thành frontend ticket form.

Lệnh commit:

```bash
git add .
git commit -m "<type>(<scope>): <summary>"
```

Nếu prompt chỉ là kiểm tra, chỉnh sửa nhỏ hoặc tiếp tục phần đang làm, có thể gộp commit với phần logic liên quan. Tuy nhiên trước khi tạo PR, branch phải có commit đầy đủ và lịch sử rõ ràng.


### 2.6. Branch tích hợp `develop` và quy trình PR/Merge

`develop` là branch tích hợp chính cho toàn bộ quá trình phát triển. Mọi feature/fix/docs branch phải được tạo từ `develop` và sau khi hoàn thành phải merge ngược vào `develop` thông qua Pull Request.

#### 2.6.1. Tạo branch `develop` khi bắt đầu dự án

Khi bắt đầu task đầu tiên, nếu chưa có branch `develop`, agent phải tạo branch này từ `main`:

```bash
git checkout main
git pull origin main || true
git checkout -b develop
git push -u origin develop || true
```

Nếu `develop` đã tồn tại ở remote:

```bash
git fetch origin
git checkout develop
git pull origin develop
```

#### 2.6.2. Tạo branch task từ `develop`

Mọi branch task phải xuất phát từ `develop`:

```bash
git checkout develop
git pull origin develop || true
git checkout -b <branch-name>
```

Nếu branch task đã tồn tại:

```bash
git fetch origin
git checkout <branch-name>
git rebase develop || git merge develop
```

#### 2.6.3. Tạo Pull Request vào `develop` sau khi hoàn thành branch feature

Sau khi hoàn thành **toàn bộ nhóm prompt thuộc branch feature**, đã commit và đã chạy kiểm tra, agent phải push branch và tạo Pull Request vào `develop`. Không tạo PR sau từng prompt nhỏ nếu các prompt đó vẫn nằm trong cùng feature branch.

```bash
git push -u origin <branch-name>
```

Nếu có GitHub CLI:

```bash
gh pr create \
  --base develop \
  --head <branch-name> \
  --title "<type>(<scope>): <summary>" \
  --body "Completed task for SmartTriage. Includes implementation, checks, and relevant documentation updates."
```

Nếu không có GitHub CLI, agent phải ghi rõ nội dung PR cần tạo thủ công:

```txt
Base branch: develop
Compare branch: <branch-name>
Title: <type>(<scope>): <summary>
Body:
- Summary of changes
- Commands/tests executed
- Files or modules affected
- Known limitations, if any
```

#### 2.6.4. Merge Pull Request vào `develop`

Sau khi Pull Request đã được tạo, agent phải đảm bảo các kiểm tra tối thiểu đã pass trước khi merge:

```bash
git status
```

Chạy kiểm tra tương ứng theo service đã sửa:

```bash
# Backend
cd backend && pytest

# AI service
cd ai-service && pytest

# Frontend
cd frontend && npm run lint && npm run build
```

Nếu có GitHub CLI và kiểm tra pass:

```bash
gh pr merge <pr-number-or-url> --squash --delete-branch
```

Sau khi merge, cập nhật local `develop`:

```bash
git checkout develop
git pull origin develop
```

Nếu không có GitHub CLI hoặc môi trường không cho phép tạo/merge PR, agent phải:

1. Push branch lên remote.
2. Ghi rõ PR title, PR body, base branch `develop`.
3. Không tự merge bằng cách commit trực tiếp vào `develop`.
4. Báo rõ rằng bước PR/merge cần thực hiện thủ công trên Git hosting.

#### 2.6.5. Không merge vào `main` trong giai đoạn phát triển

`main` chỉ dùng cho bản ổn định hoặc bản nộp cuối. Không merge feature branch trực tiếp vào `main`. Khi toàn bộ dự án hoàn tất, chỉ merge `develop` vào `main` sau khi đã chạy kiểm tra end-to-end, build Docker và hoàn thiện tài liệu nộp bài.

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
- AI Analysis UI
- Triage Cockpit UI
- Incident Groups UI
- AI Review Queue UI
- ML Feedback UI
- Demo Flow UI
- Floating AI Guide / TriageBot mascot UI

Không được đưa logic ML vào frontend.

Frontend chỉ được hiển thị kết quả AI/ML do backend trả về. Frontend không gọi trực tiếp `ai-service`.

Với mọi task trong `frontend/`, agent bắt buộc đọc:

```txt
.ai/skills/component-structure/SKILL.md
.ai/skills/anti-slop-ui/SKILL.md
.ai/skills/redesign/SKILL.md
```

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

## 8. Bảng phân branch theo nhóm tính năng

Agent phải chọn branch theo **module/feature lớn**, tuyệt đối không tạo branch theo từng prompt. File prompt có 53 prompt để chia nhỏ công việc cho dễ chạy, nhưng **không có nghĩa là 53 branch**.

Quy tắc chuẩn:

- Tổng số branch feature chính nên nằm trong khoảng **10–12 branch**.
- Một branch có thể xử lý nhiều prompt liên tiếp nếu cùng một module.
- Chỉ tạo PR khi hoàn thành trọn vẹn module/feature của branch đó.
- Nếu prompt hiện tại là phần tiếp nối của module đang làm, tiếp tục dùng branch cũ.
- Không tạo các branch kiểu `feat/prompt-17`, `feat/p18-evaluate`, `feat/day-1`, `feat/task-003`.
- Chỉ tạo branch mới ngoài bảng này nếu xuất hiện một module lớn hoàn toàn mới, có phạm vi độc lập rõ ràng.

### 8.1. Danh sách branch chuẩn của dự án

| Nhóm prompt | Module lớn | Branch sử dụng | Phạm vi gộp trong branch | Khi nào tạo PR vào `develop`? |
|---|---|---|---|---|
| Prompt 1–2 | Project foundation | `chore/project-foundation` | Monorepo, README gốc, Makefile, cấu trúc thư mục, `.env.example`, quy ước chạy local | Khi root project chạy được lệnh kiểm tra cơ bản |
| Prompt 3–12 | Backend core | `feat/backend-core` | FastAPI backend, settings, database, Alembic, models, schemas, auth, user roles, ticket workflow, dashboard API, logging, error handling, AI client interface | Khi backend API chính chạy được, auth/ticket/dashboard hoạt động ổn định |
| Prompt 13–26 | AI service core + ML | `feat/ai-service-ml-core` | FastAPI AI service, schemas, preprocessing, dataset, TF-IDF, Logistic Regression/LinearSVC, training, evaluation, predictor, priority scorer, duplicate detector, recommender, `/analyze-ticket`, `/model-info` | Khi AI service train được model, sinh artifact, inference endpoint chạy ổn định |
| Prompt 27–28 | Backend ↔ AI integration | `feat/backend-ai-integration` | Backend gọi AI service thật, gửi open tickets, lưu kết quả phân tích ML vào database, fallback khi AI service lỗi | Khi tạo ticket end-to-end có kết quả phân tích từ AI service |
| Prompt 29–37 | Frontend app | `feat/frontend-app` | Next.js foundation, layout/theme, API client, auth flow, ticket list, create ticket, ticket detail, admin dashboard, admin ticket management | Khi frontend build/lint pass và dùng được các luồng chính qua backend |
| Prompt 38–40 | Local dev infrastructure | `ci/local-dev-infra` | Dockerfile cho từng service, Docker Compose, healthcheck cơ bản, script setup/demo local | Khi `docker compose up --build` chạy được toàn hệ thống |
| Prompt 41–43 | Test suite | `test/system-test-suite` | Backend tests, AI service tests, integration/E2E tests tối thiểu, test commands trong README | Khi test suite tối thiểu pass và có hướng dẫn chạy test |
| Prompt 44–48 | Project documentation | `docs/project-documentation` | Kiến trúc hệ thống, ML pipeline, API docs, demo script 3–5 phút, README hoàn chỉnh | Khi docs đủ để nộp bài và người khác có thể setup/chạy project |
| Prompt 49–51 | Advanced features | `feat/advanced-demo-features` | ML feedback loop, frontend Model Info, realtime notification đơn giản | Khi các tính năng nâng cấp chạy được và không phá MVP |
| Prompt 52 | Deployment polish | `ci/deployment-polish` | Docker production polish, healthcheck tốt hơn, env hardening, cấu hình demo/deploy | Khi môi trường demo/deploy ổn định hơn |
| Prompt 53 | Final submission polish | `chore/final-submission-polish` | Cleanup cuối, sửa bug nhỏ toàn hệ thống, kiểm tra checklist nộp bài | Khi toàn bộ checklist cuối pass |

Tổng cộng: **11 branch chính**.

### 8.1.1. Branch bổ sung cho frontend redesign

Nếu dự án đã hoàn thành MVP và đang làm riêng giai đoạn redesign frontend, dùng các branch sau thay vì nhét tất cả vào `feat/frontend-app`.

| Nhóm redesign | Branch sử dụng | Phạm vi |
|---|---|---|
| Frontend redesign foundation | `feat/frontend-redesign-foundation` | Audit UI hiện tại, design tokens, layout shell, typography, spacing, shared UI primitives |
| AI Analysis UI | `feat/frontend-ai-analysis-ui` | Ticket detail, AI Analysis Panel, confidence, priority breakdown, suggested actions |
| Triage Cockpit UI | `feat/frontend-triage-cockpit` | Smart Triage Cockpit, critical queue, routing recommendations, low confidence preview |
| Incident Grouping UI | `feat/frontend-incident-groups` | Topic grouping, incident suggestions, incident list/detail UI |
| Review + Feedback UI | `feat/frontend-review-feedback` | AI Review Queue, ML Feedback Loop, corrected labels, export feedback UI |
| Mascot + Demo Flow | `feat/frontend-mascot-demo-flow` | Floating TriageBot, contextual messages, `/demo` guided flow |
| Frontend polish | `chore/frontend-redesign-polish` | Responsive, accessibility, animation polish, lint/build cleanup |

Quy tắc:

- Không tạo branch theo từng component nhỏ.
- Không tạo branch theo từng page nhỏ nếu page thuộc một nhóm redesign ở bảng trên.
- Nếu task chỉ sửa UI hiện tại mà không thay đổi backend/AI service, ưu tiên branch redesign tương ứng.
- Nếu task yêu cầu thay đổi API/backend để phục vụ UI, tạo branch backend riêng hoặc dùng branch integration phù hợp; không sửa backend lớn trong branch frontend trừ khi là type/schema client nhỏ.



### 8.2. Ví dụ chọn branch đúng

Nếu agent đang làm Prompt 17 `Train model TF-IDF + Logistic Regression`, branch đúng là:

```bash
git checkout develop
git pull origin develop || true
git checkout -b feat/ai-service-ml-core || git checkout feat/ai-service-ml-core
```

Nếu sau đó làm Prompt 18 `Evaluate model`, vẫn dùng lại branch:

```bash
git checkout feat/ai-service-ml-core
```

Không tạo:

```bash
feat/prompt-17-train-model
feat/prompt-18-evaluate-model
feat/ml-training-pipeline
```

Vì toàn bộ Prompt 13–26 đã được gom vào một module lớn: `feat/ai-service-ml-core`.

Nếu agent đang làm Prompt 33, 34, 35, 36 hoặc 37, tất cả dùng chung:

```bash
feat/frontend-app
```

Không tách thành:

```bash
feat/frontend-foundation
feat/frontend-auth
feat/frontend-ticket-workflow
feat/frontend-admin-dashboard
```

Vì các phần này đều là một module lớn: **frontend application**.

### 8.3. Khi nào mới được tạo branch mới ngoài bảng?

Chỉ tạo branch ngoài bảng khi thỏa cả 3 điều kiện:

1. Công việc không thuộc bất kỳ branch chuẩn nào ở mục 8.1.
2. Công việc có phạm vi độc lập, không phải task nhỏ của module hiện có.
3. Branch mới có thể tạo PR riêng mà không phụ thuộc vào việc đang làm dở trong branch khác.

Ví dụ hợp lệ:

```bash
feat/mobile-app
feat/observability-stack
feat/email-notification-service
```

Ví dụ không hợp lệ:

```bash
feat/fix-login-button
feat/add-one-api-route
feat/prompt-25
feat/update-readme-section
```

---

## 9. Quy trình chạy bắt buộc cho mỗi prompt

Agent phải bắt đầu bằng template sau:

```bash
# 1. Kiểm tra branch hiện tại và thay đổi đang có
git status
git branch --show-current

# 2. Đảm bảo develop tồn tại
git fetch origin || true
git checkout develop || (git checkout main && git pull origin main || true && git checkout -b develop)
git pull origin develop || true

# 3. Checkout branch feature theo nhóm prompt ở mục 8
# Ví dụ Prompt 17 hoặc 18 đều thuộc AI service + ML core:
git checkout -b feat/ai-service-ml-core || git checkout feat/ai-service-ml-core

# 4. Kiểm tra lại
git status
git branch --show-current
```

Nếu branch feature đã tồn tại và đang tiếp tục các prompt cùng nhóm, **không tạo branch mới**. Chỉ checkout lại branch đó và tiếp tục làm.

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

Định hướng sản phẩm:

```txt
SmartTriage không phải là một ticket CRUD dashboard.
SmartTriage là AI-assisted triage command center cho phản ánh sinh viên.
```

### 12.1. Skills bắt buộc

Trước mọi frontend task, agent phải đọc:

```txt
.ai/skills/component-structure/SKILL.md
.ai/skills/anti-slop-ui/SKILL.md
.ai/skills/redesign/SKILL.md
```

Nếu task là sửa UI nhưng agent không đọc đủ 3 skill trên, task xem như chưa hợp lệ.

### 12.2. Các màn hình bắt buộc

Các màn hình MVP:

1. Login
2. Student ticket list
3. Create ticket form
4. Ticket detail with AI analysis
5. Admin ticket management
6. Dashboard
7. Model Info page nếu làm prompt 50

Các màn hình redesign/nâng cấp nên có:

1. Student Submit Ticket
2. Ticket Detail + AI Triage Analysis
3. Admin Smart Triage Cockpit
4. Incident Groups / Topic Grouping
5. AI Review Queue
6. ML Feedback Loop
7. Demo Flow
8. Floating AI Guide / TriageBot mascot

### 12.3. Ticket detail bắt buộc làm nổi bật AI

Ticket detail phải hiển thị:

- category;
- category label;
- confidence;
- priority;
- priority score;
- priority breakdown nếu backend có;
- suggested department;
- duplicate candidates hoặc related topic candidates;
- incident/group suggestion nếu có;
- suggested actions;
- model version;
- status workflow.

Phải có section rõ:

```txt
AI Triage Analysis
```

Không được chỉ hiển thị vài dòng metadata nhỏ.

### 12.4. Dashboard/Triage Cockpit

Dashboard thường chỉ thống kê là chưa đủ. Admin cần có màn điều phối:

```txt
Smart Triage Cockpit
```

Triage Cockpit nên có:

- Critical Queue;
- Low Confidence Cases;
- Possible Incident Groups;
- AI Routing Recommendations;
- Recent Tickets;
- Summary cards.

Màn này phải trả lời câu hỏi:

```txt
Hôm nay admin/staff nên xử lý phản ánh nào trước?
```

### 12.5. Incident Groups / Topic Grouping

Nếu có nhiều phản ánh cùng chủ đề, UI phải thể hiện thành:

```txt
Gợi ý nhóm phản ánh cùng chủ đề
```

Không chỉ gọi là duplicate.

Ví dụ UI:

```txt
Chủ đề nghi ngờ: Sự cố Wifi khu B
Số phản ánh liên quan: 4
Mức tương đồng trung bình: 76%
Phòng ban đề xuất: Phòng CNTT
[ Xem phản ánh ] [ Gom thành nhóm ] [ Bỏ qua ]
```

### 12.6. Mascot / Floating AI Guide

Nếu thêm mascot, phải dùng như một assistant có ngữ cảnh, không phải ảnh trang trí.

Tên mặc định:

```txt
TriageBot
```

Mascot phải có các mood/state:

```txt
idle
thinking
success
alert
confused
```

Mapping gợi ý:

```txt
idle       -> Không có sự kiện quan trọng
thinking   -> AI đang phân tích ticket
success    -> Phân tích xong
alert      -> High priority hoặc incident detected
confused   -> Confidence thấp, cần review thủ công
```

Mascot message phải liên quan trực tiếp đến màn hiện tại.

Ví dụ hợp lệ:

```txt
Tôi phát hiện 3 phản ánh có thể cùng chủ đề Wifi khu B.
Ticket này ưu tiên cao vì liên quan đến thi online.
AI không chắc chắn về nhãn này, admin nên kiểm tra lại.
```

Ví dụ không hợp lệ:

```txt
Xin chào, chúc bạn một ngày tốt lành.
Tôi là robot dễ thương.
```

### 12.7. Component structure frontend

Frontend phải ưu tiên cấu trúc:

```txt
frontend/src/
├── app/
├── components/
│   ├── layout/
│   ├── sections/
│   ├── features/
│   ├── ui/
│   ├── ai/
│   ├── triage/
│   ├── incidents/
│   ├── review/
│   ├── feedback/
│   └── assistant/
├── data/
├── hooks/
├── lib/
├── styles/
└── types/
```

Không dồn UI vào một file page dài hàng trăm dòng.

### 12.8. UI quality bar

Không được để giao diện giống admin template mặc định.

Yêu cầu tối thiểu:

- có design tokens;
- có typography hierarchy rõ;
- có spacing scale;
- có hover micro-interaction;
- có loading/empty/error state;
- có responsive mobile/tablet/desktop;
- card không đều đều một kiểu;
- form tạo ticket phải giúp người dùng hiểu AI sẽ phân tích gì;
- các kết quả AI phải có explanation hoặc visual hierarchy đủ rõ.

Dashboard phải hiển thị:

- tổng số ticket;
- ticket theo category;
- ticket theo priority;
- ticket theo status;
- top vấn đề nổi bật;
- ticket ưu tiên cao;
- incident/topic group nếu có;
- low-confidence cases nếu có.

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
[ ] Frontend redesign đã đọc và áp dụng `.ai/skills/redesign/SKILL.md`.
[ ] Ticket Detail có AI Triage Analysis rõ ràng.
[ ] Triage Cockpit thể hiện được hàng đợi ưu tiên/incident/low confidence.
[ ] Incident/topic grouping nếu có được hiển thị bằng ngôn ngữ nghiệp vụ, không chỉ duplicate.
[ ] Mascot/TriageBot nếu có phải có message theo ngữ cảnh, không chỉ trang trí.
```

---

## 20. Ghi chú cho AI agents

Mục tiêu của hệ thống không phải chỉ là CRUD ticket. Mục tiêu là chứng minh một hệ thống backend Python có tích hợp ML thực tế:

```txt
Ticket workflow + Machine Learning classification + Priority scoring + Duplicate detection + Dashboard
```

Vì vậy, mọi agent phải đảm bảo phần ML được thể hiện rõ trong code, API, UI và tài liệu.


---

## 21. Quy tắc riêng cho frontend redesign phase

Khi task hiện tại là "chỉ làm lại frontend", agent phải ưu tiên các mục sau:

1. Không sửa backend hoặc ai-service nếu API hiện tại đã đủ dữ liệu.
2. Nếu thiếu dữ liệu để hiển thị UI, tạo adapter/mock fallback ở frontend trước; chỉ đề xuất backend change khi thật sự cần.
3. Luôn giữ frontend gọi backend, không gọi trực tiếp ai-service.
4. Các page cũ có thể được refactor nhưng không phá route đang hoạt động.
5. Tên page/menu phải nhấn mạnh nghiệp vụ:
   - `Smart Triage Cockpit`
   - `AI Review Queue`
   - `Incident Groups`
   - `ML Feedback Loop`
   - `AI Triage Analysis`
6. Mascot chỉ xuất hiện khi không che UI chính; phải có khả năng ẩn/thu gọn.
7. Mọi animation phải có mục đích: hướng mắt, báo trạng thái, làm rõ transition; không animate vô nghĩa.
8. Sau redesign, chạy:

```bash
cd frontend
npm run lint
npm run build
```

Nếu frontend có test:

```bash
npm test
```

---

## 22. Vị trí file skill trong repo

Repo nên có cấu trúc skill như sau:

```txt
.ai/
└── skills/
    ├── component-structure/
    │   └── SKILL.md
    ├── anti-slop-ui/
    │   └── SKILL.md
    └── redesign/
        └── SKILL.md
```

Frontend agents phải đọc đủ 3 file trên khi làm UI.

Nếu `.ai/skills/redesign/SKILL.md` không tồn tại, agent không được tự ý bỏ qua. Agent phải tạo file skill đó từ nội dung redesign đã được cung cấp trong dự án hoặc báo rõ thiếu file skill trước khi tiếp tục frontend redesign.
