
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ROLE_THEMES } from '../constants';
import { Filter, ArrowLeft, ArrowRight, Download, Info, List, History } from 'lucide-react';
import { useApi } from '../hooks';
import { coursesApi } from '../services/api';
import { FullPageLoader } from '../components/LoadingSkeleton';

interface ModuleProps { id: string; role: UserRole; }

const SubjectsModule: React.FC<ModuleProps> = ({ role }) => {
  const theme = ROLE_THEMES[role];
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const fallbackCourses = [
    { id: '1', code: 'CS8701', name: 'Cloud Computing', credits: 4, enrolled_count: 87, progress: 85, faculty_name: 'Dr. Arun Kumar', schedule: 'Mon, Wed 09:00 AM' },
    { id: '2', code: 'CS8702', name: 'Cyber Security', credits: 3, enrolled_count: 42, progress: 62, faculty_name: 'Prof. S. Devi', schedule: 'Tue, Thu 11:30 AM' },
    { id: '3', code: 'CS8711', name: 'Cloud Computing Lab', credits: 2, enrolled_count: 44, progress: 100, faculty_name: 'Dr. Arun Kumar', schedule: 'Fri 02:00 PM' },
  ];
  const { data: courses, loading } = useApi(() => coursesApi.list(), fallbackCourses, [role]);
  const { data: materials } = useApi(() => selectedCourse ? coursesApi.materials(selectedCourse.id) : Promise.resolve([]), [], [selectedCourse?.id]);
  if (loading) return <FullPageLoader />;

  if (selectedCourse) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-6">
          <div className="flex items-center gap-5 w-full sm:w-auto">
            <button onClick={() => setSelectedCourse(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0"><ArrowLeft size={24}/></button>
            <div><h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedCourse.name}</h2><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{selectedCourse.code} • {selectedCourse.faculty_name || 'TBA'}</p></div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className={`${theme.primary} text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/10 active:scale-95 flex-1 sm:flex-none`}>Launch Live Session</button>
            <button className="bg-slate-50 text-slate-400 p-3 rounded-2xl hover:bg-slate-100 transition-colors"><Info size={20}/></button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-3"><List size={18} className="text-indigo-600"/> Study Materials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(materials && materials.length > 0 ? materials : [
                  { title: 'Unit 1: Virtualization Essentials', uploaded_at: '2024-10-02', file_type: 'PDF' },
                  { title: 'Cloud Service Models (PPT)', uploaded_at: '2024-10-05', file_type: 'PPT' },
                  { title: 'Lab Manual - Week 4', uploaded_at: '2024-10-10', file_type: 'DOC' },
                  { title: 'Unit 2: Resource Allocation', uploaded_at: '2024-10-12', file_type: 'PDF' }
                ]).map((m: any, i: number) => (
                  <div key={i} className="p-5 rounded-3xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xs group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-colors">{m.file_type}</div>
                    <div className="flex-1"><p className="text-sm font-bold text-slate-700">{m.title}</p><p className="text-[9px] text-slate-400 font-black uppercase mt-0.5">{typeof m.uploaded_at === 'string' ? m.uploaded_at.slice(0, 10) : ''}</p></div>
                    <Download size={16} className="text-slate-300"/>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-3"><History size={18} className="text-indigo-600"/> Attendance History</h3>
              <div className="space-y-3">
                {[{ date: '12 Oct 2024', status: 'Present', time: '09:05 AM' },{ date: '10 Oct 2024', status: 'Present', time: '09:02 AM' },{ date: '08 Oct 2024', status: 'Absent', time: '-' },{ date: '05 Oct 2024', status: 'Present', time: '09:10 AM' }].map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50">
                    <div className="flex items-center gap-4"><div className={`w-2 h-2 rounded-full ${h.status === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div><div><p className="text-xs font-black text-slate-700">{h.date}</p><p className="text-[9px] text-slate-400 font-bold uppercase">{h.time !== '-' ? `Logged at ${h.time}` : 'No Log Data'}</p></div></div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${h.status === 'Present' ? 'text-emerald-600' : 'text-rose-600'}`}>{h.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
              <h3 className="font-black text-xl mb-6 tracking-tight">Performance</h3>
              <div className="space-y-8">
                <div><div className="flex justify-between items-end mb-3"><span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Attendance</span><span className="text-2xl font-black text-emerald-400">92%</span></div><div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width: '92%'}}></div></div></div>
                <div><div className="flex justify-between items-end mb-3"><span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Course Progress</span><span className="text-2xl font-black text-indigo-400">{selectedCourse.progress}%</span></div><div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{width: `${selectedCourse.progress}%`}}></div></div></div>
              </div>
            </div>
            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
               <h4 className="font-black text-slate-800 text-sm mb-2">Need Academic Help?</h4>
               <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">Connect with {selectedCourse.faculty_name || 'your faculty'} or use our AI Assistant for doubt clearing.</p>
               <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95">Message Counselor</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-1">
        <div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Academic Curriculum</h2><p className="text-slate-500 text-sm font-medium">Your authorized institutional workload and resources.</p></div>
        <div className="flex gap-2 w-full sm:w-auto">
          {role === UserRole.ADMIN && <button className="flex-1 sm:flex-none bg-rose-800 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-900/10 active:scale-95">Enroll Module</button>}
          {role === UserRole.FACULTY && <button className="flex-1 sm:flex-none bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95">Add Course</button>}
          <button className="flex-1 sm:flex-none bg-white border border-slate-200 p-3 rounded-2xl"><Filter size={20}/></button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {(courses || []).map((c: any) => (
          <div key={c.id || c.code} onClick={() => setSelectedCourse(c)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group active:scale-[0.98] transition-all cursor-pointer hover:shadow-2xl hover:border-indigo-100">
            <div className="flex justify-between items-start mb-10">
              <div className={`w-14 h-14 rounded-2xl ${theme.light} ${theme.text} flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform`}>{c.code.slice(-2)}</div>
              <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credits</p><p className="text-sm font-black text-slate-900 mt-1">{c.credits}</p></div>
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">{c.name}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-10">{c.code} • {c.faculty_name || 'TBA'}</p>
            <div className="flex flex-wrap gap-2 mb-8">
               {(c.code === 'CS8701' ? ['AWS', 'Docker', 'Cloud'] : c.code === 'CS8702' ? ['Network Security', 'Hacking'] : ['UI/UX', 'React', 'Mobile']).map((skill: string) => (
                 <span key={skill} className="px-2 py-1 bg-slate-50 text-slate-400 text-[8px] font-black uppercase rounded-md border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                   {skill}
                 </span>
               ))}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"><span className="text-slate-400">Completion</span><span className={theme.text}>{c.progress}%</span></div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${theme.primary} transition-all duration-1000 shadow-[0_0_12px_rgba(79,70,229,0.3)]`} style={{width: `${c.progress}%`}}></div></div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{c.schedule || 'Schedule TBA'}</span>
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all"><ArrowRight size={14}/></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SubjectsModule;
