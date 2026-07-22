import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, HelpCircle, Calendar, Sparkles, Check } from 'lucide-react';

interface ScrollAnimateProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  key?: React.Key;
}

// Custom Intersection Observer element to handle scroll triggered animations
function ScrollAnimate({ children, className = '', delay = 0, duration = 650 }: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transform transition-all ease-out ${className} ${
        isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-12'
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: "Arrival & Stay",
    question: "What are the check-in and check-out times?",
    answer: "Standard check-in begins at 2:00 PM, and check-out is by 12:00 PM (Noon). If you require an early check-in to catch the morning waves or a late check-out to witness one last sunset, please contact our guest hosts in advance. We do our absolute best to accommodate these requests depending on room and villa availability."
  },
  {
    category: "Policies",
    question: "What is your pet policy? Are dogs allowed?",
    answer: "Yes, we are proud to be a pet-friendly coastal sanctuary! We welcome well-behaved dogs and pets in designated suites and beach cabins for a small sanitary cleaning fee. To ensure all guests stay comfortable, we kindly request that pets remain on a leash when exploring the public beach, gardens, and resort grounds."
  },
  {
    category: "Amenities & Access",
    question: "Is secure parking available on-site, and what is the cost?",
    answer: "We offer complimentary, fully secure on-site parking for all registered resort guests. Our gated parking lot is spacious, well-lit, and monitored 24/7 by our security hosts. No reservation is required in advance—there is ample room for SUVs, vans, and sedans."
  },
  {
    category: "Dining",
    question: "Is complimentary breakfast included with my stay?",
    answer: "Absolutely! Every overnight reservation includes a complimentary, chef-curated fresh breakfast served sunset-side at our beachfront restaurant from 7:00 AM to 10:00 AM. Savor locally sourced tropical fruits, artisanal coffee, and traditional native Filipino breakfast bowls."
  },
  {
    category: "Activities",
    question: "How far is the resort from the famous San Juan surf breaks?",
    answer: "We are situated directly on the premium beachfront of Urbiztondo! The primary San Juan surf breaks are just a scenic 3-minute stroll down the sandy shore or a quick ride on our complimentary beach cruisers. We also offer on-site certified surf lessons and premium board rentals."
  },
  {
    category: "Policies",
    question: "What is your reservation cancellation and stay change policy?",
    answer: "We offer fully flexible, free cancellations and booking changes up to 7 days prior to your scheduled check-in. Cancellations made within the 7-day window are subject to a one-night room charge. You can easily adjust stay dates or cancel through our Booking Portal or by reaching out directly to our reservations desk."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#FAF9F5] relative overflow-hidden border-t border-slate-100">
      {/* Decorative Beach & Sand Accents */}
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-sand/15 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-coral/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollAnimate className="text-center mb-16" duration={700}>
          <span className="text-[10px] sm:text-xs font-bold text-sunset uppercase tracking-[0.25em] bg-orange-50/70 border border-orange-100/50 rounded-full px-4 py-1.5 inline-flex items-center gap-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-sunset" /> Got Questions?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500 font-sans font-light max-w-xl mx-auto leading-relaxed">
            Everything you need to know about your coastal escape at Ocean Breeze Resort. Find details on arrival times, parking, surf access, and more.
          </p>
        </ScrollAnimate>

        {/* Accordion FAQ Cards */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <ScrollAnimate 
                key={idx} 
                delay={idx * 80} 
                duration={600}
                className="w-full"
              >
                <div 
                  id={`faq-card-${idx}`}
                  className={`group rounded-2xl border transition-all duration-300 bg-white overflow-hidden ${
                    isOpen 
                      ? 'border-sunset/40 shadow-lg shadow-orange-50/40' 
                      : 'border-slate-150/70 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {/* Clickable Header Button */}
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full text-left px-5 sm:px-6 py-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-sunset"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-sunset/80 font-sans">
                        {item.category}
                      </span>
                      <h3 className={`font-sans text-sm sm:text-base font-semibold text-charcoal transition-colors group-hover:text-sunset ${
                        isOpen ? 'text-sunset font-medium' : ''
                      }`}>
                        {item.question}
                      </h3>
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all shrink-0 mt-1 ${
                      isOpen 
                        ? 'bg-sunset/10 border-sunset/30 text-sunset' 
                        : 'bg-slate-50 border-slate-200 text-gray-400 group-hover:border-slate-300 group-hover:text-charcoal'
                    }`}>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </button>

                  {/* Accordion Expandable Content Container */}
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen 
                        ? 'max-h-[500px] border-t border-slate-50 opacity-100' 
                        : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="px-5 sm:px-6 py-5 bg-slate-50/40">
                      <p className="text-xs sm:text-sm text-slate-600 font-sans font-light leading-relaxed">
                        {item.answer}
                      </p>
                      
                      {/* Helpful Checklist Indicator */}
                      <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-sans">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Verified Information
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimate>
            );
          })}
        </div>

        {/* Dynamic CTA Footer card for additional assistance */}
        <ScrollAnimate delay={400} className="mt-14" duration={600}>
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="font-sans text-sm sm:text-base font-semibold text-charcoal">
                Still have questions?
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 font-sans font-light">
                Our beachfront reservation coordinators and local hosts are ready to help.
              </p>
            </div>
            
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                  const topOffset = (contactSection as HTMLElement).offsetTop - 80;
                  window.scrollTo({
                    top: topOffset,
                    behavior: 'smooth'
                  });
                }
              }}
              className="px-6 py-3 rounded-full bg-charcoal text-white hover:bg-sunset text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              Contact Guest Hosts
            </a>
          </div>
        </ScrollAnimate>

      </div>
    </section>
  );
}
