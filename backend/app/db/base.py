from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Imported so Alembic can discover model metadata as models are added.
from app.models import incident_group, ticket, ticket_analysis, user  # noqa: E402,F401
