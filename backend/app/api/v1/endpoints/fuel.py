from fastapi import APIRouter
from app.schemas.fuel import FuelEstimateRequest, FuelEstimateResponse
from app.services.fuel_service import estimate_fuel_and_suggest_price

router = APIRouter(prefix="/fuel", tags=["Carburant & Estimations"])


@router.post("/estimate", response_model=FuelEstimateResponse)
def estimate_fuel_cost(req: FuelEstimateRequest):
    """
    Calculates estimated fuel cost and suggested per-seat price based on:
    - 8 L / 100 km standard consumption
    - Local wilaya fuel rates from prix_carburants.json
    - Total seat division
    """
    res = estimate_fuel_and_suggest_price(
        distance_km=req.distance_km,
        total_seats=req.total_seats,
        wilaya_code=req.wilaya_code,
        fuel_type=req.fuel_type,
    )
    return FuelEstimateResponse(**res)
