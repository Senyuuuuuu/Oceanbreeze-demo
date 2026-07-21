import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Users, Mail, Phone, User, Check, Sparkles, MapPin, 
  Star, Share2, Bookmark, BedDouble, Bath, Ruler, X, ChevronLeft, 
  Wifi, Tv, Wind, ShieldCheck, Volume2, Coffee, Sunrise, Droplet, 
  ArrowRight, FileSpreadsheet, AlertTriangle, Loader2
} from 'lucide-react';
import { Room } from '../types';
import { bookingStore, Booking } from '../lib/bookingStore';

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
}

// Beautiful image sets for each room type
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

export default function RoomDetails({ roomId, onBackToRooms, onSuccess }: RoomDetailsProps) {
  const roomsList = bookingStore.getRooms().length > 0 ? bookingStore.getRooms() : DEFAULT_ROOMS_RECORDS;
  const currentRoom = roomsList.find(r => r.id === roomId) || roomsList[0];
  
  // States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Gallery images array
  const galleryImages = ROOM_GALLERIES[currentRoom.id] || [currentRoom.image];

  // Booking Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [formRoomId, setFormRoomId] = useState(currentRoom.id);
  const [numRooms, setNumRooms] = useState('1');
  const [message, setMessage] = useState('');

  // Booking process states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [errorText, setErrorText] = useState('');

  // Reset active image index on room switch
  useEffect(() => {
    setActiveImageIndex(0);
    setFormRoomId(currentRoom.id);
  }, [roomId, currentRoom]);

  // Adjust checkOut date if checkIn is set ahead of checkOut
  useEffect(() => {
    if (checkIn && checkOut && checkIn >= checkOut) {
      const start = new Date(checkIn);
      start.setDate(start.getDate() + 2);
      setCheckOut(start.toISOString().split('T')[0]);
    }
  }, [checkIn, checkOut]);

  // Handle Share copy action
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Submit handler
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorText('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorText('Please enter a valid email address');
      return;
    }
    if (!phone.trim()) {
      setErrorText('Please enter your contact phone number');
      return;
    }

    setIsSubmitting(true);
    setErrorText('');
    setProgressText('Preparing booking reservation details...');

    const selectedRoomDetails = roomsList.find(r => r.id === formRoomId) || currentRoom;
    const guestsSummary = `${adults} Adults${Number(children) > 0 ? `, ${children} Children` : ''}`;

    const formData = {
      name,
      email,
      phone,
      checkIn,
      checkOut,
      guests: guestsSummary,
      roomType: formRoomId,
      message: message || `Booking for ${numRooms} room(s) at Ocean Breeze`
    };

    try {
      const result = await bookingStore.submitWithSheetsCheck(formData, (progress) => {
        setProgressText(progress);
      });

      if (result.success && result.booking) {
        onSuccess({
          roomName: selectedRoomDetails.name,
          checkIn,
          checkOut,
          confirmationCode: result.booking.confirmationCode || 'OB-PENDING',
          guestName: name
        });
        onBackToRooms();
      } else {
        setErrorText(result.error || 'The requested room is unavailable for the selected dates. Please adjust your calendar.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'A network error occurred. Please try again.');
      setIsSubmitting(false);
    }
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

  return (
    <div id="room-details-view" className="bg-slate-50 min-h-screen pt-24 pb-20">
      
      {/* Dynamic SEO Title & Headings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <button
          onClick={onBackToRooms}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-charcoal hover:bg-slate-100 text-xs font-semibold tracking-wider uppercase border border-slate-200/60 shadow-xs cursor-pointer transition-all duration-300 active:scale-95 mb-6"
        >
          <ChevronLeft className="w-4 h-4 text-sunset" /> Back to Accommodations
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/60 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-sunset bg-sunset/10 px-3 py-1 rounded-full">
                {currentRoom.featured ? 'Featured Sanctuary' : 'Curated Comfort'}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-500" /> 4.9 (245 Reviews)
              </div>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight mt-3">
              {currentRoom.name}
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-2 font-medium">
              <MapPin className="w-4 h-4 text-coral" /> Urbiztondo Surf Beachfront, San Juan, La Union, 2514, Philippines
            </p>
          </div>
          
          <div className="text-left md:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Exclusive Rate</span>
            <div className="flex items-baseline md:justify-end gap-1 mt-1">
              <span className="font-serif text-3xl font-bold text-sunset">₱{currentRoom.price.toLocaleString()}</span>
              <span className="text-xs text-gray-400 font-medium"> / Night</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Includes complimentary gourmet breakfast</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* LEFT COLUMN: Media Showcase & Room Insights */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Elegant Layout Photo Grid (Screenshot 2 Styled) */}
            <div className="flex flex-col sm:flex-row gap-4 h-[350px] sm:h-[450px]">
              {/* Stacked Vertical Thumbnails (4 images) */}
              <div className="hidden sm:flex flex-col gap-3 w-1/4 h-full shrink-0">
                {galleryImages.slice(1, 5).map((img, idx) => {
                  const actualIdx = idx + 1;
                  const isActive = activeImageIndex === actualIdx;
                  return (
                    <button
                      key={img}
                      onClick={() => setActiveImageIndex(actualIdx)}
                      className={`relative rounded-2xl overflow-hidden h-[calc(25%-9px)] border-2 transition-all duration-300 focus:outline-none cursor-pointer group ${
                        isActive ? 'border-sunset shadow-md' : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${currentRoom.name} Detail ${actualIdx}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {actualIdx === 4 && galleryImages.length > 5 && (
                        <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-xs">
                          +{galleryImages.length - 4} Photos
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Large Selected Hero Image */}
              <div className="w-full sm:w-3/4 h-full relative rounded-3xl overflow-hidden shadow-xl border border-white">
                <img
                  src={galleryImages[activeImageIndex] || currentRoom.image}
                  alt={`${currentRoom.name} Main View`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Bookmark/Save Button & Share Button */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-charcoal hover:bg-white active:scale-90 cursor-pointer focus:outline-none transition-transform"
                    title="Share Room Link"
                  >
                    <Share2 className="w-4 h-4 text-coral" />
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-charcoal hover:bg-white active:scale-90 cursor-pointer focus:outline-none transition-transform"
                    title="Bookmark Sanctuary"
                  >
                    <Bookmark className={`w-4 h-4 transition-colors ${isBookmarked ? 'text-sunset fill-sunset' : 'text-sunset'}`} />
                  </button>
                </div>

                {/* Video Tour Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal/10">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => alert('Virtual room tour is currently being processed. Please enjoy our high-definition photograph collection!')}
                    className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-2xl text-sunset hover:text-sunset-600 focus:outline-none cursor-pointer"
                  >
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-current ml-1" />
                  </motion.button>
                </div>

                {/* Active Image Indicator */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-charcoal/80 text-white text-[10px] uppercase tracking-wider font-semibold">
                  Photo {activeImageIndex + 1} of {galleryImages.length}
                </div>
              </div>
            </div>

            {/* Micro Mobile Thumbnails for Responsiveness */}
            <div className="flex sm:hidden gap-2 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative rounded-xl overflow-hidden w-16 h-12 border shrink-0 focus:outline-none cursor-pointer ${
                    activeImageIndex === idx ? 'border-sunset' : 'border-transparent'
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
                  className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl p-3 text-xs font-semibold tracking-wide flex items-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4 text-emerald-600" /> Link copied to clipboard! Share it with friends and family.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feature Badges Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2F1] flex items-center justify-center text-[#1E4E4B] shrink-0">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider leading-none">Bed Setup</span>
                  <span className="text-xs font-bold text-charcoal truncate block mt-1">{currentRoom.bedType}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2F1] flex items-center justify-center text-[#1E4E4B] shrink-0">
                  <Bath className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider leading-none">Bathrooms</span>
                  <span className="text-xs font-bold text-charcoal truncate block mt-1">1 Bath Suite</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2F1] flex items-center justify-center text-[#1E4E4B] shrink-0">
                  <Ruler className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider leading-none">Room Size</span>
                  <span className="text-xs font-bold text-charcoal truncate block mt-1">{currentRoom.size}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2F1] flex items-center justify-center text-[#1E4E4B] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider leading-none">Capacity</span>
                  <span className="text-xs font-bold text-charcoal truncate block mt-1">{currentRoom.capacity}</span>
                </div>
              </div>
            </div>

            {/* Overview Narrative */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gray-100 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sunset" /> Room Overview
              </h2>
              <p className="text-gray-500 font-sans text-sm font-light leading-relaxed mt-4">
                {currentRoom.description}
              </p>
              <p className="text-gray-500 font-sans text-sm font-light leading-relaxed mt-3">
                Experience unparalleled restoration in this high-contrast custom layout, explicitly designed to blend native Filipino craft with modern premium conveniences. Soak in fresh sea breezes, view gorgeous ocean tides, and relax in pristine beddings made exclusively for Ocean Breeze Resort guests.
              </p>
            </div>

            {/* High-Fidelity Room Amenities Grid */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sunset" /> Luxury Amenities
              </h2>
              <p className="text-gray-400 font-sans text-xs mt-1.5 leading-relaxed font-light">
                Our beachfront suites are thoughtfully equipped with state-of-the-art facilities designed for maximum comfort.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {currentRoom.amenities.map((amenity) => {
                  const IconComponent = getIconForAmenity(amenity);
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-coral shrink-0 border border-slate-100">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-charcoal font-sans">{amenity}</span>
                    </div>
                  );
                })}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-coral shrink-0 border border-slate-100">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-charcoal font-sans">High-Speed Wi-Fi</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-coral shrink-0 border border-slate-100">
                    <Tv className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-charcoal font-sans">4K Flat-Screen TV</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-coral shrink-0 border border-slate-100">
                    <Wind className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-charcoal font-sans">Silent AC Unit</span>
                </div>
              </div>
            </div>

            {/* Check-in / Check-out Guidelines */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gray-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sunset" /> Stay Rules & Policies
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-3">
                  <h3 className="font-sans text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sunset" /> Check-In Policies
                  </h3>
                  <ul className="space-y-2 text-xs text-gray-500 font-light font-sans pl-3.5 list-disc leading-relaxed">
                    <li>Check-in begins at 2:00 PM standard local time.</li>
                    <li>Complimentary welcome refreshment served upon arrival.</li>
                    <li>Physical valid government photo ID card is mandatory.</li>
                    <li>Minimum check-in age is 18 years old.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-sans text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral" /> Check-Out Policies
                  </h3>
                  <ul className="space-y-2 text-xs text-gray-500 font-light font-sans pl-3.5 list-disc leading-relaxed">
                    <li>Check-out must be completed prior to 12:00 PM (Noon).</li>
                    <li>Late checkout requests are subject to room availability.</li>
                    <li>Express lockbox check-out services are active.</li>
                    <li>Keycard return at the beachfront reception desk.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pristine Custom Map Layout (Screenshot 2 Styled Map Card) */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gray-100 pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sunset" /> Resort Location
              </h2>
              <p className="text-gray-400 font-sans text-xs mt-1.5 leading-relaxed font-light mb-4">
                Enjoy immediate, direct beachfront access on Urbiztondo highway. Steps away from primary La Union surf breaks.
              </p>
              
              {/* Stylized Vector Mock Map Container */}
              <div className="relative rounded-2xl overflow-hidden h-64 border border-slate-150 shadow-inner bg-[#EAEAEA] flex items-center justify-center">
                
                {/* Visual SVG Map representation */}
                <svg className="absolute inset-0 w-full h-full opacity-80" xmlns="http://www.w3.org/2000/svg">
                  {/* Sea area on left/top */}
                  <path d="M 0 0 L 150 0 Q 200 120 100 256 L 0 256 Z" fill="#D4E6E6" />
                  <text x="30" y="100" fill="#2E4E4E" fontFamily="sans-serif" fontSize="11" fontWeight="bold" opacity="0.4" transform="rotate(-40, 30, 100)">
                    WEST PHILIPPINE SEA
                  </text>
                  
                  {/* Sandy coastline */}
                  <path d="M 150 0 Q 200 120 100 256" stroke="#F1D1A1" strokeWidth="12" fill="none" />
                  
                  {/* Custom Roads */}
                  <line x1="250" y1="0" x2="200" y2="256" stroke="#FFFFFF" strokeWidth="18" />
                  <line x1="250" y1="0" x2="200" y2="256" stroke="#CCCCCC" strokeWidth="8" />
                  <text x="180" y="80" fill="#777777" fontFamily="sans-serif" fontSize="8" transform="rotate(78, 180, 80)">
                    National Highway
                  </text>
                  
                  <line x1="120" y1="50" x2="400" y2="120" stroke="#FFFFFF" strokeWidth="14" />
                  <line x1="120" y1="50" x2="400" y2="120" stroke="#DDDDDD" strokeWidth="6" />
                  <text x="250" y="94" fill="#777777" fontFamily="sans-serif" fontSize="8" transform="rotate(12, 250, 94)">
                    Urbiztondo Road
                  </text>
                  
                  {/* Extra landmarks */}
                  <rect x="280" y="150" width="80" height="40" rx="6" fill="#D3D9D9" />
                  <text x="285" y="174" fill="#666666" fontFamily="sans-serif" fontSize="8" fontWeight="bold">
                    Surf School Center
                  </text>
                </svg>

                {/* Glowing Circular Custom Pin Marker */}
                <div className="absolute left-[52%] top-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="absolute w-12 h-12 rounded-full bg-sunset/20 animate-ping" />
                  <div className="w-10 h-10 rounded-full bg-sunset border-4 border-white shadow-xl flex items-center justify-center text-white z-10">
                    <MapPin className="w-4 h-4 fill-white" />
                  </div>
                  <div className="mt-2 bg-charcoal text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg border border-charcoal/30">
                    Ocean Breeze Resort
                  </div>
                </div>

                {/* Quick directions helper */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/50 shadow-sm text-[10px] text-gray-500 font-medium">
                  🏄 <span className="text-charcoal font-bold">2-min walk</span> to Surfing Point
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xl">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal border-b border-gray-100 pb-4 mb-6">
                Book Room
              </h2>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {/* Guest Name */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 font-sans text-xs font-semibold text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Guest Email */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                    Your Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 font-sans text-xs font-semibold text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Guest Phone */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +63 917 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 font-sans text-xs font-semibold text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                      Check-In *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        disabled={isSubmitting}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-2 font-sans text-[11px] font-semibold text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                      Check-Out *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        disabled={isSubmitting}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-2 font-sans text-[11px] font-semibold text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Room selection & count */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                      Room Type *
                    </label>
                    <select
                      value={formRoomId}
                      onChange={(e) => setFormRoomId(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-sans text-[11px] font-semibold text-charcoal focus:bg-white focus:border-sunset focus:outline-none cursor-pointer transition-all"
                    >
                      {roomsList.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                      No. of Rooms *
                    </label>
                    <select
                      value={numRooms}
                      onChange={(e) => setNumRooms(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-sans text-[11px] font-semibold text-charcoal focus:bg-white focus:border-sunset focus:outline-none cursor-pointer transition-all"
                    >
                      <option value="1">1 Room</option>
                      <option value="2">2 Rooms</option>
                      <option value="3">3 Rooms</option>
                    </select>
                  </div>
                </div>

                {/* Adults & Kids */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                      Adults *
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-sans text-[11px] font-semibold text-charcoal focus:bg-white focus:border-sunset focus:outline-none cursor-pointer transition-all"
                    >
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4 Adults</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                      Children *
                    </label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-sans text-[11px] font-semibold text-charcoal focus:bg-white focus:border-sunset focus:outline-none cursor-pointer transition-all"
                    >
                      <option value="0">0 Kids</option>
                      <option value="1">1 Kid</option>
                      <option value="2">2 Kids</option>
                      <option value="3">3 Kids</option>
                    </select>
                  </div>
                </div>

                {/* Custom messages */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                    Special Requests
                  </label>
                  <textarea
                    placeholder="e.g., Early check-in preference, dietary requirements, surf board storage."
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-sans text-xs font-semibold text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* Error prompt */}
                {errorText && (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 text-xs text-rose-800 font-semibold flex gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{errorText}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1E3F3D] hover:bg-[#152D2B] disabled:bg-[#1E3F3D]/65 text-white text-xs font-bold uppercase py-3.5 rounded-xl tracking-widest transition-all duration-300 shadow-md shadow-[#1E3F3D]/20 mt-6 flex items-center justify-center gap-2 cursor-pointer focus:outline-none active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Securing...
                    </>
                  ) : (
                    <>
                      Book Now <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Secure Booking Indicator */}
              <div className="flex items-center justify-center gap-1.5 text-gray-400 mt-4 text-[10px] font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> End-to-End Secure Booking
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Progress Overlay Modal for Real-time Google Sheets check */}
      <AnimatePresence>
        {isSubmitting && (
          <div className="fixed inset-0 bg-charcoal/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-100 shadow-2xl flex flex-col items-center"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-sunset/15 animate-ping w-14 h-14" />
                <div className="w-14 h-14 rounded-full bg-sunset/10 flex items-center justify-center text-sunset relative z-10">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">
                Verifying Stay Vacancy
              </h3>
              
              {/* Progress updates */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 w-full text-xs font-medium text-gray-500 font-sans italic min-h-[50px] flex items-center justify-center">
                {progressText}
              </div>

              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-6 leading-relaxed">
                Checking Ocean Breeze live Google Sheet calendar synchronizations
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
