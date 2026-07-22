import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Eye, X, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { GalleryItem } from '../types';

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'img-1',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/500016309_122160869408567801_3523801660810124387_n.jpg',
    category: 'beach',
    title: 'Pristine Beachfront Escape',
    description: 'Soft white sand meeting the legendary waves of San Juan, La Union.'
  },
  {
    id: 'img-2',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/499882580_122160869432567801_4746683546836728535_n.jpg',
    category: 'sunset',
    title: 'Breathtaking Coastal View',
    description: 'Witness the iconic golden hour transitions painting the La Union horizon.'
  },
  {
    id: 'img-3',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/499548270_122160869378567801_3422192562523644746_n.jpg',
    category: 'pool',
    title: 'Luxurious Tropical Lounge',
    description: 'Soak up the warm sun on our elegant lakeside and beachside poolside loungers.'
  },
  {
    id: 'img-4',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/476117653_122136096512567801_2787783767455324059_n.jpg',
    category: 'pool',
    title: 'Peaceful Sanctuary Poolside',
    description: 'An oasis of pure relaxation designed with local tropical flora.'
  },
  {
    id: 'img-5',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/476183028_122136399722567801_208159314301597754_n.jpg',
    category: 'rooms',
    title: 'Eco-Luxury Pavilions',
    description: 'Intimate custom architectures celebrating native coastal building crafts.'
  },
  {
    id: 'img-6',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/480743406_122140595966567801_8029553201407761439_n.jpg',
    category: 'sunset',
    title: 'Aura of Serenity',
    description: 'Warm evening skies casting a cinematic glow across the private beachfront.'
  },
  {
    id: 'img-7',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/470662967_122126767028567801_4838850329032995563_n.jpg',
    category: 'rooms',
    title: 'Oceanfront Balcony Suite',
    description: 'Breathtaking beachfront terrace designed for ultimate relaxation and seaside views.'
  },
  {
    id: 'img-8',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/471177892_122126766494567801_1319897082249495456_n.jpg',
    category: 'rooms',
    title: 'Artisanal Beach Cabin',
    description: 'Elegantly constructed villas blending native aesthetics with modern luxury.'
  },
  {
    id: 'img-9',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/470806685_122126767124567801_8236105001071069558_n.jpg',
    category: 'pool',
    title: 'Poolside Sanctuary',
    description: 'Tranquil poolside lounging surrounded by native tropical palms.'
  },
  {
    id: 'img-10',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/471160471_122126766680567801_5430804506911404527_n.jpg',
    category: 'beach',
    title: 'Surfside Vista',
    description: 'Direct oceanfront access to the famous surf breaks of San Juan.'
  },
  {
    id: 'img-11',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/471192652_122126767052567801_6471844890659586378_n.jpg',
    category: 'sunset',
    title: 'La Union Golden Hour',
    description: 'Breathtaking sunsets over the pristine West Philippine Sea.'
  },
  {
    id: 'img-12',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/471195611_122126979428567801_275930808819474753_n.jpg',
    category: 'rooms',
    title: 'Boutique Coastal Retreat',
    description: 'Thoughtfully styled interior spaces combining bamboo and modern luxury.'
  },
  {
    id: 'img-13',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/471206605_122126767154567801_7367783948104014537_n.jpg',
    category: 'pool',
    title: 'Resort Sun Deck',
    description: 'Relax on premium lounge beds with panoramic pool and garden views.'
  },
  {
    id: 'img-14',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/471249571_122126767016567801_2885415640272354363_n.jpg',
    category: 'beach',
    title: 'Oceanfront Palms',
    description: 'Lush tropical greenery overlooking the warm ocean tides.'
  },
  {
    id: 'img-15',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/471306800_122126767106567801_5009699414550068329_n.jpg',
    category: 'rooms',
    title: 'Seaside Haven',
    description: 'Elegantly appointed suites crafted for ultimate peace and rest.'
  },
  {
    id: 'img-16',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/471493511_122126979572567801_5976582801151181444_n.jpg',
    category: 'sunset',
    title: 'Sunset Horizon',
    description: 'Serene dusk colors lighting up the evening beach sky.'
  },
  {
    id: 'img-17',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/471564081_122126979962567801_4155031567262849951_n.jpg',
    category: 'beach',
    title: 'Tropical Grounds',
    description: 'Winding garden pathways connecting villas to the sandy shore.'
  },
  {
    id: 'img-18',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/473748832_122132546324567801_2877340831206792826_n.jpg',
    category: 'pool',
    title: 'Lakeside Oasis',
    description: 'Tranquil water features amidst serene coastal flora.'
  },
  {
    id: 'img-19',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/475835722_122136096632567801_8600835835191816222_n.jpg',
    category: 'rooms',
    title: 'Coastal Villa Pavilion',
    description: 'Secluded beachfront sanctuary built with eco-conscious materials.'
  },
  {
    id: 'img-20',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/475899825_122136399272567801_2235547433093645147_n.jpg',
    category: 'beach',
    title: 'Beachside Solitude',
    description: 'Quiet morning walks along the soft San Juan sands.'
  },
  {
    id: 'img-21',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/475973257_122136096806567801_1727814968072065094_n.jpg',
    category: 'rooms',
    title: 'Eco-Luxury Lounge',
    description: 'Spacious coastal living quarters filled with natural sea breeze.'
  },
  {
    id: 'img-22',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/476108929_122135808416567801_93743331122749284_n.jpg',
    category: 'beach',
    title: 'Resort Lawn & Palms',
    description: 'Expansive grassy spaces ideal for sunset yoga and relaxation.'
  },
  {
    id: 'img-23',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/476164445_122136399578567801_1204887450810324273_n.jpg',
    category: 'rooms',
    title: 'Al-Fresco Terrace',
    description: 'Private balcony overlooking the tranquil garden landscape.'
  },
  {
    id: 'img-24',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/476223200_122136977408567801_4841154761385790218_n.jpg',
    category: 'sunset',
    title: 'Twilight Magic',
    description: 'Chasing vivid purple and golden hues at sunset.'
  },
  {
    id: 'img-25',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/476815417_122136977504567801_5888613587905855298_n.jpg',
    category: 'beach',
    title: 'Golden Beachfront',
    description: 'Panoramic coastal horizons bathed in warm sunlight.'
  },
  {
    id: 'img-26',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/480290635_122139108338567801_2577860041803326842_n.jpg',
    category: 'rooms',
    title: 'Ocean View Villa',
    description: 'Uninterrupted ocean vistas from your private room terrace.'
  },
  {
    id: 'img-27',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/480403365_122139107792567801_3782778962351162906_n.jpg',
    category: 'pool',
    title: 'Pool & Garden Lounge',
    description: 'Refresh yourself in our crystal-clear tropical pool.'
  },
  {
    id: 'img-28',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/480742956_122140595558567801_6324144565661516274_n.jpg',
    category: 'beach',
    title: 'Shoreline Paradise',
    description: 'Pristine shores and clear turquoise tides of La Union.'
  },
  {
    id: 'img-29',
    url: 'https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/481288466_122140596416567801_29869989324114043_n.jpg',
    category: 'sunset',
    title: 'Sunset Water Reflection',
    description: 'Dramatic evening reflections along the coastal waters.'
  }
];

