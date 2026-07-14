/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Welcome from './components/Welcome';
import Rooms from './components/Rooms';
import Amenities from './components/Amenities';
import Gallery from './components/Gallery';
import WhyChooseUs from './components/WhyChooseUs';
import Location from './components/Location';
import Footer from './components/Footer';
import Restaurant from './components/Restaurant';
import BookingInquiryModal from './components/BookingInquiryModal';
import PageHeader from './components/PageHeader';
import IntroLoader from './components/IntroLoader';
import ChatBot from './components/ChatBot';
import AutomationHub from './components/AutomationHub';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState<string>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preSelectedRoom, setPreSelectedRoom] = useState<string>('deluxe');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<string>('2');

  const handleOpenBooking = (roomType?: string, datesAndGuests?: { checkIn?: string, checkOut?: string, guests?: string }) => {
    if (roomType) {
      setPreSelectedRoom(roomType);
    }
    if (datesAndGuests) {
      if (datesAndGuests.checkIn) setCheckIn(datesAndGuests.checkIn);
      if (datesAndGuests.checkOut) setCheckOut(datesAndGuests.checkOut);
      if (datesAndGuests.guests) setGuests(datesAndGuests.guests);
    }
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  // Initialize Lenis for smooth momentum-scrolling
  useEffect(() => {
    if (isLoading) return;

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    const raf = (time: number) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    (window as any).lenis = lenisInstance;

    return () => {
      lenisInstance.destroy();
      (window as any).lenis = undefined;
    };
  }, [isLoading]);

  const handlePageChange = (pageId: string) => {
    setActivePage(pageId);
  };

  // Scroll to top on page transition
  useEffect(() => {
    if (isLoading) return;

    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [activePage, isLoading]);

  // Helper to render current page content
  const renderPageContent = () => {
    switch (activePage) {
      case 'about':
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <PageHeader
              title="Our Story & Philosophy"
              subtitle="Bespoke beachfront luxury with rich Filipino heritage in the heart of San Juan, La Union."
              category="About Us"
              backgroundImageUrl="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80"
              onHomeClick={() => handlePageChange('home')}
            />
            <Welcome onOpenBooking={handleOpenBooking} onChangePage={handlePageChange} />
            <WhyChooseUs />
          </motion.div>
        );
      case 'rooms':
        return (
          <motion.div
            key="rooms"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <PageHeader
              title="Suites & Villas"
              subtitle="Explore our handpicked sea-facing sanctuaries styled with premium linens, local bamboo accents, and panoramic coastal views."
              category="Accommodations"
              backgroundImageUrl="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920&q=80"
              onHomeClick={() => handlePageChange('home')}
            />
            <Rooms onOpenBooking={handleOpenBooking} />
          </motion.div>
        );
      case 'amenities':
        return (
          <motion.div
            key="amenities"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <PageHeader
              title="Resort Experiences"
              subtitle="Indulge in beachfront wellness, yoga packages, sunset lounges, and revitalizing seaside dining."
              category="Facilities & Amenities"
              backgroundImageUrl="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80"
              onHomeClick={() => handlePageChange('home')}
            />
            <Amenities onChangePage={handlePageChange} />
          </motion.div>
        );
      case 'gallery':
        return (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <PageHeader
              title="Visual Showcase"
              subtitle="Capture the essence of Ocean Breeze: gentle ocean waves, deep sunset glow, and premium architectural spaces."
              category="Media Gallery"
              backgroundImageUrl="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80"
              onHomeClick={() => handlePageChange('home')}
            />
            <Gallery />
          </motion.div>
        );
      case 'restaurant':
        return (
          <motion.div
            key="restaurant"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Restaurant />
          </motion.div>
        );
      case 'location':
        return (
          <motion.div
            key="location"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <PageHeader
              title="Find Us & Reach Out"
              subtitle="Plan your journey to Urbiztondo's premier beachfront resort. Reach out to our team for custom events, wellness retreats, and bookings."
              category="Contact Us"
              backgroundImageUrl="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1920&q=80"
              onHomeClick={() => handlePageChange('home')}
            />
             <Location onOpenBooking={handleOpenBooking} />
          </motion.div>
        );
      case 'automation':
        return (
          <motion.div
            key="automation"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <PageHeader
              title="Automation & Google Sheets Integration"
              subtitle="Production-ready Google Apps Script webhook integration, sheet schema configuration, and interactive payload testing."
              category="Automation Setup"
              backgroundImageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80"
              onHomeClick={() => handlePageChange('home')}
            />
            <AutomationHub />
          </motion.div>
        );
      case 'home':
      default:
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Full-Screen Hero */}
            <Hero
              onOpenBooking={handleOpenBooking}
              onChangePage={handlePageChange}
              checkIn={checkIn}
              setCheckIn={setCheckIn}
              checkOut={checkOut}
              setCheckOut={setCheckOut}
              guests={guests}
              setGuests={setGuests}
              roomType={preSelectedRoom}
              setRoomType={setPreSelectedRoom}
            />

            {/* Brand Narrative Intro */}
            <Welcome onOpenBooking={handleOpenBooking} onChangePage={handlePageChange} />

            {/* Accommodation Collections Preview */}
            <Rooms onOpenBooking={handleOpenBooking} />

            {/* Curated Resort Amenities Preview */}
            <Amenities />

            {/* Pinterest-Style Photo Gallery */}
            <Gallery />

            {/* Value Features & Guest Testimonials Slider */}
            <WhyChooseUs />

            {/* Embedded Map, Coordinates & Quick Forms */}
            <Location onOpenBooking={handleOpenBooking} />
          </motion.div>
        );
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <IntroLoader key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-white text-charcoal font-sans antialiased overflow-x-hidden selection:bg-ocean selection:text-white">
        {/* Navigation */}
        <Navbar onOpenBooking={handleOpenBooking} activePage={activePage} onChangePage={handlePageChange} />

        {/* Main Sections */}
        <main className="min-h-[60vh]">
          <AnimatePresence mode="wait">
            {!isLoading && renderPageContent()}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer 
          onOpenBooking={handleOpenBooking} 
          onChangePage={handlePageChange} 
        />

        {/* Global Booking Reservation Modal */}
        <BookingInquiryModal
          isOpen={isBookingOpen}
          onClose={handleCloseBooking}
          preSelectedRoom={preSelectedRoom}
          setPreSelectedRoom={setPreSelectedRoom}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          guests={guests}
          setGuests={setGuests}
        />

        {/* Floating Beachfront Concierge Chat Bot */}
        <ChatBot onOpenBooking={handleOpenBooking} />
      </div>
    </>
  );
}
