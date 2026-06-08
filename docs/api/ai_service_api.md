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
```

Ý nghĩa output:

| Field | Ý nghĩa |
| --- | --- |
| `category` | Category machine-readable |
| `category_label` | Label tiếng Việt |
| `confidence` | Độ tin cậy classifier |
| `category_confidence` | Alias rõ nghĩa của `confidence` cho frontend/backend |
| `priority` | `low`, `medium`, `high` |
| `priority_score` | Điểm ưu tiên 0-100 |
| `priority_breakdown` | Giải thích từng phần điểm ưu tiên |
| `suggested_department` | Phòng ban gợi ý |
| `duplicate_candidates` | Ticket tương tự theo cosine similarity |
| `suggested_actions` | Gợi ý xử lý ban đầu |
| `explanation` | Giải thích rule-based cho category, priority, department và detected signals |
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

## Luồng Sử Dụng Trong Hệ Thống

Frontend không gọi trực tiếp AI service. Luồng đúng:

```txt
Frontend -> Backend -> AI Service
```

Lý do:

- Backend giữ token, role và nghiệp vụ ticket.
- Backend quyết định danh sách `existing_tickets` gửi sang AI service.
- AI service là internal service trong kiến trúc Docker/network.
