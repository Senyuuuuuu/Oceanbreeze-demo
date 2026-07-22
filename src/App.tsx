/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Welcome from './components/Welcome';
import Rooms from './components/Rooms';
import RoomDetails from './components/RoomDetails';
import Amenities from './components/Amenities';
import Gallery from './components/Gallery';
import WhyChooseUs from './components/WhyChooseUs';
import Location from './components/Location';
import Footer from './components/Footer';
import Restaurant from './components/Restaurant';
import BookingInquiryModal from './components/BookingInquiryModal';
import BookingToast from './components/BookingToast';
import PageHeader from './components/PageHeader';
import IntroLoader from './components/IntroLoader';
import ChatBot from './components/ChatBot';
import AutomationHub from './components/AutomationHub';
import BookingPage from './components/BookingPage';
import WavePageTransition from './components/WavePageTransition';
import AboutStory from './components/AboutStory';
import FAQ from './components/FAQ';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import { StaffAccount } from './types';

interface SEOConfig {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
}

const SEO_METADATA: Record<string, SEOConfig> = {
  home: {
    title: "Ocean Breeze Resort | Beachfront Luxury Resort in La Union",
    description: "Experience curated beachfront luxury with warm Filipino hospitality in San Juan, La Union. Relax in premium sea-facing villas and enjoy gold-standard amenities.",
    ogTitle: "Ocean Breeze Resort | Beachfront Luxury in La Union",
    ogDescription: "Discover an intimate coastal sanctuary in San Juan, La Union. Book our handpicked suites & panoramic villas with premium amenities.",
    ogImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    ogType: "website"
  },
  about: {
    title: "Our Story & Philosophy | Ocean Breeze Resort",
    description: "Born from surf, refined by nature. Discover the heritage, core values, eco-conscious architecture, and journey of San Juan's premier beachfront sanctuary.",
    ogTitle: "The Story Behind Ocean Breeze Resort",
    ogDescription: "From a simple coastal escape to a gold-standard sustainable beachfront resort in La Union. Explore our journey and core values.",
    ogImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    ogType: "profile"
  },
  rooms: {
    title: "Suites & Villas Accommodation | Ocean Breeze Resort",
    description: "Explore our collection of sea-facing suites and villas in La Union. Styled with premium linens, local bamboo accents, and private sunset balconies.",
    ogTitle: "Premium Suites & Villas in San Juan, La Union",
    ogDescription: "From cozy beachside cabins to spacious family lofts and panoramic sunset villas. Experience the peak of beachfront luxury.",
    ogImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    ogType: "website"
  },
  amenities: {
    title: "Resort Experiences & Beachfront Wellness | Ocean Breeze Resort",
    description: "Indulge in horizontal infinity pools, sunset decks, holistic yoga packages, and revitalizing oceanfront dining crafted to inspire deep rest.",
    ogTitle: "Curated Resort Experiences & Seaside Wellness",
    ogDescription: "Yoga decks, beachfront hammocks, seaside massage packages, and premium amenities curated to maximize your restoration.",
    ogImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
    ogType: "website"
  },
  gallery: {
    title: "Visual Showcase & Photo Gallery | Ocean Breeze Resort",
    description: "Browse the stunning beauty of San Juan, La Union. Experience the visual rhythm of golden hours, premium architecture, and cozy beachside life.",
    ogTitle: "A Visual Journey into Ocean Breeze Resort",
    ogDescription: "Immerse yourself in high-definition photographs of our rooms, beach, food, and daily activities. A glimpse into paradise.",
    ogImage: "https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/480742956_122140595558567801_6324144565661516274_n.jpg",
    ogType: "website"
  },
  restaurant: {
    title: "Seaside Dining & Coastal Cuisine | Ocean Breeze Resort",
    description: "Savor local organic delicacies, mouthwatering international dishes, and creative craft cocktails at our premium beachfront restaurant.",
    ogTitle: "Beachfront Fine Dining & Island Mixology",
    ogDescription: "Freshly caught local seafood, artisanal native beverages, and sunset-facing dining tables right on the sand.",
    ogImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    ogType: "restaurant"
  },
  location: {
    title: "Find Us & Reach Out | Ocean Breeze Resort",
    description: "Plan your trip to San Juan, La Union. Find direct map coordinates, driving instructions, and reach our reservation team for custom events.",
    ogTitle: "Locate Ocean Breeze Resort in San Juan, La Union",
    ogDescription: "Get directions to the premier surf capital resort. Contact our front office, request custom event planning, or schedule private bookings.",
    ogImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    ogType: "website"
  },
  automation: {
    title: "Automation Setup & Webhook Config | Ocean Breeze Resort",
    description: "Configure Google Apps Script, view live webhooks, customize JSON schema fields, and test live reservation updates synchronously.",
    ogTitle: "Google Sheets Webhook Automation Integration Console",
    ogDescription: "Step-by-step interactive setup to sync bookings with standard cloud-hosted sheets effortlessly.",
    ogImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    ogType: "website"
  },
  booking: {
    title: "Verify Stay & Book Beachfront Rooms | Ocean Breeze Resort",
    description: "Select check-in/out dates, specify guest counts, review real-time availability calendar, and secure your room securely.",
    ogTitle: "Secure Beachfront Room Reservations Online",
    ogDescription: "Plan your ultimate island getaway. Simple booking interface integrated with live calendar status updates.",
    ogImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    ogType: "website"
  }
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState<string>(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/adminlogin' || path === '/adminlogin/' || path === '/admin' || path === '/admin/') {
      return 'admin';
    }
    return 'home';
  });
  const [adminUser, setAdminUser] = useState<StaffAccount | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preSelectedRoom, setPreSelectedRoom] = useState<string>('');
  const [initialCheckIn, setInitialCheckIn] = useState<string>('');
  const [initialCheckOut, setInitialCheckOut] = useState<string>('');
  const [initialGuests, setInitialGuests] = useState<string>('2');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('deluxe');

  // Page wave transition states
  const [triggerWave, setTriggerWave] = useState(false);
  const [pendingPage, setPendingPage] = useState<string | null>(null);

  // Success Toast notification state
  const [toastData, setToastData] = useState<{
    isOpen: boolean;
    roomName: string;
    checkIn: string;
    checkOut: string;
    confirmationCode: string;
    guestName: string;
  }>({
    isOpen: false,
    roomName: '',
    checkIn: '',
    checkOut: '',
    confirmationCode: '',
    guestName: ''
  });

  const handleOpenBooking = (roomType?: string, datesAndGuests?: { checkIn?: string, checkOut?: string, guests?: string }) => {
    if (roomType) {
      let rType = roomType;
      if (roomType === 'Deluxe Beachfront Suite') rType = 'deluxe';
      else if (roomType === 'Sunset Panoramic Villa') rType = 'sunset';
      else if (roomType === 'Spacious Family Loft') rType = 'family';
      else if (roomType === 'Beachside Eco Cabin') rType = 'surfer';
      setPreSelectedRoom(rType);
    } else {
      setPreSelectedRoom('');
    }
    if (datesAndGuests) {
      if (datesAndGuests.checkIn) setInitialCheckIn(datesAndGuests.checkIn);
      if (datesAndGuests.checkOut) setInitialCheckOut(datesAndGuests.checkOut);
      if (datesAndGuests.guests) setInitialGuests(datesAndGuests.guests);
    }
    handlePageChange('booking');
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setPreSelectedRoom('');
    // Keep initialCheckIn, initialCheckOut, and initialGuests intact so they stay synced with the hero section
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
    if (pageId === activePage) return;
    setPendingPage(pageId);
    setTriggerWave(true);
  };

  const handleIntroComplete = () => {
    setPendingPage(activePage);
    setTriggerWave(true);
  };

  const handleWaveMidpoint = () => {
    if (isLoading) {
      setIsLoading(false);
      if (pendingPage) {
        setActivePage(pendingPage);
      } else if (activePage === 'admin') {
        setActivePage('admin');
      } else {
        setActivePage('home');
      }
    } else if (pendingPage) {
      setActivePage(pendingPage);
    }
  };

  const handleWaveComplete = () => {
    setTriggerWave(false);
    setPendingPage(null);
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

  // Listen for browser navigation back/forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/adminlogin' || path === '/adminlogin/' || path === '/admin' || path === '/admin/') {
        setActivePage('admin');
      } else {
        setActivePage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync browser URL with the active page state
  useEffect(() => {
    if (isLoading) return;
    const path = window.location.pathname.toLowerCase();
    if (activePage === 'admin') {
      if (path !== '/adminlogin' && path !== '/admin') {
        window.history.pushState(null, '', '/adminlogin');
      }
    } else {
      if (path === '/adminlogin' || path === '/adminlogin/' || path === '/admin' || path === '/admin/') {
        window.history.pushState(null, '', '/');
      }
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
            <AboutStory onOpenBooking={handleOpenBooking} />
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
              backgroundImageUrl="https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/480290635_122139108338567801_2577860041803326842_n.jpg"
              imageOpacity="opacity-85"
              objectPosition="object-[center_25%]"
              onHomeClick={() => handlePageChange('home')}
            />
            <Rooms
              onOpenBooking={handleOpenBooking}
              onSelectRoom={(id) => {
                setSelectedRoomId(id);
                handlePageChange('room-details');
              }}
            />
          </motion.div>
        );
      case 'room-details':
        return (
          <motion.div
            key="room-details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <RoomDetails
              roomId={selectedRoomId}
              onBackToRooms={() => handlePageChange('rooms')}
              onOpenBooking={handleOpenBooking}
              onSuccess={(details) => {
                setToastData({
                  isOpen: true,
                  ...details
                });
              }}
            />
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
              backgroundImageUrl="https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/475899825_122136399272567801_2235547433093645147_n.jpg"
              imageOpacity="opacity-85"
              objectPosition="object-[center_25%]"
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
      case 'booking':
        return (
          <motion.div
            key="booking"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <PageHeader
              title="Verify & Secure Stay"
              subtitle="Lock reservation dates, calculate standard beachfront taxes and fees, and check live Google Sheet calendars."
              category="Bespoke Reservations"
              backgroundImageUrl="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1920&q=80"
              onHomeClick={() => handlePageChange('home')}
            />
            <BookingPage
              preSelectedRoom={preSelectedRoom}
              initialCheckIn={initialCheckIn}
              initialCheckOut={initialCheckOut}
              initialGuests={initialGuests}
              onDatesGuestsChange={(vals) => {
                setInitialCheckIn(vals.checkIn);
                setInitialCheckOut(vals.checkOut);
                setInitialGuests(vals.guests);
              }}
              onSuccess={(details) => {
                setToastData({
                  isOpen: true,
                  ...details
                });
              }}
              onBackToHome={() => handlePageChange('home')}
            />
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
              checkIn={initialCheckIn}
              setCheckIn={setInitialCheckIn}
              checkOut={initialCheckOut}
              setCheckOut={setInitialCheckOut}
              guests={initialGuests}
              setGuests={setInitialGuests}
            />

            {/* Brand Narrative Intro */}
            <Welcome onOpenBooking={handleOpenBooking} onChangePage={handlePageChange} />

            {/* Accommodation Collections Preview */}
            <Rooms
              onOpenBooking={handleOpenBooking}
              onSelectRoom={(id) => {
                setSelectedRoomId(id);
                handlePageChange('room-details');
              }}
            />

            {/* Curated Resort Amenities Preview */}
            <Amenities />

            {/* Pinterest-Style Photo Gallery */}
            <Gallery />

            {/* Value Features & Guest Testimonials Slider */}
            <WhyChooseUs />

            {/* Frequently Asked Questions */}
            <FAQ />

            {/* Embedded Map, Coordinates & Quick Forms */}
            <Location onOpenBooking={handleOpenBooking} />
          </motion.div>
        );
    }
  };

  const seo = SEO_METADATA[activePage] || SEO_METADATA.home;

  if (activePage === 'admin') {
    return (
      <HelmetProvider>
        <Helmet>
          <title>Staff Backoffice Portal | Ocean Breeze Resort</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        {adminUser ? (
          <AdminDashboard user={adminUser} onLogout={() => setAdminUser(null)} />
        ) : (
          <AdminLogin onLoginSuccess={(u) => setAdminUser(u)} onBackToHome={() => setActivePage('home')} />
        )}
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={seo.ogType} />
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:image" content={seo.ogImage} />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={seo.ogTitle} />
        <meta property="twitter:description" content={seo.ogDescription} />
        <meta property="twitter:image" content={seo.ogImage} />

        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <AnimatePresence>
        {isLoading && (
          <IntroLoader key="loader" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Wave Page Transition Overlay */}
      <WavePageTransition
        trigger={triggerWave}
        onMidpoint={handleWaveMidpoint}
        onComplete={handleWaveComplete}
      />

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
          initialCheckIn={initialCheckIn}
          initialCheckOut={initialCheckOut}
          initialGuests={initialGuests}
          onDatesGuestsChange={(vals) => {
            setInitialCheckIn(vals.checkIn);
            setInitialCheckOut(vals.checkOut);
            setInitialGuests(vals.guests);
          }}
          onSuccess={(details) => {
            setToastData({
              isOpen: true,
              ...details
            });
          }}
        />

        {/* Global Success Toast Notification */}
        <BookingToast
          isOpen={toastData.isOpen}
          onClose={() => setToastData(prev => ({ ...prev, isOpen: false }))}
          roomName={toastData.roomName}
          checkIn={toastData.checkIn}
          checkOut={toastData.checkOut}
          confirmationCode={toastData.confirmationCode}
          guestName={toastData.guestName}
        />

        {/* Floating Beachfront Concierge Chat Bot */}
        <ChatBot onOpenBooking={handleOpenBooking} isBookingOpen={isBookingOpen} />
      </div>
    </HelmetProvider>
  );
}
