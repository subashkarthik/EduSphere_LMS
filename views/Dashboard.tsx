
import React from 'react';
import { UserRole, DashboardMetric } from '../types';
import { MOCK_ATTENDANCE, MOCK_TIMETABLE, PLACEMENT_STATS, ROLE_THEMES } from '../constants';
import { 
  TrendingUp, TrendingDown, Calendar, MapPin, ChevronRight,
  GraduationCap, Users, Award, Wallet, FileText, CreditCard,
  BookOpen, Building2, ShieldAlert, Zap, Activity,
  PlusCircle, Upload, UserPlus, BookPlus, ClipboardCheck, ArrowRight
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { useApi } from '../hooks';
import { dashboardApi, attendanceApi, timetableApi } from '../services/api';
import { MetricCardSkeleton, ActivitySkeleton } from '../components/LoadingSkeleton';

interface DashboardProps {
  role: UserRole;
}

// Fallback mock metrics when backend is offline
const FALLBACK_METRICS: Record<string, DashboardMetric[]> = {
  STUDENT: [
    { label: 'Attendance', value: '86.4%', change: '+2.1%', trend: 'up' },
    { label: 'GPA', value: '8.42', change: '+0.15', trend: 'up' },
    { label: 'Completion', value: '72%', change: '+5%', trend: 'up' },
    { label: 'Dues', value: '₹12k', change: '1 item', trend: 'down' },
  ],
  FACULTY: [
    { label: 'Classes/wk', value: '18h', change: 'Normal', trend: 'neutral' },
    { label: 'Grading', value: '42/120', change: '65% Left', trend: 'down' },
    { label: 'Resources', value: '124', change: '+12', trend: 'up' },
    { label: 'Leaves', value: '4', change: 'Used 2', trend: 'up' },
  ],
  ADMIN: [
    { label: 'Total Students', value: '2,450', change: '+120', trend: 'up' },
    { label: 'Institutional Rev', value: '₹4.2Cr', change: '+8%', trend: 'up' },
    { label: 'Placement', value: '94%', change: '+2%', trend: 'up' },
    { label: 'Faculty Ratio', value: '1:13', change: 'Optimal', trend: 'up' },
  ],
};

const FALLBACK_ACTIVITY = [
  { label: 'Attendance Sync', description: 'Faculty CS8701 completed sync for 87 students', time: '12m ago', type: 'attendance' },
  { label: 'New Enrollment', description: 'Admission processed for 21CS049 (CSE)', time: '45m ago', type: 'enrollment' },
  { label: 'Fee Alert', description: 'Automated due notices sent to Semester 4', time: '2h ago', type: 'fee' },
];

const MetricCard: React.FC<{ metric: DashboardMetric; icon: React.ElementType; theme: any }> = ({ metric, icon: Icon, theme }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl ${theme.light}`}>
        <Icon className={theme.text} size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${metric.trend === 'up' ? 'text-emerald-600' : metric.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
        {metric.trend === 'up' ? <TrendingUp size={14} /> : metric.trend === 'down' ? <TrendingDown size={14} /> : null}
        {metric.change}
      </div>
    </div>
    <div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{metric.label}</p>
      <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">{metric.value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const theme = ROLE_THEMES[role] || ROLE_THEMES[UserRole.STUDENT];
  const isAdmin = role === UserRole.ADMIN;

  // Fetch live data with fallbacks
  const { data: metrics, loading: metricsLoading } = useApi(
    () => dashboardApi.metrics(),
    FALLBACK_METRICS[role] || FALLBACK_METRICS.STUDENT,
    [role]
  );

  const { data: analytics } = useApi(
    () => dashboardApi.analytics(),
    { placement_trends: PLACEMENT_STATS.map(s => ({ ...s, avgLPA: s.avgLPA })) },
    [role]
  );

  const { data: activity, loading: activityLoading } = useApi(
    () => dashboardApi.activity(),
    FALLBACK_ACTIVITY,
    [role]
  );

  const { data: attendance } = useApi(
    () => attendanceApi.summary(),
    MOCK_ATTENDANCE.map(a => ({ course_code: a.courseCode, course_name: a.courseName, percentage: a.percentage, classes_held: a.classesHeld, classes_attended: a.classesAttended })),
    [role]
  );

  const { data: timetable } = useApi(
    () => timetableApi.list(),
    MOCK_TIMETABLE.map(t => ({ id: '', day: t.day, time: t.time, course: t.course, venue: t.venue, faculty: t.faculty || null, entry_type: 'LECTURE' })),
    [role]
  );

  const chartData = analytics?.placement_trends || PLACEMENT_STATS;

  const activityIcons: Record<string, React.ElementType> = {
    attendance: Activity,
    enrollment: GraduationCap,
    fee: CreditCard,
    system: Zap,
    security: ShieldAlert,
  };

  const activityColors: Record<string, string> = {
    attendance: 'text-indigo-600',
    enrollment: 'text-emerald-600',
    fee: 'text-rose-600',
    system: 'text-amber-600',
    security: 'text-violet-600',
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 lg:pb-0">
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight uppercase">
            {role === UserRole.STUDENT ? 'Student Hub' : role === UserRole.FACULTY ? 'Faculty Portal' : 'Institutional Admin'}
          </h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">EduSphere Console • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="hidden md:flex gap-3">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Load</p>
            <p className="text-xs font-black text-emerald-500 uppercase">Optimal</p>
          </div>
          <Zap className="text-amber-400 animate-pulse" size={24}/>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          (metrics || []).map((m: any, i: number) => (
            <MetricCard 
              key={i} 
              metric={{ label: m.label, value: m.value, change: m.change, trend: m.trend as any }}
              icon={i === 0 ? Users : i === 1 ? GraduationCap : i === 2 ? Award : Wallet} 
              theme={theme}
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Analytics Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="font-black text-xl text-slate-900 tracking-tight">Institutional Analytics</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Academic & Financial Growth Index</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-50 text-[10px] font-black uppercase text-slate-400 rounded-xl hover:bg-slate-100">Annual</button>
                <button className={`px-4 py-2 ${theme.primary} text-[10px] font-black uppercase text-white rounded-xl shadow-lg shadow-indigo-500/20`}>Quarterly</button>
              </div>
            </div>
            <div className="h-80 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isAdmin ? '#e11d48' : '#4f46e5'} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={isAdmin ? '#e11d48' : '#4f46e5'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }} />
                  <Area type="monotone" dataKey="avgLPA" stroke={isAdmin ? '#e11d48' : '#4f46e5'} fillOpacity={1} fill="url(#colorVal)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Role-Specific Secondary Content */}
          {role === UserRole.STUDENT && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-xl text-slate-900 tracking-tight">Enrolled Courses</h3>
                  <button className="text-[10px] font-black uppercase text-indigo-600 tracking-widest hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {(attendance || []).slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="group p-5 rounded-3xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-sm text-slate-800">{item.course_name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.course_code}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.percentage > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {item.percentage}%
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${theme.primary} rounded-full`} style={{width: `${item.percentage}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-xl text-slate-900 tracking-tight">Recent Materials</h3>
                  <BookOpen className="text-slate-200" size={20} />
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Lecture 12: Neural Nets', type: 'PDF', size: '2.4 MB', date: 'Today' },
                    { title: 'Lab Assignment 4', type: 'DOCX', size: '1.1 MB', date: 'Yesterday' },
                    { title: 'Reference Reading', type: 'URL', size: 'Link', date: '2 days ago' }
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="p-3 bg-slate-100 rounded-xl text-slate-400"><FileText size={18}/></div>
                      <div className="flex-1">
                        <h4 className="text-xs font-black text-slate-800">{doc.title}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{doc.type} • {doc.size} • {doc.date}</p>
                      </div>
                      <Upload size={14} className="text-slate-300 rotate-180" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {role === UserRole.FACULTY && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-xl text-slate-900 tracking-tight">Courses Handled</h3>
                  <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><PlusCircle size={20}/></button>
                </div>
                <div className="space-y-4">
                  {[
                    { code: 'CS8701', name: 'Cloud Computing', batch: '2021-25 CSE A', progress: 85 },
                    { code: 'CS8711', name: 'Cloud Computing Lab', batch: '2021-25 CSE B', progress: 100 }
                  ].map((c, i) => (
                    <div key={i} className="p-5 rounded-3xl border border-slate-50 hover:border-emerald-100 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-black text-sm text-slate-800">{c.name}</h4>
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{c.batch}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{width: `${c.progress}%`}}></div>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600">{c.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                <h3 className="font-black text-xl mb-8 tracking-tight">Faculty Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-col items-center gap-3 group">
                    <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform"><Upload size={24}/></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Upload Materials</span>
                  </button>
                  <button className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-col items-center gap-3 group">
                    <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform"><ClipboardCheck size={24}/></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Mark Attendance</span>
                  </button>
                  <button className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-col items-center gap-3 group">
                    <div className="p-4 bg-amber-500/20 text-amber-400 rounded-2xl group-hover:scale-110 transition-transform"><FileText size={24}/></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Set Exam Paper</span>
                  </button>
                  <button className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex flex-col items-center gap-3 group">
                    <div className="p-4 bg-rose-500/20 text-rose-400 rounded-2xl group-hover:scale-110 transition-transform"><Activity size={24}/></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Track Progress</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {role === UserRole.ADMIN && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="font-black text-xl text-slate-900 tracking-tight">Institutional Management</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Administration Quick Actions</p>
                </div>
                <ShieldAlert className="text-rose-600 animate-pulse" size={24} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Add Institutional User', desc: 'Create Student/Faculty Profiles', icon: UserPlus, color: 'bg-indigo-50 text-indigo-600', hover: 'hover:border-indigo-200 hover:bg-indigo-50/50' },
                  { label: 'Create New Course', desc: 'Define Curriculum & Credits', icon: BookPlus, color: 'bg-emerald-50 text-emerald-600', hover: 'hover:border-emerald-200 hover:bg-emerald-50/50' },
                  { label: 'Assign Faculty', desc: 'Manage Course Handlers', icon: Users, color: 'bg-amber-50 text-amber-600', hover: 'hover:border-amber-200 hover:bg-amber-50/50' }
                ].map((action, i) => (
                  <button key={i} className={`p-8 rounded-[2rem] border border-slate-50 text-left transition-all group ${action.hover}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${action.color}`}>
                      <action.icon size={28} />
                    </div>
                    <h4 className="font-black text-slate-800 text-sm mb-2">{action.label}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">{action.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-slate-900 transition-colors">
                      Initialize <ArrowRight size={14} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* System Activity */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-xl text-slate-900 tracking-tight mb-8">System Activity</h3>
            <div className="space-y-6">
              {activityLoading ? (
                Array.from({ length: 3 }).map((_, i) => <ActivitySkeleton key={i} />)
              ) : (
                (activity || []).map((log: any, i: number) => {
                  const LogIcon = activityIcons[log.type] || Activity;
                  const logColor = activityColors[log.type] || 'text-slate-600';
                  return (
                    <div key={i} className="flex gap-6 group cursor-pointer">
                      <div className={`p-4 rounded-2xl bg-slate-50 ${logColor} group-hover:scale-110 transition-transform`}>
                        <LogIcon size={20}/>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-black text-sm text-slate-800">{log.label}</h4>
                          <span className="text-[10px] font-black text-slate-300 uppercase">{log.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{log.description}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <div className={`${theme.bg} p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-xl tracking-tight">Daily Agenda</h3>
                <Calendar size={20} className="text-white/40" />
              </div>
              <div className="space-y-8">
                {(timetable || []).slice(0, 4).map((event: any, i: number) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${theme.accent} ring-4 ring-white/10 group-hover:scale-150 transition-transform`}></div>
                      <div className="w-[1px] flex-1 bg-white/10 mt-3"></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{event.time}</p>
                      <h4 className="font-black text-sm mt-1">{event.course}</h4>
                      <p className="text-[10px] text-white/40 font-bold uppercase mt-1 tracking-tighter">{event.venue} • {event.faculty || 'TBA'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-500"></div>
             <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-white/10 rounded-2xl"><Building2 size={24}/></div>
               <div>
                 <h4 className="font-black text-sm uppercase tracking-widest">Campus Status</h4>
                 <p className="text-[10px] text-white/30 font-bold uppercase">Main Block, Coimbatore</p>
               </div>
             </div>
             <div className="space-y-6">
                {[
                  { label: 'Network Latency', val: '12ms', color: 'text-emerald-400' },
                  { label: 'Campus Energy', val: '840kW', color: 'text-amber-400' },
                  { label: 'ERP Active Sessions', val: '1,402', color: 'text-indigo-400' }
                ].map((st, i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{st.label}</span>
                    <span className={`text-xs font-black ${st.color}`}>{st.val}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-rose-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden mt-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h4 className="font-black text-xl mb-3 tracking-tight">Institutional Strength Index</h4>
            <p className="text-white/60 text-sm font-medium leading-relaxed">
              "EduSphere reduces dependency on multiple systems by providing a unified academic platform with role-based dashboards and centralized data management."
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Efficiency</span>
              <span className="text-xl font-black text-emerald-400">+42%</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Centralization</span>
              <span className="text-xl font-black text-indigo-400">100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
