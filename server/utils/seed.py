"""
Database seeder -- populates the SQLite database with realistic demo data
that exactly matches the current frontend UI mock data for visual parity.

Run: python -m utils.seed
"""
import sys
import os
import uuid
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session

# Fix Windows console encoding for Unicode
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from database import engine, SessionLocal, Base
from models.user import User, UserRole, Department
from models.academic import Course, Enrollment, TimetableEntry, CourseMaterial, TimetableEntryType, EnrollmentStatus
from models.attendance import AttendanceSession, AttendanceLog, AttendanceStatus, SessionStatus
from models.exam import ExamSchedule, ExamResult, ExamType
from models.misc import Announcement, AuditLog, Priority, LibraryBook
from models.intelligence import LearningMetric, Recommendation, UserNotification
from utils.password import hash_password


def seed_database():
    """Drop all tables, recreate, and seed with demo data."""
    print("🗄️  Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("🏗️  Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        _seed_all(db)
        db.commit()
        print(" ✅ Database seeded successfully!")
        print("=" * 50)
        print("🔑 Student Credentials:")
        print("   Email:    alex.j@universe.edu.in")
        print("   Key:      student123")
        print("=" * 50)
    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


def _seed_all(db: Session):
    # ─── DEPARTMENTS ───
    dept_cse = Department(id="dept-cse", name="Computer Science", code="CSE")
    dept_mech = Department(id="dept-mech", name="Mechanical Engineering", code="MECH")
    dept_eee = Department(id="dept-eee", name="Electrical Engineering", code="EEE")
    db.add_all([dept_cse, dept_mech, dept_eee])
    db.flush()
    print("   ✓ Departments created")

    # ─── USERS ───
    admin = User(
        id="user-admin", email="admin@universe.edu.in",
        password_hash=hash_password("admin123"), name="Institutional Admin",
        role=UserRole.ADMIN, department_id="dept-cse",
        avatar="https://picsum.photos/seed/admin/200/200",
    )
    faculty_arun = User(
        id="user-arun", email="arun.kumar@universe.edu.in",
        password_hash=hash_password("faculty123"), name="Dr. Arun Kumar",
        role=UserRole.FACULTY, department_id="dept-cse", designation="HoD",
        avatar="https://picsum.photos/seed/arun/200/200",
    )
    faculty_devi = User(
        id="user-devi", email="s.devi@universe.edu.in",
        password_hash=hash_password("faculty123"), name="Prof. S. Devi",
        role=UserRole.FACULTY, department_id="dept-cse", designation="Associate Professor",
        avatar="https://picsum.photos/seed/devi/200/200",
    )
    faculty_raj = User(
        id="user-raj", email="p.raj@universe.edu.in",
        password_hash=hash_password("faculty123"), name="Dr. P. Raj",
        role=UserRole.FACULTY, department_id="dept-mech", designation="Professor",
        avatar="https://picsum.photos/seed/raj/200/200",
    )
    faculty_priya = User(
        id="user-priya", email="k.priya@universe.edu.in",
        password_hash=hash_password("faculty123"), name="Mrs. K. Priya",
        role=UserRole.FACULTY, department_id="dept-cse", designation="Assistant Professor",
        avatar="https://picsum.photos/seed/priya/200/200",
    )
    student_alex = User(
        id="user-alex", email="alex.j@universe.edu.in",
        password_hash=hash_password("student123"), name="Alex Johnson",
        role=UserRole.STUDENT, department_id="dept-cse",
        enrollment_no="UNI/2021/CS/042",
        avatar="https://picsum.photos/seed/alex/200/200",
    )
    student_sarah = User(
        id="user-sarah", email="sarah.m@universe.edu.in",
        password_hash=hash_password("student123"), name="Sarah Miller",
        role=UserRole.STUDENT, department_id="dept-mech",
        enrollment_no="UNI/2021/ME/102",
        avatar="https://picsum.photos/seed/sarah/200/200",
    )
    student_kevin = User(
        id="user-kevin", email="kevin.d@universe.edu.in",
        password_hash=hash_password("student123"), name="Kevin Durant",
        role=UserRole.STUDENT, department_id="dept-eee",
        enrollment_no="UNI/2021/EE/088",
        avatar="https://picsum.photos/seed/kevin/200/200",
    )
    student_bella = User(
        id="user-bella", email="bella.t@universe.edu.in",
        password_hash=hash_password("student123"), name="Bella Thorne",
        role=UserRole.STUDENT, department_id="dept-cse",
        enrollment_no="UNI/2021/CS/043",
        avatar="https://picsum.photos/seed/bella/200/200",
    )
    student_charlie = User(
        id="user-charlie", email="charlie.d@universe.edu.in",
        password_hash=hash_password("student123"), name="Charlie Dave",
        role=UserRole.STUDENT, department_id="dept-cse",
        enrollment_no="UNI/2021/CS/044",
        avatar="https://picsum.photos/seed/charlie/200/200",
    )
    student_diana = User(
        id="user-diana", email="diana.p@universe.edu.in",
        password_hash=hash_password("student123"), name="Diana Prince",
        role=UserRole.STUDENT, department_id="dept-cse",
        enrollment_no="UNI/2021/CS/045",
        avatar="https://picsum.photos/seed/diana/200/200",
    )

    all_users = [admin, faculty_arun, faculty_devi, faculty_raj, faculty_priya,
                 student_alex, student_sarah, student_kevin, student_bella, student_charlie, student_diana]
    db.add_all(all_users)
    db.flush()
    print("   ✓ Users created (3 faculty, 6 students, 1 admin)")

    # Set department heads
    dept_cse.head_id = "user-arun"

    # ─── COURSES (matching MOCK_ATTENDANCE + MOCK_TIMETABLE) ───
    courses_data = [
        ("crs-cc", "CS8701", "Cloud Computing", 4, "dept-cse", "user-arun", "Mon, Wed 09:00 AM"),
        ("crs-cs", "CS8702", "Cyber Security", 3, "dept-cse", "user-devi", "Tue, Thu 11:30 AM"),
        ("crs-mad", "CS8703", "Mobile App Development", 3, "dept-cse", "user-priya", "Wed, Fri 10:00 AM"),
        ("crs-ml", "CS8704", "Machine Learning", 4, "dept-cse", "user-raj", "Mon, Thu 02:00 PM"),
        ("crs-ccl", "CS8711", "Cloud Computing Lab", 2, "dept-cse", "user-arun", "Fri 02:00 PM"),
        ("crs-aa", "CS8705", "Advanced Algorithms", 4, "dept-cse", "user-arun", "Mon 09:00 AM"),
        ("crs-cn", "CS8706", "Computer Networks", 3, "dept-cse", "user-devi", "Mon 10:15 AM"),
        ("crs-osl", "CS8707", "Operating Systems Lab", 2, "dept-cse", "user-raj", "Tue 09:00 AM"),
        ("crs-we", "CS8708", "Web Engineering", 3, "dept-cse", "user-priya", "Wed 11:30 AM"),
    ]
    courses = {}
    for cid, code, name, credits, dept, fac, sched in courses_data:
        c = Course(id=cid, code=code, name=name, credits=credits, department_id=dept, faculty_id=fac, schedule=sched)
        courses[cid] = c
        db.add(c)
    db.flush()
    print("   ✓ Courses created (9 courses)")

    # ─── ENROLLMENTS ───
    cse_students = [student_alex, student_bella, student_charlie, student_diana]
    cse_course_ids = ["crs-cc", "crs-cs", "crs-mad", "crs-ml", "crs-ccl", "crs-aa", "crs-cn", "crs-osl", "crs-we"]

    enrollment_grades = {
        ("user-alex", "crs-cc"): ("A+", 9.0), ("user-alex", "crs-cs"): ("A", 8.0),
        ("user-alex", "crs-mad"): ("B+", 7.0), ("user-alex", "crs-ml"): ("S", 10.0),
    }

    for student in cse_students:
        for crs_id in cse_course_ids:
            key = (student.id, crs_id)
            grade, gpa = enrollment_grades.get(key, (None, None))
            e = Enrollment(
                student_id=student.id, course_id=crs_id,
                grade=grade, gpa_points=gpa,
                status=EnrollmentStatus.ACTIVE,
            )
            db.add(e)
    db.flush()
    print("   ✓ Enrollments created")

    # ─── ATTENDANCE (matching MOCK_ATTENDANCE percentages) ───
    attendance_config = {
        "crs-cc": (45, {  # 45 sessions
            "user-alex": 42, "user-bella": 40, "user-charlie": 38, "user-diana": 43,
        }),
        "crs-cs": (40, {
            "user-alex": 34, "user-bella": 36, "user-charlie": 30, "user-diana": 38,
        }),
        "crs-mad": (38, {
            "user-alex": 30, "user-bella": 32, "user-charlie": 28, "user-diana": 35,
        }),
        "crs-ml": (42, {
            "user-alex": 40, "user-bella": 38, "user-charlie": 35, "user-diana": 41,
        }),
    }

    base_date = date(2024, 7, 15)
    for crs_id, (total_sessions, student_attendance) in attendance_config.items():
        course = courses[crs_id]
        for i in range(total_sessions):
            session_date = base_date + timedelta(days=i * 2)
            session = AttendanceSession(
                course_id=crs_id,
                faculty_id=course.faculty_id,
                session_date=session_date,
                start_time="09:00",
                end_time="10:00",
                status=SessionStatus.CLOSED,
            )
            db.add(session)
            db.flush()

            for student_id, attended_count in student_attendance.items():
                is_present = i < attended_count
                log = AttendanceLog(
                    session_id=session.id,
                    student_id=student_id,
                    status=AttendanceStatus.PRESENT if is_present else AttendanceStatus.ABSENT,
                    marked_at=datetime(session_date.year, session_date.month, session_date.day, 9, 5),
                )
                db.add(log)

    db.flush()
    print("   ✓ Attendance sessions + logs created (165 sessions, ~660 logs)")

    # ─── TIMETABLE (matching MOCK_TIMETABLE) ───
    timetable_data = [
        ("crs-aa", "user-arun", "Monday", "09:00", "10:00", "LH-302", TimetableEntryType.LECTURE),
        ("crs-cn", "user-devi", "Monday", "10:15", "11:15", "Lab-1", TimetableEntryType.LAB),
        ("crs-osl", "user-raj", "Tuesday", "09:00", "11:00", "Lab-4", TimetableEntryType.LAB),
        ("crs-we", "user-priya", "Wednesday", "11:30", "12:30", "LH-101", TimetableEntryType.LECTURE),
        ("crs-cc", "user-arun", "Monday", "14:00", "15:00", "LH-302", TimetableEntryType.LECTURE),
        ("crs-ml", "user-raj", "Thursday", "14:00", "15:30", "LH-201", TimetableEntryType.LECTURE),
        ("crs-cs", "user-devi", "Tuesday", "11:30", "12:30", "LH-102", TimetableEntryType.LECTURE),
        ("crs-ccl", "user-arun", "Friday", "14:00", "16:00", "Lab-3", TimetableEntryType.LAB),
    ]
    for crs_id, fac_id, day, start, end, venue, etype in timetable_data:
        db.add(TimetableEntry(course_id=crs_id, faculty_id=fac_id, day_of_week=day, start_time=start, end_time=end, venue=venue, entry_type=etype))
    db.flush()
    print("   ✓ Timetable entries created")

    # ─── COURSE MATERIALS ───
    materials_data = [
        ("crs-cc", "user-arun", "Unit 1: Virtualization Essentials", "PDF", "2.4 MB"),
        ("crs-cc", "user-arun", "Cloud Service Models (PPT)", "PPT", "5.1 MB"),
        ("crs-cc", "user-arun", "Lab Manual - Week 4", "DOC", "1.2 MB"),
        ("crs-cc", "user-arun", "Unit 2: Resource Allocation", "PDF", "3.8 MB"),
        ("crs-ml", "user-raj", "Lecture 12: Neural Nets", "PDF", "2.4 MB"),
        ("crs-ml", "user-raj", "Lab Assignment 4", "DOC", "1.1 MB"),
    ]
    for crs_id, uploader, title, ftype, fsize in materials_data:
        db.add(CourseMaterial(course_id=crs_id, uploaded_by_id=uploader, title=title, file_type=ftype, file_size=fsize))
    db.flush()
    print("   ✓ Course materials created")

    # ─── EXAM SCHEDULES + RESULTS ───
    exam1 = ExamSchedule(id="exam-1", course_id="crs-cc", exam_type=ExamType.INTERNAL_1, title="Internal Exam I", exam_date=datetime(2024, 9, 15, 14, 0), max_marks=50, venue="Hall-A")
    exam2 = ExamSchedule(id="exam-2", course_id="crs-cc", exam_type=ExamType.INTERNAL_2, title="Internal Exam II", exam_date=datetime(2024, 10, 24, 14, 0), max_marks=50, venue="Hall-A")
    exam3 = ExamSchedule(id="exam-3", course_id="crs-ml", exam_type=ExamType.INTERNAL_1, title="ML Internal I", exam_date=datetime(2024, 9, 20, 10, 0), max_marks=50, venue="Hall-B")
    db.add_all([exam1, exam2, exam3])
    db.flush()

    # Get enrollment IDs for results
    alex_cc = db.query(Enrollment).filter(Enrollment.student_id == "user-alex", Enrollment.course_id == "crs-cc").first()
    alex_ml = db.query(Enrollment).filter(Enrollment.student_id == "user-alex", Enrollment.course_id == "crs-ml").first()
    if alex_cc:
        db.add(ExamResult(exam_id="exam-1", student_id="user-alex", enrollment_id=alex_cc.id, marks_obtained=45, grade="S", is_published=True))
    if alex_ml:
        db.add(ExamResult(exam_id="exam-3", student_id="user-alex", enrollment_id=alex_ml.id, marks_obtained=47, grade="S", is_published=True))
    db.flush()
    print("   ✓ Exam schedules + results created")

    # ─── ANNOUNCEMENTS ───
    db.add(Announcement(title="Welcome to EduSpere", content="Welcome to your new learning management portal! Access your courses and materials here.", author_id="user-admin", priority=Priority.HIGH, is_pinned=True))
    db.add(Announcement(title="Library New Arrivals", content="50 new reference books added to the Computer Science section. Check the library portal for availability.", author_id="user-arun", priority=Priority.MEDIUM))
    db.flush()
    print("   ✓ Announcements created")

    # ─── LIBRARY BOOKS ───
    books = [
        ("978-0132350884", "Clean Code", "Robert C. Martin", "Pearson", 5, 3, "Software Engineering"),
        ("978-0201633610", "Design Patterns", "GoF", "Addison-Wesley", 3, 2, "Software Engineering"),
        ("978-0596007126", "Head First Design Patterns", "Eric Freeman", "O'Reilly", 4, 4, "Software Engineering"),
        ("978-0131103627", "The C Programming Language", "Kernighan & Ritchie", "Prentice Hall", 6, 5, "Programming"),
    ]
    for isbn, title, author, pub, total, avail, cat in books:
        db.add(LibraryBook(isbn=isbn, title=title, author=author, publisher=pub, total_copies=total, available_copies=avail, category=cat))
    db.flush()
    print("   ✓ Library books created")


    # ─── INTELLIGENCE LAYER ───
    # Seed metrics for Alex
    db.add(LearningMetric(
        user_id="user-alex",
        overall_score=88.4,
        attendance_score=92.0,
        assessment_score=94.0,
        activity_score=85.0,
        risk_level="NORMAL",
        prediction_summary="Maintaining strong academic health. Predicted 8.5+ GPA if current trend continues."
    ))

    # Seed Recommendations for Alex
    db.add_all([
        Recommendation(
            user_id="user-alex",
            type="EXPLORE",
            priority="MEDIUM",
            title="Advanced Cloud Architectures",
            message="Your Cloud Computing score is exceptional. Consider exploring the AWS Certified Solutions Architect path.",
            link="/journey"
        ),
        Recommendation(
            user_id="user-alex",
            type="REVISE",
            priority="LOW",
            title="Network Security Refresher",
            message="Your last assessment in Cyber Security had minor gaps in RSA encryption. Revisiting Module 4 is recommended.",
            link="/academics"
        )
    ])

    # Seed Notifications for Alex
    db.add(UserNotification(
        user_id="user-alex",
        title="Intelligence Sync Complete",
        message="Your Learning Health Score has been updated based on the latest internal assessment.",
        type="SUCCESS"
    ))

    db.flush()
    print("   ✓ Intelligence Layer metrics + recommendations created")


if __name__ == "__main__":
    seed_database()
