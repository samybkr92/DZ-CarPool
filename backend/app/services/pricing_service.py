from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Any


def round_da(amount: Decimal) -> Decimal:
    """Rounds amount to 2 decimal places (centimes) using standard financial rounding."""
    return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_pricing(
    base_seat_price: float | Decimal,
    seat_count: int = 1,
    seat_type: str = "standard",
    commission_rate: float | Decimal = Decimal("0.15"),
    comfort_rate: float | Decimal = Decimal("0.30"),
) -> Dict[str, Any]:
    """
    Calculates transparent pricing for DZ-CarPool trips.

    Rules:
    - Base seat price is entered by the driver.
    - Commission (15%) is applied on base price: base * 0.15.
    - Comfort supplement (30%) is applied on base price: base * 0.30 (guarantees front seat).
    - Standard passenger price per seat = base + commission = base * 1.15.
    - Comfort passenger price per seat = base + commission + comfort = base * 1.45.
    - Driver receives:
        * Standard: base_seat_price * seat_count
        * Comfort: (base_seat_price + comfort_fee) * seat_count = base * 1.30 * seat_count
    """
    base = Decimal(str(base_seat_price))
    comm_rate = Decimal(str(commission_rate))
    comf_rate = Decimal(str(comfort_rate))
    count = Decimal(str(seat_count))

    if base < Decimal("0"):
        raise ValueError("Le prix de base ne peut pas être négatif.")
    if count < Decimal("1"):
        raise ValueError("Le nombre de sièges doit être au moins 1.")

    base_per_seat = round_da(base)
    commission_per_seat = round_da(base_per_seat * comm_rate)

    is_comfort = seat_type.lower() == "comfort"
    comfort_fee_per_seat = round_da(base_per_seat * comf_rate) if is_comfort else Decimal("0.00")

    total_per_seat = base_per_seat + commission_per_seat + comfort_fee_per_seat
    driver_payout_per_seat = base_per_seat + comfort_fee_per_seat

    total_base = round_da(base_per_seat * count)
    total_commission = round_da(commission_per_seat * count)
    total_comfort_fee = round_da(comfort_fee_per_seat * count)
    total_passenger_price = round_da(total_per_seat * count)
    total_driver_payout = round_da(driver_payout_per_seat * count)

    return {
        "seat_count": int(count),
        "seat_type": "comfort" if is_comfort else "standard",
        "base_seat_price": float(base_per_seat),
        "commission_rate": float(comm_rate),
        "comfort_rate": float(comf_rate),
        "commission_per_seat": float(commission_per_seat),
        "comfort_fee_per_seat": float(comfort_fee_per_seat),
        "passenger_price_per_seat": float(total_per_seat),
        "driver_payout_per_seat": float(driver_payout_per_seat),
        "total_base_price": float(total_base),
        "total_commission": float(total_commission),
        "total_comfort_fee": float(total_comfort_fee),
        "total_passenger_price": float(total_passenger_price),
        "total_driver_payout": float(total_driver_payout),
    }
