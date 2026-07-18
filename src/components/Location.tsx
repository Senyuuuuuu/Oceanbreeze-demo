import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Facebook, Send, ExternalLink, Sparkles, Check, PhoneCall, MessageSquare } from 'lucide-react';

interface LocationProps {
  onOpenBooking: () => void;
}

export default function Location({ onOpenBooking }: LocationProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending message API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: '', email: '', phone: '', message: '' });
    }, 1200);
  };

  return (
    <section id="location" className="py-24 bg-white relative">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-sand/15 rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-seasons font-bold uppercase tracking-[0.25em] text-sunset mb-2 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-coral" /> Plan Your Arrival
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
            Find Us in San Juan, La Union
          </h3>
          <p className="mt-4 text-gray-400 font-sans text-sm leading-relaxed font-light">
            Located along the National Highway of Urbiztondo—the heart of the beautiful coastline of the North. Reach out to us or drop by for a sunset stroll!
          </p>
        </motion.div>

        {/* Master Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          
          {/* Left Column: Map & Contact Coordinates */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: 15 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-8 flex flex-col h-full"
          >
            
            {/* Google Map Iframe Container */}
            <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-80 sm:h-96 w-full relative group">
              <iframe
                title="Ocean Breeze Resort Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15302.247656621256!2d120.32047802824367!3d16.67383183637152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391a1827e6992d9%3A0xe53fa1143a5323eb!2sSan%20Juan%2C%20La%20Union!5e0!3m2!1sen!2sph!4v1710123456789!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {/* Floating Maps Overlay Button */}
              <div className="absolute bottom-4 left-4">
                <a
                  href="https://maps.google.com/?q=San+Juan,+La+Union,+Philippines"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-charcoal text-white font-sans text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-md hover:bg-sunset hover:text-white transition-all duration-300"
                >
                  <MapPin className="w-4 h-4 text-coral animate-bounce" /> Open in Google Maps
                </a>
              </div>
            </div>

            {/* Quick Contact Coordinates & Direct Messenger Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Info Block */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                <h4 className="font-serif text-lg font-bold text-charcoal">Resort Coordinates</h4>
                
                <div className="space-y-3.5 text-xs text-slate-600 font-medium">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-sunset shrink-0 mt-0.5" />
                    <span>National Highway, Urbiztondo, San Juan, La Union, 2514, Philippines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-ocean shrink-0" />
                    <a href="tel:+639171234567" className="hover:underline hover:text-sunset transition-colors">
                      +63 917 123 4567
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-coral shrink-0" />
                    <a href="mailto:reservations@oceanbreezelaunion.com" className="hover:underline hover:text-sunset transition-colors">
                      reservations@oceanbreezelaunion.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
                    <a
                      href="https://facebook.com/OceanBreezeResortLaUnion"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline hover:text-sunset transition-colors flex items-center gap-0.5"
                    >
                      OceanBreezeResortLU <ExternalLink className="w-3 h-3 text-gray-400" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Multi-Channel Quick Call Actions */}
              <div className="p-6 rounded-2xl bg-sand/15 border border-sand/40 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-charcoal">Direct Inquiries</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed mt-2">
                    Looking to book immediately or speak to a front desk agent? Connect directly using our official channels.
                  </p>
                </div>

                <div className="space-y-2.5 mt-6">
                  <a
                    href="tel:+639171234567"
                    className="w-full py-2.5 px-4 rounded-xl bg-charcoal text-white font-sans text-xs font-semibold tracking-wider uppercase text-center flex items-center justify-center gap-2 hover:bg-sunset hover:text-white transition-all shadow-sm active:scale-98"
                  >
                    <PhoneCall className="w-4 h-4 text-sand" /> Call Now +63 917 123
                  </a>
                  <a
                    href="https://facebook.com/OceanBreezeResortLaUnion"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1877F2] text-white font-sans text-xs font-semibold tracking-wider uppercase text-center flex items-center justify-center gap-2 hover:bg-[#1877F2]/90 transition-all shadow-sm active:scale-98"
                  >
                    <MessageSquare className="w-4 h-4 text-white" /> Message On Messenger
                  </a>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Interactive Inquiry Form */}
          <motion.div
            id="contact"
            initial={{ opacity: 0, x: 20, y: 15 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 h-full"
          >
            <div className="rounded-3xl border border-slate-100 bg-[#FFFFFF] p-8 md:p-10 shadow-lg flex flex-col h-full justify-between">
              <div>
                <h4 className="font-serif text-2xl font-bold text-charcoal mb-2">Send an Instant Message</h4>
                <p className="text-gray-400 font-sans text-xs font-light leading-relaxed mb-6">
                  Have special event hosting inquiries, wellness package questions, or custom accommodation requests? Write to us and receive answers in your inbox.
                </p>

                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="contact-form"
                      onSubmit={handleFormSubmit}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                          Your Full Name
                        </label>
                        <input
                          type="text"
                          required
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                          placeholder="Juan Dela Cruz"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200/50 bg-gray-50/50 text-charcoal text-xs focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          name="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          placeholder="juan@gmail.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200/50 bg-gray-50/50 text-charcoal text-xs focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          required
                          name="phone"
                          value={formState.phone}
                          onChange={handleInputChange}
                          placeholder="+63 917 123 4567"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200/50 bg-gray-50/50 text-charcoal text-xs focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                          Write Message
                        </label>
                        <textarea
                          rows={4}
                          required
                          name="message"
                          value={formState.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your vacation plan or inquiries about board rentals!"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200/50 bg-gray-50/50 text-charcoal text-xs focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-full bg-sunset hover:bg-sunset/90 text-white font-sans text-xs font-bold uppercase tracking-widest shadow-lg shadow-sunset/10 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer focus:outline-none"
                      >
                        {isSubmitting ? 'Sending Message...' : 'Send Message'}
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </motion.form>
                  ) : (
                    /* Inquiry Success card */
                    <motion.div
                      key="success-form"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 px-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 flex flex-col items-center"
                    >
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-lg font-bold text-charcoal">Inquiry Successfully Logged</h4>
                      <p className="text-gray-500 text-xs mt-2 max-w-xs leading-relaxed mx-auto">
                        Thank you for reaching out! A bookings coordinator will respond to your email at your convenience.
                      </p>
                      <button
                        onClick={() => setIsSuccess(false)}
                        className="mt-6 py-2 px-5 rounded-full bg-white text-charcoal border border-gray-200 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-all active:scale-95"
                      >
                        Write Another Message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Quick Action */}
              {!isSuccess && (
                <div className="border-t border-gray-100 pt-6 mt-8 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-sans">
                    Prefer direct calendar booking?
                  </span>
                  <button
                    onClick={onOpenBooking}
                    className="font-sans text-xs font-bold uppercase text-sunset hover:text-sunset/90 flex items-center gap-1 focus:outline-none cursor-pointer"
                  >
                    Open Booking Form →
                  </button>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
