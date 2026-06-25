# SmartTriage — Sơ đồ báo cáo (PlantUML)

> Mỗi sơ đồ nằm trong khối ```plantuml. Render bằng: VS Code (extension *PlantUML*),
> IntelliJ (plugin PlantUML), hoặc dán vào https://www.plantuml.com/plantuml.
> Cần Java + Graphviz cho các sơ đồ use case / deployment / ERD; mindmap và sequence
> không cần Graphviz.

---

## Hình 2.1. Sơ đồ Mindmap chức năng hệ thống

```plantuml
@startmindmap
skinparam shadowing false

*[#1F2937] SMARTTRIAGE

' ===================== NHÁNH BÊN PHẢI =====================
**[#3B82F6] Auth & Người dùng
***[#DBEAFE] Đăng nhập / JWT
***[#DBEAFE] Phân quyền (RBAC)
****[#EFF6FF] Sinh viên
****[#EFF6FF] Cán bộ (Staff)
****[#EFF6FF] Quản trị (Admin)
***[#DBEAFE] Hồ sơ / Đổi mật khẩu

**[#8B5CF6] Phản ánh (Ticket)
***[#EDE9FE] Gửi phản ánh
***[#EDE9FE] Danh sách · lọc · sắp xếp
***[#EDE9FE] Chi tiết + AI Triage Analysis
***[#EDE9FE] Theo dõi trạng thái

**[#EC4899] AI Triage & Phân tích
***[#FCE7F3] Phân loại lĩnh vực + confidence
***[#FCE7F3] Chấm điểm ưu tiên
****[#FECACA] High
****[#FEF3C7] Medium
****[#DCFCE7] Low
***[#FCE7F3] Phát hiện trùng lặp (cosine)
***[#FCE7F3] Đề xuất phòng ban
***[#FCE7F3] Gợi ý hành động + giải thích

left side

' ===================== NHÁNH BÊN TRÁI =====================
**[#F59E0B] Điều phối (Admin)
***[#FEF3C7] Smart Triage Cockpit
***[#FEF3C7] Nhóm sự cố (Incidents)
***[#FEF3C7] AI Review Queue
***[#FEF3C7] Dashboard thống kê

**[#22C55E] ML Ops & Dữ liệu
***[#DCFCE7] Đồng bộ ticket resolved
***[#DCFCE7] Duyệt / sửa nhãn
***[#DCFCE7] Phiên bản dataset
***[#DCFCE7] Huấn luyện + promote
***[#DCFCE7] Re-analyze toàn bộ
***[#DCFCE7] Model Info

**[#EF4444] Công nghệ & Kết nối
***[#FEE2E2] Frontend — Next.js
***[#FEE2E2] Backend — FastAPI
***[#FEE2E2] AI Engine — scikit-learn
***[#FEE2E2] Database — PostgreSQL
***[#FEE2E2] Docker Compose

@endmindmap
```

---

## Hình 2.2. Sơ đồ Use Case tổng quát

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

actor "Sinh viên" as SV
actor "Cán bộ / Staff" as ST
actor "Quản trị / Admin" as AD
actor "Dịch vụ AI" as AI

rectangle "Hệ thống SmartTriage" {
  usecase "Đăng nhập / Xác thực" as UC1
  usecase "Gửi phản ánh" as UC2
  usecase "Xem danh sách / chi tiết" as UC3
  usecase "Cập nhật trạng thái / định tuyến" as UC4
  usecase "Dashboard thống kê" as UC5
  usecase "Smart Triage Cockpit" as UC6
  usecase "Quản lý nhóm sự cố" as UC7
  usecase "ML Feedback / Training" as UC8
  usecase "Phân tích lại toàn bộ" as UC9
  usecase "Phân loại & chấm điểm ticket" as UC10
}

SV --> UC1
SV --> UC2
SV --> UC3

ST --> UC1
ST --> UC3
ST --> UC4
ST --> UC6
ST --> UC7

AD --> UC1
AD --> UC5
AD --> UC6
AD --> UC7
AD --> UC8
AD --> UC9

UC2 ..> UC10 : <<include>>
UC9 ..> UC10 : <<include>>
UC10 --> AI
@enduml
```

---

## Hình 2.3. Sequence diagram — Gửi phản ánh + AI phân tích

```plantuml
@startuml
skinparam shadowing false
skinparam responseMessageBelowArrow true
autonumber

actor "Sinh viên" as SV
participant "Frontend\n(Next.js)" as FE
participant "Backend API\n(FastAPI)" as BE
database "PostgreSQL" as DB
participant "Dịch vụ AI\n(FastAPI)" as AI
participant "ML Core\n(scikit-learn)" as ML

SV -> FE : Nhập tiêu đề + mô tả, bấm "Gửi"
activate FE
FE -> BE : POST /api/v1/tickets (Bearer JWT)\n{ title, description } {t0}
activate BE

BE -> BE : Xác thực JWT + validate payload (Pydantic)
note right BE : ~〔đo〕 ms

BE -> DB : INSERT ticket (status = analyzing)
activate DB
DB --> BE : ticket_id
deactivate DB

BE -> DB : SELECT ticket đang mở (ngữ cảnh phát hiện trùng)
activate DB
DB --> BE : open_tickets[]
deactivate DB

alt Dịch vụ AI phản hồi thành công (timeout 5s)
  BE -> AI : POST /api/v1/analyze-ticket {ta1}\n{ ticket_id, title, description,\ncreated_by_role, open_tickets[] }
  activate AI

  AI -> ML : Tiền xử lý + TF-IDF.transform
  activate ML
  ML --> AI : vector đặc trưng
  AI -> ML : LogReg.predict_proba(vector)
  ML --> AI : category + confidence
  deactivate ML

  AI -> AI : score_priority (rule)\n→ priority, priority_score, breakdown
  AI -> AI : duplicate_detector (cosine)\n→ duplicate_candidates[]
  AI -> AI : recommend_department + recommend_actions\n+ build_explanation

  AI --> BE : 200 OK {ta2}\n{ category, category_label, confidence,\npriority, priority_score, suggested_department,\nduplicate_candidates[], suggested_actions[],\nexplanation, priority_breakdown, model_version }
  deactivate AI

  BE -> DB : INSERT ticket_analyses\nUPDATE ticket (status = open, assigned_department)
  activate DB
  DB --> BE : commit OK
  deactivate DB
else AI lỗi hoặc quá thời gian chờ (HTTP error / timeout 5s)
  AI --> BE : lỗi / timeout
  BE -> DB : UPDATE ticket (status = open, chưa có analysis)
  activate DB
  DB --> BE : commit OK
  deactivate DB
  note right BE : Fallback: giữ nguyên workflow,\nghi log lỗi, không chặn nghiệp vụ
end

BE --> FE : 201 Created {t1}\nApiResponse{ success: true,\nmessage: "Ticket created",\ndata: TicketDetail{ ...ticket, analysis } }
deactivate BE

FE --> SV : Render AI Triage Analysis\n(nhãn lĩnh vực, confidence, điểm ưu tiên,\nbreakdown, phản ánh tương tự, gợi ý xử lý)
deactivate FE

{ta1} <-> {ta2} : Thời gian suy luận AI ~〔đo〕 ms
{t0} <-> {t1} : Tổng thời gian xử lý end-to-end ~〔đo〕 ms
@enduml
```

---

## Hình 2.4. Lược đồ cơ sở dữ liệu quan hệ (ERD)

```plantuml
@startuml
hide circle
skinparam linetype ortho
skinparam shadowing false

entity "users" as users {
  * id : UUID <<PK>>
  --
  full_name : varchar
  email : varchar <<unique>>
  hashed_password : varchar
  role : user_role { student | staff | admin }
  department : varchar <<null>>
  is_active : boolean
  created_at : timestamp
  updated_at : timestamp
}

note top of users
  role phân rõ 3 vai trò (enum user_role):
   • student — Sinh viên (gửi & theo dõi phản ánh)
   • staff   — Cán bộ phòng ban (vd "IT Staff"),
               gắn với department để định tuyến
   • admin   — Quản trị / điều phối toàn hệ thống
  "IT Staff" = role staff + department, KHÔNG phải role riêng.
end note

entity "tickets" as tickets {
  * id : UUID <<PK>>
  --
  title : varchar
  description : text
  status : enum
  created_by_id : UUID <<FK>>
  assigned_department : varchar
  assigned_to_id : UUID <<FK>>
  manual_category : varchar
  manual_priority : varchar
  created_at : timestamp
  updated_at : timestamp
  resolved_at : timestamp
}

entity "ticket_analyses" as analyses {
  * id : UUID <<PK>>
  --
  ticket_id : UUID <<FK,unique>>
  predicted_category : varchar
  category_label : varchar
  category_confidence : float
  priority : varchar
  priority_score : int
  suggested_department : varchar
  duplicate_candidates : json
  suggested_actions : json
  analysis_metadata : json
  model_version : varchar
  created_at : timestamp
}

entity "incident_groups" as groups {
  * id : UUID <<PK>>
  --
  title : varchar
  status : enum
}

entity "incident_group_tickets" as group_tickets {
  * group_id : UUID <<FK>>
  * ticket_id : UUID <<FK>>
}

entity "dataset_versions" as datasets {
  * id : UUID <<PK>>
  --
  version : varchar
  status : enum
}

entity "training_samples" as samples {
  * id : UUID <<PK>>
  --
  source_ticket_id : UUID <<FK>>
  category : varchar
  priority : varchar
  label_source : varchar
  review_status : enum
  dataset_version_id : UUID <<FK>>
}

users ||--o{ tickets : "tạo"
tickets ||--o| analyses : "có 1"
groups ||--o{ group_tickets : "gồm"
tickets ||--o{ group_tickets : "thuộc"
tickets ||--o{ samples : "sinh ra"
datasets ||--o{ samples : "gom"
@enduml
```

---

## Hình 2.5. Sơ đồ quy trình xây dựng mô hình AI (Pipeline offline & online)

```plantuml
@startuml
skinparam shadowing false
skinparam ConditionEndStyle hline

|#EEF3FF|Offline — Huấn luyện (Admin)|
start
:Ticket đã xử lý (resolved);
:Đồng bộ → training_samples (candidate);
:Admin duyệt / sửa nhãn\n(approve · exclude · edit);
:Tạo phiên bản dataset\n(synthetic-v2 + curated);
:Huấn luyện: TF-IDF + Logistic Regression;
:Đánh giá (accuracy, macro-F1, confusion matrix);
if (Đạt ngưỡng?) then (có)
  :Promote model → MODEL_DIR\n(current_model.json);
else (không)
  :Điều chỉnh dữ liệu / tham số;
  stop
endif

|#FFF3E6|Online — Suy luận (mỗi phản ánh)|
:Phản ánh mới (title + description);
:Tiền xử lý văn bản;
:Phân loại + độ tin cậy (predict_proba);
:Chấm điểm ưu tiên (rule-based);
:Phát hiện trùng (cosine similarity);
:Đề xuất phòng ban + hành động;
:Lưu kết quả vào ticket_analyses;
stop

note right
  Model vừa promote phục vụ ngay
  cho bước "Phân loại + độ tin cậy".
  Ticket resolved quay lại nuôi
  dữ liệu huấn luyện (vòng phản hồi).
end note
@enduml
```

---

## Hình 3.1. Sơ đồ kiến trúc triển khai tổng thể (Docker Compose)

```plantuml
@startuml
left to right direction
skinparam shadowing false
skinparam componentStyle rectangle
skinparam linetype ortho
skinparam nodesep 25
skinparam ranksep 90
skinparam wrapWidth 220

actor "Người dùng\n(SV / Staff / Admin)" as User

node "Trình duyệt" as Browser

node "Máy chủ — Docker Compose" as Host {

  node "frontend  :3000\nNext.js 16 (App Router)\nTypeScript · Tailwind CSS" as FE

  node "backend  :8000\nFastAPI + Uvicorn" as BE {
    component "API v1\nauth · users · tickets · dashboard\nadmin-triage · incident-groups\ntraining-pipeline · ai" as BEAPI
    component "Services & Repositories\n(TicketService, TriageService,\nTrainingPipelineService...)" as BESVC
    component "Security\nJWT · RBAC · bcrypt" as SEC
    component "AI Service Client (httpx)" as BECLI
    component "Alembic migrations" as MIG
  }

  node "ai-service  :8001\nFastAPI + Uvicorn" as AI {
    component "API\n/analyze-ticket\n/model-info · /health" as AIAPI
    component "ML Core (scikit-learn)" as MLC
  }
  note bottom of MLC
    TF-IDF + Logistic Regression (predictor)
    priority_scorer · duplicate_detector
    department / action recommender
    explanation_builder · incident_grouper
    training_pipeline
  end note

  database "postgres  :5432\nPostgreSQL 16" as DB {
    component "users · tickets · ticket_analyses\nincident_groups · incident_group_tickets\ndataset_versions · training_samples" as TBL
  }

  folder "Volume / Đĩa\nMODEL_DIR + datasets" as ART {
    artifact "category_classifier.joblib\ntfidf_vectorizer.joblib\nlabel_encoder.joblib\nmodel_metadata.json · current_model.json" as MODEL
    artifact "datasets versioned\n(synthetic-v2 / ...)" as DSET
  }
}

User --> Browser
Browser --> FE : tải giao diện SPA (HTTPS)
Browser --> BEAPI : REST / JSON + Bearer JWT\n(NEXT_PUBLIC_BACKEND_URL)
BECLI --> AIAPI : HTTP (analyze-ticket, model-info)\nAI_SERVICE_URL · timeout 5s
BESVC --> DB : SQL / ORM (SQLAlchemy)\nDATABASE_URL
MIG ..> DB : alembic upgrade head (khi khởi động)
MLC ..> MODEL : nạp model
MLC ..> DSET : đọc dataset

note bottom of BE
  depends_on: postgres (healthy), ai-service (healthy)
  Lệnh khởi động: alembic upgrade head -> uvicorn
  Healthcheck mỗi service: /api/v1/health
end note
@enduml
```

---

## Hình 3.2. Sơ đồ khối kiến trúc tổng quan (kèm chức năng)

```plantuml
@startuml
skinparam shadowing false
skinparam componentStyle rectangle
skinparam roundCorner 10
title SmartTriage — Sơ đồ khối kiến trúc tổng quan (kèm chức năng)

actor "Người dùng\n(Sinh viên · Cán bộ · Admin)" as U

rectangle "① TẦNG TRÌNH DIỄN — Frontend (Next.js · TypeScript · Tailwind)" #EAF1FF {
  rectangle "Xác thực & Phân quyền\nĐăng nhập JWT · điều hướng theo vai trò" as FE1
  rectangle "Phản ánh (Sinh viên)\nGửi · Danh sách & lọc · Chi tiết + AI Triage" as FE2
  rectangle "Điều phối (Admin/Staff)\nDashboard · Triage Cockpit · Incidents\nAI Review · ML Feedback · Model Info" as FE3
}

rectangle "② TẦNG NGHIỆP VỤ — Backend (FastAPI · SQLAlchemy · Alembic)" #FFF3D6 {
  rectangle "Auth & Users\nJWT · RBAC · bcrypt" as BE1
  rectangle "Ticket Service\nCRUD · workflow · re-analyze · export CSV" as BE2
  rectangle "Dashboard · Triage · Incident Groups\n(thống kê, hàng đợi, gom nhóm)" as BE3
  rectangle "Training Pipeline\nsync ticket · duyệt mẫu · dataset version" as BE4
  rectangle "AI Service Client (httpx)" as BE5
}

rectangle "③ TẦNG AI/ML — AI Service (FastAPI · scikit-learn)" #E7F8F0 {
  rectangle "Tiền xử lý văn bản\n(combine title+description)" as AI1
  rectangle "Phân loại lĩnh vực\nTF-IDF + Logistic Regression + confidence" as AI2
  rectangle "Chấm điểm ưu tiên (rule-based)" as AI3
  rectangle "Phát hiện trùng lặp (cosine similarity)" as AI4
  rectangle "Đề xuất phòng ban · gợi ý hành động · giải thích" as AI5
  rectangle "Huấn luyện & promote model" as AI6
}

rectangle "④ TẦNG DỮ LIỆU" #F1F0FB {
  database "PostgreSQL\nusers · tickets · ticket_analyses\nincident_groups · dataset_versions · training_samples" as DB
  artifact "Model artifacts (joblib)\n+ datasets versioned" as ART
}

U --> FE1
FE2 --> BE2 : REST/JSON + JWT
FE3 --> BE3
FE1 --> BE1
BE2 --> BE5
BE5 --> AI2 : HTTP /analyze-ticket
BE4 --> AI6
BE2 --> DB
BE3 --> DB
BE4 --> DB
BE1 --> DB
AI2 ..> ART : nạp model
AI6 ..> ART : ghi model mới
@enduml
```

> Đọc theo chiều: Người dùng → Frontend → Backend → (AI Service + PostgreSQL). Mỗi khối liệt kê
> chức năng chính của tầng đó. AI Service không truy cập DB nghiệp vụ — chỉ đọc/ghi **model artifacts**
> trên đĩa; Backend là nơi duy nhất nói chuyện với PostgreSQL.

---

### Ghi chú render nhanh

- **VS Code:** cài extension `PlantUML` (jebbs) → mở file → `Alt+D` để preview, hoặc chuột phải → *Export Current Diagram* (PNG/SVG) để chèn Word.
- **Online:** dán từng khối (không gồm dấu ```) vào https://www.plantuml.com/plantuml/uml.
- Nếu thiếu Graphviz, các sơ đồ use case / ERD / deployment có thể báo lỗi `dot`; cài Graphviz rồi đặt biến môi trường `GRAPHVIZ_DOT`.
