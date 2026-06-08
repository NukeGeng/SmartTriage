from fastapi import APIRouter

from app.api.v1.endpoints import analyze, health, incidents, model_info

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(analyze.router)
api_router.include_router(model_info.router)
api_router.include_router(incidents.router)
