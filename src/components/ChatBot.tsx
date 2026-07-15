import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Calendar, MapPin, Compass, Waves, Utensils, MessageCircle, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface ChatBotProps {
  onOpenBooking: (roomType?: string) => void;
  isBookingOpen?: boolean;
}

export default function ChatBot({ onOpenBooking, isBookingOpen = false }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi! I'm Breeze Butler, your digital concierge at Ocean Breeze Resort. 🌺 How can I help you enjoy your tropical getaway today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isBookingOpen) {
      setIsOpen(false);
    }
  }, [isBookingOpen]);

  // If the booking modal is open, we hide the chatbot entirely to avoid overlaps in the UI
  if (isBookingOpen) {
    return null;
  }

  useEffect(() => {
    if (isOpen) {
      // Delay slightly to allow the open animation to complete
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages, isTyping]);

  const getBotResponse = (userInput: string): { text: string; action?: 'booking' | 'location' | 'surf' } => {
    const input = userInput.toLowerCase().trim();

    if (input.includes('room') || input.includes('rate') || input.includes('price') || input.includes('suite') || input.includes('villa') || input.includes('stay') || input.includes('accommodation') || input.includes('how much') || input.includes('cabin')) {
      return {
        text: "We offer beautiful, sea-facing sanctuaries styled with tropical details:\n\n🌴 **Deluxe Beachfront Suite** (₱7,500/night): King bed, panoramic ocean views, private balcony.\n🌅 **Sunset Panoramic Villa** (₱12,000/night): Super King bed, private plunge pool deck, premium amenities.\n🏘️ **Spacious Family Loft** (₱9,800/night): 1 King + 2 Doubles, split-level loft, garden terrace.\n🏡 **Beachside Eco Cabin** (₱4,200/night): Queen bed, rustic-chic coastal bamboo style steps from beach.\n\nWould you like me to open the reservation panel to check real-time availability for you?",
        action: 'booking'
      };
    }

    if (input.includes('location') || input.includes('where') || input.includes('address') || input.includes('find') || input.includes('direction') || input.includes('get here') || input.includes('map') || input.includes('la union')) {
      return {
        text: "Ocean Breeze Resort is situated right on the sandy shores of San Juan:\n\n📍 **National Highway, Urbiztondo, San Juan, La Union, 2514, Philippines.**\n\nWe are in the absolute heart of the beautiful coastline of San Juan, surrounded by gentle tides, cozy beach cafes, and legendary sunset viewpoints.",
        action: 'location'
      };
    }

    if (input.includes('book') || input.includes('reserve') || input.includes('inquire') || input.includes('reservation') || input.includes('booking') || input.includes('schedule') || input.includes('calendar')) {
      return {
        text: "Booking a room is quick and automatic! You can click the **'Book Your Stay'** or **'Inquire Now'** button, or click the link below to load our interactive booking panel.\n\nIt connects directly to our Google Sheets backend, verifies dates for overlaps, and instantly dispatches a reservation code and owner alert! 📅",
        action: 'booking'
      };
    }

    if (input.includes('wellness') || input.includes('yoga') || input.includes('spa') || input.includes('massage') || input.includes('relax') || input.includes('therapy') || input.includes('lessons') || input.includes('surf')) {
      return {
        text: "We host relaxing and revitalizing wellness experiences in partnership with certified local practitioners:\n\n🧘‍♀️ **Guided Sunset Yoga**: ₱500/session (includes standard yoga mat and certified guide on our beachfront deck).\n💆‍♂️ **Traditional Seaside Massage**: ₱900/hour (authentic warm coconut oil in open-air seaside massage cabanas).\n\nLet us know if you want to request these custom packages during your check-in!",
        action: 'booking'
      };
    }

    if (input.includes('amenit') || input.includes('bar') || input.includes('facility') || input.includes('pool')) {
      return {
        text: "We host an array of coastal facilities to soothe and energize you:\n\n🧘‍♀️ **Beachfront Yoga Deck**: Restorative meditation and guided yoga overlooking the sea.\n🍹 **Sunset Bar & Grill**: Handcrafted cocktails and ice-cold craft beers during golden hours.\n💆‍♀️ **Seaside Spa**: Open-air seaside massage cabanas utilizing authentic warm coconut oils.\n🌿 **Eco-Friendly Living spaces**: Sustainable garden areas and rustic design elements."
      };
    }

    if (input.includes('restaurant') || input.includes('food') || input.includes('eat') || input.includes('menu') || input.includes('maranna') || input.includes('dining') || input.includes('drink') || input.includes('cocktail')) {
      return {
        text: "Our signature in-house **Maranna Restaurant** features amazing coastal dining:\n\n🍲 Authentic Filipino-fusion dishes, wood-fired seafood catches, and colorful tropical smoothie bowls.\n🍹 Don't miss our famous Pancit Cabagan or signature rum sunset coolers!\n\nOpen daily from 6:30 AM to 10:00 PM."
      };
    }

    if (input.includes('contact') || input.includes('phone') || input.includes('email') || input.includes('number') || input.includes('call') || input.includes('reach')) {
      return {
        text: "You can connect with our front desk team 24/7:\n\n📞 Phone/SMS: **+63 917 123 4567**\n✉️ Email: **reservations@oceanbreezelaunion.com**\n\nOr drop by our lobby at the National Highway, Urbiztondo, San Juan, La Union!"
      };
    }

    if (input.includes('hi') || input.includes('hello') || input.includes('hey') || input.includes('greetings') || input.includes('good morning') || input.includes('good afternoon') || input.includes('good evening')) {
      return {
        text: "Hello! 🌴 Hope you are having a wonderful day. I'm Breeze Butler, your personal beach concierge. What can I help you find out about Ocean Breeze Resort?"
      };
    }

    if (input.includes('thank') || input.includes('thanks') || input.includes('awesome') || input.includes('great') || input.includes('perfect') || input.includes('cool')) {
      return {
        text: "You're very welcome! 🌊 It is my absolute pleasure. Let me know if you need any other assistance or if you are ready to book your beachfront paradise stay!"
      };
    }

    return {
      text: "I want to make sure you get the perfect response! I can tell you about our **Rooms & Rates**, **Wellness Experiences**, **Resort Location**, **Maranna Dining Menu**, or help you open the **Booking Panel**! What would you like to explore? 😊"
    };
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 2. Simulate natural bot response delay
    const delay = Math.max(500, Math.min(1200, textToSend.length * 10));
    setTimeout(() => {
      const botResponse = getBotResponse(textToSend);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.text,
        timestamp: new Date()
      };

      // Handle custom inline actions inside response
      if (botResponse.action === 'booking') {
        // Appends a follow-up action trigger inside the messages array
      }

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);
  };

  const formatMessageText = (text: string) => {
    // Map simple markdown bold (**text**) to bold tags, and newlines (\n) to line breaks
    return text.split('\n').map((line, i) => {
      const formattedLine = line.split('**').map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-semibold text-charcoal">{part}</strong>;
        }
        return part;
      });
      return (
        <span key={i} className="block">
          {formattedLine}
          {i < text.split('\n').length - 1 && <span className="block h-1" />}
        </span>
      );
    });
  };

  const quickReplies = [
    { label: '🏨 Rooms & Rates', query: 'Tell me about the rooms and rates' },
    { label: '🌿 Wellness & Spa', query: 'What are the wellness packages?' },
    { label: '📍 Location', query: 'Where is the resort located?' },
    { label: '📅 Book Now', query: 'How do I book a stay?' }
  ];

  return (
    <>
      {/* 1. Floating Sticky Chatbot Trigger Button - Stays securely in place */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        
        {/* Subtle, welcoming notification badge when closed */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 2 }}
              className="mb-2.5 bg-white border border-slate-100 shadow-lg rounded-xl px-2.5 py-1.5 text-[10px] text-charcoal font-sans font-medium flex items-center gap-1.5 max-w-xs animate-float border-l-4 border-l-sunset pointer-events-none"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Questions? Ask Breeze Butler! 🌊</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="chatbot-floating-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer relative z-50 overflow-hidden ${
            isOpen 
              ? 'bg-charcoal hover:bg-charcoal/90 border border-white/10' 
              : 'bg-sunset hover:bg-sunset/95 shadow-sunset/35'
          }`}
          aria-label="Toggle Resort Concierge Chat"
        >
          {/* Pulsing visual glow effect */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-sunset/35 animate-ping -z-10 scale-105" />
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageSquare className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* 2. Interactive Sliding/Floating Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window-panel"
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-5 sm:w-[330px] h-[380px] sm:h-[430px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col z-50 overflow-hidden"
          >
            {/* Header: Beachfront-themed */}
            <div className="bg-gradient-to-r from-charcoal via-[#3A3A42] to-charcoal text-white p-3 flex items-center justify-between border-b border-white/5 relative shrink-0">
              {/* Highlight background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sunset/20 via-transparent to-transparent pointer-events-none" />

              <div className="flex items-center gap-2.5 relative z-10">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-sand/25 border border-white/10 flex items-center justify-center text-sand text-sm font-serif">
                    🌺
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-charcoal rounded-full" />
                </div>
                <div>
                  <h3 className="font-serif text-xs font-bold tracking-wide text-white flex items-center gap-1">
                    Breeze Butler
                    <span className="text-[8px] font-sans font-medium uppercase tracking-wider text-sand bg-sunset/35 py-0.5 px-1 rounded-full">
                      Concierge
                    </span>
                  </h3>
                  <p className="text-[9px] text-slate-300 font-sans mt-0.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online & Ready
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Minimize Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              data-lenis-prevent
              className="flex-1 p-3 overflow-y-auto overscroll-contain space-y-3 bg-slate-50/60 scroll-smooth"
            >
              {messages.map((message) => {
                const isBot = message.sender === 'bot';
                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {isBot && (
                      <div className="w-7 h-7 rounded-full bg-coral/10 border border-coral/15 flex items-center justify-center text-xs shrink-0 select-none">
                        🏄‍♀️
                      </div>
                    )}
                    <div className="flex flex-col max-w-[82%]">
                      <div
                        className={`p-2.5 px-3 rounded-xl text-[11px] leading-relaxed font-sans shadow-sm border ${
                          isBot
                            ? 'bg-white text-charcoal/90 border-slate-100 rounded-tl-sm'
                            : 'bg-sunset text-white border-sunset/20 rounded-tr-sm'
                        }`}
                      >
                        {formatMessageText(message.text)}
                      </div>
                      <span className={`text-[8px] text-gray-400 font-sans mt-0.5 px-1 ${
                        isBot ? 'text-left' : 'text-right'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Bot Typing Indicator State */}
              {isTyping && (
                <div className="flex items-start gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-coral/10 border border-coral/15 flex items-center justify-center text-xs shrink-0">
                    🌺
                  </div>
                  <div className="bg-white border border-slate-100 py-2.5 px-4 rounded-xl rounded-tl-sm shadow-sm flex items-center gap-1">
                    <span className="w-1.2 h-1.2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.2 h-1.2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.2 h-1.2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Shelf */}
            <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 shrink-0 whitespace-nowrap scrollbar-none">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(reply.query)}
                  className="px-2.5 py-1 bg-white hover:bg-coral/10 hover:border-coral/20 border border-slate-200 text-charcoal/80 hover:text-sunset rounded-full text-[9px] font-sans font-medium transition-all shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {reply.label}
                </button>
              ))}
            </div>

            {/* Input Action Form Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-2 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50/80 border border-slate-200 focus:border-sunset rounded-full px-3 py-2 text-[11px] font-sans text-charcoal focus:outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-8 h-8 rounded-full bg-sunset hover:bg-sunset/95 disabled:bg-slate-100 text-white disabled:text-gray-300 flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Bottom Brand Ribbon */}
            <div className="bg-slate-50/80 border-t border-slate-100/60 py-1 px-3 flex items-center justify-between shrink-0 select-none">
              <span className="text-[7.5px] text-gray-400 font-sans tracking-wide">
                Ocean Breeze Concierge AI
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenBooking();
                }}
                className="text-[8px] text-sunset hover:underline font-bold uppercase tracking-wider flex items-center gap-0.5"
              >
                <Calendar className="w-2 h-2" /> Book Stay
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
