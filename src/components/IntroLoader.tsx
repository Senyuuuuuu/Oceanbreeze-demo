import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface IntroLoaderProps {
  onComplete: () => void;
  key?: React.Key;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  useEffect(() => {
    // Elegant duration for the master SVG reveal to unfold naturally
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  // Framer Motion Animation Settings
  const archVariant = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.4, ease: "easeInOut" }
    }
  };

  const lineVariant = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 0.35,
      transition: { delay: 0.9 + i * 0.08, duration: 0.8, ease: "easeOut" }
    })
  };

  const sunVariant = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.7, type: "spring", stiffness: 90, damping: 14 }
    }
  };

  const buildingVariant = {
    hidden: { scaleY: 0, opacity: 0, originY: 1 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: { delay: 1.2, duration: 0.8, ease: "easeOut" }
    }
  };

  const windowVariant = (delayOffset: number) => ({
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 1.6 + delayOffset, type: "spring", stiffness: 140, damping: 11 }
    }
  });

  const waveVariant1 = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 0.7,
      transition: { delay: 0.9, duration: 1.1, ease: "easeOut" }
    }
  };

  const waveVariant2 = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 1.1, duration: 1.1, ease: "easeOut" }
    }
  };

  const waveVariant3 = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 1.3, duration: 1.1, ease: "easeOut" }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal"
    >
          {/* Subtle background luxury textures and color fades */}
          <div className="absolute inset-0 z-0 opacity-20 flex flex-col justify-between pointer-events-none overflow-hidden">
            <div className="w-full h-1/2 bg-gradient-to-b from-sunset/20 via-coral/5 to-transparent" />
            <div className="w-full h-1/2 bg-gradient-to-t from-ocean/25 via-ocean/5 to-transparent" />
            
            {/* Ambient slow glowing light circles */}
            <motion.div 
              animate={{ 
                scale: [1, 1.18, 1],
                opacity: [0.35, 0.55, 0.35]
              }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute -top-40 -left-40 w-96 h-96 bg-sunset/25 rounded-full blur-[130px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.12, 1],
                opacity: [0.25, 0.45, 0.25]
              }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1.2 }}
              className="absolute -bottom-40 -right-40 w-96 h-96 bg-ocean/25 rounded-full blur-[130px]" 
            />
          </div>

          <div className="relative z-10 flex flex-col items-center select-none">
            {/* Custom High-Fidelity Vector-Drawing Logo Container */}
            <div className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] flex items-center justify-center">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 300 350"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Sky Gradient (Sunset) */}
                  <linearGradient id="skyGrad" x1="150" y1="50" x2="150" y2="300" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFA866" />
                    <stop offset="100%" stopColor="#F57C00" />
                  </linearGradient>

                  {/* Wave Gradients */}
                  <linearGradient id="waveGrad" x1="150" y1="200" x2="150" y2="320" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#21C3E8" />
                    <stop offset="100%" stopColor="#0B80A5" />
                  </linearGradient>

                  {/* Portal Clip Path to keep waves & rays inside the arch */}
                  <clipPath id="archClip">
                    <path
                      d="M 50,150 
                         A 100,100 0 0,1 250,150 
                         L 250,300 
                         L 50,300 
                         Z"
                    />
                  </clipPath>
                </defs>

                {/* Arch Frame Background filled with sunset gradient */}
                <motion.path
                  variants={archVariant}
                  initial="hidden"
                  animate="visible"
                  d="M 50,150 
                     A 100,100 0 0,1 250,150 
                     L 250,300 
                     L 50,300 
                     Z"
                  fill="url(#skyGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                  strokeLinejoin="round"
                />

                {/* Inside elements clipped to stay in the arch */}
                <g clipPath="url(#archClip)">
                  {/* Animated Sun Rays drawing outwards */}
                  <motion.line custom={0} variants={lineVariant} initial="hidden" animate="visible" x1="150" y1="150" x2="50" y2="100" stroke="#FFFFFF" strokeWidth="4" />
                  <motion.line custom={1} variants={lineVariant} initial="hidden" animate="visible" x1="150" y1="150" x2="110" y2="40" stroke="#FFFFFF" strokeWidth="4" />
                  <motion.line custom={2} variants={lineVariant} initial="hidden" animate="visible" x1="150" y1="150" x2="190" y2="40" stroke="#FFFFFF" strokeWidth="4" />
                  <motion.line custom={3} variants={lineVariant} initial="hidden" animate="visible" x1="150" y1="150" x2="250" y2="100" stroke="#FFFFFF" strokeWidth="4" />
                  <motion.line custom={4} variants={lineVariant} initial="hidden" animate="visible" x1="150" y1="150" x2="250" y2="200" stroke="#FFFFFF" strokeWidth="4" />
                  <motion.line custom={5} variants={lineVariant} initial="hidden" animate="visible" x1="150" y1="150" x2="50" y2="200" stroke="#FFFFFF" strokeWidth="4" />

                  {/* Sun Rising (Scaling up with beautiful bounce) */}
                  <motion.circle
                    variants={sunVariant}
                    initial="hidden"
                    animate="visible"
                    cx="160"
                    cy="150"
                    r="45"
                    fill="#F57C00"
                    stroke="#2E2E35"
                    strokeWidth="6"
                  />

                  {/* Elegant Bamboo Beachfront Suite block rising up */}
                  <motion.rect
                    variants={buildingVariant}
                    initial="hidden"
                    animate="visible"
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

                  {/* High-contrast windows pop-in sequence */}
                  <motion.rect variants={windowVariant(0)} initial="hidden" animate="visible" x="98" y="145" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />
                  <motion.rect variants={windowVariant(0.12)} initial="hidden" animate="visible" x="98" y="175" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />
                  <motion.rect variants={windowVariant(0.24)} initial="hidden" animate="visible" x="98" y="205" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />
                  
                  <motion.rect variants={windowVariant(0.06)} initial="hidden" animate="visible" x="122" y="145" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />
                  <motion.rect variants={windowVariant(0.18)} initial="hidden" animate="visible" x="122" y="175" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />
                  <motion.rect variants={windowVariant(0.30)} initial="hidden" animate="visible" x="122" y="205" width="10" height="20" fill="#F7E3A3" stroke="#2E2E35" strokeWidth="4" rx="1" />

                  {/* Ocean Wave 1 (Deep Back Wave) */}
                  <motion.path
                    variants={waveVariant1}
                    initial="hidden"
                    animate="visible"
                    d="M 40,245 
                       Q 90,225 140,245 
                       T 240,245 
                       Q 260,250 280,245
                       L 280,310 
                       L 40,310 
                       Z"
                    fill="#0B80A5"
                  />

                  {/* Ocean Wave 2 (Middle Surf Wave) */}
                  <motion.path
                    variants={waveVariant2}
                    initial="hidden"
                    animate="visible"
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

                  {/* Ocean Wave 3 (Front Surf Wave) */}
                  <motion.path
                    variants={waveVariant3}
                    initial="hidden"
                    animate="visible"
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

                {/* Arch Foreground Overlay Frame */}
                <motion.path
                  variants={archVariant}
                  initial="hidden"
                  animate="visible"
                  d="M 50,150 
                     A 100,100 0 0,1 250,150 
                     L 250,300 
                     L 50,300 
                     Z"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Premium Cascading Typography */}
            <div className="mt-8 text-center">
              <div className="overflow-hidden py-1">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-white"
                >
                  OCEAN BREEZE
                </motion.h1>
              </div>
              
              <div className="overflow-hidden mt-1.5">
                <motion.p
                  initial={{ opacity: 0, letterSpacing: '0.1em', y: 15 }}
                  animate={{ opacity: 1, letterSpacing: '0.38em', y: 0 }}
                  transition={{ delay: 0.9, duration: 1.2, ease: "easeOut" }}
                  className="font-sans text-xs font-bold uppercase text-sand"
                >
                  Resort &bull; La Union
                </motion.p>
              </div>
            </div>

            {/* Premium Progress Bar */}
            <div className="mt-12 w-56 h-[3px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-sand/50 to-transparent"
              />
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.8, ease: 'easeInOut' }}
                className="absolute top-0 bottom-0 left-0 bg-sunset"
              />
            </div>

            {/* Status indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, delay: 1.4 }}
              className="mt-4 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sunset animate-pulse" />
              <span className="font-sans text-[10px] text-gray-400 font-bold uppercase tracking-[0.25em]">
                Opening Paradise
              </span>
            </motion.div>
          </div>
    </div>
  );
}
