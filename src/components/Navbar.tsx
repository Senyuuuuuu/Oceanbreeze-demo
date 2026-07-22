import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Calendar, ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onOpenBooking: (roomType?: string) => void;
  activePage: string;
  onChangePage: (page: string) => void;
}

const NAV_LINKS = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Rooms', id: 'rooms' },
  { name: 'Restaurant', id: 'restaurant' },
  { name: 'Amenities', id: 'amenities' },
  { name: 'Gallery', id: 'gallery' },
  { name: 'Contact', id: 'location' }
];

export default function Navbar({ onOpenBooking, activePage, onChangePage }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track page scroll to toggle solid background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolid = activePage !== 'home' || isScrolled;

  // Handle mobile menu clicks and close menu
  const handleLinkClick = (e: React.MouseEvent, pageId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onChangePage(pageId);
  };

  // Stagger animation variants for the mobile list
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 25 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 24
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 flex items-center ${
          isSolid
            ? 'h-[70px] bg-white/95 backdrop-blur-[15px] shadow-md border-b border-gray-100'
            : 'h-[90px] bg-gradient-to-b from-charcoal/45 to-transparent'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, 'home')}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <Logo
                size="sm"
                showText={false}
                className="scale-90 md:scale-100 transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span
                  className={`font-serif text-lg md:text-xl font-bold tracking-tight leading-none transition-colors duration-300 ${
                    isSolid ? 'text-charcoal' : 'text-white'
                  }`}
                >
                  Ocean Breeze
                </span>
                <span
                  className={`font-seasons text-[10px] font-semibold tracking-[0.2em] uppercase mt-0.5 transition-colors duration-300 ${
                    isSolid ? 'text-sunset' : 'text-sand'
                  }`}
                >
                  Resort
                </span>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(link => {
                const isActive = activePage === link.id;
                return (
                  <a
                    key={link.name}
                    href={`#${link.id}`}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className={`font-sans text-xs uppercase font-semibold tracking-wider relative py-1 transition-colors duration-300 focus:outline-none ${
                      isActive
                        ? isSolid ? 'text-sunset' : 'text-sand'
                        : isSolid ? 'text-charcoal/80 hover:text-sunset' : 'text-white/80 hover:text-sand'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                          isSolid ? 'bg-sunset' : 'bg-sand'
                        }`}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Book Now Button (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+639171234567"
                className={`flex items-center gap-1.5 font-sans text-xs font-semibold tracking-wide transition-colors ${
                  isSolid ? 'text-charcoal/75 hover:text-sunset' : 'text-white/85 hover:text-sand'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-coral" /> +63 917 123 4567
              </a>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
                  isSolid ? 'text-charcoal hover:bg-slate-100' : 'text-white hover:bg-white/10'
                }`}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-charcoal/50 backdrop-blur-md"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 380 }}
              dragElastic={{ left: 0.02, right: 0.6 }}
              onDragEnd={(e, info) => {
                // If dragged to the right by more than 80px, or with high velocity, close the menu
                if (info.offset.x > 80 || info.velocity.x > 300) {
                  setIsMobileMenuOpen(false);
                }
              }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col p-6 overflow-y-auto border-l border-slate-100 touch-pan-y"
            >
              {/* Drag Handle Bar Indicator (Visual cue for touch swipe to close) */}
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-14 bg-slate-200/80 rounded-full flex flex-col justify-between py-1 px-[1px] pointer-events-none">
                <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
              </div>

              {/* Header inside Drawer */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                <div className="flex items-center gap-2.5">
                  <Logo size="sm" showText={false} />
                  <div className="flex flex-col">
                    <span className="font-serif text-md font-bold text-charcoal leading-none">Ocean Breeze</span>
                    <span className="font-sans text-[9px] font-bold tracking-[0.2em] text-sunset uppercase mt-0.5">Resort</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-charcoal hover:bg-slate-150 transition-colors focus:outline-none"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links inside Drawer with staggered animations */}
              <motion.nav 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-2.5"
              >
                {NAV_LINKS.map(link => {
                  const isActive = activePage === link.id;
                  return (
                    <motion.div key={link.id} variants={itemVariants}>
                      <a
                        href={`#${link.id}`}
                        onClick={(e) => handleLinkClick(e, link.id)}
                        className={`group font-sans text-xs uppercase font-bold tracking-wider py-3 px-4 rounded-xl transition-all flex items-center justify-between border ${
                          isActive
                            ? 'bg-sunset/10 text-sunset border-sunset/20 shadow-xs'
                            : 'text-charcoal/80 hover:bg-slate-50 border-transparent hover:text-charcoal'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            isActive ? 'bg-sunset scale-125' : 'bg-transparent group-hover:bg-slate-300'
                          }`} />
                          {link.name}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                          isActive ? 'text-sunset translate-x-0.5' : 'text-gray-300 group-hover:text-charcoal group-hover:translate-x-0.5'
                        }`} />
                      </a>
                    </motion.div>
                  );
                })}
              </motion.nav>



              {/* Action Buttons inside Drawer */}
              <div className="mt-auto border-t border-gray-100 pt-6 space-y-4">
                <div className="flex items-center justify-center gap-2 text-xs text-charcoal/70">
                  <Phone className="w-4 h-4 text-sunset shrink-0" />
                  <a href="tel:+639171234567" className="hover:underline font-semibold font-sans">+63 917 123 4567</a>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full py-3.5 rounded-full bg-sunset hover:bg-sunset/95 text-white font-sans text-xs font-bold uppercase tracking-wider shadow-lg shadow-sunset/20 text-center flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 shrink-0" /> Book Your Stay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </>
  );
}
