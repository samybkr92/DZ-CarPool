import pytest
from datetime import datetime, timedelta, timezone


def test_auth_and_trip_creation_flow(client):
    """Test full cycle: register driver -> login -> publish trip -> search trip."""
    # 1. Register Driver
    driver_reg = client.post(
        "/api/v1/auth/register",
        json={
            "email": "driver.test@dz-carpool.dz",
            "password": "securepassword123",
            "full_name": "Karim Boubekeur",
            "phone_number": "0550998877",
            "role": "driver",
            "wilaya_code": 16,
            "wilaya_name": "Alger",
        },
    )
    assert driver_reg.status_code == 201
    token = driver_reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Check /me
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "driver.test@dz-carpool.dz"

    # 3. Create Trip (Alger -> Oran, 415 km > 300 km -> triggers mandatory rest stop!)
    dep_time = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
    trip_payload = {
        "origin_wilaya_code": 16,
        "origin_wilaya_name": "Alger",
        "origin_city": "Alger",
        "origin_address": "Place du 1er Mai",
        "destination_wilaya_code": 31,
        "destination_wilaya_name": "Oran",
        "destination_city": "Oran",
        "destination_address": "Place d'Armes",
        "departure_datetime": dep_time,
        "estimated_duration_minutes": 270,
        "distance_km": 415.0,
        "total_seats": 4,
        "base_seat_price": 1500.0,
        "comfort_enabled": True,
        "fuel_type": "essence",
        "stops": [],
    }
    create_res = client.post("/api/v1/trips", json=trip_payload, headers=headers)
    assert create_res.status_code == 201
    trip_data = create_res.json()
    assert trip_data["has_mandatory_rest"] is True
    assert trip_data["available_seats"] == 4
    # Passenger price = 1500 * 1.15 = 1725.0
    assert trip_data["passenger_standard_price"] == 1725.0
    # Comfort price = 1500 * 1.45 = 2175.0
    assert trip_data["passenger_comfort_price"] == 2175.0
    # Mandatory rest stop automatically injected in stops
    assert any(s["is_mandatory_rest"] for s in trip_data["stops"])

    # 4. Search Trips
    search_res = client.get("/api/v1/trips?origin=Alger&destination=Oran")
    assert search_res.status_code == 200
    assert search_res.json()["total"] >= 1


