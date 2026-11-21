from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class TripStop(Base):
    __tablename__ = "trip_stops"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    stop_order = Column(Integer, nullable=False)
    location_name = Column(String(200), nullable=False)
    city = Column(String(150), nullable=False)
    wilaya_name = Column(String(100), nullable=True)
    is_mandatory_rest = Column(Boolean, nullable=False, default=False)
    duration_minutes = Column(Integer, nullable=False, default=15)
    notes = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    trip = relationship("Trip", back_populates="stops")

    __table_args__ = (
        UniqueConstraint("trip_id", "stop_order", name="uq_trip_stop_order"),
    )
