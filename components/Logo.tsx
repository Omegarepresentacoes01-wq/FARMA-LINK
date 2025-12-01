import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 120 120"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
       {/* 
         Farma Link Icon Construction:
         - A stylized "V" or Chevron pointing left.
         - Top arm: Bright Teal (#00C4B4).
         - Bottom arm: Deep Blue (#0B4778).
         - Center: A white link/chain icon joining them.
      */}

      {/* Bottom Arm (Deep Blue) */}
      <path 
        d="M 42 60 L 85 95" 
        stroke="#0B4778" 
        strokeWidth="22" 
        strokeLinecap="round" 
      />

      {/* Top Arm (Bright Teal) */}
      <path 
        d="M 85 25 L 42 60" 
        stroke="#00C4B4" 
        strokeWidth="22" 
        strokeLinecap="round" 
      />

      {/* Link Icon (White) - Stylized chain link at the joint */}
      <g transform="translate(42, 60)">
          {/* Link part 1 (upper right) */}
          <path 
            d="M 6 -6 L 14 -14" 
            stroke="white" 
            strokeWidth="5" 
            strokeLinecap="round" 
          />
          {/* Link part 2 (lower left) */}
          <path 
            d="M -6 6 L -14 14" 
            stroke="white" 
            strokeWidth="5" 
            strokeLinecap="round" 
          />
          {/* Connection Body */}
          <rect 
            x="-8" 
            y="-8" 
            width="16" 
            height="16" 
            rx="5" 
            stroke="white" 
            strokeWidth="4" 
            fill="#0B4778" /* Trick to mask overlap if needed, but fill none is better for transparency */
            fillOpacity="0"
          />
          {/* Let's draw the link explicitly as two interlocking loops for clarity */}
          <circle cx="0" cy="0" r="8" stroke="white" strokeWidth="4" />
      </g>
      
      {/* Refined Link Icon overlay to look like the image (Chain) */}
      <g transform="translate(42, 60) rotate(-45)">
         <path d="M -8 0 H 8" stroke="white" strokeWidth="4" strokeLinecap="round" />
         <path d="M -5 -5 L 5 5" stroke="white" strokeWidth="0" /> {/* Spacer */}
         <rect x="-10" y="-6" width="20" height="12" rx="6" stroke="white" strokeWidth="3" fill="none" />
      </g>
    </svg>
  );
};