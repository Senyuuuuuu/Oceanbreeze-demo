import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShieldCheck, Sun, Compass, Heart, DollarSign, Waves, Quote, ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Shield, MessageSquare, Award } from 'lucide-react';
import { Testimonial } from '../types';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  badge: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'location',
    title: 'Direct Beachfront Location',
    description: 'Situated directly on the warm, sandy shores of San Juan, La Union. Just steps away from the famous Urbiztondo surf break and vibrant beachside dining.',
    icon: Compass,
    colorClass: 'bg-orange-50 text-sunset border-orange-100/50',
    badge: 'Premier Spot'
  },
  {
    id: 'pricing',
    title: 'Affordable Coastal Luxury',
    description: 'Bask in handpicked premium linens, cozy bamboo design accents, and high-thread balcony settings at highly accessible, direct pricing.',
    icon: DollarSign,
    colorClass: 'bg-sky-50 text-ocean border-sky-100/50',
    badge: 'Best Value'
  },
  {
    id: 'family',
    title: 'Family-Friendly Sanctuary',
    description: 'We prioritize multi-guest relaxation with dedicated shallow wading sand areas, secure private balconies, and spacious multi-level family suites.',
    icon: Heart,
    colorClass: 'bg-rose-50 text-coral border-rose-100/50',
    badge: 'Safe & Secure'
  },
  {
    id: 'sunset',
    title: 'Legendary Golden Sunsets',
    description: 'Our beachfront terrace and private villa balconies face directly west, providing an unobstructed, private view of La Union\'s dramatic evening skies.',
    icon: Sun,
    colorClass: 'bg-amber-50 text-sunset border-amber-100/50',
    badge: 'Sunset Views'
  },
  {
    id: 'hospitality',
    title: 'Warm Filipino Hospitality',
    description: 'Experience authentic care and personalized attention from our local resort hosts, from custom surf instruction bookings to private evening catering.',
    icon: ShieldCheck,
    colorClass: 'bg-slate-50 text-charcoal border-slate-200/50',
    badge: 'Local Staff'
  },
  {
    id: 'serenity',
    title: 'Restorative Coastal Atmosphere',
    description: 'Engineered for peace, our quiet tropical gardens, custom beachfront hammocks, and the soothing acoustic loop of ocean waves guarantee deep rest.',
    icon: Waves,
    colorClass: 'bg-emerald-50 text-teal-600 border-emerald-100/50',
    badge: 'Pure Peace'
  }
];

const TESTIMONIALS_DATA: (Testimonial & { role: string; stayType: string })[] = [
  {
    id: 'review-1',
    name: 'Monica Carla Naval',
    location: 'La Union, Philippines',
    role: 'Local Guide',
    stayType: 'Vacation | Couple',
    rating: 5,
    comment: "If you want a nice and peaceful resort in La Union this is the place. We love the sunset here as well. Not a lot of people, perfect for couple or solo traveler if you just want peace and quiet. Breakfast was great. It's still new but they take care of their guest really well. The beach was a 3 min walk or less. Funny thing was there were cows at the beach playing during the sunset and was nice to watch. The ocean was deep even in the shore so if there are kids I would suggest to just play in the sand.",
    date: '3 years ago'
  },
  {
    id: 'review-2',
    name: 'Mark Anthony',
    location: 'San Juan, La Union',
    role: 'Local Guide • 18 reviews',
    stayType: 'Vacation | Solo',
    rating: 5,
    comment: "Great location and very accommodating staff! The rooms are super clean and comfortable. Definitely the best place to relax in San Juan if you want a quiet and peaceful getaway. Highly recommended!",
    date: '1 year ago'
  },
  {
    id: 'review-3',
    name: 'Elena Rostova',
    location: 'Manila, Philippines',
    role: 'Verified Guest',
    stayType: 'Holiday | Couple',
    rating: 5,
    comment: "The perfect escape from the noisy parts of La Union! The place is quiet, clean, and right by the beach. The sunset view here is simply breathtaking. Will definitely return!",
    date: '6 months ago'
  },
  {
    id: 'review-4',
    name: 'Christian Paul',
    location: 'Pangasinan, Philippines',
    role: 'Local Guide • 45 reviews',
    stayType: 'Vacation | Couple',
    rating: 5,
    comment: "Outstanding hospitality! The beach was a short, pleasant walk and the entire property is extremely secure and well-maintained. Loved seeing the cows walking on the beach at sunset, such a unique charm!",
    date: '10 months ago'
  },
  {
    id: 'review-5',
    name: 'Sarah Jenkins',
    location: 'Sydney, Australia',
    role: 'International Traveler',
    stayType: 'Vacation | Friends',
    rating: 5,
    comment: "Perfect place to unwind. Clean, modern and cozy rooms, amazing garden space, and very accommodating hosts. The peaceful atmosphere here is exactly what we needed.",
    date: '2 months ago'
  }
];

