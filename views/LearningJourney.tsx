import React from 'react';
import { UserRole } from '../types';
import { 
  CheckCircle2, Circle, Clock, Award, 
  Download, QrCode, ExternalLink, 
  ShieldCheck, BrainCircuit, Zap, BarChart3, Star
} from 'lucide-react';
import { ROLE_THEMES } from '../constants';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const LearningJourney: React.FC = () => {
  const milestones = [
    { id: 1, title: 'Foundations of Computer Science', status: 'COMPLETED', date: 'Sept 2024', topics: ['Discrete Mathematics', 'Logic Gates', 'Hardware Architecture'], score: 94, credits: 12 },
    { id: 2, title: 'Data Structures & Algorithms Mastery', status: 'COMPLETED', date: 'Dec 2024', topics: ['Dynamic Programming', 'Graph Theory', 'Complexity Analysis'], score: 88, credits: 16 },
    { id: 3, title: 'Advanced Full-Stack Engineering', status: 'IN_PROGRESS', date: 'Mar 2025', topics: ['Microservices', 'Distributed Systems', 'Cloud Native'], progress: 68, credits: 20 },
    { id: 4, title: 'Machine Learning & Neural Networks', status: 'UPCOMING', date: 'Aug 2025', topics: ['TensorFlow', 'Deep Learning', 'Computer Vision'], credits: 18 },
  ];

  const certificates = [
    { id: 'CERT-8812-X', title: 'Data Structures & System Design', issued: 'Jan 2025', authority: 'EduSpere Academic Board' },
    { id: 'CERT-9904-B', title: 'Professional Web Architecture', issued: 'Feb 2025', authority: 'Cloud Engineering Dept' },
  ];

  const skillData = [
    { subject: 'Algorithms', A: 90, fullMark: 100 },
    { subject: 'System Design', A: 75, fullMark: 100 },
    { subject: 'Cloud Arch', A: 85, fullMark: 100 },
    { subject: 'Database', A: 95, fullMark: 100 },
    { subject: 'Security', A: 70, fullMark: 100 },
    { subject: 'UI/UX', A: 60, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-20">
      {/* Journey Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            <Zap size={12} className="text-amber-500" />
            Progression Track • Verified Milestones
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academic Journey</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} /> Profile Verified
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Progression Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-3">
                <Clock className="text-indigo-600" size={20}/>
                Execution Timeline
              </h3>
              <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Semester 6 ACTIVE
              </div>
            </div>

            <div className="relative ml-4">
              {/* Serious Vertical Progress Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-slate-100"></div>

              <div className="space-y-12">
                {milestones.map((m) => (
                  <div key={m.id} className="relative flex gap-10 group">
                    <div className={`z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-4 border-white shadow-md ${
                      m.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 
                      m.status === 'IN_PROGRESS' ? 'bg-indigo-600 text-white' : 
                      'bg-slate-50 text-slate-300'
                    }`}>
                      {m.status === 'COMPLETED' ? <CheckCircle2 size={18}/> : m.status === 'IN_PROGRESS' ? <Zap size={18} className="animate-pulse" /> : <Circle size={14}/>}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className={`font-black text-base ${m.status === 'UPCOMING' ? 'text-slate-400' : 'text-slate-900'}`}>{m.title}</h4>
                            {m.status === 'COMPLETED' && <Star size={14} className="text-amber-400 fill-amber-400" />}
                          </div>
                          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{m.date} • {m.credits} Units</p>
                        </div>
                        {m.score && (
                          <div className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {m.score}% Proficiency
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {m.topics.map((topic, j) => (
                          <span key={j} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            m.status === 'UPCOMING' ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-white text-slate-600 border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50/50'
                          }`}>
                            {topic}
                          </span>
                        ))}
                      </div>

                      {m.status === 'IN_PROGRESS' && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Learning Progress</span>
                            <span className="text-xs font-black text-indigo-600">{m.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-white rounded-full overflow-hidden border border-slate-200">
                            <div className="h-full bg-indigo-600 rounded-full" style={{width: `${m.progress}%`}}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
           {/* Skill Radar Graph */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <h3 className="font-bold text-lg text-slate-900 mb-8 flex items-center gap-3">
                <BarChart3 className="text-indigo-600" size={20}/> 
                Skill Proficiency
              </h3>
              <div className="h-64 -mx-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Student" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Strength</span>
                  <span className="text-[10px] font-black text-indigo-600 uppercase">Architecture</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Your proficiency in <span className="text-slate-900 font-bold">Algorithms</span> and <span className="text-slate-900 font-bold">Databases</span> places you in the top 10% of institutional cohorts.
                </p>
              </div>
           </div>

           {/* Certified Assets */}
           <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h3 className="font-bold text-lg mb-8 tracking-tight flex items-center gap-3">
                <Award className="text-amber-400" size={20}/> 
                Verified Credentials
              </h3>
              
              <div className="space-y-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-sm leading-tight">{cert.title}</h4>
                        <p className="text-[9px] font-bold text-white/30 uppercase mt-1 tracking-wider">{cert.authority}</p>
                      </div>
                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                        <ShieldCheck size={16}/>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                       <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{cert.id}</span>
                       <button className="flex items-center gap-1 text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-all">
                         <Download size={12}/> Asset
                       </button>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Verification QR */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
             <div className="w-32 h-32 bg-slate-50 border border-slate-100 p-3 rounded-2xl mx-auto mb-6 relative group cursor-pointer">
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://eduspere.edu/verify/alex-j`} alt="QR" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
               <div className="absolute inset-0 flex items-center justify-center bg-white/0 group-hover:bg-white/60 transition-all rounded-2xl opacity-0 group-hover:opacity-100">
                  <ExternalLink size={24} className="text-indigo-600" />
               </div>
             </div>
             <h4 className="font-bold text-slate-900 text-sm mb-2">Public Profile Verification</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-relaxed">
               Secure institutional QR for employer verification of academic assets.
             </p>
           </div>
        </div>
      </div>

      {/* Career readiness Signal */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <BrainCircuit size={28} className="text-indigo-400"/>
              <h4 className="font-black text-2xl tracking-tight">SDE Career Path Readiness</h4>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Based on your verified milestones, your learning trajectory is <span className="text-indigo-400 font-black">78% aligned</span> with Software Engineering roles at Tier-1 technology companies.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-center backdrop-blur-md">
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Peer Percentile</div>
               <div className="text-3xl font-black">94th</div>
             </div>
             <button className="px-8 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] text-center shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
               <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Next Milestone</div>
               <div className="text-sm font-black uppercase tracking-widest">ML Lab</div>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningJourney;
