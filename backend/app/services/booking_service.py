from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.booking import Booking
from app.models.trip import Trip
from app.models.user import User
from app.services.pricing_service import calculate_pricing


def create_booking_request(
    db: Session,
    trip_id: int,
    passenger: User,
    seat_count: int = 1,
    seat_type: str = "standard",
) -> Booking:
    """
    Submits a booking request from passenger.
    Validates:
    - Passenger is not the driver
    - Trip is active and has enough available seats
    - Passenger does not already have an active/pending booking on this trip
    - Trajet Confort availability
    """
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Le trajet demandé n'existe pas.",
        )

    if trip.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Impossible de réserver sur un trajet non actif ou annulé.",
        )

    if trip.driver_id == passenger.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un conducteur ne peut pas réserver son propre trajet.",
        )

    if seat_count > trip.available_seats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Nombre de places insuffisant (demandé: {seat_count}, disponible: {trip.available_seats}).",
        )

    if seat_type == "comfort" and not trip.comfort_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'option Trajet Confort n'est pas activée sur ce trajet.",
        )

    # Check for existing active/pending request
    existing = (
        db.query(Booking)
        .filter(
            Booking.trip_id == trip_id,
            Booking.passenger_id == passenger.id,
            Booking.status.in_(["pending", "confirmed"]),
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous avez déjà une demande de réservation active pour ce trajet.",
        )

    # Calculate pricing snapshot
    pricing = calculate_pricing(
        base_seat_price=trip.base_seat_price,
        seat_count=seat_count,
        seat_type=seat_type,
    )

    booking = Booking(
        trip_id=trip.id,
        passenger_id=passenger.id,
        seat_count=seat_count,
        seat_type=seat_type,
        status="pending",
        quoted_base_price=pricing["total_base_price"],
        quoted_commission=pricing["total_commission"],
        quoted_comfort_fee=pricing["total_comfort_fee"],
        quoted_total_price=pricing["total_passenger_price"],
        driver_payout=pricing["total_driver_payout"],
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def approve_booking(db: Session, booking_id: int, current_user: User) -> Booking:
    """
    Driver approves a pending booking.
    Atomically checks and decrements available seats inside a transaction.
    """
    # Query with row locking if supported (SQLite handles this via transaction isolation)
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Réservation introuvable.",
        )

    trip_query = db.query(Trip).filter(Trip.id == booking.trip_id)
    # Use with_for_update if not sqlite
    bind = db.get_bind()
    if bind and not bind.dialect.name.startswith("sqlite"):
        trip_query = trip_query.with_for_update()

    trip = trip_query.first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trajet associé introuvable.",
        )

    if trip.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seul le conducteur de ce trajet peut approuver cette réservation.",
        )

    if booking.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"La réservation ne peut pas être approuvée depuis le statut '{booking.status}'.",
        )

    if trip.available_seats < booking.seat_count:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Conflit de capacité : il n'y a plus assez de places disponibles.",
        )

    # Atomic capacity decrement
    trip.available_seats -= booking.seat_count
    booking.status = "confirmed"

    db.commit()
    db.refresh(booking)
    return booking


def reject_booking(
    db: Session,
    booking_id: int,
    current_user: User,
    reason: Optional[str] = None,
) -> Booking:
    """Driver rejects a booking request."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Réservation introuvable.")

    trip = db.query(Trip).filter(Trip.id == booking.trip_id).first()
    if not trip or trip.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seul le conducteur peut rejeter cette réservation.",
        )

    if booking.status not in ["pending", "confirmed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Impossible de rejeter une réservation au statut '{booking.status}'.",
        )

    # If it was confirmed previously, release seats
    if booking.status == "confirmed":
        trip.available_seats = min(trip.total_seats, trip.available_seats + booking.seat_count)

    booking.status = "rejected"
    if reason:
        booking.rejection_or_cancellation_reason = reason

    db.commit()
    db.refresh(booking)
    return booking


def cancel_booking(
    db: Session,
    booking_id: int,
    current_user: User,
    reason: Optional[str] = None,
) -> Booking:
    """Passenger or Driver cancels a booking."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Réservation introuvable.")

    trip = db.query(Trip).filter(Trip.id == booking.trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trajet introuvable.")

    is_passenger = booking.passenger_id == current_user.id
    is_driver = trip.driver_id == current_user.id

    if not (is_passenger or is_driver):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Non autorisé à annuler cette réservation.",
        )

    if booking.status in ["cancelled", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette réservation est déjà annulée ou rejetée.",
        )

    # Release seats if was confirmed
    if booking.status == "confirmed":
        trip.available_seats = min(trip.total_seats, trip.available_seats + booking.seat_count)

    booking.status = "cancelled"
    booking.rejection_or_cancellation_reason = (
        reason or f"Annulé par {'le passager' if is_passenger else 'le conducteur'}"
    )

    db.commit()
    db.refresh(booking)
    return booking
