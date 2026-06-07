# SmartTriage AI Service API

Base URL local:

```txt
http://localhost:8001
```

Prefix:

```txt
/api/v1
```

Response envelope chung:

```json
{
  "success": true,
  "message": "Ticket analyzed successfully",
  "data": {}
}
```

## Health

### `GET /api/v1/health`

Response:

```json
{
  "success": true,
  "message": "AI service is healthy",
  "data": {
    "service": "ai-service",
    "status": "ok"
  }
}
```

## Analyze Ticket

### `POST /api/v1/analyze-ticket`

Endpoint chính để backend gửi ticket sang AI service.

Request:

```json
{
  "ticket_id": "TCK-001",
  "title": "Không đăng nhập được hệ thống thi",
  "description": "Em không đăng nhập được vào hệ thống thi online, sáng mai em có lịch thi.",
  "created_by_role": "student",
  "existing_tickets": [
    {
      "ticket_id": "TCK-018",
      "title": "Lỗi đăng nhập hệ thống thi online",
      "description": "Không thể đăng nhập vào hệ thống thi."
    }
  ]
}
```

Field:

| Field | Type | Ghi chú |
| --- | --- | --- |
| `ticket_id` | string | ID hoặc code ticket mới |
| `title` | string | Tối thiểu 5 ký tự |
| `description` | string | Tối thiểu 10 ký tự |
| `created_by_role` | string | `student`, `staff`, `admin`, optional |
| `existing_tickets` | array | Ticket đang mở từ backend để duplicate detection |
| `open_tickets` | array | Tương thích cũ, ưu tiên dùng `existing_tickets` |

Response:

```json
{
  "success": true,
  "message": "Ticket analyzed successfully",
  "data": {
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
    "model_version": "tfidf-logreg-v1"
  }
}
```

Ý nghĩa output:

| Field | Ý nghĩa |
| --- | --- |
| `category` | Category machine-readable |
| `category_label` | Label tiếng Việt |
| `confidence` | Độ tin cậy classifier |
| `priority` | `low`, `medium`, `high` |
| `priority_score` | Điểm ưu tiên 0-100 |
| `suggested_department` | Phòng ban gợi ý |
| `duplicate_candidates` | Ticket tương tự theo cosine similarity |
| `suggested_actions` | Gợi ý xử lý ban đầu |
| `model_version` | Version model đang dùng |

Curl test:

```bash
curl -X POST http://localhost:8001/api/v1/analyze-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TCK-DEMO-001",
    "title": "Không đăng nhập được hệ thống thi",
    "description": "Em không đăng nhập được vào hệ thống thi online, sáng mai em có lịch thi.",
    "created_by_role": "student",
    "existing_tickets": []
  }'
```

## Model Info

### `GET /api/v1/model-info`

Response:

```json
{
  "success": true,
  "message": "Model info retrieved",
  "data": {
    "model_version": "tfidf-logreg-v1",
    "algorithm": "TF-IDF + Logistic Regression",
    "accuracy": 1.0,
    "macro_f1": 1.0,
    "categories": [
      "account_system",
      "network",
      "classroom_device",
      "facility",
      "schedule_exam",
      "tuition_payment",
      "document_profile",
      "learning_platform",
      "feedback",
      "other"
    ],
    "model_loaded": true
  }
}
```

Nếu chưa có model artifacts, endpoint vẫn trả an toàn với `model_loaded: false`.

## Suggest Incident Group

### `POST /api/v1/suggest-incident-group`

Endpoint gợi ý nhiều phản ánh cùng chủ đề/sự cố. Khác với duplicate detection, chức năng này hướng tới nhóm phản ánh liên quan để xử lý tập trung.

Request:

```json
{
  "new_ticket": {
    "id": "TCK-001",
    "title": "Wifi phòng B305 rất yếu",
    "description": "Em không vào được mạng ở phòng B305.",
    "category": "network"
  },
  "existing_tickets": [
    {
      "id": "TCK-002",
      "title": "Không vào được mạng khu B tầng 3",
      "description": "Wifi khu B tầng 3 bị lỗi liên tục.",
      "category": "network"
    }
  ]
}
```

Response data:

```json
{
  "has_incident_suggestion": true,
  "suggested_group_title": "Sự cố Wifi / mạng đang được phản ánh",
  "suggested_category": "network",
  "average_similarity": 0.76,
  "related_tickets": [
    {
      "ticket_id": "TCK-002",
      "title": "Không vào được mạng khu B tầng 3",
      "similarity": 0.82,
      "reason": "Cùng chủ đề theo TF-IDF cosine similarity và category gần nhau."
    }
  ],
  "recommendation": "Nên gom các phản ánh này thành một nhóm sự cố để xử lý tập trung."
}
```

## Luồng Sử Dụng Trong Hệ Thống

Frontend không gọi trực tiếp AI service. Luồng đúng:

```txt
Frontend -> Backend -> AI Service
```

Lý do:

- Backend giữ token, role và nghiệp vụ ticket.
- Backend quyết định danh sách `existing_tickets` gửi sang AI service.
- AI service là internal service trong kiến trúc Docker/network.
