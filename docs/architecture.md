# Architecture Système & Technique — DZ-CarPool

Ce document présente l'architecture globale, les principes d'ingénierie et le modèle de sécurité de l'application **DZ-CarPool**, solution algérienne de covoiturage inter-wilayas.

---

## 1. Principes d'Ingénierie & Architecture en Couches

DZ-CarPool adopte les principes de la **Clean Architecture** et du patron **Layered Architecture** afin d'assurer un découplage total entre la logique métier, la persistance des données et les interfaces de présentation.

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (Client)                    │
│   React 18 + TypeScript + Vite + Tailwind CSS + i18n   │
└───────────────────────────▲────────────────────────────┘
                            │ HTTPS / JSON REST API
┌───────────────────────────▼────────────────────────────┐
│              FastAPI Presentation Layer                │
│    API Routers / Endpoints (/api/v1/auth, trips...)    │
│    Validation Pydantic V2 / Sécurité JWT / CORS        │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                Domain & Service Layer                  │
│    • PricingService (Calculs Decimal, 15%, 30%)        │
│    • BookingService (Machine à états & concurrence)    │
│    • TripService (Insertion pause > 300 km)            │
│    • FuelService (Consommation 8L/100km & Naftal JSON) │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│               Data Persistence Layer                   │
│    SQLAlchemy 2.0 ORM + Schéma 3NF/BCNF                │
│    PostgreSQL (Prod) / SQLite (Dev & Test)             │
│    Transactions atomiques avec verrouillage SELECT FOR │
└────────────────────────────────────────────────────────┘
```

---

## 2. Découpage Fonctionnel des Modules Backend

### 2.1 Couche Présentation (`backend/app/api/v1/endpoints/`)
- `auth.py` : Inscription, émission de JWT (HMAC-SHA256), profil utilisateur et gestion des véhicules.
- `trips.py` : Publication d'annonces, recherche multi-critères avec filtres territoriaux (wilayas/communes), fiches détaillées.
- `bookings.py` : Demandes de places, verbes d'action dédiés (`/approve`, `/reject`, `/cancel`), décompte atomique.
- `messages.py` : Messagerie textuelle restreinte aux seuls participants vérifiés du trajet.
- `fuel.py` : Estimation de consommation et calcul du prix conseillé indicatif.

### 2.2 Couche Métier & Services (`backend/app/services/`)
- `pricing_service.py` : Moteur de calcul financier opérant exclusivement sur des objets `Decimal` avec arrondi comptable au centime (`ROUND_HALF_UP`). Aucun flottant binaire n'est utilisé.
- `fuel_service.py` : Analyseur résilient du fichier `prix_carburants.json` appliquant la règle des 8 L / 100 km avec valeurs de repli automatiques.
- `trip_service.py` : Injection systématique de la pause obligatoire de 15 minutes dès que la distance dépasse strictement 300 km.
- `booking_service.py` : Gestionnaire transactionnel de transition d'état et d'allocation de capacité.

---

## 3. Modèle de Persistance et Base de Données

Le modèle relationnel garantit l'intégrité référentielle en **Troisième Forme Normale (3NF)** :
- Séparation stricte entre les entités `User`, `Vehicle`, `Trip`, `TripStop`, `Booking`, `TripMessage` et `Review`.
- Contraintes d'intégrité au niveau du schéma SQL :
  - `CHECK (available_seats >= 0 AND available_seats <= total_seats)`
  - `CHECK (base_seat_price > 0)`
  - `CHECK (1 <= wilaya_code <= 58)`
  - `CHECK (role IN ('driver', 'passenger', 'both'))`
- Index composites optimisés pour la recherche rapide des trajets inter-wilayas.

---

## 4. Modèle de Sécurité & Gestion des Menaces

1. **Authentification sans état :** Les jetons JWT signés cryptographiquement encapsulent l'identité utilisateur sans surcharge de session serveur.
2. **Hachage de mot de passe :** Algorithme standard bcrypt avec salage automatique (12 tours de calcul).
3. **Contrôle d'accès basé sur les rôles (RBAC) & Propriété :**
   - Seul le conducteur propriétaire peut modifier/annuler son trajet ou valider des réservations.
   - Seul le passager concerné ou le conducteur peuvent modifier une réservation.
   - Le chat est strictement inaccessible à toute personne étrangère au trajet (Code HTTP `403 Forbidden`).
4. **Prévention des attaques courantes :**
   - **XSS :** Échappement natif des données par React et validation stricte Pydantic V2.
   - **SQL Injection :** Requêtes paramétrées automatiques via l'ORM SQLAlchemy.
   - **IDOR :** Vérification systématique des clés primaires contre l'identité du jeton JWT.
