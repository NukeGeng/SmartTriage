# SmartTriage Backend API

Base URL local:

```txt
http://localhost:8000
```

Tất cả endpoint nghiệp vụ chính nằm dưới prefix:

```txt
/api/v1
```

Response envelope chung:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Human readable error",
  "error_code": "HTTP_401",
  "details": {}
}
```

## Auth Header

Các endpoint cần đăng nhập dùng header:

```txt
Authorization: Bearer <access_token>
```

## Health

### `GET /api/v1/health`

Response:

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

## Auth APIs

### `POST /api/v1/auth/register`

Request:

```json
{
  "full_name": "Demo Student",
  "email": "student@example.com",
  "password": "12345678",
  "role": "student",
  "department": null
}
```

Response `201`:

```json
{
  "success": true,
  "message": "Register successful",
  "data": {
    "id": "uuid",
    "full_name": "Demo Student",
    "email": "student@example.com",
    "role": "student",
    "department": null,
    "is_active": true,
    "created_at": "2026-06-06T00:00:00Z",
    "updated_at": "2026-06-06T00:00:00Z"
  }
}
```

### `POST /api/v1/auth/login`

Request:

```json
{
  "email": "student@example.com",
  "password": "12345678"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "jwt-token",
    "token_type": "bearer",
    "user": {
      "id": "uuid",
      "full_name": "Demo Student",
      "email": "student@example.com",
      "role": "student",
      "department": null,
      "is_active": true,
      "created_at": "2026-06-06T00:00:00Z",
      "updated_at": "2026-06-06T00:00:00Z"
    }
  }
}
```

Wrong password trả `401`.

### `GET /api/v1/auth/me`

Yêu cầu auth header.

Response:

```json
{
  "success": true,
  "message": "Current user",
  "data": {
    "id": "uuid",
    "full_name": "Demo Student",
    "email": "student@example.com",
    "role": "student",
    "department": null,
    "is_active": true
  }
}
```

## Ticket APIs

### `POST /api/v1/tickets`

Yêu cầu auth header.

Request:

```json
{
  "title": "Không đăng nhập được hệ thống thi online",
  "description": "Em không đăng nhập được vào hệ thống thi online, sáng mai em có lịch thi."
}
```

Workflow:

1. Backend tạo ticket.
2. Backend gửi ticket và `existing_tickets` sang AI service.
3. Backend lưu `ticket_analyses` nếu AI service trả kết quả.
4. Backend trả ticket detail.

Response `201`:

```json
{
  "success": true,
  "message": "Ticket created",
  "data": {
    "id": "uuid",
    "title": "Không đăng nhập được hệ thống thi online",
    "description": "Em không đăng nhập được vào hệ thống thi online, sáng mai em có lịch thi.",
    "status": "open",
    "created_by_id": "uuid",
    "assigned_department": "Phòng CNTT",
    "analysis": {
      "predicted_category": "account_system",
      "category_label": "Tài khoản / Hệ thống",
      "category_confidence": 0.87,
      "priority": "high",
      "priority_score": 82,
      "priority_breakdown": {
        "total_score": 82,
        "level": "high",
        "items": [
          {
            "name": "Nhóm vấn đề",
            "score": 25,
            "reason": "Lỗi tài khoản/hệ thống ảnh hưởng trực tiếp đến khả năng sử dụng dịch vụ.",
            "matched_terms": ["account_system"]
          }
        ]
      },
      "suggested_department": "Phòng CNTT",
      "duplicate_candidates": [],
      "suggested_actions": [
        "Kiểm tra trạng thái tài khoản sinh viên"
      ],
      "explanation": {
        "summary": "Phản ánh được phân loại là Tài khoản / Hệ thống, mức ưu tiên high với điểm 82/100 và được đề xuất chuyển đến Phòng CNTT.",
        "category_reason": "Nội dung chứa tín hiệu đăng nhập và hệ thống thi online.",
        "priority_reason": "Mức ưu tiên cao vì có ngữ cảnh thi và deadline gần.",
        "department_reason": "Phòng CNTT là đơn vị phù hợp để xử lý lỗi tài khoản và hệ thống.",
        "detected_signals": ["không đăng nhập được", "sáng mai", "thi online"]
      },
      "model_version": "tfidf-logreg-v1"
    }
  }
}
```

Nếu không có auth header, trả `401`.

### `GET /api/v1/tickets`

Yêu cầu auth header.

Query params:

| Param | Ý nghĩa |
| --- | --- |
| `status` | Lọc theo ticket status |
| `category` | Lọc theo AI category |
| `priority` | Lọc theo priority |
| `assigned_department` | Lọc phòng ban |
| `search` | Tìm trong title/description |
| `page` | Trang, default `1` |
| `page_size` | Số item, default `20`, max `100` |

Response:

```json
{
  "success": true,
  "message": "Tickets retrieved",
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Không đăng nhập được hệ thống thi online",
        "status": "open",
        "assigned_department": "Phòng CNTT",
        "category": "account_system",
        "priority": "high",
        "priority_score": 82,
        "created_at": "2026-06-06T00:00:00Z",
        "updated_at": "2026-06-06T00:00:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 20
  }
}
```

Visibility:

- Student chỉ thấy ticket do mình tạo.
- Staff thấy ticket chưa gán hoặc thuộc department của mình.
- Admin thấy toàn bộ ticket.

### `GET /api/v1/tickets/{ticket_id}`

Yêu cầu auth header.

Response trả ticket detail kèm `analysis`. Analysis hiện bao gồm:

- `explanation`: giải thích rule-based cho category, priority, department và detected signals.
- `priority_breakdown`: từng phần điểm ưu tiên để người xử lý hiểu vì sao ticket được xếp `low`, `medium` hoặc `high`.

### `GET /api/v1/tickets/export-training-data`

Chỉ admin được gọi.

Mục tiêu: export dữ liệu training theo cơ chế human-in-the-loop. Nếu staff/admin đã sửa `manual_category` hoặc `manual_priority`, hệ thống dùng nhãn thủ công này thay cho nhãn AI.

Response là CSV:

```csv
title,description,category,priority,source
Không đăng nhập được hệ thống thi online,Em không đăng nhập được...,learning_platform,medium,manual
```

Quy tắc export:

- `category`: ưu tiên `manual_category`, nếu không có thì dùng `predicted_category`.
- `priority`: ưu tiên `manual_priority`, nếu không có thì dùng priority từ AI analysis.
- `source`: `manual` nếu có manual label, ngược lại là `predicted`.

### `PATCH /api/v1/tickets/{ticket_id}/status`

Yêu cầu staff hoặc admin.

Request:

```json
{
  "status": "in_progress"
}
```

Status hợp lệ:

```txt
new
analyzing
open
in_progress
resolved
rejected
```

### `PATCH /api/v1/tickets/{ticket_id}`

Yêu cầu staff hoặc admin.

Request:

```json
{
  "manual_category": "network",
  "manual_priority": "high",
  "assigned_department": "Phòng CNTT",
  "assigned_to_id": null
}
```

## Dashboard APIs

Các endpoint dashboard yêu cầu staff hoặc admin.

### `GET /api/v1/dashboard/stats`

Response:

```json
{
  "success": true,
  "message": "Dashboard stats retrieved",
  "data": {
    "total_tickets": 24,
    "open_tickets": 8,
    "resolved_tickets": 10,
    "high_priority_tickets": 4,
    "avg_resolution_hours": 6.5
  }
}
```

### `GET /api/v1/dashboard/tickets-by-category`

Response data:

```json
[
  {
    "category": "account_system",
    "count": 5
  }
]
```

### `GET /api/v1/dashboard/tickets-by-priority`

Response data:

```json
[
  {
    "priority": "high",
    "count": 4
  }
]
```

### `GET /api/v1/dashboard/tickets-by-status`

Response data:

```json
[
  {
    "status": "open",
    "count": 8
  }
]
```

### `GET /api/v1/dashboard/recent-tickets?limit=10`

Response data:

```json
[
  {
    "id": "uuid",
    "title": "Không đăng nhập được hệ thống thi online",
    "status": "open",
    "priority": "high",
    "category": "account_system",
    "assigned_department": "Phòng CNTT",
    "created_at": "2026-06-06T00:00:00Z"
  }
]
```

## AI Proxy APIs

### `GET /api/v1/ai/model-info`

Yêu cầu staff hoặc admin.

Backend gọi AI service `/api/v1/model-info` và trả lại thông tin model cho frontend. Nếu AI service không phản hồi, backend trả fallback an toàn với `model_loaded: false`.

Response:

```json
{
  "success": true,
  "message": "AI model info retrieved",
  "data": {
    "model_version": "tfidf-logreg-v1",
    "algorithm": "TF-IDF + Logistic Regression",
    "accuracy": 1.0,
    "macro_f1": 1.0,
    "categories": [
      "account_system",
      "network"
    ],
    "model_loaded": true
  }
}
```
