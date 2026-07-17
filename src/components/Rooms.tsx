import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Waves, Ruler, BedDouble, Star, Sparkles, Check, ChevronRight, X } from 'lucide-react';
import { Room } from '../types';

interface RoomsProps {
  onOpenBooking: (roomName?: string) => void;
}

const ROOMS_DATA: Room[] = [
  {
    id: 'deluxe',
    name: 'Deluxe Beachfront Suite',
    description: 'Enjoy spectacular, unobstructed ocean views from your private balcony. Outfitted with light premium linens, handwoven native accents, and a lavish rainfall shower.',
    capacity: '2 Adults + 1 Child',
    size: '45 m²',
    bedType: 'King Size Bed',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Balcony', 'Ocean View', 'Mini Bar', 'Espresso Machine', 'Rainfall Shower'],
    featured: true,
    view: 'Panoramic Ocean View'
  },
  {
    id: 'sunset',
    name: 'Sunset Panoramic Villa',
    description: 'Indulge in unmatched privacy. This standalone luxury villa features private infinity pool deck steps, oversized panoramic windows framing La Union\'s legendary sunset views.',
    capacity: '2 Adults',
    size: '60 m²',
    bedType: 'Super King Bed',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Plunge Pool', 'Sunset View', 'Outdoor Tub', 'Wine Cooler', 'Lounge Deck'],
    featured: true,
    view: 'Direct Sunset & Pool Deck'
  },
  {
    id: 'family',
    name: 'Spacious Family Loft',
    description: 'Perfect for family retreats and multi-guest beach escapes. Features a split-level loft configuration, luxury memory foam mattresses, and cozy lounge spaces for quality family time.',
    capacity: '4 Adults + 2 Children',
    size: '75 m²',
    bedType: '1 King Bed + 2 Doubles',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    amenities: ['Two-Level Loft', 'Equipped Kitchenette', 'Living Lounge Area', 'Garden Terrace', 'Smart TV'],
    featured: false,
    view: 'Lush Tropical Garden'
  },
  {
    id: 'surfer',
    name: 'Beachside Eco Cabin',
    description: 'Cozy, rustic-chic coastal living tailored for sea lovers and peace seekers. Made with locally sourced bamboo, reclaimed timbers, fully air-conditioned, and located steps from the gentle shoreline.',
    capacity: '2 Guests',
    size: '28 m²',
    bedType: 'Queen Size Bed',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Hammock', 'Air Conditioning', 'Outdoor Rain Shower', 'Eco Toiletries', 'Beach Lounge Chairs'],
    featured: false,
    view: 'Direct Beachfront Access'
  }
];

