# Dictionnaire des Données — DZ-CarPool (PostgreSQL / SQLite)

Ce document décrit en détail le schéma relationnel normalisé en 3NF/BCNF de l'application **DZ-CarPool**, conçue pour la mobilité et le covoiturage inter-wilayas en Algérie.

---

## 1. Vue d'Ensemble des Tables

| Nom de la Table | Description Métier | Clé Primaire | Clés Étrangères Principales |
| :--- | :--- | :--- | :--- |
| `users` | Comptes utilisateurs unifiés (Chauffeur, Passager, ou les deux) | `id` (INTEGER / SERIAL) | Aucune |
| `vehicles` | Véhicules enregistrés par les conducteurs | `id` (INTEGER / SERIAL) | `user_id` $\to$ `users(id)` |
| `trips` | Annonces de trajets inter-wilayas publiées par les conducteurs | `id` (INTEGER / SERIAL) | `driver_id` $\to$ `users(id)`, `vehicle_id` $\to$ `vehicles(id)` |
| `trip_stops` | Arrêts intermédiaires et pause réglementaire obligatoire | `id` (INTEGER / SERIAL) | `trip_id` $\to$ `trips(id)` |
| `bookings` | Demandes de réservation et places confirmées | `id` (INTEGER / SERIAL) | `trip_id` $\to$ `trips(id)`, `passenger_id` $\to$ `users(id)` |
| `trip_messages` | Messagerie sécurisée restreinte aux participants du trajet | `id` (INTEGER / SERIAL) | `trip_id` $\to$ `trips(id)`, `sender_id` $\to$ `users(id)` |
| `reviews` | Avis et évaluations d'expérience post-voyage | `id` (INTEGER / SERIAL) | `trip_id` $\to$ `trips(id)`, `author_id` $\to$ `users(id)`, `target_id` $\to$ `users(id)` |

---

## 2. Description Détaillée des Tables

### 2.1 Table `users`
Stocke l'identité, l'authentification sécurisée, la réputation et le profil territorial des utilisateurs.

| Colonne | Type SQL | Nullable | Valeur par Défaut | Contraintes & Index | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `INTEGER` / `SERIAL` | Non | Auto-increment | PK, INDEX | Identifiant technique unique |
| `email` | `VARCHAR(255)` | Non | - | UNIQUE, INDEX, Format email | Adresse électronique de connexion |
| `phone_number` | `VARCHAR(32)` | Non | - | INDEX | Numéro de téléphone mobile algérien (format 05/06/07) |
| `password_hash` | `VARCHAR(255)` | Non | - | - | Empreinte sécurisée du mot de passe (hachage bcrypt, 12 rounds) |
| `full_name` | `VARCHAR(128)` | Non | - | - | Nom et prénom complets |
| `role` | `VARCHAR(20)` | Non | `'both'` | CHECK `role IN ('driver', 'passenger', 'both')` | Rôle principal dans la plateforme |
| `wilaya_code` | `INTEGER` | Oui | `NULL` | INDEX, CHECK `1 <= wilaya_code <= 58` | Code officiel de la wilaya de résidence (1 à 58) |
| `wilaya_name` | `VARCHAR(64)` | Oui | `NULL` | - | Nom officiel de la wilaya (ex: 'Alger', 'Oran', 'Sétif') |
| `bio` | `TEXT` | Oui | `NULL` | - | Courte biographie de présentation |
| `avatar_url` | `VARCHAR(512)` | Oui | `NULL` | - | URL de la photo de profil ou avatar généré |
| `rating_avg` | `DECIMAL(3, 2)` | Non | `0.00` | CHECK `rating_avg >= 0 AND rating_avg <= 5` | Note moyenne attribuée par la communauté |
| `rating_count` | `INTEGER` | Non | `0` | CHECK `rating_count >= 0` | Nombre total d'évaluations reçues |
| `trips_completed_count` | `INTEGER` | Non | `0` | CHECK `trips_completed_count >= 0` | Nombre de trajets réalisés avec succès |
| `is_active` | `BOOLEAN` | Non | `TRUE` | INDEX | État du compte (actif/suspendu) |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Non | `CURRENT_TIMESTAMP` | - | Horodatage de création |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | Non | `CURRENT_TIMESTAMP` | - | Horodatage de dernière modification |

