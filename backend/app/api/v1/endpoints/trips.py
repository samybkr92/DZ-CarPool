from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.trip import Trip
from app.models.booking import Booking
from app.schemas.trip import TripCreate, TripUpdate, TripOut, TripListResponse
from app.services.trip_service import create_trip as create_trip_service, search_trips as search_trips_service
from app.services.pricing_service import calculate_pricing

router = APIRouter(prefix="/trips", tags=["Trajets"])


def format_trip_response(trip: Trip) -> TripOut:
    """Computes transparent pricing values for TripOut."""
    std_pricing = calculate_pricing(trip.base_seat_price, 1, "standard")
    comfort_pricing = (
        calculate_pricing(trip.base_seat_price, 1, "comfort")
        if trip.comfort_enabled
        else None
    )

    return TripOut(
        id=trip.id,
        driver_id=trip.driver_id,
        vehicle_id=trip.vehicle_id,
        origin_wilaya_code=trip.origin_wilaya_code,
        origin_wilaya_name=trip.origin_wilaya_name,
        origin_city=trip.origin_city,
        origin_address=trip.origin_address,
        origin_lat=float(trip.origin_lat) if trip.origin_lat is not None else None,
        origin_lng=float(trip.origin_lng) if trip.origin_lng is not None else None,
        destination_wilaya_code=trip.destination_wilaya_code,
        destination_wilaya_name=trip.destination_wilaya_name,
        destination_city=trip.destination_city,
        destination_address=trip.destination_address,
        destination_lat=float(trip.destination_lat) if trip.destination_lat is not None else None,
        destination_lng=float(trip.destination_lng) if trip.destination_lng is not None else None,
        departure_datetime=trip.departure_datetime,
        estimated_duration_minutes=trip.estimated_duration_minutes,
        distance_km=float(trip.distance_km),
        total_seats=trip.total_seats,
        available_seats=trip.available_seats,
        base_seat_price=float(trip.base_seat_price),
        comfort_enabled=trip.comfort_enabled,
        has_mandatory_rest=trip.has_mandatory_rest,
        fuel_estimate_cost=float(trip.fuel_estimate_cost),
        suggested_seat_price=float(trip.suggested_seat_price),
        status=trip.status,
        cancellation_reason=trip.cancellation_reason,
        created_at=trip.created_at,
        passenger_standard_price=std_pricing["passenger_price_per_seat"],
        passenger_comfort_price=comfort_pricing["passenger_price_per_seat"] if comfort_pricing else None,
        driver_net_payout=float(trip.base_seat_price),
        platform_commission_rate=0.15,
        comfort_surcharge_rate=0.30,
        driver=trip.driver,
        vehicle=trip.vehicle,
        stops=trip.stops,
    )


@router.get("", response_model=TripListResponse)
def get_trips(
    origin: Optional[str] = Query(None, description="Ville ou wilaya de départ"),
    destination: Optional[str] = Query(None, description="Ville ou wilaya d'arrivée"),
    date: Optional[str] = Query(None, description="Date au format YYYY-MM-DD"),
    min_seats: int = Query(1, ge=1, le=8),
    max_price: Optional[float] = Query(None, ge=0),
    comfort_only: bool = Query(False),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Search trips with filters and pagination."""
    result = search_trips_service(
        db=db,
        origin=origin,
        destination=destination,
        date_str=date,
        min_seats=min_seats,
        max_price=max_price,
        comfort_only=comfort_only,
        page=page,
        limit=limit,
    )

    formatted_trips = [format_trip_response(t) for t in result["trips"]]
    return TripListResponse(
        total=result["total"],
        page=result["page"],
        limit=result["limit"],
        trips=formatted_trips,
    )


@router.post("", response_model=TripOut, status_code=status.HTTP_201_CREATED)
def create_trip_endpoint(
    trip_in: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Creates a new trip with mandatory rest checks and fuel estimation."""
    trip = create_trip_service(db, current_user, trip_in.model_dump())
    return format_trip_response(trip)


@router.get("/my/driver", response_model=List[TripOut])
def get_my_driver_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lists trips published by the authenticated driver."""
    trips = (
        db.query(Trip)
        .filter(Trip.driver_id == current_user.id)
        .order_by(Trip.departure_datetime.desc())
        .all()
    )
    return [format_trip_response(t) for t in trips]


@router.get("/my/passenger", response_model=List[TripOut])
def get_my_passenger_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lists trips where the authenticated user has made a booking."""
    bookings = (
        db.query(Booking)
        .filter(Booking.passenger_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    trip_ids = list({b.trip_id for b in bookings})
    trips = db.query(Trip).filter(Trip.id.in_(trip_ids)).all()
    return [format_trip_response(t) for t in trips]


@router.get("/{id}", response_model=TripOut)
def get_trip_detail(
    id: int,
    db: Session = Depends(get_db),
):
    """Retrieves full details of a specific trip."""
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trajet introuvable.")
    return format_trip_response(trip)


@router.put("/{id}", response_model=TripOut)
def update_trip(
    id: int,
    trip_update: TripUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Updates trip details (driver only)."""
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trajet introuvable.")
    if trip.driver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Non autorisé à modifier ce trajet.")

    update_data = trip_update.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(trip, field, val)

    db.commit()
    db.refresh(trip)
    return format_trip_response(trip)


@router.delete("/{id}", response_model=TripOut)
def cancel_trip(
    id: int,
    reason: Optional[str] = Query("Annulé par le conducteur"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cancels a trip and updates all associated bookings."""
    trip = db.query(Trip).filter(Trip.id == id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trajet introuvable.")
    if trip.driver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Non autorisé à annuler ce trajet.")

    trip.status = "cancelled"
    trip.cancellation_reason = reason

    # Cancel confirmed/pending bookings
    bookings = db.query(Booking).filter(
        Booking.trip_id == id,
        Booking.status.in_(["pending", "confirmed"]),
    ).all()
    for b in bookings:
        b.status = "cancelled"
        b.rejection_or_cancellation_reason = f"Trajet annulé par le conducteur : {reason}"

    db.commit()
    db.refresh(trip)
    return format_trip_response(trip)
