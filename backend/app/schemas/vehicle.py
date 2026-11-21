from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class VehicleBase(BaseModel):
    make: str = Field(..., max_length=100)
    model: str = Field(..., max_length=100)
    year: int = Field(..., ge=1990, le=2027)
    color: str = Field(..., max_length=50)
    license_plate: Optional[str] = None
    comfort_tier: str = "standard"
    air_conditioning: bool = True


class VehicleCreate(VehicleBase):
    pass


class VehicleOut(VehicleBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
