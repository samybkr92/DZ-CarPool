# Tableau de Bord Agile & Gestion de Projet — DZ-CarPool

Ce tableau de bord retrace l'organisation du projet selon la méthode **Scrum / Agile**, avec découpage en sprints de 2 semaines, gestion du backlog et traçabilité des tickets.

---

## 1. Backlog Produit Priorisé (Product Backlog)

| ID | User Story / Fonctionnalité | Priorité (MoSCoW) | Estimation (SP) | Statut |
| :--- | :--- | :---: | :---: | :---: |
| **US-01** | Inscription & Connexion sécurisée avec JWT et hachage bcrypt | Must have | 5 | Terminé |
| **US-02** | Modèle relationnel 3NF/BCNF avec contraintes SQL et index | Must have | 8 | Terminé |
| **US-03** | Publication d'un trajet avec calcul kilométrique et arrêts | Must have | 5 | Terminé |
| **US-04** | Recherche multi-critères (Wilaya départ/arrivée, date, filtres) | Must have | 5 | Terminé |
| **US-05** | Règle de sécurité : Pause obligatoire 15 min pour distance > 300 km | Must have | 3 | Terminé |
| **US-06** | Moteur tarifaire : 15% commission + 30% supplément confort | Must have | 5 | Terminé |
| **US-07** | Estimation carburant 8L/100km & lecture de `prix_carburants.json` | Must have | 5 | Terminé |
| **US-08** | Réservation avec décompte atomique et verrouillage transactionnel | Must have | 8 | Terminé |
| **US-09** | Validation / Refus explicite par le conducteur (`/approve`, `/reject`) | Must have | 5 | Terminé |
| **US-10** | Fil de discussion sécurisé restreint aux membres du trajet | Must have | 5 | Terminé |
| **US-11** | Interface bilingue Français / Arabe avec support natif RTL | Must have | 8 | Terminé |
| **US-12** | Dashboards Conducteur et Passager avec suivi d'état | Should have | 5 | Terminé |
| **US-13** | Conteneurisation Docker Compose & Pipeline CI GitHub Actions | Should have | 5 | Terminé |

---

## 2. État du Tableau Kanban

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   À FAIRE (0)   │  EN COURS (0)   │  EN REVUE (0)   │   TERMINÉ (13)  │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│                 │                 │                 │ • US-01 Auth    │
│                 │                 │                 │ • US-02 Schéma  │
│                 │                 │                 │ • US-03 Trajets │
│                 │                 │                 │ • US-04 Search  │
│                 │                 │                 │ • US-05 Pause   │
│                 │                 │                 │ • US-06 Tarifs  │
│                 │                 │                 │ • US-07 Carbur. │
│                 │                 │                 │ • US-08 Réserv. │
│                 │                 │                 │ • US-09 Valid.  │
│                 │                 │                 │ • US-10 Chat    │
│                 │                 │                 │ • US-11 i18n RTL│
│                 │                 │                 │ • US-12 Dashbrd │
│                 │                 │                 │ • US-13 Docker  │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## 3. Synthèse des Vélocités

- **Sprint 1 (Fondations & Données) :** 18 Story Points réalisés sur 18 engagés.
- **Sprint 2 (Logique Métier & Réservations) :** 26 Story Points réalisés sur 26 engagés.
- **Sprint 3 (Expérience Bilingue, Sécurité & CI/CD) :** 28 Story Points réalisés sur 28 engagés.
- **Vélocité Moyenne :** 24 SP / sprint.