interface GalleryProps {
  isHomeSection?: boolean;
  onChangePage?: (pageId: string) => void;
}

export default function Gallery({ isHomeSection = false, onChangePage }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive slicing for home page section: 6 photos on mobile (<768px), 8 on laptop/desktop
  const limitCount = isHomeSection ? (isMobile ? 6 : 8) : GALLERY_ITEMS.length;
  const displayedItems = GALLERY_ITEMS.slice(0, limitCount);

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
  }, [lightboxIndex, displayedItems.length]);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => {
      if (prev === null) return null;
      return prev === 0 ? displayedItems.length - 1 : prev - 1;
    });
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => {
      if (prev === null) return null;
      return prev === displayedItems.length - 1 ? 0 : prev + 1;
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
          <span className="text-xs font-seasons font-bold uppercase tracking-[0.25em] text-sunset mb-2 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-coral" /> Gallery Showcase
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
            Glimpses of Beachfront Paradise
          </h3>
          <p className="mt-4 text-gray-400 font-sans text-sm leading-relaxed font-light">
            Flip through real captures of our stunning suites, cozy cabanas, wellness sessions, beachside dining setups, and legendary La Union sunsets.
          </p>
        </motion.div>

        {/* Pinterest-Style Masonry Columns Grid */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] box-border mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item, index) => (
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

        {/* View More Button for Home Page Section */}
        {isHomeSection && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <motion.button
              onClick={() => onChangePage?.('gallery')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-charcoal text-white hover:bg-sunset font-sans text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-charcoal/10 hover:shadow-sunset/25 transition-all duration-300 cursor-pointer group"
            >
              <span>View More Photos ({GALLERY_ITEMS.length - displayedItems.length}+ remaining)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal Full Screen Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && displayedItems[lightboxIndex] && (
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
                  Sights of Ocean Breeze • {lightboxIndex + 1} / {displayedItems.length}
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
                key={displayedItems[lightboxIndex].id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                src={displayedItems[lightboxIndex].url}
                alt={displayedItems[lightboxIndex].title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[65vh] rounded-2xl object-contain shadow-2xl border border-white/10"
              />

              {/* Dynamic bottom caption bar */}
              <motion.div
                key={`caption-${displayedItems[lightboxIndex].id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center text-white"
              >
                <h4 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  {displayedItems[lightboxIndex].title}
                </h4>
                <p className="text-gray-400 font-sans text-xs sm:text-sm leading-relaxed max-w-md mx-auto mt-1 font-light">
                  {displayedItems[lightboxIndex].description}
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

