import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, Mail, Phone, User, MessageSquare, Check, Sparkles, ExternalLink } from 'lucide-react';

interface BookingInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedRoom?: string;
}

const ROOM_OPTIONS = [
  { id: 'deluxe', name: 'Deluxe Beachfront Suite' },
  { id: 'sunset', name: 'Sunset Panoramic Villa' },
  { id: 'family', name: 'Spacious Family Loft' },
  { id: 'surfer', name: 'Surfer\'s Eco Cabin' }
];

export default function BookingInquiryModal({
  isOpen,
  onClose,
  preSelectedRoom = ''
}: BookingInquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // 1024px matches lg breakpoint
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Sync pre-selected room when opening
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        roomType: preSelectedRoom || prev.roomType || ROOM_OPTIONS[0].id
      }));
      setIsSuccess(false);
    }
  }, [isOpen, preSelectedRoom]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending inquiry API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if ((window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = 'unset';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center lg:justify-start lg:items-stretch p-3 sm:p-4 lg:p-0">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-0"
        />

        {/* Modal Container */}
        <motion.div
          initial={isLargeScreen ? { x: '-100%', opacity: 1 } : { opacity: 0, y: 30 }}
          animate={isLargeScreen ? { x: 0, opacity: 1 } : { opacity: 1, y: 0 }}
          exit={isLargeScreen ? { x: '-100%', opacity: 1 } : { opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          data-lenis-prevent
          className="relative z-10 w-full max-w-2xl lg:max-w-lg lg:w-[500px] h-[85vh] sm:h-auto lg:h-full max-h-[88vh] lg:max-h-full overflow-y-auto rounded-3xl lg:rounded-none lg:rounded-r-3xl bg-white shadow-2xl border border-white/40 flex flex-col"
        >
          {/* Top Decorative Sunset Accent */}
          <div className="h-2 w-full bg-gradient-to-r from-sunset via-coral to-ocean flex-shrink-0" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-charcoal transition-colors focus:outline-none z-20"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-5 sm:p-6 md:p-8 flex-1">
            {!isSuccess ? (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1 text-sunset font-medium text-sm tracking-wide uppercase mb-1">
                    <Sparkles className="w-4 h-4 text-coral animate-pulse" />
                    Boutique Stay Reservation
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-charcoal leading-tight">
                    Inquire For Your Escape
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Please provide your preferred details. We will contact you shortly to complete your booking.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Dates Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sunset" /> Check-In Date
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        required
                        value={formData.checkIn}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sunset" /> Check-Out Date
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        required
                        value={formData.checkOut}
                        onChange={handleChange}
                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all"
                      />
                    </div>
                  </div>

                  {/* Room & Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sunset" /> Preferred Accommodation
                      </label>
                      <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all appearance-none cursor-pointer"
                      >
                        {ROOM_OPTIONS.map(room => (
                          <option key={room.id} value={room.id}>
                            {room.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sunset" /> Total Guests
                      </label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all appearance-none cursor-pointer"
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5">5+ Guests</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-gray-100 my-2" />

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-sunset" /> Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Juana Dela Cruz"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-sunset" /> Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="juana@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-sunset" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+63 917 123 4567"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all"
                      />
                    </div>
                  </div>

                  {/* Message / Requests */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-sunset" /> Special Requests / Surf Lessons Booking
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Let us know if you need airport shuttle service, early check-in, or surf packages in La Union!"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all resize-none"
                    />
                  </div>

                  {/* Submission and alternative booking */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-gray-400 text-center sm:text-left">
                      By submitting, you agree to our 24-hour response protocol.
                    </p>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-sunset hover:bg-sunset/90 text-white font-medium text-sm transition-all shadow-lg shadow-sunset/15 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? 'Sending Request...' : 'Submit Booking Inquiry'}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              /* Success screen */
              <div className="text-center py-8 px-4 flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-charcoal mb-3">
                  Inquiry Successfully Sent!
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
                  Thank you, <strong className="text-charcoal">{formData.name}</strong>. We have received your booking request for{' '}
                  <strong className="text-charcoal">
                    {ROOM_OPTIONS.find(r => r.id === formData.roomType)?.name || 'Accommodation'}
                  </strong>{' '}
                  from <strong className="text-charcoal">{formData.checkIn}</strong> to{' '}
                  <strong className="text-charcoal">{formData.checkOut}</strong>.
                </p>

                <div className="w-full bg-slate-50 border border-gray-100 rounded-2xl p-5 mb-8 max-w-lg">
                  <p className="text-xs text-sunset font-semibold uppercase tracking-wider mb-2">
                    ⚡ Need Instant Confirmation?
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Ocean Breeze Resort is highly active on social media! Connect with us on Facebook Messenger or WhatsApp, where our booking agents can secure your suite in minutes.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                  <a
                    href="https://facebook.com/OceanBreezeResortLaUnion"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-6 rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-medium text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    Message on Messenger <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-6 rounded-full border border-gray-200 hover:bg-slate-50 text-charcoal font-medium text-sm transition-all active:scale-95"
                  >
                    Close & View Site
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
