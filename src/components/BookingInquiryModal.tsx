import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, Mail, Phone, User, MessageSquare, Check, Sparkles, ExternalLink, RefreshCw, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { bookingStore, Booking } from '../lib/bookingStore';

interface BookingInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedRoom: string;
  setPreSelectedRoom: (val: string) => void;
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
  guests: string;
  setGuests: (val: string) => void;
}

const ROOM_OPTIONS = [
  { id: 'deluxe', name: 'Deluxe Beachfront Suite' },
  { id: 'sunset', name: 'Sunset Panoramic Villa' },
  { id: 'family', name: 'Spacious Family Loft' },
  { id: 'surfer', name: 'Beachside Eco Cabin' }
];

const formatDateString = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

export default function BookingInquiryModal({
  isOpen,
  onClose,
  preSelectedRoom = 'deluxe',
  setPreSelectedRoom,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests
}: BookingInquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingProgress, setCheckingProgress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  // State for interactive monthly calendar view
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [isPulling, setIsPulling] = useState(false);
  const [showCalendarOverlay, setShowCalendarOverlay] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // 1024px matches lg breakpoint
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Sync pre-selected room and reload blocked dates when opening, and auto-pull from Google Sheet
  useEffect(() => {
    if (isOpen) {
      const defaultRoom = preSelectedRoom || formData.roomType || ROOM_OPTIONS[0].id;
      setFormData(prev => ({
        ...prev,
        roomType: defaultRoom
      }));
      setBlockedDates(bookingStore.getBlockedDates(defaultRoom));
      setIsSuccess(false);
      setErrorText('');
      setConfirmedBooking(null);

      // Trigger automatic background pull from Google Sheet if integrated
      const syncWithSheet = async () => {
        setIsPulling(true);
        try {
          const success = await bookingStore.pullFromSheet();
          if (success) {
            setBlockedDates(bookingStore.getBlockedDates(defaultRoom));
          }
        } catch (e) {
          console.error("Auto-pull failed", e);
        } finally {
          setIsPulling(false);
        }
      };
      syncWithSheet();
    }
  }, [isOpen, preSelectedRoom]);

  // Keep calendar month aligned when user selects checkIn
  useEffect(() => {
    if (checkIn) {
      const date = new Date(checkIn);
      if (!isNaN(date.getTime())) {
        setCalendarMonth(date.getMonth());
        setCalendarYear(date.getFullYear());
      }
    }
  }, [checkIn]);

  // Update blocked dates when room selection changes
  useEffect(() => {
    if (formData.roomType) {
      setBlockedDates(bookingStore.getBlockedDates(formData.roomType));
    }
  }, [formData.roomType]);

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDayIndex = date.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();

    // Pad previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevTotalDays - i,
        isCurrentMonth: false,
        dateString: ''
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(i).padStart(2, '0');
      const dateString = `${year}-${mm}-${dd}`;
      days.push({
        day: i,
        isCurrentMonth: true,
        dateString
      });
    }

    // Pad next month days to complete grid cells (multiples of 7)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const nextPadding = totalCells - days.length;
    for (let i = 1; i <= nextPadding; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        dateString: ''
      });
    }

    return days;
  };

  const getDayStatus = (dateString: string) => {
    if (!dateString) return { isPast: true, isBlocked: false, isCheckIn: false, isCheckOut: false, isInRange: false };

    const today = new Date();
    today.setHours(0,0,0,0);
    const cellDate = new Date(dateString);
    cellDate.setHours(0,0,0,0);

    const isPast = cellDate < today;
    const isBlocked = blockedDates.includes(dateString);
    const isCheckIn = checkIn === dateString;
    const isCheckOut = checkOut === dateString;

    let isInRange = false;
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      isInRange = cellDate > start && cellDate < end;
    }

    return { isPast, isBlocked, isCheckIn, isCheckOut, isInRange };
  };

  const handleDayClick = (dateString: string) => {
    if (!dateString) return;

    // If the clicked date is blocked, don't allow selection
    if (blockedDates.includes(dateString)) return;

    const clickedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (clickedDate < today) return; // don't allow past dates

    // Toggle/Deselect if clicking currently selected check-in date
    if (checkIn === dateString) {
      setCheckIn('');
      setCheckOut('');
      return;
    }

    // Toggle/Deselect if clicking currently selected check-out date
    if (checkOut === dateString) {
      setCheckOut('');
      return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateString);
      setCheckOut('');
    } else {
      const checkInDate = new Date(checkIn);
      if (clickedDate <= checkInDate) {
        setCheckIn(dateString);
        setCheckOut('');
      } else {
        // Verify if any date between checkIn and clickedDate is blocked
        let hasBlockedDateBetween = false;
        const current = new Date(checkInDate);
        current.setDate(current.getDate() + 1);
        while (current < clickedDate) {
          const currentStr = current.toISOString().split('T')[0];
          if (blockedDates.includes(currentStr)) {
            hasBlockedDateBetween = true;
            break;
          }
          current.setDate(current.getDate() + 1);
        }

        if (hasBlockedDateBetween) {
          setCheckIn(dateString);
          setCheckOut('');
        } else {
          setCheckOut(dateString);
        }
      }
    }
  };

  const calendarDays = getDaysInMonth(calendarYear, calendarMonth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'roomType' && setPreSelectedRoom) {
      setPreSelectedRoom(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorText('');

    try {
      // Run automatic sheets checker from store
      const result = await bookingStore.submitWithSheetsCheck({
        ...formData,
        checkIn,
        checkOut,
        guests
      }, (progressText) => {
        setCheckingProgress(progressText);
      });

      setIsSubmitting(false);

      if (result.success) {
        setConfirmedBooking(result.booking);
        setIsSuccess(true);
      } else {
        setErrorText(result.error || 'This room is not available in Google Sheets for these dates.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorText(err.message || 'An error occurred during Google Sheets synchronization.');
    }
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

  // Check if dates selected are already blocked
  const selectedDatesOverlap = checkIn && checkOut && 
    !bookingStore.checkAvailabilityLocal(formData.roomType, checkIn, checkOut);

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
            {isSubmitting ? (
              /* Google Sheets Automated Live Verification Overlay */
              <div className="h-full flex flex-col justify-center items-center text-center py-16 px-4">
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-sunset/10 animate-ping" />
                  <div className="absolute inset-2 rounded-full bg-sunset/20 animate-pulse" />
                  <div className="absolute inset-4 rounded-full bg-white border border-sunset/30 flex items-center justify-center">
                    <FileSpreadsheet className="w-8 h-8 text-sunset" />
                  </div>
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-charcoal">
                  Auto-Checking Calendar
                </h3>
                <p className="text-xs text-sunset font-bold uppercase tracking-widest mt-1.5 animate-pulse">
                  {checkingProgress}
                </p>

                <p className="text-gray-400 text-xs mt-3 max-w-xs">
                  Querying live cells in Google Sheet spreadsheet to verify date overlaps...
                </p>


              </div>
            ) : errorText ? (
              /* Overlapping Error State (Blocked/Slashed UI) */
              <div className="text-center py-8 px-4 flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-100">
                  <AlertTriangle className="w-8 h-8 animate-bounce" />
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-2">
                  Dates Fully Booked!
                </h3>
                
                <p className="text-gray-500 text-xs max-w-sm mb-6 leading-relaxed">
                  The Google Sheets automation checker detected that <strong className="text-charcoal">{ROOM_OPTIONS.find(r => r.id === formData.roomType)?.name}</strong> is already booked for these dates. On the dates below there is a slash representing a lock:
                </p>

                <div className="w-full bg-red-50/50 border border-red-100 rounded-2xl p-4 mb-6">
                  <p className="text-red-700 font-bold text-xs uppercase tracking-wider mb-2">
                    🚫 Slashed & Locked Dates in Sheet:
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {blockedDates.map(d => (
                      <span key={d} className="px-2.5 py-1 text-xs rounded bg-white border border-red-200 text-red-500 line-through font-mono font-bold">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <button
                    onClick={() => setErrorText('')}
                    className="px-6 py-3 rounded-full bg-sunset hover:bg-sunset/90 text-white font-medium text-sm transition-all active:scale-95"
                  >
                    Change Dates
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-full border border-gray-200 hover:bg-slate-50 text-charcoal font-medium text-sm transition-all active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : !isSuccess ? (
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
                    Dates are checked instantly against our master Google Sheet calendar to block double-bookings automatically.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Accommodation Room Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sunset" /> Preferred Accommodation Room Type
                    </label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all cursor-pointer"
                    >
                      {ROOM_OPTIONS.map(room => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dates Selection & Custom Popover */}
                  <div className={`relative ${showCalendarOverlay ? 'z-[1000]' : 'z-10'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5 font-sans">
                          <Calendar className="w-3.5 h-3.5 text-sunset" /> Check-In Date
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowCalendarOverlay(!showCalendarOverlay)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm text-charcoal bg-gray-50/50 hover:bg-slate-100/50 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-ocean ${
                            selectedDatesOverlap ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20' : 'border-gray-200'
                          }`}
                        >
                          <span className="font-sans font-medium">
                            {checkIn ? formatDateString(checkIn) : 'Select Check-In'}
                          </span>
                          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5 font-sans">
                          <Calendar className="w-3.5 h-3.5 text-sunset" /> Check-Out Date
                        </label>
                        <button
                          type="button"
                          disabled={!checkIn}
                          onClick={() => {
                            if (checkIn) {
                              setShowCalendarOverlay(true);
                            }
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-ocean ${
                            !checkIn 
                              ? 'opacity-60 cursor-not-allowed border-gray-150 bg-gray-100/30 text-gray-400' 
                              : selectedDatesOverlap 
                                ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20 text-charcoal' 
                                : 'border-gray-200 bg-gray-50/50 hover:bg-slate-100/50 hover:border-slate-300 text-charcoal'
                          }`}
                        >
                          <span className="font-sans font-medium">
                            {checkOut ? formatDateString(checkOut) : 'Select Check-Out'}
                          </span>
                          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                        </button>
                      </div>
                    </div>

                    {/* Popover Custom Calendar Overlay */}
                    {showCalendarOverlay && (
                      <>
                        {/* Backdrop clicking allows closing */}
                        <div 
                          className="fixed inset-0 z-[1001] cursor-default" 
                          onClick={() => setShowCalendarOverlay(false)} 
                        />
                        
                        <div className="absolute left-0 right-0 mt-2 p-4 bg-white border border-slate-200/80 shadow-2xl rounded-2xl z-[1002] animate-in fade-in slide-in-from-top-3 duration-200 w-full">
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-sunset" />
                              <span className="text-xs font-bold text-charcoal uppercase tracking-wider font-sans">
                                Interactive Stay Calendar
                              </span>
                              {isPulling && (
                                <RefreshCw className="w-3.5 h-3.5 text-sunset animate-spin shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-charcoal transition-colors cursor-pointer text-xs font-bold"
                              >
                                &larr;
                              </button>
                              <span className="text-xs font-bold text-charcoal min-w-[90px] text-center font-serif">
                                {MONTHS[calendarMonth]} {calendarYear}
                              </span>
                              <button
                                type="button"
                                onClick={handleNextMonth}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-charcoal transition-colors cursor-pointer text-xs font-bold"
                              >
                                &rarr;
                              </button>
                            </div>
                          </div>

                          {/* Weekday headers */}
                          <div className="grid grid-cols-7 gap-1 text-center mb-1">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                              <span key={day} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest py-1 font-sans">
                                {day}
                              </span>
                            ))}
                          </div>

                          {/* Days grid */}
                          <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((cell, idx) => {
                              const { isPast, isBlocked, isCheckIn, isCheckOut, isInRange } = getDayStatus(cell.dateString);
                              const isCurrentMonth = cell.isCurrentMonth;
                              
                              let cellClass = "aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-medium relative transition-all ";
                              
                              if (!isCurrentMonth) {
                                cellClass += "text-gray-300 pointer-events-none";
                              } else if (isBlocked) {
                                cellClass += "bg-red-50 text-red-500 line-through cursor-not-allowed border border-red-150/40";
                              } else if (isPast) {
                                cellClass += "text-gray-300 cursor-not-allowed";
                              } else if (isCheckIn || isCheckOut) {
                                cellClass += "bg-gradient-to-br from-sunset to-coral text-white font-bold shadow-md shadow-sunset/15 scale-105 z-10 cursor-pointer";
                              } else if (isInRange) {
                                cellClass += "bg-sunset/15 text-sunset font-semibold cursor-pointer border border-sunset/20";
                              } else {
                                cellClass += "bg-white hover:bg-slate-100 text-charcoal cursor-pointer shadow-sm border border-slate-100";
                              }

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  disabled={!isCurrentMonth || isBlocked || isPast}
                                  onClick={() => handleDayClick(cell.dateString)}
                                  className={cellClass}
                                  title={isBlocked ? "Fully Booked" : cell.dateString}
                                >
                                  <span>{cell.day}</span>
                                  
                                  {isBlocked && isCurrentMonth && (
                                    <span className="absolute bottom-1 text-[8px] text-red-400 font-sans tracking-tighter">
                                      / 🔒
                                    </span>
                                  )}
                                  
                                  {isCheckIn && isCurrentMonth && (
                                    <span className="absolute bottom-0.5 text-[7px] text-white uppercase tracking-tighter scale-90">
                                      In
                                    </span>
                                  )}
                                  {isCheckOut && isCurrentMonth && (
                                    <span className="absolute bottom-0.5 text-[7px] text-white uppercase tracking-tighter scale-90">
                                      Out
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Legend & Controls */}
                          <div className="mt-3.5 pt-3 border-t border-slate-100">
                            <div className="flex flex-wrap items-center justify-between gap-1 text-[9px] mb-3 text-gray-500 font-sans">
                              <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded bg-white border border-slate-200" />
                                <span>Available</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded bg-gradient-to-br from-sunset to-coral" />
                                <span>Check-In/Out</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded bg-sunset/15 border border-sunset/20" />
                                <span>Selected Range</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setCheckIn('');
                                  setCheckOut('');
                                }}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 text-gray-600 font-semibold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Clear Selection
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowCalendarOverlay(false)}
                                className="px-4 py-1.5 rounded-lg bg-sunset hover:bg-sunset/90 text-white font-semibold text-[10px] uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                              >
                                Apply Dates
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {selectedDatesOverlap && (
                    <div className="text-red-500 text-xs font-semibold flex items-center gap-1 bg-red-50 p-2.5 rounded-xl border border-red-100">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Warning: Selected dates are blocked in Google Sheets (slashed). Please select empty days!
                    </div>
                  )}

                  {/* Guests Selector */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sunset" /> Total Guests
                    </label>
                    <select
                      name="guests"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all appearance-none cursor-pointer"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
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
                      <MessageSquare className="w-3.5 h-3.5 text-sunset" /> Special Requests & Wellness Booking
                    </label>
                    <textarea
                      name="message"
                      rows={2}
                      placeholder="Let us know if you need airport shuttle service, early check-in, or wellness packages in La Union!"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all resize-none"
                    />
                  </div>

                  {/* Submission */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] text-gray-400 text-center sm:text-left leading-normal">
                      By submitting, our active Google Sheets connector will automatically approve if dates are free.
                    </p>
                    <button
                      type="submit"
                      disabled={selectedDatesOverlap}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-sunset hover:bg-sunset/90 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sunset/15 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      Verify & Book Now
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success screen (Confirmed with Confirmation Code) */
              <div className="text-center py-6 px-4 flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-5 border border-emerald-100">
                  <Check className="w-8 h-8" />
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-2">
                  Reservation Confirmed!
                </h3>
                
                <p className="text-gray-500 text-xs max-w-sm mx-auto mb-4 leading-relaxed">
                  Excellent! <strong className="text-charcoal">{formData.name}</strong>, the Google Sheet calendar checker found the slot free and booked you in:
                </p>

                <div className="w-full bg-slate-50 border border-gray-100 rounded-2xl p-4 mb-6 text-left space-y-2">
                  <div className="flex justify-between text-xs border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-400">Accommodation:</span>
                    <strong className="text-charcoal">{ROOM_OPTIONS.find(r => r.id === formData.roomType)?.name}</strong>
                  </div>
                  <div className="flex justify-between text-xs border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-400">Check-in / Out:</span>
                    <strong className="text-charcoal">{formData.checkIn} to {formData.checkOut}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-sunset font-bold uppercase tracking-wide">Confirmation Code:</span>
                    <code className="text-sm bg-sunset/10 px-2 py-0.5 rounded border border-sunset/20 font-mono text-sunset font-bold">
                      {confirmedBooking?.confirmationCode || 'OB-DLX-9284'}
                    </code>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-xs justify-center pt-2">
                  <button
                    onClick={onClose}
                    className="w-full py-3 px-6 rounded-full bg-sunset hover:bg-sunset/90 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sunset/15 active:scale-95"
                  >
                    Back to Resort
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
