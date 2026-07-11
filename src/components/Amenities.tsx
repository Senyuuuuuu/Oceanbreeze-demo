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
  Trees
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
    id: 'pool',
    name: 'Infinity Swimming Pool',
    description: 'A gorgeous, freshwater swimming pool looking directly onto La Union\'s coastal horizon.',
    icon: Waves,
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
    description: 'Safe play areas, shallow pool sections, and fun activities suitable for children.',
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

interface AmenitiesProps {
  onChangePage?: (page: string) => void;
}

export default function Amenities({ onChangePage }: AmenitiesProps) {
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
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset mb-2 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-coral" /> Leisure & Living
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
            Curated Amenities For Your Comfort
          </h3>
          <p className="mt-4 text-gray-400 font-sans text-sm leading-relaxed font-light">
            Whether looking for thrilling aquatic adventures or complete beachfront repose, our bespoke services guarantee an unforgettable stay in La Union.
          </p>
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

        {/* Special Activity Offer Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-charcoal to-charcoal/90 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl"
        >
          {/* Subtle sunburst overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sunset/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-ocean/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase font-bold text-sand tracking-widest block mb-2">
                🏄‍♂️ La Union Surfing Capital
              </span>
              <h4 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                Want to catch the legendary Urbiztondo swell?
              </h4>
              <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed">
                Ocean Breeze Resort partners with professional local surf instructors. Book surfboards and personal coaches directly at the front desk upon check-in! Suitable for absolute beginners up to expert wave-riders.
              </p>
            </div>
            <div className="shrink-0">
              <a
                href="#contact"
                className="inline-block px-6 py-3.5 rounded-full bg-sunset hover:bg-sunset/90 text-white font-sans text-xs font-bold uppercase tracking-wider shadow-lg shadow-sunset/15 text-center active:scale-95 transition-transform"
              >
                Inquire Surf Packages
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
