from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserRole
from schemas.auth import LoginRequest, RegisterRequest, TokenResponse, RefreshRequest, UserResponse
from utils.password import hash_password, verify_password
from utils.jwt import create_access_token, create_refresh_token, decode_token
from middleware.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with email + password and return JWT tokens."""
    user = db.query(User).filter(User.email == request.email, User.is_active == True).first()

    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create tokens
    token_data = {"sub": user.id, "role": user.role.value, "email": user.email}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    # Store refresh token in DB
    user.refresh_token = refresh_token
    db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user={
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.value,
            "department": user.department.name if user.department else None,
            "avatar": user.avatar,
            "enrollment_no": user.enrollment_no,
            "designation": user.designation,
        },
    )


@router.post("/register", response_model=UserResponse)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN])),
):
    """Register a new user. Admin only."""
    # Check if email already exists
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        role = UserRole(request.role)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid role: {request.role}")

    user = User(
        email=request.email,
        password_hash=hash_password(request.password),
        name=request.name,
        role=role,
        department_id=request.department_id,
        enrollment_no=request.enrollment_no,
        designation=request.designation,
        phone=request.phone,
        avatar=f"https://ui-avatars.com/api/?name={request.name.replace(' ', '+')}&background=1e3a8a&color=fff",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role.value,
        department=user.department.name if user.department else None,
        department_id=user.department_id,
        avatar=user.avatar,
        enrollment_no=user.enrollment_no,
        designation=user.designation,
        phone=user.phone,
        is_active=user.is_active,
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role.value,
        department=current_user.department.name if current_user.department else None,
        department_id=current_user.department_id,
        avatar=current_user.avatar,
        enrollment_no=current_user.enrollment_no,
        designation=current_user.designation,
        phone=current_user.phone,
        is_active=current_user.is_active,
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(request: RefreshRequest, db: Session = Depends(get_db)):
    """Refresh an expired access token using the refresh token."""
    payload = decode_token(request.refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()

    if not user or user.refresh_token != request.refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token revoked or user not found")

    token_data = {"sub": user.id, "role": user.role.value, "email": user.email}
    new_access = create_access_token(token_data)
    new_refresh = create_refresh_token(token_data)

    user.refresh_token = new_refresh
    db.commit()

    return TokenResponse(
        access_token=new_access,
        refresh_token=new_refresh,
        user={
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.value,
            "department": user.department.name if user.department else None,
            "avatar": user.avatar,
            "enrollment_no": user.enrollment_no,
            "designation": user.designation,
        },
    )


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Invalidate the current user's refresh token."""
    current_user.refresh_token = None
    db.commit()
    return {"message": "Logged out successfully"}
