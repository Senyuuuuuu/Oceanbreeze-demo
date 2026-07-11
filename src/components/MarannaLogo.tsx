import React from 'react';

interface MarannaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  withText?: boolean;
  inverse?: boolean; // If true, gold lines on transparent/navy, if false dark blue lines
}

export default function MarannaLogo({
  className = '',
  size = 'md',
  withText = true,
  inverse = true
}: MarannaLogoProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
    custom: ''
  };

  const strokeColor = inverse ? '#E5BF71' : '#0B1E36';
  const textColor = inverse ? '#E5BF71' : '#0B1E36';
  const subtextColor = inverse ? '#E2C285' : '#475569';

  return (
    <div className={`flex flex-col items-center justify-center text-center font-serif ${className}`}>
      <div className={`relative ${sizeClasses[size]} select-none flex items-center justify-center`}>
        {/* Vector SVG for the cloche and growing vines inside an arch */}
        <svg
          viewBox="0 0 300 350"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Gold Archway */}
          <path
            d="M 60,180 A 90,90 0 0,1 240,180 L 240,300 L 60,300 Z"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Parallel Arch Accent */}
          <path
            d="M 70,180 A 80,80 0 0,1 230,180 L 230,296 L 70,296 Z"
            stroke={strokeColor}
            strokeWidth="2"
            strokeOpacity="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Growing Vines / Flowers */}
          {/* Center Vine */}
          <path
            d="M 150,230 C 150,210 160,190 155,160 C 150,130 165,110 155,100"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Left Vine */}
          <path
            d="M 125,240 C 120,210 115,190 130,165 C 135,145 130,130 135,120"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Right Vine */}
          <path
            d="M 175,240 C 180,210 185,190 170,165 C 165,145 170,130 165,120"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Leaves and Buds */}
          {/* Central top flower bud */}
          <path
            d="M 155,100 Q 145,90 155,80 Q 165,90 155,100 Z"
            fill={strokeColor}
            opacity="0.2"
          />
          <path
            d="M 155,100 Q 145,90 155,80 Q 165,90 155,100 Z"
            stroke={strokeColor}
            strokeWidth="3"
          />
          {/* Central leaves */}
          <path
            d="M 153,150 Q 140,145 145,135 Q 155,140 153,150 Z"
            fill={strokeColor}
            stroke={strokeColor}
            strokeWidth="1"
          />
          <path
            d="M 155,180 Q 168,175 163,165 Q 153,170 155,180 Z"
            fill={strokeColor}
            stroke={strokeColor}
            strokeWidth="1"
          />

          {/* Left flower bud */}
          <path
            d="M 135,120 Q 125,110 135,102 Q 145,110 135,120 Z"
            fill={strokeColor}
            opacity="0.2"
          />
          <path
            d="M 135,120 Q 125,110 135,102 Q 145,110 135,120 Z"
            stroke={strokeColor}
            strokeWidth="3"
          />
          {/* Left leaves */}
          <path
            d="M 118,185 Q 105,180 110,170 Q 120,175 118,185 Z"
            fill={strokeColor}
            stroke={strokeColor}
            strokeWidth="1"
          />
          <path
            d="M 124,215 Q 112,210 116,200 Q 126,205 124,215 Z"
            fill={strokeColor}
            stroke={strokeColor}
            strokeWidth="1"
          />

          {/* Right flower bud */}
          <path
            d="M 165,120 Q 155,110 165,102 Q 175,110 165,120 Z"
            fill={strokeColor}
            opacity="0.2"
          />
          <path
            d="M 165,120 Q 155,110 165,102 Q 175,110 165,120 Z"
            stroke={strokeColor}
            strokeWidth="3"
          />
          {/* Right leaves */}
          <path
            d="M 182,185 Q 195,180 190,170 Q 180,175 182,185 Z"
            fill={strokeColor}
            stroke={strokeColor}
            strokeWidth="1"
          />
          <path
            d="M 176,215 Q 188,210 184,200 Q 174,205 176,215 Z"
            fill={strokeColor}
            stroke={strokeColor}
            strokeWidth="1"
          />

          {/* Dining Plate Dome / Cloche */}
          <path
            d="M 74,290 C 74,220 226,220 226,290 Z"
            fill={inverse ? '#0B1E36' : '#FFFFFF'}
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Radial Lines on Cloche for Shine Effect */}
          <path
            d="M 150,225 C 150,225 150,290 150,290"
            stroke={strokeColor}
            strokeWidth="2"
            strokeOpacity="0.4"
          />
          <path
            d="M 112,240 C 125,255 135,290 135,290"
            stroke={strokeColor}
            strokeWidth="2"
            strokeOpacity="0.4"
          />
          <path
            d="M 188,240 C 175,255 165,290 165,290"
            stroke={strokeColor}
            strokeWidth="2"
            strokeOpacity="0.4"
          />

          {/* Cloche Knob */}
          <path
            d="M 138,225 C 138,218 162,218 162,225 Z"
            fill={strokeColor}
            stroke={strokeColor}
            strokeWidth="2"
          />
          <circle cx="150" cy="216" r="8" fill={strokeColor} />

          {/* Underplate Base Tray */}
          <path
            d="M 52,298 L 248,298 Q 252,298 250,304 L 244,310 Q 242,312 238,312 L 62,312 Q 58,312 56,310 L 50,304 Q 48,298 52,298 Z"
            fill={inverse ? '#0D213F' : '#F1F5F9'}
            stroke={strokeColor}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {withText && (
        <div className="mt-4 flex flex-col items-center">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-[0.15em] uppercase"
            style={{ color: textColor }}
          >
            Maranna
          </h1>
          <p
            className="text-[10px] md:text-xs font-sans tracking-[0.4em] uppercase mt-2 font-medium"
            style={{ color: subtextColor }}
          >
            International Cuisine
          </p>
        </div>
      )}
    </div>
  );
}
