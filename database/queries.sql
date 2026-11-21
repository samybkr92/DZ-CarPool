-- ==============================================================================
-- REQUÊTES SQL DE RÉFÉRENCE & DÉMONSTRATION — DZ-CARPOOL
-- Base de données : PostgreSQL / SQLite (Compatible 3NF/BCNF)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. RECHERCHE DE TRAJETS AVEC FILTRES AVANCÉS & DISPONIBILITÉ (Trip Search)
-- Utilisée par la barre de recherche principale (Origine, Destination, Date, Sièges)
-- Optimisée via l'index composite idx_trips_search
-- ------------------------------------------------------------------------------
SELECT 
    t.id AS trip_id,
    t.origin_city,
    t.origin_wilaya_name,
    t.destination_city,
    t.destination_wilaya_name,
    t.departure_datetime,
    t.distance_km,
    t.estimated_duration_minutes,
    t.available_seats,
    t.total_seats,
    t.base_seat_price,
    ROUND(t.base_seat_price * 1.15, 2) AS standard_passenger_price,
    CASE 
        WHEN t.comfort_enabled THEN ROUND(t.base_seat_price * 1.45, 2)
        ELSE NULL 
    END AS comfort_passenger_price,
    t.comfort_enabled,
    t.has_mandatory_rest,
    u.id AS driver_id,
    u.full_name AS driver_name,
    u.avatar_url AS driver_avatar,
    u.rating_avg AS driver_rating,
    u.trips_completed_count AS driver_trips_count,
    v.make AS vehicle_make,
    v.model AS vehicle_model,
    v.comfort_tier AS vehicle_tier
FROM trips t
INNER JOIN users u ON t.driver_id = u.id
LEFT JOIN vehicles v ON t.vehicle_id = v.id
WHERE t.status = 'active'
  AND t.available_seats >= 1
  -- Filtrage territorial (ex: Alger -> Oran)
  AND (t.origin_wilaya_code = 16 OR LOWER(t.origin_city) LIKE '%alger%')
  AND (t.destination_wilaya_code = 31 OR LOWER(t.destination_city) LIKE '%oran%')
  -- Filtrage temporel (trajets à venir à partir d'aujourd'hui)
  AND t.departure_datetime >= CURRENT_TIMESTAMP
ORDER BY t.departure_datetime ASC
LIMIT 20 OFFSET 0;


-- ------------------------------------------------------------------------------
-- 2. CLASSEMENT DES MEILLEURS CONDUCTEURS PAR WILAYA (Top Drivers Aggregation)
-- Agrégation statistique de la réputation, du volume de voyages et des avis positifs
-- ------------------------------------------------------------------------------
SELECT 
    u.id AS driver_id,
    u.full_name,
    u.wilaya_code,
    u.wilaya_name,
    u.rating_avg,
    u.rating_count,
    COUNT(DISTINCT t.id) AS total_published_trips,
    COUNT(DISTINCT b.id) AS total_served_passengers,
    COALESCE(SUM(b.quoted_base_price), 0) AS total_generated_revenue_dzd
FROM users u
LEFT JOIN trips t ON u.id = t.driver_id
LEFT JOIN bookings b ON t.id = b.trip_id AND b.status = 'completed'
WHERE u.role IN ('driver', 'both')
  AND u.is_active = TRUE
GROUP BY u.id, u.full_name, u.wilaya_code, u.wilaya_name, u.rating_avg, u.rating_count
HAVING u.rating_count >= 3
ORDER BY u.rating_avg DESC, total_served_passengers DESC
LIMIT 10;


-- ------------------------------------------------------------------------------
-- 3. VALIDATION TRANSACTIONNELLE DE CAPACITÉ AVANT RÉSERVATION (Capacity Guard)
-- Effectue la vérification stricte de non-dépassement lors de la demande d'un passager
-- ------------------------------------------------------------------------------
SELECT 
    t.id AS trip_id,
    t.driver_id,
    t.available_seats,
    t.total_seats,
    t.status AS trip_status,
    COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.seat_count ELSE 0 END), 0) AS confirmed_seats_taken
FROM trips t
LEFT JOIN bookings b ON t.id = b.trip_id
WHERE t.id = 1
GROUP BY t.id, t.driver_id, t.available_seats, t.total_seats, t.status;


-- ------------------------------------------------------------------------------
-- 4. RAPPORT FINANCIER DE LA COMMISSION DE PLATEFORME (Monthly Platform Revenue)
-- Jointure multi-tables pour calculer les revenus de commission (15%) et le volume
-- ------------------------------------------------------------------------------
SELECT 
    DATE_TRUNC('month', b.created_at) AS report_month,
    COUNT(b.id) AS total_confirmed_bookings,
    SUM(b.seat_count) AS total_seats_sold,
    SUM(b.quoted_base_price) AS total_driver_payouts_dzd,
    SUM(b.quoted_commission) AS total_platform_commission_dzd,
    SUM(b.quoted_comfort_fee) AS total_comfort_supplements_dzd,
    SUM(b.quoted_total_price) AS total_gross_merchandise_volume_dzd
FROM bookings b
INNER JOIN trips t ON b.trip_id = t.id
WHERE b.status = 'confirmed'
GROUP BY DATE_TRUNC('month', b.created_at)
ORDER BY report_month DESC;


-- ------------------------------------------------------------------------------
-- 5. MISE À JOUR ATOMIQUE DU STATUT ET RESTITUTION DE CAPACITÉ (Booking Cancellation)
-- Utilisée lors d'une annulation pour restituer immédiatement les places libérées
-- ------------------------------------------------------------------------------
-- Étape 1 : Passage de la réservation en statut 'cancelled'
UPDATE bookings
SET 
    status = 'cancelled',
    rejection_or_cancellation_reason = 'Imprévu voyageur communiqué au conducteur',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 5 
  AND status = 'confirmed';

-- Étape 2 : Restitution atomique de la capacité sur le trajet correspondant
UPDATE trips
SET 
    available_seats = LEAST(total_seats, available_seats + (
        SELECT seat_count FROM bookings WHERE id = 5
    )),
    updated_at = CURRENT_TIMESTAMP
WHERE id = (SELECT trip_id FROM bookings WHERE id = 5);
