import pytest
from decimal import Decimal
from app.services.pricing_service import calculate_pricing
from app.services.fuel_service import (
    estimate_fuel_and_suggest_price,
    load_fuel_prices_data,
)
from app.services.trip_service import prepare_trip_stops


# Test 1: Commission 15% calculation and financial rounding
def test_pricing_commission_15_percent():
    base_price = 1000.0  # 1000 DZD
    pricing = calculate_pricing(base_seat_price=base_price, seat_count=1, seat_type="standard")

    # Base price = 1000.00 DA
    assert pricing["base_seat_price"] == 1000.00
    # Commission = 15% of 1000 = 150.00 DA
    assert pricing["commission_per_seat"] == 150.00
    # Passenger price = 1000 + 150 = 1150.00 DA
    assert pricing["passenger_price_per_seat"] == 1150.00
    # Driver payout = 1000.00 DA
    assert pricing["driver_payout_per_seat"] == 1000.00

    # Multi-seat: 3 seats
    multi = calculate_pricing(base_seat_price=base_price, seat_count=3, seat_type="standard")
    assert multi["total_base_price"] == 3000.00
    assert multi["total_commission"] == 450.00
    assert multi["total_passenger_price"] == 3450.00
    assert multi["total_driver_payout"] == 3000.00


# Test 2: Trajet Confort 30% supplement without hidden compounding
def test_pricing_trajet_confort_30_percent():
    base_price = 1000.0
    pricing = calculate_pricing(base_seat_price=base_price, seat_count=1, seat_type="comfort")

    # Comfort supplement = 30% of base = 300.00 DA
    assert pricing["comfort_fee_per_seat"] == 300.00
    # Commission = 15% of base = 150.00 DA
    assert pricing["commission_per_seat"] == 150.00
    # Total passenger price = 1000 (base) + 150 (commission) + 300 (comfort) = 1450.00 DA
    assert pricing["passenger_price_per_seat"] == 1450.00
    # Driver payout = base + comfort supplement = 1300.00 DA
    assert pricing["driver_payout_per_seat"] == 1300.00


# Test 3: Rest stop threshold: > 300 km requires 15-min break; <= 300 km does not
def test_midpoint_break_over_300km_threshold():
    # Exactly 300 km: must NOT require mandatory rest
    stops_at_300 = prepare_trip_stops(distance_km=300.0, user_stops=[], origin_city="Alger", destination_city="Sétif")
    assert not any(s.get("is_mandatory_rest") for s in stops_at_300)

    # 299 km: must NOT require mandatory rest
    stops_under = prepare_trip_stops(distance_km=299.0, user_stops=[], origin_city="Alger", destination_city="Bordj")
    assert not any(s.get("is_mandatory_rest") for s in stops_under)

    # 301 km (> 300 km): MUST require mandatory 15-min rest
    stops_over = prepare_trip_stops(distance_km=301.0, user_stops=[], origin_city="Alger", destination_city="Batna")
    mandatory_stops = [s for s in stops_over if s.get("is_mandatory_rest")]
    assert len(mandatory_stops) == 1
    assert mandatory_stops[0]["duration_minutes"] >= 15

    # 415 km (Alger - Oran): MUST require mandatory rest
    stops_alger_oran = prepare_trip_stops(distance_km=415.0, user_stops=[], origin_city="Alger", destination_city="Oran")
    assert any(s.get("is_mandatory_rest") for s in stops_alger_oran)


# Test 4: Fuel estimation with 8L/100km & graceful fallback on missing data
def test_fuel_estimate_and_missing_data_resilience():
    # 100 km, 4 seats, Alger (wilaya 16), essence (45.62 DA/L)
    # Fuel quantity = 100 * 8 / 100 = 8.0 Liters
    # Total cost = 8.0 * 45.62 = 364.96 DA
    # Suggested seat price = 364.96 / 4 = 91.24 DA
    estimate = estimate_fuel_and_suggest_price(
        distance_km=100.0,
        total_seats=4,
        wilaya_code=16,
        fuel_type="essence",
    )
    assert estimate["fuel_liters_estimated"] == 8.0
    assert estimate["total_fuel_cost_dzd"] == 364.96
    assert estimate["suggested_seat_price_dzd"] == 91.24

    # Resilience test: Non-existent file path
    fallback_estimate = estimate_fuel_and_suggest_price(
        distance_km=100.0,
        total_seats=4,
        wilaya_code=999,  # Unknown wilaya
        fuel_type="unknown_type",
        file_path="/tmp/non_existent_prix_carburants.json",
    )
    assert fallback_estimate["is_fallback"] is True
    assert fallback_estimate["fuel_liters_estimated"] == 8.0
    assert fallback_estimate["total_fuel_cost_dzd"] > 0
    assert fallback_estimate["suggested_seat_price_dzd"] > 0


# Test 5: Negative price and seat count validation error handling
def test_pricing_validation_errors():
    with pytest.raises(ValueError):
        calculate_pricing(base_seat_price=-50.0, seat_count=1)

    with pytest.raises(ValueError):
        calculate_pricing(base_seat_price=500.0, seat_count=0)
