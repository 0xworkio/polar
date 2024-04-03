"""Update SubscriptionBenefitGrant model

Revision ID: 92930d833ad4
Revises: 7afc470169dc
Create Date: 2023-12-05 13:43:05.952900

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# Polar Custom Imports
from polar.kit.extensions.sqlalchemy import PostgresUUID

# revision identifiers, used by Alembic.
revision = "92930d833ad4"
down_revision = "7afc470169dc"
branch_labels: tuple[str] | None = None
depends_on: tuple[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "subscription_benefit_grants",
        sa.Column(
            "properties", postgresql.JSONB(astext_type=sa.Text()), nullable=False
        ),
    )
    op.add_column(
        "subscription_benefit_grants", sa.Column("user_id", sa.UUID(), nullable=False)
    )
    op.create_index(
        op.f("ix_subscription_benefit_grants_user_id"),
        "subscription_benefit_grants",
        ["user_id"],
        unique=False,
    )
    op.create_foreign_key(
        op.f("subscription_benefit_grants_user_id_fkey"),
        "subscription_benefit_grants",
        "users",
        ["user_id"],
        ["id"],
        ondelete="cascade",
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(
        op.f("subscription_benefit_grants_user_id_fkey"),
        "subscription_benefit_grants",
        type_="foreignkey",
    )
    op.drop_index(
        op.f("ix_subscription_benefit_grants_user_id"),
        table_name="subscription_benefit_grants",
    )
    op.drop_column("subscription_benefit_grants", "user_id")
    op.drop_column("subscription_benefit_grants", "properties")
    # ### end Alembic commands ###
