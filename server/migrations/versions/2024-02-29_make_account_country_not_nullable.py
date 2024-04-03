"""Make Account.country not nullable

Revision ID: 54a671eee7a2
Revises: 9a807baeceec
Create Date: 2024-02-29 10:01:21.540751

"""

import sqlalchemy as sa
from alembic import op

# Polar Custom Imports
from polar.kit.extensions.sqlalchemy import PostgresUUID

# revision identifiers, used by Alembic.
revision = "54a671eee7a2"
down_revision = "9a807baeceec"
branch_labels: tuple[str] | None = None
depends_on: tuple[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "accounts", "country", existing_type=sa.VARCHAR(length=2), nullable=False
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "accounts", "country", existing_type=sa.VARCHAR(length=2), nullable=True
    )
    # ### end Alembic commands ###
