import React from 'react';
import { motion } from 'motion/react';
import { Heart, Compass, Star, Sparkles, Target, Shield, Award, Trees, Waves, Users, ArrowUpRight, ShieldCheck, Sun } from 'lucide-react';

interface AboutStoryProps {
  onOpenBooking: () => void;
}

const VALUES = [
  {
    id: 'hospitality',
    title: 'Filipino Hospitality',
    description: 'We embrace the traditional spirit of Bayanihan and personalized care, ensuring every traveler feels like an honored family member returning home.',
    icon: Heart,
    color: 'from-orange-400 to-amber-500',
    iconColor: 'text-orange-500'
  },
  {
    id: 'sustainability',
    title: 'Eco-Conscious Sanctuary',
    description: 'Designed in harmony with the environment, we use sustainably sourced local bamboo, reclaimed wood, solar energy elements, and support local beach conservancy groups.',
    icon: Trees,
    color: 'from-teal-400 to-emerald-500',
    iconColor: 'text-teal-600'
  },
  {
    id: 'serenity',
    title: 'Architectural Serenity',
    description: 'Our spaces feature high ceilings, expansive glazing, and native-chic styling designed specifically to capture refreshing sea winds and natural golden sunsets.',
    icon: Waves,
    color: 'from-sky-400 to-blue-500',
    iconColor: 'text-sky-600'
  },
  {
    id: 'heritage',
    title: 'Supporting Local Heritage',
    description: 'Every room showcases handwoven native blankets, locally made wicker furniture, and bespoke artworks crafted by celebrated artists of La Union.',
    icon: Compass,
    color: 'from-sunset to-coral',
    iconColor: 'text-sunset'
  }
];

const STATS = [
  { value: '12,000+', label: 'Happy Guests Welcomed' },
  { value: '4.9 / 5.0', label: 'Average Guest Rating' },
  { value: '100%', label: 'Locally Sourced Timber' },
  { value: '15+', label: 'Bespoke Ocean Suites' }
];

const TIMELINE = [
  {
    year: '2012',
    title: 'The Coastal Dream',
    description: 'Our founders fell in love with San Juan\'s raw, untouched coastal beauty. We built a rustic family beach house overlooking the legendary surf break, welcoming friends and traveling soul-seekers.'
  },
  {
    year: '2017',
    title: 'Designing with Intention',
    description: 'Partnering with local green architects, we designed and built the first four beachfront eco-cabins using sustainable bamboo structures, matching high-end comfort with minimal ecological footprint.'
  },
  {
    year: '2021',
    title: 'Expanding Sanctuaries',
    description: 'Due to overwhelming interest, we launched the Sunset Panoramic Villas. We added the beachfront wellness deck, the horizontal infinity pool, and integrated daily seaside yoga and meditation.'
  },
  {
    year: '2026',
    title: 'Smart Beachfront Luxury',
    description: 'Embracing next-generation convenience, we integrated fully synchronized Google Sheets calendar updates and interactive automated systems, raising beachfront hospitality standards worldwide.'
  }
];