---

### 2.2 Table `vehicles`
Associe aux conducteurs les caractéristiques matérielles de leur véhicule.

| Colonne | Type SQL | Nullable | Valeur par Défaut | Contraintes & Index | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `INTEGER` / `SERIAL` | Non | Auto-increment | PK, INDEX | Identifiant technique du véhicule |
| `user_id` | `INTEGER` | Non | - | FK `users(id)` ON DELETE CASCADE, INDEX | Propriétaire du véhicule |
| `make` | `VARCHAR(64)` | Non | - | - | Marque automobile (ex: 'Renault', 'Peugeot', 'Dacia') |
| `model` | `VARCHAR(64)` | Non | - | - | Modèle automobile (ex: 'Symbol', '208', 'Stepway') |
| `year` | `INTEGER` | Non | - | CHECK `year >= 1990 AND year <= 2030` | Année de mise en circulation |
| `color` | `VARCHAR(32)` | Non | - | - | Couleur extérieure de la carrosserie |
| `license_plate` | `VARCHAR(32)` | Oui | `NULL` | - | Immatriculation algérienne normalisée |
| `comfort_tier` | `VARCHAR(32)` | Non | `'standard'` | CHECK `comfort_tier IN ('standard', 'suv', 'premium')` | Gamme de confort du véhicule |
| `air_conditioning` | `BOOLEAN` | Non | `TRUE` | - | Présence de la climatisation fonctionnelle |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Non | `CURRENT_TIMESTAMP` | - | Date d'ajout du véhicule |

---

### 2.3 Table `trips`
Représente une offre de trajet inter-wilayas proposée par un conducteur.

| Colonne | Type SQL | Nullable | Valeur par Défaut | Contraintes & Index | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `INTEGER` / `SERIAL` | Non | Auto-increment | PK, INDEX | Identifiant unique du trajet |
| `driver_id` | `INTEGER` | Non | - | FK `users(id)` ON DELETE CASCADE, INDEX | Identifiant du conducteur |
| `vehicle_id` | `INTEGER` | Oui | `NULL` | FK `vehicles(id)` ON DELETE SET NULL | Véhicule mobilisé pour le voyage |
| `origin_wilaya_code` | `INTEGER` | Non | - | INDEX, CHECK `1 <= origin_wilaya_code <= 58` | Code wilaya de départ |
| `origin_wilaya_name` | `VARCHAR(64)` | Non | - | - | Nom de la wilaya de départ |
| `origin_city` | `VARCHAR(128)` | Non | - | INDEX | Ville / commune de départ |
| `origin_address` | `VARCHAR(255)` | Non | - | - | Point de rassemblement précis au départ |
| `destination_wilaya_code` | `INTEGER` | Non | - | INDEX, CHECK `1 <= destination_wilaya_code <= 58` | Code wilaya d'arrivée |
| `destination_wilaya_name` | `VARCHAR(64)` | Non | - | - | Nom de la wilaya d'arrivée |
| `destination_city` | `VARCHAR(128)` | Non | - | INDEX | Ville / commune de destination |
| `destination_address` | `VARCHAR(255)` | Non | - | - | Point d'arrivée convenu |
| `departure_datetime` | `TIMESTAMP WITH TIME ZONE` | Non | - | INDEX | Date et heure de départ programmées |
| `estimated_duration_minutes` | `INTEGER` | Non | - | CHECK `estimated_duration_minutes > 0` | Durée estimée en minutes |
| `distance_km` | `DECIMAL(8, 2)` | Non | - | CHECK `distance_km > 0` | Distance totale calculée de l'itinéraire |
| `total_seats` | `INTEGER` | Non | - | CHECK `total_seats >= 1 AND total_seats <= 8` | Nombre total de places offertes |
| `available_seats` | `INTEGER` | Non | - | CHECK `available_seats >= 0 AND available_seats <= total_seats` | Places encore réservables |
| `base_seat_price` | `DECIMAL(10, 2)` | Non | - | CHECK `base_seat_price > 0` | Prix de base fixé par le conducteur en DZD |
| `comfort_enabled` | `BOOLEAN` | Non | `FALSE` | INDEX | Option "Trajet Confort" activée (+30% sur prix de base) |
| `has_mandatory_rest` | `BOOLEAN` | Non | `FALSE` | INDEX | Pause obligatoire de 15 min (> 300 km) |
| `fuel_estimate_cost` | `DECIMAL(10, 2)` | Oui | `NULL` | - | Estimation du coût de carburant (8L/100km) |
| `suggested_seat_price` | `DECIMAL(10, 2)` | Oui | `NULL` | - | Prix suggéré par place à titre indicatif |
| `notes` | `TEXT` | Oui | `NULL` | - | Précisions (bagages, non-fumeur, etc.) |
| `status` | `VARCHAR(20)` | Non | `'active'` | CHECK `status IN ('active', 'completed', 'cancelled')` | État du trajet |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Non | `CURRENT_TIMESTAMP` | - | Horodatage de publication |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | Non | `CURRENT_TIMESTAMP` | - | Horodatage de mise à jour |

