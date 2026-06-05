from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.schemas.common import ApiResponse


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version="0.1.0",
        description="SmartTriage backend business API",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.FRONTEND_URL],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    @app.get("/", response_model=ApiResponse)
    def root() -> ApiResponse:
        return ApiResponse(
            success=True,
            message="SmartTriage Backend API",
            data={"service": "backend", "status": "ok"},
        )

    return app


app = create_app()
