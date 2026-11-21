# Registre des Décisions d'Architecture (ADR) — DZ-CarPool

Ce registre formalise les choix techniques et de conception stratégiques réalisés pour **DZ-CarPool**, en détaillant le contexte, les options évaluées, la décision retenue, ses conséquences et son mode de validation.

---

## ADR-001 : Choix de la Stack Technique (FastAPI / PostgreSQL / React TypeScript)
- **Contexte :** Nécessité d'une solution moderne, hautement performante, typée de bout en bout et documentée pour satisfaire les exigences du projet GL 2025/2026.
- **Alternatives évaluées :** Django + Django REST Framework, Node.js Express, Spring Boot.
- **Décision retenue :** FastAPI (Python 3.14 / 3.11) pour le backend avec Pydantic V2 et SQLAlchemy 2.0 ; PostgreSQL pour la persistance ; React 18 + Vite + Tailwind CSS + TypeScript pour le client.
- **Conséquences :**
  - Performance asynchrone native et génération automatique de la documentation OpenAPI / Swagger (`/docs`).
  - Typage statique fort partagé entre les schémas Pydantic et les interfaces TypeScript.
- **Validation :** Temps de réponse moyen < 40 ms sur les endpoints d'API et zéro anomalie de type à la compilation.

---

## ADR-002 : Modèle de Données Normalisé (3NF/BCNF) et Typage Monétaire Décimal
- **Contexte :** Les transactions de covoiturage manipulent des Dinars Algériens (DZD). L'utilisation de types à virgule flottante binaire (`float` / `IEEE 754`) introduit des erreurs d'arrondi inacceptables en comptabilité.
- **Alternatives évaluées :** Stockage en `float` standard, stockage en centimes entiers `INTEGER`.
- **Décision retenue :** Utilisation systématique du type SQL `DECIMAL(10, 2)` couplé au type Python standard `Decimal` avec mode d'arrondi bancaire explicite `ROUND_HALF_UP`.
- **Conséquences :** Exactitude absolue au centime de Dinar près sur chaque décomposition de prix.
- **Validation :** Tests unitaires validant l'absence de dérive d'arrondi (`test_pricing_commission_15_percent`).

---

## ADR-003 : Stratégie de Concurrence et Contrôle Atomique de la Capacité
- **Contexte :** Lorsque plusieurs passagers tentent de réserver simultanément les dernières places d'un trajet populaire, aucun surbooking ne doit survenir.
- **Alternatives évaluées :**
  - Optimistic locking avec champ `version`.
  - Contrôle applicatif simple sans transaction (vulnérable aux courses critiques).
- **Décision retenue :** Gestion transactionnelle pessimiste via verrouillage de ligne (`SELECT ... FOR UPDATE` en PostgreSQL) combinée à une contrainte de table `CHECK (available_seats >= 0)`.
- **Conséquences :** Atomicité garantie (ACID) lors de l'approbation d'une réservation. La disponibilité est décrémentée ou la transaction est annulée avec rejet explicite.
- **Validation :** Test d'intégration de concurrence `test_booking_approval_and_capacity_concurrency`.

---

## ADR-004 : Machine à États des Réservations et Verbes REST Dédiés
- **Contexte :** Une réservation passe par plusieurs états (`pending` $\to$ `confirmed`, `rejected`, `cancelled`).
- **Alternatives évaluées :** Endpoint générique `PATCH /bookings/{id}` modifiant le champ `status`.
- **Décision retenue :** Exposition d'endpoints d'action explicites :
  - `POST /bookings/{id}/approve`
  - `POST /bookings/{id}/reject`
  - `POST /bookings/{id}/cancel`
- **Conséquences :** Clarté sémantique, granularité fine des permissions RBAC et traçabilité des motifs de refus ou d'annulation.
- **Validation :** Spécification OpenAPI et tests d'intégration API.

---

## ADR-005 : Instantanés de Tarification (`quoted_*`) et Commission Plateforme (15%)
- **Contexte :** Si le conducteur ou la plateforme modifie ultérieurement ses tarifs, les réservations déjà enregistrées ne doivent pas subir de variation rétroactive.
- **Alternatives évaluées :** Calcul dynamique à la volée lors de la lecture de la réservation.
- **Décision retenue :** Enregistrement d'un instantané tarifaire immuable dans la table `bookings` au moment de la demande :
  - `quoted_base_price`
  - `quoted_commission` (15%)
  - `quoted_comfort_fee`
  - `quoted_total_price`
  - `driver_payout`
