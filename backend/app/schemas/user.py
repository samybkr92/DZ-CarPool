from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class UserBase(BaseModel):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$", description="Adresse email valide")
    full_name: str = Field(..., min_length=2, max_length=150)
    phone_number: Optional[str] = None
    role: str = "both"  # driver, passenger, both
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    wilaya_code: Optional[int] = Field(None, ge=1, le=58)
    wilaya_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    wilaya_code: Optional[int] = Field(None, ge=1, le=58)
    wilaya_name: Optional[str] = None


class UserOut(UserBase):
    id: int
    rating_avg: float
    rating_count: int
    trips_completed_count: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
