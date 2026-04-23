import React from 'react';
import { UserRole, LearningMetric, Recommendation } from '../types';
import { MOCK_ATTENDANCE, MOCK_TIMETABLE } from '../constants';
import { 
  TrendingUp, TrendingDown, Calendar, ChevronRight,
  GraduationCap, Award, BrainCircuit, Sparkles, AlertTriangle, CheckCircle2,
  Activity, Clock, LayoutGrid, ListFilter, RefreshCw, ShieldCheck
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useApi } from '../hooks';
import { intelligenceApi, attendanceApi, timetableApi } from '../services/api';

interface DashboardProps {
  role: UserRole;
}

const CommandCenter: React.FC<{ metric: LearningMetric | null }> = ({ metric }) => (
  <div className="bg-slate-900 text-white p-6 rounded-3xl enterprise-border mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
    <div className="flex items-center gap-5 relative z-10">
      <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
        <Sparkles size={28} className="text-indigo-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight">Academic Command Center</h2>
        <p className="text-slate-400 text-sm font-medium mt-1">
          {metric?.risk_level === 'CRITICAL' 
            ? '⚠️ High attention required: Performance risk detected.' 
            : '✓ All systems operational: Academic trajectory stable.'}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
      <div className="flex-1 md:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Health</span>
        <span className={`text-lg font-black ${metric?.risk_level === 'CRITICAL' ? 'text-rose-400' : 'text-emerald-400'}`}>
          {metric?.overall_score || 0}%
        </span>
      </div>
      <div className="flex-1 md:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">Sync OK</span>
        </div>
      </div>
    </div>
  </div>
);

const IntelligenceMetric: React.FC<{ label: string; value: string | number; change: string; isPositive: boolean }> = ({ label, value, change, isPositive }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
      <div className={`flex items-center gap-1 text-[10px] font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const { data: intelligenceMetrics, loading: metricsLoading } = useApi(
    () => intelligenceApi.metrics(),
    null,
    [role]
  );

  const { data: recommendations } = useApi(
    () => intelligenceApi.recommendations(),
    [],
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

  const healthData = [
    { name: 'Health', value: intelligenceMetrics?.overall_score || 0 },
    { name: 'Remaining', value: 100 - (intelligenceMetrics?.overall_score || 0) },
  ];
  const HEALTH_COLORS = [intelligenceMetrics?.risk_level === 'CRITICAL' ? '#f43f5e' : '#6366f1', '#f1f5f9'];

  const trendData = [
    { name: 'Week 1', score: 78 },
    { name: 'Week 2', score: 82 },
    { name: 'Week 3', score: 80 },
    { name: 'Week 4', score: 88 },
    { name: 'Current', score: intelligenceMetrics?.overall_score || 88 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 lg:pb-0">
      {/* Header Signal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            <ShieldCheck size={12} className="text-emerald-500" />
            System Secure • Verified Session
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h1>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl">
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase">Last Updated: Just Now</span>
          </div>
          <button className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <CommandCenter metric={intelligenceMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <IntelligenceMetric label="Academic Health" value={`${intelligenceMetrics?.overall_score || 0}%`} change="+4.2%" isPositive={true} />
        <IntelligenceMetric label="Attendance Avg" value={`${Math.round(intelligenceMetrics?.attendance_score || 0)}%`} change="-1.5%" isPositive={false} />
        <IntelligenceMetric label="Current GPA" value={((intelligenceMetrics?.assessment_score || 0) / 10).toFixed(2)} change="+0.2" isPositive={true} />
        <IntelligenceMetric label="Job Readiness" value="82%" change="+5%" isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Performance Trend Chart */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">Performance Analytics</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">5-week learning trajectory index</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold uppercase rounded-lg border border-slate-200">Linear</button>
                <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-lg border border-indigo-100">Cumulative</button>
              </div>
            </div>
            <div className="h-72 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations Feed (Dense) */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><BrainCircuit size={20}/></div>
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">AI Insights & Focus Areas</h3>
              </div>
              <button className="text-[10px] font-bold uppercase text-slate-400 hover:text-indigo-600 transition-colors">Analyze All</button>
            </div>
            <div className="space-y-3">
              {recommendations?.map((rec, i) => (
                <div key={i} className="group p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all flex items-center gap-5">
                  <div className={`p-3 rounded-xl ${rec.priority === 'URGENT' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'} transition-colors`}>
                    {rec.type === 'REVISE' ? <Activity size={18} /> : <Sparkles size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-sm text-slate-800">{rec.title}</h4>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${rec.priority === 'URGENT' ? 'text-rose-500' : 'text-slate-400'}`}>{rec.priority}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{rec.message}</p>
                  </div>
                  <ChevronRight className="text-slate-200 group-hover:text-indigo-600 transition-colors" size={20} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - High Density */}
        <div className="space-y-6">
          {/* Health Gauge */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-[0.1em] mb-6">Overall Proficiency</h3>
            <div className="h-48 w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {healthData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={HEALTH_COLORS[index % HEALTH_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900">{Math.round(intelligenceMetrics?.overall_score || 0)}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Percentile</span>
              </div>
            </div>
            <p className="mt-6 text-xs text-slate-500 font-medium leading-relaxed">
              Academic stability index remains <span className="text-emerald-600 font-bold uppercase tracking-wider">Optimal</span> for the current sprint.
            </p>
          </div>

          {/* Daily Schedule - Dense List */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Calendar size={18} className="text-indigo-600" /> Agenda</h3>
              <button className="p-2 hover:bg-slate-50 rounded-lg"><LayoutGrid size={16} className="text-slate-400" /></button>
            </div>
            <div className="divide-y divide-slate-50">
              {(timetable || []).slice(0, 4).map((event, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-all flex gap-4 group">
                  <div className="text-right min-w-[50px]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{event.time.split(' ')[0]}</p>
                    <p className="text-[9px] font-black text-indigo-500 uppercase mt-1">{event.time.split(' ')[1]}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors">{event.course}</h4>
                    <p className="text-[9px] text-slate-400 font-medium uppercase mt-0.5 tracking-tight">{event.venue}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 text-[10px] font-black uppercase text-indigo-600 tracking-widest bg-slate-50 hover:bg-slate-100 transition-colors">
              Full Schedule
            </button>
          </div>

          {/* User Meta / Profile Context */}
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">CS</div>
               <div>
                 <h4 className="text-sm font-bold text-slate-900">Semester 6 Index</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dept: Computer Science</p>
               </div>
             </div>
             <div className="space-y-2 pt-4 border-t border-slate-200">
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                 <span>System Load</span>
                 <span className="text-emerald-500">1.2ms (Stable)</span>
               </div>
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                 <span>Encryption</span>
                 <span>AES-256 (Active)</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
