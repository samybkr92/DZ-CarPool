from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.models.vehicle import Vehicle
from app.schemas.user import UserCreate, UserUpdate, UserOut, Token
from app.schemas.vehicle import VehicleCreate, VehicleOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentification & Profils"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """Registers a new driver or passenger in Algeria."""
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Une adresse email identique est déjà enregistrée sur DZ-CarPool.",
        )

    db_user = User(
        email=user_in.email.lower(),
        password_hash=hash_password(user_in.password),
        full_name=user_in.full_name,
        phone_number=user_in.phone_number,
        role=user_in.role,
        bio=user_in.bio,
        avatar_url=user_in.avatar_url or f"https://api.dicebear.com/7.x/initials/svg?seed={user_in.full_name}",
        wilaya_code=user_in.wilaya_code,
        wilaya_name=user_in.wilaya_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token(subject=db_user.id)
    return Token(access_token=token, token_type="bearer", user=UserOut.model_validate(db_user))


@router.post("/login", response_model=Token)
async def login_user(request: Request, db: Session = Depends(get_db)):
    """Authenticates a user and returns a signed JWT. Supports JSON and Form data."""
    email = None
    password = None

    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            email = body.get("email") or body.get("username")
            password = body.get("password")
        except Exception:
            pass
    elif "multipart/form-data" in content_type or "application/x-www-form-urlencoded" in content_type:
        try:
            form = await request.form()
            email = form.get("email") or form.get("username")
            password = form.get("password")
        except Exception:
            pass
    else:
        try:
            body = await request.json()
            email = body.get("email") or body.get("username")
            password = body.get("password")
        except Exception:
            try:
                form = await request.form()
                email = form.get("email") or form.get("username")
                password = form.get("password")
            except Exception:
                pass

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email et mot de passe requis.",
        )

    user = db.query(User).filter(User.email == str(email).lower().strip()).first()
    if not user or not verify_password(str(password), user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects (email ou mot de passe invalide).",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Votre compte DZ-CarPool est inactif ou désactivé.",
        )

    token = create_access_token(subject=user.id)
    return Token(access_token=token, token_type="bearer", user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Returns the authenticated user's profile and reputation stats."""
    return current_user


@router.put("/me", response_model=UserOut)
def update_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Updates user biography, phone number, avatar, and wilaya."""
    update_data = user_update.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(current_user, field, val)

    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/vehicles", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
def add_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Registers a vehicle for the authenticated driver."""
    veh = Vehicle(
        user_id=current_user.id,
        make=vehicle_in.make,
        model=vehicle_in.model,
        year=vehicle_in.year,
        color=vehicle_in.color,
        license_plate=vehicle_in.license_plate,
        comfort_tier=vehicle_in.comfort_tier,
        air_conditioning=vehicle_in.air_conditioning,
    )
    db.add(veh)
    db.commit()
    db.refresh(veh)
    return veh


@router.get("/vehicles", response_model=List[VehicleOut])
def list_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lists vehicles owned by the authenticated driver."""
    return db.query(Vehicle).filter(Vehicle.user_id == current_user.id).all()
