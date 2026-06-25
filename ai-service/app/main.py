import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import configure_logging
from app.schemas.common import ApiResponse

configure_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # Nạp sẵn model (warm cache) lúc khởi động để request đầu tiên không phải chờ nạp joblib.
    from app.services.analysis_service import get_analysis_service

    get_analysis_service()
    logger.info("AI service started in %s mode (model preloaded)", settings.APP_ENV)
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version="0.1.0",
        description="SmartTriage AI/ML inference API",
        lifespan=lifespan,
    )
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    @app.get("/", response_model=ApiResponse)
    def root() -> ApiResponse:
        return ApiResponse(
            success=True,
            message="SmartTriage AI Service",
            data={"service": "ai-service", "status": "ok"},
        )

    return app


app = create_app()