- **Conséquences :** Garantie juridique et transparence totale pour le passager et le conducteur.
- **Validation :** Vérification de l'intégrité des champs gelés dans les tests d'intégration.

---

## ADR-006 : Interaction Tarifaire de l'Option "Trajet Confort" (+30%)
- **Contexte :** Le cahier des charges stipule un "supplément de 30% sur le prix de base". Il convient de clarifier l'interaction entre ce supplément et la commission de 15%.
- **Alternatives évaluées :**
  - Application en cascade : $\text{Total} = (B \times 1.30) \times 1.15$ (surcoût de commission sur le confort).
  - Application linéaire additive sans cascade : $\text{Total} = B + (B \times 0.15) + (B \times 0.30) = B \times 1.45$.
- **Décision retenue :** Formule linéaire additive sans cascade. Le supplément confort (30%) est intégralement versé au conducteur pour rémunérer la mise à disposition exclusive du siège avant :
  - $\text{Prix Passager Confort} = B \times 1.45$
  - $\text{Versement Conducteur Confort} = B \times 1.30$
- **Conséquences :** Transparence exemplaire et incitation forte pour les conducteurs.
- **Validation :** Test unitaire `test_pricing_trajet_confort_30_percent`.

---

## ADR-007 : Seuil Strict de Pause Obligatoire au Point Médian (`distance > 300.0 km`)
- **Contexte :** La sécurité routière impose une pause de 15 minutes sur les longs trajets. La condition est définie pour une distance strictement supérieure à 300 km.
- **Alternatives évaluées :** Pause suggérée optionnelle ou seuil à $\ge 300\text{ km}$.
- **Décision retenue :** Règle binaire stricte : $\text{distance} > 300.0\text{ km}$ entraîne obligatoirement l'insertion d'un arrêt de 15 minutes à mi-parcours (ex: Station Naftal autoroutière). À exactement 300.0 km ou moins, aucune pause obligatoire n'est injectée. L'arrêt obligatoire ne peut être ni supprimé ni raccourci par le conducteur.
- **Conséquences :** Respect des impératifs de sécurité routière nationale.
- **Validation :** Test unitaire `test_midpoint_break_over_300km_threshold`.

---

## ADR-008 : Résilience et Découplage du Référentiel Carburant (`prix_carburants.json`)
- **Contexte :** L'estimation du carburant repose sur un fichier externe `prix_carburants.json` mis à jour hebdomadairement.
- **Alternatives évaluées :** Appel bloquant à une API distante ou base de données externe.
- **Décision retenue :** Chargement local avec mise en cache mémoire et gestion robuste des pannes (fallback vers les moyennes nationales Naftal : Essence 45.62 DA/L, Diesel 29.01 DA/L, GPL 9.00 DA/L si le fichier est absent ou corrompu).
- **Conséquences :** Zéro indisponibilité de la création de trajet en cas de corruption du fichier de données.
- **Validation :** Test unitaire `test_fuel_estimate_and_missing_data_resilience`.

---

## ADR-009 : Internationalisation Bilingue Français/Arabe et Support RTL Natif
- **Contexte :** L'application cible les usagers algériens et doit offrir une expérience bilingue authentique (Français et Arabe algérien).
- **Alternatives évaluées :** Traduction automatique côté navigateur ou inversion CSS basique.
- **Décision retenue :** Configuration complète avec `react-i18next` et fichiers de traduction dédiés. Lors du passage en arabe, l'attribut `dir="rtl"` est dynamiquement appliqué à la racine HTML avec typographie adaptée (`Noto Sans Arabic`) et inversion des mises en page.
- **Conséquences :** Ergonomie native et confort de lecture optimal pour les utilisateurs arabophones.
- **Validation :** Test E2E de basculement linguistique et inspection visuelle.

---

## ADR-010 : Modèle de Menaces, Sécurité JWT et Cloisonnement de Messagerie
- **Contexte :** Protection de la vie privée des passagers et des conducteurs, et prévention des accès non autorisés aux conversations de trajet.
- **Alternatives évaluées :** Chat public ou ouvert à tous les utilisateurs connectés.
- **Décision retenue :** Vérification systématique d'autorisation en base de données : seuls le conducteur et les passagers ayant une réservation `pending` ou `confirmed` pour ce trajet précis peuvent lire et publier des messages. Toute autre requête est rejetée avec une réponse HTTP `403 Forbidden`.
- **Conséquences :** Cloisonnement étanche des données personnelles et respect strict de la confidentialité.
- **Validation :** Test d'intégration de sécurité `test_chat_authorization_security`.
