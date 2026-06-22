# SmartTriage — Mô tả các trang giao diện

> Mô tả theo form: Đường dẫn · Vai trò · Mô tả. Nội dung bám sát hiện trạng mã nguồn
> (Next.js 16 App Router, TypeScript, Tailwind CSS; hiệu ứng bằng CSS keyframes tùy biến,
> icon `lucide-react`; không dùng thư viện biểu đồ bên ngoài).

---

## 1. Landing Page

| | |
|---|---|
| Đường dẫn | `/` |
| Vai trò | Khách (không cần đăng nhập) |
| Mô tả | Trang giới thiệu phong cách "gallery sản phẩm" giới thiệu SmartTriage như một *AI triage command center*. Hero hiển thị mascot TriageBot dạng SVG có hoạt ảnh thật (chớp mắt, vạch quét màn hình, ăng-ten lắc, đèn trạng thái nhấp nháy), kèm bong bóng thoại theo ngữ cảnh bật ra kiểu spring và vòng nét đứt xoay quanh. Bên dưới là lưới "shot" giới thiệu các module (hover nhấc thẻ nhẹ), dải quy trình xử lý và khối CTA. Nền dùng lớp `st-canvas` phủ 3 vầng gradient (xanh dương · cam · xanh lục) cố định theo viewport; toàn bộ chuyển động chỉ animate `transform`/`opacity` để mượt và tự tắt khi bật *prefers-reduced-motion*. |

---

## 2. Login Page

| | |
|---|---|
| Đường dẫn | `/login` |
| Vai trò | Khách (tự chuyển hướng về `/tickets` hoặc `/dashboard` nếu đã đăng nhập) |
| Mô tả | Bố cục split-screen: panel trái nền tối giới thiệu sản phẩm (mascot TriageBot có hoạt ảnh + bong bóng thoại + 3 dòng giá trị ML), panel phải là form đăng nhập. Hai panel vào trang theo hiệu ứng stagger (`st-enter`, panel phải trễ 120ms). Form gồm ô email/mật khẩu và nút đăng nhập bo tròn; phần tài khoản demo hiển thị dạng card có chip màu theo vai trò (Student / Admin / IT Staff), bấm là tự điền thông tin. Xác thực qua JWT; sau khi đăng nhập điều hướng theo vai trò (sinh viên → `/tickets`, còn lại → `/dashboard`). |

---

## 3. Dashboard

| | |
|---|---|
| Đường dẫn | `/dashboard` |
| Vai trò | Cán bộ (Staff), Quản trị (Admin) — sinh viên bị chuyển hướng về `/tickets` |
| Mô tả | Dashboard tự động làm mới mỗi 10 giây (polling) và bật toast khi có phản ánh mới. Thay cho 4 thẻ thống kê rời rạc, hệ thống dùng một dải "Nhịp hệ thống" nền tối: trạng thái thu gọn hiển thị tổng phản ánh + chấm "ping" nhấp nháy + tóm tắt nhanh; khi hover/focus sẽ xổ xuống bảng đầy đủ 4 chỉ số (tổng, đang mở, đã xử lý, ưu tiên cao) kèm % so với tổng, các hàng hiện so le. Ba biểu đồ thanh (theo *category / priority / status*) là biểu đồ CSS tùy biến với hiệu ứng các thanh chạy đầy dần từ trái sang phải (`st-bar-grow`) lệch pha nhau khi tải. Cuối trang là danh sách phản ánh gần đây. |

---

## 4. Danh sách phản ánh (Ticket)

| | |
|---|---|
| Đường dẫn | `/tickets` |
| Vai trò | Sinh viên (xem phản ánh của mình), Cán bộ, Quản trị (theo phạm vi phòng ban) |
| Mô tả | Trang gallery liệt kê phản ánh dạng lưới thẻ `TicketShotCard` (tự co giãn lấp đầy hàng bằng `auto-fit`, hover nhấc thẻ và làm mờ nhẹ các thẻ xung quanh để làm nổi thẻ đang trỏ). Thanh công cụ gồm: dropdown sắp xếp (Mới nhất / Cũ nhất / Điểm ưu tiên — sắp xếp phía client), flyout "Bộ lọc" (tìm theo từ khóa + lọc category/ưu tiên/trạng thái, có chấm báo khi đang áp bộ lọc) và hàng tab lọc nhanh. Dữ liệu phân trang phía máy chủ (mỗi trang một số lượng cố định để tránh tải nặng). Nút "Tạo phản ánh" dẫn sang trang gửi mới. |

---

## 5. Chi tiết phản ánh + AI Triage Analysis (Ticket detail)

| | |
|---|---|
| Đường dẫn | `/tickets/{id}` |
| Vai trò | Sinh viên (chủ phản ánh), Cán bộ, Quản trị |
| Mô tả | Trang trọng tâm thể hiện giá trị AI. Hero đổi tông gradient theo mức ưu tiên (đỏ/vàng/xanh) kèm chip trạng thái – ưu tiên – nhóm phân loại. Cột trái: nội dung phản ánh và báo cáo AI gồm *Vì sao AI phân loại như vậy* (tóm tắt + 3 ô lý do + tín hiệu phát hiện), *Điểm ưu tiên được tính thế nào* (các thanh breakdown chạy lệch pha) và *Kế hoạch xử lý / Phản ánh tương tự*. Cột phải (sticky): ghi chú TriageBot theo ngữ cảnh (đổi tâm trạng theo độ tin cậy/ưu tiên), vòng đo điểm ưu tiên SVG quét từ 0 lên khi vào trang, thanh confidence, phòng ban đề xuất, phiên bản model; cán bộ/quản trị có thêm form cập nhật trạng thái & định tuyến. |

