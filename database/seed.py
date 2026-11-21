import os
import sys
from datetime import datetime, timedelta, timezone

# Add backend directory to path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
sys.path.insert(0, backend_dir)

from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.models.trip_stop import TripStop
from app.models.booking import Booking
from app.models.message import TripMessage
from app.models.review import Review
from app.services.trip_service import prepare_trip_stops
from app.services.fuel_service import estimate_fuel_and_suggest_price
from app.services.pricing_service import calculate_pricing

def seed_database():
    print("🌱 Initialisation et peuplement de la base de données DZ-CarPool...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clean existing data
    db.query(Review).delete()
    db.query(TripMessage).delete()
    db.query(Booking).delete()
    db.query(TripStop).delete()
    db.query(Trip).delete()
    db.query(Vehicle).delete()
    db.query(User).delete()
    db.commit()

    password_hashed = hash_password("password123")

    # 1. Seed 25 Realistic Algerian Users
    users_data = [
        ("Amine Benali", "amine.benali@dz-carpool.dz", "0550123456", "driver", 16, "Alger", "Conducteur quotidien Alger-Oran, conduite souple et ponctuelle."),
        ("Yacine Brahimi", "yacine.brahimi@dz-carpool.dz", "0661234567", "driver", 31, "Oran", "Voyageur régulier entre l'Ouest et la capitale. Confort garanti."),
        ("Khadidja Mansouri", "khadidja.m@dz-carpool.dz", "0770345678", "passenger", 25, "Constantine", "Étudiante à l'université de Constantine, adepte du covoiturage."),
        ("Sofiane Feghouli", "sofiane.f@dz-carpool.dz", "0551456789", "driver", 19, "Sétif", "Trajets fréquents Sétif-Alger et Sétif-Constantine."),
        ("Nadia Bouzid", "nadia.bouzid@dz-carpool.dz", "0662567890", "passenger", 16, "Alger", "Ingénieure en télécom, navetteuse Alger-Blida."),
        ("Riad Mahrez", "riad.mahrez@dz-carpool.dz", "0771678901", "driver", 13, "Tlemcen", "Passionné de voyages inter-wilayas, véhicule spacieux climatisé."),
        ("Fatima Zohra Khelifi", "fatima.k@dz-carpool.dz", "0552789012", "both", 23, "Annaba", "Médecin résident, déplacements fréquents vers Constantine et Skikda."),
        ("Karim Ziani", "karim.ziani@dz-carpool.dz", "0663890123", "driver", 6, "Béjaïa", "Trajets réguliers sur la corniche kabyle vers Alger."),
        ("Leila Haddad", "leila.haddad@dz-carpool.dz", "0772901234", "passenger", 9, "Blida", "Enseignante, voyages réguliers vers Médéa et Tipaza."),
        ("Mustapha Dahleb", "mustapha.d@dz-carpool.dz", "0553012345", "both", 5, "Batna", "Commerçant, liaisons Aurès-Constantine-Alger."),
        ("Meriem Belkacem", "meriem.b@dz-carpool.dz", "0664123456", "passenger", 15, "Tizi Ouzou", "Architecte, covoiturage respectueux et calme."),
        ("Tarek Cherif", "tarek.cherif@dz-carpool.dz", "0773234567", "driver", 34, "Bordj Bou Arréridj", "Ingénieur électronique, trajets BBA vers Sétif et Alger."),
        ("Samia Slimani", "samia.s@dz-carpool.dz", "0554345678", "passenger", 27, "Mostaganem", "Journaliste culturelle, découverte des wilayas."),
        ("Djamel Belmadi", "djamel.b@dz-carpool.dz", "0665456789", "driver", 47, "Ghardaïa", "Trajets Sud-Nord Ghardaïa-Alger avec véhicule grand confort."),
        ("Amina Saidi", "amina.saidi@dz-carpool.dz", "0774567890", "passenger", 2, "Chlef", "Étudiante en droit, trajets Chlef-Alger réguliers."),
        ("Walid Mesbah", "walid.m@dz-carpool.dz", "0555678901", "driver", 21, "Skikda", "Navettes Skikda-Annaba-Constantine."),
        ("Imene Touati", "imene.t@dz-carpool.dz", "0666789012", "both", 18, "Jijel", "Pharmaciene, trajets littoraux Jijel-Béjaïa-Alger."),
        ("Omar Bensaoula", "omar.b@dz-carpool.dz", "0775890123", "driver", 29, "Mascara", "Mascara-Oran et Mascara-Sidi Bel Abbès."),
        ("Zineb Ferhani", "zineb.f@dz-carpool.dz", "0556901234", "passenger", 35, "Boumerdès", "Chercheuse à l'université M'hamed Bougara."),
        ("Bilal Boutaleb", "bilal.b@dz-carpool.dz", "0667012345", "driver", 22, "Sidi Bel Abbès", "Liaisons rapides Oranie SBA-Oran-Tlemcen."),
        ("Souad Massi", "souad.m@dz-carpool.dz", "0776123456", "passenger", 42, "Tipaza", "Trajets quotidiens Tipaza-Cherchell-Alger."),
        ("Adel Amrouche", "adel.a@dz-carpool.dz", "0557234567", "driver", 28, "M'Sila", "M'Sila vers Bou Saâda et Alger."),
        ("Farida Ould Ali", "farida.o@dz-carpool.dz", "0668345678", "passenger", 10, "Bouira", "Liaisons Bouira-Boumerdès-Alger."),
        ("Hichem Boudaoui", "hichem.b@dz-carpool.dz", "0777456789", "driver", 30, "Ouargla", "Liaisons pétrolières Ouargla-Hassi Messaoud-Alger."),
        ("Salima Ghezali", "salima.g@dz-carpool.dz", "0558567890", "passenger", 16, "Alger", "Consultante RH, déplacements professionnels inter-villes."),
    ]

    created_users = []
    for full_name, email, phone, role, w_code, w_name, bio in users_data:
        user = User(
            full_name=full_name,
            email=email,
            phone_number=phone,
            password_hash=password_hashed,
            role=role,
            wilaya_code=w_code,
            wilaya_name=w_name,
            bio=bio,
            avatar_url=f"https://api.dicebear.com/7.x/initials/svg?seed={full_name.replace(' ', '+')}",
            rating_avg=round(4.4 + (hash(email) % 6) * 0.1, 2),
            rating_count=5 + (hash(email) % 25),
            trips_completed_count=8 + (hash(email) % 40),
            is_active=True,
        )
        db.add(user)
        created_users.append(user)

    db.commit()
    for u in created_users:
        db.refresh(u)
    print(f"✅ {len(created_users)} utilisateurs créés.")

    # 2. Seed Vehicles for drivers
    vehicle_specs = [
        ("Renault", "Symbol", 2021, "Blanc Glacier", "standard", True),
        ("Peugeot", "208", 2022, "Gris Shark", "standard", True),
        ("Dacia", "Sandero Stepway", 2023, "Noir Nacré", "standard", True),
        ("Volkswagen", "Golf 7", 2020, "Bleu Nuit", "premium", True),
        ("Hyundai", "Accent", 2021, "Argent", "standard", True),
        ("Toyota", "Yaris", 2022, "Rouge Flamme", "standard", True),
        ("Seat", "Ibiza", 2021, "Blanc", "standard", True),
        ("Kia", "Sportage", 2023, "Gris Anthracite", "suv", True),
        ("Hyundai", "Tucson", 2024, "Noir", "suv", True),
        ("Skoda", "Octavia", 2022, "Gris Météore", "premium", True),
    ]

    driver_users = [u for u in created_users if u.role in ("driver", "both")]
    created_vehicles = []
    for idx, driver in enumerate(driver_users):
        spec = vehicle_specs[idx % len(vehicle_specs)]
        v = Vehicle(
            user_id=driver.id,
            make=spec[0],
            model=spec[1],
            year=spec[2],
            color=spec[3],
            license_plate=f"{10000 + idx:05d}-1{driver.wilaya_code:02d}-{driver.wilaya_code:02d}",
            comfort_tier=spec[4],
            air_conditioning=spec[5],
        )
        db.add(v)
        created_vehicles.append(v)

    db.commit()
    for v in created_vehicles:
        db.refresh(v)
    print(f"✅ {len(created_vehicles)} véhicules associés aux conducteurs.")

    # 3. Seed 55 Realistic Algerian Trips
    # Master Route Definitions (Wilaya Codes & realistic distances)
    routes = [
        # Trajets Longue Distance (> 300 km -> Pause obligatoire)
        (16, "Alger", "Alger Centre (Grande Poste)", 31, "Oran", "Oran Centre (Place d'Armes)", 415.0, 270, 1600.0, True),
        (16, "Alger", "Station Tafourah", 25, "Constantine", "Cité Daksi", 390.0, 260, 1500.0, True),
        (16, "Alger", "Place du 1er Mai", 5, "Batna", "Centre-Ville Batna", 380.0, 250, 1400.0, True),
        (31, "Oran", "Rond-point d'El Bahia", 16, "Alger", "Station Kharouba", 415.0, 270, 1600.0, True),
        (25, "Constantine", "Université Mentouri", 16, "Alger", "Bab Ezzouar", 390.0, 260, 1500.0, True),
        (16, "Alger", "Aéroport Houari Boumediene", 47, "Ghardaïa", "Place du Marché", 600.0, 420, 2500.0, True),
        (23, "Annaba", "Cours de la Révolution", 16, "Alger", "Station Caroubier", 535.0, 360, 2200.0, True),
        (16, "Alger", "Bir Mourad Raïs", 30, "Ouargla", "Gare Routière Ouargla", 780.0, 540, 3200.0, True),
        
        # Trajets Moyenne et Courte Distance (<= 300 km)
        (16, "Alger", "Kouba (Place Centrale)", 19, "Sétif", "Place Aïn El Fouara", 260.0, 170, 1000.0, True),
        (19, "Sétif", "Cité 1014", 16, "Alger", "Les Fusillés", 260.0, 170, 1000.0, False),
        (16, "Alger", "Place Maurice Audin", 9, "Blida", "Bab El Dzair", 50.0, 45, 300.0, False),
        (9, "Blida", "Place d'Armes Blida", 16, "Alger", "Chevalley", 50.0, 45, 300.0, False),
        (31, "Oran", "Sidi El Houari", 13, "Tlemcen", "Place El Mechouar", 140.0, 100, 600.0, True),
        (13, "Tlemcen", "Imama", 31, "Oran", "Es Sénia", 140.0, 100, 600.0, False),
        (25, "Constantine", "Gare de Constantine", 23, "Annaba", "Gare Ferroviaire Annaba", 160.0, 110, 700.0, True),
        (23, "Annaba", "Sidi Amar", 25, "Constantine", "Nouvelle Ville Ali Mendjeli", 160.0, 110, 700.0, False),
        (16, "Alger", "Boulevard des Martyrs", 6, "Béjaïa", "Quatre Chemins Béjaïa", 240.0, 180, 950.0, True),
        (6, "Béjaïa", "Port de Béjaïa", 16, "Alger", "Hussein Dey", 240.0, 180, 950.0, False),
        (16, "Alger", "Dar El Beïda", 15, "Tizi Ouzou", "Maison de la Culture", 100.0, 75, 450.0, False),
        (15, "Tizi Ouzou", "Nouvelle Ville Tizi", 16, "Alger", "Hydra", 100.0, 75, 450.0, True),
        (31, "Oran", "Akid Lotfi", 27, "Mostaganem", "Front de Mer Salamandre", 85.0, 60, 400.0, False),
        (31, "Oran", "Place du 1er Novembre", 22, "Sidi Bel Abbès", "Boulevard Zabana", 80.0, 55, 380.0, True),
        (22, "Sidi Bel Abbès", "Gare Routière SBA", 31, "Oran", "Gambetta", 80.0, 55, 380.0, False),
        (16, "Alger", "El Biar", 2, "Chlef", "Boulevard des Martyrs Chlef", 210.0, 140, 850.0, False),
        (2, "Chlef", "Bocquet", 16, "Alger", "Ben Aknoun (Campus)", 210.0, 140, 850.0, True),
        (19, "Sétif", "Parc d'Attraction Sétif", 25, "Constantine", "Zouaghi Slimane", 130.0, 90, 550.0, False),
        (25, "Constantine", "El Khroub", 5, "Batna", "Allées Benboulaïd", 120.0, 85, 500.0, False),
        (25, "Constantine", "Bellevue", 21, "Skikda", "Les Allées 20 Août", 85.0, 65, 400.0, False),
        (21, "Skikda", "Port de Skikda", 23, "Annaba", "Chapelle Sainte Augustine", 95.0, 70, 450.0, False),
        (16, "Alger", "Zéralda", 42, "Tipaza", "Ruines Romaines Tipaza", 60.0, 50, 350.0, False),
        (34, "Bordj Bou Arréridj", "Cité 500 Logements BBA", 16, "Alger", "Bab Ezzouar", 230.0, 150, 900.0, True),
        (28, "M'Sila", "Bou Saâda Centre", 16, "Alger", "Baraki", 250.0, 180, 950.0, False),
    ]

    now = datetime.now(timezone.utc)
    created_trips = []
    
    # Generate 55 trips across the next 10 days
    trip_count = 0
    for day_offset in range(1, 11):
        for route in routes:
            if trip_count >= 55:
                break
            driver = driver_users[trip_count % len(driver_users)]
            vehicle = driver.vehicles[0] if driver.vehicles else None
            
            orig_w_code, orig_w_name, orig_city, dest_w_code, dest_w_name, dest_city, dist, dur, base_p, comfort_on = route
            
            dep_time = (now + timedelta(days=day_offset, hours=6 + (trip_count % 12), minutes=(trip_count * 17) % 60)).replace(second=0, microsecond=0)
            total_seats = 3 if comfort_on else 4
            available_seats = total_seats - (trip_count % 3) # Some seats already booked
            
            fuel_info = estimate_fuel_and_suggest_price(
                distance_km=dist,
                total_seats=total_seats,
                wilaya_code=orig_w_code,
                fuel_type="essence",
            )
            
            is_over_300km = dist > 300.0

            trip = Trip(
                driver_id=driver.id,
                vehicle_id=vehicle.id if vehicle else None,
                origin_wilaya_code=orig_w_code,
                origin_wilaya_name=orig_w_name,
                origin_city=orig_city,
                origin_address=f"{orig_city}, Wilaya de {orig_w_name}",
                destination_wilaya_code=dest_w_code,
                destination_wilaya_name=dest_w_name,
                destination_city=dest_city,
                destination_address=f"{dest_city}, Wilaya de {dest_w_name}",
                departure_datetime=dep_time,
                estimated_duration_minutes=dur,
                distance_km=dist,
                total_seats=total_seats,
                available_seats=available_seats,
                base_seat_price=base_p,
                comfort_enabled=comfort_on,
                has_mandatory_rest=is_over_300km,
                fuel_estimate_cost=fuel_info["total_fuel_cost_dzd"],
                suggested_seat_price=fuel_info["suggested_seat_price_dzd"],
                status="active",
            )
            db.add(trip)
            db.flush()

            # Process stops (enforcing rest if > 300km)
            raw_stops = []
            if dist > 200:
                raw_stops.append({
                    "location_name": f"Station Service Autoroute A1 ({orig_city} - {dest_city})",
                    "city": "Station Naftal Autoroutière",
                    "wilaya_name": orig_w_name,
                    "is_mandatory_rest": False,
                    "duration_minutes": 10,
                    "notes": "Arrêt dépose-minute voyageur",
                })

            stops_to_create = prepare_trip_stops(
                distance_km=dist,
                user_stops=raw_stops,
                origin_city=orig_city,
                destination_city=dest_city,
            )

            for s in stops_to_create:
                db_stop = TripStop(
                    trip_id=trip.id,
                    stop_order=s["stop_order"],
                    location_name=s["location_name"],
                    city=s["city"],
                    wilaya_name=s.get("wilaya_name"),
                    is_mandatory_rest=s["is_mandatory_rest"],
                    duration_minutes=s["duration_minutes"],
                    notes=s.get("notes"),
                )
                db.add(db_stop)

            created_trips.append(trip)
            trip_count += 1

    db.commit()
    for t in created_trips:
        db.refresh(t)
    print(f"✅ {len(created_trips)} trajets créés avec arrêts et pauses réglementaires > 300 km.")

    # 4. Seed Bookings (pending, confirmed, cancelled)
    passenger_users = [u for u in created_users if u.role in ("passenger", "both")]
    created_bookings = []
    
    for idx, trip in enumerate(created_trips[:25]):
        # Book a seat with different passengers
        passenger = passenger_users[(idx + 3) % len(passenger_users)]
        if passenger.id == trip.driver_id:
            passenger = passenger_users[(idx + 4) % len(passenger_users)]

        seat_type = "comfort" if (trip.comfort_enabled and idx % 2 == 0) else "standard"
        pricing = calculate_pricing(trip.base_seat_price, seat_count=1, seat_type=seat_type)
        
        status_choice = "confirmed" if idx % 3 == 0 else ("pending" if idx % 3 == 1 else "cancelled")
        
        booking = Booking(
            trip_id=trip.id,
            passenger_id=passenger.id,
            seat_count=1,
            seat_type=seat_type,
            status=status_choice,
            quoted_base_price=pricing["total_base_price"],
            quoted_commission=pricing["total_commission"],
            quoted_comfort_fee=pricing["total_comfort_fee"],
            quoted_total_price=pricing["total_passenger_price"],
            driver_payout=pricing["total_driver_payout"],
            rejection_or_cancellation_reason="Empêchement de dernière minute" if status_choice == "cancelled" else None,
        )
        db.add(booking)
        created_bookings.append(booking)

    db.commit()
    print(f"✅ {len(created_bookings)} réservations seeded avec instantané de prix.")

    # 5. Seed Trip Messages
    messages_sample = [
        "Salam khouya ! Est-ce qu'on peut convenir d'un rendez-vous à la station de métro 1er Mai ?",
        "Wa alaykoum salam ! Oui avec plaisir, je t'attends près de l'entrée principale côté trémie.",
        "Parfait, j'aurai une petite valise cabine.",
        "Pas de problème, le coffre est bien dégagé et climatisé. À tout à l'heure incha'Allah !",
    ]

    for b in created_bookings[:10]:
        if b.status in ("confirmed", "pending"):
            for m_idx, text in enumerate(messages_sample):
                sender = b.passenger_id if m_idx % 2 == 0 else b.trip.driver_id
                msg = TripMessage(
                    trip_id=b.trip_id,
                    sender_id=sender,
                    content=text,
                    created_at=now - timedelta(hours=3 - m_idx),
                )
                db.add(msg)

    # 6. Seed Reviews
    reviews_sample = [
        (5, "Excellent voyage, conduite très prudente sur l'autoroute Est-Ouest. Ponctuel et chaleureux !"),
        (5, "Voiture impeccable, très confortable et climatisée. Je recommande vivement ce conducteur."),
        (4, "Très bon trajet, conducteur respectueux. Petit retard de 10 minutes au départ mais bonne communication."),
        (5, "Super expérience de covoiturage, respect de la pause à mi-parcours très apprécié."),
    ]

    for idx, trip in enumerate(created_trips[:12]):
        reviewer = passenger_users[idx % len(passenger_users)]
        rev_data = reviews_sample[idx % len(reviews_sample)]
        review = Review(
            trip_id=trip.id,
            author_id=reviewer.id,
            target_id=trip.driver_id,
            rating=rev_data[0],
            comment=rev_data[1],
        )
        db.add(review)

    db.commit()
    print("✅ Messages de coordination de trajet et avis communautaires ajoutés.")
    print("🎉 Base de données DZ-CarPool prête avec succès !")

if __name__ == "__main__":
    seed_database()
