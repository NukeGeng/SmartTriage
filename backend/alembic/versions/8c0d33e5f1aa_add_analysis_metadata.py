"""add analysis metadata

Revision ID: 8c0d33e5f1aa
Revises: 4ad3dddeb911
Create Date: 2026-06-07 23:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "8c0d33e5f1aa"
down_revision: Union[str, Sequence[str], None] = "4ad3dddeb911"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "ticket_analyses",
        sa.Column(
            "analysis_metadata",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
    )
    op.alter_column("ticket_analyses", "analysis_metadata", server_default=None)


def downgrade() -> None:
    op.drop_column("ticket_analyses", "analysis_metadata")
