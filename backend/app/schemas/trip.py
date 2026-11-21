from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.user import UserOut
from app.schemas.vehicle import VehicleOut


class TripStopBase(BaseModel):
    stop_order: int = Field(..., ge=1)
    location_name: str
    city: str
    wilaya_name: Optional[str] = None
    is_mandatory_rest: bool = False
    duration_minutes: int = Field(default=15, ge=10)
    notes: Optional[str] = None


class TripStopCreate(TripStopBase):
    pass


class TripStopOut(TripStopBase):
    id: int
    trip_id: int

    model_config = ConfigDict(from_attributes=True)


class TripBase(BaseModel):
    origin_wilaya_code: int = Field(..., ge=1, le=58)
    origin_wilaya_name: str
    origin_city: str
    origin_address: str
    origin_lat: Optional[float] = None
    origin_lng: Optional[float] = None

    destination_wilaya_code: int = Field(..., ge=1, le=58)
    destination_wilaya_name: str
    destination_city: str
    destination_address: str
    destination_lat: Optional[float] = None
    destination_lng: Optional[float] = None

    departure_datetime: datetime
    estimated_duration_minutes: int = Field(..., gt=0)
    distance_km: float = Field(..., gt=0)

    total_seats: int = Field(..., ge=1, le=8)
    base_seat_price: float = Field(..., ge=0)
    comfort_enabled: bool = False
    vehicle_id: Optional[int] = None


class TripCreate(TripBase):
    fuel_type: str = "essence"
    stops: List[TripStopCreate] = []


class TripUpdate(BaseModel):
    base_seat_price: Optional[float] = Field(None, ge=0)
    departure_datetime: Optional[datetime] = None
    comfort_enabled: Optional[bool] = None
    status: Optional[str] = None
    cancellation_reason: Optional[str] = None


class TripOut(TripBase):
    id: int
    driver_id: int
    available_seats: int
    has_mandatory_rest: bool
    fuel_estimate_cost: float
    suggested_seat_price: float
    status: str
    cancellation_reason: Optional[str] = None
    created_at: datetime
    
    # Financial breakdowns for consumer clarity
    passenger_standard_price: float
    passenger_comfort_price: Optional[float] = None
    driver_net_payout: float
    platform_commission_rate: float = 0.15
    comfort_surcharge_rate: float = 0.30

    driver: Optional[UserOut] = None
    vehicle: Optional[VehicleOut] = None
    stops: List[TripStopOut] = []

    model_config = ConfigDict(from_attributes=True)


class TripListResponse(BaseModel):
    total: int
    page: int
    limit: int
    trips: List[TripOut]