---

### 2.4 Table `trip_stops`
Arrêts intermédiaires et pause de repos réglementaire de mi-parcours.

| Colonne | Type SQL | Nullable | Valeur par Défaut | Contraintes & Index | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `INTEGER` / `SERIAL` | Non | Auto-increment | PK, INDEX | Identifiant technique de l'arrêt |
| `trip_id` | `INTEGER` | Non | - | FK `trips(id)` ON DELETE CASCADE, INDEX | Trajet concerné |
| `stop_order` | `INTEGER` | Non | - | CHECK `stop_order >= 1` | Ordre séquentiel de l'arrêt |
| `location_name` | `VARCHAR(128)` | Non | - | - | Nom descriptif de l'arrêt |
| `city` | `VARCHAR(128)` | Non | - | - | Ville de l'arrêt |
| `wilaya_name` | `VARCHAR(64)` | Oui | `NULL` | - | Wilaya de passage |
| `is_mandatory_rest` | `BOOLEAN` | Non | `FALSE` | INDEX | Marqueur de la pause réglementaire de 15 minutes |
| `duration_minutes` | `INTEGER` | Non | `10` | CHECK `duration_minutes >= 5` | Durée d'arrêt en minutes (15 min pour pause obligatoire) |
| `notes` | `TEXT` | Oui | `NULL` | - | Consignes d'arrêt |

---

### 2.5 Table `bookings`
Instancie une réservation de place(s) avec son instantané de tarification figé.