---

## 6. Gửi phản ánh mới

| | |
|---|---|
| Đường dẫn | `/tickets/new` |
| Vai trò | Sinh viên (và người dùng đã đăng nhập) |
| Mô tả | Form gửi phản ánh gồm tiêu đề và mô tả, kèm phần hướng dẫn nhập liệu giúp người dùng cung cấp đủ ngữ cảnh để AI phân loại chính xác hơn. Khi gửi, backend tạo ticket (trạng thái *analyzing*), gọi dịch vụ AI để phân tích rồi lưu kết quả; người dùng được chuyển sang trang chi tiết để xem ngay AI Triage Analysis. Có trạng thái loading khi đang gửi và thông báo lỗi nếu thất bại. |

---

## 7. Smart Triage Cockpit

| | |
|---|---|
| Đường dẫn | `/admin/triage` |
| Vai trò | Cán bộ (Staff), Quản trị (Admin) |
| Mô tả | Bàn điều phối trả lời câu hỏi "hôm nay nên xử lý phản ánh nào trước". Gồm các khối: Critical Queue (hàng đợi ưu tiên cao), Low Confidence Cases (ca AI chưa chắc chắn, cần người rà soát), AI Routing Recommendations (đề xuất định tuyến phòng ban), Possible Incident Groups (gợi ý nhóm sự cố diện rộng) và Recent Tickets. Mỗi phản ánh hiển thị nhãn, mức ưu tiên, điểm số, độ tin cậy và phòng ban đề xuất; có nút "Refresh" để tải lại tổng quan. |

---

## 8. Nhóm sự cố (Incident Groups)

| | |
|---|---|
| Đường dẫn | `/admin/incidents` |
| Vai trò | Cán bộ (Staff), Quản trị (Admin) — sinh viên bị chuyển hướng |
| Mô tả | Trình bày gợi ý nhóm phản ánh cùng chủ đề dưới dạng lưới thẻ `IncidentGroupCard`, mỗi thẻ thể hiện chủ đề nghi ngờ, số phản ánh liên quan, mức tương đồng trung bình và phòng ban đề xuất — bằng ngôn ngữ nghiệp vụ "sự cố diện rộng" thay vì chỉ "trùng lặp". Khi rê chuột lên thẻ, một gợi ý bám theo con trỏ (`CursorHoverHint`) hiển thị tiêu đề nhóm. Có trạng thái rỗng (chưa có nhóm) và nút "Làm mới". |

---

## 9. AI Review Queue — Bàn kiểm định AI

| | |
|---|---|
| Đường dẫn | `/admin/review` |
| Vai trò | Cán bộ (Staff), Quản trị (Admin) — sinh viên bị chuyển hướng |
| Mô tả | Màn rà soát các dự đoán độ tin cậy thấp để con người kiểm định và sửa nhãn. Bố cục hai cột: bên trái là hàng đợi ca cần review (kèm số đã review / tổng đang mở), bên phải là bảng quyết định cho phép chỉnh lại category và mức ưu tiên rồi lưu. Khi lưu một correction, ticket được cập nhật nhãn thủ công (`manual_category` / `manual_priority`), tự rời khỏi hàng đợi và tăng bộ đếm đã xử lý — tạo dữ liệu chất lượng cho vòng huấn luyện lại. |

---

## 10. ML Feedback Loop — Xưởng dữ liệu retrain

| | |
|---|---|
| Đường dẫn | `/admin/ml-feedback` |
| Vai trò | Cán bộ (Staff), Quản trị (Admin) — sinh viên bị chuyển hướng |
| Mô tả | "Xưởng" tổng hợp dữ liệu phục vụ huấn luyện lại mô hình. Gồm bảng mức sẵn sàng (tổng mẫu, số ca đã được người sửa nhãn, số ca độ tin cậy thấp < 0.65), panel xuất dữ liệu để lấy tập mẫu đã hiệu chỉnh, và bảng liệt kê mẫu đã được con người chỉnh sửa — có phân trang. Dữ liệu này khép kín vòng phản hồi ML: phản ánh đã xử lý/đã sửa nhãn → tập huấn luyện → huấn luyện lại → promote model. |

---

## 11. Model Info

| | |
|---|---|
| Đường dẫn | `/admin/model-info` |
| Vai trò | Cán bộ (Staff), Quản trị (Admin) — sinh viên bị chuyển hướng |
| Mô tả | Trang minh bạch mô hình AI đang phục vụ. Hiển thị các thẻ chỉ số: phiên bản model, thuật toán (TF-IDF + Logistic Regression), Accuracy, Macro F1; kèm panel mô tả pipeline và đám mây các nhóm lĩnh vực model nhận diện. Dữ liệu lấy từ endpoint `model-info` của dịch vụ AI, có nút làm mới telemetry. Đây cũng là nơi đặt thao tác phân tích lại toàn bộ (re-analyze) sau khi promote model mới để các phản ánh cũ phản ánh kết quả của model mới. |

---

### Ghi chú vai trò & điều hướng

- Hệ thống có 3 vai trò: student (sinh viên), staff (cán bộ phòng ban), admin (quản trị). "IT Staff" là `role = staff` + `department`, không phải vai trò riêng.
- Các trang quản trị (`/admin/*`) và `/dashboard` chuyển hướng sinh viên về `/tickets`; truy cập API tương ứng được bảo vệ bằng phân quyền RBAC ở backend.
- Mọi hoạt ảnh dùng CSS keyframes tùy biến (`st-rise`, `st-bar-grow`, `st-pop-in`, `st-idle-float`, hoạt ảnh mascot…), tối ưu GPU và tôn trọng *prefers-reduced-motion*.
