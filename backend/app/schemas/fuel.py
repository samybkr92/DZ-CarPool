from typing import Optional
from pydantic import BaseModel, Field


class FuelEstimateRequest(BaseModel):
    distance_km: float = Field(..., ge=0)
    total_seats: int = Field(default=3, ge=1, le=8)
    wilaya_code: Optional[int] = Field(None, ge=1, le=58)
    fuel_type: str = Field(default="essence", pattern="^(essence|diesel|gpl)$")


class FuelEstimateResponse(BaseModel):
    distance_km: float
    fuel_type: str
    fuel_consumption_rate_l_100km: float
    fuel_liters_estimated: float
    price_per_liter_dzd: float
    total_fuel_cost_dzd: float
    total_seats: int
    suggested_seat_price_dzd: float
    is_fallback: bool
    advisory_note: str
