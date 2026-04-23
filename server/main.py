"""
EduSphere Backend — FastAPI Application Entry Point

A Multi-Tenant, AI-Ready Learning Experience Platform (LXP) for Institutions.

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
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
from routes.finance import router as finance_router
from routes.placements import router as placements_router
from routes.timetable import router as timetable_router
from routes.announcements import router as announcements_router
from routes.dashboard import router as dashboard_router
from routes.ai import router as ai_router

# ─── LIFESPAN ───
@asynccontextmanager
async def lifespan(app):
    Base.metadata.create_all(bind=engine)
    print("[OK] EduSphere API server started")
    print("[DOCS] API Docs: http://localhost:5000/api/docs")
    print("[DOCS] ReDoc: http://localhost:5000/api/redoc")
    yield


# ─── APPLICATION ───
app = FastAPI(
    title="EduSphere LXP API",
    description="A Multi-Tenant, AI-Ready Learning Experience Platform (LXP) for Institutions",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# ─── CORS ───
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── REGISTER ROUTERS ───
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(users_router)
app.include_router(courses_router)
app.include_router(attendance_router)
app.include_router(exams_router)
app.include_router(finance_router)
app.include_router(placements_router)
app.include_router(timetable_router)
app.include_router(announcements_router)
app.include_router(ai_router)





# ─── HEALTH CHECK ───
@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "platform": "EduSphere LXP",
        "version": "1.0.0",
    }


# ─── ROOT ───
@app.get("/", tags=["System"])
def root():
    return {
        "message": "EduSphere LXP API",
        "description": "A Multi-Tenant, AI-Ready Learning Experience Platform for Institutions",
        "docs": "/api/docs",
    }
