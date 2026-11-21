# Règles Métier & Logique Fonctionnelle — DZ-CarPool

Ce document consigne l'ensemble des règles métier non négociables de **DZ-CarPool**, en conformité absolue avec le cahier des charges GL 2025/2026.

---

## 1. Modèle Financier & Décomposition Tarifaire

### 1.1 Règle Générale (Commission Plateforme 15%)
- Le conducteur définit librement son **prix de base par place** ($B$, en Dinars Algériens DZD).
- La commission de plateforme est fixée à **15%** :
  $$\text{Commission} = B \times 0.15$$
- Le prix payé par le voyageur pour une place standard est :
  $$\text{Prix Passager Standard} = B \times 1.15$$
- La rémunération nette reversée au conducteur reste exactement son prix de base :
  $$\text{Versement Conducteur} = B$$
- Tous les montants sont calculés avec une précision décimale absolue (`Decimal`, arrondi au centime le plus proche `ROUND_HALF_UP`) afin de bannir les erreurs d'arrondi binaire des nombres à virgule flottante (`float`).

---

### 1.2 Option "Trajet Confort" (Supplément de 30%)
- Le conducteur peut activer l'option **Trajet Confort** (ex: garantie de la place passager avant sans passager au milieu, espace bagage élargi).
- Le supplément confort est de **30% sur le prix de base** :
  $$\text{Supplément Confort} = B \times 0.30$$
- Conformément à la directive d'interaction tarifaire non composée, le supplément confort s'ajoute au prix de base sans majoration en cascade de la commission :
  $$\text{Prix Passager Confort} = B \times (1 + 0.15 + 0.30) = B \times 1.45$$
- Le conducteur perçoit son prix de base majoré de la prime de confort :
  $$\text{Versement Conducteur Confort} = B \times 1.30$$
- **Transparence totale :** Toutes les composantes (Prix de base, Commission DZ-CarPool, Option Confort, Total Passager, Versement Conducteur) sont explicitement ventilées dans l'interface et figées dans l'instantané de réservation (`quoted_*`).

---

## 2. Pause Réglementaire Obligatoire (> 300 km)

- **Condition stricte :** Si la distance totale de l'itinéraire est **strictement supérieure à 300 km** ($\text{distance} > 300.0\text{ km}$), une pause de repos de **15 minutes** au point médian est automatiquement générée et imposée par le système.
- **Seuil exact de 300 km :** À exactement 300.0 km ou moins, aucune pause obligatoire n'est requise.
- **Inaltérabilité :** Le conducteur peut ajouter d'autres arrêts intermédiaires personnalisés (villes de passage, stations-service), mais il lui est impossible de supprimer ou de réduire la durée de la pause de mi-parcours réglementaire.
- **Visibilité :** La pause obligatoire est affichée de manière proéminente sur la fiche détaillée du trajet avec le badge distinctif *"Pause sécurité obligatoire 15 min"*.

---

## 3. Estimation Carburant & Prix Conseillé (`prix_carburants.json`)

- Lors de la création d'un trajet, le système lit le fichier de référence `backend/data/prix_carburants.json`, mis à jour périodiquement avec les tarifs officiels par wilaya.
- **Formule de consommation moyenne :**
  $$\text{Quantité de carburant (Litres)} = \frac{\text{Distance (km)} \times 8}{100}$$
  *(Consommation nominale estimée à 8 litres pour 100 kilomètres).*
- **Coût total du carburant :**
  $$\text{Coût Total Carburant} = \text{Quantité} \times \text{Prix du Litre (Wilaya de départ)}$$
- **Prix conseillé par place (à titre indicatif) :**
  $$\text{Prix Conseillé / Place} = \frac{\text{Coût Total Carburant}}{\text{Nombre Total de Places}}$$
- **Résilience aux pannes :** Si le fichier est manquant, corrompu ou si la wilaya n'est pas répertoriée, le système utilise des valeurs de secours nationales (Essence: 45.62 DA/L, Diesel: 29.01 DA/L, GPL: 9.00 DA/L) sans jamais bloquer la création du trajet.
- Le prix conseillé reste purement indicatif : le conducteur conserve la pleine maîtrise de son prix de base.

---

## 4. Machine à États des Réservations & Contrôle de Capacité

### 4.1 Cycle de Vie d'une Réservation
1. **Création (`pending`) :** Le voyageur soumet sa demande pour $N$ places. Aucune place n'est encore définitivement décomptée, mais la validité de la capacité disponible ($available\_seats \ge N$) est vérifiée.
2. **Approbation (`confirmed`) :** Le conducteur accepte la demande. Une transaction atomique avec verrouillage de ligne (`SELECT FOR UPDATE`) décrémente `available_seats = available_seats - N`. Si la capacité est insuffisante, l'opération échoue avec rejet de transaction.
3. **Refus (`rejected`) :** Le conducteur refuse la demande. L'état devient `rejected` avec enregistrement du motif éventuel. Aucune place n'est modifiée.
4. **Annulation (`cancelled`) :**
   - Si la réservation était `confirmed`, l'annulation restitue immédiatement et de manière atomique les places : `available_seats = available_seats + N`.
   - Si la réservation était `pending`, elle passe simplement à `cancelled`.
5. **Achèvement (`completed`) :** Lorsque le trajet arrive à son terme, les réservations confirmées passent au statut final permettant le dépôt des avis.

### 4.2 Règles d'Intégrité
- Un conducteur ne peut jamais réserver son propre trajet.
- Un passager ne peut pas créer plusieurs demandes actives simultanées pour un même trajet.
- La disponibilité ne peut jamais être négative ($\text{available\_seats} \ge 0$).

---

## 5. Cloisonnement Sécurisé de la Messagerie

- Seuls le **conducteur** du trajet et les **passagers ayant une réservation active** (statut `pending` ou `confirmed`) sont autorisés à accéder au fil de discussion et à y poster des messages.
- Toute tentative d'accès par un utilisateur externe renvoie immédiatement une réponse HTTP `403 Forbidden`.
- Les messages horodatés garantissent une coordination sereine des points de rendez-vous inter-wilayas.
