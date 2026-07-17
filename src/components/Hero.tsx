import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, ArrowRight, Sparkles, Star } from 'lucide-react';
import { bookingStore } from '../lib/bookingStore';

interface HeroProps {
  onOpenBooking: (roomType?: string, datesAndGuests?: { checkIn?: string; checkOut?: string; guests?: string }) => void;
  onChangePage?: (page: string) => void;
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
  guests: string;
  setGuests: (val: string) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const formatDateString = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

const parseLocalDate = (dateString: string): Date => {
  const parts = dateString.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 0, 0, 0, 0);
};

const formatLocalDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const HERO_SLIDES = [
  {
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/500016309_122160869408567801_3523801660810124387_n.jpg',
    title: 'Pristine Beachfront Escape',
    accent: 'La Union Coast & Sun'
  },
  {
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/499882580_122160869432567801_4746683546836728535_n.jpg',
    title: 'Breathtaking Coastal View',
    accent: 'Golden Hour Splendor'
  },
  {
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/499548270_122160869378567801_3422192562523644746_n.jpg',
    title: 'Luxurious Tropical Lounge',
    accent: 'Ocean Breeze Serenity'
  },
  {
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/476117653_122136096512567801_2787783767455324059_n.jpg',
    title: 'Peaceful Sanctuary',
    accent: 'Mindful Retreat'
  },
  {
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/476183028_122136399722567801_208159314301597754_n.jpg',
    title: 'Eco-Luxury Pavilions',
    accent: 'Sustainable Design'
  },
  {
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/480743406_122140595966567801_8029553201407761439_n.jpg',
    title: 'Aura of Serenity',
    accent: 'Tropical Paradise'
  }
];

