
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * MANUAL LOGO CHANGE SHORTCUT:
 * 1. Replace the 'src' value below with your image filename (e.g., './logo.png')
 * 2. Or paste a Base64 string directly into 'src'
 * 3. Or use a web URL (e.g., 'https://site.com/logo.png')
 */
const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`} style={{ width: size, height: size }}>
      <img 
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" // REPLACE THIS URL
        alt="EduSphere Logo"
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback if image fails to load
          e.currentTarget.src = "https://ui-avatars.com/api/?name=Ed&background=1e3a8a&color=fff";
        }}
      />
    </div>
  );
};

export default Logo;