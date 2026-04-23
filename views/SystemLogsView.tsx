
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ROLE_THEMES } from '../constants';
import { History, Shield, AlertTriangle, User, FileText, CreditCard, LogIn, Settings, Filter, Search } from 'lucide-react';

interface SystemLogsViewProps {
  role: UserRole;
}

const MOCK_LOGS = [
  { id: '1', action: 'User Login', entity_type: 'auth', user: 'Alex Johnson', details: 'Successful authentication from 192.168.1.42', timestamp: '2024-10-12T14:32:00', level: 'info' },
  { id: '2', action: 'Fee Payment Processed', entity_type: 'finance', user: 'Kevin Durant', details: 'Tuition Fee payment of ₹45,000 via UPI. TXN: UPI-2024-8821', timestamp: '2024-10-12T13:15:00', level: 'info' },
  { id: '3', action: 'Attendance Sync', entity_type: 'attendance', user: 'Dr. Arun Kumar', details: 'Closed session for CS8701 — 87 students marked', timestamp: '2024-10-12T11:45:00', level: 'info' },
  { id: '4', action: 'Failed Login Attempt', entity_type: 'security', user: 'unknown@test.com', details: 'Invalid credentials — IP: 203.45.67.89 (3rd attempt)', timestamp: '2024-10-12T10:22:00', level: 'warning' },
  { id: '5', action: 'Course Created', entity_type: 'academic', user: 'Institutional Admin', details: 'New course CS8705 "Blockchain Technology" added to CSE department', timestamp: '2024-10-11T16:00:00', level: 'info' },
  { id: '6', action: 'User Deactivated', entity_type: 'user', user: 'Institutional Admin', details: 'Deactivated account for expired_user@edusphere.edu.in', timestamp: '2024-10-11T14:30:00', level: 'warning' },
  { id: '7', action: 'Exam Results Published', entity_type: 'academic', user: 'Prof. S. Devi', details: 'Internal Exam I results published for CS8702 — 42 students', timestamp: '2024-10-11T12:00:00', level: 'info' },
  { id: '8', action: 'System Backup Completed', entity_type: 'system', user: 'System', details: 'Automated daily backup completed — 352MB archived', timestamp: '2024-10-11T03:00:00', level: 'info' },
  { id: '9', action: 'Placement Drive Created', entity_type: 'placement', user: 'Institutional Admin', details: 'Google SWE recruitment drive scheduled for Oct 12', timestamp: '2024-10-10T15:00:00', level: 'info' },
  { id: '10', action: 'Rate Limit Exceeded', entity_type: 'security', user: 'API Gateway', details: 'Rate limit hit from IP 103.21.58.200 — 500 req/min', timestamp: '2024-10-10T09:12:00', level: 'error' },
];

const typeIcons: Record<string, React.ElementType> = {
  auth: LogIn,
  finance: CreditCard,
  attendance: User,
  security: Shield,
  academic: FileText,
  user: User,
  system: Settings,
  placement: FileText,
};

const typeColors: Record<string, string> = {
  auth: 'bg-indigo-50 text-indigo-600',
  finance: 'bg-emerald-50 text-emerald-600',
  attendance: 'bg-violet-50 text-violet-600',
  security: 'bg-rose-50 text-rose-600',
  academic: 'bg-amber-50 text-amber-600',
  user: 'bg-sky-50 text-sky-600',
  system: 'bg-slate-100 text-slate-600',
  placement: 'bg-teal-50 text-teal-600',
};

const levelStyles: Record<string, string> = {
  info: 'bg-slate-50 text-slate-500',
  warning: 'bg-amber-50 text-amber-600',
  error: 'bg-rose-50 text-rose-600',
};

const SystemLogsView: React.FC<SystemLogsViewProps> = ({ role }) => {
  const theme = ROLE_THEMES[role] || ROLE_THEMES[UserRole.ADMIN];
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');

  if (role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
          <Shield className="text-rose-500" size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Access Restricted</h2>
        <p className="text-slate-500 mt-2 max-w-md font-medium text-sm">System logs are restricted to institutional administrators with elevated privileges.</p>
      </div>
    );
  }

  const types = ['all', ...Array.from(new Set(MOCK_LOGS.map(l => l.entity_type)))];

  const filtered = MOCK_LOGS.filter(log => {
    const matchesType = filterType === 'all' || log.entity_type === filterType;
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || 
                          log.details.toLowerCase().includes(search.toLowerCase()) ||
                          log.user.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const formatTime = (timestamp: string) => {
    try {
      const d = new Date(timestamp);
      return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Logs</h2>
          <p className="text-slate-500 text-sm font-medium">Immutable audit trail of all institutional operations.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-emerald-50 rounded-xl">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{MOCK_LOGS.length} Events</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-rose-100 transition-all font-medium shadow-sm"
          />
        </div>
        <div className="flex flex-wrap bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm gap-1">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterType === type ? `${theme.primary} text-white shadow-sm` : 'text-slate-400 hover:text-slate-600'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {filtered.map((log) => {
            const Icon = typeIcons[log.entity_type] || History;
            const iconColor = typeColors[log.entity_type] || 'bg-slate-100 text-slate-400';
            const levelClass = levelStyles[log.level] || levelStyles.info;
            return (
              <div key={log.id} className="px-6 md:px-8 py-5 flex items-start gap-5 hover:bg-slate-50/50 transition-colors group">
                <div className={`p-3 rounded-2xl ${iconColor} shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <h4 className="font-black text-sm text-slate-800 tracking-tight">{log.action}</h4>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest shrink-0">{formatTime(log.timestamp)}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{log.details}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{log.user}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${levelClass}`}>{log.level}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <History size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No logs match</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogsView;
