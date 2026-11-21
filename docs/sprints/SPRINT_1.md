# Rapport de Sprint 1 — Fondations Architecturales & Persistance

- **Période :** Semaines 1 et 2
- **Objectif du Sprint :** Établir le socle architectural, initialiser le schéma relationnel en 3NF/BCNF, sécuriser l'authentification JWT et mettre en place l'environnement bilingue.

---

## 1. Travaux Réalisés
- Conception du modèle relationnel et rédaction du script DDL `database/schema.sql`.
- Configuration de l'environnement backend FastAPI avec configuration par variables d'environnement (`.env`).
- Mise en place du module de sécurité : hachage de mot de passe par **bcrypt** (12 rounds) et émission de jetons JWT sécurisés.
- Rédaction du dictionnaire de données exhaustif (`database/data_dictionary.md`).
- Création du script de peuplement réaliste `database/seed.py` (25 utilisateurs algériens, 15 véhicules, 55 trajets inter-wilayas).

---

## 2. Difficultés & Blocages Rencontrés
- Les environnements de test SQLite en mémoire (`:memory:`) créaient des sessions isolées sans persistance des tables entre les requêtes de test. Résolu en migrant vers une base SQLite dédiée aux tests (`test_dz_carpool.db`).
- Problème de validation des adresses email sans module externe : remplacement par une expression régulière Pydantic V2 native robuste.

---

## 3. Changement de Cap et Leçons Apprises (Obligatoire)
- **Constat :** L'approche initiale envisageait de stocker les montants monétaires en nombres à virgule flottante (`float`).
- **Changement de cap :** Lors de la modélisation financière de la commission de 15% et du confort de 30%, des micro-écarts d'arrondi binaire sont apparus sur certaines sommes. La décision a été prise de migrer l'intégralité du modèle financier vers le type standard `Decimal` avec mode d'arrondi explicite `ROUND_HALF_UP` et colonnes SQL `DECIMAL(10, 2)`.
- **Leçon apprise :** Ne jamais faire de compromis sur les types de données financières, même en phase initiale de prototypage.
