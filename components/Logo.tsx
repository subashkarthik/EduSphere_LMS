
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * UniVerse ERP Logo — SVG university crest with graduation cap
 */
const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#logoGrad)" />
        {/* Building pillars */}
        <rect x="28" y="48" width="6" height="24" rx="1" fill="white" opacity="0.9" />
        <rect x="40" y="48" width="6" height="24" rx="1" fill="white" opacity="0.9" />
        <rect x="54" y="48" width="6" height="24" rx="1" fill="white" opacity="0.9" />
        <rect x="66" y="48" width="6" height="24" rx="1" fill="white" opacity="0.9" />
        {/* Building base */}
        <rect x="24" y="70" width="52" height="5" rx="2" fill="white" opacity="0.95" />
        {/* Building top beam */}
        <rect x="24" y="45" width="52" height="5" rx="2" fill="white" opacity="0.95" />
        {/* Triangular roof */}
        <path d="M20 47 L50 28 L80 47 Z" fill="white" opacity="0.95" />
        {/* Graduation cap */}
        <path d="M50 22 L30 32 L50 42 L70 32 Z" fill="url(#capGrad)" />
        <path d="M65 34 L65 42 Q50 50 35 42 L35 34" fill="url(#capGrad)" opacity="0.7" />
        {/* Tassel */}
        <line x1="65" y1="32" x2="72" y2="40" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <circle cx="72" cy="42" r="2.5" fill="#fbbf24" />
      </svg>
    </div>
  );
};

export default Logo;