from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, Numeric, DateTime, Text, ForeignKey, CheckConstraint, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    driver_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id", ondelete="SET NULL"), nullable=True)

    # Origin
    origin_wilaya_code = Column(Integer, nullable=False)
    origin_wilaya_name = Column(String(100), nullable=False)
    origin_city = Column(String(150), nullable=False, index=True)
    origin_address = Column(String(255), nullable=False)
    origin_lat = Column(Numeric(9, 6), nullable=True)
    origin_lng = Column(Numeric(9, 6), nullable=True)

    # Destination
    destination_wilaya_code = Column(Integer, nullable=False)
    destination_wilaya_name = Column(String(100), nullable=False)
    destination_city = Column(String(150), nullable=False, index=True)
    destination_address = Column(String(255), nullable=False)
    destination_lat = Column(Numeric(9, 6), nullable=True)
    destination_lng = Column(Numeric(9, 6), nullable=True)

    # Schedule & Route
    departure_datetime = Column(DateTime, nullable=False, index=True)
    estimated_duration_minutes = Column(Integer, nullable=False)
    distance_km = Column(Numeric(8, 2), nullable=False)

    # Seats & Pricing
    total_seats = Column(Integer, nullable=False)
    available_seats = Column(Integer, nullable=False)
    base_seat_price = Column(Numeric(10, 2), nullable=False)  # Net amount for driver (DZD)

    # Business Rules DZ-CarPool
    comfort_enabled = Column(Boolean, nullable=False, default=False)
    has_mandatory_rest = Column(Boolean, nullable=False, default=False)  # Enforced if distance_km > 300

    # Fuel estimation advisory
    fuel_estimate_cost = Column(Numeric(10, 2), nullable=False, default=0.00)
    suggested_seat_price = Column(Numeric(10, 2), nullable=False, default=0.00)

    # Status
    status = Column(String(20), nullable=False, default="active", index=True)  # active, completed, cancelled
    cancellation_reason = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    driver = relationship("User", back_populates="driven_trips")
    vehicle = relationship("Vehicle", back_populates="trips")
    stops = relationship("TripStop", back_populates="trip", cascade="all, delete-orphan", order_by="TripStop.stop_order")
    bookings = relationship("Booking", back_populates="trip", cascade="all, delete-orphan")
    messages = relationship("TripMessage", back_populates="trip", cascade="all, delete-orphan", order_by="TripMessage.created_at")
    reviews = relationship("Review", back_populates="trip", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("total_seats >= 1 AND total_seats <= 8", name="check_trip_total_seats"),
        CheckConstraint("available_seats >= 0 AND available_seats <= total_seats", name="check_trip_available_seats"),
        CheckConstraint("base_seat_price >= 0", name="check_trip_base_price"),
        CheckConstraint("distance_km > 0", name="check_trip_distance"),
        CheckConstraint("status IN ('active', 'completed', 'cancelled')", name="check_trip_status"),
        Index("idx_trips_search_composite", "origin_city", "destination_city", "departure_datetime"),
    )
