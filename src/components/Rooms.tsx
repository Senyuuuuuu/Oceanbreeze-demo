import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Waves, Ruler, BedDouble, Star, Sparkles, Check, ChevronRight } from 'lucide-react';
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
    name: 'Surfer\'s Eco Cabin',
    description: 'Cozy, rustic-chic coastal living tailored for sea lovers and surfers. Made with locally sourced bamboo, reclaimed timbers, fully air-conditioned, and located steps from the surf breaks.',
    capacity: '2 Guests',
    size: '28 m²',
    bedType: 'Queen Size Bed',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    amenities: ['Surfboard Rack', 'Air Conditioning', 'Outdoor Rain Shower', 'Eco Toiletries', 'Front Hammock'],
    featured: false,
    view: 'Direct Surf Break Steps'
  }
];

export default function Rooms({ onOpenBooking }: RoomsProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

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

        {/* Rooms Card Grid */}
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {ROOMS_DATA.map((room) => (
            <motion.div
              key={room.id}
              variants={cardVariants}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
            >
              {/* Card Image Container with Hover zoom and labels */}
              <div className="relative h-64 sm:h-76 overflow-hidden">
                <motion.img
                  src={room.image}
                  alt={room.name}
                  referrerPolicy="no-referrer"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-60 pointer-events-none" />
                
                {/* Floating view badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-charcoal/80 backdrop-blur-md text-white font-sans text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-ocean" /> {room.view}
                </div>

                {/* Floating featured banner */}
                {room.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sand text-charcoal font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-sand shadow-sm">
                    <Star className="w-3 h-3 fill-sunset text-sunset" /> Highly Requested
                  </div>
                )}

                {/* Floating Price overlay */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md py-1.5 px-4 rounded-xl text-charcoal shadow-sm border border-white/20">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">From</span>
                  <span className="font-serif text-lg font-bold text-sunset">₱{room.price.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500 font-medium"> / Night</span>
                </div>
              </div>

              {/* Card Content block */}
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-charcoal group-hover:text-sunset transition-colors">
                    {room.name}
                  </h4>
                </div>

                <p className="text-gray-500 text-xs sm:text-sm font-light leading-relaxed mb-6 flex-grow">
                  {room.description}
                </p>

                {/* Meta details (Capacity, Size, Bed) */}
                <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-4 mb-6 text-[11px] text-gray-500 font-medium">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-coral" /> Capacity
                    </span>
                    <span className="text-charcoal font-sans truncate">{room.capacity}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-l border-r border-gray-100 px-3">
                    <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-ocean" /> Room Size
                    </span>
                    <span className="text-charcoal font-sans">{room.size}</span>
                  </div>
                  <div className="flex flex-col gap-1 pl-3">
                    <span className="text-[9px] uppercase text-gray-400 font-bold tracking-wider flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-sunset" /> Bed Config
                    </span>
                    <span className="text-charcoal font-sans truncate">{room.bedType}</span>
                  </div>
                </div>

                {/* Amenities checklist row */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.amenities.map(amenity => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-sans text-[10px] font-medium"
                    >
                      <Check className="w-2.5 h-2.5 text-ocean" /> {amenity}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-auto pt-2">
                  <motion.button
                    onClick={() => setSelectedRoom(room)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="py-2.5 px-4 rounded-full border border-gray-200 hover:bg-slate-50 text-charcoal font-sans text-xs font-semibold tracking-wider transition-colors text-center focus:outline-none cursor-pointer"
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    onClick={() => onOpenBooking(room.id)}
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 20px -5px rgba(245, 124, 0, 0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    className="py-2.5 px-4 rounded-full bg-sunset text-white font-sans text-xs font-bold tracking-wider uppercase transition-colors shadow-md shadow-sunset/10 text-center flex items-center justify-center gap-1 cursor-pointer focus:outline-none"
                  >
                    Book Room
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Popover/Detail Drawer for Room details */}
      <AnimatePresence>
        {selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoom(null)}
              className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            />

            {/* Content Drawer Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl glass-panel border border-white/40"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors focus:outline-none"
              >
                <XIcon className="w-4 h-4" />
              </button>

              <div className="h-56 overflow-hidden relative">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-black/30" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sand block mb-1">
                    Luxury Retreat
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-white">
                    {selectedRoom.name}
                  </h4>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h5 className="text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-2">
                  About the sanctuary
                </h5>
                <p className="text-gray-500 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  {selectedRoom.description} All our rooms feature climate-controlled energy-saving air conditioning systems, luxurious hypo-allergenic mattresses, hand-woven linens, high-speed fiber internet, and bespoke bath products.
                </p>

                <h5 className="text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-3">
                  Included Amenities
                </h5>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {selectedRoom.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-ocean/10 text-ocean flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-ocean/10 text-ocean flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>High-Speed Free Wi-Fi</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-ocean/10 text-ocean flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Air Conditioned Room</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Estimated Price</span>
                    <span className="font-serif text-xl font-bold text-sunset">₱{selectedRoom.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-500"> / Night</span>
                  </div>
                  <button
                    onClick={() => {
                      const id = selectedRoom.id;
                      setSelectedRoom(null);
                      onOpenBooking(id);
                    }}
                    className="px-6 py-3 rounded-full bg-sunset hover:bg-sunset/90 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer focus:outline-none"
                  >
                    Inquire Availability
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

// Simple internal helper component for close icon
function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
