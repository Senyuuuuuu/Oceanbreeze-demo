import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Calendar, ArrowUpRight } from 'lucide-react';
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isSolid
            ? 'py-2.5 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
            : 'py-5 bg-gradient-to-b from-charcoal/45 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className={`font-sans text-[10px] font-semibold tracking-[0.2em] uppercase mt-0.5 transition-colors duration-300 ${
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
              <button
                onClick={() => onOpenBooking()}
                className={`px-5 py-2 rounded-full font-sans text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-lg cursor-pointer hover:shadow-xl active:scale-95 flex items-center gap-1 focus:outline-none ${
                  isSolid
                    ? 'bg-sunset hover:bg-sunset/90 text-white shadow-sunset/15'
                    : 'bg-white hover:bg-sand text-charcoal shadow-black/10'
                }`}
              >
                Book Now
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => onOpenBooking()}
                className={`px-3.5 py-1.5 rounded-full font-sans text-[10px] font-bold tracking-wider uppercase transition-all active:scale-95 flex items-center gap-1 focus:outline-none ${
                  isSolid
                    ? 'bg-sunset text-white'
                    : 'bg-white text-charcoal'
                }`}
              >
                Book
              </button>
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
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-charcoal/60 backdrop-blur-xs"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="absolute top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              {/* Header inside Drawer */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                <div className="flex items-center gap-2">
                  <Logo size="sm" showText={false} />
                  <div className="flex flex-col">
                    <span className="font-serif text-md font-bold text-charcoal leading-none">Ocean Breeze</span>
                    <span className="font-sans text-[9px] font-semibold tracking-wider text-sunset uppercase">Resort</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-md text-charcoal hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links inside Drawer */}
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map(link => {
                  const isActive = activePage === link.id;
                  return (
                    <a
                      key={link.name}
                      href={`#${link.id}`}
                      onClick={(e) => handleLinkClick(e, link.id)}
                      className={`font-sans text-sm font-semibold tracking-wide py-2.5 px-4 rounded-xl transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-sand/30 text-sunset'
                          : 'text-charcoal/80 hover:bg-slate-50'
                      }`}
                    >
                      {link.name}
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-sunset" />}
                    </a>
                  );
                })}
              </nav>

              {/* Action Buttons inside Drawer */}
              <div className="mt-auto border-t border-gray-100 pt-6 space-y-4">
                <div className="flex items-center justify-center gap-2 text-xs text-charcoal/70">
                  <Phone className="w-4 h-4 text-sunset" />
                  <a href="tel:+639171234567" className="hover:underline font-medium">+63 917 123 4567</a>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full py-3 rounded-full bg-sunset hover:bg-sunset/95 text-white font-sans text-xs font-bold uppercase tracking-wider shadow-lg shadow-sunset/15 text-center flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Calendar className="w-4 h-4" /> Book Your Stay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </>
  );
}
