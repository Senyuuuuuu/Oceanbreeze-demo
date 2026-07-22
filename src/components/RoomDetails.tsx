import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Users, Mail, Phone, User, Check, Sparkles, MapPin, 
  Star, Share2, Bookmark, BedDouble, Bath, Ruler, X, ChevronLeft, 
  Wifi, Tv, Wind, ShieldCheck, Coffee, Sunrise, Droplet, 
  ArrowRight, FileSpreadsheet, AlertTriangle, Loader2, Maximize2, Compass, Heart
} from 'lucide-react';
import { Room } from '../types';
import { bookingStore } from '../lib/bookingStore';

interface RoomDetailsProps {
  roomId: string;
  onBackToRooms: () => void;
  onSuccess: (bookingDetails: {
    roomName: string;
    checkIn: string;
    checkOut: string;
    confirmationCode: string;
    guestName: string;
  }) => void;
  onOpenBooking?: (roomType?: string, datesAndGuests?: { checkIn?: string, checkOut?: string, guests?: string }) => void;
}

// Premium image sets for each room type
const ROOM_GALLERIES: Record<string, string[]> = {
  deluxe: [
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
  ],
  sunset: [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  ],
  family: [
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1585983224974-084a8e065e76?auto=format&fit=crop&w=600&q=80'
  ],
  surfer: [
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1473116763269-255ea7604bb6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&w=600&q=80'
  ]
};

