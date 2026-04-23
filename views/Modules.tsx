
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ROLE_THEMES, MOCK_ATTENDANCE } from '../constants';
import { 
  Plus, Search, Download, Filter, MoreVertical, CheckCircle2, 
  Clock, AlertCircle, ChevronRight, UserPlus, CreditCard, 
  BookOpen, GraduationCap, Users, Save, FileSpreadsheet, 
  Mail, Phone, Briefcase, Activity, UserCheck, UserX, 
  ArrowLeft, ArrowRight, Building2, Terminal, PieChart, Info,
  FileText, List, History, ChevronDown, Trash2
} from 'lucide-react';
import { useApi } from '../hooks';
import { attendanceApi, coursesApi, examsApi, financeApi, placementsApi, usersApi } from '../services/api';
import { FullPageLoader } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

interface ModuleProps {
  id: string;
  role: UserRole;
}

// --- ATTENDANCE MODULE ---
export const AttendanceModule: React.FC<ModuleProps> = ({ role }) => {
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
          <div className={`${theme.bg} rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="font-black text-lg mb-6 tracking-tight">System Alerts</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-1 h-8 bg-amber-400 rounded-full"></div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Attendance Alert</p>
                  <p className="text-[10px] text-white/50 leading-relaxed mt-1">Shortage warning for Semester 7 Lab sessions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- EXAMS & RESULTS ---
export const ExamsModule: React.FC<ModuleProps> = ({ role }) => {
  const theme = ROLE_THEMES[role];
  const isStudent = role === UserRole.STUDENT;

  const { data: transcripts, loading } = useApi(
    () => isStudent ? examsApi.transcripts() : Promise.resolve([]),
    [
      { semester: 'Semester 7', courses: [
        { course_name: 'Theory of Computation', grade: 'A+', credits: 4 },
        { course_name: 'Microprocessors', grade: 'A', credits: 4 },
        { course_name: 'Data Structures', grade: 'S', credits: 4 }
      ], sgpa: 9.0 }
    ],
    [role]
  );

  const { data: schedules } = useApi(
    () => examsApi.schedules(),
    [],
    [role]
  );

  if (loading) return <FullPageLoader />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="px-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Academic Transcripts</h2>
          <p className="text-slate-500 text-sm font-medium">Semester-wise grading and evaluations.</p>
        </div>
        {isStudent && transcripts && transcripts.length > 0 && (
          <div className={`${theme.primary} text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20`}>
            GPA: {transcripts[0]?.sgpa || 'N/A'}
          </div>
        )}
      </div>

      {/* Upcoming Exams */}
      {schedules && schedules.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-6 rounded-[2rem]">
          <h3 className="font-black text-amber-800 text-sm uppercase tracking-widest mb-4">Upcoming Exams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(schedules as any[]).slice(0, 3).map((exam: any, i: number) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
                <p className="font-black text-sm text-slate-800">{exam.title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{exam.course_name} • {exam.exam_type}</p>
                <p className="text-[10px] text-amber-600 font-black uppercase mt-2">{new Date(exam.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(transcripts || []).map((sem: any) => (
          <div key={sem.semester} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer group active:scale-[0.98]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">{sem.semester}</h3>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Download size={20}/>
              </div>
            </div>
            <div className="space-y-5">
              {sem.courses.map((course: any) => (
                <div key={course.course_name} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight pr-4">{course.course_name}</p>
                  <span className={`text-xs font-black ${theme.text}`}>{course.grade}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SGPA</span>
              <span className="text-lg font-black text-indigo-600">{sem.sgpa}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- FINANCE MODULE ---
export const FinanceModule: React.FC<ModuleProps> = ({ role }) => {
  const theme = ROLE_THEMES[role];

  const { data: fees, loading } = useApi(
    () => financeApi.fees(),
    [
      { id: '1', label: 'Tuition Fee (Sem 7)', amount: 45000, status: 'Paid', due_date: '2024-08-12', payment_date: '2024-08-12', semester_label: 'Sem 7' },
      { id: '2', label: 'Laboratory Fee', amount: 8500, status: 'Paid', due_date: '2024-08-12', payment_date: '2024-08-12', semester_label: 'Sem 7' },
      { id: '3', label: 'Institutional Transport', amount: 12000, status: 'Pending', due_date: '2024-09-30', payment_date: null, semester_label: 'Sem 7' },
    ],
    [role]
  );

  const { data: outstanding } = useApi(
    () => role === UserRole.STUDENT ? financeApi.outstanding() : Promise.resolve({ total_due: 0, total_paid: 0, outstanding: 0 }),
    { total_due: 65500, total_paid: 53500, outstanding: 12000 },
    [role]
  );

  if (loading) return <FullPageLoader />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Fee Management</h2>
        <div className="space-y-4">
          {(fees || []).map((fee: any, i: number) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors gap-4">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${theme.light} ${theme.text} shrink-0`}><CreditCard size={24}/></div>
                <div>
                  <p className="text-sm font-black text-slate-800 tracking-tight">{fee.label}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                    {fee.status === 'Paid' ? fee.payment_date : `Due: ${fee.due_date}`}
                  </p>
                </div>
              </div>
              <div className="flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-0 pt-4 sm:pt-0">
                <p className="text-base font-black text-slate-900">₹{Number(fee.amount).toLocaleString('en-IN')}</p>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${fee.status === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>{fee.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full -mb-20 -mr-20 blur-3xl"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">Total Outstanding</p>
          <h4 className="text-4xl font-black tracking-tighter mb-10">₹{outstanding ? Number(outstanding.outstanding).toLocaleString('en-IN') : '12,000'}</h4>
          <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">Proceed to Gateway</button>
        </div>
      </div>
    </div>
  );
};

// --- PLACEMENTS MODULE ---
export const PlacementsModule: React.FC<ModuleProps> = ({ role }) => {
  const fallbackDrives = [
    { id: '1', company_name: 'Google', role_offered: 'Software Engineer', package_lpa: 24.5, status: 'UPCOMING', drive_date: '2024-10-12', application_status: null },
    { id: '2', company_name: 'TCS Digital', role_offered: 'System Analyst', package_lpa: 7.2, status: 'OPEN', drive_date: '2024-10-15', application_status: 'APPLIED' },
    { id: '3', company_name: 'Zoho', role_offered: 'Product Developer', package_lpa: 12.0, status: 'OPEN', drive_date: '2024-10-18', application_status: 'SHORTLISTED' },
  ];

  const { data: drives, loading } = useApi(
    () => placementsApi.drives(),
    fallbackDrives,
    [role]
  );

  if (loading) return <FullPageLoader />;

  return (
    <div className="space-y-8">
      <div className="px-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Placement Hub</h2>
        <p className="text-slate-500 text-sm font-medium">Institutional recruitment drives and career cell.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(drives || []).map((c: any) => (
          <div key={c.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all active:scale-[0.98]">
            <div className="flex justify-between items-start mb-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-800 text-2xl group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors shadow-sm">{c.company_name[0]}</div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-sm ${c.status === 'UPCOMING' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{c.status}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{c.company_name}</h3>
            <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1 mb-6">{c.role_offered}</p>
            {c.application_status && (
              <div className="mb-4 px-3 py-1.5 bg-indigo-50 rounded-full inline-block">
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{c.application_status}</span>
              </div>
            )}
            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Package</p>
                <p className="text-base font-black text-slate-900">{c.package_lpa} LPA</p>
              </div>
              <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"><ChevronRight size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SIS MODULE (ADMIN VIEW) ---
export const SISModule: React.FC<ModuleProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'activities'>('directory');
  const theme = ROLE_THEMES[role];

  const fallbackStudents = [
    { id: '1', name: 'Alex Johnson', email: 'alex.j@edusphere.edu.in', role: 'STUDENT', department: 'CSE', enrollment_no: '21CS042', avatar: 'https://i.pravatar.cc/150?u=21CS042', is_active: true },
    { id: '2', name: 'Sarah Miller', email: 'sarah.m@edusphere.edu.in', role: 'STUDENT', department: 'Mech', enrollment_no: '21ME102', avatar: 'https://i.pravatar.cc/150?u=21ME102', is_active: true },
    { id: '3', name: 'Kevin Durant', email: 'kevin.d@edusphere.edu.in', role: 'STUDENT', department: 'EEE', enrollment_no: '21EE088', avatar: 'https://i.pravatar.cc/150?u=21EE088', is_active: true },
  ];

  const { data: students, loading } = useApi(
    () => usersApi.list({ role: 'STUDENT' }) as Promise<any[]>,
    fallbackStudents,
    [role]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="px-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Directory</h2>
          <p className="text-slate-500 text-sm font-medium">Lifecycle management and activity auditing.</p>
        </div>
        <div className="w-full sm:w-auto flex bg-slate-100 p-1.5 rounded-2xl">
          <button onClick={() => setActiveTab('directory')} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'directory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Directory</button>
          <button onClick={() => setActiveTab('activities')} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'activities' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Audit Log</button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {activeTab === 'directory' ? (
          <>
            <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
                <input type="text" placeholder="Search institutional records..." className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl text-sm outline-none border-none focus:ring-2 focus:ring-rose-100 transition-all font-medium"/>
              </div>
              <button className={`w-full sm:w-auto shrink-0 ${theme.primary} text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-900/10 active:scale-95`}>Enroll Student</button>
            </div>
            
            {/* Mobile View */}
            <div className="p-4 grid grid-cols-1 gap-4 lg:hidden">
              {(students || []).map((s: any) => (
                <div key={s.id} className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shadow-sm"><img src={s.avatar || `https://i.pravatar.cc/150?u=${s.enrollment_no}`} alt=""/></div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{s.enrollment_no || s.email} • {s.department || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`w-2 h-2 rounded-full inline-block mt-1 ${s.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Student Profile</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Department</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Email</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(students || []).map((s: any) => (
                    <tr key={s.id} className="hover:bg-rose-50/10 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden"><img src={s.avatar || `https://i.pravatar.cc/150?u=${s.enrollment_no}`} alt=""/></div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{s.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{s.enrollment_no || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-600 text-xs">{s.department || 'N/A'}</td>
                      <td className="px-8 py-6 font-medium text-slate-500 text-xs">{s.email}</td>
                      <td className="px-8 py-6 text-right">
                        <span className={`w-2 h-2 rounded-full inline-block mr-2 ${s.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        <span className="text-[10px] font-black uppercase text-slate-400">{s.is_active ? 'Active' : 'Offline'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-6 md:p-8 space-y-6">
            {[
              { type: 'login', user: 'Alex Johnson', time: '2 mins ago', detail: 'Accessed Course Materials: Cloud Computing' },
              { type: 'finance', user: 'Kevin Durant', time: '1 hour ago', detail: 'Processed Tuition Fee Payment (₹45,000)' },
              { type: 'exam', user: 'Sarah Miller', time: '3 hours ago', detail: 'Viewed Result Sheet: Semester 3' },
              { type: 'security', user: 'Admin System', time: '5 hours ago', detail: 'Authorized new faculty login: Dr. Arun Kumar' }
            ].map((act, i) => (
              <div key={i} className="flex gap-5 items-start p-4 rounded-3xl hover:bg-slate-50 transition-all group">
                <div className={`p-4 rounded-2xl ${act.type === 'finance' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'} shrink-0`}><Terminal size={22}/></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-slate-800 text-sm tracking-tight">{act.user}</h4>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">{act.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- FACULTY MANAGEMENT ---
export const FacultyMgmtModule: React.FC<ModuleProps> = ({ role }) => {
  const theme = ROLE_THEMES[role];
  
  const fallbackFaculty = [
    { id: 'F001', name: 'Dr. Arun Kumar', department: 'CSE', designation: 'HoD', phone: '+91-9876543210', avatar: 'https://i.pravatar.cc/150?u=F001', is_active: true },
    { id: 'F002', name: 'Prof. S. Devi', department: 'CSE', designation: 'Associate Prof', phone: '+91-9876543211', avatar: 'https://i.pravatar.cc/150?u=F002', is_active: true },
    { id: 'F003', name: 'Dr. P. Raj', department: 'Mech', designation: 'Professor', phone: '+91-9876543212', avatar: 'https://i.pravatar.cc/150?u=F003', is_active: false },
  ];

  const { data: faculty, loading } = useApi(
    () => usersApi.list({ role: 'FACULTY' }) as Promise<any[]>,
    fallbackFaculty,
    [role]
  );

  if (loading) return <FullPageLoader />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="px-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Resources</h2>
          <p className="text-slate-500 text-sm font-medium">Personnel records and workload balancing.</p>
        </div>
        <button className={`w-full sm:w-auto ${theme.primary} text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/10 active:scale-95 flex items-center justify-center gap-2`}><Plus size={18}/> Appoint Staff</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(faculty || []).map((f: any) => (
          <div key={f.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all active:scale-[0.98]">
            <div className="absolute top-0 right-0 p-6"><MoreVertical className="text-slate-200" size={18}/></div>
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden ring-4 ring-slate-50"><img src={f.avatar || `https://i.pravatar.cc/150?u=${f.id}`} alt=""/></div>
              <div>
                <h3 className="font-black text-lg text-slate-900 tracking-tight">{f.name}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{f.designation || 'Faculty'} • {f.department || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                <p className="text-sm font-black text-slate-800 mt-1">{f.department || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <p className={`text-sm font-black mt-1 ${f.is_active ? 'text-emerald-500' : 'text-slate-400'}`}>{f.is_active ? 'Active' : 'On Leave'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3.5 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-black/10 active:bg-slate-800 transition-colors">Profile</button>
              <button className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 transition-all">Assign</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SUBJECTS MODULE ---
export const SubjectsModule: React.FC<ModuleProps> = ({ role }) => {
  const theme = ROLE_THEMES[role];
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  
  const fallbackCourses = [
    { id: '1', code: 'CS8701', name: 'Cloud Computing', credits: 4, enrolled_count: 87, progress: 85, faculty_name: 'Dr. Arun Kumar', schedule: 'Mon, Wed 09:00 AM' },
    { id: '2', code: 'CS8702', name: 'Cyber Security', credits: 3, enrolled_count: 42, progress: 62, faculty_name: 'Prof. S. Devi', schedule: 'Tue, Thu 11:30 AM' },
    { id: '3', code: 'CS8711', name: 'Cloud Computing Lab', credits: 2, enrolled_count: 44, progress: 100, faculty_name: 'Dr. Arun Kumar', schedule: 'Fri 02:00 PM' },
  ];

  const { data: courses, loading } = useApi(
    () => coursesApi.list(),
    fallbackCourses,
    [role]
  );

  const { data: materials } = useApi(
    () => selectedCourse ? coursesApi.materials(selectedCourse.id) : Promise.resolve([]),
    [],
    [selectedCourse?.id]
  );

  if (loading) return <FullPageLoader />;

  if (selectedCourse) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-6">
          <div className="flex items-center gap-5 w-full sm:w-auto">
            <button onClick={() => setSelectedCourse(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0"><ArrowLeft size={24}/></button>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedCourse.name}</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{selectedCourse.code} • {selectedCourse.faculty_name || 'TBA'}</p>
            </div>
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
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700">{m.title}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5">{typeof m.uploaded_at === 'string' ? m.uploaded_at.slice(0, 10) : ''}</p>
                    </div>
                    <Download size={16} className="text-slate-300"/>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-3"><History size={18} className="text-indigo-600"/> Attendance History</h3>
              <div className="space-y-3">
                {[
                  { date: '12 Oct 2024', status: 'Present', time: '09:05 AM', faculty: 'Dr. Arun Kumar' },
                  { date: '10 Oct 2024', status: 'Present', time: '09:02 AM', faculty: 'Dr. Arun Kumar' },
                  { date: '08 Oct 2024', status: 'Absent', time: '-', faculty: 'Dr. Arun Kumar' },
                  { date: '05 Oct 2024', status: 'Present', time: '09:10 AM', faculty: 'Dr. Arun Kumar' }
                ].map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${h.status === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      <div>
                        <p className="text-xs font-black text-slate-700">{h.date}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{h.time !== '-' ? `Logged at ${h.time}` : 'No Log Data'}</p>
                      </div>
                    </div>
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
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Attendance</span>
                    <span className="text-2xl font-black text-emerald-400">92%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Course Progress</span>
                    <span className="text-2xl font-black text-indigo-400">{selectedCourse.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{width: `${selectedCourse.progress}%`}}></div>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Upcoming Assessment</p>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <h4 className="text-xs font-black mb-1">Internal Exam II</h4>
                    <p className="text-[9px] text-white/30 font-bold uppercase">24 Oct 2024 • 02:00 PM</p>
                  </div>
                </div>
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
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Academic Curriculum</h2>
          <p className="text-slate-500 text-sm font-medium">Your authorized institutional workload and resources.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {role === UserRole.ADMIN && <button className="flex-1 sm:flex-none bg-rose-800 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-900/10 active:scale-95">Enroll Module</button>}
          {role === UserRole.FACULTY && <button className="flex-1 sm:flex-none bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95">Add Course</button>}
          <button className="flex-1 sm:flex-none bg-white border border-slate-200 p-3 rounded-2xl"><Filter size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {(courses || []).map((c: any) => (
          <div 
            key={c.id || c.code} 
            onClick={() => setSelectedCourse(c)}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group active:scale-[0.98] transition-all cursor-pointer hover:shadow-2xl hover:border-indigo-100"
          >
            <div className="flex justify-between items-start mb-10">
              <div className={`w-14 h-14 rounded-2xl ${theme.light} ${theme.text} flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform`}>{c.code.slice(-2)}</div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credits</p>
                <p className="text-sm font-black text-slate-900 mt-1">{c.credits}</p>
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">{c.name}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-10">{c.code} • {c.faculty_name || 'TBA'}</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Completion</span>
                <span className={theme.text}>{c.progress}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${theme.primary} transition-all duration-1000 shadow-[0_0_12px_rgba(79,70,229,0.3)]`} style={{width: `${c.progress}%`}}></div>
              </div>
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
