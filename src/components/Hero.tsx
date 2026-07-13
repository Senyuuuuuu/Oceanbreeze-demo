import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, ArrowRight, Sparkles, Star } from 'lucide-react';

interface HeroProps {
  onOpenBooking: (roomType?: string) => void;
  onChangePage?: (page: string) => void;
}

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

export default function Hero({ onOpenBooking, onChangePage }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  // Slide rotation every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    // Open the booking modal with current parameters
    onOpenBooking();
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
    <section id="home" className="relative min-h-screen xl:h-screen w-full overflow-hidden bg-charcoal flex flex-col justify-center">
      {/* Background Slide Carousel */}
      <div className="absolute inset-0 z-0">
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-24 xl:py-0 xl:h-full">
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
                onClick={() => onOpenBooking()}
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
              className="w-full z-20"
            >
              <form
                onSubmit={handleCheckAvailability}
                className="glass-panel p-5 md:p-6 rounded-3xl shadow-xl border border-white/35 grid grid-cols-1 md:grid-cols-4 xl:grid-cols-1 gap-4 items-end"
              >
                <div className="md:col-span-1 xl:col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sunset" /> Check-In
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200/50 bg-white/70 text-charcoal text-xs focus:outline-none focus:border-ocean transition-all"
                  />
                </div>
 
                <div className="md:col-span-1 xl:col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sunset" /> Check-Out
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200/50 bg-white/70 text-charcoal text-xs focus:outline-none focus:border-ocean transition-all"
                  />
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
