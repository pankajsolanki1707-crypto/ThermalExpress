import React from 'react';

interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 text-left focus:outline-none transition active:scale-98 cursor-pointer ${className}`}
      title="Thermal Express - Return to Home Workspace"
    >
      {/* Fresh Premium Vector Icon */}
      <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 p-2 text-white shadow-md shadow-emerald-500/25 flex items-center justify-center overflow-hidden group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
        {/* Subtle Ambient Light Glow */}
        <div className="absolute -top-4 -right-4 w-10 h-10 bg-white/25 rounded-full blur-md" />
        
        {/* Fresh Vector SVG: Modern Thermal Printer & Lightning Bolt */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 relative z-10 text-white drop-shadow-xs stroke-current"
        >
          {/* Thermal Receipt Paper Roll Outline */}
          <path
            d="M6 3H18C19.1046 3 20 3.89543 20 5V19L17 17.5L14 19L11 17.5L8 19L5 17.5V5C5 3.89543 5.89543 3 7 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255, 255, 255, 0.15)"
          />
          {/* Fast Express Lightning Bolt cut */}
          <path
            d="M13 7L9 13H13L11 19L16 12H12L13 7Z"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Name Typography */}
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-black text-base tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
            Thermal<span className="text-emerald-600">Express</span>
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
            POS
          </span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
          Zero-Signup Counter Billing
        </p>
      </div>
    </button>
  );
};
