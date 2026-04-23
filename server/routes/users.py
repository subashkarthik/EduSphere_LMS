from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from database import get_db
from models.user import User, UserRole
from models.academic import Course, Enrollment
from schemas.auth import UserResponse
from middleware.auth import get_current_user, require_roles
from access_db import get_all_faculty

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/")
def list_users(
    role: Optional[str] = Query(None),
    department_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List users. For FACULTY role, reads from MS Access Faculty_Master.
    For other roles, uses SQLite.
    """
    # If requesting faculty list, try Access first
    if role and role.upper() == "FACULTY":
        try:
            access_faculty = get_all_faculty()
            if access_faculty:
                results = []
                for f in access_faculty:
                    name = f.get("Name", "Unknown")
                    fid = f.get("FacultyID", 0)

                    # Apply search filter
                    if search:
                        search_lower = search.lower()
                        if search_lower not in name.lower() and search_lower not in f.get("Department", "").lower():
                            continue

                    # Apply department filter
                    if department_id and f.get("Department", "").upper() != department_id.upper():
                        continue

                    results.append({
                        "id": str(fid),
                        "email": f"{name.lower().replace(' ', '.').replace('_', '')}@edusphere.edu.in",
                        "name": name,
                        "role": "FACULTY",
                        "department": f.get("Department", None),
                        "department_id": f.get("Department", None),
                        "avatar": f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}&background=1e3a8a&color=fff",
                        "enrollment_no": None,
                        "designation": f.get("Designation", "Faculty"),
                        "phone": None,
                        "is_active": f.get("Status", "Active") == "Active",
                        "type": f.get("Type", "Regular"),
                    })
                return results[offset:offset + limit]
        except Exception as e:
            print(f"[Access] Faculty listing fallback to SQLite: {e}")

    # SQLite fallback / other roles
    query = db.query(User).filter(User.is_active == True)

    if role:
        try:
            query = query.filter(User.role == UserRole(role))
        except ValueError:
            pass

    if department_id:
        query = query.filter(User.department_id == department_id)

    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%")) |
            (User.enrollment_no.ilike(f"%{search}%"))
        )

    users = query.offset(offset).limit(limit).all()

    return [
        UserResponse(
            id=u.id, email=u.email, name=u.name, role=u.role.value,
            department=u.department.name if u.department else None,
            department_id=u.department_id, avatar=u.avatar,
            enrollment_no=u.enrollment_no, designation=u.designation,
            phone=u.phone, is_active=u.is_active,
        )
        for u in users
    ]


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get user profile by ID. Self or Admin."""
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return UserResponse(
        id=user.id, email=user.email, name=user.name, role=user.role.value,
        department=user.department.name if user.department else None,
        department_id=user.department_id, avatar=user.avatar,
        enrollment_no=user.enrollment_no, designation=user.designation,
        phone=user.phone, is_active=user.is_active,
    )


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    name: Optional[str] = None,
    phone: Optional[str] = None,
    designation: Optional[str] = None,
    avatar: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update user profile. Self or Admin. Writes to SQLite."""
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    if name is not None:
        user.name = name
    if phone is not None:
        user.phone = phone
    if designation is not None:
        user.designation = designation
    if avatar is not None:
        user.avatar = avatar

    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id, email=user.email, name=user.name, role=user.role.value,
        department=user.department.name if user.department else None,
        department_id=user.department_id, avatar=user.avatar,
        enrollment_no=user.enrollment_no, designation=user.designation,
        phone=user.phone, is_active=user.is_active,
    )


@router.delete("/{user_id}")
def deactivate_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN])),
):
    """Deactivate a user account. Admin only. SQLite."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")

    user.is_active = False
    db.commit()
    return {"message": f"User {user.name} deactivated"}
