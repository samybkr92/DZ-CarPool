# DZ-CarPool — La Route, Partagée

[![DZ-CarPool CI Pipeline](https://github.com/samybkr92/dz-carpool/actions/workflows/ci.yml/badge.svg)](https://github.com/samybkr92/dz-carpool/actions/workflows/ci.yml)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![License](https://img.shields.io/badge/License-Academic_GL_2025%2F2026-emerald)]()

> **DZ-CarPool** est la plateforme web de covoiturage inter-wilayas et de mobilité partagée conçue sur mesure pour l'Algérie. Elle connecte en toute transparence et convivialité les conducteurs disposant de sièges vacants aux voyageurs empruntant le même axe routier à travers les 58 wilayas.

---

##  Points Forts & Règles Métier Algériennes

- **Tarification Transparente en Dinars (DZD) :** Commission de plateforme fixe de 15% ($B \times 1.15$). Les montants sont calculés avec une précision décimale absolue (`Decimal`, aucun flottant binaire).
- **Option "Trajet Confort" (+30%) :** Le passager peut réserver la place passager avant sans personne au milieu avec un supplément explicite de 30% sur le prix de base ($B \times 1.45$), intégralement reversé au conducteur ($B \times 1.30$).
- **Pause Sécurité Obligatoire (> 300 km) :** Tout trajet dont la distance dépasse strictement 300 km intègre automatiquement un arrêt de 15 minutes au point médian (ex: Station Naftal autoroutière).
- **Estimation Carburant Officielle (8L/100km) :** Intégration résiliente de `prix_carburants.json` pour estimer le coût du trajet et suggérer un prix conseillé indicatif par place.
- **Contrôle de Capacité Atomique :** Verrouillage transactionnel (`SELECT FOR UPDATE`) empêchant tout surbooking lors des réservations concurrentes.
- **Expérience Bilingue & RTL Natif :** Support complet du Français et de l'Arabe algérien avec inversion dynamique de la mise en page (`dir="rtl"`) et typographie optimisée.
- **Messagerie Cloisonnée :** Fil de discussion sécurisé strictement réservé au conducteur et aux passagers du trajet (rejet HTTP 403 pour les tiers).

---

## 📐 Architecture Technique

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (Client)                    │
│   React 18 + TypeScript + Vite + Tailwind CSS + i18n   │
└───────────────────────────▲────────────────────────────┘
                            │ HTTPS / REST (JSON)
┌───────────────────────────▼────────────────────────────┐
│              FastAPI Presentation Layer                │
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
└────────────────────────────────────────────────────────┘
```

---

##  Démarrage Rapide (Développement Local)

### Prérequis
- Python 3.11+
- Node.js 20+ & npm
- Git

### 1. Cloner le Dépôt
```bash
git clone https://github.com/samybkr92/dz-carpool.git
cd dz-carpool
```

### 2. Démarrer le Backend FastAPI
```bash
# Configuration de l'environnement virtuel
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# Initialiser et peupler la base de données de test (25 utilisateurs, 55 trajets)
PYTHONPATH=backend python3 database/seed.py

# Lancer le serveur backend
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```
- API & Documentation Swagger interactive : `http://localhost:8000/docs`
- Documentation ReDoc : `http://localhost:8000/redoc`

### 3. Démarrer le Frontend React
```bash
cd frontend
npm install
npm run dev
```
- Application Web accessible sur : `http://localhost:5173`

---

##  Déploiement avec Docker Compose

Pour lancer l'ensemble de la pile applicative (PostgreSQL 16, API FastAPI et Frontend SPA) en un seul clic :
```bash
docker compose up -d --build
```
- **Frontend SPA :** `http://localhost:5173`
- **Backend API :** `http://localhost:8000/docs`
- **PostgreSQL :** `localhost:5432` (`dz_carpool`)

---

##  Tests Automatisés

### Exécuter la Suite de Tests Backend (Unitaires & Intégration)
```bash
export PYTHONPATH=backend
python3 backend/run_tests.py
```
*Vérifie la commission de 15%, le confort de 30%, le seuil > 300 km, la résilience aux pannes de carburant, la concurrence transactionnelle et le cloisonnement du chat.*

### Exécuter les Tests E2E Playwright
```bash
cd frontend
npx playwright test
```

---

##  Documentation & Livrables Projet

L'ensemble de la documentation académique et technique requise est consultable dans le répertoire `docs/` et `database/` :
- **[Dictionnaire des Données](file:///Users/macbookm3/Desktop/GL/database/data_dictionary.md)** : Spécification des 7 tables (3NF/BCNF) et index.
- **[Règles Métier Détaillées](file:///Users/macbookm3/Desktop/GL/database/business_rules.md)** : Formalisation des calculs et de la machine à états.
- **[Exemples de Requêtes SQL](file:///Users/macbookm3/Desktop/GL/database/queries.sql)** : Requêtes de recherche, agrégations financières et mises à jour transactionnelles.
- **[Architecture & Composants](file:///Users/macbookm3/Desktop/GL/docs/architecture.md)** : Découpage Clean Architecture.
- **[Registre des Décisions d'Architecture (10 ADRs)](file:///Users/macbookm3/Desktop/GL/docs/ARCHITECTURE_DECISIONS.md)** : Justification technique détaillée.
- **[Guide de Déploiement Cloud](file:///Users/macbookm3/Desktop/GL/docs/DEPLOYMENT.md)** : Déploiement Vercel, Render et Neon PostgreSQL.
- **[Guide Utilisateur Illustré](file:///Users/macbookm3/Desktop/GL/docs/USER_GUIDE.md)** : Manuels Conducteur et Passager.
- **[Tableau de Bord Agile](file:///Users/macbookm3/Desktop/GL/docs/project_board.md)** : Backlog priorisé et Kanban.
- **[Rapports de Sprints](file:///Users/macbookm3/Desktop/GL/docs/sprints/)** : Sprints 1, 2 et 3 avec la section obligatoire *"Changement de cap et leçons apprises"*.
- **[Diagrammes UML Mermaid](file:///Users/macbookm3/Desktop/GL/docs/diagrams/)** : Cas d'utilisation, composants, séquences de réservation et inscription, modèle de classes.

---

##  Comptes de Démonstration (Seed Data)

| Rôle | Nom | Email | Mot de Passe | Ville / Axe |
| :--- | :--- | :--- | :--- | :--- |
| **Conducteur** | Amine Benali | `amine.benali@dz-carpool.dz` | `password123` | Alger $\to$ Oran |
| **Passager** | Khadidja Mansouri | `khadidja.m@dz-carpool.dz` | `password123` | Constantine |
| **Conducteur** | Yacine Brahimi | `yacine.brahimi@dz-carpool.dz` | `password123` | Oran $\to$ Alger |

---

## 📄 Licence & Crédits
Projet réalisé dans le cadre du module **Génie Logiciel (GL) 2025/2026**.  
Tous droits réservés © 2026 DZ-CarPool Team.
