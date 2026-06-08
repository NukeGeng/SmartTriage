"""merge analysis metadata and incident heads

Revision ID: a3ee71ec97dc
Revises: 8c0d33e5f1aa, a7d1e94b6c23
Create Date: 2026-06-09 00:26:36.593683

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3ee71ec97dc'
down_revision: Union[str, Sequence[str], None] = ('8c0d33e5f1aa', 'a7d1e94b6c23')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
