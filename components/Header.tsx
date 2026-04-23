
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, Shield, X } from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { ROLE_THEMES } from '../constants';

interface HeaderProps {
  user: UserProfile;
  onOpenMenu: () => void;
  onNavigate?: (tab: string) => void;
}

// All searchable navigation targets
const SEARCH_ITEMS = [
  { label: 'Dashboard', tab: 'dashboard', keywords: ['home', 'overview', 'hub', 'console'] },
  { label: 'My Courses', tab: 'academics', keywords: ['courses', 'subjects', 'curriculum', 'academics', 'modules'] },
  { label: 'Class Schedule', tab: 'timetable', keywords: ['timetable', 'schedule', 'class', 'calendar', 'slots'] },
  { label: 'Attendance', tab: 'attendance', keywords: ['attendance', 'present', 'absent', 'percentage', 'ledger'] },
  { label: 'Results & GPA', tab: 'exams', keywords: ['exams', 'results', 'grades', 'transcript', 'gpa', 'sgpa'] },
  { label: 'Digital Library', tab: 'library', keywords: ['library', 'books', 'reading', 'borrow', 'catalog'] },
  { label: 'Notice Board', tab: 'announcements', keywords: ['announcements', 'notices', 'news', 'bulletin'] },
  { label: 'Preferences', tab: 'settings', keywords: ['settings', 'preferences', 'profile', 'config'] },
];

const Header: React.FC<HeaderProps> = ({ user, onOpenMenu, onNavigate }) => {
  const theme = ROLE_THEMES[user.role] || ROLE_THEMES[UserRole.STUDENT];
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredResults = searchQuery.trim()
    ? SEARCH_ITEMS.filter(item => {
        const q = searchQuery.toLowerCase();
        return item.label.toLowerCase().includes(q) || 
               item.keywords.some(kw => kw.includes(q));
      })
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (tab: string) => {
    setSearchQuery('');
    setShowResults(false);
    // Dispatch custom event for navigation (App.tsx listens)
    window.dispatchEvent(new CustomEvent('universe-navigate', { detail: { tab } }));
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-0 lg:left-64 z-40 px-4 md:px-8 flex items-center justify-between safe-top">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onOpenMenu}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
        >
          <Menu size={24} />
        </button>

        <div ref={searchRef} className="relative w-full max-w-xs md:max-w-md hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Search modules..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
            onFocus={() => searchQuery && setShowResults(true)}
            className={`w-full pl-10 pr-10 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-slate-300 rounded-xl text-sm transition-all`}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setShowResults(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showResults && filteredResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {filteredResults.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => handleSelect(item.tab)}
                  className="w-full px-5 py-3.5 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0"
                >
                  <div className={`w-8 h-8 rounded-xl ${theme.light} ${theme.text} flex items-center justify-center text-[10px] font-black`}>
                    {item.label[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Navigate to {item.label}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showResults && searchQuery && filteredResults.length === 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 z-50 text-center">
              <p className="text-sm text-slate-400 font-medium">No modules matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6 ml-2">
        {/* Role Badge */}
        <div className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 ${theme.light} rounded-lg border ${theme.border} transition-colors duration-500`}>
          <Shield size={14} className={`${theme.text} hidden xs:block`} />
          <span className={`text-[10px] md:text-xs font-black ${theme.text} uppercase tracking-tighter`}>{user.role}</span>
        </div>

        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors hidden xs:flex">
          <Bell size={20} />
          <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full border-2 border-white ${theme.accent.replace('bg-', 'bg-')}`}></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs md:text-sm font-bold text-slate-900 leading-none">{user.name}</p>
            <p className={`text-[9px] font-black ${theme.text} uppercase tracking-widest mt-1`}>{user.role}</p>
          </div>
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ${theme.border} shrink-0`}>
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
