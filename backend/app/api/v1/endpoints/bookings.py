from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.booking import Booking
from app.models.trip import Trip
from app.schemas.booking import BookingCreate, BookingAction, BookingOut
from app.services.booking_service import (
    create_booking_request,
    approve_booking as approve_booking_service,
    reject_booking as reject_booking_service,
    cancel_booking as cancel_booking_service,
)

router = APIRouter(tags=["Réservations"])


def format_booking_out(booking: Booking) -> BookingOut:
    return BookingOut(
        id=booking.id,
        trip_id=booking.trip_id,
        passenger_id=booking.passenger_id,
        seat_count=booking.seat_count,
        seat_type=booking.seat_type,
        status=booking.status,
        quoted_base_price=float(booking.quoted_base_price),
        quoted_commission=float(booking.quoted_commission),
        quoted_comfort_fee=float(booking.quoted_comfort_fee),
        quoted_total_price=float(booking.quoted_total_price),
        driver_payout=float(booking.driver_payout),
        rejection_or_cancellation_reason=booking.rejection_or_cancellation_reason,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
        passenger=booking.passenger,
        trip={
            "id": booking.trip.id,
            "origin_city": booking.trip.origin_city,
            "origin_wilaya_name": booking.trip.origin_wilaya_name,
            "destination_city": booking.trip.destination_city,
            "destination_wilaya_name": booking.trip.destination_wilaya_name,
            "departure_datetime": booking.trip.departure_datetime,
            "driver_name": booking.trip.driver.full_name if booking.trip.driver else "",
            "driver_phone": booking.trip.driver.phone_number if booking.trip.driver else "",
            "status": booking.trip.status,
        } if booking.trip else None,
    )


@router.post("/trips/{trip_id}/bookings", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def request_booking(
    trip_id: int,
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Passenger creates a new booking request."""
    booking = create_booking_request(
        db=db,
        trip_id=trip_id,
        passenger=current_user,
        seat_count=booking_in.seat_count,
        seat_type=booking_in.seat_type,
    )
    return format_booking_out(booking)


@router.get("/trips/{trip_id}/bookings", response_model=List[BookingOut])
def get_trip_bookings(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Driver views bookings for their trip."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trajet introuvable.")
    if trip.driver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès réservé au conducteur de ce trajet.")

    bookings = db.query(Booking).filter(Booking.trip_id == trip_id).order_by(Booking.created_at.desc()).all()
    return [format_booking_out(b) for b in bookings]


@router.get("/bookings/my", response_model=List[BookingOut])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Passenger views all their booking requests and confirmed tickets."""
    bookings = (
        db.query(Booking)
        .filter(Booking.passenger_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [format_booking_out(b) for b in bookings]


@router.post("/bookings/{id}/approve", response_model=BookingOut)
def approve_booking_endpoint(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Driver explicitly approves a pending booking."""
    booking = approve_booking_service(db, id, current_user)
    return format_booking_out(booking)


@router.post("/bookings/{id}/reject", response_model=BookingOut)
def reject_booking_endpoint(
    id: int,
    action: Optional[BookingAction] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Driver rejects a booking request."""
    reason = action.reason if action else None
    booking = reject_booking_service(db, id, current_user, reason)
    return format_booking_out(booking)


@router.post("/bookings/{id}/cancel", response_model=BookingOut)
def cancel_booking_endpoint(
    id: int,
    action: Optional[BookingAction] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Passenger or driver cancels a booking."""
    reason = action.reason if action else None
    booking = cancel_booking_service(db, id, current_user, reason)
    return format_booking_out(booking)
