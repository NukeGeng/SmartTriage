# Hướng dẫn Deploy SmartTriage (Vercel + Render)

SmartTriage gồm 4 thành phần. Vercel **chỉ** chạy được frontend; backend + ai-service + database deploy trên **Render**.

```
Vercel                         Render
┌───────────────┐   HTTPS      ┌──────────────────────────────────────┐
│ frontend       │ ───────────▶ │ backend (FastAPI, Docker)            │
│ (Next.js)      │   REST+JWT   │   ├─ HTTP ─▶ ai-service (FastAPI)    │
└───────────────┘              │   └─ SQL  ─▶ PostgreSQL (Render DB)  │
                                └──────────────────────────────────────┘
```

> Thứ tự deploy: **PostgreSQL → ai-service → backend → frontend** (cái sau cần URL của cái trước).

---

## Phần 0 — Chuẩn bị
- Push code lên GitHub (đã xong: nhánh `main`).
- Tài khoản: [render.com](https://render.com) và [vercel.com](https://vercel.com) (đăng nhập bằng GitHub).
- Tạo sẵn một `JWT_SECRET_KEY` mạnh: `openssl rand -hex 32` (hoặc để Render tự sinh).

---

## Phần A — PostgreSQL (Render)
1. Render Dashboard → **New +** →**PostgreSQL**.
2. Name: `smarttriage-db` · Region: **Singapore** · Plan: **Free**.
3. Tạo xong, vào tab **Info**, copy **Internal Database URL** (dạng `postgresql://...`). Sẽ dùng cho backend.

> Lưu ý: Postgres free của Render hết hạn sau ~90 ngày. Cho đồ án thì ổn; chạy lâu dài nên dùng [Neon](https://neon.tech) (free, không hết hạn).

---

## Phần B — ai-service (Render, Docker)
1. **New +** → **Web Service** → chọn repo SmartTriage.
2. Cấu hình:
   - Name: `smarttriage-ai` · Region: **Singapore** · Plan: Free
   - **Root Directory:** `ai-service`
   - **Runtime:** Docker (Render tự nhận `ai-service/Dockerfile`)
   - **Start Command (override):** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/api/v1/health`
3. **Environment** → thêm:
   | Key | Value |
   |---|---|
   | `APP_ENV` | `production` |
   | `MODEL_DIR` | `models` |
   | `DATASET_PATH` | `data/training/versions/synthetic-v2/training.csv` |
   | `DUPLICATE_INDEX_PATH` | `data/tickets_index/sample_existing_tickets.csv` |
4. Create → chờ build (cài scikit-learn nên hơi lâu). Xong, copy URL, vd `https://smarttriage-ai.onrender.com`.

---

## Phần C — backend (Render, Docker)
1. **New +** → **Web Service** → cùng repo.
2. Cấu hình:
   - Name: `smarttriage-backend` · Region: **Singapore** · Plan: Free
   - **Root Directory:** `backend`
   - **Runtime:** Docker
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Pre-Deploy Command:** `alembic upgrade head`  ← chạy migration tạo bảng
   - **Health Check Path:** `/api/v1/health`
3. **Environment** → thêm:
   | Key | Value |
   |---|---|
   | `APP_ENV` | `production` |
   | `DATABASE_URL` | (Internal Database URL ở Phần A) |
   | `JWT_SECRET_KEY` | chuỗi `openssl rand -hex 32` |
   | `JWT_ALGORITHM` | `HS256` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` |
   | `AI_SERVICE_URL` | URL ai-service ở Phần B (vd `https://smarttriage-ai.onrender.com`) |
   | `FRONTEND_URL` | **tạm để** `http://localhost:3000`, sửa lại sau khi có URL Vercel (Phần D) |
4. Create → chờ deploy. Test: mở `https://smarttriage-backend.onrender.com/api/v1/health` → `{"success":true,...}`.
5. (Tùy chọn) Seed tài khoản/dữ liệu demo: Render → service backend → tab **Shell** → chạy `python -m scripts.seed_tickets` (hoặc lệnh seed tương ứng trong repo).

---

## Phần D — frontend (Vercel)
1. [vercel.com](https://vercel.com) → **Add New → Project** → import repo SmartTriage.
2. **Root Directory:** `frontend` (quan trọng — vì là monorepo). Framework tự nhận **Next.js**.
3. **Environment Variables** → thêm:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_BACKEND_URL` | URL backend ở Phần C (vd `https://smarttriage-backend.onrender.com`) |
   > ⚠️ Biến `NEXT_PUBLIC_*` được "nướng" vào lúc **build**. Nếu sau này đổi, phải **Redeploy** mới ăn.
4. **Deploy**. Xong sẽ có URL, vd `https://smarttriage.vercel.app`.

---

## Phần E — Nối lại (CORS) — BẮT BUỘC
Backend chỉ cho phép gọi từ đúng `FRONTEND_URL` ([backend/app/main.py](../backend/app/main.py) — `allow_origins=[settings.FRONTEND_URL]`).
1. Quay lại Render → service **backend** → Environment → sửa `FRONTEND_URL` = URL Vercel (vd `https://smarttriage.vercel.app`, **không có dấu `/` cuối**).
2. Save → backend tự redeploy.
3. Mở web Vercel → đăng nhập bằng tài khoản demo → kiểm tra tạo phản ánh chạy được.

---

## Checklist sau deploy
- [ ] `…/api/v1/health` của backend & ai-service đều trả `success: true`.
- [ ] Đăng nhập trên web Vercel OK (không lỗi CORS trong Console F12).
- [ ] Tạo phản ánh → thấy kết quả AI Triage.
- [ ] `JWT_SECRET_KEY` là chuỗi ngẫu nhiên, **không** phải `change-me-in-production`.
- [ ] `FRONTEND_URL` (backend) khớp domain Vercel; `NEXT_PUBLIC_BACKEND_URL` (Vercel) khớp domain backend.

## Lưu ý "gối đầu" (gotchas)
- **Free tier Render ngủ** sau ~15 phút không dùng → request đầu sau khi ngủ lag ~30–50s (cold start). Demo: bấm trước vài phút cho thức, hoặc dùng gói trả phí nhỏ, hoặc ping `/health` định kỳ (cron-job.org).
- **Region nên giống nhau** (Singapore) cho backend ↔ ai ↔ db để độ trễ thấp; đặt backend gần Vercel region để giảm trễ chéo.
- Model joblib đã commit trong repo → tự nằm trong image, không cần upload gì thêm.
- Đã tối ưu **cache model** (singleton) nên sau request đầu, suy luận chỉ ~vài ms.

---

## (Tùy chọn) Render Blueprint
Repo có sẵn `render.yaml` ở thư mục gốc — có thể dùng **New + → Blueprint** để Render tự dựng `db + ai + backend` một lượt. Sau đó vẫn cần điền tay `FRONTEND_URL` (URL Vercel) và kiểm tra `AI_SERVICE_URL`. Một số trường có thể phải chỉnh nhẹ trong dashboard tùy phiên bản Render.
