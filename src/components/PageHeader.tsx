import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Sparkles } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  category?: string;
  backgroundImageUrl?: string;
}

export default function PageHeader({
  title,
  subtitle,
  category = 'Resort',
  backgroundImageUrl = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1920&q=80'
}: PageHeaderProps) {
  return (
    <div className="relative h-[250px] sm:h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImageUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/30 to-charcoal/30 z-10" />
      </div>

      {/* Decorative Beach Waves Lines SVG */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none opacity-20">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" fill="#ffffff" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Tag */}
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-sand bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-white/10">
            <Sparkles className="w-3 h-3 text-coral" /> {category}
          </span>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-gray-300 font-sans font-light leading-relaxed">
            {subtitle}
          </p>

          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-sans text-gray-400 font-medium pt-2">
            <span className="hover:text-sand transition-colors cursor-pointer">Home</span>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className="text-sand font-semibold">{title}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
