"""Add Account.platform_pledge_fee_percent and Account.platform_subscription_fee_percent

Revision ID: 7e3d43b4fbcd
Revises: 54a671eee7a2
Create Date: 2024-03-04 10:28:41.456776

"""

import sqlalchemy as sa
from alembic import op

# Polar Custom Imports
from polar.kit.extensions.sqlalchemy import PostgresUUID

# revision identifiers, used by Alembic.
revision = "7e3d43b4fbcd"
down_revision = "54a671eee7a2"
branch_labels: tuple[str] | None = None
depends_on: tuple[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "accounts",
        sa.Column("platform_pledge_fee_percent", sa.Integer(), nullable=True),
    )
    op.add_column(
        "accounts",
        sa.Column("platform_subscription_fee_percent", sa.Integer(), nullable=True),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("accounts", "platform_subscription_fee_percent")
    op.drop_column("accounts", "platform_pledge_fee_percent")
    # ### end Alembic commands ###
