# SmartTriage ML Pipeline

## 1. Mục Tiêu ML

ML trong SmartTriage giúp hệ thống xử lý phản ánh sinh viên nhanh hơn bằng cách:

- Phân loại ticket vào nhóm vấn đề phù hợp.
- Tính mức độ ưu tiên để ticket khẩn cấp được xử lý trước.
- Phát hiện ticket tương tự hoặc trùng lặp.
- Gợi ý phòng ban phụ trách.
- Gợi ý hành động xử lý ban đầu cho staff/admin.

Output chính của AI service khi phân tích ticket:

```json
{
  "category": "account_system",
  "category_label": "Tài khoản / Hệ thống",
  "confidence": 0.87,
  "priority": "high",
  "priority_score": 82,
  "suggested_department": "Phòng CNTT",
  "duplicate_candidates": [],
  "suggested_actions": [],
  "model_version": "tfidf-logreg-v1"
}
```

## 2. Dataset

Dataset demo nằm tại:

```txt
ai-service/data/raw/ticket_samples.csv
```

Dataset gồm các ticket mẫu với các trường chính:

- `title`
- `description`
- `category`

Các category đang dùng:

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

Ngoài dataset training, hệ thống có duplicate index mẫu tại:

```txt
ai-service/data/tickets_index/sample_existing_tickets.csv
```

Trong runtime thực tế, backend gửi thêm `existing_tickets` từ database để duplicate detection không phụ thuộc hoàn toàn vào CSV sample.

## 3. Tiền Xử Lý Văn Bản

Module preprocessing nằm tại:

```txt
ai-service/app/ml/preprocessing.py
```

Các bước chính:

1. Ghép `title` và `description`.
2. Chuyển về lowercase.
3. Xóa URL và email.
4. Xóa dấu câu/ký tự nhiễu không cần thiết.
5. Chuẩn hóa khoảng trắng.
6. Giữ lại dấu tiếng Việt để không làm mất tín hiệu ngôn ngữ.

Ví dụ:

```txt
Input:
Không đăng nhập được vào hệ thống thi online!!!

Output:
không đăng nhập được vào hệ thống thi online
```

## 4. Category Classification

Mô hình phân loại sử dụng TF-IDF để chuyển văn bản thành vector đặc trưng, sau đó dùng Logistic Regression để dự đoán nhóm phản ánh. Cách tiếp cận này phù hợp với dataset vừa và nhỏ, dễ huấn luyện, tốc độ inference nhanh, và có khả năng giải thích tốt hơn so với mô hình deep learning phức tạp.

Training script:

```txt
ai-service/scripts/train_category_model.py
```

Artifacts:

```txt
ai-service/models/tfidf_vectorizer.joblib
ai-service/models/category_classifier.joblib
ai-service/models/label_encoder.joblib
ai-service/models/model_metadata.json
```

Inference module:

```txt
ai-service/app/ml/predictor.py
```

Nếu model artifact chưa tồn tại, predictor có fallback rule-based để demo vẫn chạy được.

## 5. Vì Sao Chọn TF-IDF + Logistic Regression

Lý do lựa chọn:

- Phù hợp với dữ liệu text classification kích thước nhỏ và vừa.
- Training nhanh, inference nhanh.
- Dễ triển khai bằng scikit-learn và joblib.
- Dễ giải thích khi báo cáo vì TF-IDF thể hiện trọng số từ khóa.
- Logistic Regression cho xác suất/confidence tương đối dễ đọc.
- Ít yêu cầu tài nguyên hơn transformer hoặc deep learning.

Với bài toán phản ánh sinh viên, nhiều category có tín hiệu từ khóa rõ như `wifi`, `đăng nhập`, `học phí`, `lịch thi`, `máy chiếu`, nên baseline TF-IDF + Logistic Regression là lựa chọn hợp lý cho MVP.

## 6. Công Thức Priority Scoring

Priority scoring nằm tại:

```txt
ai-service/app/ml/priority_scorer.py
```

Công thức tổng quát:

```txt
priority_score =
    category_weight
  + urgent_keyword_score
  + deadline_score
  + affected_scope_score
  + exam_deadline_score
```

Thang điểm:

| Score | Priority |
| --- | --- |
| 0-39 | low |
| 40-69 | medium |
| 70-100 | high |

Các tín hiệu chính:

