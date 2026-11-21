from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1.api import api_router

# Auto-create tables on startup (especially for development & SQLite)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "API REST officielle de DZ-CarPool, plateforme de covoiturage en Algérie "
        "(trajets inter-wilayas et navettes quotidiennes). Spécifications GL 2025/2026."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.DEBUG else settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 router
app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["Système"])
def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": "dz-carpool-backend",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": "connected",
    }


@app.get("/", tags=["Système"])
def root():
    return {
        "message": "Bienvenue sur l'API DZ-CarPool — La route, partagée.",
        "documentation": "/docs",
        "health": "/health",
    }
