import sys
from datetime import datetime, timezone, timedelta
from decimal import Decimal
from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.models.trip_stop import TripStop
from app.models.booking import Booking

def seed_database():
    db = SessionLocal()
    try:
        print("Ensuring tables are created...")
        Base.metadata.create_all(bind=engine)

        # Check existing
        existing_count = db.query(User).count()
        print(f"Current users in database: {existing_count}")

        # 1. Seed Users
        users_data = [
            {
                "email": "amine.benali@dz-carpool.dz",
                "full_name": "Amine Benali",
                "phone_number": "0550123456",
                "role": "both",
                "bio": "Ingénieur en télécoms, navetteur régulier Alger-Oran tous les dimanches et jeudis. Conduite posée, véhicule récent et climatisé.",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                "wilaya_code": 16,
                "wilaya_name": "Alger",
                "rating_avg": Decimal("4.92"),
                "rating_count": 28,
                "trips_completed_count": 42,
            },
            {
                "email": "amina.mansouri@dz-carpool.dz",
                "full_name": "Amina Mansouri",
                "phone_number": "0661234567",
                "role": "both",
                "bio": "Architecte d'intérieur basée à Alger, déplacements professionnels réguliers vers Oran et Constantine. Ponctuelle et discrète.",
                "avatar_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
                "wilaya_code": 16,
                "wilaya_name": "Alger",
                "rating_avg": Decimal("4.98"),
                "rating_count": 14,
                "trips_completed_count": 19,
            },
            {
                "email": "karim.ferhani@dz-carpool.dz",
                "full_name": "Karim Ferhani",
                "phone_number": "0770987654",
                "role": "driver",
                "bio": "Médecin spécialiste au CHU de Constantine. Trajets A1 réguliers. Ponctuel et respectueux des horaires.",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                "wilaya_code": 25,
                "wilaya_name": "Constantine",
                "rating_avg": Decimal("4.85"),
                "rating_count": 19,
                "trips_completed_count": 31,
            },
            {
                "email": "youcef.benmansour@dz-carpool.dz",
                "full_name": "Youcef Benmansour",
                "phone_number": "0555332211",
                "role": "driver",
                "bio": "Commerçant itinérant entre Sétif, Bordj et Alger. Conduite souple, bonne ambiance et respect du repos.",
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                "wilaya_code": 19,
                "wilaya_name": "Sétif",
                "rating_avg": Decimal("4.78"),
                "rating_count": 12,
                "trips_completed_count": 15,
            },
            {
                "email": "bilal.boutaleb@dz-carpool.dz",
                "full_name": "Bilal Boutaleb",
                "phone_number": "0771239874",
                "role": "driver",
                "bio": "Guide touristique sur la côte ouest (Oran-Tlemcen-Mostaganem). Passionné de patrimoine et de belles routes.",
                "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
                "wilaya_code": 31,
                "wilaya_name": "Oran",
                "rating_avg": Decimal("4.95"),
                "rating_count": 22,
                "trips_completed_count": 36,
            },
        ]

        created_users = {}
        password_hashed = hash_password("password123")

        for udata in users_data:
            existing = db.query(User).filter(User.email == udata["email"]).first()
            if not existing:
                u = User(
                    email=udata["email"],
                    password_hash=password_hashed,
                    full_name=udata["full_name"],
                    phone_number=udata["phone_number"],
                    role=udata["role"],
                    bio=udata["bio"],
                    avatar_url=udata["avatar_url"],
                    wilaya_code=udata["wilaya_code"],
                    wilaya_name=udata["wilaya_name"],
                    rating_avg=udata["rating_avg"],
                    rating_count=udata["rating_count"],
                    trips_completed_count=udata["trips_completed_count"],
                    is_active=True,
                )
                db.add(u)
                db.flush()
                created_users[udata["email"]] = u
                print(f"Created user: {u.full_name} ({u.email}) ID={u.id}")
            else:
                existing.password_hash = password_hashed
                created_users[udata["email"]] = existing
                print(f"User exists, updated password: {existing.email} ID={existing.id}")

        # 2. Seed Vehicles
        amine = created_users["amine.benali@dz-carpool.dz"]
        karim = created_users["karim.ferhani@dz-carpool.dz"]
        youcef = created_users["youcef.benmansour@dz-carpool.dz"]
        bilal = created_users["bilal.boutaleb@dz-carpool.dz"]

        v_amine = db.query(Vehicle).filter(Vehicle.user_id == amine.id).first()
        if not v_amine:
            v_amine = Vehicle(
                user_id=amine.id,
                make="Volkswagen",
                model="Golf 8",
                year=2023,
                color="Gris Tungstène",
                license_plate="01245-123-16",
                comfort_tier="comfort",
                air_conditioning=True,
            )
            db.add(v_amine)

        v_karim = db.query(Vehicle).filter(Vehicle.user_id == karim.id).first()
        if not v_karim:
            v_karim = Vehicle(
                user_id=karim.id,
                make="Peugeot",
                model="3008 GT",
                year=2022,
                color="Bleu Célèbes",
                license_plate="04567-122-25",
                comfort_tier="comfort",
                air_conditioning=True,
            )
            db.add(v_karim)

        v_youcef = db.query(Vehicle).filter(Vehicle.user_id == youcef.id).first()
        if not v_youcef:
            v_youcef = Vehicle(
                user_id=youcef.id,
                make="Renault",
                model="Clio 5",
                year=2021,
                color="Blanc Glacier",
                license_plate="08912-121-19",
                comfort_tier="standard",
                air_conditioning=True,
            )
            db.add(v_youcef)

        v_bilal = db.query(Vehicle).filter(Vehicle.user_id == bilal.id).first()
        if not v_bilal:
            v_bilal = Vehicle(
                user_id=bilal.id,
                make="Hyundai",
                model="Tucson",
                year=2022,
                color="Noir Ébène",
                license_plate="03411-122-31",
                comfort_tier="comfort",
                air_conditioning=True,
            )
            db.add(v_bilal)

        db.flush()

        # 3. Seed Trips
        existing_trips = db.query(Trip).count()
        print(f"Current trips in database: {existing_trips}")

        now = datetime.now(timezone.utc)

        trips_specs = [
            {
                "driver": amine,
                "vehicle": v_amine,
                "origin_wilaya_code": 16,
                "origin_wilaya_name": "Alger",
                "origin_city": "Alger (Place du 1er Mai)",
                "origin_address": "Gare Routière Agha, Alger Centre",
                "destination_wilaya_code": 31,
                "destination_wilaya_name": "Oran",
                "destination_city": "Oran (Place d'Armes)",
                "destination_address": "Rond-point El Morchid, Oran",
                "departure_datetime": now + timedelta(days=1, hours=2),
                "estimated_duration_minutes": 270,
                "distance_km": Decimal("415.00"),
                "total_seats": 3,
                "available_seats": 2,
                "base_seat_price": Decimal("1600.00"),
                "comfort_enabled": True,
                "has_mandatory_rest": True,
                "fuel_estimate_cost": Decimal("1128.80"),
                "suggested_seat_price": Decimal("376.27"),
                "status": "active",
            },
            {
                "driver": amine,
                "vehicle": v_amine,
                "origin_wilaya_code": 16,
                "origin_wilaya_name": "Alger",
                "origin_city": "Alger (Bab Ezzouar)",
                "origin_address": "Centre Commercial Bab Ezzouar",
                "destination_wilaya_code": 25,
                "destination_wilaya_name": "Constantine",
                "destination_city": "Constantine (Sidi Mabrouk)",
                "destination_address": "Station Nouvelle Ville Ali Mendjeli",
                "departure_datetime": now + timedelta(days=2, hours=3),
                "estimated_duration_minutes": 260,
                "distance_km": Decimal("390.00"),
                "total_seats": 3,
                "available_seats": 3,
                "base_seat_price": Decimal("1500.00"),
                "comfort_enabled": True,
                "has_mandatory_rest": True,
                "fuel_estimate_cost": Decimal("1060.80"),
                "suggested_seat_price": Decimal("353.60"),
                "status": "active",
            },
            {
                "driver": karim,
                "vehicle": v_karim,
                "origin_wilaya_code": 25,
                "origin_wilaya_name": "Constantine",
                "origin_city": "Constantine (Ali Mendjeli)",
                "origin_address": "Université Salah Boubnider",
                "destination_wilaya_code": 16,
                "destination_wilaya_name": "Alger",
                "destination_city": "Alger (Kouba)",
                "destination_address": "Station Métro Kouba",
                "departure_datetime": now + timedelta(days=1, hours=5),
                "estimated_duration_minutes": 260,
                "distance_km": Decimal("390.00"),
                "total_seats": 3,
                "available_seats": 1,
                "base_seat_price": Decimal("1500.00"),
                "comfort_enabled": True,
                "has_mandatory_rest": True,
                "fuel_estimate_cost": Decimal("1060.80"),
                "suggested_seat_price": Decimal("353.60"),
                "status": "active",
            },
            {
                "driver": youcef,
                "vehicle": v_youcef,
                "origin_wilaya_code": 19,
                "origin_wilaya_name": "Sétif",
                "origin_city": "Sétif (Aïn El Fouara)",
                "origin_address": "Boulevard du 8 Mai 1945",
                "destination_wilaya_code": 16,
                "destination_wilaya_name": "Alger",
                "destination_city": "Alger (Ruisseau)",
                "destination_address": "Pôle d'échange Métro/Tram Ruisseau",
                "departure_datetime": now + timedelta(days=3, hours=1),
                "estimated_duration_minutes": 170,
                "distance_km": Decimal("260.00"),
                "total_seats": 4,
                "available_seats": 4,
                "base_seat_price": Decimal("1000.00"),
                "comfort_enabled": False,
                "has_mandatory_rest": False,  # <= 300km
                "fuel_estimate_cost": Decimal("707.20"),
                "suggested_seat_price": Decimal("176.80"),
                "status": "active",
            },
            {
                "driver": bilal,
                "vehicle": v_bilal,
                "origin_wilaya_code": 31,
                "origin_wilaya_name": "Oran",
                "origin_city": "Oran (Akid Lotfi)",
                "origin_address": "Boulevard Front de Mer",
                "destination_wilaya_code": 13,
                "destination_wilaya_name": "Tlemcen",
                "destination_city": "Tlemcen (Centre-Ville)",
                "destination_address": "Gare ferroviaire de Tlemcen",
                "departure_datetime": now + timedelta(days=2, hours=4),
                "estimated_duration_minutes": 110,
                "distance_km": Decimal("140.00"),
                "total_seats": 3,
                "available_seats": 2,
                "base_seat_price": Decimal("700.00"),
                "comfort_enabled": True,
                "has_mandatory_rest": False,  # <= 300km
                "fuel_estimate_cost": Decimal("380.80"),
                "suggested_seat_price": Decimal("126.93"),
                "status": "active",
            },
        ]

        created_trips = []
        for tspec in trips_specs:
            trip = Trip(
                driver_id=tspec["driver"].id,
                vehicle_id=tspec["vehicle"].id,
                origin_wilaya_code=tspec["origin_wilaya_code"],
                origin_wilaya_name=tspec["origin_wilaya_name"],
                origin_city=tspec["origin_city"],
                origin_address=tspec["origin_address"],
                destination_wilaya_code=tspec["destination_wilaya_code"],
                destination_wilaya_name=tspec["destination_wilaya_name"],
                destination_city=tspec["destination_city"],
                destination_address=tspec["destination_address"],
                departure_datetime=tspec["departure_datetime"],
                estimated_duration_minutes=tspec["estimated_duration_minutes"],
                distance_km=tspec["distance_km"],
                total_seats=tspec["total_seats"],
                available_seats=tspec["available_seats"],
                base_seat_price=tspec["base_seat_price"],
                comfort_enabled=tspec["comfort_enabled"],
                has_mandatory_rest=tspec["has_mandatory_rest"],
                fuel_estimate_cost=tspec["fuel_estimate_cost"],
                suggested_seat_price=tspec["suggested_seat_price"],
                status=tspec["status"],
            )
            db.add(trip)
            db.flush()
            created_trips.append(trip)

            # Add mandatory rest stop if > 300 km
            if trip.distance_km > 300:
                stop = TripStop(
                    trip_id=trip.id,
                    stop_order=1,
                    location_name="Aire de Repos Naftal (Mi-parcours)",
                    city="Chlef",
                    wilaya_name="Chlef",
                    is_mandatory_rest=True,
                    duration_minutes=15,
                    notes="Pause sécurité obligatoire de 15 minutes conformément aux règles DZ-CarPool",
                )
                db.add(stop)

        # 4. Seed a Booking for Amine's first trip from Amina
        amina = created_users["amina.mansouri@dz-carpool.dz"]
        first_trip = created_trips[0]

        booking = Booking(
            trip_id=first_trip.id,
            passenger_id=amina.id,
            seat_count=1,
            seat_type="comfort",
            status="pending",
            quoted_base_price=Decimal("1600.00"),
            quoted_commission=Decimal("240.00"),
            quoted_comfort_fee=Decimal("480.00"),
            quoted_total_price=Decimal("2320.00"),
            driver_payout=Decimal("1600.00"),
        )
        db.add(booking)

        db.commit()
        print("Successfully seeded Neon PostgreSQL with users, vehicles, trips, and bookings!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