def test_booking_approval_and_capacity_concurrency(client):
    """Test booking request, capacity decrement upon approval, and overbooking prevention."""
    # Register Driver
    d_res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "driver.capacity@dz-carpool.dz",
            "password": "password123",
            "full_name": "Driver Capacity",
            "role": "driver",
            "wilaya_code": 16,
            "wilaya_name": "Alger",
        },
    )
    d_token = d_res.json()["access_token"]
    d_headers = {"Authorization": f"Bearer {d_token}"}

    # Driver posts trip with ONLY 2 SEATS
    dep_time = (datetime.now(timezone.utc) + timedelta(days=3)).isoformat()
    t_res = client.post(
        "/api/v1/trips",
        json={
            "origin_wilaya_code": 16,
            "origin_wilaya_name": "Alger",
            "origin_city": "Alger",
            "origin_address": "Kouba",
            "destination_wilaya_code": 19,
            "destination_wilaya_name": "Sétif",
            "destination_city": "Sétif",
            "destination_address": "Ain El Fouara",
            "departure_datetime": dep_time,
            "estimated_duration_minutes": 180,
            "distance_km": 260.0,
            "total_seats": 2,
            "base_seat_price": 1000.0,
            "comfort_enabled": True,
        },
        headers=d_headers,
    )
    trip_id = t_res.json()["id"]

    # Register Passenger 1
    p1_res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "p1@dz-carpool.dz",
            "password": "password123",
            "full_name": "Passenger One",
            "role": "passenger",
        },
    )
    p1_headers = {"Authorization": f"Bearer {p1_res.json()['access_token']}"}

    # Register Passenger 2
    p2_res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "p2@dz-carpool.dz",
            "password": "password123",
            "full_name": "Passenger Two",
            "role": "passenger",
        },
    )
    p2_headers = {"Authorization": f"Bearer {p2_res.json()['access_token']}"}

    # Passenger 1 requests 2 seats (all available)
    b1_res = client.post(
        f"/api/v1/trips/{trip_id}/bookings",
        json={"seat_count": 2, "seat_type": "standard"},
        headers=p1_headers,
    )
    assert b1_res.status_code == 201
    b1_id = b1_res.json()["id"]
    assert b1_res.json()["status"] == "pending"

    # Passenger 2 also requests 2 seats
    b2_res = client.post(
        f"/api/v1/trips/{trip_id}/bookings",
        json={"seat_count": 2, "seat_type": "comfort"},
        headers=p2_headers,
    )
    assert b2_res.status_code == 201
    b2_id = b2_res.json()["id"]

    # Driver approves Passenger 1's booking -> seats decrement from 2 to 0
    appr1 = client.post(f"/api/v1/bookings/{b1_id}/approve", headers=d_headers)
    assert appr1.status_code == 200
    assert appr1.json()["status"] == "confirmed"

    # Check trip available seats is now 0
    trip_check = client.get(f"/api/v1/trips/{trip_id}")
    assert trip_check.json()["available_seats"] == 0

    # Driver now tries to approve Passenger 2's booking -> MUST fail with 409 Conflict (Overbooking prevented)
    appr2 = client.post(f"/api/v1/bookings/{b2_id}/approve", headers=d_headers)
    assert appr2.status_code == 409

    # Passenger 1 cancels booking -> capacity is restored back to 2!
    canc1 = client.post(f"/api/v1/bookings/{b1_id}/cancel", headers=p1_headers)
    assert canc1.status_code == 200
    assert canc1.json()["status"] == "cancelled"

    trip_check_after = client.get(f"/api/v1/trips/{trip_id}")
    assert trip_check_after.json()["available_seats"] == 2

    # Now Passenger 2's booking can be approved successfully!
    appr2_retry = client.post(f"/api/v1/bookings/{b2_id}/approve", headers=d_headers)
    assert appr2_retry.status_code == 200
    assert appr2_retry.json()["status"] == "confirmed"


def test_chat_authorization_security(client):
    """Test that only driver and passengers of a trip can access the trip chat."""
    # 1. Driver
    d_res = client.post(
        "/api/v1/auth/register",
        json={"email": "chat.driver@dz-carpool.dz", "password": "password123", "full_name": "Chat Driver"},
    )
    d_headers = {"Authorization": f"Bearer {d_res.json()['access_token']}"}

    dep_time = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    t_res = client.post(
        "/api/v1/trips",
        json={
            "origin_wilaya_code": 16,
            "origin_wilaya_name": "Alger",
            "origin_city": "Alger",
            "origin_address": "Centre",
            "destination_wilaya_code": 9,
            "destination_wilaya_name": "Blida",
            "destination_city": "Blida",
            "destination_address": "Centre",
            "departure_datetime": dep_time,
            "estimated_duration_minutes": 50,
            "distance_km": 50.0,
            "total_seats": 3,
            "base_seat_price": 300.0,
        },
        headers=d_headers,
    )
    trip_id = t_res.json()["id"]

    # 2. Unauthorized stranger
    stranger = client.post(
        "/api/v1/auth/register",
        json={"email": "stranger@dz-carpool.dz", "password": "password123", "full_name": "Stranger"},
    )
    stranger_headers = {"Authorization": f"Bearer {stranger.json()['access_token']}"}

    # Stranger tries to read chat -> 403 Forbidden
    read_res = client.get(f"/api/v1/trips/{trip_id}/messages", headers=stranger_headers)
    assert read_res.status_code == 403

    # Stranger tries to post message -> 403 Forbidden
    post_res = client.post(
        f"/api/v1/trips/{trip_id}/messages",
        json={"content": "Je pirate ce chat"},
        headers=stranger_headers,
    )
    assert post_res.status_code == 403

    # Driver posts message -> 201 Created
    driver_msg = client.post(
        f"/api/v1/trips/{trip_id}/messages",
        json={"content": "Bienvenue à bord !"},
        headers=d_headers,
    )
    assert driver_msg.status_code == 201
