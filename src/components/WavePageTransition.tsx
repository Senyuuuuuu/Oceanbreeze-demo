import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WavePageTransitionProps {
  trigger: boolean;
  onMidpoint: () => void;
  onComplete: () => void;
}

export default function WavePageTransition({ trigger, onMidpoint, onComplete }: WavePageTransitionProps) {
  const [phase, setPhase] = useState<'idle' | 'covering' | 'uncovering'>('idle');

  useEffect(() => {
    if (trigger) {
      setPhase('covering');
      
      // Midpoint: when the waves completely cover the screen (at 600ms)
      const midpointTimer = setTimeout(() => {
        onMidpoint();
        setPhase('uncovering');
      }, 700);

      // Complete: when the waves have fully cleared the screen (at 1400ms total)
      const completeTimer = setTimeout(() => {
        setPhase('idle');
        onComplete();
      }, 1400);

      return () => {
        clearTimeout(midpointTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [trigger]);

  if (phase === 'idle') return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Wave Layer 1 (Dark Ocean) */}
      <motion.div
        initial={{ y: '100%' }}
        animate={
          phase === 'covering'
            ? { y: '0%', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }
            : { y: '-100%', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }
        }
        className="absolute inset-0 bg-ocean pointer-events-auto flex items-center justify-center"
      >
        {/* Curved Wave Top Edge during movement */}
        {phase === 'covering' && (
          <div className="absolute top-0 left-0 w-[200%] h-[150px] -translate-y-full overflow-hidden">
            <div className="w-full h-full animate-wave-slow">
              <svg className="w-full h-full text-ocean fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M 0 120 Q 300 0, 600 120 T 1200 120 L 1200 120 L 0 120 Z" />
              </svg>
            </div>
          </div>
        )}
        {phase === 'uncovering' && (
          <div className="absolute bottom-0 left-0 w-[200%] h-[150px] translate-y-full overflow-hidden">
            <div className="w-full h-full animate-wave-slow">
              <svg className="w-full h-full text-ocean fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M 0 0 Q 300 120, 600 0 T 1200 0 L 1200 0 L 0 0 Z" />
              </svg>
            </div>
          </div>
        )}
      </motion.div>

      {/* Wave Layer 2 (Glowing Cyan) */}
      <motion.div
        initial={{ y: '100%' }}
        animate={
          phase === 'covering'
            ? { y: '0%', transition: { duration: 0.65, delay: 0.05, ease: [0.76, 0, 0.24, 1] } }
            : { y: '-100%', transition: { duration: 0.65, delay: 0.05, ease: [0.76, 0, 0.24, 1] } }
        }
        className="absolute inset-0 bg-cyan-600 pointer-events-auto"
      >
        {phase === 'covering' && (
          <div className="absolute top-0 left-0 w-[200%] h-[150px] -translate-y-full overflow-hidden">
            <div className="w-full h-full animate-wave-medium">
              <svg className="w-full h-full text-cyan-600 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M 0 120 Q 300 10, 600 120 T 1200 120 L 1200 120 L 0 120 Z" />
              </svg>
            </div>
          </div>
        )}
        {phase === 'uncovering' && (
          <div className="absolute bottom-0 left-0 w-[200%] h-[150px] translate-y-full overflow-hidden">
            <div className="w-full h-full animate-wave-medium">
              <svg className="w-full h-full text-cyan-600 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M 0 0 Q 300 110, 600 0 T 1200 0 L 1200 0 L 0 0 Z" />
              </svg>
            </div>
          </div>
        )}
      </motion.div>

      {/* Wave Layer 3 (Vibrant Seafoam Sky Blue) */}
      <motion.div
        initial={{ y: '100%' }}
        animate={
          phase === 'covering'
            ? { y: '0%', transition: { duration: 0.6, delay: 0.1, ease: [0.76, 0, 0.24, 1] } }
            : { y: '-100%', transition: { duration: 0.6, delay: 0.1, ease: [0.76, 0, 0.24, 1] } }
        }
        className="absolute inset-0 bg-sky-400 pointer-events-auto flex flex-col items-center justify-center"
      >
        {phase === 'covering' && (
          <div className="absolute top-0 left-0 w-[200%] h-[150px] -translate-y-full overflow-hidden">
            <div className="w-full h-full animate-wave-fast">
              <svg className="w-full h-full text-sky-400 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M 0 120 Q 300 20, 600 120 T 1200 120 L 1200 120 L 0 120 Z" />
              </svg>
            </div>
          </div>
        )}
        {phase === 'uncovering' && (
          <div className="absolute bottom-0 left-0 w-[200%] h-[150px] translate-y-full overflow-hidden">
            <div className="w-full h-full animate-wave-fast">
              <svg className="w-full h-full text-sky-400 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M 0 0 Q 300 100, 600 0 T 1200 0 L 1200 0 L 0 0 Z" />
              </svg>
            </div>
          </div>
        )}


      </motion.div>
    </div>
  );
}
