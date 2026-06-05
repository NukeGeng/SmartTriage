class AppException(Exception):
    """Base exception for backend service errors."""

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)
