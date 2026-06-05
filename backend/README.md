# SmartTriage Backend

FastAPI service for SmartTriage business workflows. This service owns authentication, ticket APIs, dashboard aggregation, database access, and HTTP integration with the AI service.

## Development

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Health Check

```bash
curl http://localhost:8000/api/v1/health
```

Expected response:

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