export default function AboutStory({ onOpenBooking }: AboutStoryProps) {
  return (
    <div className="bg-white text-charcoal font-sans overflow-hidden">
      
      {/* SECTION 1: Dynamic Narrative Introduction (Storytelling Experience) */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sand/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-ocean/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Split-Screen Overlapping Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Storytelling Text Block */}
            <div className="lg:col-span-6 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <span className="text-xs font-seasons font-bold uppercase tracking-[0.3em] text-sunset inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-coral" /> Our Heritage
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-charcoal tracking-tight">
                  Born from a Love of the Surf,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset via-coral to-ocean">
                    Refined by Nature.
                  </span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="space-y-6 text-gray-500 font-sans text-sm sm:text-base leading-relaxed font-light"
              >
                <p>
                  Ocean Breeze Resort began not as a commercial project, but as a humble beachfront refuge. Tucked away on the legendary coast of San Juan, La Union, our founders sought to create an intimate sanctuary that preserved the wild coastal essence of the province while wrapping guests in luxury and peace.
                </p>
                <p>
                  We believe that true luxury does not shout; it whispers in the rhythmic rustle of palm trees, the gentle splash of tides, and the heartfelt greeting of our local resort hosts. From day one, we committed to sustainable architecture and authentic community partnerships, ensuring that our presence enriches the local ecosystems and supports native artisans.
                </p>
              </motion.div>

              {/* Action buttons inside story */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <button
                  onClick={onOpenBooking}
                  className="px-6 py-3 rounded-full bg-sunset text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-sunset/15 hover:bg-sunset/90 hover:scale-103 transition-all cursor-pointer focus:outline-none"
                >
                  Reserve Your Stay
                </button>
                <a
                  href="#timeline"
                  className="px-6 py-3 rounded-full border border-slate-200 text-charcoal font-semibold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all inline-flex items-center gap-1.5"
                >
                  Explore Our Journey <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </motion.div>
            </div>

            {/* Right Storytelling Overlapping Sights Display */}
            <div className="lg:col-span-6 relative h-[500px] sm:h-[580px] w-full max-w-[550px] mx-auto">
              
              {/* Back Accent Panel */}
              <div className="absolute top-8 left-8 w-[80%] h-[80%] bg-sand/30 rounded-3xl -z-10" />

              {/* Main Overlapping Image 1 (Wider back) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 right-0 w-[82%] h-[70%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
              >
                <img
                  src="https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/480742956_122140595558567801_6324144565661516274_n.jpg"
                  alt="Ocean Breeze Beachfront Boutique Experience"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Main Overlapping Image 2 (Overlapping Front Left) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -30 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 w-[62%] h-[55%] rounded-3xl overflow-hidden shadow-3xl border-4 border-white z-10"
              >
                <img
                  src="https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnba8TV3KcqjQaF6CAMgBtNHtTLkT681aHEkjBUe8V8w2bfazTVLUogWdRK9RsI08igPTHiF46tAszorl72TGm0FSj9DUmvobzWR-McG5eXvyS37nvgqxSun7vTgfp7QsC4aiU=s1360-w1360-h1020-rw"
                  alt="La Union Surfer Lifestyle"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* floating award tag */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute right-4 bottom-12 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3 max-w-xs z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-sunset shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-charcoal">La Union Heritage Award</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Top-rated local architecture & hospitality</p>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: Statistics & Achievements Panel (Striking visual) */}
      <section className="py-16 bg-charcoal text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-sunset/10 to-ocean/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            {STATS.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="space-y-2"
              >
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-sand tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm font-sans font-light uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Values & Philosophy Section (Unique Layout) */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-seasons font-bold uppercase tracking-[0.25em] text-sunset inline-flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-coral" /> Core Values
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-charcoal leading-tight">
              The Principles That Guide Us
            </h2>
            <p className="text-gray-400 font-sans text-sm sm:text-base leading-relaxed font-light">
              We operate under a deep commitment to sustainable practices, respectful architectural layout, and absolute coastal comfort, creating stays that are both premium and mindful.
            </p>
          </div>

          {/* Asymmetric Alternating Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {VALUES.map((val, idx) => {
              const IconComponent = val.icon;
              return (
                <motion.div
                  key={val.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  animate={{ y: [0, -5, 0] }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.015 }}
                  transition={{ 
                    y: { duration: 4.2 + (idx % 2) * 0.8, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.5 },
                    default: { duration: 0.7, delay: idx * 0.1 }
                  }}
                  className="p-6 sm:p-8 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-sand hover:shadow-xl transition-all duration-300 flex items-start gap-5 cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${val.color} flex items-center justify-center shrink-0 text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-lg font-bold text-charcoal group-hover:text-sunset transition-colors leading-snug">
                      {val.title}
                    </h4>
                    <p className="text-gray-400 font-sans text-xs sm:text-sm leading-relaxed font-light">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 4: Interactive Story Timeline (High Design Experience) */}
      <section id="timeline" className="py-24 bg-slate-50/50 border-t border-b border-slate-100 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sunset/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-sunset inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-coral" /> Chronology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-charcoal">
              Our Journey Over Time
            </h2>
            <p className="text-gray-400 font-sans text-xs sm:text-sm font-light">
              How a simple family coastal escape grew to become San Juan\'s premier beachfront resort.
            </p>
          </div>

          {/* Vertical Timeline Block */}
          <div className="relative border-l border-slate-200 ml-4 md:ml-32 space-y-12">
            {TIMELINE.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Year tag for desktop (floats left of the vertical line) */}
                <div className="hidden md:block absolute -left-[144px] top-0 w-24 text-right">
                  <span className="font-serif text-2xl font-black text-sunset group-hover:text-coral transition-colors duration-300">
                    {item.year}
                  </span>
                </div>

                {/* Timeline Circle Node */}
                <div className="absolute -left-1.5 top-2.5 w-3.5 h-3.5 rounded-full border-2 border-sunset bg-white group-hover:bg-sunset group-hover:scale-125 transition-all duration-300" />

                <div className="space-y-2 max-w-2xl">
                  {/* Mobile Year Badge */}
                  <span className="inline-block md:hidden font-serif text-lg font-black text-sunset mb-1">
                    {item.year}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-charcoal group-hover:text-sunset transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 font-sans text-xs sm:text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: Sustainable Materials / Ecosystem Banner */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl bg-gradient-to-br from-ocean/5 via-sand/10 to-coral/5 p-8 md:p-14 border border-sand/30 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-sand/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="lg:w-7/12 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-500" /> Protecting Our Oceans
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-charcoal">
                Designed to co-exist harmoniously with San Juan\'s marine environments.
              </h3>
              <p className="text-gray-500 font-sans text-xs sm:text-sm leading-relaxed font-light">
                We take our ecological impact seriously. Ocean Breeze Resort is built utilizing locally sourced reclaimed timber and low-impact organic compounds. We use energy-efficient solar technology features, avoid single-use plastics entirely, and organize weekly beach cleanup drives with local surfing federations to protect our marine sanctuaries.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-100 text-teal-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" /> Plastic Free Resort
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-100 text-teal-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" /> 100% Reclaimed Timber
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-100 text-teal-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" /> Solar Water Heating
                </span>
              </div>
            </div>

            <div className="lg:w-5/12 w-full max-w-[400px]">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative">
                <img
                  src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"
                  alt="Coastal Wellness Sanctuary"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent pointer-events-none" />
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
