from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.trip import Trip
from app.models.booking import Booking
from app.models.message import TripMessage
from app.schemas.message import MessageCreate, MessageOut

router = APIRouter(prefix="/trips/{trip_id}/messages", tags=["Messagerie"])


def verify_trip_chat_access(db: Session, trip_id: int, user: User) -> Trip:
    """Verifies that the user is either the trip driver or a booked/pending passenger."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trajet introuvable.")

    is_driver = trip.driver_id == user.id
    is_passenger = (
        db.query(Booking)
        .filter(
            Booking.trip_id == trip_id,
            Booking.passenger_id == user.id,
            Booking.status.in_(["pending", "confirmed"]),
        )
        .first()
        is not None
    )

    if not (is_driver or is_passenger):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès interdit. La messagerie de trajet est strictement réservée au conducteur et à ses passagers.",
        )

    return trip


@router.get("", response_model=List[MessageOut])
def get_trip_messages(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves chronological messages for an authorized trip."""
    verify_trip_chat_access(db, trip_id, current_user)
    messages = (
        db.query(TripMessage)
        .filter(TripMessage.trip_id == trip_id)
        .order_by(TripMessage.created_at.asc())
        .all()
    )
    return messages


@router.post("", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def send_trip_message(
    trip_id: int,
    msg_in: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Sends a text message to the trip conversation."""
    verify_trip_chat_access(db, trip_id, current_user)
    msg = TripMessage(
        trip_id=trip_id,
        sender_id=current_user.id,
        content=msg_in.content.strip(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    msg.sender = current_user
    return msg
