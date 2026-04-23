import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="80" height="80" rx="24" fill="url(#logoGrad)" />
          {/* Abstract E/S Intelligence Mark */}
          <path d="M30 35 L70 35" stroke="white" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
          <path d="M30 50 L60 50" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <path d="M30 65 L70 65" stroke="white" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
          {/* Professional Sparkle */}
          <path d="M75 25 L80 30 M75 30 L80 25" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-black tracking-tight text-white leading-none">EduSpere</span>
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Intelligence LMS</span>
      </div>
    </div>
  );
};

export default Logo;