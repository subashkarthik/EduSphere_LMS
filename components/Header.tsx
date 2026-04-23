import React from 'react';
import { Search, Bell, HelpCircle, ShieldCheck, Clock, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  onOpenMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onOpenMenu }) => {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-40 px-4 md:px-8 flex items-center justify-between transition-all duration-300">
      {/* Search & System Status */}
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onOpenMenu}
          className="lg:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-all"
        >
          <div className="w-5 h-0.5 bg-slate-900 mb-1.5 rounded-full"></div>
          <div className="w-5 h-0.5 bg-slate-900 mb-1.5 rounded-full"></div>
          <div className="w-5 h-0.5 bg-slate-900 rounded-full"></div>
        </button>

        <div className="hidden md:flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Healthy</span>
          </div>
          <div className="w-[1px] h-4 bg-slate-200"></div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
            <Clock size={14} />
            <span>S6 • CSE</span>
          </div>
        </div>

        <div className="relative max-w-md w-full hidden md:block ml-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Global search (Cmd + K)..." 
            className="w-full bg-slate-100/50 border border-transparent focus:bg-white focus:border-indigo-500/20 rounded-xl pl-10 pr-4 py-2 text-sm font-medium transition-all outline-none"
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1">
          <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all hidden sm:block">
            <HelpCircle size={20} />
          </button>
        </div>

        <div className="w-[1px] h-6 bg-slate-200 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1">{user.name}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
          </div>
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-500/20 transition-all shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
