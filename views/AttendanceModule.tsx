
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ROLE_THEMES, MOCK_ATTENDANCE } from '../constants';
import { Plus, Download, ArrowLeft } from 'lucide-react';
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
  const isAdmin = role === UserRole.ADMIN;
  const [isTakingAttendance, setIsTakingAttendance] = useState(false);

  const fallbackAttendance = MOCK_ATTENDANCE.map(a => ({
    course_code: a.courseCode, course_name: a.courseName, percentage: a.percentage,
    classes_held: a.classesHeld, classes_attended: a.classesAttended,
  }));

  const { data: attendance, loading, error, refetch } = useApi(
    () => attendanceApi.summary(),
    fallbackAttendance,
    [role]
  );

  const students = [
    { id: '21CS042', name: 'Alex Johnson', status: 'present' },
    { id: '21CS043', name: 'Bella Thorne', status: 'present' },
    { id: '21CS044', name: 'Charlie Dave', status: 'absent' },
    { id: '21CS045', name: 'Diana Prince', status: 'present' },
  ];

  if (isTakingAttendance && isFaculty) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-5 md:p-6 rounded-3xl md:rounded-[2rem] border border-slate-100 shadow-sm gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={() => setIsTakingAttendance(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors shrink-0"><ArrowLeft size={20}/></button>
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Live Session Logger</h2>
          </div>
          <button onClick={() => setIsTakingAttendance(false)} className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-3 md:py-2 rounded-2xl md:rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95">Sync with ERP</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {students.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden ring-4 ring-slate-50 group-hover:ring-emerald-500/20 transition-all"><img src={`https://i.pravatar.cc/150?u=${s.id}`} alt=""/></div>
              <div className="text-center">
                <p className="font-bold text-slate-800">{s.name}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{s.id}</p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button className="flex-1 py-4 md:py-2 rounded-2xl md:rounded-xl bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] active:bg-emerald-600 active:text-white transition-all">P</button>
                <button className="flex-1 py-4 md:py-2 rounded-2xl md:rounded-xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-[0.2em] active:bg-rose-600 active:text-white transition-all">A</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) return <FullPageLoader />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-6 sm:items-center">
        <div className="px-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Ledger</h2>
          <p className="text-slate-500 text-sm font-medium">Real-time institutional participation tracking.</p>
        </div>
        <div className="flex gap-2">
          {isFaculty && <button onClick={() => setIsTakingAttendance(true)} className={`flex-1 sm:flex-none ${theme.primary} text-white px-6 py-3.5 sm:py-2.5 rounded-2xl md:rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95`}><Plus size={18}/> New Session</button>}
          <button className="flex-1 sm:flex-none bg-white border border-slate-200 px-6 py-3.5 sm:py-2.5 rounded-2xl md:rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:bg-slate-50"><Download size={18}/> Export</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {(attendance || []).map((item: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{item.course_name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{item.course_code}</p>
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${item.percentage >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {item.percentage >= 75 ? 'Safe' : 'Critical'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Progress</span>
                    <span className={`text-sm font-black ${theme.text}`}>{item.percentage}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${item.percentage < 75 ? 'bg-rose-500' : theme.primary} rounded-full`} style={{width: `${item.percentage}%`}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Course / Batch</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Statistics</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(attendance || []).map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-800">{item.course_name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.course_code} • {item.classes_attended}/{item.classes_held} classes</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.percentage < 75 ? 'bg-rose-500' : theme.primary}`} style={{width: `${item.percentage}%`}}></div>
                        </div>
                        <span className="text-xs font-black text-slate-600">{item.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${item.percentage >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {item.percentage >= 75 ? 'Safe' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="font-black text-lg text-slate-900 mb-6 tracking-tight">AI Predictive Insights</h3>
            <div className="space-y-6">
              {(attendance || []).filter((a: any) => a.percentage < 80).map((item: any, i: number) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{item.course_code}</span>
                    <span className="text-[10px] font-black text-rose-600 uppercase">High Risk</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    If you miss <span className="text-rose-600 font-black">2 more classes</span>, your attendance will drop to <span className="font-black">72.4%</span>.
                  </p>
                </div>
              ))}
              {(!attendance || attendance.every((a: any) => a.percentage >= 80)) && (
                <div className="p-5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-center">
                   <p className="text-xs font-black uppercase">Trend: Stable</p>
                   <p className="text-[10px] font-medium mt-1">No risk of shortage detected for any course.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModule;
