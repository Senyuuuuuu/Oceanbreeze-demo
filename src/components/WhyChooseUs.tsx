import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShieldCheck, Sun, Compass, Heart, DollarSign, Waves, Quote, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Testimonial } from '../types';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'location',
    title: 'Direct Beachfront Surf Spot',
    description: 'Situated on the legendary shores of San Juan, La Union. Steps from local surf lessons, hip cafes, and vibrant beach bars.',
    icon: Compass,
    color: 'text-sunset'
  },
  {
    id: 'pricing',
    title: 'Affordable Luxury Stays',
    description: 'Bask in premium high-thread linens, private ocean balcony features, and plunge pool options at incredibly competitive rates.',
    icon: DollarSign,
    color: 'text-ocean'
  },
  {
    id: 'family',
    title: 'Family-Friendly Oasis',
    description: 'We prioritize multi-guest safety with secure shallow swimming boundaries, expansive lawns, and private split-level lofts.',
    icon: Heart,
    color: 'text-coral'
  },
  {
    id: 'sunset',
    title: 'Legendary Golden Sunsets',
    description: 'Our resort overlooks the western horizon, giving you front-row ocean seats to San Juan\'s famous, highly Instagrammed sunsets.',
    icon: Sun,
    color: 'text-sunset'
  },
  {
    id: 'hospitality',
    title: 'Bespoke Local Hospitality',
    description: 'We provide personalized attention, coordinating custom airport shuttles, island excursions, and reservations with care.',
    icon: ShieldCheck,
    color: 'text-charcoal'
  },
  {
    id: 'serenity',
    title: 'Relaxing Beach Atmosphere',
    description: 'Thoughtfully structured with quiet tropical gardens, custom-made hammocks, and soothing soundscapes of ocean waves.',
    icon: Waves,
    color: 'text-ocean'
  }
];

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'review-1',
    name: 'Sophia Gomez',
    location: 'Manila, Philippines',
    rating: 5,
    comment: 'Staying here was pure magic. The beachfront view from our Sunset Villa is completely unmatched, and watching the sunset while sipping fresh coconut water is a memory our family will cherish forever. Truly premium hospitality!',
    date: 'June 2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'review-2',
    name: 'David Chen',
    location: 'Digital Nomad',
    rating: 5,
    comment: 'Perfect spot for remote working and early morning surf sessions. The fiber Wi-Fi was blazing fast throughout the resort property, rooms are modern with cold A/C, and you literally step onto the sand. Loved the Surfer\'s Cabin!',
    date: 'May 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'review-3',
    name: 'Maria Santos',
    location: 'Quezon City, Philippines',
    rating: 5,
    comment: 'Our family had the absolute best summer vacation here. The Family Loft was extremely spacious, and the pool is perfectly clean and safe. The resort team went above and beyond to organize board rentals and surf coaches for our kids.',
    date: 'April 2026',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  }
];

export default function WhyChooseUs() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play the testimonial deck every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Wave top and bottom layout borders */}
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-sand/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-ocean/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Core Features Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset mb-2 inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-coral" /> Ocean Breeze Advantage
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
                Crafting Unforgettable Beach Experiences
              </h3>
              <p className="mt-4 text-gray-400 font-sans text-sm sm:text-base leading-relaxed font-light mb-12">
                We stand apart in San Juan, La Union by offering a refined coastal retreat that respects the soul of local beach culture while providing high-end safety and luxury.
              </p>
            </motion.div>
 
            {/* Feature Cards Grid */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {FEATURE_CARDS.map((card) => {
                const IconComponent = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.6, ease: "easeOut" },
                      },
                    }}
                    className="p-5 md:p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-sand/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs mb-4 ${card.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4 className="font-sans text-xs sm:text-sm font-bold text-charcoal mb-1.5">
                      {card.title}
                    </h4>
                    <p className="text-gray-400 text-xs font-light leading-relaxed">
                      {card.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Testimonial Slider Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="rounded-3xl bg-charcoal text-white p-8 md:p-10 shadow-2xl relative overflow-hidden border border-charcoal/80">
              {/* Star details background */}
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-sunset/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sand text-[10px] font-bold uppercase tracking-wider mb-6">
                  <Quote className="w-3.5 h-3.5 text-coral" /> Guest Stories
                </div>

                <div className="min-h-[220px] flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Star Rating */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(TESTIMONIALS_DATA[activeIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-sand text-sand" />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="font-serif italic text-sm sm:text-base leading-relaxed text-white/90">
                        "{TESTIMONIALS_DATA[activeIndex].comment}"
                      </p>

                      {/* Guest details block */}
                      <div className="flex items-center gap-4 mt-6">
                        <img
                          src={TESTIMONIALS_DATA[activeIndex].avatar}
                          alt={TESTIMONIALS_DATA[activeIndex].name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover border-2 border-sand/40"
                        />
                        <div>
                          <h4 className="font-sans text-xs sm:text-sm font-bold text-white leading-tight">
                            {TESTIMONIALS_DATA[activeIndex].name}
                          </h4>
                          <p className="text-[10px] text-sand/85 font-medium mt-0.5 flex items-center gap-2">
                            <span>{TESTIMONIALS_DATA[activeIndex].location}</span>
                            <span className="text-white/20">•</span>
                            <span className="text-white/50">{TESTIMONIALS_DATA[activeIndex].date}</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Slider Manual Controls */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
                  <div className="flex gap-1.5">
                    {TESTIMONIALS_DATA.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all focus:outline-none ${
                          activeIndex === idx ? 'w-6 bg-sunset' : 'bg-white/30'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all active:scale-90 focus:outline-none cursor-pointer"
                      aria-label="Previous review"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all active:scale-90 focus:outline-none cursor-pointer"
                      aria-label="Next review"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
