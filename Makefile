.PHONY: help compose-config up-postgres down logs

help:
	@echo "SmartTriage development commands"
	@echo "  make compose-config  Validate docker-compose.yml"
	@echo "  make up-postgres     Start PostgreSQL"
	@echo "  make down            Stop local services"
	@echo "  make logs            Follow Docker Compose logs"

compose-config:
	docker compose config

up-postgres:
	docker compose up -d postgres

down:
	docker compose down

logs:
	docker compose logs -f
