import React from 'react';
import { UserRole } from '../types';
import { 
  CheckCircle2, Circle, Clock, Award, 
  Download, QrCode, ExternalLink, 
  ShieldCheck, Star, BrainCircuit 
} from 'lucide-react';
import { ROLE_THEMES } from '../constants';

const LearningJourney: React.FC = () => {
  const theme = ROLE_THEMES[UserRole.STUDENT];

  const milestones = [
    { id: 1, title: 'Foundations of CS', status: 'COMPLETED', date: 'Sept 2024', topics: ['Logic Gates', 'Binary Math', 'Hardware Basics'], score: 92 },
    { id: 2, title: 'Data Structures & Algorithms', status: 'COMPLETED', date: 'Dec 2024', topics: ['Linked Lists', 'Trees', 'Sorting'], score: 88 },
    { id: 3, title: 'Web Development Core', status: 'IN_PROGRESS', date: 'Mar 2024', topics: ['React', 'Node.js', 'PostgreSQL'], progress: 65 },
    { id: 4, title: 'Advanced Cloud Architecture', status: 'UPCOMING', date: 'May 2024', topics: ['Kubernetes', 'Serverless', 'Terraform'] },
  ];

  const certificates = [
    { id: 'CERT-001', title: 'Data Structures Expert', issued: 'Jan 2025', skills: ['Algorithms', 'Java', 'Memory Mgmt'] },
    { id: 'CERT-002', title: 'UI/UX Design Specialist', issued: 'Feb 2025', skills: ['Figma', 'Prototyping', 'Accessibility'] },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight uppercase">My Learning Journey</h2>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Timeline • Skill Progression • Certifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Timeline Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-xl text-slate-900 tracking-tight mb-10 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Clock size={20}/></div>
              Academic Timeline
            </h3>

            <div className="relative space-y-12">
              {/* Vertical line */}
              <div className="absolute left-6 top-2 bottom-2 w-[2px] bg-slate-100"></div>

              {milestones.map((m, i) => (
                <div key={m.id} className="relative flex gap-10 group">
                  <div className={`z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                    m.status === 'COMPLETED' ? 'bg-emerald-500 text-white scale-110' : 
                    m.status === 'IN_PROGRESS' ? 'bg-indigo-600 text-white animate-pulse' : 
                    'bg-white border-4 border-slate-100 text-slate-300'
                  }`}>
                    {m.status === 'COMPLETED' ? <CheckCircle2 size={24}/> : <Circle size={20}/>}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className={`font-black text-lg ${m.status === 'UPCOMING' ? 'text-slate-400' : 'text-slate-800'}`}>{m.title}</h4>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{m.date}</p>
                      </div>
                      {m.score && (
                        <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black">
                          Score: {m.score}%
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {m.topics.map((topic, j) => (
                        <span key={j} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                          m.status === 'UPCOMING' ? 'bg-slate-50 text-slate-300' : 'bg-slate-50 text-slate-500'
                        }`}>
                          {topic}
                        </span>
                      ))}
                    </div>

                    {m.status === 'IN_PROGRESS' && (
                      <div className="space-y-2 max-w-xs">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-indigo-600 tracking-widest">
                          <span>Current Progress</span>
                          <span>{m.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
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

        {/* Sidebar: Certificates & Skills */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h3 className="font-black text-xl mb-8 tracking-tight flex items-center gap-3">
                <Award className="text-amber-400" size={24}/> 
                Certifications
              </h3>
              
              <div className="space-y-6">
                {certificates.map(cert => (
                  <div key={cert.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-sm">{cert.title}</h4>
                        <p className="text-[10px] font-black text-white/30 uppercase mt-1">ID: {cert.id} • {cert.issued}</p>
                      </div>
                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                        <ShieldCheck size={18}/>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {cert.skills.slice(0, 2).map(s => (
                        <span key={s} className="px-2 py-1 bg-white/10 rounded-md text-[8px] font-black uppercase">{s}</span>
                      ))}
                    </div>
                    <button className="mt-6 w-full py-3 bg-white text-slate-900 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
                      <Download size={14}/> Download PDF
                    </button>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
             <h3 className="font-black text-lg text-slate-900 mb-6 flex items-center gap-2">
               <QrCode size={20} className="text-slate-400"/>
               Verify Profile
             </h3>
             <div className="p-6 bg-slate-50 rounded-3xl flex flex-col items-center justify-center text-center">
               <div className="w-32 h-32 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-4">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://eduspere.edu/verify/alex-j`} alt="Verification QR" className="w-full h-full" />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase leading-relaxed tracking-tighter">
                 Scan to verify your academic records and digital certificates.
               </p>
               <button className="mt-4 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                 Public Profile <ExternalLink size={12}/>
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="bg-indigo-600 p-10 rounded-[3rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <BrainCircuit size={28} className="text-teal-400"/>
              <h4 className="font-black text-2xl tracking-tight">AI Skill Mapping</h4>
            </div>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
              Based on your course performance and certifications, you have achieved <span className="text-white font-black">Level 4 proficiency</span> in Software Architecture. You are outperforming 85% of your peers in Cloud Computing modules.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center min-w-[140px]">
               <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Peer Percentile</div>
               <div className="text-3xl font-black">85%</div>
             </div>
             <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center min-w-[140px]">
               <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Global Rank</div>
               <div className="text-3xl font-black">#142</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningJourney;
