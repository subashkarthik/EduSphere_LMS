# EduSpere — Learning Management System

EduSpere is a high-performance, student-centric Learning Management System designed with an **iOS 26 Liquid Glass** design language. It focuses on delivering a streamlined academic experience through a modern, intuitive interface.

## 🚀 Key Features

- **Learning-Centric UI**: Stunning frosted-translucency design focused on courses, resources, and results.
- **Academic Core**: Full management of courses, study materials, and academic timetables.
- **Student Dashboard**: Real-time overview of attendance, GPA progress, and upcoming sessions.
- **Intelligent Assistant**: Integrated **Gemini AI** for academic doubt clearing and portal navigation.
- **Performance Optimized**: Built with React 19 and Vite for instant responsiveness.
- **Resilient Architecture**: Modular design with error-boundary protection for every module.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy, Pydantic.
- **Database**: 
  - **SQLite**: Authentication, Finance, System Logs, and Application State.
  - **MS Access**: Core Academic Data (Faculty, Timetable, Attendance, Subjects, Rooms).
- **AI**: Google Gemini Pro (via `@google/genai` and backend integration).

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- Python 3.10+
- Microsoft Access Database Engine (for `.accdb` connectivity)

### 2. Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
pip install -r requirements.txt
```

### 3. Configuration
Copy `server/.env.example` to `server/.env` and update the values:
- `ACCESS_DB_DIR`: The path to your MS Access database folder.
- `GEMINI_API_KEY`: Your Google AI Studio API key.

### 4. Running the Application

```bash
# Seed the application database (SQLite)
npm run db:seed

# Start the Backend (Port 5000)
npm run dev:backend

# Start the Frontend (Port 3000)
npm run dev
```

## 🧪 Testing
Run end-to-end API verification:
```bash
npm run db:test
```

## 📄 License
Internal Institutional Use Only.
© 2026 Universal University.
