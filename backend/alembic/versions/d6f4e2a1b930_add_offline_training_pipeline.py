"""add offline training pipeline

Revision ID: d6f4e2a1b930
Revises: a3ee71ec97dc
Create Date: 2026-06-19 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "d6f4e2a1b930"
down_revision: Union[str, Sequence[str], None] = "a3ee71ec97dc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    dataset_status_type = postgresql.ENUM(
        "ready", "trained", "archived", name="dataset_version_status"
    )
    review_status_type = postgresql.ENUM(
        "candidate", "approved", "excluded", name="training_review_status"
    )
    dataset_status_type.create(op.get_bind(), checkfirst=True)
    review_status_type.create(op.get_bind(), checkfirst=True)
    dataset_status = postgresql.ENUM(
        "ready", "trained", "archived", name="dataset_version_status", create_type=False
    )
    review_status = postgresql.ENUM(
        "candidate", "approved", "excluded", name="training_review_status", create_type=False
    )

    op.create_table(
        "dataset_versions",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("version", sa.String(length=100), nullable=False),
        sa.Column("status", dataset_status, nullable=False),
        sa.Column("sample_count", sa.Integer(), nullable=False),
        sa.Column("category_distribution", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("created_by_id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["created_by_id"], ["users.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("version"),
    )
    op.create_index(op.f("ix_dataset_versions_status"), "dataset_versions", ["status"], unique=False)
    op.create_index(op.f("ix_dataset_versions_version"), "dataset_versions", ["version"], unique=True)

    op.create_table(
        "training_samples",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("source_ticket_id", sa.UUID(), nullable=True),
        sa.Column("dataset_version_id", sa.UUID(), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("priority", sa.String(length=50), nullable=True),
        sa.Column("label_source", sa.String(length=50), nullable=False),
        sa.Column("review_status", review_status, nullable=False),
        sa.Column("is_anonymized", sa.Boolean(), nullable=False),
        sa.Column("content_hash", sa.String(length=64), nullable=False),
        sa.Column("approved_by_id", sa.UUID(), nullable=True),
        sa.Column("approved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["approved_by_id"], ["users.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["dataset_version_id"], ["dataset_versions.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["source_ticket_id"], ["tickets.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("content_hash"),
        sa.UniqueConstraint("source_ticket_id"),
    )
    for column in ("category", "content_hash", "dataset_version_id", "label_source", "review_status", "source_ticket_id"):
        op.create_index(op.f(f"ix_training_samples_{column}"), "training_samples", [column], unique=False)


def downgrade() -> None:
    for column in ("source_ticket_id", "review_status", "label_source", "dataset_version_id", "content_hash", "category"):
        op.drop_index(op.f(f"ix_training_samples_{column}"), table_name="training_samples")
    op.drop_table("training_samples")
    op.drop_index(op.f("ix_dataset_versions_version"), table_name="dataset_versions")
    op.drop_index(op.f("ix_dataset_versions_status"), table_name="dataset_versions")
    op.drop_table("dataset_versions")
    postgresql.ENUM(name="training_review_status").drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM(name="dataset_version_status").drop(op.get_bind(), checkfirst=True)
