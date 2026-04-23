import React, { useState } from 'react';
import { UserRole } from '../types';
import { ROLE_THEMES, MOCK_ATTENDANCE } from '../constants';
import { 
  Plus, Download, ArrowLeft, Filter, Search, 
  ChevronRight, AlertCircle, CheckCircle2, MoreHorizontal,
  BrainCircuit, TrendingDown, Info, LayoutList, History
} from 'lucide-react';
import { useApi } from '../hooks';
import { attendanceApi } from '../services/api';
import { FullPageLoader } from '../components/LoadingSkeleton';

interface ModuleProps {
  id: string;
  role: UserRole;
}

const AttendanceModule: React.FC<ModuleProps> = ({ role }) => {
  const theme = ROLE_THEMES[role];
  const isFaculty = role === UserRole.FACULTY;
  const [viewMode, setViewMode] = useState<'table' | 'history'>('table');
  const [isTakingAttendance, setIsTakingAttendance] = useState(false);

  const fallbackAttendance = MOCK_ATTENDANCE.map(a => ({
    course_code: a.courseCode, course_name: a.courseName, percentage: a.percentage,
    classes_held: a.classesHeld, classes_attended: a.classesAttended,
  }));

  const { data: attendance, loading } = useApi(
    () => attendanceApi.summary(),
    fallbackAttendance,
    [role]
  );

  if (loading) return <FullPageLoader />;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Module Header & Control Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              <LayoutList size={12} className="text-indigo-500" />
              Participation Records • Participation Intelligence
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Ledger</h1>
          </div>
          <div className="flex gap-2">
            {isFaculty && (
              <button onClick={() => setIsTakingAttendance(true)} className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                <Plus size={18}/> New Session
              </button>
            )}
            <button className="flex-1 md:flex-none bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
              <Download size={18}/> Export Report
            </button>
          </div>
        </div>

        {/* Dense Filter Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search by course or code..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" />
          </div>
          <div className="flex items-center gap-2">
             <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
               <Filter size={14} /> Filters
             </button>
             <button className="px-4 py-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl flex items-center gap-2 text-xs font-bold hover:bg-indigo-100 transition-all">
               Semester 6
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area: Data Table */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Academic Unit</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Participation Index</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Data Point</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(attendance || []).map((item: any, i: number) => {
                    const isLow = item.percentage < 75;
                    const isWarning = item.percentage >= 75 && item.percentage < 85;
                    return (
                      <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.course_name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">{item.course_code}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4 max-w-[200px]">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${isLow ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'} rounded-full transition-all duration-1000`} style={{width: `${item.percentage}%`}}></div>
                            </div>
                            <span className={`text-xs font-black w-10 ${isLow ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>{item.percentage}%</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{item.classes_attended} / {item.classes_held}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Sessions Tracked</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            isLow ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                            isWarning ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                            'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {isLow ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                            {isLow ? 'Critical' : isWarning ? 'Warning' : 'Stable'}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-slate-900 transition-all">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Displaying 6 Participation Units</span>
              <div className="flex items-center gap-4">
                <button className="hover:text-indigo-600 transition-colors">Previous</button>
                <div className="flex items-center gap-1">
                   <span className="px-2 py-1 bg-indigo-600 text-white rounded-md">1</span>
                </div>
                <button className="hover:text-indigo-600 transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="font-bold text-lg mb-6 tracking-tight flex items-center gap-3">
              <BrainCircuit className="text-indigo-400" size={20}/> 
              Predictive Analysis
            </h3>
            <div className="space-y-5">
              {(attendance || []).filter((a: any) => a.percentage < 80).map((item: any, i: number) => (
                <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase">{item.course_code}</span>
                    <span className="text-[10px] font-black text-rose-400 uppercase flex items-center gap-1"><TrendingDown size={10} /> Shortage Risk</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Shortage predicted in <span className="text-white font-bold">2 sessions</span>. Estimated drop to <span className="text-rose-400 font-black">72.4%</span>.
                  </p>
                  <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Resolve Pathway</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><History size={20}/></div>
               <h4 className="font-bold text-slate-900">Recent Logs</h4>
             </div>
             <div className="space-y-6">
               {[
                 { action: 'Session Marked', course: 'CS8701', time: '12:45 PM', status: 'Present' },
                 { action: 'Proxy Detected', course: 'CS8702', time: '10:15 AM', status: 'Flagged' },
                 { action: 'Session Closed', course: 'CS8711', time: 'Yesterday', status: 'Present' }
               ].map((log, i) => (
                 <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      <div className="w-[1px] flex-1 bg-slate-100 mt-2"></div>
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-800">{log.action}: {log.course}</h5>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{log.time} • {log.status}</p>
                    </div>
                 </div>
               ))}
             </div>
             <button className="mt-8 w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] transition-all">Audit Trail</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModule;
