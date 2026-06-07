import logging
from typing import Any

from fastapi import HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


class AppException(Exception):
    """Base exception for backend service errors."""

    def __init__(self, message: str, error_code: str = "APP_ERROR") -> None:
        self.message = message
        self.error_code = error_code
        super().__init__(message)


def build_error_response(
    message: str,
    error_code: str,
    details: Any | None = None,
) -> dict[str, Any]:
    return {
        "success": False,
        "message": message,
        "error_code": error_code,
        "details": details or {},
    }


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    message = exc.detail if isinstance(exc.detail, str) else "Request failed"
    details = {} if isinstance(exc.detail, str) else exc.detail
    logger.warning(
        "HTTP error %s %s status=%s detail=%s",
        request.method,
        request.url.path,
        exc.status_code,
        exc.detail,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=build_error_response(
            message=message,
            error_code=f"HTTP_{exc.status_code}",
            details=jsonable_encoder(details),
        ),
        headers=exc.headers,
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    logger.warning("Validation error %s %s detail=%s", request.method, request.url.path, exc.errors())
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=build_error_response(
            message="Validation error",
            error_code="VALIDATION_ERROR",
            details=jsonable_encoder(exc.errors()),
        ),
    )


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.warning("Application error %s %s detail=%s", request.method, request.url.path, exc.message)
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=build_error_response(
            message=exc.message,
            error_code=exc.error_code,
        ),
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=build_error_response(
            message="Internal server error",
            error_code="INTERNAL_SERVER_ERROR",
        ),
    )
