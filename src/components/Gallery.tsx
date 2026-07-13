import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Eye, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'room-1',
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    category: 'rooms',
    title: 'Deluxe Beachfront Suite',
    description: 'Bask in premium linens and direct sea panoramas.'
  },
  {
    id: 'beach-1',
    url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    category: 'beach',
    title: 'Serene Coastal Horizon',
    description: 'La Union\'s beautiful and calm coastal tides right outside our door.'
  },
  {
    id: 'pool-1',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    category: 'pool',
    title: 'Horizon Infinity Pool',
    description: 'Unwind at our ocean-facing swimming pool decks.'
  },
  {
    id: 'sunset-1',
    url: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?auto=format&fit=crop&w=800&q=80',
    category: 'sunset',
    title: 'Dramatic Coastline Sunset',
    description: 'Behold the incredible orange and pink skies of San Juan.'
  },
  {
    id: 'room-2',
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    category: 'rooms',
    title: 'Sunset Villa Deck',
    description: 'Private villa deck leading straight into refreshing waters.'
  },
  {
    id: 'events-1',
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    category: 'events',
    title: 'Seaside Canopy Dinner',
    description: 'Memorable private catering under romantic beach lanterns.'
  },
  {
    id: 'beach-2',
    url: 'https://images.unsplash.com/photo-1473116763269-255ea7604bb6?auto=format&fit=crop&w=800&q=80',
    category: 'beach',
    title: 'Pristine Sand Sights',
    description: 'A secluded sanctuary of warm sand and soft ocean breezes.'
  },
  {
    id: 'pool-2',
    url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    category: 'pool',
    title: 'Poolside Cabana Lounging',
    description: 'Relax with artisanal cocktails under tropical palm leaf shade.'
  },
  {
    id: 'events-2',
    url: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80',
    category: 'events',
    title: 'Tropical Beachfront Nuptials',
    description: 'Bespoke weddings crafted along the sunset horizon.'
  },
  {
    id: 'sunset-2',
    url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
    category: 'sunset',
    title: 'Palm-Framed Sundown',
    description: 'Golden hour silhouette relaxation at Ocean Breeze.'
  }
];

const CATEGORIES = [
  { value: 'all', label: 'All Sights' },
  { value: 'rooms', label: 'Suites & Villas' },
  { value: 'beach', label: 'Beachside Sights' },
  { value: 'pool', label: 'Resort Amenities' },
  { value: 'events', label: 'Curated Events' },
  { value: 'sunset', label: 'Sunsets' }
];

export default function Gallery() {
  const [filter, setFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = filter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === filter);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => {
      if (prev === null) return null;
      const targetList = filteredItems;
      return prev === 0 ? targetList.length - 1 : prev - 1;
    });
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => {
      if (prev === null) return null;
      const targetList = filteredItems;
      return prev === targetList.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <section id="gallery" className="py-24 bg-slate-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset mb-2 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-coral" /> Gallery Showcase
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
            Glimpses of Beachfront Paradise
          </h3>
          <p className="mt-4 text-gray-400 font-sans text-sm leading-relaxed font-light">
            Flip through real captures of our stunning suites, cozy cabanas, wellness sessions, beachside dining setups, and legendary La Union sunsets.
          </p>
        </motion.div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.value}
              onClick={() => {
                setFilter(cat.value);
                setLightboxIndex(null); // Reset index on filter change
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={`px-5 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer focus:outline-none ${
                filter === cat.value
                  ? 'bg-sunset text-white shadow-lg shadow-sunset/15 scale-102'
                  : 'bg-white text-charcoal/80 border border-gray-100 hover:border-sand hover:bg-sand/10'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Pinterest-Style Masonry Columns Grid */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] box-border mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLightboxIndex(index)}
                className="break-inside-avoid relative rounded-3xl overflow-hidden shadow-md group cursor-pointer bg-white border border-gray-100"
              >
                {/* Visual Asset Container */}
                <div className="relative overflow-hidden aspect-auto">
                  <motion.img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  {/* Glass overlay on Hover */}
                  <div className="absolute inset-0 bg-charcoal/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4">
                    <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-3 transition-transform duration-300 group-hover:scale-105">
                      <Eye className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-center leading-tight">
                      {item.title}
                    </h4>
                    <p className="font-sans text-[11px] text-sand text-center mt-1 uppercase tracking-widest font-semibold">
                      {item.category}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal Full Screen Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 backdrop-blur-md p-4">
            
            {/* Click backdrop to exit */}
            <div
              className="absolute inset-0 z-0"
              onClick={() => setLightboxIndex(null)}
            />

            {/* Top Close Bar */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 text-white select-none pointer-events-none">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-coral" />
                <span className="font-sans text-xs tracking-wider uppercase font-semibold text-white/80">
                  Sights of Ocean Breeze • {lightboxIndex + 1} / {filteredItems.length}
                </span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/25 pointer-events-auto transition-colors focus:outline-none"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Left Control Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition-colors focus:outline-none"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Center Main Zoomed Image with smooth entry transitions */}
            <div className="relative z-0 max-w-4xl max-h-[75vh] flex flex-col items-center">
              <motion.img
                key={filteredItems[lightboxIndex].id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                src={filteredItems[lightboxIndex].url}
                alt={filteredItems[lightboxIndex].title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[65vh] rounded-2xl object-contain shadow-2xl border border-white/10"
              />

              {/* Dynamic bottom caption bar */}
              <motion.div
                key={`caption-${filteredItems[lightboxIndex].id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center text-white"
              >
                <h4 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  {filteredItems[lightboxIndex].title}
                </h4>
                <p className="text-gray-400 font-sans text-xs sm:text-sm leading-relaxed max-w-md mx-auto mt-1 font-light">
                  {filteredItems[lightboxIndex].description}
                </p>
              </motion.div>
            </div>

            {/* Right Control Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition-colors focus:outline-none"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
