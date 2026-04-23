from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models.user import User, UserRole
from models.placement import PlacementDrive, PlacementApplication, PlacementStats, DriveStatus, ApplicationStatus
from schemas.schemas import PlacementDriveCreate, PlacementDriveResponse, PlacementStatsResponse
from middleware.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/placements", tags=["Placements"])


@router.get("/drives", response_model=List[PlacementDriveResponse])
def list_drives(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all placement drives with application status for students."""
    drives = db.query(PlacementDrive).order_by(PlacementDrive.drive_date.desc()).all()

    results = []
    for d in drives:
        app_status = None
        if current_user.role == UserRole.STUDENT:
            app = db.query(PlacementApplication).filter(
                PlacementApplication.drive_id == d.id,
                PlacementApplication.student_id == current_user.id,
            ).first()
            app_status = app.status.value if app else None

        results.append(PlacementDriveResponse(
            id=d.id,
            company_name=d.company_name,
            role_offered=d.role_offered,
            package_lpa=d.package_lpa,
            drive_date=str(d.drive_date),
            status=d.status.value,
            application_status=app_status,
        ))
    return results


@router.post("/drives")
def create_drive(
    request: PlacementDriveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN])),
):
    """Create a new placement drive. Admin only."""
    drive = PlacementDrive(
        company_name=request.company_name,
        role_offered=request.role_offered,
        package_lpa=request.package_lpa,
        drive_date=datetime.strptime(request.drive_date, "%Y-%m-%d").date(),
        last_date_apply=datetime.strptime(request.last_date_apply, "%Y-%m-%d").date(),
        eligibility_criteria=request.eligibility_criteria,
        description=request.description,
    )
    db.add(drive)
    db.commit()
    db.refresh(drive)

    return {"id": drive.id, "message": f"Placement drive created for {drive.company_name}"}


@router.post("/drives/{drive_id}/apply")
def apply_to_drive(
    drive_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.STUDENT])),
):
    """Apply to a placement drive. Student only."""
    drive = db.query(PlacementDrive).filter(PlacementDrive.id == drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")

    existing = db.query(PlacementApplication).filter(
        PlacementApplication.student_id == current_user.id,
        PlacementApplication.drive_id == drive_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this drive")

    application = PlacementApplication(
        student_id=current_user.id,
        drive_id=drive_id,
    )
    db.add(application)
    db.commit()

    return {"message": f"Applied to {drive.company_name}"}


@router.put("/applications/{application_id}")
def update_application(
    application_id: str,
    new_status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN])),
):
    """Update a placement application status. Admin only."""
    app = db.query(PlacementApplication).filter(PlacementApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    try:
        app.status = ApplicationStatus(new_status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status: {new_status}")

    db.commit()
    return {"message": f"Application status updated to {new_status}"}


@router.get("/stats", response_model=List[PlacementStatsResponse])
def get_placement_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get historical placement statistics by year."""
    stats = db.query(PlacementStats).order_by(PlacementStats.year).all()
    return [
        PlacementStatsResponse(year=s.year, placed=s.placed, total=s.total, avg_lpa=s.avg_lpa)
        for s in stats
    ]
