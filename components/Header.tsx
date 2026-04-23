
import React from 'react';
import { Bell, Search, Menu, Shield } from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { ROLE_THEMES } from '../constants';

interface HeaderProps {
  user: UserProfile;
  onOpenMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onOpenMenu }) => {
  const theme = ROLE_THEMES[user.role] || ROLE_THEMES[UserRole.STUDENT];

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-0 lg:left-64 z-40 px-4 md:px-8 flex items-center justify-between safe-top">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onOpenMenu}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="relative w-full max-w-xs md:max-w-md hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Search..." 
            className={`w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-slate-300 rounded-xl text-sm transition-all`}
          />
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
