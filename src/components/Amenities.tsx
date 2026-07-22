import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Waves,
  Utensils,
  Wifi,
  Wind,
  Car,
  Heart,
  CalendarDays,
  Flame,
  Trees,
  MapPin,
  ThumbsUp,
  Coffee,
  Check,
  Shield,
  Gamepad2,
  Tv,
  Bath,
  Shirt,
  Info
} from 'lucide-react';

interface AmenityItem {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  colorClass: string; // Background color accent
  iconColor: string; // SVG icon color
}

const AMENITIES_DATA: AmenityItem[] = [
  {
    id: 'wellness',
    name: 'Beachfront Yoga & Wellness Deck',
    description: 'An open-air, elevated wooden platform right on the sand for daily sunrise yoga, restorative meditation, and sound healing.',
    icon: Sparkles,
    colorClass: 'bg-ocean/10',
    iconColor: 'text-ocean'
  },
  {
    id: 'beach',
    name: 'Direct Beachfront Access',
    description: 'Step straight from our garden onto the warm sands of Urbiztondo beachfront.',
    icon: Trees,
    colorClass: 'bg-sand/30',
    iconColor: 'text-sunset'
  },
  {
    id: 'restaurant',
    name: 'Seaside Bar & Grill',
    description: 'Taste fresh catch and traditional Filipino delicacies prepared by local culinary experts.',
    icon: Utensils,
    colorClass: 'bg-coral/15',
    iconColor: 'text-sunset'
  },
  {
    id: 'wifi',
    name: 'High-Speed Fiber Wi-Fi',
    description: 'Blazing fast internet across the entire resort property, perfect for digital nomads.',
    icon: Wifi,
    colorClass: 'bg-slate-100',
    iconColor: 'text-charcoal'
  },
  {
    id: 'ac',
    name: 'Air Conditioned Spaces',
    description: 'Keep cool and refreshed inside our fully climate-controlled suites and lofts.',
    icon: Wind,
    colorClass: 'bg-ocean/10',
    iconColor: 'text-ocean'
  },
  {
    id: 'parking',
    name: 'Secure Guest Parking',
    description: 'Complimentary gated and monitored private vehicle parking spaces for all guests.',
    icon: Car,
    colorClass: 'bg-slate-100',
    iconColor: 'text-charcoal'
  },
  {
    id: 'family',
    name: 'Family Friendly Zones',
    description: 'Safe play areas, shallow wading beach zones, and fun coastal activities suitable for children.',
    icon: Heart,
    colorClass: 'bg-coral/10',
    iconColor: 'text-coral'
  },
  {
    id: 'events',
    name: 'Beachfront Event Venue',
    description: 'Plan sunset weddings, corporate gatherings, or private parties on our shores.',
    icon: CalendarDays,
    colorClass: 'bg-sand/35',
    iconColor: 'text-sunset'
  },
  {
    id: 'bbq',
    name: 'Outdoor Grill & BBQ',
    description: 'Bespoke open-air grilling stations under palm trees for self-cooked beachfront dining.',
    icon: Flame,
    colorClass: 'bg-coral/20',
    iconColor: 'text-sunset'
  }
];

interface FacilityCategory {
  title: string;
  items: string[];
}

const ALL_FACILITIES: FacilityCategory[] = [
  {
    title: 'Kitchen',
    items: ['Freezer', 'Microwave', 'Oven', 'Refrigerator', 'Stove']
  },
  {
    title: 'Entertainment',
    items: ['Board games', 'Cable channels', 'Internet', 'TV', 'Wi-Fi']
  },
  {
    title: 'Safety and Cleanliness',
    items: [
      'Cleaned following Agoda or health guidelines',
      'Cleaning products used based on health guidelines',
      'Disinfected following Agoda or health guidelines',
      'Hand sanitizer and soap provided',
      'Physical distancing rules followed',
      'Protective face covering on staff',
      'Temperature check for guests and staff'
    ]
  },
  {
    title: 'Comforts',
    items: ['Air conditioning', 'Linens', 'Private entrance']
  },
  {
    title: 'Getting around',
    items: ['Free parking']
  },
  {
    title: 'Standard',
    items: ['Fans (ceiling or portable)', 'Laundromat nearby']
  },
  {
    title: 'Outdoor',
    items: ['BBQ grill', 'Beachfront', 'Garden or backyard', 'Waterfront']
  },
  {
    title: 'Dining, drinking, and snacking',
    items: ['Coffee or tea', 'Kitchen']
  },
  {
    title: 'Bathroom and toiletries',
    items: ['Towels']
  },
  {
    title: 'Clothing and laundry',
    items: ['Closet']
  },
  {
    title: 'Safety and security features',
    items: ['Fire extinguisher', 'First aid kit', 'Smoke detector']
  }
];

