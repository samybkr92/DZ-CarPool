# Guide de Déploiement — DZ-CarPool (Vercel & Cloud)

Ce guide décrit la procédure de déploiement en production de **DZ-CarPool** sur des infrastructures gratuites ou adaptées aux projets étudiants (Vercel pour le frontend React, Render / Supabase / Neon pour le backend FastAPI et la base PostgreSQL).

---

## 1. Déploiement du Frontend sur Vercel

Vercel héberge nativement les applications React / Vite avec distribution globale sur CDN et certificats SSL automatiques.

### Configuration `vercel.json`
À la racine du projet ou du dossier `frontend/` :
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/v1/(.*)",
      "destination": "https://dz-carpool-api.onrender.com/api/v1/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Étapes de déploiement via Vercel CLI
```bash
# Se positionner dans le dossier frontend
cd frontend

# Lancer le déploiement
vercel --prod
```

### Variables d'Environnement Frontend (Vercel Dashboard)
- `VITE_API_URL` : URL de votre backend en production (ex: `https://dz-carpool-api.onrender.com`).

---

## 2. Déploiement du Backend sur Render / Railway

### Configuration du Service Web (Render)
1. Créer un nouveau **Web Service** connecté à votre dépôt GitHub `dz-carpool`.
2. **Root Directory :** `.`
3. **Runtime :** Python 3
4. **Build Command :** `pip install -r backend/requirements.txt`
5. **Start Command :** `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`

### Variables d'Environnement Backend
| Variable | Valeur Recommandée | Description |
| :--- | :--- | :--- |
| `ENVIRONMENT` | `production` | Active le mode production |
| `SECRET_KEY` | *(Clé aléatoire de 64 caractères)* | Clé de signature des jetons JWT |
| `DATABASE_URL` | `postgresql://user:pass@ep-host.neon.tech/dz_carpool` | URL de la base PostgreSQL |
| `CORS_ORIGINS` | `https://dz-carpool.vercel.app` | Domaines frontend autorisés |
| `PLATFORM_COMMISSION_RATE` | `0.15` | Taux de commission de plateforme (15%) |
| `COMFORT_SURCHARGE_RATE` | `0.30` | Taux de supplément confort (30%) |
| `REST_STOP_THRESHOLD_KM` | `300.0` | Seuil de pause obligatoire en km |

---

## 3. Provisionnement de la Base de Données (Neon / Supabase)

1. Créer une base de données PostgreSQL gratuite sur [Neon.tech](https://neon.tech) ou [Supabase](https://supabase.com).
2. Récupérer l'URL de connexion SSL (`postgresql://...`).
3. Initialiser les tables et insérer le jeu de données de démonstration algérien :
```bash
DATABASE_URL="postgresql://user:pass@ep-host.neon.tech/dz_carpool" python3 database/seed.py
```

---

## 4. Déploiement Conteneurisé via Docker Compose

Pour un déploiement sur VPS local ou cloud (Ubuntu / Debian) :
```bash
# Cloner le dépôt
git clone https://github.com/samybkr92/dz-carpool.git
cd dz-carpool

# Lancer tous les conteneurs avec volume persistant
docker compose up -d --build

# Vérifier la santé des services
docker compose ps
```
- Frontend accessible sur : `http://localhost:5173`
- Backend API accessible sur : `http://localhost:8000/docs`
- PostgreSQL accessible sur : `localhost:5432`
