-- ==============================================================================
-- DZ-CarPool - Schéma Relationnel PostgreSQL / SQLite Compatible (DDL)
-- Projet GL 2025/2026 - Spécification Base de Données Relationnelle (Section 5)
-- Normalisation : 3NF / BCNF
-- ==============================================================================

-- 1. Table Utilisateurs (Users)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30),
    role VARCHAR(20) NOT NULL DEFAULT 'both' CHECK (role IN ('driver', 'passenger', 'both', 'admin')),
    avatar_url VARCHAR(500),
    bio TEXT,
    wilaya_code INTEGER CHECK (wilaya_code BETWEEN 1 AND 58),
    wilaya_name VARCHAR(100),
    rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating_avg BETWEEN 1.00 AND 5.00),
    rating_count INTEGER NOT NULL DEFAULT 0 CHECK (rating_count >= 0),
    trips_completed_count INTEGER NOT NULL DEFAULT 0 CHECK (trips_completed_count >= 0),
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Table Véhicules (Vehicles)
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    make VARCHAR(100) NOT NULL,          -- ex: Renault, Peugeot, Volkswagen
    model VARCHAR(100) NOT NULL,         -- ex: Symbol, 208, Golf
    year INTEGER NOT NULL CHECK (year BETWEEN 1990 AND 2027),
    color VARCHAR(50) NOT NULL,
    license_plate VARCHAR(50),
    comfort_tier VARCHAR(50) DEFAULT 'standard', -- standard, premium, suv
    air_conditioning BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);

-- 3. Table Trajets (Trips)
CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    
    -- Origine
    origin_wilaya_code INTEGER NOT NULL CHECK (origin_wilaya_code BETWEEN 1 AND 58),
    origin_wilaya_name VARCHAR(100) NOT NULL,
    origin_city VARCHAR(150) NOT NULL,
    origin_address VARCHAR(255) NOT NULL,
    origin_lat NUMERIC(9, 6),
    origin_lng NUMERIC(9, 6),
    
    -- Destination
    destination_wilaya_code INTEGER NOT NULL CHECK (destination_wilaya_code BETWEEN 1 AND 58),
    destination_wilaya_name VARCHAR(100) NOT NULL,
    destination_city VARCHAR(150) NOT NULL,
    destination_address VARCHAR(255) NOT NULL,
    destination_lat NUMERIC(9, 6),
    destination_lng NUMERIC(9, 6),
    
    -- Horaires & Itinéraire
    departure_datetime TIMESTAMP NOT NULL,
    estimated_duration_minutes INTEGER NOT NULL CHECK (estimated_duration_minutes > 0),
    distance_km NUMERIC(8, 2) NOT NULL CHECK (distance_km > 0),
    
    -- Places & Tarification
    total_seats INTEGER NOT NULL CHECK (total_seats BETWEEN 1 AND 8),
    available_seats INTEGER NOT NULL CHECK (available_seats >= 0 AND available_seats <= total_seats),
    base_seat_price NUMERIC(10, 2) NOT NULL CHECK (base_seat_price >= 0), -- Prix net conducteur en DZD
    
    -- Options Métier Spécifiques DZ-CarPool
    comfort_enabled BOOLEAN NOT NULL DEFAULT 0, -- Option Trajet Confort (+30%)
    has_mandatory_rest BOOLEAN NOT NULL DEFAULT 0, -- Imposé si distance_km > 300
    
    -- Estimation Carburant (Règle Métier 8L/100km & prix_carburants.json)
    fuel_estimate_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    suggested_seat_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    
    -- Statut du trajet
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    cancellation_reason TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trips_search ON trips(origin_city, destination_city, departure_datetime);
CREATE INDEX IF NOT EXISTS idx_trips_driver ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_departure ON trips(departure_datetime);

-- 4. Table Étapes et Arrêts (TripStops)
CREATE TABLE IF NOT EXISTS trip_stops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    stop_order INTEGER NOT NULL CHECK (stop_order >= 1),
    location_name VARCHAR(200) NOT NULL,
    city VARCHAR(150) NOT NULL,
    wilaya_name VARCHAR(100),
    is_mandatory_rest BOOLEAN NOT NULL DEFAULT 0,
    duration_minutes INTEGER NOT NULL DEFAULT 15 CHECK (duration_minutes >= 10),
    notes VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (trip_id, stop_order)
);

CREATE INDEX IF NOT EXISTS idx_trip_stops_trip ON trip_stops(trip_id);

-- 5. Table Réservations (Bookings)
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE RESTRICT,
    passenger_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    seat_count INTEGER NOT NULL DEFAULT 1 CHECK (seat_count >= 1),
    seat_type VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (seat_type IN ('standard', 'comfort')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'completed')),
    
    -- Instantané financier immuable (Pricing Snapshot)
    quoted_base_price NUMERIC(10, 2) NOT NULL CHECK (quoted_base_price >= 0),
    quoted_commission NUMERIC(10, 2) NOT NULL CHECK (quoted_commission >= 0), -- 15%
    quoted_comfort_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (quoted_comfort_fee >= 0), -- +30% de base si comfort
    quoted_total_price NUMERIC(10, 2) NOT NULL CHECK (quoted_total_price >= 0),
    driver_payout NUMERIC(10, 2) NOT NULL CHECK (driver_payout >= 0),
    
    rejection_or_cancellation_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_trip ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_bookings_passenger ON bookings(passenger_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- 6. Table Messages du Trajet (TripMessages)
CREATE TABLE IF NOT EXISTS trip_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_trip_date ON trip_messages(trip_id, created_at);

-- 7. Table Avis et Notations (Reviews)
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    target_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (trip_id, author_id, target_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(target_id);
