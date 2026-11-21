from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.user import UserOut


class BookingCreate(BaseModel):
    seat_count: int = Field(default=1, ge=1, le=8)
    seat_type: str = Field(default="standard", pattern="^(standard|comfort)$")


class BookingAction(BaseModel):
    reason: Optional[str] = None


class BookingOut(BaseModel):
    id: int
    trip_id: int
    passenger_id: int
    seat_count: int
    seat_type: str
    status: str
    quoted_base_price: float
    quoted_commission: float
    quoted_comfort_fee: float
    quoted_total_price: float
    driver_payout: float
    rejection_or_cancellation_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    passenger: Optional[UserOut] = None
    trip: Optional[Any] = None

    model_config = ConfigDict(from_attributes=True)