export default function Rooms({ onOpenBooking }: RoomsProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Lock scroll when the selected room modal is open
  useEffect(() => {
    if (selectedRoom) {
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
  }, [selectedRoom]);

  const RECOMMENDATIONS: Record<string, { bestFor: string; verdict: string; badge: string; bgClass: string; textClass: string; borderClass: string; iconColor: string }> = {
    deluxe: {
      bestFor: 'Couples & Ocean Watchers',
      verdict: 'Perfect if you want to wake up directly facing the surf. It features amazing direct sea sightlines and a large ocean breeze balcony to watch San Juan’s dynamic waves.',
      badge: 'Bestselling Ocean View',
      bgClass: 'bg-sky-50/70',
      textClass: 'text-sky-800',
      borderClass: 'border-sky-100',
      iconColor: 'text-sky-500'
    },
    sunset: {
      bestFor: 'Honeymooners, Couples & Luxury Seekers',
      verdict: 'The crown jewel of our resort. Standalone privacy, a private plunge pool deck, and an outdoor tub makes it our ultimate luxury package for memorable sunset moments.',
      badge: 'Ultimate Premium Choice',
      bgClass: 'bg-amber-50/70',
      textClass: 'text-amber-800',
      borderClass: 'border-amber-100',
      iconColor: 'text-amber-500'
    },
    family: {
      bestFor: 'Families & Group Retreats',
      verdict: 'Designed for optimal room and shared experiences. The split-level loft layout lets parents enjoy a private space while the rest of the group loves the terrace and kitchenette.',
      badge: 'Top Choice for Families',
      bgClass: 'bg-emerald-50/70',
      textClass: 'text-emerald-800',
      borderClass: 'border-emerald-100',
      iconColor: 'text-emerald-500'
    },
    surfer: {
      bestFor: 'Surfers, Solo Adventurers & Nature Lovers',
      verdict: 'Cozy, sustainable bamboo cabin steps from the shoreline. Recommended for active travelers who want rustic-chic surf vibes, fresh air, and immediate beach access.',
      badge: 'Authentic Coastal Vibe',
      bgClass: 'bg-teal-50/70',
      textClass: 'text-teal-800',
      borderClass: 'border-teal-100',
      iconColor: 'text-teal-500'
    }
  };

  // Staggered variants for cards
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="rooms" className="py-24 bg-slate-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset mb-2 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-coral" /> Accommodations
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
            Our Luxury Coastal Sanctuaries
          </h3>
          <p className="mt-4 text-gray-400 font-sans text-sm leading-relaxed font-light">
            Each room at Ocean Breeze Resort is designed to invite natural light, coastal sea breezes, and relaxing coastal vistas. Experience beachside luxury at its finest.
          </p>
        </motion.div>

        {/* Rooms Alternating Rows Layout */}
        <div className="space-y-12 lg:space-y-16">
          {ROOMS_DATA.map((room, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ 
                  y: -4, 
                  boxShadow: "0 25px 50px -12px rgba(11, 30, 54, 0.12)"
                }}
                onClick={() => setSelectedRoom(room)}
                className={`group bg-white rounded-[32px] overflow-hidden shadow-lg border border-slate-100 flex flex-col md:flex-row h-auto cursor-pointer relative transition-all duration-300`}
              >
                {/* Card Image Container with Hover zoom and labels (takes left or right based on index) */}
                <div className={`relative w-full md:w-[46%] h-64 sm:h-80 md:h-[360px] overflow-hidden shrink-0 ${!isEven ? 'md:order-2' : ''}`}>
                  <motion.img
                    src={room.image}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-60 pointer-events-none" />
                  
                  {/* Floating view badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-charcoal/85 backdrop-blur-md text-white font-sans text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Waves className="w-3.5 h-3.5 text-ocean" /> {room.view}
                  </div>

                  {/* Floating featured banner */}
                  {room.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sand text-charcoal font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-sand shadow-sm">
                      <Star className="w-3 h-3 fill-sunset text-sunset" /> Crown Jewel
                    </div>
                  )}

                  {/* Floating Price overlay */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md py-1.5 px-4 rounded-xl text-charcoal shadow-sm border border-white/20">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider leading-none mb-0.5">From</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-serif text-base sm:text-lg font-bold text-sunset">₱{room.price.toLocaleString()}</span>
                      <span className="text-[9px] text-gray-500 font-medium"> / Night</span>
                    </div>
                  </div>
                </div>

                {/* Card Content block */}
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center flex-grow">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-sunset block mb-1">
                      Ocean Haven
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-charcoal group-hover:text-sunset transition-colors leading-snug">
                      {room.name}
                    </h4>
                  </div>

                  <p className="text-gray-500 text-xs sm:text-sm font-light leading-relaxed mt-4 mb-6">
                    {room.description}
                  </p>

                  {/* Meta details (Capacity and Scenic View only) */}
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 mb-6 text-[11px] text-gray-500 font-medium">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-coral" /> Capacity
                      </span>
                      <span className="text-charcoal font-sans truncate">{room.capacity}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-l border-gray-100 pl-4">
                      <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider flex items-center gap-1">
                        <Waves className="w-3.5 h-3.5 text-ocean" /> Scenic View
                      </span>
                      <span className="text-charcoal font-sans truncate">{room.view}</span>
                    </div>
                  </div>

                  {/* Amenities checklist row */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.amenities.slice(0, 4).map(amenity => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 font-sans text-[10px] font-medium border border-slate-100"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-ocean" /> {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 4 && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-sans text-[9px] font-bold border border-slate-200">
                        +{room.amenities.length - 4} More
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div
                      className="py-2.5 px-6 rounded-full border border-slate-200 bg-white text-charcoal group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-white font-sans text-xs font-bold tracking-wider transition-all duration-300 text-center flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer shadow-xs"
                    >
                      Explore Details
                    </div>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBooking(room.id);
                      }}
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 20px -5px rgba(245, 124, 0, 0.3)" }}
                      whileTap={{ scale: 0.97 }}
                      className="py-2.5 px-6 rounded-full bg-sunset text-white font-sans text-xs font-bold tracking-wider uppercase transition-colors shadow-md shadow-sunset/10 text-center flex items-center justify-center gap-1 cursor-pointer focus:outline-none"
                    >
                      Book Room
                      <ChevronRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Popover/Detail Drawer for Room details */}
      <AnimatePresence>
        {selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoom(null)}
              className="absolute inset-0 bg-charcoal/75 backdrop-blur-md z-0"
            />

            {/* Content Drawer Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row h-[82vh] md:h-[580px] z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 hover:bg-white text-charcoal shadow-md border border-slate-200/50 transition-all active:scale-95 focus:outline-none cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Image Area */}
              <div className="relative w-full md:w-[42%] h-44 md:h-full shrink-0 overflow-hidden bg-slate-900">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-charcoal/90 via-charcoal/20 to-transparent md:from-charcoal/95 md:via-charcoal/40 md:to-transparent" />
                
                {/* Featured Badge */}
                {selectedRoom.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-sand text-charcoal font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-sand shadow-sm">
                    <Star className="w-3 h-3 fill-sunset text-sunset" /> Highly Requested
                  </div>
                )}

                {/* Mobile-only Title Overlay to save space */}
                <div className="absolute bottom-4 left-5 right-5 md:hidden">
                  <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-sand/90 block mb-0.5">
                    Sanctuary
                  </span>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                    {selectedRoom.name}
                  </h4>
                </div>
              </div>

              {/* Right Column: Title and Scrollable Info Panel */}
              <div className="flex flex-col flex-1 min-h-0 md:w-[58%] h-[calc(100%-11rem)] md:h-full overflow-hidden bg-white">
                
                {/* Desktop Title Block */}
                <div className="hidden md:block px-8 pt-8 pb-3 shrink-0 border-b border-slate-50">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-sunset block mb-1">
                    Sanctuary Overview
                  </span>
                  <h4 className="font-serif text-2xl md:text-3xl font-bold text-charcoal leading-tight">
                    {selectedRoom.name}
                  </h4>
                </div>

                {/* Scrollable body content */}
                <div className="overflow-y-auto flex-grow p-5 sm:p-6 md:px-8 md:py-5 space-y-5 scrollbar-thin">
                  
                  {/* Resort Recommendation Verdict Card */}
                  {RECOMMENDATIONS[selectedRoom.id] && (
                    <div className={`p-3.5 sm:p-4 rounded-2xl border ${RECOMMENDATIONS[selectedRoom.id].bgClass} ${RECOMMENDATIONS[selectedRoom.id].borderClass} flex gap-3 items-start`}>
                      <div className={`p-1.5 rounded-lg bg-white shadow-xs shrink-0 ${RECOMMENDATIONS[selectedRoom.id].iconColor}`}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400">RESORT VERDICT</span>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-white border border-slate-100 shadow-3xs ${RECOMMENDATIONS[selectedRoom.id].textClass}`}>
                            {RECOMMENDATIONS[selectedRoom.id].badge}
                          </span>
                        </div>
                        <h6 className="font-sans text-[11px] font-bold text-charcoal mb-0.5">
                          Best For: <span className="font-normal text-slate-700">{RECOMMENDATIONS[selectedRoom.id].bestFor}</span>
                        </h6>
                        <p className="text-slate-600 text-[11px] font-light leading-relaxed">
                          {RECOMMENDATIONS[selectedRoom.id].verdict}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Specifications Grid */}
                  <div className="space-y-2">
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Sanctuary Specifications
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-7 h-7 rounded-lg bg-coral/10 text-coral flex items-center justify-center shrink-0">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[8px] uppercase text-gray-400 font-bold block tracking-wider leading-none mb-0.5">Capacity</span>
                          <span className="text-xs text-charcoal font-semibold leading-none">{selectedRoom.capacity}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-7 h-7 rounded-lg bg-ocean/10 text-ocean flex items-center justify-center shrink-0">
                          <Waves className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[8px] uppercase text-gray-400 font-bold block tracking-wider leading-none mb-0.5">Scenic View</span>
                          <span className="text-xs text-charcoal font-semibold leading-none truncate max-w-[110px] block">{selectedRoom.view}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-7 h-7 rounded-lg bg-sunset/10 text-sunset flex items-center justify-center shrink-0">
                          <BedDouble className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[8px] uppercase text-gray-400 font-bold block tracking-wider leading-none mb-0.5">Bed Setup</span>
                          <span className="text-xs text-charcoal font-semibold leading-none">{selectedRoom.bedType}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <Ruler className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[8px] uppercase text-gray-400 font-bold block tracking-wider leading-none mb-0.5">Room Size</span>
                          <span className="text-xs text-charcoal font-semibold leading-none">{selectedRoom.size}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About Details */}
                  <div className="space-y-1.5">
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Bespoke Design & Comforts
                    </h5>
                    <p className="text-slate-600 text-xs font-light leading-relaxed">
                      {selectedRoom.description} Our private spaces come outfitted with high-performance cooling systems, luxury memory foam mattresses, and custom local organic towels & toiletries.
                    </p>
                  </div>

                  {/* Included Amenities Checklist */}
                  <div className="space-y-2">
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      In-Room Amenities Included
                    </h5>
                    <div className="grid grid-cols-2 gap-2 p-3 sm:p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100">
                      {selectedRoom.amenities.map(amenity => (
                        <div key={amenity} className="flex items-center gap-2 text-xs text-slate-700">
                          <div className="w-4 h-4 rounded-full bg-ocean/10 text-ocean flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span className="font-medium truncate">{amenity}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-ocean/10 text-ocean flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="font-medium">Free High-Speed Wi-Fi</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Fixed Footer Bar */}
                <div className="flex items-center justify-between border-t border-slate-100 px-6 sm:px-8 py-4 bg-slate-50/90 backdrop-blur-md shrink-0">
                  <div>
                    <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Estimated Price</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-serif text-lg sm:text-xl font-bold text-sunset">₱{selectedRoom.price.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 font-light">/ Night</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const id = selectedRoom.id;
                      setSelectedRoom(null);
                      onOpenBooking(id);
                    }}
                    className="px-5 py-2.5 rounded-full bg-sunset hover:bg-sunset/90 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer focus:outline-none flex items-center gap-1"
                  >
                    Book Room
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
