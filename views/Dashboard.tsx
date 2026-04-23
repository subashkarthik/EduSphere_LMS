import React from 'react';
import { UserRole, DashboardMetric, LearningMetric, Recommendation } from '../types';
import { MOCK_ATTENDANCE, MOCK_TIMETABLE, ROLE_THEMES } from '../constants';
import { 
  TrendingUp, TrendingDown, Calendar, ChevronRight,
  GraduationCap, Award, BookOpen, ShieldAlert, Zap, Activity,
  ArrowRight, BrainCircuit, Sparkles, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useApi } from '../hooks';
import { intelligenceApi, attendanceApi, timetableApi } from '../services/api';
import { MetricCardSkeleton, ActivitySkeleton } from '../components/LoadingSkeleton';

interface DashboardProps {
  role: UserRole;
}

const LearningHealthCard: React.FC<{ metric: LearningMetric | null; loading: boolean }> = ({ metric, loading }) => {
  if (loading || !metric) return <div className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]"></div>;

  const data = [
    { name: 'Health', value: metric.overall_score },
    { name: 'Remaining', value: 100 - metric.overall_score },
  ];
  
  const COLORS = [
    metric.risk_level === 'CRITICAL' ? '#ef4444' : metric.risk_level === 'WARNING' ? '#f59e0b' : '#10b981',
    '#f1f5f9'
  ];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-xl transition-all duration-500">
      <div className="absolute top-4 right-8 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
        <div className={`w-2 h-2 rounded-full ${metric.risk_level === 'CRITICAL' ? 'bg-red-500 animate-pulse' : metric.risk_level === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{metric.risk_level} RISK</span>
      </div>

      <div className="h-48 w-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-900">{Math.round(metric.overall_score)}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Score</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="font-black text-slate-800 text-lg tracking-tight">Learning Performance</h3>
        <p className="text-xs text-slate-400 font-medium px-4 mt-1 leading-relaxed">
          {metric.prediction_summary}
        </p>
      </div>
    </div>
  );
};

const RecommendationItem: React.FC<{ rec: Recommendation }> = ({ rec }) => {
  const Icon = rec.type === 'REVISE' ? BrainCircuit : rec.type === 'ATTEND' ? AlertTriangle : Sparkles;
  const colors = {
    URGENT: 'bg-rose-50 text-rose-600 border-rose-100',
    HIGH: 'bg-amber-50 text-amber-600 border-amber-100',
    MEDIUM: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    LOW: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  return (
    <div className={`p-5 rounded-3xl border ${colors[rec.priority as keyof typeof colors]} transition-all hover:scale-[1.02] cursor-pointer group`}>
      <div className="flex gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm h-fit">
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-black text-sm text-slate-800">{rec.title}</h4>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{rec.priority}</span>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">{rec.message}</p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:gap-3 transition-all">
            Take Action <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const theme = ROLE_THEMES[role] || ROLE_THEMES[UserRole.STUDENT];

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 lg:pb-0">
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight uppercase">
            {role === UserRole.STUDENT ? 'Intelligence Hub' : 'Faculty Insights'}
          </h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">EduSpere AI • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="hidden md:flex gap-3">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Status</p>
            <p className="text-xs font-black text-emerald-500 uppercase">Synchronized</p>
          </div>
          <Sparkles className="text-indigo-500 animate-pulse" size={24}/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Intelligence Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <LearningHealthCard metric={intelligenceMetrics} loading={metricsLoading} />
             
             <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400"><BrainCircuit size={20}/></div>
                    <h3 className="font-black text-xl tracking-tight">Smart Insights</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Attendance Health</span>
                      <span className={`text-sm font-black ${intelligenceMetrics?.attendance_score && intelligenceMetrics.attendance_score < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {Math.round(intelligenceMetrics?.attendance_score || 0)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Assessment GPA</span>
                      <span className="text-sm font-black text-indigo-400">{((intelligenceMetrics?.assessment_score || 0) / 10).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button className="mt-8 w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                  View Detailed Analytics <ChevronRight size={14}/>
                </button>
             </div>
          </div>

          {/* Recommendations Feed */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><Sparkles size={20}/></div>
                <h3 className="font-black text-xl text-slate-900 tracking-tight">Personalized Recommendations</h3>
              </div>
              <button className="text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-900">Refresh</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations?.length ? (
                recommendations.map((rec, i) => <RecommendationItem key={i} rec={rec} />)
              ) : (
                <div className="col-span-2 p-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="text-emerald-400 mb-3" size={32} />
                  <p className="text-slate-500 font-bold text-sm">You're all caught up! No critical recommendations found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Journey Summary */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-xl text-slate-900 tracking-tight">Active Learning Tracks</h3>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                <TrendingUp size={12} /> Progress Positive
              </div>
            </div>
            <div className="space-y-6">
              {(attendance || []).slice(0, 3).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-6 p-4 rounded-[2rem] hover:bg-slate-50 transition-all group">
                  <div className={`h-12 w-12 rounded-2xl ${i === 0 ? 'bg-indigo-50 text-indigo-600' : i === 1 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'} flex items-center justify-center font-black text-xs`}>
                    {item.course_code.substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-black text-sm text-slate-800">{item.course_name}</h4>
                      <span className="text-[10px] font-black text-slate-400">{item.percentage}% Complete</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${i === 0 ? 'bg-indigo-500' : i === 1 ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full`} style={{width: `${item.percentage}%`}}></div>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-200 group-hover:text-slate-900 transition-colors" size={20} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Smart Agenda */}
          <div className={`${theme.bg} p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-xl tracking-tight">Today's Focus</h3>
                <Calendar size={20} className="text-white/40" />
              </div>
              <div className="space-y-8">
                {(timetable || []).slice(0, 3).map((event: any, i: number) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${theme.accent} ring-4 ring-white/10 group-hover:scale-150 transition-transform`}></div>
                      <div className="w-[1px] flex-1 bg-white/10 mt-3"></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{event.time}</p>
                      <h4 className="font-black text-sm mt-1">{event.course}</h4>
                      <p className="text-[10px] text-white/40 font-bold uppercase mt-1 tracking-tighter">{event.venue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Map Visualization */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
             <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-white/10 rounded-2xl text-purple-400"><GraduationCap size={24}/></div>
               <div>
                 <h4 className="font-black text-sm uppercase tracking-widest">Skill Mapping</h4>
                 <p className="text-[10px] text-white/30 font-bold uppercase">Software Engineering Path</p>
               </div>
             </div>
             <div className="space-y-6">
                {[
                  { label: 'Cloud Architecture', val: '82%', color: 'bg-indigo-400' },
                  { label: 'Data Science', val: '65%', color: 'bg-emerald-400' },
                  { label: 'Problem Solving', val: '94%', color: 'bg-amber-400' }
                ].map((skill, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-white/40">{skill.label}</span>
                      <span>{skill.val}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${skill.color}`} style={{width: skill.val}}></div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 pt-6 border-t border-white/5 text-center">
               <p className="text-[10px] font-bold text-white/40 uppercase leading-relaxed">
                 You are <span className="text-white">68% job-ready</span> for an SDE Role.
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Risk Prediction Alert */}
      {intelligenceMetrics?.risk_level === 'CRITICAL' && (
        <div className="bg-rose-500 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-rose-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 rounded-3xl"><ShieldAlert size={32} /></div>
            <div>
              <h4 className="font-black text-xl tracking-tight">Critical Performance Warning</h4>
              <p className="text-white/80 text-sm font-medium mt-1">
                Based on current trends, your attendance is predicted to drop below 75% in two weeks.
              </p>
            </div>
          </div>
          <button className="px-8 py-4 bg-white text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors">
            Resolve Risk Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
