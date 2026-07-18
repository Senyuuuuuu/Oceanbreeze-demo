import React from 'react';
import Logo from './Logo';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onChangePage: (page: string) => void;
}

export default function Footer({ onOpenBooking, onChangePage }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, pageId: string) => {
    e.preventDefault();
    onChangePage(pageId);
  };

  return (
    <footer className="bg-charcoal text-white pt-20 pb-8 relative overflow-hidden border-t-4 border-sunset">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sunset/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-ocean/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <Logo size="md" lightText={true} className="mb-6" />
            <p className="text-gray-400 font-sans text-xs leading-relaxed max-w-sm mt-4 font-light">
              Experience beachfront boutique luxury on the sands of San Juan, La Union. Relax beside pristine waves, gaze at breathtaking sunset canvases, and indulge in warm, authentic Filipino hospitality.
            </p>
            {/* Social Icons row */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://facebook.com/OceanBreezeResortLaUnion"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-sunset text-white flex items-center justify-center transition-all hover:scale-105"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://instagram.com/OceanBreezeResortLaUnion"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-sunset text-white flex items-center justify-center transition-all hover:scale-105"
                aria-label="Instagram Page"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="mailto:reservations@oceanbreezelaunion.com"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-sunset text-white flex items-center justify-center transition-all hover:scale-105"
                aria-label="Send Email"
              >
                <Mail className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 text-center md:text-left">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-sand mb-6">
              Quick Navigation
            </h4>
            <nav className="flex flex-col gap-3 font-sans text-xs text-gray-400 font-medium">
              <a href="#home" onClick={(e) => handleLinkClick(e, 'home')} className="hover:text-sand hover:underline transition-colors">
                Home Base
              </a>
              <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-sand hover:underline transition-colors">
                About the Resort
              </a>
              <a href="#rooms" onClick={(e) => handleLinkClick(e, 'rooms')} className="hover:text-sand hover:underline transition-colors">
                Suites & Villas
              </a>
              <a href="#amenities" onClick={(e) => handleLinkClick(e, 'amenities')} className="hover:text-sand hover:underline transition-colors">
                Resort Amenities
              </a>
              <a href="#gallery" onClick={(e) => handleLinkClick(e, 'gallery')} className="hover:text-sand hover:underline transition-colors">
                Photo Gallery
              </a>
              <a href="#location" onClick={(e) => handleLinkClick(e, 'location')} className="hover:text-sand hover:underline transition-colors">
                Getting Here
              </a>
            </nav>
          </div>

          {/* Column 3: Local Coordinates */}
          <div className="lg:col-span-3 text-center md:text-left">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-sand mb-6">
              Local Coordinates
            </h4>
            <div className="space-y-4 text-xs text-gray-400 font-light leading-relaxed">
              <div className="flex items-start justify-center md:justify-start gap-3">
                <MapPin className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                <span>National Highway, Urbiztondo, San Juan, La Union, 2514, Philippines</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="w-4.5 h-4.5 text-ocean shrink-0" />
                <a href="tel:+639171234567" className="hover:text-white transition-colors">
                  +63 917 123 4567
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Mail className="w-4.5 h-4.5 text-coral shrink-0" />
                <a href="mailto:reservations@oceanbreezelaunion.com" className="hover:text-white transition-colors">
                  reservations@oceanbreezelaunion.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Booking shortcuts */}
          <div className="lg:col-span-2 text-center md:text-left flex flex-col justify-between">
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-sand mb-6">
                Reserve Stay
              </h4>
              <p className="text-gray-400 font-sans text-[11px] leading-relaxed font-light mb-4">
                Instantly trigger calendar inquiries to secure your sunset villa.
              </p>
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 rounded-xl bg-sunset hover:bg-sunset/90 text-white font-sans text-[10px] font-bold uppercase tracking-wider transition-all active:scale-98 shadow-md"
              >
                Inquire Now
              </button>
            </div>
            
            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="mt-6 md:mt-0 py-2 text-[10px] text-white/50 hover:text-white font-semibold uppercase tracking-wider flex items-center justify-center md:justify-start gap-1 focus:outline-none cursor-pointer"
            >
              Scroll To Top <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-white/5 pt-8 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-gray-500 font-sans text-[11px] font-light">
              © {new Date().getFullYear()} Ocean Breeze Resort, La Union. All Rights Reserved.
            </p>
            <span className="hidden sm:inline text-white/15">•</span>
            <a
              href="#automation"
              onClick={(e) => handleLinkClick(e, 'automation')}
              className="text-gray-500 hover:text-sunset transition-colors text-[11px] font-sans font-semibold hover:underline"
            >
              Automation & API Hub
            </a>
          </div>
          <p className="text-gray-500 font-sans text-[10px] flex items-center gap-1 justify-center font-light">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> on the shores of San Juan, La Union.
          </p>
        </div>
      </div>
    </footer>
  );
}
