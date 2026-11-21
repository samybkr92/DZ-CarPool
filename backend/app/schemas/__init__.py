from app.schemas.user import UserCreate, UserLogin, UserUpdate, UserOut, Token
from app.schemas.vehicle import VehicleCreate, VehicleOut
from app.schemas.trip import TripCreate, TripUpdate, TripOut, TripListResponse, TripStopCreate, TripStopOut
from app.schemas.booking import BookingCreate, BookingAction, BookingOut
from app.schemas.message import MessageCreate, MessageOut
from app.schemas.fuel import FuelEstimateRequest, FuelEstimateResponse

__all__ = [
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "UserOut",
    "Token",
    "VehicleCreate",
    "VehicleOut",
    "TripCreate",
    "TripUpdate",
    "TripOut",
    "TripListResponse",
    "TripStopCreate",
    "TripStopOut",
    "BookingCreate",
    "BookingAction",
    "BookingOut",
    "MessageCreate",
    "MessageOut",
    "FuelEstimateRequest",
    "FuelEstimateResponse",
]