- `category_weight`: account, learning platform, schedule exam có trọng số cao hơn feedback.
- `urgent_keyword_score`: các từ như `gấp`, `khẩn cấp`, `không thể`, `thi`, `deadline`.
- `deadline_score`: hôm nay, sáng mai, chiều mai, tuần này.
- `affected_scope_score`: nhiều sinh viên, cả lớp, toàn bộ phòng học.
- `exam_deadline_score`: cộng thêm khi deadline liên quan thi/kiểm tra.

Ví dụ ticket:

```txt
Không đăng nhập được hệ thống thi online, sáng mai có lịch thi.
```

Kết quả kỳ vọng:

- Category: `account_system`
- Priority: `high`
- Priority score: từ 70 trở lên

## 7. Duplicate Detection Bằng Cosine Similarity

Hệ thống biểu diễn ticket mới và các ticket đang mở thành vector TF-IDF, sau đó dùng cosine similarity để đo độ tương đồng. Những ticket có similarity vượt ngưỡng được xem là ứng viên trùng lặp hoặc liên quan.

Module:

```txt
ai-service/app/ml/duplicate_detector.py
```

Nguồn dữ liệu duplicate:

1. `existing_tickets` do backend gửi từ database runtime.
2. CSV sample fallback nếu runtime list rỗng.

Ngưỡng trong MVP:

| Similarity | Ý nghĩa |
| --- | --- |
| >= 0.70 | Nghi ngờ trùng hoặc liên quan mạnh |
| 0.50-0.69 | Liên quan vừa |
| < 0.50 | Không coi là trùng |

Endpoint `/api/v1/analyze-ticket` hiện dùng threshold mặc định `0.45` để demo có thể thấy candidate trong dữ liệu nhỏ.

## 8. Department Recommendation

Department recommendation là rule-based mapping theo category:

| Category | Department |
| --- | --- |
| `account_system` | Phòng CNTT |
| `network` | Phòng CNTT |
| `learning_platform` | Phòng CNTT |
| `classroom_device` | Phòng Cơ sở vật chất |
| `facility` | Phòng Cơ sở vật chất |
| `schedule_exam` | Phòng Đào tạo |
| `tuition_payment` | Phòng Tài chính |
| `document_profile` | Phòng Công tác sinh viên |
| `feedback` | Phòng Công tác sinh viên |
| `other` | Bộ phận tiếp nhận |

Module:

```txt
ai-service/app/ml/department_recommender.py
```

## 9. Evaluation Metrics

Training pipeline lưu metadata model tại:

```txt
ai-service/models/model_metadata.json
```

Metrics chính:

- Accuracy: tỷ lệ dự đoán đúng tổng thể.
- Macro F1: trung bình F1 trên các category, phù hợp khi muốn quan sát hiệu năng nhiều lớp.

Với dataset demo hiện tại, metadata ghi nhận:

```txt
algorithm: TF-IDF + Logistic Regression
model_version: tfidf-logreg-v1
accuracy: 1.0
macro_f1: 1.0
```

Lưu ý: kết quả cao trên dataset demo không nên xem là hiệu năng thật trên dữ liệu sản xuất. Cần dataset thực tế lớn hơn, đa dạng hơn và tách validation/test nghiêm ngặt hơn.

## 10. Hạn Chế

- Dataset hiện là dữ liệu mẫu, chưa đại diện đầy đủ cho phản ánh thật.
- TF-IDF dựa nhiều vào từ khóa, chưa hiểu ngữ nghĩa sâu.
- Logistic Regression là baseline tốt nhưng có thể kém khi câu rất đa dạng hoặc nhiều cách diễn đạt.
- Priority scoring rule-based có thể cần hiệu chỉnh thủ công.
- Duplicate detection TF-IDF có thể bỏ sót các ticket giống nghĩa nhưng khác từ.
- Confidence của model nên được calibration thêm nếu dùng cho quyết định quan trọng.

## 11. Hướng Phát Triển

- Thu thập dữ liệu thật đã ẩn danh từ trường.
- Thêm feedback loop: admin sửa category/priority, hệ thống ghi lại để retrain.
- So sánh Logistic Regression với LinearSVC, Naive Bayes hoặc sentence embeddings.
- Thử embedding model cho duplicate detection khi dữ liệu đủ lớn.
- Thêm active learning để gợi ý các sample cần gán nhãn.
- Bổ sung monitoring drift cho category distribution theo thời gian.
- Tách inference async qua queue khi số lượng ticket tăng.
