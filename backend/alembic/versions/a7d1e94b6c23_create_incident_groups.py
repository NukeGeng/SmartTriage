"""create incident groups

Revision ID: a7d1e94b6c23
Revises: 4ad3dddeb911
Create Date: 2026-06-07 23:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a7d1e94b6c23"
down_revision: Union[str, Sequence[str], None] = "4ad3dddeb911"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "incident_groups",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("category", sa.String(length=100), nullable=True),
        sa.Column("priority", sa.String(length=50), nullable=True),
        sa.Column("suggested_department", sa.String(length=255), nullable=True),
        sa.Column(
            "status",
            sa.Enum("open", "in_progress", "resolved", "closed", name="incident_group_status"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_incident_groups_category"), "incident_groups", ["category"], unique=False)
    op.create_index(op.f("ix_incident_groups_priority"), "incident_groups", ["priority"], unique=False)
    op.create_index(op.f("ix_incident_groups_status"), "incident_groups", ["status"], unique=False)
    op.create_index(
        op.f("ix_incident_groups_suggested_department"),
        "incident_groups",
        ["suggested_department"],
        unique=False,
    )
    op.create_table(
        "incident_group_tickets",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("incident_group_id", sa.UUID(), nullable=False),
        sa.Column("ticket_id", sa.UUID(), nullable=False),
        sa.Column("similarity_score", sa.Float(), nullable=True),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["incident_group_id"], ["incident_groups.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["ticket_id"], ["tickets.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("incident_group_id", "ticket_id", name="uq_incident_group_ticket"),
    )
    op.create_index(
        op.f("ix_incident_group_tickets_incident_group_id"),
        "incident_group_tickets",
        ["incident_group_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_incident_group_tickets_ticket_id"),
        "incident_group_tickets",
        ["ticket_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_incident_group_tickets_ticket_id"), table_name="incident_group_tickets")
    op.drop_index(op.f("ix_incident_group_tickets_incident_group_id"), table_name="incident_group_tickets")
    op.drop_table("incident_group_tickets")
    op.drop_index(op.f("ix_incident_groups_suggested_department"), table_name="incident_groups")
    op.drop_index(op.f("ix_incident_groups_status"), table_name="incident_groups")
    op.drop_index(op.f("ix_incident_groups_priority"), table_name="incident_groups")
    op.drop_index(op.f("ix_incident_groups_category"), table_name="incident_groups")
    op.drop_table("incident_groups")
    sa.Enum("open", "in_progress", "resolved", "closed", name="incident_group_status").drop(
        op.get_bind(),
        checkfirst=True,
    )
