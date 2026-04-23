import React from 'react';
import { 
  LayoutDashboard, BookOpen, Calendar, GraduationCap, 
  Library, Bell, Settings, LogOut, X, ShieldCheck, 
  Sparkles, FileText, Activity, Layers, Menu
} from 'lucide-react';
import { UserRole } from '../types';
import Logo from './Logo';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentRole, activeTab, setActiveTab, onLogout, isOpen, onClose 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Intelligence Hub', icon: LayoutDashboard },
    { id: 'journey', label: 'My Journey', icon: Sparkles },
    { id: 'attendance', label: 'Participation', icon: Activity },
    { id: 'academics', label: 'Curriculum', icon: BookOpen },
    { id: 'exams', label: 'Assessments', icon: FileText },
    { id: 'timetable', label: 'Calendar', icon: Calendar },
    { id: 'library', label: 'Digital Assets', icon: Library },
  ];

  const adminItems = [
    { id: 'users', label: 'Faculty & Cohorts', icon: GraduationCap },
    { id: 'system', label: 'Infrastructure', icon: Layers },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white z-[70] transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col border-r border-white/5
      `}>
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <Logo />
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-xl">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-8 scrollbar-hide">
          <div className="space-y-1">
            <p className="px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Core Intelligence</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); onClose(); }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400 transition-colors'} />
                  <span className="text-xs font-bold tracking-tight">{item.label}</span>
                  {isActive && <div className="ml-auto w-1 h-4 bg-white/40 rounded-full"></div>}
                </button>
              );
            })}
          </div>

          {(currentRole === UserRole.ADMIN) && (
            <div className="space-y-1">
              <p className="px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Administrative</p>
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); onClose(); }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400 transition-colors'} />
                    <span className="text-xs font-bold tracking-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-950/50">
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => { setActiveTab('settings'); onClose(); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}
              `}
            >
              <Settings size={18} />
              <span className="text-xs font-bold tracking-tight">Preferences</span>
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
            >
              <LogOut size={18} />
              <span className="text-xs font-bold tracking-tight">Sign Out</span>
            </button>
          </div>
          
          <div className="mt-6 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Secure</span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium leading-tight">
              Access from: 192.168.1.42<br/>
              Last audit: 12m ago
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
