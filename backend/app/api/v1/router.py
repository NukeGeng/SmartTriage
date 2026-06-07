from fastapi import APIRouter

from app.api.v1.endpoints import ai, admin_triage, auth, dashboard, health, tickets, users

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(ai.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(tickets.router)
api_router.include_router(dashboard.router)
api_router.include_router(admin_triage.router)
