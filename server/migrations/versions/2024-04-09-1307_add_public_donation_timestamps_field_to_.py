"""add public_donation_timestamps field to organizations

Revision ID: 2c69523599fe
Revises: da45f8bba402
Create Date: 2024-04-09 13:07:07.255886

"""

import sqlalchemy as sa
from alembic import op

# Polar Custom Imports
from polar.kit.extensions.sqlalchemy import PostgresUUID

# revision identifiers, used by Alembic.
revision = "2c69523599fe"
down_revision = "da45f8bba402"
branch_labels: tuple[str] | None = None
depends_on: tuple[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "organizations",
        sa.Column(
            "public_donation_timestamps",
            sa.Boolean(),
            nullable=False,
            server_default="false",
        ),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("organizations", "public_donation_timestamps")
    # ### end Alembic commands ###
