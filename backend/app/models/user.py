from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, Numeric, DateTime, Text, CheckConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    phone_number = Column(String(30), nullable=True)
    role = Column(String(20), nullable=False, default="both")  # driver, passenger, both, admin
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    wilaya_code = Column(Integer, nullable=True)
    wilaya_name = Column(String(100), nullable=True)

    rating_avg = Column(Numeric(3, 2), nullable=False, default=5.00)
    rating_count = Column(Integer, nullable=False, default=0)
    trips_completed_count = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    vehicles = relationship("Vehicle", back_populates="owner", cascade="all, delete-orphan")
    driven_trips = relationship("Trip", back_populates="driver", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="passenger", cascade="all, delete-orphan")
    sent_messages = relationship("TripMessage", back_populates="sender", cascade="all, delete-orphan")
    given_reviews = relationship("Review", foreign_keys="Review.author_id", back_populates="author")
    received_reviews = relationship("Review", foreign_keys="Review.target_id", back_populates="target")

    __table_args__ = (
        CheckConstraint("role IN ('driver', 'passenger', 'both', 'admin')", name="check_user_role"),
        CheckConstraint("rating_avg >= 1.00 AND rating_avg <= 5.00", name="check_user_rating_avg"),
        CheckConstraint("rating_count >= 0", name="check_user_rating_count"),
    )
