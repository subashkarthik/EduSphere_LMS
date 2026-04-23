
import React, { useEffect, useState } from 'react';
import Logo from './Logo';

const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-amber-600/5 rounded-full blur-[160px] animate-pulse delay-1000" />
      
      <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
        {/* Animated Logo Container */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <Logo size={140} className="relative drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
        </div>

        {/* Text Branding */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-[0.2em] leading-none">
            EduSphere
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-8 bg-amber-500/30"></div>
            <p className="text-amber-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em] max-w-[300px] md:max-w-[500px] leading-relaxed opacity-90">
              A Multi-Tenant, AI-Ready Learning Experience Platform (LXP) for Institutions
            </p>
            <div className="h-[1px] w-8 bg-amber-500/30"></div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="absolute bottom-24 w-full max-w-[320px] px-8 flex flex-col items-center gap-6">
        <div className="w-full h-[3px] bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300 ease-out shadow-[0_0_15px_#f59e0b]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></div>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase">
            Securing Gateway
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 safe-bottom">
        <p className="text-slate-700 text-[10px] font-black tracking-[0.5em] uppercase opacity-40">
          Educational Enterprise v4.0
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;