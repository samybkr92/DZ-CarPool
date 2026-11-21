# Rapport de Sprint 2 — Moteur Métier, Réservations & Concurrence

- **Période :** Semaines 3 et 4
- **Objectif du Sprint :** Implémenter le cycle de vie complet des trajets, le calcul des carburants Naftal, l'injection de la pause obligatoire et la réservation transactionnelle avec prévention du surbooking.

---

## 1. Travaux Réalisés
- Développement du `PricingService` appliquant rigoureusement les 15% de commission et les 30% de supplément confort.
- Implémentation du `FuelService` avec consommation normalisée à 8 L/100 km et lecture résiliente de `prix_carburants.json`.
- Implémentation du `TripService` imposant l'arrêt de 15 minutes dès que la distance dépasse strictement 300.0 km.
- Développement du `BookingService` gérant la machine à états (`pending` $\to$ `confirmed` / `rejected` / `cancelled`) avec décompte atomique.
- Exposition des endpoints d'action REST explicites (`POST /bookings/{id}/approve`, `POST /bookings/{id}/reject`).
- Suite de tests unitaires et d'intégration validant les 5 règles métier fondamentales.

---

## 2. Difficultés & Blocages Rencontrés
- Gestion des courses critiques lors de réservations concurrentes : résolu par l'implémentation de transactions atomiques avec verrouillage pessimiste de ligne (`with_for_update()`).
- Résilience aux données de carburant corrompues ou incomplètes : mise en place d'une cascade de secours vers les tarifs Naftal nationaux officiels.

---

## 3. Changement de Cap et Leçons Apprises (Obligatoire)
- **Constat :** Le cahier des charges prévoyait initialement une mise à jour d'état via une simple route générique `PATCH /bookings/{id}`.
- **Changement de cap :** Cette approche présentait un risque majeur de confusion dans les permissions RBAC et de manipulation arbitraire des états par les clients. Nous avons bifurqué vers des verbes d'action explicites (`/approve`, `/reject`, `/cancel`) encapsulant chacun leurs contrôles d'autorisation stricts et leurs effets de bord sur la capacité.
- **Leçon apprise :** Les opérations métier critiques doivent être modélisées comme des commandes explicites plutôt que comme de simples mutations de propriétés CRUD.
