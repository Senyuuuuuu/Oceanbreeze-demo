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
import BookingInquiryModal from './components/BookingInquiryModal';
import PageHeader from './components/PageHeader';
import IntroLoader from './components/IntroLoader';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState<string>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preSelectedRoom, setPreSelectedRoom] = useState<string>('');

  const handleOpenBooking = (roomType?: string) => {
    if (roomType) {
      setPreSelectedRoom(roomType);
    } else {
      setPreSelectedRoom('');
    }
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setPreSelectedRoom('');
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
    
    const targetId = pageId === 'home' ? 'home' : pageId;
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // Height of the sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(offsetPosition, {
          duration: 1.2,
        });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Scroll Spy: Automatically update activePage based on the section currently in view
  useEffect(() => {
    if (isLoading) return;

    const sections = ['home', 'about', 'rooms', 'amenities', 'gallery', 'location'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActivePage(id);
          }
        },
        {
          rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the central viewing area
          threshold: 0,
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, [isLoading]);

  // Helper to render current page content
  const renderPageContent = () => {
    return (
      <motion.div
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Full-Screen Hero */}
        <Hero onOpenBooking={handleOpenBooking} />

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
        <Footer onOpenBooking={handleOpenBooking} onChangePage={handlePageChange} />

        {/* Global Booking Reservation Modal */}
        <BookingInquiryModal
          isOpen={isBookingOpen}
          onClose={handleCloseBooking}
          preSelectedRoom={preSelectedRoom}
        />
      </div>
    </>
  );
}
