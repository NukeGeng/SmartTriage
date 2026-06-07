.PHONY: help start up down logs backend-dev ai-dev frontend-dev backend-test ai-test frontend-lint compose-config up-postgres

help:
	@echo "SmartTriage development commands"
	@echo "  make start          Run full local dev stack through npm start"
	@echo "  make up             Start all Docker Compose services"
	@echo "  make down           Stop local services"
	@echo "  make logs           Follow Docker Compose logs"
	@echo "  make backend-dev    Run backend development server"
	@echo "  make ai-dev         Run AI service development server"
	@echo "  make frontend-dev   Run frontend development server"
	@echo "  make backend-test   Run backend tests"
	@echo "  make ai-test        Run AI service tests"
	@echo "  make frontend-lint  Run frontend lint"

start:
	npm start

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

backend-dev:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

ai-dev:
	cd ai-service && uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

frontend-dev:
	cd frontend && npm run dev

backend-test:
	cd backend && pytest

ai-test:
	cd ai-service && pytest

frontend-lint:
	cd frontend && npm run lint

compose-config:
	docker compose config

up-postgres:
	docker compose up -d postgres
