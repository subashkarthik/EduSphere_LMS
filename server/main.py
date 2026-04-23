"""
UniVerse LMS Backend — Student Learning Portal Application

UniVerse LMS — High-performance Student Learning Management System.

Run:
    uvicorn main:app --reload --port 5000
    
Seed Database:
    python -m utils.seed
"""
import sys
import os

# Ensure the server directory is in the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import settings
from database import engine, Base

# Import all models to register them with SQLAlchemy
from models import (
    User, Department, Course, Enrollment, TimetableEntry, CourseMaterial,
    AttendanceSession, AttendanceLog, ExamSchedule, ExamResult,
    FeeStructure, FeePayment, PlacementDrive, PlacementApplication, PlacementStats,
    Announcement, AuditLog, LeaveRequest, LibraryBook, BookIssue,
)

# Import routers
from routes.auth import router as auth_router
from routes.users import router as users_router
from routes.courses import router as courses_router
from routes.attendance import router as attendance_router
from routes.exams import router as exams_router
from routes.timetable import router as timetable_router
from routes.announcements import router as announcements_router
from routes.dashboard import router as dashboard_router
from routes.ai import router as ai_router
from routes.intelligence import router as intelligence_router

# Import middleware
from middleware.rate_limit import RateLimitMiddleware
from middleware.validation import InputValidationMiddleware, SecurityHeadersMiddleware
from middleware.logging import RequestLoggingMiddleware

# ─── LIFESPAN ───
@asynccontextmanager
async def lifespan(app):
    Base.metadata.create_all(bind=engine)
    print("[OK] UniVerse LMS API server started")
    print("[DOCS] API Docs: http://localhost:5000/api/docs")
    print("[DOCS] ReDoc: http://localhost:5000/api/redoc")
    yield


# ─── APPLICATION ───
app = FastAPI(
    title="EduSpere API",
    description="EduSpere — Student Learning Management System Portal",
    version="3.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# ─── GLOBAL EXCEPTION HANDLER ───
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch unhandled exceptions and return structured JSON error responses."""
    correlation_id = getattr(request.state, "correlation_id", "unknown")
    print(f"[ERROR] [{correlation_id}] Unhandled exception: {type(exc).__name__}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred.",
            "correlation_id": correlation_id,
            "type": type(exc).__name__,
        },
    )

# ─── MIDDLEWARE (order matters: last added = first executed) ───
# 1. CORS (outermost — must be first to handle preflight)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
    expose_headers=["X-Correlation-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
)

# 2. Security headers
app.add_middleware(SecurityHeadersMiddleware)

# 3. Rate limiting
app.add_middleware(RateLimitMiddleware, general_limit=100, auth_limit=10, window_seconds=60)

# 4. Request logging
app.add_middleware(RequestLoggingMiddleware)

# 5. Input validation / sanitization
# app.add_middleware(InputValidationMiddleware)

# ─── REGISTER ROUTERS ───
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(users_router)
app.include_router(courses_router)
app.include_router(attendance_router)
app.include_router(exams_router)
app.include_router(timetable_router)
app.include_router(announcements_router)
app.include_router(intelligence_router)
app.include_router(ai_router)


# ─── HEALTH CHECK ───
@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "platform": "UniVerse LMS",
        "version": "3.0.0",
    }


# ─── DB HEALTH CHECK ───
@app.get("/api/health/db", tags=["System"])
def db_health_check():
    """Test connectivity to all database backends (SQLite + MS Access)."""
    results = {"sqlite": "unknown", "access": "unknown"}

    # Test SQLite
    try:
        from database import SessionLocal
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        results["sqlite"] = "connected"
    except Exception as e:
        results["sqlite"] = f"error: {e}"

    # Test MS Access
    try:
        from access_db import check_access_health
        access_status = check_access_health()
        results["access"] = access_status
    except ImportError:
        results["access"] = "module not available"
    except Exception as e:
        results["access"] = f"error: {e}"

    overall = "healthy" if all(
        v in ("connected", "healthy") or "connected" in str(v)
        for v in results.values()
    ) else "degraded"

    return {
        "status": overall,
        "databases": results,
        "platform": "UniVerse LMS",
    }


# ─── ROOT ───
@app.get("/", tags=["System"])
def root():
    return {
        "message": "UniVerse LMS API",
        "description": "UniVerse LMS — Student Learning Management System",
        "docs": "/api/docs",
        "version": "3.0.0",
    }
