from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from database import get_db
from models.user import User, UserRole
from models.academic import Course, Enrollment, CourseMaterial, EnrollmentStatus
from models.attendance import AttendanceSession, AttendanceLog, AttendanceStatus
from schemas.schemas import CourseCreate, CourseResponse, EnrollRequest, MaterialCreate, MaterialResponse
from middleware.auth import get_current_user, require_roles
from access_db import get_all_subjects, get_course_registrations, get_faculty_by_id

router = APIRouter(prefix="/api/courses", tags=["Courses"])


def _compute_progress(course: Course, db: Session) -> int:
    """Compute syllabus progress based on attendance sessions held vs estimated total (60)."""
    sessions_held = db.query(AttendanceSession).filter(AttendanceSession.course_id == course.id).count()
    estimated_total = 60  # Approximate sessions per semester
    return min(int((sessions_held / estimated_total) * 100), 100) if estimated_total > 0 else 0


@router.get("/")
def list_courses(
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List courses from MS Access Subject_Master + Course_Registration.
    Falls back to SQLite if Access is unavailable.
    """
    try:
        # Fetch from MS Access
        subjects = get_all_subjects()
        registrations = get_course_registrations()

        # Build registration lookup: SubjectID → student count
        reg_map = {}
        for reg in registrations:
            sid = reg.get("SubjectID")
            if sid:
                reg_map[sid] = reg.get("StudentCount", 0)

        result = []
        for subj in subjects:
            subject_id = subj.get("SubjectID", subj.get("ID"))
            faculty = None
            # Try to get faculty name from timetable linkage
            faculty_name = None

            result.append({
                "id": str(subject_id),
                "code": f"SUB-{subject_id}",
                "name": subj.get("SubjectName", f"Subject {subject_id}"),
                "credits": int(subj.get("HoursPerWeek", 3)),
                "department_id": subj.get("Department", ""),
                "faculty_id": None,
                "faculty_name": None,
                "semester": 7,
                "description": f"{subj.get('Department', '')} Department",
                "schedule": f"{subj.get('HoursPerWeek', 3)}h/week",
                "max_students": 120,
                "enrolled_count": int(reg_map.get(subject_id, 0)),
                "progress": min(int((reg_map.get(subject_id, 0) / 120) * 100), 100),
                "is_active": True,
                "is_lab": bool(subj.get("IsLab", False)),
            })
        return result[offset:offset + limit]

    except Exception as e:
        print(f"[Access] Courses fallback to SQLite: {e}")
        # Fallback to SQLite
        return _list_courses_sqlite(db, current_user, limit, offset)


def _list_courses_sqlite(db: Session, current_user: User, limit: int, offset: int):
    """Original SQLite-based course listing as fallback."""
    query = db.query(Course).filter(Course.is_active == True)
    
    if current_user.role == UserRole.STUDENT:
        # Join with enrollment to filter for student
        courses = query.join(Enrollment).filter(
            Enrollment.student_id == current_user.id,
            Enrollment.status == EnrollmentStatus.ACTIVE
        ).offset(offset).limit(limit).all()
    elif current_user.role == UserRole.FACULTY:
        courses = query.filter(Course.faculty_id == current_user.id).offset(offset).limit(limit).all()
    else:
        courses = query.offset(offset).limit(limit).all()

    result = []
    for c in courses:
        enrolled = db.query(Enrollment).filter(Enrollment.course_id == c.id, Enrollment.status == EnrollmentStatus.ACTIVE).count()
        result.append(CourseResponse(
            id=c.id, code=c.code, name=c.name, credits=c.credits,
            department_id=c.department_id, faculty_id=c.faculty_id,
            faculty_name=c.faculty.name if c.faculty else None,
            semester=c.semester, description=c.description,
            schedule=c.schedule, max_students=c.max_students,
            enrolled_count=enrolled, progress=_compute_progress(c, db),
            is_active=c.is_active,
        ))
    return result


@router.post("/", response_model=CourseResponse)
def create_course(
    request: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN, UserRole.FACULTY])),
):
    """Create a new course. Admin or Faculty only. Writes to SQLite."""
    existing = db.query(Course).filter(Course.code == request.code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Course code {request.code} already exists")

    course = Course(**request.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)

    return CourseResponse(
        id=course.id, code=course.code, name=course.name, credits=course.credits,
        department_id=course.department_id, faculty_id=course.faculty_id,
        faculty_name=course.faculty.name if course.faculty else None,
        semester=course.semester, description=course.description,
        schedule=course.schedule, max_students=course.max_students,
        enrolled_count=0, progress=0, is_active=course.is_active,
    )


@router.get("/{course_id}")
def get_course(course_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get course details by ID. Tries Access first, then SQLite."""
    try:
        from access_db import get_subject_by_id
        subject = get_subject_by_id(int(course_id))
        if subject:
            return {
                "id": str(course_id),
                "code": f"SUB-{course_id}",
                "name": subject.get("SubjectName", "Unknown"),
                "credits": int(subject.get("HoursPerWeek", 3)),
                "department_id": subject.get("Department", ""),
                "faculty_id": None,
                "faculty_name": None,
                "semester": 7,
                "description": f"{subject.get('Department', '')} Department",
                "schedule": f"{subject.get('HoursPerWeek', 3)}h/week",
                "max_students": 120,
                "enrolled_count": 0,
                "progress": 0,
                "is_active": True,
            }
    except Exception:
        pass

    # Fallback to SQLite
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    enrolled = db.query(Enrollment).filter(Enrollment.course_id == course.id, Enrollment.status == EnrollmentStatus.ACTIVE).count()
    return CourseResponse(
        id=course.id, code=course.code, name=course.name, credits=course.credits,
        department_id=course.department_id, faculty_id=course.faculty_id,
        faculty_name=course.faculty.name if course.faculty else None,
        semester=course.semester, description=course.description,
        schedule=course.schedule, max_students=course.max_students,
        enrolled_count=enrolled, progress=_compute_progress(course, db),
        is_active=course.is_active,
    )


@router.post("/{course_id}/enroll")
def enroll_students(
    course_id: str,
    request: EnrollRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN])),
):
    """Enroll students in a course. Admin only. Writes to SQLite."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    enrolled_count = 0
    for student_id in request.student_ids:
        student = db.query(User).filter(User.id == student_id, User.role == UserRole.STUDENT).first()
        if not student:
            continue
        existing = db.query(Enrollment).filter(
            Enrollment.student_id == student_id,
            Enrollment.course_id == course_id,
        ).first()
        if existing:
            continue
        enrollment = Enrollment(student_id=student_id, course_id=course_id)
        db.add(enrollment)
        enrolled_count += 1

    db.commit()
    return {"message": f"Enrolled {enrolled_count} students in {course.name}"}


@router.get("/{course_id}/materials", response_model=List[MaterialResponse])
def list_materials(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List course materials. From SQLite."""
    materials = db.query(CourseMaterial).filter(CourseMaterial.course_id == course_id).order_by(CourseMaterial.uploaded_at.desc()).all()
    return [
        MaterialResponse(
            id=m.id, title=m.title, file_type=m.file_type,
            file_url=m.file_url, file_size=m.file_size,
            uploaded_at=m.uploaded_at,
            uploaded_by_name=m.uploaded_by.name if m.uploaded_by else None,
        )
        for m in materials
    ]


@router.post("/{course_id}/materials", response_model=MaterialResponse)
def add_material(
    course_id: str,
    request: MaterialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.FACULTY, UserRole.ADMIN])),
):
    """Upload course material. Faculty or Admin only. Writes to SQLite."""
    material = CourseMaterial(
        course_id=course_id,
        uploaded_by_id=current_user.id,
        title=request.title,
        file_type=request.file_type,
        file_url=request.file_url,
        file_size=request.file_size,
    )
    db.add(material)
    db.commit()
    db.refresh(material)

    return MaterialResponse(
        id=material.id, title=material.title, file_type=material.file_type,
        file_url=material.file_url, file_size=material.file_size,
        uploaded_at=material.uploaded_at,
        uploaded_by_name=current_user.name,
    )