export default function WhyChooseUs() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 9000);
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
      {/* Background Ambience elements */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-sand/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-ocean/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================
            PART A: THE OCEAN BREEZE ADVANTAGE (Bento Grid)
            ========================================= */}
        <div className="mb-28">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-coral" /> The Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight leading-tight">
              Why Discerning Travelers Choose{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset to-coral">
                Ocean Breeze Resort
              </span>
            </h2>
            <p className="text-gray-400 font-sans text-sm sm:text-base leading-relaxed font-light">
              We curate a refined, organic beachfront retreat that values local culture, genuine safety, and slow living, offering an experience that generic hotels simply cannot replicate.
            </p>
          </div>

          {/* Asymmetric Bento Grid of advantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURE_CARDS.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className={`p-6 sm:p-8 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-sand hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative group`}
                >
                  <div>
                    {/* Top row with custom icon & card badge */}
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 rounded-2xl ${card.colorClass} border flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 group-hover:rotate-3 transition-all duration-300`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-white border border-slate-100 text-slate-500 font-sans tracking-wide">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-charcoal mb-2.5 group-hover:text-sunset transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 font-sans text-xs sm:text-sm leading-relaxed font-light">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>


        {/* =========================================
            PART B: IMMERSIVE TESTIMONIALS & TRUST SHOWCASE
            ========================================= */}
        <div className="relative border-t border-slate-100 pt-24">
          
          {/* Trust Board / Credibility Metrics at the Top */}
          <div className="max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-100/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
            >
              <div className="space-y-2">
                <div className="flex justify-center md:justify-start items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-sunset text-sunset" />
                  ))}
                  <span className="text-sm font-bold text-charcoal ml-2">4.9 / 5.0 Rating</span>
                </div>
                <p className="text-xs text-gray-400 font-sans font-light">
                  Based on over <span className="font-semibold text-charcoal">1,200+ verified ratings</span> on TripAdvisor, Google Sights & social channels.
                </p>
              </div>

              {/* Verified badge middle */}
              <div className="h-px w-full md:w-px md:h-12 bg-slate-200" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-xs font-bold text-charcoal">100% Certified Reviews</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Directly pulled from guests with confirmed stays.</p>
                </div>
              </div>

              {/* Total happy guests count */}
              <div className="h-px w-full md:w-px md:h-12 bg-slate-200" />

              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-serif font-bold text-sunset">15,000+</span>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-sans font-bold block">Happy Clients</p>
              </div>
            </motion.div>
          </div>

          {/* Testimonial Editorial / Magazine Layout */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset inline-flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-coral" /> Editorial Stories
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                Reflections of our Guests
              </h2>
            </div>

            <div className="relative rounded-[36px] bg-charcoal text-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden border border-charcoal/90">
              {/* Stylized background glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-sunset/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-ocean/10 rounded-full blur-3xl pointer-events-none" />

              {/* Slider content wrapper */}
              <div className="min-h-[280px] flex flex-col justify-between relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                  >
                    
                    {/* Left Pane: Beautiful magazine-style Quote */}
                    <div className="lg:col-span-8 space-y-6 text-left">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sunset shrink-0">
                        <Quote className="w-6 h-6 rotate-180" />
                      </div>
                      
                      <div className="space-y-4">
                        {/* Rating row */}
                        <div className="flex gap-1">
                          {[...Array(TESTIMONIALS_DATA[activeIndex].rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-sand text-sand" />
                          ))}
                        </div>

                        {/* Highlighted Quote Comment */}
                        <blockquote className="font-serif text-lg sm:text-xl md:text-2xl italic leading-relaxed text-white/90">
                          "{TESTIMONIALS_DATA[activeIndex].comment}"
                        </blockquote>
                      </div>
                    </div>

                    {/* Right Pane: Author Card with overlay badge */}
                    <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
                      <div className="flex flex-col items-center text-center lg:text-right space-y-4">
                        
                        {/* Avatar initials frame (no images/photos used) */}
                        <div className="relative">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sunset/10 border-4 border-sunset/40 flex items-center justify-center shadow-xl font-serif text-xl sm:text-2xl font-bold text-sunset">
                            {TESTIMONIALS_DATA[activeIndex].name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-charcoal" title="Verified Customer">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                          </div>
                        </div>

                        {/* Guest details */}
                        <div>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                            {TESTIMONIALS_DATA[activeIndex].name}
                          </h4>
                          <p className="text-xs text-sand font-medium mt-1">
                            {TESTIMONIALS_DATA[activeIndex].role}
                          </p>
                          <p className="text-[10px] text-white/50 font-light mt-1 flex flex-wrap justify-center lg:justify-end gap-1.5 items-center">
                            <span>{TESTIMONIALS_DATA[activeIndex].location}</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-[9px] font-medium">
                              {TESTIMONIALS_DATA[activeIndex].stayType}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                </AnimatePresence>

                {/* Slider manual and arrow controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 mt-8 gap-4">
                  {/* Manual dot counts */}
                  <div className="flex gap-2">
                    {TESTIMONIALS_DATA.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                          activeIndex === idx ? 'w-8 bg-sunset' : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Manual Arrow buttons */}
                  <div className="flex gap-2.5">
                    <button
                      onClick={handlePrev}
                      className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all active:scale-90 focus:outline-none cursor-pointer flex items-center justify-center"
                      aria-label="Previous story"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all active:scale-90 focus:outline-none cursor-pointer flex items-center justify-center"
                      aria-label="Next story"
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
