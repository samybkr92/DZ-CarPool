import os
from typing import List

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_PATH = os.path.join(BASE_DIR, ".env")

# Simple, ultra-fast .env reader without complex dependencies
if os.path.isfile(ENV_PATH):
    try:
        with open(ENV_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip("'\"")
                    if k not in os.environ:
                        os.environ[k] = v
    except Exception:
        pass


class Settings:
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1")
    APP_NAME: str = os.getenv("APP_NAME", "DZ-CarPool API")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    SECRET_KEY: str = os.getenv("SECRET_KEY", "dz-carpool-super-secret-production-jwt-key-2026-algeria")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24)))

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./dz_carpool.db")
    FUEL_PRICES_FILE_PATH: str = os.getenv(
        "FUEL_PRICES_FILE_PATH",
        os.path.join(BASE_DIR, "data", "prix_carburants.json"),
    )

    # Business Rules Constants
    PLATFORM_COMMISSION_RATE: float = float(os.getenv("PLATFORM_COMMISSION_RATE", "0.15"))
    COMFORT_SURCHARGE_RATE: float = float(os.getenv("COMFORT_SURCHARGE_RATE", "0.30"))
    REST_STOP_THRESHOLD_KM: float = float(os.getenv("REST_STOP_THRESHOLD_KM", "300.0"))
    MANDATORY_REST_DURATION_MINUTES: int = int(os.getenv("MANDATORY_REST_DURATION_MINUTES", "15"))
    AVG_FUEL_CONSUMPTION_L_PER_100KM: float = float(os.getenv("AVG_FUEL_CONSUMPTION_L_PER_100KM", "8.0"))

    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000",
    )

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
