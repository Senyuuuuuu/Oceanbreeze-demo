import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sunrise, Heart, ShieldCheck } from 'lucide-react';

interface WelcomeProps {
  onOpenBooking: () => void;
  onChangePage?: (page: string) => void;
}

export default function Welcome({ onOpenBooking, onChangePage }: WelcomeProps) {
  const handleLearnMore = () => {
    if (onChangePage) {
      onChangePage('about');
    } else {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        const topOffset = (contactSection as HTMLElement).offsetTop - 80;
        window.scrollTo({
          top: topOffset,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section id="about" className="py-24 bg-[#FFFFFF] relative overflow-hidden">
      {/* Absolute Background Accent Elements */}
      <div className="absolute top-1/4 -left-36 w-96 h-96 bg-sand/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 w-96 h-96 bg-ocean/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Image with architectural frames */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* Soft decorative color panels representing the Sand (#F7E3A3) and Coral (#FFA866) palette */}
            <div className="absolute -top-4 -left-4 w-2/3 h-2/3 bg-sand/35 rounded-3xl -z-10" />
            <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 bg-coral/15 rounded-3xl -z-10" />
 
            {/* Main Picture Frame */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group">
              <motion.img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"
                alt="Ocean Breeze Beachfront Boutique Experience"
                referrerPolicy="no-referrer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-[350px] sm:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
 
            {/* Small floating info card */}
            <motion.div
              initial={{ opacity: 0, x: -25, y: 10 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="absolute -bottom-2 left-6 bg-white shadow-xl rounded-2xl p-4 border border-slate-100 flex items-center gap-3.5 max-w-xs"
            >
              <div className="w-11 h-11 bg-ocean/10 text-ocean rounded-xl flex items-center justify-center shrink-0">
                <Sunrise className="w-6 h-6 text-sunset" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-charcoal leading-tight">Urbiztondo Surf Side</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Direct beach access, prime surfing & golden hours</p>
              </div>
            </motion.div>
          </motion.div>
 
          {/* Right Column: Premium welcome narratives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sunset mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 animate-spin-slow text-coral" /> Discover Ocean Breeze Resort
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight leading-tight">
              Where Elegant Luxury Meets{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset to-coral">
                La Union's Surf Vibes
              </span>
            </h3>
 
            <p className="mt-6 text-gray-500 font-sans text-sm sm:text-base leading-relaxed font-light">
              Nestled along the pristine sandy shores of San Juan, La Union, Ocean Breeze Resort offers an intimate escape that marries boutique luxury with the warm, relaxed hospitality of the Philippines. Whether you are here to ride the legendary Urbiztondo waves, soak in the dramatic golden sunsets, or simply unwind to the rhythmic chorus of the ocean, our paradise is your home away from home.
            </p>
 
            <p className="mt-4 text-gray-500 font-sans text-sm sm:text-base leading-relaxed font-light">
              Every detail of our resort is thoughtfully designed to immerse you in tranquility. From light-filled luxury suites overlooking the coast to personalized surf instruction and poolside dining, we curate a vacation that nourishes the soul.
            </p>
 
            {/* Small dynamic highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-8">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-sand/30 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-sunset" />
                </div>
                <div>
                  <h5 className="font-sans text-xs font-bold text-charcoal">Filipino Hospitality</h5>
                  <p className="text-[11px] text-gray-400 mt-0.5">Warm, personalized service designed with care.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-ocean/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-ocean" />
                </div>
                <div>
                  <h5 className="font-sans text-xs font-bold text-charcoal">Luxurious Privacy</h5>
                  <p className="text-[11px] text-gray-400 mt-0.5">Secluded corners, premium linen & high privacy.</p>
                </div>
              </div>
            </div>
 
            {/* Trigger Button */}
            <div className="flex flex-wrap gap-4">
              <motion.button
                onClick={handleLearnMore}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 20px -5px rgba(46, 46, 53, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="px-6 py-3 rounded-full bg-charcoal text-white font-semibold text-xs uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                Learn More About Us
              </motion.button>
              <motion.button
                onClick={() => onOpenBooking()}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 20px -5px rgba(245, 124, 0, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="px-6 py-3 rounded-full border border-sunset text-sunset font-semibold text-xs uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                Reserve Stay
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
