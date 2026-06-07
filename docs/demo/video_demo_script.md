# SmartTriage Video Demo Script 3-5 Phút

## Mục Tiêu Video

Video cần chứng minh SmartTriage giải quyết được bài toán tiếp nhận phản ánh sinh viên bằng workflow rõ ràng và có tích hợp Machine Learning thực tế:

- Sinh viên tạo phản ánh.
- Hệ thống tự phân loại, ưu tiên, phát hiện trùng lặp.
- Admin/staff xem dashboard và xử lý ticket.
- Kiến trúc tách frontend, backend, AI service.

## Chuẩn Bị Trước Khi Quay

Chạy các service:

```bash
docker compose up -d postgres

cd backend
python -m alembic upgrade head
python scripts/seed_users.py
uvicorn app.main:app --reload --port 8000

cd ../ai-service
python scripts/generate_sample_dataset.py
python scripts/train_category_model.py
python scripts/build_duplicate_index.py
uvicorn app.main:app --reload --port 8001

cd ../frontend
npm run dev
```

Account demo:

```txt
student@example.com / 12345678
admin@example.com / 12345678
it.staff@example.com / 12345678
```

Ticket demo:

```txt
Title: Không đăng nhập được hệ thống thi online
Description: Em không đăng nhập được vào hệ thống thi online, sáng mai em có lịch thi. Mong phòng CNTT hỗ trợ gấp.
```

Kết quả mong đợi:

```txt
Category: Tài khoản / Hệ thống
Priority: High
Department: Phòng CNTT
Suggested actions: kiểm tra tài khoản, reset mật khẩu, ưu tiên do liên quan lịch thi
```

## 0:00 - 0:30: Giới Thiệu Bài Toán

Màn hình nên quay:

- Slide title hoặc trang login SmartTriage.
- Có thể mở nhanh dashboard/ticket list trống hoặc dữ liệu demo.

Lời thoại gợi ý:

```txt
Trong môi trường trường học, sinh viên gửi nhiều phản ánh khác nhau như lỗi đăng nhập, mạng yếu, thiết bị phòng học, học phí hoặc lịch thi. Nếu xử lý thủ công, bộ phận tiếp nhận dễ mất thời gian phân loại, khó biết phản ánh nào khẩn cấp và khó nhận ra các phản ánh bị trùng lặp.

SmartTriage được xây dựng để tự động hỗ trợ bước phân loại và ưu tiên đó.
```

## 0:30 - 1:00: Giới Thiệu Giải Pháp

Màn hình nên quay:

- README architecture hoặc diagram trong `docs/report/system_architecture.md`.
- Nói ngắn về ba service.

Lời thoại gợi ý:

```txt
SmartTriage gồm frontend Next.js, backend FastAPI và một AI service FastAPI riêng. Khi sinh viên gửi phản ánh, backend lưu ticket và gọi AI service để dự đoán category, tính priority score, tìm phản ánh tương tự và gợi ý phòng ban xử lý.
```

Điểm cần nhấn mạnh:

- AI service tách riêng khỏi backend nghiệp vụ.
- Backend vẫn tạo ticket được nếu AI service lỗi.
- Frontend chỉ gọi backend.

## 1:00 - 2:30: Demo Sinh Viên Gửi Phản Ánh

Màn hình nên quay:

1. Mở `http://localhost:3000/login`.
2. Login bằng `student@example.com / 12345678`.
3. Vào `Tạo mới`.
4. Nhập ticket demo.
5. Bấm gửi.
6. Mở ticket detail.

Lời thoại gợi ý:

```txt
Bây giờ tôi đăng nhập bằng tài khoản sinh viên. Sinh viên tạo một phản ánh về việc không đăng nhập được hệ thống thi online, trong khi sáng mai có lịch thi. Đây là một tình huống cần xử lý nhanh.

Sau khi bấm gửi, frontend hiển thị trạng thái đang gửi và phân tích bằng AI. Backend tạo ticket, lấy các ticket đang mở làm ngữ cảnh duplicate detection, sau đó gọi AI service.

Ở trang chi tiết, hệ thống hiển thị category là Tài khoản / Hệ thống, priority High, priority score, phòng ban gợi ý là Phòng CNTT, các phản ánh tương tự nếu có và danh sách hành động xử lý ban đầu.
```

Kết quả cần chỉ trên màn hình:

- `Category`
- `Confidence`
- `Priority`
- `Priority score`
- `Suggested department`
- `Duplicate candidates`
- `Suggested actions`
- `Model version`

## 2:30 - 3:30: Demo Admin Dashboard

Màn hình nên quay:

1. Logout.
2. Login bằng `admin@example.com / 12345678`.
3. Mở `/dashboard`.
4. Mở `/admin/tickets`.
5. Đổi status ticket sang `in_progress`.
6. Mở ticket detail để xác nhận status.

Lời thoại gợi ý:

```txt
Tiếp theo tôi đăng nhập bằng tài khoản admin. Dashboard hiển thị tổng số phản ánh, số ticket đang mở, đã xử lý, ticket ưu tiên cao, cùng các thống kê theo category, priority và status.

Ở trang quản lý ticket, admin có thể lọc, sắp xếp theo thời gian hoặc priority, xem phòng ban được gán và đổi trạng thái xử lý nhanh. Đây là luồng giúp bộ phận tiếp nhận ưu tiên ticket quan trọng trước.
```

Điểm cần nhấn mạnh:

- Dashboard dùng dữ liệu thật từ backend.
- Admin/staff có quyền cập nhật trạng thái.
- Student chỉ thấy ticket của mình.

## 3:30 - 4:30: Nói Về Kỹ Thuật

Màn hình nên quay:

- Mở repo structure.
- Mở `docs/report/ml_pipeline.md`.
- Mở `ai-service/app/ml` hoặc model metadata.

Lời thoại gợi ý:

```txt
Về kỹ thuật, frontend dùng Next.js App Router, TypeScript và Tailwind CSS. Backend dùng FastAPI, SQLAlchemy, Alembic, PostgreSQL và JWT authentication. AI service được tách riêng, dùng scikit-learn.

Mô hình chính là TF-IDF Vectorizer kết hợp Logistic Regression để phân loại category. Duplicate detection dùng TF-IDF và cosine similarity. Priority scoring là rule-based, kết hợp trọng số category, từ khóa khẩn cấp, deadline và phạm vi ảnh hưởng.
```

Nên nói rõ:

- Đây là baseline ML phù hợp dataset nhỏ/vừa.
- Có thể giải thích được trong báo cáo.
- Có hướng mở rộng sang feedback loop hoặc embedding.

## 4:30 - 5:00: Kết Luận

Màn hình nên quay:

- Dashboard hoặc ticket detail có AI analysis.

Lời thoại gợi ý:

```txt
SmartTriage giúp trường học tiếp nhận phản ánh có cấu trúc hơn, giảm thời gian phân loại thủ công, ưu tiên các vấn đề khẩn cấp và hỗ trợ thống kê cho quản trị.

Mô hình này có thể mở rộng cho helpdesk doanh nghiệp, dịch vụ công hoặc các hệ thống chăm sóc khách hàng có nhiều yêu cầu cần phân loại và ưu tiên tự động.
```

## Checklist Quay Nhanh

- Login student thành công.
- Tạo ticket demo thành công.
- Ticket detail có AI analysis.
- Login admin thành công.
- Dashboard có số liệu.
- Admin đổi trạng thái ticket thành công.
- Nói được kiến trúc ba service.
- Nói được TF-IDF + Logistic Regression, cosine similarity và priority scoring.
