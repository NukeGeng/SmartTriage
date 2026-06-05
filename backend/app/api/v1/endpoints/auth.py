from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import CurrentUserResponse, LoginRequest, RegisterRequest
from app.schemas.common import ApiResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> ApiResponse:
    user = AuthService.register(db, payload)
    return ApiResponse(
        success=True,
        message="Register successful",
        data=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=ApiResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> ApiResponse:
    token = AuthService.login(db, payload)
    return ApiResponse(success=True, message="Login successful", data=token)


@router.get("/me", response_model=ApiResponse)
def me(current_user: User = Depends(get_current_user)) -> ApiResponse:
    return ApiResponse(
        success=True,
        message="Current user",
        data=CurrentUserResponse.model_validate(current_user),
    )