interface AmenitiesProps {
  onChangePage?: (page: string) => void;
}

export default function Amenities({ onChangePage }: AmenitiesProps) {
  const [activeProvider, setActiveProvider] = React.useState<'agoda' | 'additional'>('agoda');

  // Stagger animation container
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="amenities" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-seasons font-bold uppercase tracking-[0.25em] text-sunset mb-2 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-coral" /> Leisure & Living
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
            Curated Amenities For Your Comfort
          </h3>
          <p className="mt-4 text-gray-400 font-sans text-sm leading-relaxed font-light">
            Whether looking for thrilling aquatic adventures or complete beachfront repose, our bespoke services guarantee an unforgettable stay in La Union.
          </p>
        </motion.div>
 
        {/* Guest Choice Highlights (Highly requested from real Airbnb/Google reviews) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
          className="bg-sky-50/40 rounded-3xl p-6 md:p-8 border border-sky-100/70 mb-16 shadow-sm relative overflow-hidden"
        >
          {/* Background subtle decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-sky-100/50">
            <div>
              <span className="text-[10px] uppercase font-bold text-sunset tracking-widest block mb-1">
                ⭐ Guest Highlights
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                Why Guests Highly Recommend Us
              </h4>
            </div>
            <p className="text-gray-400 font-sans text-xs mt-2 md:mt-0 max-w-sm leading-relaxed font-light">
              Verified details and feedback highlighted directly from guest booking platform experiences at Ocean Breeze Resort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Highlight 1: Ideal location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="flex flex-col items-start p-4 rounded-2xl hover:bg-white/50 transition-colors duration-300"
            >
              <div className="relative mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100/70 flex items-center justify-center text-rose-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border border-white flex items-center justify-center shadow-sm">
                  <ThumbsUp className="w-3 h-3 text-white fill-current" />
                </div>
              </div>
              <h5 className="font-sans font-semibold text-charcoal text-sm">Ideal location</h5>
              <p className="text-gray-400 font-sans text-xs italic mt-2 font-light leading-relaxed">
                "7mins from san juan (surfing capital ng ELyU)."
              </p>
            </motion.div>

            {/* Highlight 2: Sparkling clean */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="flex flex-col items-start p-4 rounded-2xl hover:bg-white/50 transition-colors duration-300"
            >
              <div className="relative mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100/70 flex items-center justify-center text-teal-500">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border border-white flex items-center justify-center shadow-sm">
                  <ThumbsUp className="w-3 h-3 text-white fill-current" />
                </div>
              </div>
              <h5 className="font-sans font-semibold text-charcoal text-sm">Sparkling clean</h5>
              <p className="text-gray-400 font-sans text-xs italic mt-2 font-light leading-relaxed">
                "Malinis ang room."
              </p>
            </motion.div>

            {/* Highlight 3: Air conditioning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.19 }}
              className="flex flex-col items-start p-4 rounded-2xl hover:bg-white/50 transition-colors duration-300"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100/70 flex items-center justify-center text-sky-600">
                  <Wind className="w-6 h-6 animate-pulse" style={{ animationDuration: '4s' }} />
                </div>
              </div>
              <h5 className="font-sans font-semibold text-charcoal text-sm">Air conditioning</h5>
              <p className="text-gray-400 font-sans text-xs mt-2 font-light leading-relaxed">
                Fully climate controlled suites and common spaces.
              </p>
            </motion.div>

            {/* Highlight 4: Breakfast [free] */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.26 }}
              className="flex flex-col items-start p-4 rounded-2xl hover:bg-white/50 transition-colors duration-300"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100/70 flex items-center justify-center text-amber-600">
                  <Coffee className="w-6 h-6" />
                </div>
              </div>
              <h5 className="font-sans font-semibold text-charcoal text-sm">Breakfast [free]</h5>
              <p className="text-gray-400 font-sans text-xs mt-2 font-light leading-relaxed">
                Complimentary fresh local breakfasts included with every stay.
              </p>
            </motion.div>

            {/* Highlight 5: Car park */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.33 }}
              className="flex flex-col items-start p-4 rounded-2xl hover:bg-white/50 transition-colors duration-300"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100/70 flex items-center justify-center text-slate-600">
                  <Car className="w-6 h-6" />
                </div>
              </div>
              <h5 className="font-sans font-semibold text-charcoal text-sm">Car park</h5>
              <p className="text-gray-400 font-sans text-xs mt-2 font-light leading-relaxed">
                Secure, gated on-site guest parking with 24/7 monitoring.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Interactive Staggered Grid of Amenities */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {AMENITIES_DATA.map((amenity) => {
            const IconComponent = amenity.icon;
            return (
              <motion.div
                key={amenity.id}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 md:p-8 rounded-3xl bg-[#FFFFFF] border border-slate-100 shadow-md hover:border-sand/50 transition-all duration-300 flex flex-col h-full group"
              >
                {/* Icon wrapper with custom Framer Motion hover zoom */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  className={`w-14 h-14 rounded-2xl ${amenity.colorClass} ${amenity.iconColor} flex items-center justify-center shrink-0 mb-6`}
                >
                  <IconComponent className="w-7 h-7" />
                </motion.div>

                <h4 className="font-serif text-lg font-bold text-charcoal mb-2 group-hover:text-sunset transition-colors">
                  {amenity.name}
                </h4>

                <p className="text-gray-400 font-sans text-xs sm:text-sm leading-relaxed font-light flex-grow mb-4">
                  {amenity.description}
                </p>

                {amenity.id === 'restaurant' && onChangePage && (
                  <button
                    onClick={() => onChangePage('restaurant')}
                    className="self-start mt-2 text-xs font-bold text-sunset hover:text-coral transition-colors flex items-center gap-1 cursor-pointer group/btn"
                  >
                    View Menu & Reservations
                    <span className="transform transition-transform group-hover/btn:translate-x-1">→</span>
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Agoda style Comprehensive Amenities & Facilities List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm"
        >
          {/* Header row with rating */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-100 pb-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-sky-50 text-sky-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-sky-100/60">
                  Agoda Verified
                </span>
                <span className="text-xs text-slate-400 font-sans">
                  Partner Property
                </span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
                Amenities & Facilities
              </h3>
              <p className="text-gray-400 font-sans text-xs sm:text-sm mt-1 font-light leading-relaxed">
                Comprehensive, industry-standard certified services for your absolute luxury and safety.
              </p>
            </div>

            {/* Exceptional Rating Badge with Live Reviews Switcher */}
            <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-slate-100/80 w-full lg:w-auto min-w-[280px] sm:min-w-[340px]">
              {/* Tabs */}
              <div className="flex border-b border-slate-200/60 pb-3 mb-4">
                <button
                  onClick={() => setActiveProvider('agoda')}
                  className={`flex-1 text-center font-sans text-[11px] font-bold uppercase tracking-wider pb-1 transition-colors relative cursor-pointer ${
                    activeProvider === 'agoda' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Agoda Reviews (4)
                  {activeProvider === 'agoda' && (
                    <motion.div layoutId="activeTabUnderline" className="absolute bottom-[-5px] left-0 right-0 h-[2.5px] bg-sky-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveProvider('additional')}
                  className={`flex-1 text-center font-sans text-[11px] font-bold uppercase tracking-wider pb-1 transition-colors relative cursor-pointer ${
                    activeProvider === 'additional' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Additional Reviews (9)
                  {activeProvider === 'additional' && (
                    <motion.div layoutId="activeTabUnderline" className="absolute bottom-[-5px] left-0 right-0 h-[2.5px] bg-sky-500 rounded-full" />
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex items-start gap-4">
                <div className="bg-sky-600 text-white rounded-xl px-3 py-1.5 font-sans font-bold text-lg sm:text-xl shrink-0 shadow-sm shadow-sky-600/10">
                  {activeProvider === 'agoda' ? '9.5' : '9.6'}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans font-bold text-slate-800 text-sm">Exceptional</span>
                    <span className="text-slate-400 text-xs">/ 10</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-sky-600 font-medium mt-0.5">
                    <Check className="w-3.5 h-3.5 text-sky-500 fill-current" />
                    <span>From {activeProvider === 'agoda' ? '4' : '9'} verified reviews</span>
                  </div>
                </div>
              </div>

              {/* Progress bars matching the screenshot */}
              <div className="mt-4 space-y-2.5 pt-3 border-t border-slate-100">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-sans font-medium text-slate-600">
                    <span>Cleanliness</span>
                    <span className="text-emerald-600 font-bold">{activeProvider === 'agoda' ? '9.4' : '9.3'}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: activeProvider === 'agoda' ? '94%' : '93%' }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-sans font-medium text-slate-600">
                    <span>Service</span>
                    <span className="text-emerald-600 font-bold">{activeProvider === 'agoda' ? '9.7' : '9.8'}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: activeProvider === 'agoda' ? '97%' : '98%' }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-sans font-medium text-slate-600">
                    <span>Location</span>
                    <span className="text-emerald-600 font-bold">{activeProvider === 'agoda' ? '9.5' : '9.6'}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: activeProvider === 'agoda' ? '95%' : '96%' }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-sans font-medium text-slate-600">
                    <span>Value for money</span>
                    <span className="text-emerald-600 font-bold">{activeProvider === 'agoda' ? '9.0' : '8.7'}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: activeProvider === 'agoda' ? '90%' : '87%' }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid layout of all detailed items from Agoda list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {ALL_FACILITIES.map((cat, idx) => {
              // Pick correct icon
              let CatIcon = Check;
              if (cat.title === 'Kitchen') CatIcon = Utensils;
              else if (cat.title === 'Entertainment') CatIcon = Tv;
              else if (cat.title === 'Safety and Cleanliness') CatIcon = Shield;
              else if (cat.title === 'Comforts') CatIcon = Wind;
              else if (cat.title === 'Getting around') CatIcon = Car;
              else if (cat.title === 'Standard') CatIcon = Sparkles;
              else if (cat.title === 'Outdoor') CatIcon = Waves;
              else if (cat.title === 'Dining, drinking, and snacking') CatIcon = Coffee;
              else if (cat.title === 'Bathroom and toiletries') CatIcon = Bath;
              else if (cat.title === 'Clothing and laundry') CatIcon = Shirt;
              else if (cat.title === 'Safety and security features') CatIcon = Info;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                    <CatIcon className="w-4 h-4 text-sky-600 shrink-0" />
                    <h4 className="font-sans font-bold text-slate-800 text-xs sm:text-sm tracking-wide uppercase">
                      {cat.title}
                    </h4>
                  </div>
                  <ul className="space-y-2.5">
                    {cat.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2.5 text-slate-500 group/item">
                        <Check className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span className="font-sans text-xs sm:text-sm text-slate-600 font-light group-hover/item:text-slate-900 transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Special Activity Offer Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-charcoal to-charcoal/90 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl"
        >
          {/* Custom style injection for high-performance GPU-accelerated wave animation */}
          <style>{`
            @keyframes waveMoveLeft {
              0% {
                transform: translate3d(0, 0, 0);
              }
              100% {
                transform: translate3d(-50%, 0, 0);
              }
            }
            @keyframes waveMoveRight {
              0% {
                transform: translate3d(-50%, 0, 0);
              }
              100% {
                transform: translate3d(0, 0, 0);
              }
            }
            .animate-wave-slow {
              animation: waveMoveLeft 25s linear infinite;
              will-change: transform;
            }
            .animate-wave-medium {
              animation: waveMoveRight 18s linear infinite;
              will-change: transform;
            }
            .animate-wave-fast {
              animation: waveMoveLeft 12s linear infinite;
              will-change: transform;
            }
          `}</style>

          {/* Subtle sunburst overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sunset/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-ocean/5 rounded-full blur-2xl pointer-events-none" />

          {/* Beautiful, smooth layered wave background animations */}
          <div className="absolute bottom-0 left-0 w-full h-36 pointer-events-none overflow-hidden select-none z-0 rounded-b-3xl">
            {/* Back wave: slow, deep tropical teal-blue */}
            <div className="absolute bottom-0 left-0 w-[200%] h-full animate-wave-slow opacity-85">
              <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path 
                  d="M 0 60 Q 150 100, 300 60 T 600 60 Q 750 100, 900 60 T 1200 60 L 1200 120 L 0 120 Z" 
                  fill="rgba(14, 116, 144, 0.75)"
                />
              </svg>
            </div>
            
            {/* Middle wave: medium, beautiful glowing cyan */}
            <div className="absolute bottom-0 left-0 w-[200%] h-full animate-wave-medium opacity-80">
              <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path 
                  d="M 0 70 Q 150 110, 300 70 T 600 70 Q 750 110, 900 70 T 1200 70 L 1200 120 L 0 120 Z" 
                  fill="rgba(6, 182, 212, 0.70)"
                />
              </svg>
            </div>

            {/* Front wave: fast, vibrant seafoam blue-white */}
            <div className="absolute bottom-0 left-0 w-[200%] h-full animate-wave-fast opacity-75">
              <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path 
                  d="M 0 80 Q 150 115, 300 80 T 600 80 Q 750 115, 900 80 T 1200 80 L 1200 120 L 0 120 Z" 
                  fill="rgba(56, 189, 248, 0.65)"
                />
              </svg>
            </div>

            {/* Elegant Modern Sailboat floating in place with the Waves */}
            <motion.div
              animate={{
                y: [0, -5, 1, -6, 0],
                rotate: [-4, 4, -4],
              }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute right-[10%] sm:right-[16%] md:right-[22%] bottom-[22px] sm:bottom-[28px] md:bottom-[32px] w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 z-10 text-white pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Modern Yacht/Sailboat */}
                {/* Boat Hull */}
                <path 
                  d="M 18 64 Q 45 67, 82 61 L 76 72 Q 45 75, 24 72 Z" 
                  fill="rgba(255, 255, 255, 0.95)" 
                />
                {/* Mast */}
                <path 
                  d="M 46 22 L 46 63" 
                  stroke="rgba(255, 255, 255, 0.9)" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
                {/* Main Sail (Sleek minimalist curve) */}
                <path 
                  d="M 48 24 C 62 38, 68 48, 72 58 L 48 58 Z" 
                  fill="rgba(255, 255, 255, 0.85)" 
                />
                {/* Jib Fore-sail */}
                <path 
                  d="M 44 26 C 36 38, 30 48, 25 58 L 44 58 Z" 
                  fill="rgba(255, 255, 255, 0.65)" 
                />
                {/* Small Coral-colored Sunset Accent Flag */}
                <path 
                  d="M 46 22 L 53 25 L 46 28 Z" 
                  fill="#FF8A65" 
                />
                {/* Glowing wave ripple under boat */}
                <ellipse 
                  cx="50" 
                  cy="74" 
                  rx="30" 
                  ry="1.5" 
                  fill="rgba(255, 255, 255, 0.3)" 
                />
              </svg>
            </motion.div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase font-bold text-sand tracking-widest block mb-2">
                🌿 Coastal Wellness Retreat
              </span>
              <h4 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                Want to experience complete beachfront tranquility?
              </h4>
              <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed">
                Ocean Breeze Resort hosts daily seaside meditation, guided sunrise yoga sessions, and sound healing led by certified practitioners. Reconnect with nature and nourish your soul steps away from the rhythmic ocean waves.
              </p>
            </div>
            <div className="shrink-0">
              <a
                href="#contact"
                className="inline-block px-6 py-3.5 rounded-full bg-sunset hover:bg-sunset/90 text-white font-sans text-xs font-bold uppercase tracking-wider shadow-lg shadow-sunset/15 text-center active:scale-95 transition-transform"
              >
                Explore Wellness Stay
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
