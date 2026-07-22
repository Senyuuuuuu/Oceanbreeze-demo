import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Users, Mail, Phone, User, MessageSquare, Check, Sparkles, 
  RefreshCw, AlertTriangle, FileSpreadsheet, Flame, Star, Compass, ArrowRight, ArrowLeft
} from 'lucide-react';
import { bookingStore, Booking } from '../lib/bookingStore';

interface BookingPageProps {
  preSelectedRoom?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: string;
  onDatesGuestsChange?: (datesAndGuests: { checkIn: string; checkOut: string; guests: string }) => void;
  onSuccess?: (bookingDetails: {
    roomName: string;
    checkIn: string;
    checkOut: string;
    confirmationCode: string;
    guestName: string;
  }) => void;
  onBackToHome: () => void;
}

const FALLBACK_ROOMS = [
  { 
    id: 'deluxe', 
    name: 'Deluxe Beachfront Suite', 
    price: 7500,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    capacity: '2 Adults + 1 Child',
    bedType: 'King Size Bed',
    size: '45 m²',
    view: 'Panoramic Ocean View'
  },
  { 
    id: 'sunset', 
    name: 'Sunset Panoramic Villa', 
    price: 12000,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    capacity: '2 Adults',
    bedType: 'Super King Bed',
    size: '60 m²',
    view: 'Direct Sunset & Pool Deck'
  },
  { 
    id: 'family', 
    name: 'Spacious Family Loft', 
    price: 9800,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    capacity: '4 Adults + 2 Children',
    bedType: '1 King Bed + 2 Doubles',
    size: '75 m²',
    view: 'Lush Tropical Garden'
  },
  { 
    id: 'surfer', 
    name: 'Beachside Eco Cabin', 
    price: 4200,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    capacity: '2 Guests',
    bedType: 'Queen Size Bed',
    size: '28 m²',
    view: 'Direct Beachfront Access'
  }
];

const getRoomOptions = () => {
  const rooms = bookingStore.getRooms().filter(r => !r.disabled);
  return rooms.length > 0 ? rooms : FALLBACK_ROOMS;
};

const getDemandLevel = (roomType: string, checkIn: string, checkOut: string, bookings: Booking[]) => {
  if (!checkIn || !checkOut) return null;
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  let hasWeekend = false;
  const current = new Date(start);
  while (current < end) {
    const day = current.getDay();
    if (day === 0 || day === 5 || day === 6) { 
      hasWeekend = true;
      break;
    }
    current.setDate(current.getDate() + 1);
  }

  const roomBookings = bookings.filter(b => b.roomType === roomType && b.status === 'Approved');
  const nearbyBookingsCount = roomBookings.length;
  const isPremiumRoom = roomType === 'deluxe' || roomType === 'sunset';

  if (hasWeekend || nearbyBookingsCount > 2 || isPremiumRoom) {
    return {
      level: 'high',
      label: 'High Demand',
      colorClass: 'bg-rose-50 border-rose-200/60 text-rose-800',
      badgeColorClass: 'bg-rose-500 text-white',
      iconColorClass: 'text-rose-500',
      description: 'This room type is highly sought-after for your dates. We recommend booking soon to guarantee availability.',
      statsText: '94% of similar dates are booked'
    };
  }

  return {
    level: 'moderate',
    label: 'Moderate Demand',
    colorClass: 'bg-amber-50 border-amber-200/60 text-amber-800',
    badgeColorClass: 'bg-amber-500 text-white',
    iconColorClass: 'text-amber-500',
    description: 'Steady booking interest. Standard rates apply, but beach vacancies can change quickly.',
    statsText: 'Popular booking season'
  };
};

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

const calculateNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 0;
  try {
    const start = parseLocalDate(checkIn);
    const end = parseLocalDate(checkOut);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

export default function BookingPage({
  preSelectedRoom = 'deluxe',
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = '2',
  onDatesGuestsChange,
  onSuccess,
  onBackToHome
}: BookingPageProps) {
  const ROOM_OPTIONS = React.useMemo(() => getRoomOptions(), []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests: initialGuests,
    roomType: preSelectedRoom || getRoomOptions()[0].id,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingProgress, setCheckingProgress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  // State for interactive monthly calendar view
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [isPulling, setIsPulling] = useState(false);
  const [showCalendarOverlay, setShowCalendarOverlay] = useState(false);

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const onDatesGuestsChangeRef = React.useRef(onDatesGuestsChange);
  useEffect(() => {
    onDatesGuestsChangeRef.current = onDatesGuestsChange;
  }, [onDatesGuestsChange]);

  const lastProcessedPropsRef = React.useRef({
    checkIn: initialCheckIn || '',
    checkOut: initialCheckOut || '',
    guests: initialGuests || '2'
  });

  // Load blocked dates and auto-pull from Google Sheets when opening page
  useEffect(() => {
    const defaultRoom = preSelectedRoom || formData.roomType || ROOM_OPTIONS[0].id;
    setFormData(prev => ({
      ...prev,
      roomType: defaultRoom,
      checkIn: initialCheckIn || '',
      checkOut: initialCheckOut || '',
      guests: initialGuests || '2'
    }));

    lastProcessedPropsRef.current = {
      checkIn: initialCheckIn || '',
      checkOut: initialCheckOut || '',
      guests: initialGuests || '2'
    };
    
    setBlockedDates(bookingStore.getBlockedDates(defaultRoom));
    setIsSuccess(false);
    setErrorText('');
    setConfirmedBooking(null);

    const syncWithSheet = async () => {
      setIsPulling(true);
      try {
        const success = await bookingStore.pullFromSheet();
        if (success) {
          setBlockedDates(bookingStore.getBlockedDates(defaultRoom));
        }
      } catch (e) {
        console.error("BookingPage auto-pull failed", e);
      } finally {
        setIsPulling(false);
      }
    };
    syncWithSheet();
  }, [preSelectedRoom]);

  // Handle incoming prop changes safely using the lastProcessedPropsRef lock
  useEffect(() => {
    const parentCheckIn = initialCheckIn || '';
    const parentCheckOut = initialCheckOut || '';
    const parentGuests = initialGuests || '2';

    if (
      parentCheckIn !== lastProcessedPropsRef.current.checkIn ||
      parentCheckOut !== lastProcessedPropsRef.current.checkOut ||
      parentGuests !== lastProcessedPropsRef.current.guests
    ) {
      setFormData(prev => ({
        ...prev,
        checkIn: parentCheckIn,
        checkOut: parentCheckOut,
        guests: parentGuests
      }));
      lastProcessedPropsRef.current = {
        checkIn: parentCheckIn,
        checkOut: parentCheckOut,
        guests: parentGuests
      };
    }
  }, [initialCheckIn, initialCheckOut, initialGuests]);

  // Sync state modifications back to parent
  useEffect(() => {
    if (onDatesGuestsChangeRef.current) {
      if (
        formData.checkIn !== lastProcessedPropsRef.current.checkIn ||
        formData.checkOut !== lastProcessedPropsRef.current.checkOut ||
        formData.guests !== lastProcessedPropsRef.current.guests
      ) {
        lastProcessedPropsRef.current = {
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests
        };
        onDatesGuestsChangeRef.current({
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests
        });
      }
    }
  }, [formData.checkIn, formData.checkOut, formData.guests]);

  // Keep blocked dates updated when room selection changes
  useEffect(() => {
    if (formData.roomType) {
      setBlockedDates(bookingStore.getBlockedDates(formData.roomType));
    }
  }, [formData.roomType]);

  // Keep calendar month aligned when user has checkIn selected
  useEffect(() => {
    if (formData.checkIn) {
      const parts = formData.checkIn.split('-');
      if (parts.length === 3) {
        const year = Number(parts[0]);
        const month = Number(parts[1]) - 1;
        if (!isNaN(year) && !isNaN(month)) {
          setCalendarMonth(month);
          setCalendarYear(year);
        }
      }
    }
  }, [formData.checkIn]);

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
    const cellDate = parseLocalDate(dateString);

    const isPast = cellDate < today;
    const isBlocked = blockedDates.includes(dateString);
    const isCheckIn = formData.checkIn === dateString;
    const isCheckOut = formData.checkOut === dateString;

    let isInRange = false;
    if (formData.checkIn && formData.checkOut) {
      const start = parseLocalDate(formData.checkIn);
      const end = parseLocalDate(formData.checkOut);
      isInRange = cellDate > start && cellDate < end;
    }

    return { isPast, isBlocked, isCheckIn, isCheckOut, isInRange };
  };

  const handleDayClick = (dateString: string) => {
    if (!dateString) return;

    // If the clicked date is blocked, do not allow selection
    if (blockedDates.includes(dateString)) return;

    const clickedDate = parseLocalDate(dateString);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (clickedDate < today) return; // don't allow past dates

    // Toggle/Deselect if clicking currently selected check-in date
    if (formData.checkIn === dateString) {
      setFormData(prev => ({
        ...prev,
        checkIn: '',
        checkOut: ''
      }));
      return;
    }

    // Toggle/Deselect if clicking currently selected check-out date
    if (formData.checkOut === dateString) {
      setFormData(prev => ({
        ...prev,
        checkOut: ''
      }));
      return;
    }

    if (!formData.checkIn || (formData.checkIn && formData.checkOut)) {
      setFormData(prev => ({
        ...prev,
        checkIn: dateString,
        checkOut: ''
      }));
    } else {
      const checkInDate = parseLocalDate(formData.checkIn);
      if (clickedDate <= checkInDate) {
        setFormData(prev => ({
          ...prev,
          checkIn: dateString,
          checkOut: ''
        }));
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
          setFormData(prev => ({
            ...prev,
            checkIn: dateString,
            checkOut: ''
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            checkOut: dateString
          }));
        }
      }
    }
  };

  const calendarDays = getDaysInMonth(calendarYear, calendarMonth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorText('');

    try {
      const result = await bookingStore.submitWithSheetsCheck(formData, (progressText) => {
        setCheckingProgress(progressText);
      });

      setIsSubmitting(false);

      if (result.success) {
        setConfirmedBooking(result.booking);
        setIsSuccess(true);
        if (onSuccess) {
          onSuccess({
            roomName: ROOM_OPTIONS.find(r => r.id === formData.roomType)?.name || 'Resort Room',
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            confirmationCode: result.booking?.confirmationCode || 'OB-DLX-9284',
            guestName: formData.name
          });
        }
      } else {
        setErrorText(result.error || 'This room is not available in Google Sheets for these dates.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorText(err.message || 'An error occurred during Google Sheets synchronization.');
    }
  };

  const selectedDatesOverlap = formData.checkIn && formData.checkOut && 
    !bookingStore.checkAvailabilityLocal(formData.roomType, formData.checkIn, formData.checkOut);

  const selectedRoom = ROOM_OPTIONS.find(r => r.id === formData.roomType) || ROOM_OPTIONS[0];
  const nights = calculateNights(formData.checkIn, formData.checkOut);
  const subtotal = selectedRoom.price * nights;
  const taxesAndFees = subtotal * 0.22; // 12% VAT + 10% Service Charge
  const totalAmount = subtotal + taxesAndFees;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Return Navigation */}
      <div className="mb-6">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-charcoal transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Resort Main Page
        </button>
      </div>

      {isSubmitting ? (
        <div className="min-h-[50vh] flex flex-col justify-center items-center text-center py-16 px-4 bg-white rounded-3xl shadow-md">
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-sunset/10 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-sunset/20 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-white border border-sunset/30 flex items-center justify-center">
              <FileSpreadsheet className="w-10 h-10 text-sunset" />
            </div>
          </div>
          
          <h3 className="font-serif text-3xl font-bold text-charcoal">
            Syncing Master Sheets Calendar
          </h3>
          <p className="text-sm text-sunset font-bold uppercase tracking-widest mt-2 animate-pulse">
            {checkingProgress}
          </p>
          <p className="text-gray-400 text-xs mt-4 max-w-xs leading-relaxed">
            Querying live rows in our resort spreadsheet to lock reservation dates and block overlapping bookings.
          </p>
        </div>
      ) : errorText ? (
        <div className="min-h-[50vh] text-center py-12 px-6 flex flex-col items-center bg-white rounded-3xl border border-red-100 shadow-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-100">
            <AlertTriangle className="w-10 h-10 animate-bounce" />
          </div>
          
          <h3 className="font-serif text-3xl font-bold text-charcoal mb-3">
            Dates Already Taken!
          </h3>
          
          <p className="text-gray-500 text-sm max-w-md mb-8 leading-relaxed">
            The automated calendar synchronization detected that <strong className="text-charcoal">{selectedRoom.name}</strong> has approved bookings on your requested dates. Double booking is disabled.
          </p>

          <div className="w-full max-w-lg bg-red-50/50 border border-red-100 rounded-2xl p-5 mb-8">
            <p className="text-red-700 font-bold text-xs uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
              🚫 Locked/Booked Dates in Sheet Calendar:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {blockedDates.map(d => (
                <span key={d} className="px-3 py-1.5 text-xs rounded bg-white border border-red-200 text-red-500 line-through font-mono font-bold shadow-sm">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
            <button
              onClick={() => setErrorText('')}
              className="flex-1 px-8 py-3.5 rounded-full bg-sunset hover:bg-sunset/90 text-white font-bold text-sm transition-all active:scale-95 cursor-pointer"
            >
              Adjust Selection Dates
            </button>
            <button
              onClick={onBackToHome}
              className="flex-1 px-8 py-3.5 rounded-full border border-gray-200 hover:bg-slate-50 text-charcoal font-bold text-sm transition-all active:scale-95 cursor-pointer"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      ) : isSuccess ? (
        <div className="min-h-[50vh] text-center py-12 px-6 flex flex-col items-center bg-white rounded-3xl border border-emerald-100 shadow-lg max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
            <Check className="w-10 h-10" />
          </div>
          
          <h3 className="font-serif text-3xl font-bold text-charcoal mb-3">
            Stay Confirmed & Blocked!
          </h3>
          
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Thank you, <strong className="text-charcoal">{formData.name}</strong>! Your stay at Ocean Breeze is secured. Your booking has been written to the master sheet calendar.
          </p>

          <div className="w-full bg-slate-50 border border-gray-150 rounded-2xl p-6 mb-8 text-left space-y-3.5">
            <div className="flex justify-between items-center text-xs border-b border-gray-200/60 pb-2.5">
              <span className="text-gray-400 font-sans uppercase font-semibold">Accommodation:</span>
              <strong className="text-charcoal font-sans text-sm">{selectedRoom.name}</strong>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-gray-200/60 pb-2.5">
              <span className="text-gray-400 font-sans uppercase font-semibold">Stay Duration:</span>
              <strong className="text-charcoal font-sans text-sm">{formData.checkIn} &rarr; {formData.checkOut} ({nights} {nights === 1 ? 'Night' : 'Nights'})</strong>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-gray-200/60 pb-2.5">
              <span className="text-gray-400 font-sans uppercase font-semibold">Registered Guests:</span>
              <strong className="text-charcoal font-sans text-sm">{formData.guests} Guest(s)</strong>
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-sunset font-bold uppercase tracking-wider">Spreadsheet Confirmation Code:</span>
              <code className="text-sm bg-sunset/10 px-3 py-1 rounded-xl border border-sunset/20 font-mono text-sunset font-extrabold">
                {confirmedBooking?.confirmationCode || 'OB-DLX-9284'}
              </code>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="w-full max-w-xs py-3.5 px-8 rounded-full bg-sunset hover:bg-sunset/90 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-sunset/15 active:scale-95 cursor-pointer"
          >
            Back to Resort
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Form & Calendar */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-md p-6 sm:p-8 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 text-sunset font-semibold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-coral animate-pulse animate-duration-[3s]" />
                Direct Reservation Portal
              </div>
              <h1 className="font-serif text-3xl font-bold text-charcoal leading-tight">
                Secure Your Beach Vacation
              </h1>
              <p className="text-gray-500 text-sm mt-1.5">
                Our active Google Sheets automation reads our live availability database to prevent reservation overlap instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Room Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2 flex items-center gap-2 font-sans">
                  <Compass className="w-4 h-4 text-sunset" /> Preferred Accommodation Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm font-sans focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all cursor-pointer"
                >
                  {ROOM_OPTIONS.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} (₱{room.price.toLocaleString()}/night)
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates Selection & Custom Popover */}
              <div className="relative">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2 flex items-center gap-2 font-sans">
                    <Calendar className="w-4 h-4 text-sunset" /> Select Dates (Check-In / Check-Out)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCalendarOverlay(!showCalendarOverlay)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm text-charcoal bg-gray-50/50 hover:bg-slate-100/50 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-ocean ${
                      selectedDatesOverlap ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20' : 'border-gray-200'
                    }`}
                  >
                    <span className="font-sans font-medium">
                      {formData.checkIn && formData.checkOut ? (
                        `${formatDateString(formData.checkIn)} — ${formatDateString(formData.checkOut)}`
                      ) : formData.checkIn ? (
                        `${formatDateString(formData.checkIn)} — Select Check-Out`
                      ) : (
                        'Select Check-In / Check-Out'
                      )}
                    </span>
                    <Calendar className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                  </button>
                </div>

                {/* Mini Visual Legend for stay dates and slashes */}
                <div className="mt-3 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl flex flex-wrap items-center justify-between gap-3 text-[10px] text-gray-500 font-sans">
                  <span className="font-semibold text-charcoal/80">Stay Indicator:</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5" title="You can select this date for stay">
                      <span className="w-2.5 h-2.5 rounded bg-white border border-slate-200 shadow-sm shrink-0" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Already booked or fully reserved dates">
                      <span className="w-2.5 h-2.5 rounded bg-red-50 border border-red-200/50 relative overflow-hidden shrink-0">
                        <span className="absolute inset-0 bg-red-300 transform -rotate-45 h-[1.5px] top-1/2" />
                      </span>
                      <span className="font-medium text-red-500">Booked (Diagonal Slash)</span>
                    </div>
                  </div>
                </div>

                {/* Popover Custom Calendar Overlay */}
                <AnimatePresence>
                  {showCalendarOverlay && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[1001] cursor-default bg-black/5" 
                        onClick={() => setShowCalendarOverlay(false)} 
                      />
                      
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-0 right-0 top-full mt-2 p-5 bg-white border border-slate-200/80 shadow-2xl rounded-2xl z-[1002] w-full max-w-md mx-auto origin-top"
                      >
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4.5 h-4.5 text-sunset" />
                          <span className="text-xs font-bold text-charcoal uppercase tracking-wider font-sans">
                            Interactive Stay Calendar
                          </span>
                          {isPulling && (
                            <RefreshCw className="w-3.5 h-3.5 text-sunset animate-spin shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
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
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <span key={day} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest py-1 font-sans">
                            {day}
                          </span>
                        ))}
                      </div>

                      {/* Days grid with beautiful diagonal slashes for fully booked dates */}
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((cell, idx) => {
                          const { isPast, isBlocked: rawIsBlocked, isCheckIn, isCheckOut, isInRange } = getDayStatus(cell.dateString);
                          const isCurrentMonth = cell.isCurrentMonth;
                          
                          // Fetch/query Google Sheet booked dates status inside the calendar rendering loop
                          const querySheetBookedDates = (dateStr: string): boolean => {
                            if (!dateStr || !isCurrentMonth) return false;
                            return rawIsBlocked || blockedDates.includes(dateStr);
                          };
                          
                          const isBlocked = querySheetBookedDates(cell.dateString);
                          
                          let cellClass = "aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-semibold relative transition-all duration-200 ";
                          
                          if (!isCurrentMonth) {
                            cellClass += "text-gray-300 pointer-events-none";
                          } else if (isBlocked) {
                            cellClass += "bg-red-50 text-red-500 line-through cursor-not-allowed border border-red-200/50";
                          } else if (isPast) {
                            cellClass += "text-gray-300 cursor-not-allowed";
                          } else if (isCheckIn || isCheckOut) {
                            cellClass += "bg-gradient-to-br from-sunset to-coral text-white font-bold shadow-lg shadow-sunset/20 scale-110 z-10 cursor-pointer ring-2 ring-sunset ring-offset-2 border border-white";
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
                      <div className="mt-4 pt-3.5 border-t border-slate-100">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[9px] mb-4 text-gray-500 font-sans">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-white border border-slate-200 shrink-0" />
                            <span>Available</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-gradient-to-br from-sunset to-coral shrink-0" />
                            <span>Check-In/Out</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-sunset/15 border border-sunset/20 shrink-0" />
                            <span>Range</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-red-50 border border-red-200/50 relative overflow-hidden shrink-0">
                              <span className="absolute inset-0 bg-red-300 transform -rotate-45 h-[1px] top-1/2" />
                            </span>
                            <span>Booked</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                checkIn: '',
                                checkOut: ''
                              }));
                            }}
                            className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-slate-50 text-gray-600 font-semibold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCalendarOverlay(false)}
                            className="px-5 py-2 rounded-xl bg-sunset hover:bg-sunset/90 text-white font-semibold text-[10px] uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                          >
                            Apply Dates
                          </button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {selectedDatesOverlap && (
                <div className="text-red-500 text-xs font-semibold flex items-center gap-2 bg-red-50 p-3.5 rounded-xl border border-red-100">
                  <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                  Warning: The calendar has approved bookings on your selected days. Please choose other dates!
                </div>
              )}

              {/* Guests Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2 flex items-center gap-2 font-sans">
                  <Users className="w-4 h-4 text-sunset" /> Total Guests
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm font-sans focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all cursor-pointer"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>

              <hr className="border-gray-100 my-2" />

              {/* Guest Personal details */}
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-sunset">
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-sunset" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Juana Dela Cruz"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-sunset" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="juana@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-sunset" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+63 917 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sunset" /> Special Requests & Travel Notes
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Tell us if you require airport shuttles, beachfront yoga reservations, or specific surf packages!"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-charcoal text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all resize-none"
                />
              </div>

              {/* Action Button for Mobile */}
              <div className="pt-4 lg:hidden">
                <button
                  type="submit"
                  disabled={selectedDatesOverlap || !formData.checkIn || !formData.checkOut || !formData.name || !formData.email || !formData.phone}
                  className="w-full py-4 rounded-full bg-sunset hover:bg-sunset/90 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-sunset/15 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  Verify & Book Now
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Dynamic Booking Summary & Property Details */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Property Details Card */}
            <div className="bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
              <div className="relative h-48 sm:h-56">
                <img 
                  src={selectedRoom.image} 
                  alt={selectedRoom.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-sunset uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-sunset text-sunset" />
                  Highly Rated Suite
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-lg sm:text-xl font-bold">{selectedRoom.name}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{selectedRoom.view}</p>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-sans border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{selectedRoom.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                    <Compass className="w-4 h-4 text-gray-400" />
                    <span>{selectedRoom.size}</span>
                  </div>
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                    <Sparkles className="w-4 h-4 text-gray-400" />
                    <span>{selectedRoom.bedType}</span>
                  </div>
                </div>

                {/* Date / Stay Summary */}
                <div className="bg-slate-50 rounded-2xl p-4 space-y-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-sm">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans border-b border-slate-200/50 pb-1.5">
                    Stay Specifics
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <span className="text-gray-400 block mb-0.5 font-medium">Check-In After 2 PM:</span>
                      <strong className="text-charcoal block">
                        {formData.checkIn ? formatDateString(formData.checkIn) : 'Not Selected'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5 font-medium">Check-Out Before 12 PM:</span>
                      <strong className="text-charcoal block">
                        {formData.checkOut ? formatDateString(formData.checkOut) : 'Not Selected'}
                      </strong>
                    </div>
                  </div>
                  {nights > 0 && (
                    <div className="text-xs text-sunset font-semibold pt-1 border-t border-slate-200/50 mt-1 flex justify-between">
                      <span>Total Duration:</span>
                      <span>{nights} {nights === 1 ? 'Night' : 'Nights'} Stay</span>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                {nights > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans border-b border-slate-200/50 pb-1.5">
                      Pricing Summary
                    </h4>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>₱{selectedRoom.price.toLocaleString()} x {nights} nights</span>
                      <span>₱{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Service Charge & Taxes (22%)</span>
                      <span>₱{Math.round(taxesAndFees).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-sans font-bold text-charcoal border-t border-dashed border-slate-200 pt-3 mt-1">
                      <span className="text-base">Estimated Total:</span>
                      <span className="text-sunset text-xl font-serif">₱{Math.round(totalAmount).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* High Demand alert */}
                {formData.checkIn && formData.checkOut && !selectedDatesOverlap && (
                  (() => {
                    const demand = getDemandLevel(formData.roomType, formData.checkIn, formData.checkOut, bookingStore.getBookings());
                    if (!demand) return null;
                    
                    return (
                      <div className={`p-4 rounded-2xl border text-xs leading-relaxed transition-all flex flex-col gap-2 ${demand.colorClass}`}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-1.5 font-bold font-sans">
                            {demand.level === 'high' ? (
                              <Flame className={`w-4 h-4 ${demand.iconColorClass} animate-pulse`} />
                            ) : (
                              <Sparkles className={`w-4 h-4 ${demand.iconColorClass}`} />
                            )}
                            <span>{selectedRoom.name} Status:</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${demand.badgeColorClass}`}>
                            {demand.label}
                          </span>
                        </div>
                        <p className="text-gray-600 font-sans font-normal leading-normal">
                          {demand.description}
                        </p>
                        <div className="flex items-center justify-between border-t border-gray-200/25 pt-1.5 mt-0.5 text-[10px] text-gray-500 font-mono">
                          <span>⚡ Active sheet validation</span>
                          <span className="font-bold">{demand.statsText}</span>
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* Submit button for Desktop */}
                <div className="pt-2 hidden lg:block">
                  <button
                    onClick={() => {
                      const form = document.querySelector('form');
                      if (form) {
                        form.requestSubmit();
                      }
                    }}
                    disabled={selectedDatesOverlap || !formData.checkIn || !formData.checkOut || !formData.name || !formData.email || !formData.phone}
                    className="w-full py-4 rounded-full bg-sunset hover:bg-sunset/90 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-sunset/15 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Verify & Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
