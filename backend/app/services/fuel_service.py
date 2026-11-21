import json
import os
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Any, Optional
from app.core.config import settings


# Default fallback rates (Algerian National Fuel standard rates in DZD/L)
FALLBACK_FUEL_RATES = {
    "essence": 45.62,
    "diesel": 29.01,
    "gpl": 9.00,
}


def load_fuel_prices_data(file_path: Optional[str] = None) -> Dict[str, Any]:
    """
    Safely loads fuel prices JSON file.
    Returns parsed dictionary or a structured fallback if missing or corrupted.
    """
    path = file_path or settings.FUEL_PRICES_FILE_PATH

    if not os.path.exists(path):
        return {
            "_meta": {
                "source": "Fallback interne (fichier externe absent)",
                "is_fallback": True,
                "default_national_rate": FALLBACK_FUEL_RATES,
            },
            "wilayas": {},
        }

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data
    except (json.JSONDecodeError, OSError):
        return {
            "_meta": {
                "source": "Fallback interne (fichier corrompu ou illisible)",
                "is_fallback": True,
                "default_national_rate": FALLBACK_FUEL_RATES,
            },
            "wilayas": {},
        }


def get_fuel_price_per_liter(
    wilaya_code: Optional[int] = None,
    fuel_type: str = "essence",
    data: Optional[Dict[str, Any]] = None,
) -> float:
    """Gets fuel price per liter for the given wilaya and fuel type."""
    data = data or load_fuel_prices_data()
    clean_fuel_type = fuel_type.lower()
    if clean_fuel_type not in ("essence", "diesel", "gpl"):
        clean_fuel_type = "essence"

    # Try wilaya-specific rate
    if wilaya_code is not None:
        wilayas = data.get("wilayas", {})
        wilaya_info = wilayas.get(str(wilaya_code)) or wilayas.get(int(wilaya_code))
        if isinstance(wilaya_info, dict) and clean_fuel_type in wilaya_info:
            return float(wilaya_info[clean_fuel_type])

    # Try default national rate from json
    meta_rates = data.get("_meta", {}).get("default_national_rate", {})
    if clean_fuel_type in meta_rates:
        return float(meta_rates[clean_fuel_type])

    # Fallback constant
    return FALLBACK_FUEL_RATES.get(clean_fuel_type, 45.62)


def estimate_fuel_and_suggest_price(
    distance_km: float,
    total_seats: int,
    wilaya_code: Optional[int] = None,
    fuel_type: str = "essence",
    file_path: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Estimates fuel cost based on 8 L/100 km rule:
    fuel_quantity = distance_km * 8 / 100
    total_fuel_cost = fuel_quantity * price_per_liter
    suggested_seat_price = total_fuel_cost / total_seats
    """
    if distance_km < 0:
        distance_km = 0.0

    raw_data = load_fuel_prices_data(file_path)
    is_fallback = raw_data.get("_meta", {}).get("is_fallback", False)

    price_per_liter = get_fuel_price_per_liter(wilaya_code, fuel_type, raw_data)

    # Calculation
    consumption_rate = settings.AVG_FUEL_CONSUMPTION_L_PER_100KM / 100.0  # 8L / 100km = 0.08
    fuel_liters = round(distance_km * consumption_rate, 2)
    total_cost_dec = (Decimal(str(fuel_liters)) * Decimal(str(price_per_liter))).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )
    total_cost = float(total_cost_dec)

    seats = max(1, total_seats)
    suggested_price_dec = (total_cost_dec / Decimal(str(seats))).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )
    suggested_price = float(suggested_price_dec)

    return {
        "distance_km": float(distance_km),
        "fuel_type": fuel_type,
        "fuel_consumption_rate_l_100km": settings.AVG_FUEL_CONSUMPTION_L_PER_100KM,
        "fuel_liters_estimated": fuel_liters,
        "price_per_liter_dzd": price_per_liter,
        "total_fuel_cost_dzd": total_cost,
        "total_seats": seats,
        "suggested_seat_price_dzd": suggested_price,
        "is_fallback": is_fallback,
        "advisory_note": (
            "Suggestion indicative basée sur 8L/100km. "
            "Le conducteur reste maître de son prix de base final."
        ),
    }