| Colonne | Type SQL | Nullable | Valeur par Défaut | Contraintes & Index | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `INTEGER` / `SERIAL` | Non | Auto-increment | PK, INDEX | Identifiant technique de la réservation |
| `trip_id` | `INTEGER` | Non | - | FK `trips(id)` ON DELETE CASCADE, INDEX | Trajet réservé |
| `passenger_id` | `INTEGER` | Non | - | FK `users(id)` ON DELETE CASCADE, INDEX | Voyageur ayant fait la demande |
| `seat_count` | `INTEGER` | Non | `1` | CHECK `seat_count >= 1` | Nombre de places demandées |
| `seat_type` | `VARCHAR(20)` | Non | `'standard'` | CHECK `seat_type IN ('standard', 'comfort')` | Type de place choisie |
| `status` | `VARCHAR(20)` | Non | `'pending'` | CHECK `status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'completed')`, INDEX | État dans la machine à états |
| `quoted_base_price` | `DECIMAL(10, 2)` | Non | - | CHECK `quoted_base_price >= 0` | Instantané : Prix de base total |
| `quoted_commission` | `DECIMAL(10, 2)` | Non | - | CHECK `quoted_commission >= 0` | Instantané : Commission DZ-CarPool (15%) |
| `quoted_comfort_fee` | `DECIMAL(10, 2)` | Non | `0.00` | CHECK `quoted_comfort_fee >= 0` | Instantané : Supplément confort (+30%) |
| `quoted_total_price` | `DECIMAL(10, 2)` | Non | - | CHECK `quoted_total_price > 0` | Instantané : Montant total dû par le passager |
| `driver_payout` | `DECIMAL(10, 2)` | Non | - | CHECK `driver_payout >= 0` | Instantané : Rémunération nette du conducteur |
| `rejection_or_cancellation_reason` | `TEXT` | Oui | `NULL` | - | Motif justifiant le refus ou l'annulation |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Non | `CURRENT_TIMESTAMP` | INDEX | Date de soumission de la demande |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | Non | `CURRENT_TIMESTAMP` | - | Date du dernier changement d'état |

---

### 2.6 Table `trip_messages`
Messagerie textuelle strictement cloisonnée au contexte du trajet entre le conducteur et ses passagers.

| Colonne | Type SQL | Nullable | Valeur par Défaut | Contraintes & Index | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `INTEGER` / `SERIAL` | Non | Auto-increment | PK, INDEX | Identifiant unique du message |
| `trip_id` | `INTEGER` | Non | - | FK `trips(id)` ON DELETE CASCADE, INDEX | Trajet auquel est rattachée la conversation |
| `sender_id` | `INTEGER` | Non | - | FK `users(id)` ON DELETE CASCADE, INDEX | Émetteur du message |
| `content` | `TEXT` | Non | - | CHECK `length(content) > 0` | Contenu textuel sécurisé |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Non | `CURRENT_TIMESTAMP` | INDEX | Horodatage d'envoi du message |

---

### 2.7 Table `reviews`
Avis post-trajet permettant de bâtir la confiance communautaire.

| Colonne | Type SQL | Nullable | Valeur par Défaut | Contraintes & Index | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `INTEGER` / `SERIAL` | Non | Auto-increment | PK, INDEX | Identifiant technique de l'évaluation |
| `trip_id` | `INTEGER` | Non | - | FK `trips(id)` ON DELETE CASCADE, INDEX | Trajet évalué |
| `author_id` | `INTEGER` | Non | - | FK `users(id)` ON DELETE CASCADE, INDEX | Auteur de l'avis |
| `target_id` | `INTEGER` | Non | - | FK `users(id)` ON DELETE CASCADE, INDEX | Bénéficiaire de l'avis (conducteur) |
| `rating` | `INTEGER` | Non | - | CHECK `rating >= 1 AND rating <= 5` | Note attribuée (de 1 à 5 étoiles) |
| `comment` | `TEXT` | Oui | `NULL` | - | Commentaire d'appréciation |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Non | `CURRENT_TIMESTAMP` | - | Horodatage de publication |

---

## 3. Stratégie d'Indexation pour Haute Performance

Pour garantir des temps de réponse sous les 50 ms lors de la montée en charge, les index suivants sont mis en place :

1. **Recherche de trajets multi-critères :**
   - `idx_trips_search (origin_wilaya_code, destination_wilaya_code, departure_datetime, status, available_seats)`
2. **Cloisonnement de messagerie & vérification d'accès :**
   - `idx_bookings_auth_lookup (trip_id, passenger_id, status)`
   - `idx_messages_trip_timeline (trip_id, created_at ASC)`
3. **Prévention des doublons et conflits :**
   - `idx_unique_active_passenger_booking (trip_id, passenger_id)` pour les statuts non annulés.
