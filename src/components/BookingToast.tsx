import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Calendar, Sparkles, MapPin } from 'lucide-react';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  checkIn: string;
  checkOut: string;
  confirmationCode: string;
  guestName: string;
  duration?: number; // duration in ms
}

export default function BookingToast({
  isOpen,
  onClose,
  roomName,
  checkIn,
  checkOut,
  confirmationCode,
  guestName,
  duration = 6000
}: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-[9999] w-full max-w-sm sm:max-w-md bg-white border border-emerald-100 rounded-2xl shadow-xl shadow-charcoal/5 overflow-hidden flex flex-col font-sans"
        >
          {/* Active Color Highlight Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-ocean" />

          <div className="p-4 sm:p-5 flex gap-4 items-start">
            {/* Elegant Check Badge */}
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 border border-emerald-100 shrink-0">
              <Check className="w-5 h-5 animate-pulse" />
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 font-sans flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Inquiry Received
                </span>
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-slate-100 text-gray-400 hover:text-charcoal transition-colors focus:outline-none"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="font-serif text-base font-bold text-charcoal truncate">
                Booking Confirmed!
              </h4>

              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Thank you, <strong className="text-charcoal font-semibold">{guestName}</strong>! Our live Google Sheets calendar checker verified your slot and has booked your stay.
              </p>

              {/* Booking Summary Box */}
              <div className="mt-3 bg-slate-50/80 rounded-xl border border-slate-100 p-2.5 space-y-1.5 text-[11px] font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Room:</span>
                  <span className="text-charcoal font-bold">{roomName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Dates:</span>
                  <span className="text-charcoal font-semibold flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-sunset" /> {checkIn} — {checkOut}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100/60">
                  <span className="text-sunset font-bold uppercase tracking-wider text-[9px]">Confirm Code:</span>
                  <code className="bg-sunset/10 px-1.5 py-0.5 rounded border border-sunset/15 font-mono text-sunset font-bold text-[10px]">
                    {confirmationCode}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Animating Timer Progress Bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className="h-1 bg-emerald-500/30 w-full self-start"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
