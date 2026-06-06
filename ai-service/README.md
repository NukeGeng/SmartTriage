# SmartTriage AI Service

FastAPI service for SmartTriage machine learning inference. It classifies student feedback tickets, scores priority, detects similar tickets, recommends departments, and suggests initial actions.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

## Dataset And Model

```bash
python scripts/generate_sample_dataset.py
python scripts/train_category_model.py
python scripts/evaluate_model.py
python scripts/build_duplicate_index.py
```

## Run

```bash
uvicorn app.main:app --reload --port 8001
```

API docs:

```txt
http://localhost:8001/docs
```

## Health Check

```bash
curl http://localhost:8001/api/v1/health
```
