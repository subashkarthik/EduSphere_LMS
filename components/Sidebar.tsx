
import React from 'react';
import { UserRole } from '../types';
import { NAVIGATION_ITEMS, ICON_MAP, ROLE_THEMES } from '../constants';
import { LogOut, ChevronRight, X } from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeTab, setActiveTab, onLogout, isOpen, onClose }) => {
  const filteredItems = NAVIGATION_ITEMS.filter(item => item.roles.includes(currentRole));
  const theme = ROLE_THEMES[currentRole] || ROLE_THEMES[UserRole.STUDENT];

  const categories = Array.from(new Set(filteredItems.map(item => item.category)));

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] lg:hidden transition-opacity" onClick={onClose} />
      )}

      <div className={`
        fixed left-0 top-0 h-full text-white flex flex-col z-[70] transition-transform duration-500 ease-in-out
        w-64 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${theme.bg} shadow-2xl
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size={42} />
            <div>
              <h1 className="font-black text-lg leading-tight tracking-tight">EduSphere</h1>
              <p className={`text-[9px] ${theme.accentText} font-black uppercase tracking-[0.2em]`}>LXP Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
            <X size={20} className="text-white/60" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          {categories.map(cat => (
            <div key={cat} className="space-y-1">
              <p className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">{cat}</p>
              {filteredItems.filter(i => i.category === cat).map((item) => {
                const Icon = ICON_MAP[item.icon];
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
                      isActive 
                        ? `${theme.primary} text-white shadow-xl shadow-black/20` 
                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-white/20 group-hover:text-white'} />
                    <span className="font-bold text-xs tracking-tight">{item.label}</span>
                    {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 safe-bottom">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-4 text-white/30 hover:bg-rose-500/20 hover:text-rose-400 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
