"""Add organization_id and make account_id optional on HeldTransfer

Revision ID: 3c0a03756217
Revises: 5ee9d05dc8c1
Create Date: 2024-02-14 09:37:13.423421

"""

import sqlalchemy as sa
from alembic import op

# Polar Custom Imports
from polar.kit.extensions.sqlalchemy import PostgresUUID

# revision identifiers, used by Alembic.
revision = "3c0a03756217"
down_revision = "5ee9d05dc8c1"
branch_labels: tuple[str] | None = None
depends_on: tuple[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "held_transfers", sa.Column("organization_id", sa.UUID(), nullable=True)
    )
    op.alter_column(
        "held_transfers", "account_id", existing_type=sa.UUID(), nullable=True
    )
    op.create_index(
        op.f("ix_held_transfers_organization_id"),
        "held_transfers",
        ["organization_id"],
        unique=False,
    )
    op.create_foreign_key(
        op.f("held_transfers_organization_id_fkey"),
        "held_transfers",
        "organizations",
        ["organization_id"],
        ["id"],
        ondelete="cascade",
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(
        op.f("held_transfers_organization_id_fkey"),
        "held_transfers",
        type_="foreignkey",
    )
    op.drop_index(
        op.f("ix_held_transfers_organization_id"), table_name="held_transfers"
    )
    op.alter_column(
        "held_transfers", "account_id", existing_type=sa.UUID(), nullable=False
    )
    op.drop_column("held_transfers", "organization_id")
    # ### end Alembic commands ###
