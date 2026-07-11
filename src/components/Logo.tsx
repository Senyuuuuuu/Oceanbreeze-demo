import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightText?: boolean;
}

export default function Logo({
  className = '',
  size = 'md',
  showText = true,
  lightText = false
}: LogoProps) {
  // Dimensions based on size
  const dimensions = {
    sm: { width: '40px', height: '40px' },
    md: { width: '80px', height: '80px' },
    lg: { width: '120px', height: '120px' },
    xl: { width: '200px', height: '200px' }
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* High-Fidelity SVG Vector Logo */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 300 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        {/* Define Gradients & Clip Paths */}
        <defs>
          {/* Sky Gradient (Sunset) */}
          <linearGradient id="skyGrad" x1="150" y1="50" x2="150" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFA866" /> {/* Coral */}
            <stop offset="100%" stopColor="#F57C00" /> {/* Sunset Orange */}
          </linearGradient>

          {/* Wave Gradients */}
          <linearGradient id="waveGrad" x1="150" y1="200" x2="150" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#21C3E8" /> {/* Ocean Blue */}
            <stop offset="100%" stopColor="#0B80A5" /> {/* Darker Ocean Blue */}
          </linearGradient>

          {/* Portal Clip Path to keep elements inside the arch */}
          <clipPath id="archClip">
            <path
              d="M 50,150 
                 A 100,100 0 0,1 250,150 
                 L 250,300 
                 L 50,300 
                 Z"
              fill="white"
            />
          </clipPath>
        </defs>

        {/* Arch Shadow Group */}
        <g filter="url(#drop-shadow)">
          {/* Arch Frame Background (Sky filled with sunset gradient) */}
          <path
            d="M 50,150 
               A 100,100 0 0,1 250,150 
               L 250,300 
               L 50,300 
               Z"
            fill="url(#skyGrad)"
            stroke="#2E2E35"
            strokeWidth="8"
            strokeLinejoin="round"
          />

          {/* Elements inside the Arch, clipped to the arch boundary */}
          <g clipPath="url(#archClip)">
            {/* Sun Rays / Radiants */}
            <line x1="150" y1="150" x2="50" y2="100" stroke="#2E2E35" strokeWidth="4" />
            <line x1="150" y1="150" x2="110" y2="40" stroke="#2E2E35" strokeWidth="4" />
            <line x1="150" y1="150" x2="190" y2="40" stroke="#2E2E35" strokeWidth="4" />
            <line x1="150" y1="150" x2="250" y2="100" stroke="#2E2E35" strokeWidth="4" />
            <line x1="150" y1="150" x2="250" y2="200" stroke="#2E2E35" strokeWidth="4" />
            <line x1="150" y1="150" x2="50" y2="200" stroke="#2E2E35" strokeWidth="4" />

            {/* Orange Sun Circle */}
            <circle cx="160" cy="150" r="45" fill="#F57C00" stroke="#2E2E35" strokeWidth="6" />

            {/* Elegant Building Block on the left side */}
            <rect
              x="85"
              y="130"
              width="60"
              height="115"
              fill="#FFFFFF"
              stroke="#2E2E35"
              strokeWidth="6"
              rx="4"
              strokeLinejoin="round"
            />

            {/* Building Windows (6 yellow rectangles, 2x3 layout) */}
            {/* Column 1 */}
            <rect x="98" y="145" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />
            <rect x="98" y="175" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />
            <rect x="98" y="205" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />

            {/* Column 2 */}
            <rect x="122" y="145" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />
            <rect x="122" y="175" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />
            <rect x="122" y="205" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />

            {/* Waves Layer 1 (Back wave) */}
            <path
              d="M 40,245 
                 Q 90,225 140,245 
                 T 240,245 
                 Q 260,250 280,245
                 L 280,310 
                 L 40,310 
                 Z"
              fill="#0B80A5"
              opacity="0.7"
            />

            {/* Waves Layer 2 (Middle wave) */}
            <path
              d="M 40,255 
                 Q 85,240 130,255 
                 T 220,255 
                 Q 250,260 270,255
                 L 270,310 
                 L 40,310 
                 Z"
              fill="url(#waveGrad)"
              stroke="#2E2E35"
              strokeWidth="5"
            />

            {/* Waves Layer 3 (Front Wave) */}
            <path
              d="M 40,275 
                 Q 95,255 150,275 
                 T 260,275
                 L 260,310 
                 L 40,310 
                 Z"
              fill="#21C3E8"
              stroke="#2E2E35"
              strokeWidth="5"
            />
          </g>

          {/* Arch Foreground Outline (Gives a clean thick border overlay) */}
          <path
            d="M 50,150 
               A 100,100 0 0,1 250,150 
               L 250,300 
               L 50,300 
               Z"
            fill="none"
            stroke="#2E2E35"
            strokeWidth="8"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* Elegant Serif & Sans-Serif Branding Text */}
      {showText && (
        <div className="mt-2 text-center select-none">
          <h1
            className={`font-serif text-2xl font-bold tracking-tight leading-tight ${
              lightText ? 'text-white' : 'text-charcoal'
            }`}
          >
            Ocean Breeze
          </h1>
          <p
            className={`font-sans text-xs font-semibold tracking-[0.25em] uppercase mt-0.5 ${
              lightText ? 'text-sand' : 'text-sunset'
            }`}
          >
            Resort
          </p>
        </div>
      )}
    </div>
  );
}