export default function Hero({ 
  onOpenBooking, 
  onChangePage,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests
}: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Interactive calendar states
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [showCalendarOverlay, setShowCalendarOverlay] = useState(false);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  // Fetch general blocked dates to style the interactive calendar accurately
  useEffect(() => {
    setBlockedDates(bookingStore.getBlockedDates(''));
    const sync = async () => {
      try {
        await bookingStore.pullFromSheet();
        setBlockedDates(bookingStore.getBlockedDates(''));
      } catch (e) {
        console.error("Hero background sheet sync failed", e);
      }
    };
    sync();
  }, []);

  // Sync calendar month/year when check-in is selected
  useEffect(() => {
    if (checkIn) {
      const parts = checkIn.split('-');
      if (parts.length === 3) {
        const year = Number(parts[0]);
        const month = Number(parts[1]) - 1;
        if (!isNaN(year) && !isNaN(month)) {
          setCalendarMonth(month);
          setCalendarYear(year);
        }
      }
    }
  }, [checkIn]);

  // Slide rotation every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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

    // Pad next month days
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
    const cellDate = parseLocalDate(dateString);

    const isPast = cellDate < today;
    const isBlocked = blockedDates.includes(dateString);
    const isCheckIn = checkIn === dateString;
    const isCheckOut = checkOut === dateString;

    let isInRange = false;
    if (checkIn && checkOut) {
      const start = parseLocalDate(checkIn);
      const end = parseLocalDate(checkOut);
      isInRange = cellDate > start && cellDate < end;
    }

    return { isPast, isBlocked, isCheckIn, isCheckOut, isInRange };
  };

  const handleDayClick = (dateString: string) => {
    if (!dateString) return;
    if (blockedDates.includes(dateString)) return;

    const clickedDate = parseLocalDate(dateString);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (clickedDate < today) return;

    // Click same check-in date: toggle check-in and check-out off
    if (checkIn === dateString) {
      setCheckIn('');
      setCheckOut('');
      return;
    }

    // Click same check-out date: toggle check-out off
    if (checkOut === dateString) {
      setCheckOut('');
      return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateString);
      setCheckOut('');
    } else {
      const checkInDate = parseLocalDate(checkIn);
      if (clickedDate <= checkInDate) {
        setCheckIn(dateString);
        setCheckOut('');
      } else {
        // Verify if any date between checkIn and clickedDate is blocked
        let hasBlockedDateBetween = false;
        const current = new Date(checkInDate);
        current.setDate(current.getDate() + 1);
        while (current < clickedDate) {
          const currentStr = formatLocalDate(current);
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

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking(undefined, { checkIn, checkOut, guests });
  };

  const scrollToRooms = () => {
    if (onChangePage) {
      onChangePage('rooms');
      return;
    }
    const roomsSection = document.querySelector('#rooms');
    if (roomsSection) {
      const topOffset = (roomsSection as HTMLElement).offsetTop - 80;
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(topOffset, {
          duration: 1.2,
        });
      } else {
        window.scrollTo({
          top: topOffset,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section id="home" className="relative min-h-screen xl:h-screen w-full bg-charcoal flex flex-col justify-center">
      {/* Background Slide Carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-charcoal/50 z-10" />
            <motion.img
              src={HERO_SLIDES[currentSlide].url}
              alt={HERO_SLIDES[currentSlide].title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              animate={{ scale: [1, 1.08] }}
              transition={{
                duration: 20,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-24 xl:py-0 xl:h-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-8 items-center w-full mt-8 xl:mt-0">
          
          {/* Left Column: Headline and Narrative */}
          <div className="xl:col-span-7 max-w-3xl text-left">
            {/* Animated Accent Pill */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand/20 backdrop-blur-md border border-sand/40 text-sand text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-coral" />
              {HERO_SLIDES[currentSlide].accent}
            </motion.div>
 
            {/* Headline with premium split mask-slide effect */}
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight flex flex-col gap-1.5">
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                >
                  Escape to the
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-sand via-coral to-ocean"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                >
                  Beauty of La Union
                </motion.span>
              </span>
            </h2>
 
            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-white/95 leading-relaxed max-w-2xl font-sans font-light"
            >
              Relax by the sea, enjoy breathtaking sunsets, and experience comfortable beachfront accommodations at Ocean Breeze Resort. Your tropical oasis awaits.
            </motion.p>
 
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <motion.button
                onClick={() => onOpenBooking(undefined, { checkIn, checkOut, guests })}
                whileHover={{ scale: 1.03, boxShadow: "0 12px 24px -6px rgba(245, 124, 0, 0.35)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="px-8 py-3.5 rounded-full bg-sunset text-white font-semibold text-sm uppercase tracking-wider shadow-lg shadow-sunset/30 transition-shadow cursor-pointer focus:outline-none"
              >
                Book Stay Now
              </motion.button>
              <motion.button
                onClick={scrollToRooms}
                whileHover={{ scale: 1.03, bg: "rgba(255, 255, 255, 1)", text: "#2E2E35", boxShadow: "0 12px 24px -6px rgba(255, 255, 255, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="px-8 py-3.5 rounded-full border-2 border-white text-white font-semibold text-sm uppercase tracking-wider transition-all cursor-pointer focus:outline-none"
              >
                View Rooms
              </motion.button>
            </motion.div>
          </div>
 
          {/* Right Column: Glassmorphic Booking Card (Uses relative positioning with screen-height-adapted bottom constraints to prevent overlapping CTA buttons on mobile/tablet) */}
          <div className="xl:col-span-5 w-full relative bottom-[1vh] sm:bottom-[3vh] xl:bottom-0">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              className={`w-full ${showCalendarOverlay ? 'z-[999]' : 'z-20'}`}
            >
              <form
                onSubmit={handleCheckAvailability}
                className="glass-panel p-5 md:p-6 rounded-3xl shadow-xl border border-white/35 grid grid-cols-1 md:grid-cols-4 xl:grid-cols-1 gap-4 items-end"
              >
                <div className={`md:col-span-2 xl:col-span-1 relative ${showCalendarOverlay ? 'z-[1000]' : 'z-10'}`}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5 font-sans">
                        <Calendar className="w-3.5 h-3.5 text-sunset" /> Check-In
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCalendarOverlay(!showCalendarOverlay)}
                        className="w-full text-left px-3 py-2.5 rounded-xl border border-gray-200/50 bg-white/70 hover:bg-white text-charcoal text-xs transition-all cursor-pointer flex items-center justify-between focus:outline-none"
                      >
                        <span className="truncate">{checkIn ? formatDateString(checkIn) : 'Select'}</span>
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5 font-sans">
                        <Calendar className="w-3.5 h-3.5 text-sunset" /> Check-Out
                      </label>
                      <button
                        type="button"
                        disabled={!checkIn}
                        onClick={() => {
                          if (checkIn) {
                            setShowCalendarOverlay(true);
                          }
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between focus:outline-none ${
                          !checkIn 
                            ? 'opacity-60 cursor-not-allowed border-gray-200/30 bg-gray-200/20 text-gray-400' 
                            : 'border-gray-200/50 bg-white/70 hover:bg-white text-charcoal text-xs'
                        }`}
                      >
                        <span className="truncate">{checkOut ? formatDateString(checkOut) : 'Select'}</span>
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
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
                      
                      <div className="absolute bottom-full mb-3 left-0 right-0 xl:bottom-auto xl:top-full xl:mt-2 xl:left-auto xl:right-0 xl:w-[320px] p-4 bg-white border border-slate-200/80 shadow-2xl rounded-2xl z-[1002] animate-in fade-in slide-in-from-top-3 duration-200 text-charcoal">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-sunset" />
                            <span className="text-[10px] font-bold text-charcoal uppercase tracking-wider font-sans">
                              Interactive Stay Calendar
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              className="p-1 rounded hover:bg-slate-150 text-charcoal transition-colors cursor-pointer text-xs font-bold"
                            >
                              &larr;
                            </button>
                            <span className="text-[10px] font-bold text-charcoal min-w-[70px] text-center font-serif">
                              {MONTHS[calendarMonth]} {calendarYear}
                            </span>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className="p-1 rounded hover:bg-slate-150 text-charcoal transition-colors cursor-pointer text-xs font-bold"
                            >
                              &rarr;
                            </button>
                          </div>
                        </div>

                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <span key={day} className="text-[9px] font-bold text-gray-400 uppercase tracking-widest py-0.5 font-sans">
                              {day}
                            </span>
                          ))}
                        </div>

                        {/* Days grid */}
                        <div className="grid grid-cols-7 gap-0.5">
                          {calendarDays.map((cell, idx) => {
                            const { isPast, isBlocked: rawIsBlocked, isCheckIn, isCheckOut, isInRange } = getDayStatus(cell.dateString);
                            const isCurrentMonth = cell.isCurrentMonth;
                            
                            // Fetch/query Google Sheet booked dates status inside the calendar rendering loop
                            const querySheetBookedDates = (dateStr: string): boolean => {
                              if (!dateStr || !isCurrentMonth) return false;
                              return rawIsBlocked || blockedDates.includes(dateStr);
                            };
                            
                            const isBlocked = querySheetBookedDates(cell.dateString);
                            
                            let cellClass = "aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-medium relative transition-all duration-200 ";
                            
                            if (!isCurrentMonth) {
                              cellClass += "text-gray-300 pointer-events-none";
                            } else if (isBlocked) {
                              cellClass += "bg-red-50 text-red-500 line-through cursor-not-allowed border border-red-200/50";
                            } else if (isPast) {
                              cellClass += "text-gray-300 cursor-not-allowed";
                            } else if (isCheckIn || isCheckOut) {
                              cellClass += "bg-gradient-to-br from-sunset to-coral text-white font-bold shadow-lg shadow-sunset/20 scale-110 z-10 cursor-pointer ring-2 ring-sunset ring-offset-1 border border-white";
                            } else if (isInRange) {
                              cellClass += "bg-sunset/15 text-sunset font-semibold cursor-pointer border border-sunset/20";
                            } else {
                              cellClass += "bg-white hover:bg-sunset/10 hover:text-sunset hover:scale-105 text-charcoal cursor-pointer shadow-sm border border-slate-100";
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
                                  <div className="diagonal-slash-overlay" />
                                )}
                                
                                {isCheckIn && isCurrentMonth && (
                                  <span className="absolute bottom-0 text-[5px] text-white uppercase tracking-tighter scale-90">
                                    In
                                  </span>
                                )}
                                {isCheckOut && isCurrentMonth && (
                                  <span className="absolute bottom-0 text-[5px] text-white uppercase tracking-tighter scale-90">
                                    Out
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Legend & Controls */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[8px] mb-2 text-gray-500 font-sans">
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded bg-white border border-slate-200 shrink-0" />
                              <span>Available</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded bg-gradient-to-br from-sunset to-coral shrink-0" />
                              <span>Stay Dates</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded bg-sunset/15 border border-sunset/20 shrink-0" />
                              <span>Range</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded bg-red-50 border border-red-200/50 relative overflow-hidden shrink-0">
                                <span className="absolute inset-0 bg-red-300 transform -rotate-45 h-[1px] top-1/2" />
                              </span>
                              <span>Booked</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setCheckIn('');
                                setCheckOut('');
                              }}
                              className="px-2 py-1 rounded border border-gray-200 hover:bg-slate-50 text-gray-600 font-semibold text-[8px] uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowCalendarOverlay(false)}
                              className="px-3 py-1 rounded bg-sunset hover:bg-sunset/90 text-white font-semibold text-[8px] uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
 
                <div className="md:col-span-1 xl:col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sunset" /> Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200/50 bg-white/70 text-charcoal text-xs focus:outline-none focus:border-ocean transition-all appearance-none cursor-pointer"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
 
                <div className="md:col-span-1 xl:col-span-1">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 20px -5px rgba(245, 124, 0, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="w-full py-2.5 px-4 rounded-xl bg-sunset text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer focus:outline-none flex items-center justify-center gap-1.5"
                  >
                    Check Rates
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </form>
              <div className="flex items-center justify-between px-4 mt-3">
                <span className="text-[10px] text-white/75 font-sans tracking-wide">
                  ⭐ Premium Beachfront Resort in Urbiztondo, La Union
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-sand font-bold">4.8/5</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-sand text-sand" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Decorative Wave Divider at Hero Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[60px] md:h-[90px] text-white fill-current"
          preserveAspectRatio="none"
        >
          <path d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>
    </section>
  );
}
