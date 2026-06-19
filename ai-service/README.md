# SmartTriage AI Service

FastAPI service xử lý inference, phân loại phản ánh, chấm điểm ưu tiên, phát hiện ticket liên quan và đề xuất phòng ban.

## Cài đặt

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

## Pipeline dataset và model

Tạo 12.000 sample tổng hợp có version:

```bash
python scripts/generate_sample_dataset.py
```

Train một candidate run, chưa thay model đang phục vụ:

```bash
python scripts/train_category_model.py \
  --dataset-path data/training/versions/synthetic-v2/training.csv \
  --dataset-version synthetic-v2 \
  --run-id synthetic-v2-candidate-001
```

Đánh giá candidate trên dataset độc lập:

```bash
python scripts/evaluate_model.py \
  --dataset-path data/raw/ticket_samples.csv \
  --model-dir models/runs/synthetic-v2-candidate-001
```

Promote model sau khi duyệt metric:

```bash
python scripts/promote_training_run.py --run-id synthetic-v2-candidate-001
```

Build duplicate index:

```bash
python scripts/build_duplicate_index.py
```

Chi tiết kiến trúc: [Offline Training Pipeline](../docs/report/offline_training_pipeline.md).

## Chạy service

```bash
uvicorn app.main:app --reload --port 8001
```

API docs: `http://localhost:8001/docs`

Health check: `http://localhost:8001/api/v1/health`