const DEFAULT_ROOMS_RECORDS: Room[] = [
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

export default function RoomDetails({ roomId, onBackToRooms, onSuccess, onOpenBooking }: RoomDetailsProps) {
  const roomsList = bookingStore.getRooms().length > 0 ? bookingStore.getRooms() : DEFAULT_ROOMS_RECORDS;
  const currentRoom = roomsList.find(r => r.id === roomId) || roomsList[0];
  
  // States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePolicyTab, setActivePolicyTab] = useState<'checkin' | 'checkout' | 'cancel'>('checkin');
  
  // Gallery images array
  const galleryImages = ROOM_GALLERIES[currentRoom.id] || [currentRoom.image];

  // Reset active image index on room switch
  useEffect(() => {
    setActiveImageIndex(0);
  }, [roomId, currentRoom]);

  // Handle Share copy action
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Luxury amenities mapper
  const AMENITY_ICONS: Record<string, any> = {
    'Private Balcony': Sunrise,
    'Ocean View': Sunrise,
    'Mini Bar': Coffee,
    'Espresso Machine': Coffee,
    'Rainfall Shower': Droplet,
    'Private Plunge Pool': Droplet,
    'Sunset View': Sunrise,
    'Outdoor Tub': Bath,
    'Wine Cooler': Coffee,
    'Lounge Deck': Sunrise,
    'Two-Level Loft': BedDouble,
    'Equipped Kitchenette': Coffee,
    'Living Lounge Area': Users,
    'Garden Terrace': Sunrise,
    'Smart TV': Tv,
    'Private Hammock': Sunrise,
    'Air Conditioning': Wind,
    'Outdoor Rain Shower': Droplet,
    'Eco Toiletries': ShieldCheck,
    'Beach Lounge Chairs': Users
  };

  const getIconForAmenity = (name: string) => {
    return AMENITY_ICONS[name] || Sparkles;
  };

  // Divide amenities for modular styling
  const comfortAmenities = currentRoom.amenities.slice(0, 3);
  const curatedAmenities = currentRoom.amenities.slice(3);

  return (
    <div id="room-details-view" className="bg-slate-50 min-h-screen pt-24 pb-20 selection:bg-sunset selection:text-white">
      
      {/* Dynamic SEO Title & Headings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={onBackToRooms}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-charcoal hover:bg-slate-50 text-xs font-bold tracking-wider uppercase border border-slate-200/80 shadow-xs cursor-pointer transition-all duration-300 hover:shadow-md active:scale-95 group"
          >
            <ChevronLeft className="w-4 h-4 text-sunset transition-transform group-hover:-translate-x-1" /> Back to Accommodations
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/60 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white bg-[#1E3F3D] px-3.5 py-1.5 rounded-full">
                {currentRoom.featured ? 'Guest Favorite Sanctuary' : 'Boutique Curated Sanctuary'}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.95 (Superb Rating)
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2E5E5A] bg-[#EAF2F1] px-2.5 py-1 rounded-full flex items-center gap-1">
                <Compass className="w-3 h-3 text-[#1E3F3D]" /> Eco-Friendly Architecture
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight mt-3">
              {currentRoom.name}
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-2 font-medium">
              <MapPin className="w-4 h-4 text-coral animate-bounce" /> Urbiztondo Surf Beachfront, San Juan, La Union, 2514, Philippines
            </p>
          </div>
          
          <div className="text-left md:text-right shrink-0 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs md:shadow-none md:p-0 md:bg-transparent md:border-none">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Exclusive Direct Rate</span>
            <div className="flex items-baseline md:justify-end gap-1 mt-1">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-sunset">₱{currentRoom.price.toLocaleString()}</span>
              <span className="text-xs text-gray-400 font-semibold"> / Night</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1.5 uppercase tracking-wider">★ Includes Complimentary Breakfast Buffet & Welcome Drinks</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
            
            {/* Elegant Layout Photo Grid (Screenshot 2 Styled) */}
            <div className="flex flex-col sm:flex-row gap-4 h-[450px] sm:h-[600px]">
              {/* Stacked Vertical Thumbnails (4 images) */}
              <div className="hidden sm:flex flex-col gap-3 w-1/4 h-full shrink-0">
                {galleryImages.map((img, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={img}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative rounded-2xl overflow-hidden h-[calc(20%-10px)] border-2 transition-all duration-300 focus:outline-none cursor-pointer group ${
                        isActive ? 'border-sunset shadow-lg scale-[1.02]' : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${currentRoom.name} Detail ${idx}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </button>
                  );
                })}
              </div>
 
              {/* Large Selected Hero Image with Hover Zoom */}
              <div className="w-full sm:w-3/4 h-full relative rounded-3xl overflow-hidden shadow-2xl border border-white group">
                <img
                  src={galleryImages[activeImageIndex] || currentRoom.image}
                  alt={`${currentRoom.name} Main View`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Ambient dark gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-charcoal/20" />
                
                {/* Floating Bookmark/Save Button & Share Button */}
                <div className="absolute top-5 right-5 flex gap-2.5 z-10">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center text-charcoal hover:bg-white active:scale-90 cursor-pointer focus:outline-none transition-transform"
                    title="Share Room Link"
                  >
                    <Share2 className="w-4 h-4 text-coral" />
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center text-charcoal hover:bg-white active:scale-90 cursor-pointer focus:outline-none transition-transform"
                    title="Bookmark Sanctuary"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isBookmarked ? 'text-sunset fill-sunset' : 'text-gray-500'}`} />
                  </button>
                </div>

                {/* Click to expand lightbox helper */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl text-xs font-bold text-charcoal border border-slate-100 flex items-center gap-1.5 shadow-md hover:bg-white hover:scale-105 active:scale-95 cursor-pointer focus:outline-none transition-all duration-300"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-sunset" /> View Gallery ({galleryImages.length})
                </button>

                {/* Active Image Indicator */}
                <div className="absolute bottom-5 left-5 px-3 py-1.5 rounded-full bg-charcoal/80 text-white text-[10px] uppercase tracking-wider font-bold">
                  Photo {activeImageIndex + 1} of {galleryImages.length}
                </div>
              </div>
            </div>

            {/* Micro Mobile Thumbnails for Responsiveness */}
            <div className="flex sm:hidden gap-2 overflow-x-auto pb-2 scrollbar-none">
              {galleryImages.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative rounded-xl overflow-hidden w-16 h-12 border shrink-0 focus:outline-none cursor-pointer ${
                    activeImageIndex === idx ? 'border-sunset scale-102' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>

            {/* Clipboard success confirmation banner */}
            <AnimatePresence>
              {copiedLink && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl p-3.5 text-xs font-bold tracking-wide flex items-center gap-2 shadow-sm"
                >
                  <Check className="w-4 h-4 text-emerald-600" /> Link copied to clipboard! Share it with friends and family.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Premium Book Now Action Box below the images (The main interactive highlight) */}
            <div className="bg-gradient-to-br from-[#1E3F3D] via-[#244b49] to-[#2E5E5A] rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#2E5E5A]/30 relative overflow-hidden group">
              {/* Background waves ambient design */}
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute -left-10 -top-10 w-44 h-44 bg-sunset/10 rounded-full blur-2xl" />

              <div className="text-left relative z-10 w-full md:w-auto">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#A3E2D8] block mb-1">
                  EXCLUSIVE DIRECT BENEFITS ACTIVE
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  Reserve This Coastal Haven
                </h3>
                <p className="text-xs text-[#E1F3F0] font-light mt-2 leading-relaxed max-w-md">
                  Secure your dates and claim complimentary gourmet breakfasts, surf school access discount, and flexible cancellation.
                </p>
                
                {/* Micro guarantees */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-[10px] uppercase tracking-wider text-teal-200 font-bold">
                  <span className="flex items-center gap-1">✓ No Credit Card Fees</span>
                  <span className="flex items-center gap-1">✓ Instant Confirmation</span>
                  <span className="flex items-center gap-1">✓ Flexible Dates</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto relative z-10">
                <div className="text-center sm:text-right w-full sm:w-auto">
                  <span className="text-[10px] uppercase font-bold text-[#A3E2D8] tracking-widest block mb-0.5">Starting Rate</span>
                  <div className="flex items-baseline justify-center sm:justify-end gap-1">
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-white">₱{currentRoom.price.toLocaleString()}</span>
                    <span className="text-xs text-[#C5ECE5]">/ Night</span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenBooking?.(currentRoom.name)}
                  className="w-full sm:w-auto px-8 py-4 bg-sunset hover:bg-[#ff6c55] text-white font-bold uppercase text-xs tracking-[0.15em] rounded-xl transition-all duration-300 shadow-xl shadow-sunset/35 flex items-center justify-center gap-2 cursor-pointer focus:outline-none active:scale-[0.97] border-b-2 border-sunset-600 hover:shadow-2xl"
                >
                  Book Room Now <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Interactive Bento-Grid Feature Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <motion.div 
                whileHover={{ y: -4, shadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between h-28 shadow-xs hover:border-sunset/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF2F1] flex items-center justify-center text-[#1E4E4B]">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-widest">Bed setup</span>
                  <span className="text-xs font-bold text-charcoal truncate block mt-0.5">{currentRoom.bedType}</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, shadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between h-28 shadow-xs hover:border-sunset/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF2F1] flex items-center justify-center text-[#1E4E4B]">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-widest">Bath Suite</span>
                  <span className="text-xs font-bold text-charcoal truncate block mt-0.5">Rainfall Shower</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, shadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between h-28 shadow-xs hover:border-sunset/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF2F1] flex items-center justify-center text-[#1E4E4B]">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-widest">Sanctuary Size</span>
                  <span className="text-xs font-bold text-charcoal truncate block mt-0.5">{currentRoom.size}</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, shadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between h-28 shadow-xs hover:border-sunset/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF2F1] flex items-center justify-center text-[#1E4E4B]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-widest">Max Occupancy</span>
                  <span className="text-xs font-bold text-charcoal truncate block mt-0.5">{currentRoom.capacity}</span>
                </div>
              </motion.div>
            </div>

            {/* Overview Narrative lookbook-style card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1E3F3D]" />
              
              <h2 className="font-serif text-xl font-bold text-charcoal pb-3 flex items-center gap-2 border-b border-gray-100">
                <Sparkles className="w-4 h-4 text-sunset" /> Sanctuary Philosophy & Concept
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="md:col-span-2 space-y-4">
                  <p className="text-gray-600 font-sans text-sm font-light leading-relaxed">
                    {currentRoom.description}
                  </p>
                  <p className="text-gray-500 font-sans text-sm font-light leading-relaxed">
                    Experience unparalleled restoration in this high-contrast custom layout, explicitly designed to blend native Filipino craft with modern premium conveniences. Soak in fresh sea breezes, view gorgeous ocean tides, and relax in pristine beddings made exclusively for Ocean Breeze Resort guests.
                  </p>
                </div>
                
                {/* Curated highlights box */}
                <div className="bg-[#EAF2F1]/30 rounded-2xl p-5 border border-[#EAF2F1] flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#1E3F3D] mb-3">Sanctuary Highlights</h4>
                    <ul className="space-y-2.5">
                      <li className="text-[11px] font-semibold text-charcoal flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sunset" /> 100% Cotton Organic Linens
                      </li>
                      <li className="text-[11px] font-semibold text-charcoal flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sunset" /> Locally Crafted Bamboo Furniture
                      </li>
                      <li className="text-[11px] font-semibold text-charcoal flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sunset" /> Natural Light & Air Flow Tech
                      </li>
                      <li className="text-[11px] font-semibold text-charcoal flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sunset" /> Oceanfront Sunrise Access
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 border-t border-[#1E3F3D]/10 pt-3 text-[10px] text-gray-500 italic">
                    Designed for visual relief & sensory peace.
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Categorized Amenities Display */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sunset" /> Curated Luxury & Wellness Equipment
                  </h2>
                  <p className="text-gray-400 font-sans text-xs mt-1 leading-relaxed font-light">
                    Every element hand-selected to support wellness, leisure, and digital peace.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3.5 block">Premium Suite Features</h3>
                  <div className="space-y-3">
                    {comfortAmenities.map((amenity) => {
                      const IconComponent = getIconForAmenity(amenity);
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-all duration-300"
                        >
                          <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-sunset shrink-0 border border-slate-100">
                            <IconComponent className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-charcoal font-sans block">{amenity}</span>
                            <span className="text-[10px] text-gray-400 block font-light leading-none mt-0.5">Premium Standard Included</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3.5 block">Convenience & Leisure</h3>
                  <div className="space-y-3">
                    {curatedAmenities.map((amenity) => {
                      const IconComponent = getIconForAmenity(amenity);
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-all duration-300"
                        >
                          <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-sunset shrink-0 border border-slate-100">
                            <IconComponent className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-charcoal font-sans block">{amenity}</span>
                            <span className="text-[10px] text-gray-400 block font-light leading-none mt-0.5">Complimentary Resort Asset</span>
                          </div>
                        </div>
                      );
                    })}
                    {/* Direct Standard Base Items */}
                    <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-all duration-300">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#1E3F3D] shrink-0 border border-slate-100">
                        <Wifi className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-charcoal font-sans block">High-Speed Wi-Fi</span>
                        <span className="text-[10px] text-gray-400 block font-light leading-none mt-0.5">Complimentary 150 Mbps Fiber</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Check-in / Check-out Tabbed Policies Container (Incredible UI Upgrade) */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-xl font-bold text-charcoal pb-3 flex items-center gap-2 border-b border-gray-100">
                <ShieldCheck className="w-5 h-5 text-sunset" /> Check-in, Cancellation & Guest Policies
              </h2>

              <div className="flex border-b border-slate-100 gap-6 mt-6">
                <button
                  onClick={() => setActivePolicyTab('checkin')}
                  className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer ${
                    activePolicyTab === 'checkin' ? 'text-sunset font-black' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Arrival & Check-in
                  {activePolicyTab === 'checkin' && (
                    <motion.div layoutId="policyActiveBar" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sunset" />
                  )}
                </button>
                <button
                  onClick={() => setActivePolicyTab('checkout')}
                  className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer ${
                    activePolicyTab === 'checkout' ? 'text-sunset font-black' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Departure & Checkout
                  {activePolicyTab === 'checkout' && (
                    <motion.div layoutId="policyActiveBar" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sunset" />
                  )}
                </button>
                <button
                  onClick={() => setActivePolicyTab('cancel')}
                  className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer ${
                    activePolicyTab === 'cancel' ? 'text-sunset font-black' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Rescheduling & Refunding
                  {activePolicyTab === 'cancel' && (
                    <motion.div layoutId="policyActiveBar" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sunset" />
                  )}
                </button>
              </div>

              <div className="py-5 font-sans">
                <AnimatePresence mode="wait">
                  {activePolicyTab === 'checkin' && (
                    <motion.div
                      key="checkin"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 text-sm font-light text-gray-500 leading-relaxed"
                    >
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p><strong>Standard check-in begins at 2:00 PM.</strong> We offer complimentary secure baggage storage if you arrive early.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p><strong>Complimentary signature fresh coconut shake</strong> is served upon arrival at the coastal lounge.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p>Physical valid photo government ID card or passport is required. Guests must be at least 18 years old to book.</p>
                      </div>
                    </motion.div>
                  )}

                  {activePolicyTab === 'checkout' && (
                    <motion.div
                      key="checkout"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 text-sm font-light text-gray-500 leading-relaxed"
                    >
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p><strong>Standard checkout is prior to 12:00 PM (Noon).</strong> Late checkouts can be requested ahead of time, subject to availability.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p>Express contactless box drop-off is active for quick checkout processes.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p>Upon check-out, return physical keycards to the central beachfront resort reception desk.</p>
                      </div>
                    </motion.div>
                  )}

                  {activePolicyTab === 'cancel' && (
                    <motion.div
                      key="cancel"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 text-sm font-light text-gray-500 leading-relaxed"
                    >
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p><strong>Free rescheduling</strong> up to 48 hours prior to check-in if booking through direct rates.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p>Cancellations made 7 days in advance receive a 100% complete refund. Cancellations made under 3 days are subject to a one-night fee.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p>Refunds are processed to original bank transfer or cards within 5 business days.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Pristine Resort Location & Neighborhood Spotlights Map */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-xl font-bold text-charcoal pb-3 flex items-center gap-2 border-b border-gray-100">
                <MapPin className="w-5 h-5 text-sunset" /> Location & Surf Neighborhood Spots
              </h2>
              <p className="text-gray-400 font-sans text-xs mt-1.5 leading-relaxed font-light mb-5">
                Enjoy immediate beachfront access on Urbiztondo shoreline. Fully walkable to primary La Union waves and top eateries.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Visual Map (Left 2 columns) */}
                <div className="md:col-span-2 relative rounded-2xl overflow-hidden h-72 border border-slate-100 bg-[#EAEAEA] flex items-center justify-center shadow-inner">
                  {/* Visual SVG Map representation */}
                  <svg className="absolute inset-0 w-full h-full opacity-85" xmlns="http://www.w3.org/2000/svg">
                    {/* Sea area on left/top */}
                    <path d="M 0 0 L 160 0 Q 210 130 110 288 L 0 288 Z" fill="#D0E3E3" />
                    <text x="35" y="90" fill="#2E4E4E" fontFamily="sans-serif" fontSize="10" fontWeight="bold" opacity="0.35" transform="rotate(-40, 35, 90)">
                      WEST PHILIPPINE SEA
                    </text>
                    
                    {/* Sandy coastline */}
                    <path d="M 160 0 Q 210 130 110 288" stroke="#E6C495" strokeWidth="14" fill="none" />
                    
                    {/* Custom Roads */}
                    <line x1="260" y1="0" x2="210" y2="288" stroke="#FFFFFF" strokeWidth="20" />
                    <line x1="260" y1="0" x2="210" y2="288" stroke="#D0D0D0" strokeWidth="6" />
                    <text x="185" y="85" fill="#666666" fontFamily="sans-serif" fontSize="7" transform="rotate(78, 185, 85)">
                      National Highway
                    </text>
                    
                    <line x1="120" y1="60" x2="420" y2="130" stroke="#FFFFFF" strokeWidth="16" />
                    <line x1="120" y1="60" x2="420" y2="130" stroke="#E0E0E0" strokeWidth="6" />
                    <text x="260" y="102" fill="#666666" fontFamily="sans-serif" fontSize="7" transform="rotate(12, 260, 102)">
                      Urbiztondo Road
                    </text>
                    
                    {/* Extra landmarks */}
                    <rect x="290" y="170" width="90" height="36" rx="6" fill="#D8DFDF" />
                    <text x="295" y="192" fill="#555555" fontFamily="sans-serif" fontSize="8" fontWeight="bold">
                      Local Food Hub
                    </text>
                  </svg>

                  {/* Glowing Circular Custom Pin Marker */}
                  <div className="absolute left-[54%] top-[46%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="absolute w-12 h-12 rounded-full bg-sunset/20 animate-ping" />
                    <div className="w-10 h-10 rounded-full bg-sunset border-4 border-white shadow-xl flex items-center justify-center text-white z-10">
                      <MapPin className="w-4 h-4 fill-white" />
                    </div>
                    <div className="mt-2 bg-[#1E3F3D] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg border border-teal-800">
                      Ocean Breeze
                    </div>
                  </div>

                  {/* Quick directions helper */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/50 shadow-sm text-[10px] text-gray-500 font-bold">
                    🏄 <span className="text-[#1E3F3D]">Direct Coastline Connection</span>
                  </div>
                </div>

                {/* Local Spots List (Right 1 column) */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#1E3F3D] border-b border-gray-100 pb-1.5 block">Walkable Landmarks</h4>
                  
                  <div className="space-y-3.5">
                    <div className="flex gap-2">
                      <span className="text-sm">🏄</span>
                      <div>
                        <span className="text-[11px] font-bold text-charcoal block leading-none">Urbiztondo Surfing Spot</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5 font-light">150m away — 2 mins walk</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-sm">☕</span>
                      <div>
                        <span className="text-[11px] font-bold text-charcoal block leading-none">El Union Specialty Coffee</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5 font-light">250m away — 3 mins walk</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-sm">🌮</span>
                      <div>
                        <span className="text-[11px] font-bold text-charcoal block leading-none">The Great Northwest Food Hub</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5 font-light">400m away — 5 mins walk</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-sm">✈</span>
                      <div>
                        <span className="text-[11px] font-bold text-charcoal block leading-none">San Fernando Airport</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5 font-light">12km away — 15 mins drive</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        </div>
      </div>

      {/* Full-Screen High-Fidelity Photo Lightbox Slideshow */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90 z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Slideshow Image */}
            <div className="relative max-w-5xl w-full h-[70vh] flex items-center justify-center px-4">
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={galleryImages[activeImageIndex]}
                alt={`${currentRoom.name} Lightbox`}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border border-white/5"
              />

              {/* Side Carousel controls */}
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                className="absolute left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer select-none active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer select-none active:scale-90"
              >
                <ChevronLeft className="w-6 h-6 rotate-180" />
              </button>
            </div>

            {/* Thumbnail Navigation Strip inside Lightbox */}
            <div className="max-w-4xl w-full overflow-x-auto mt-6 flex gap-3 px-4 py-2 justify-center scrollbar-none">
              {galleryImages.map((img, idx) => (
                <button
                  key={`lightbox-thumb-${idx}`}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-18 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-sunset scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>

            <span className="text-white/60 text-xs font-bold mt-4 uppercase tracking-widest">
              IMAGE {activeImageIndex + 1} OF {galleryImages.length} — {currentRoom.name}
            </span>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
