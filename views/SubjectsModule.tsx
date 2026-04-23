import React, { useState } from 'react';
import { UserRole } from '../types';
import { ROLE_THEMES } from '../constants';
import { 
  Filter, ArrowLeft, ArrowRight, Download, Info, 
  List, History, LayoutGrid, Search, BookOpen,
  CheckCircle2, Clock, BarChart2, ShieldCheck, MoreVertical
} from 'lucide-react';
import { useApi } from '../hooks';
import { coursesApi } from '../services/api';
import { FullPageLoader } from '../components/LoadingSkeleton';

interface ModuleProps { id: string; role: UserRole; }

const SubjectsModule: React.FC<ModuleProps> = ({ role }) => {
  const theme = ROLE_THEMES[role];
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
  const fallbackCourses = [
    { id: '1', code: 'CS8701', name: 'Cloud Computing Architecture', credits: 4, enrolled_count: 87, progress: 85, faculty_name: 'Dr. Arun Kumar', schedule: 'Mon, Wed 09:00 AM', category: 'Core Academic' },
    { id: '2', code: 'CS8702', name: 'Information & Cyber Security', credits: 3, enrolled_count: 42, progress: 62, faculty_name: 'Prof. S. Devi', schedule: 'Tue, Thu 11:30 AM', category: 'Security Elective' },
    { id: '3', code: 'CS8711', name: 'Distributed Systems Laboratory', credits: 2, enrolled_count: 44, progress: 100, faculty_name: 'Dr. Arun Kumar', schedule: 'Fri 02:00 PM', category: 'Lab Practical' },
  ];

  const { data: courses, loading } = useApi(() => coursesApi.list(), fallbackCourses, [role]);
  const { data: materials } = useApi(() => selectedCourse ? coursesApi.materials(selectedCourse.id) : Promise.resolve([]), [], [selectedCourse?.id]);

  if (loading) return <FullPageLoader />;

  if (selectedCourse) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-6">
          <div className="flex items-center gap-5 w-full sm:w-auto">
            <button onClick={() => setSelectedCourse(null)} className="p-2.5 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shrink-0"><ArrowLeft size={20}/></button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">{selectedCourse.code}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section A</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{selectedCourse.name}</h2>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">Launch Digital Classroom</button>
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all"><MoreVertical size={20}/></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-3"><BookOpen size={20} className="text-indigo-600"/> Resource Library</h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-400"><List size={16}/></button>
                  <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm"><LayoutGrid size={16}/></button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(materials && materials.length > 0 ? materials : [
                  { title: 'Unit 1: Virtualization & Cloud Essentials', date: 'Oct 12', type: 'PDF', size: '2.4MB' },
                  { title: 'Advanced Service Models (PPTX)', date: 'Oct 15', type: 'PPT', size: '5.1MB' },
                  { title: 'Distributed Systems Lab Guide', date: 'Oct 20', type: 'DOC', size: '1.2MB' },
                  { title: 'Unit 2: Resource Orchestration', date: 'Oct 22', type: 'PDF', size: '3.8MB' }
                ]).map((m: any, i: number) => (
                  <div key={i} className="p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-[10px] group-hover:text-indigo-600 transition-colors shadow-sm">{m.type}</div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 truncate">{m.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{m.date} • {m.size || 'N/A'}</p>
                    </div>
                    <Download size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors"/>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 mb-8 flex items-center gap-3"><History size={20} className="text-indigo-600"/> Historical Compliance</h3>
              <div className="overflow-hidden border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <tr><th className="px-6 py-4">Session Date</th><th className="px-6 py-4">Timing</th><th className="px-6 py-4 text-right">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[{ date: 'Oct 12, 2024', status: 'Present', time: '09:05 AM' },{ date: 'Oct 10, 2024', status: 'Present', time: '09:02 AM' },{ date: 'Oct 08, 2024', status: 'Absent', time: '-' }].map((h, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">{h.date}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{h.time !== '-' ? h.time : 'Session Missed'}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${h.status === 'Present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{h.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h3 className="font-bold text-lg mb-8 tracking-tight">Academic Index</h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-white/40 tracking-widest">
                    <span>Attendance Rate</span>
                    <span className="text-emerald-400">92.4%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width: '92%'}}></div></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-white/40 tracking-widest">
                    <span>Syllabus Completion</span>
                    <span className="text-indigo-400">{selectedCourse.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{width: `${selectedCourse.progress}%`}}></div></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><CheckCircle2 size={20}/></div>
                 <h4 className="font-bold text-slate-900 text-sm">Course Faculty</h4>
               </div>
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">AK</div>
                 <div>
                   <p className="text-sm font-black text-slate-800">{selectedCourse.faculty_name || 'TBA'}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Senior Professor</p>
                 </div>
               </div>
               <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/10">Request Consultation</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-1">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            <BarChart2 size={12} className="text-indigo-500" />
            Curriculum Registry • Semester 6
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academic Curriculum</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            <button onClick={() => setViewType('grid')} className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}><LayoutGrid size={18}/></button>
            <button onClick={() => setViewType('list')} className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}><List size={18}/></button>
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 shadow-sm"><Search size={20}/></button>
        </div>
      </div>

      <div className={viewType === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {(courses || []).map((c: any) => (
          <div key={c.id || c.code} onClick={() => setSelectedCourse(c)} className={`bg-white border border-slate-200 shadow-sm transition-all cursor-pointer group hover:shadow-xl hover:border-indigo-300 ${viewType === 'grid' ? 'p-8 rounded-[2.5rem]' : 'p-5 rounded-2xl flex items-center gap-8'}`}>
            <div className={`shrink-0 flex items-center justify-center font-black text-[11px] shadow-sm group-hover:scale-105 transition-transform ${viewType === 'grid' ? 'w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-8' : 'w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600'}`}>{c.code.slice(-2)}</div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{c.code} • {c.category || 'Academic'}</p>
                </div>
                {viewType === 'grid' && (
                   <div className="text-right">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Credits</p>
                     <p className="text-xs font-black text-slate-900">{c.credits}</p>
                   </div>
                )}
              </div>

              {viewType === 'grid' && (
                <div className="flex flex-wrap gap-1.5 my-6">
                  {(c.code === 'CS8701' ? ['AWS', 'Docker', 'Kubernetes'] : c.code === 'CS8702' ? ['Network Security', 'Cryptography'] : ['React', 'Node.js', 'Distributed Systems']).map((skill: string) => (
                    <span key={skill} className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[8px] font-black uppercase rounded border border-slate-100 group-hover:text-indigo-600 transition-colors">{skill}</span>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                  <span>Track Progress</span>
                  <span className="text-indigo-600">{c.progress}%</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-1000" style={{width: `${c.progress}%`}}></div></div>
              </div>
            </div>

            {viewType === 'list' && (
               <div className="flex items-center gap-10">
                 <div className="text-center min-w-[60px]">
                   <p className="text-[9px] font-black text-slate-300 uppercase">Credits</p>
                   <p className="text-xs font-black text-slate-900">{c.credits}</p>
                 </div>
                 <div className="p-3 rounded-xl bg-slate-50 text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all"><ArrowRight size={16}/></div>
               </div>
            )}

            {viewType === 'grid' && (
               <div className="mt-8 pt-5 border-t border-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                   <Clock size={12} className="text-indigo-500" />
                   {c.schedule || 'TBA'}
                 </div>
                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"><ArrowRight size={14}/></div>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default SubjectsModule;
