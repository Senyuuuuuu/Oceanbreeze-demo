import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sunrise, Heart, ShieldCheck, Waves, Star } from 'lucide-react';

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
    <section id="about" className="py-28 bg-[#FFFFFF] relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-1/4 -left-36 w-96 h-96 bg-sand/15 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 w-96 h-96 bg-ocean/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Asymmetric Overlapping Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Overlapping Dual Image Composition */}
          <div className="lg:col-span-6 relative h-[450px] sm:h-[550px] w-full">
            
            {/* Background color block for framing */}
            <div className="absolute -top-6 -left-6 w-2/3 h-2/3 bg-sand/25 rounded-[32px] -z-10" />
            <div className="absolute -bottom-6 right-12 w-2/3 h-2/3 bg-coral/10 rounded-[32px] -z-10" />

            {/* Main background image (Bigger, top right) */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 w-[84%] h-[75%] rounded-[32px] overflow-hidden shadow-xl border-4 border-white"
            >
              <img
                src="https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/480742956_122140595558567801_6324144565661516274_n.jpg"
                alt="Ocean Breeze Beachfront Boutique Experience"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-700 ease-out"
              />
            </motion.div>

            {/* Overlapping foreground image (Smaller, bottom left) */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80"
                alt="La Union Surfer Lifestyle"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            {/* floating information tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute -bottom-2 right-4 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl p-4 border border-slate-100 flex items-center gap-3.5 max-w-[240px] z-20"
            >
              <div className="w-10 h-10 bg-orange-100/80 text-sunset rounded-xl flex items-center justify-center shrink-0">
                <Sunrise className="w-5.5 h-5.5" />
              </div>
              <div className="text-left">
                <h4 className="font-serif text-xs font-bold text-charcoal">Serene Golden Shore</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">Direct beachfront walk & gentle sea tides</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Premium Text Narratives & Badging */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-6 flex flex-col justify-center space-y-6"
          >
            <div>
              <span className="text-xs font-seasons font-bold uppercase tracking-[0.25em] text-sunset mb-2.5 inline-flex items-center gap-1.5">
                <Compass className="w-4 h-4 animate-spin-slow text-coral" /> Discover Ocean Breeze
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight leading-tight">
                Where Handcrafted Luxury{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset via-coral to-ocean block sm:inline">
                  Meets Coastal Rhythm.
                </span>
              </h2>
            </div>

            <div className="space-y-4 text-gray-500 font-sans text-sm sm:text-base leading-relaxed font-light">
              <p>
                Cradled along the vibrant beachfront of San Juan, La Union, Ocean Breeze Resort offers an intimate escape that marries luxury boutique hospitality with the relaxed, warm spirit of the Philippine islands.
              </p>
              <p>
                Every element of our sanctuary is meticulously customized to cultivate complete tranquility. From sea-facing villas framed with native timbers to local organic dining and sunset yoga decks, we design vacations that soothe the senses and restore the spirit.
              </p>
            </div>

            {/* Custom styled highlights row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 pb-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-sunset flex items-center justify-center shrink-0">
                  <Heart className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold text-charcoal">Filipino Hospitality</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">Genuine care, personalized details, and warm local hosting.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Waves className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold text-charcoal">Luxurious Serenity</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">Secluded sunlounges, high privacy walls, and quiet garden walks.</p>
                </div>
              </div>
            </div>

            {/* Handcrafted action buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <motion.button
                onClick={handleLearnMore}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 20px -5px rgba(46, 46, 53, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-full bg-charcoal text-white font-semibold text-xs uppercase tracking-wider cursor-pointer focus:outline-none shadow-sm"
              >
                Learn Our Philosophy
              </motion.button>
              <motion.button
                onClick={onOpenBooking}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 20px -5px rgba(245, 124, 0, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-full border border-sunset text-sunset font-semibold text-xs uppercase tracking-wider cursor-pointer focus:outline-none"
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
