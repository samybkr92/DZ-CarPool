from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Numeric, DateTime, Text, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="RESTRICT"), nullable=False, index=True)
    passenger_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)

    seat_count = Column(Integer, nullable=False, default=1)
    seat_type = Column(String(20), nullable=False, default="standard")  # standard, comfort
    status = Column(String(20), nullable=False, default="pending", index=True)  # pending, confirmed, rejected, cancelled, completed

    # Pricing snapshots
    quoted_base_price = Column(Numeric(10, 2), nullable=False)
    quoted_commission = Column(Numeric(10, 2), nullable=False)
    quoted_comfort_fee = Column(Numeric(10, 2), nullable=False, default=0.00)
    quoted_total_price = Column(Numeric(10, 2), nullable=False)
    driver_payout = Column(Numeric(10, 2), nullable=False)

    rejection_or_cancellation_reason = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    trip = relationship("Trip", back_populates="bookings")
    passenger = relationship("User", back_populates="bookings")

    __table_args__ = (
        CheckConstraint("seat_count >= 1", name="check_booking_seat_count"),
        CheckConstraint("seat_type IN ('standard', 'comfort')", name="check_booking_seat_type"),
        CheckConstraint("status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'completed')", name="check_booking_status"),
        CheckConstraint("quoted_base_price >= 0", name="check_booking_quoted_base"),
        CheckConstraint("quoted_total_price >= 0", name="check_booking_quoted_total"),
    )
