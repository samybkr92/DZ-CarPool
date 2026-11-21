from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.trip import Trip
from app.models.trip_stop import TripStop
from app.models.user import User
from app.core.config import settings
from app.services.fuel_service import estimate_fuel_and_suggest_price


def prepare_trip_stops(
    distance_km: float,
    user_stops: Optional[List[Dict[str, Any]]] = None,
    origin_city: str = "",
    destination_city: str = "",
) -> List[Dict[str, Any]]:
    """
    Handles trip stops and enforces the mandatory 15-minute rest stop for distance > 300 km.
    At distance <= 300 km, mandatory rest is NOT required.
    """
    stops = [s.copy() if isinstance(s, dict) else s for s in (user_stops or [])]
    is_over_300km = float(distance_km) > settings.REST_STOP_THRESHOLD_KM

    if is_over_300km:
        # Check if mandatory stop is already in the list
        has_mandatory = any(s.get("is_mandatory_rest", False) for s in stops)
        if not has_mandatory:
            midpoint_stop = {
                "stop_order": max(1, len(stops) // 2 + 1),
                "location_name": f"Aire de repos mi-parcours ({origin_city} ➔ {destination_city})",
                "city": f"Mi-parcours (~{round(distance_km / 2)} km)",
                "wilaya_name": "Halte Sécurité",
                "is_mandatory_rest": True,
                "duration_minutes": settings.MANDATORY_REST_DURATION_MINUTES,
                "notes": "Pause sécurité obligatoire (trajet > 300 km)",
            }
            # Insert at appropriate position
            stops.insert(midpoint_stop["stop_order"] - 1, midpoint_stop)
        else:
            # Enforce that mandatory stop cannot have duration < 15 minutes
            for s in stops:
                if s.get("is_mandatory_rest", False):
                    if s.get("duration_minutes", 0) < settings.MANDATORY_REST_DURATION_MINUTES:
                        s["duration_minutes"] = settings.MANDATORY_REST_DURATION_MINUTES

    # Re-index stop_order sequentially 1, 2, ...
    for idx, stop in enumerate(stops, start=1):
        stop["stop_order"] = idx

    return stops


def create_trip(db: Session, driver: User, trip_in_data: Dict[str, Any]) -> Trip:
    """Creates a new trip with business rules enforcement."""
    distance = float(trip_in_data.get("distance_km", 0))
    total_seats = int(trip_in_data.get("total_seats", 3))
    origin_wilaya_code = trip_in_data.get("origin_wilaya_code")

    # Fuel estimate
    fuel_info = estimate_fuel_and_suggest_price(
        distance_km=distance,
        total_seats=total_seats,
        wilaya_code=origin_wilaya_code,
        fuel_type=trip_in_data.get("fuel_type", "essence"),
    )

    is_over_300km = distance > settings.REST_STOP_THRESHOLD_KM

    trip = Trip(
        driver_id=driver.id,
        vehicle_id=trip_in_data.get("vehicle_id"),
        origin_wilaya_code=trip_in_data["origin_wilaya_code"],
        origin_wilaya_name=trip_in_data["origin_wilaya_name"],
        origin_city=trip_in_data["origin_city"],
        origin_address=trip_in_data["origin_address"],
        origin_lat=trip_in_data.get("origin_lat"),
        origin_lng=trip_in_data.get("origin_lng"),
        destination_wilaya_code=trip_in_data["destination_wilaya_code"],
        destination_wilaya_name=trip_in_data["destination_wilaya_name"],
        destination_city=trip_in_data["destination_city"],
        destination_address=trip_in_data["destination_address"],
        destination_lat=trip_in_data.get("destination_lat"),
        destination_lng=trip_in_data.get("destination_lng"),
        departure_datetime=trip_in_data["departure_datetime"],
        estimated_duration_minutes=trip_in_data["estimated_duration_minutes"],
        distance_km=distance,
        total_seats=total_seats,
        available_seats=total_seats,
        base_seat_price=trip_in_data["base_seat_price"],
        comfort_enabled=trip_in_data.get("comfort_enabled", False),
        has_mandatory_rest=is_over_300km,
        fuel_estimate_cost=fuel_info["total_fuel_cost_dzd"],
        suggested_seat_price=fuel_info["suggested_seat_price_dzd"],
        status="active",
    )

    db.add(trip)
    db.flush()

    # Process and add stops
    raw_stops = trip_in_data.get("stops", [])
    processed_stops = prepare_trip_stops(
        distance_km=distance,
        user_stops=raw_stops,
        origin_city=trip.origin_city,
        destination_city=trip.destination_city,
    )

    for s in processed_stops:
        stop_obj = TripStop(
            trip_id=trip.id,
            stop_order=s["stop_order"],
            location_name=s["location_name"],
            city=s.get("city", trip.destination_city),
            wilaya_name=s.get("wilaya_name"),
            is_mandatory_rest=s.get("is_mandatory_rest", False),
            duration_minutes=s.get("duration_minutes", 15),
            notes=s.get("notes"),
        )
        db.add(stop_obj)

    db.commit()
    db.refresh(trip)
    return trip


def search_trips(
    db: Session,
    origin: Optional[str] = None,
    destination: Optional[str] = None,
    date_str: Optional[str] = None,
    min_seats: int = 1,
    max_price: Optional[float] = None,
    comfort_only: bool = False,
    page: int = 1,
    limit: int = 20,
) -> Dict[str, Any]:
    """Search and filter active trips."""
    query = db.query(Trip).filter(Trip.status == "active")

    if origin:
        query = query.filter(
            or_(
                Trip.origin_city.ilike(f"%{origin}%"),
                Trip.origin_wilaya_name.ilike(f"%{origin}%"),
            )
        )
    if destination:
        query = query.filter(
            or_(
                Trip.destination_city.ilike(f"%{destination}%"),
                Trip.destination_wilaya_name.ilike(f"%{destination}%"),
            )
        )
    if date_str:
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            start_dt = datetime.combine(target_date, datetime.min.time())
            end_dt = datetime.combine(target_date, datetime.max.time())
            query = query.filter(Trip.departure_datetime.between(start_dt, end_dt))
        except ValueError:
            pass

    if min_seats > 1:
        query = query.filter(Trip.available_seats >= min_seats)
    else:
        query = query.filter(Trip.available_seats > 0)

    if max_price is not None:
        # Base price filter
        query = query.filter(Trip.base_seat_price <= max_price)

    if comfort_only:
        query = query.filter(Trip.comfort_enabled == True)

    total_count = query.count()
    offset = (page - 1) * limit
    trips = query.order_by(Trip.departure_datetime.asc()).offset(offset).limit(limit).all()

    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "trips": trips,
    }
