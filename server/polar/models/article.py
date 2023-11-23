import enum
from uuid import UUID

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, declared_attr, mapped_column, relationship

from polar.kit.db.models import RecordModel
from polar.kit.extensions.sqlalchemy import PostgresUUID
from polar.kit.extensions.sqlalchemy.types import StringEnum
from polar.models.organization import Organization
from polar.models.user import User


class Article(RecordModel):
    __tablename__ = "articles"

    __table_args__ = (UniqueConstraint("organization_id", "slug"),)

    slug: Mapped[str] = mapped_column(String(255), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(String, nullable=False)

    created_by: Mapped[UUID] = mapped_column(
        PostgresUUID, ForeignKey("users.id"), nullable=False
    )

    organization_id: Mapped[UUID] = mapped_column(
        PostgresUUID, ForeignKey("organizations.id"), nullable=False
    )

    class Byline(str, enum.Enum):
        user = "user"
        organization = "organization"

    byline: Mapped[Byline] = mapped_column(
        StringEnum(Byline), nullable=False, default=Byline.user
    )

    class Visibility(str, enum.Enum):
        public = "public"
        hidden = "hidden"  # visible if you have the link
        private = "private"  # only visible to org members

    visibility: Mapped[Visibility] = mapped_column(
        StringEnum(Visibility), nullable=False, default=Visibility.private
    )

    @declared_attr
    def organization(cls) -> Mapped[Organization]:
        return relationship(
            Organization,
            lazy="raise",
            primaryjoin=Organization.id == cls.organization_id,
        )

    @declared_attr
    def created_by_user(cls) -> Mapped[User]:
        return relationship(
            User,
            lazy="raise",
            primaryjoin=User.id == cls.created_by,
        )