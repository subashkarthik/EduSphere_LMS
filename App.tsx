
import React, { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AIAssistant from './components/AIAssistant';
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { FullPageLoader } from './components/LoadingSkeleton';
import { UserRole, UserProfile } from './types';
import { LayoutDashboard, Calendar, Users, Menu, Lock, LogIn, AlertCircle, Loader2, Sparkles, Activity } from 'lucide-react';
import { ROLE_THEMES } from './constants';
import { authApi, setTokens, clearTokens, getAccessToken } from './services/api';

// Lazy-loaded views for code-splitting
const Dashboard = lazy(() => import('./views/Dashboard'));
const AttendanceModule = lazy(() => import('./views/AttendanceModule'));
const SubjectsModule = lazy(() => import('./views/SubjectsModule'));
const ExamsModule = lazy(() => import('./views/ExamsModule'));
const TimetableView = lazy(() => import('./views/TimetableView'));
const AnnouncementsView = lazy(() => import('./views/AnnouncementsView'));
const LibraryView = lazy(() => import('./views/LibraryView'));
const LearningJourney = lazy(() => import('./views/LearningJourney'));

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.STUDENT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('alex.j@universe.edu.in');
  const [loginPassword, setLoginPassword] = useState('student123');
  
  const [user, setUser] = useState<UserProfile>({
    id: '1',
    name: 'Alex Johnson',
    role: UserRole.STUDENT,
    email: 'alex.j@universe.edu.in',
    department: 'Computer Science',
    avatar: 'https://picsum.photos/seed/alex/200/200',
    enrollmentNo: 'UNI/2021/CS/042'
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  // Listen for navigation events from global search
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.tab) setActiveTab(detail.tab);
    };
    window.addEventListener('universe-navigate', handleNavigate);
    return () => window.removeEventListener('universe-navigate', handleNavigate);
  }, []);

  // Default to student prefill
  useEffect(() => {
    setLoginEmail('alex.j@universe.edu.in');
    setLoginPassword('student123');
  }, []);

  const handleLogin = async () => {
    if (loginLoading) return;
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await authApi.login(loginEmail, loginPassword);
      setTokens(response.access_token, response.refresh_token);
      
      // Map backend user to frontend UserProfile
      const backendUser = response.user;
      const mappedRole = (backendUser.role as keyof typeof UserRole) in UserRole 
        ? UserRole[backendUser.role as keyof typeof UserRole] 
        : UserRole.STUDENT;

      setUser({
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: mappedRole,
        department: backendUser.department || undefined,
        avatar: backendUser.avatar || `https://ui-avatars.com/api/?name=${backendUser.name.replace(' ', '+')}&background=1e3a8a&color=fff`,
        enrollmentNo: backendUser.enrollment_no || undefined,
        designation: backendUser.designation || undefined,
      });
      setCurrentRole(mappedRole);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      setLoginError(err.message || 'Authentication failed. Is the backend running?');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (getAccessToken()) {
        await authApi.logout();
      }
    } catch {
      // Logout even if API call fails
    }
    clearTokens();
    setIsLoggedIn(false);
    setActiveTab('dashboard');
    setLoginError('');
  };

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard role={currentRole} />;
        case 'journey':
          return <LearningJourney />;
        case 'attendance':
          return <AttendanceModule id="attendance" role={currentRole} />;
        case 'academics':
          return <SubjectsModule id="academics" role={currentRole} />;
        case 'exams':
          return <ExamsModule id="exams" role={currentRole} />;
        case 'timetable':
          return <TimetableView role={currentRole} />;
        case 'announcements':
          return <AnnouncementsView role={currentRole} />;
        case 'library':
          return <LibraryView role={currentRole} />;
        case 'settings':
          return (
            <div className="flex flex-col items-center justify-center p-10 md:p-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in duration-500">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-2xl md:text-3xl">⚙️</div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">System Preferences</h2>
              <p className="text-slate-500 mt-2 max-w-md font-medium text-sm md:text-base">Personalize your learning environment and notification settings.</p>
            </div>
          );
        default:
          return (
            <div className="flex flex-col items-center justify-center p-10 md:p-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in duration-500">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-2xl md:text-3xl">🏗️</div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">{activeTab} Console</h2>
              <p className="text-slate-500 mt-2 max-w-md font-medium text-sm md:text-base">This institutional module is currently performing a scheduled database re-indexing.</p>
            </div>
          );
      }
    })();

    return (
      <ErrorBoundary key={activeTab}>
        <Suspense fallback={<FullPageLoader />}>
          {content}
        </Suspense>
      </ErrorBoundary>
    );
  };

  if (showSplash) return <SplashScreen />;

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[160px]" />
        <div className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/20 ring-4 ring-white/5">
              <Lock size={28} className="text-white" />
            </div>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">EduSpere</h2>
            <p className="text-white/40 font-black text-[9px] uppercase tracking-[0.4em] mt-2">Learning Management System</p>
          </div>
          
          <div className="space-y-6">
            {loginError && (
              <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                <AlertCircle size={18} className="text-rose-400 shrink-0" />
                <p className="text-rose-300 text-xs font-bold">{loginError}</p>
              </div>
            )}

            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Student Email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm" 
              />
              <input 
                type="password" 
                placeholder="Access Key"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm" 
              />
            </div>

            <button 
              onClick={handleLogin}
              disabled={loginLoading}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 group"
            >
              {loginLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Verifying Credentials...</>
              ) : (
                <>Enter Portal <LogIn size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5">
            <p className="text-center text-[10px] text-white/40 font-bold leading-relaxed">
              "Access your courses, timetable, and academic records through our streamlined learning interface."
            </p>
          </div>
        </div>
      </div>
    );
  }

  const theme = ROLE_THEMES[currentRole];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] overflow-x-hidden selection:bg-indigo-100">
      <div className="flex w-full animate-in fade-in duration-1000">
        <Sidebar 
          currentRole={currentRole} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col lg:ml-64 w-full transition-all duration-300">
          <Header 
            user={user} 
            onOpenMenu={() => setIsSidebarOpen(true)}
          />
          
          <main className="flex-1 mt-16 p-4 md:p-10 max-w-[1600px] mx-auto w-full pb-24 lg:pb-10">
            {renderContent()}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 lg:hidden flex items-center justify-around px-2 py-3 z-[50] safe-bottom shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={20} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">Dash</span>
          </button>
          <button 
            onClick={() => setActiveTab('journey')} 
            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'journey' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Sparkles size={20} strokeWidth={activeTab === 'journey' ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">Journey</span>
          </button>
          <button 
            onClick={() => setActiveTab('attendance')} 
            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'attendance' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Activity size={20} strokeWidth={activeTab === 'attendance' ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">Data</span>
          </button>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className={`flex flex-col items-center gap-1 flex-1 text-slate-400`}
          >
            <Menu size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">System</span>
          </button>
        </nav>

        <AIAssistant role={currentRole} />
      </div>
    </div>
  );
};

export default App;
