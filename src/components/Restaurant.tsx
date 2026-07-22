import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Utensils, 
  Coffee, 
  Globe, 
  Users, 
  Clock, 
  MapPin, 
  Check, 
  Calendar, 
  CheckCircle,
  Soup,
  Leaf,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Star,
  Heart,
  Quote,
  ShieldCheck,
  Award,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Plus,
  Minus,
  X
} from 'lucide-react';
import PageHeader from './PageHeader';

// Typings for Menu Items
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'all' | 'filipino' | 'arabic' | 'malaysian' | 'mains' | 'pasta_noodles' | 'salads_soups' | 'drinks';
  tags?: string[];
  rating: number;
  image: string;
  isPopular?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  // POPULAR / FEATURED DISHES
  {
    id: 'p1',
    name: 'Seafood Carbonara',
    price: 320,
    description: 'Creamy reduction sauce of farm egg yolk, garlic, crisp bacon, sautéed squid, and coastal shrimps.',
    category: 'pasta_noodles',
    rating: 5,
    tags: ['Pasta', 'Seafood', 'Popular'],
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 'p2',
    name: 'Chicken Shawarma Wrap',
    price: 260,
    description: 'Perfectly spiced shaved chicken with garlic toum sauce, pickles, wrapped in flatbread with golden fries.',
    category: 'arabic',
    rating: 4.9,
    tags: ['Arabic', 'Wrap', 'Popular'],
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 'p3',
    name: 'Rendang Beef',
    price: 340,
    description: 'Iconic caramelized beef rendang, slow-cooked for 6 hours in rich kerisik coconut spices.',
    category: 'malaysian',
    rating: 5,
    tags: ['Malaysian', 'Spicy', 'Signature'],
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 'p4',
    name: 'Coastal Pompano Grill',
    price: 380,
    description: 'Fresh local Pompano fish stuffed with herbs and charcoal-grilled, served with soy-calamansi dip.',
    category: 'filipino',
    rating: 4.8,
    tags: ['Filipino', 'Seafood', 'Fresh'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },

  // REGULAR MENU ITEMS
  {
    id: 'm1',
    name: 'Tocilog Breakfast',
    price: 250,
    description: 'Sweet Filipino cured pork served with garlic fried rice, sunny-side-up egg, and unlimited Barako coffee.',
    category: 'filipino',
    rating: 4.9,
    tags: ['Filipino Classic', 'Includes Coffee'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm2',
    name: 'Bangsilog Delight',
    price: 250,
    description: 'Golden pan-fried marinated milkfish served with garlic fried rice, egg, and unlimited Barako coffee.',
    category: 'filipino',
    rating: 4.8,
    tags: ['Filipino Classic', 'Seafood'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm3',
    name: 'Biryani Chicken Special',
    price: 290,
    description: 'Aromatic basmati rice layered with tender spiced chicken, saffron, and fresh herbs.',
    category: 'arabic',
    rating: 5,
    tags: ['Arabic', 'Spicy'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm4',
    name: 'Kabsa Beef Feast',
    price: 320,
    description: 'Saffron spiced kabsa rice topped with melt-in-the-mouth simmered beef flank, dried limes, and roasted nuts.',
    category: 'arabic',
    rating: 4.9,
    tags: ['Arabic', 'Beef'],
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm5',
    name: 'Hummus Duo & Flatbread',
    price: 180,
    description: 'Smooth purée of local chickpeas, tahini, lemon juice, virgin olive oil, and warm oven-baked pita.',
    category: 'arabic',
    rating: 4.7,
    tags: ['Arabic', 'Vegetarian'],
    image: 'https://images.unsplash.com/photo-1577906096429-f73ae2c31243?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm6',
    name: 'Nasi Lemak Special',
    price: 310,
    description: 'Fragrant pandan-coconut rice with fresh prawns, squid, boiled egg, roasted peanuts, and spicy sambal.',
    category: 'malaysian',
    rating: 5,
    tags: ['Malaysian', 'Seafood', 'Spicy'],
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm7',
    name: 'Chicken Satay Skewers',
    price: 220,
    description: 'Grilled spiced chicken skewers served with rich house-made sweet & savory peanut dipping sauce.',
    category: 'malaysian',
    rating: 4.8,
    tags: ['Malaysian', 'Grilled'],
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm8',
    name: 'Honey-Glazed Pork Chop',
    price: 450,
    description: 'Brined and pan-seared thick pork chop drizzled with honey-garlic glaze, served with potato mash.',
    category: 'mains',
    rating: 4.9,
    tags: ['Mains', 'Pork'],
    image: 'https://images.unsplash.com/photo-1432139548538-84b271175759?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm9',
    name: 'Inihaw na Pusit (Grilled Squid)',
    price: 390,
    description: 'Succulent charcoal-grilled squid stuffed with chopped onions and ripe tomatoes, with soy-calamansi dip.',
    category: 'mains',
    rating: 4.9,
    tags: ['Filipino', 'Seafood', 'Grilled'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm10',
    name: 'Buttered Garlic Shrimps',
    price: 390,
    description: 'Wild-caught coastal shrimps sautéed in garlic-infused real butter, white wine reduction, and parsley.',
    category: 'mains',
    rating: 5,
    tags: ['Seafood', 'Popular'],
    image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm11',
    name: 'Spaghetti Bolognese',
    price: 310,
    description: 'Slow-simmered minced lean beef and herb-tomato ragout over pasta with parmesan and garlic toast.',
    category: 'pasta_noodles',
    rating: 4.7,
    tags: ['Pasta', 'Classic'],
    image: 'https://images.unsplash.com/photo-1516100882582-76c9a1a5d629?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm12',
    name: 'Pansit Bihon Feast',
    price: 260,
    description: 'Traditional thin rice vermicelli noodles stir-fried with chicken, shrimps, wood ear mushrooms, and veggies.',
    category: 'pasta_noodles',
    rating: 4.8,
    tags: ['Filipino', 'Noodles'],
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm13',
    name: 'Shrimp & Avocado Cobb Salad',
    price: 320,
    description: 'Grilled Cajun shrimps, creamy avocado wedges, sweet corn, bacon bits, and field greens with citrus vinaigrette.',
    category: 'salads_soups',
    rating: 4.9,
    tags: ['Salad', 'Healthy', 'Fresh'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm14',
    name: 'Fresh Coconut Cooler',
    price: 120,
    description: 'Chilled young coconut water served in the shell with tender coconut meat and fresh mint leaves.',
    category: 'drinks',
    rating: 5,
    tags: ['Drink', 'Refreshing'],
    image: 'https://images.unsplash.com/photo-1546171753-97d7676e4186?auto=format&fit=crop&w=600&q=80'
  }
];

const MENU_CATEGORIES = [
  { id: 'all', label: 'All Foods' },
  { id: 'filipino', label: 'Filipino' },
  { id: 'arabic', label: 'Arabic' },
  { id: 'malaysian', label: 'Malaysian' },
  { id: 'mains', label: 'Mains & Seafood' },
  { id: 'pasta_noodles', label: 'Pasta & Noodles' },
  { id: 'salads_soups', label: 'Salads & Soups' },
  { id: 'drinks', label: 'Drinks & Desserts' }
];

const SIDE_HERO_TAGS = [
  { id: 'all', label: 'Dishes', icon: Utensils },
  { id: 'salads_soups', label: 'Dessert', icon: Sparkles },
  { id: 'drinks', label: 'Drinks', icon: Coffee },
  { id: 'mains', label: 'Platter', icon: ShieldCheck },
  { id: 'arabic', label: 'Snacks', icon: Leaf }
];

const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Savannah Nguyen',
    role: 'Verified Guest',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    comment: 'This place is great! Atmosphere is chilled and cool, the staff is extremely friendly. They know what they are doing and what they are talking about. OpenTable reservations made it so easy.',
    rating: 5
  },
  {
    id: 't2',
    name: 'Esther Howard',
    role: 'Food Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: 'The Beef Rendang and Seafood Carbonara were absolute masterpieces. Having dinner right by the La Union sunset was the highlight of our holiday retreat.',
    rating: 5
  },
  {
    id: 't3',
    name: 'Albert Flores',
    role: 'Resort Guest',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    comment: 'Incredible flavor fusion! The Arabic Biryani and fresh grilled pompano tasted straight from a world-class restaurant. Highly recommended!',
    rating: 5
  }
];

export default function Restaurant() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Order / Cart Modal State
  const [orderDish, setOrderDish] = useState<MenuItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);

  // Table Reservation State
  const [resName, setResName] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [resDate, setResDate] = useState('');
  const [resTime, setResTime] = useState('');
  const [resGuests, setResGuests] = useState('2 Guests');
  const [resSeating, setResSeating] = useState('Sunset Deck (Beachfront)');
  const [isResSubmitting, setIsResSubmitting] = useState(false);
  const [isResSuccess, setIsResSuccess] = useState(false);

  // Popular Dishes Carousel Index
  const [popularIndex, setPopularIndex] = useState(0);

  const popularDishes = useMemo(() => MENU_ITEMS.filter(item => item.isPopular), []);

  const handleNextPopular = () => {
    setPopularIndex((prev) => (prev + 1) % popularDishes.length);
  };

  const handlePrevPopular = () => {
    setPopularIndex((prev) => (prev - 1 + popularDishes.length) % popularDishes.length);
  };

  // Filter regular menu items
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrderSubmitted(true);
    setTimeout(() => {
      setIsOrderSubmitted(false);
      setOrderDish(null);
      setOrderQuantity(1);
      setOrderNotes('');
    }, 2000);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResSubmitting(true);
    setTimeout(() => {
      setIsResSubmitting(false);
      setIsResSuccess(true);
    }, 1200);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-slate-800 font-sans selection:bg-[#E5BF71] selection:text-[#0B1E36]">
      
      {/* 1. MASTER PAGE HEADER */}
      <PageHeader
        title="Maranna Dining & Lounge"
        subtitle="We Serve The Taste You Love — Experience world-class culinary mastery blending rich coastal Filipino flavors, traditional Arabic classics, and authentic Malaysian cuisine."
        category="Gourmet Oceanfront Restaurant"
        backgroundImageUrl="https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/473748832_122132546324567801_2877340831206792826_n.jpg"
        imageOpacity="opacity-85"
        objectPosition="object-[center_25%]"
      />

      {/* ========================================================================= */}
      {/* 2. HERO SECTION ("WE SERVE THE TASTE YOU LOVE" LAYOUT) */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1E36]/10 text-[#0B1E36] font-sans text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#E5BF71]" />
              Authentic Flavors & Coastal Elegance
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#0B1E36] leading-[1.15]">
              We Serve The Taste <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B1E36] via-[#1c3a60] to-[#E5BF71]">
                You Love
              </span> <span className="inline-block animate-bounce">😋</span>
            </h1>

            <p className="font-sans text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed mx-auto lg:mx-0">
              This is a unique resort restaurant which typically serves fresh coastal food and tropical drinks, in addition to light refreshments such as artisanal baked goods or savory snacks.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#regular-menu"
                className="px-8 py-3.5 rounded-full bg-[#E5BF71] text-[#0B1E36] hover:bg-[#ebd095] font-sans text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10 active:scale-95 transition-all cursor-pointer"
              >
                Explore Food
              </a>

              <a
                href="#reserve-table"
                className="px-8 py-3.5 rounded-full bg-white border border-slate-300 text-[#0B1E36] hover:border-[#0B1E36] font-sans text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Search className="w-3.5 h-3.5 text-[#0B1E36]" />
                Search & Reserve
              </a>
            </div>
          </motion.div>

          {/* Right Hero Graphic with Floating Dish & Side Badges (Matching Screenshot 1 Layout) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Background Soft Glow Circles */}
            <div className="absolute w-80 h-80 bg-[#E5BF71]/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute w-72 h-72 border border-[#0B1E36]/15 rounded-full -z-10 animate-spin-slow"></div>

            <div className="relative flex items-center gap-6">
              
              {/* Central Circular Dish Plate Frame */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl z-10"
              >
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                  alt="Seafood Dish"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E36]/40 via-transparent to-transparent"></div>
              </motion.div>

              {/* Side Floating Category Badges (Screenshot 1 Style) */}
              <div className="flex flex-col gap-3 z-20">
                {SIDE_HERO_TAGS.map((tag) => {
                  const Icon = tag.icon;
                  return (
                    <button
                      key={tag.id}
                      onClick={() => {
                        setSelectedCategory(tag.id);
                        document.getElementById('regular-menu')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md hover:bg-[#0B1E36] hover:text-[#E5BF71] text-[#0B1E36] text-xs font-bold transition-all duration-200 cursor-pointer group"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#FAF8F5] group-hover:bg-[#E5BF71]/20 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-[#0B1E36] group-hover:text-[#E5BF71]" />
                      </div>
                      <span>{tag.label}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          </motion.div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. POPULAR DISHES CAROUSEL / GRID SECTION */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Title & Navigation Arrows */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="font-sans text-xs uppercase font-bold tracking-widest text-[#0B1E36]">
                Chef Recommended
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1E36] mt-1">
                Popular Dishes
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPopular}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#0B1E36] hover:text-[#E5BF71] transition-all cursor-pointer shadow-sm"
                aria-label="Previous Dish"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPopular}
                className="w-10 h-10 rounded-full bg-[#E5BF71] text-[#0B1E36] flex items-center justify-center hover:bg-[#dcae5b] transition-all cursor-pointer shadow-sm"
                aria-label="Next Dish"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish) => (
              <motion.div
                key={dish.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FAF8F5] border border-slate-200 rounded-3xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-[#E5BF71]/60 transition-all duration-300 relative group"
              >
                {/* Top Circular Dish Image */}
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                {/* Dish Name */}
                <h3 className="font-serif text-lg font-bold text-[#0B1E36]">
                  {dish.name}
                </h3>

                {/* Description */}
                <p className="font-sans text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed mb-4 flex-1">
                  {dish.description}
                </p>

                {/* Price & Add Button */}
                <div className="w-full flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <span className="font-serif text-base font-bold text-[#0B1E36]">
                    ₱{dish.price}
                  </span>
                  <button
                    onClick={() => {
                      setOrderDish(dish);
                      setOrderQuantity(1);
                    }}
                    className="px-4 py-1.5 rounded-full bg-[#0B1E36] text-[#E5BF71] text-xs font-bold hover:bg-[#122b4c] transition-all cursor-pointer shadow-sm"
                  >
                    Add To Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. HOSPITALITY & SERVICES SECTION ("WE ARE MORE THAN MULTIPLE SERVICES") */}
      {/* (NO CHEF PHOTO AS REQUESTED BY USER) */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Delicious Food Dish Circle Collage (NO CHEF PHOTO) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 h-72 sm:w-88 sm:h-88">
              {/* Outer Decorative Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E5BF71]/40 animate-spin-slow"></div>

              {/* Main Food Dish Circle */}
              <div className="w-full h-full rounded-full overflow-hidden border-8 border-white shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
                  alt="Gourmet Dining Platter"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Bottom Dish Badge */}
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1559715745-e1b33a271c8f?auto=format&fit=crop&w=400&q=80"
                  alt="Seafood Platter"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Quality Tag */}
              <div className="absolute -top-2 -right-2 bg-[#0B1E36] text-[#E5BF71] border border-[#E5BF71]/30 px-4 py-2 rounded-2xl shadow-xl text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest block text-blue-200">Quality Assured</span>
                <span className="font-serif text-xs font-bold block text-[#E5BF71]">100% Organic Fresh</span>
              </div>
            </div>
          </div>

          {/* Right Column: "We Are More Than Multiple Services" */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="font-sans text-xs uppercase font-bold tracking-widest text-[#0B1E36]">
              Excellence In Hospitality
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1E36] leading-tight">
              We Are More Than <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B1E36] via-[#1c3a60] to-[#E5BF71]">
                Multiple Services
              </span>
            </h2>

            <p className="font-sans text-sm text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              This is a type of food service which typically serves gourmet meals and drinks, in addition to light refreshments such as baked goods or coastal snacks. We prioritize luxury, cleanliness, and speed.
            </p>

            {/* Feature List Grid (Matching Icon Rows from Screenshot 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#0B1E36]/10 text-[#0B1E36] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-[#0B1E36]" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-[#0B1E36]">Pre-Reservation</h4>
                  <p className="text-[11px] text-gray-500">Book table in advance online</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#0B1E36]/10 text-[#0B1E36] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#0B1E36]" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-[#0B1E36]">24/7 Room Service</h4>
                  <p className="text-[11px] text-gray-500">Round-the-clock dining</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#0B1E36]/10 text-[#0B1E36] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#0B1E36]" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-[#0B1E36]">Organized Foodie Place</h4>
                  <p className="text-[11px] text-gray-500">Beach lounge & sunset deck</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#0B1E36]/10 text-[#0B1E36] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#0B1E36]" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-[#0B1E36]">Clean Kitchen</h4>
                  <p className="text-[11px] text-gray-500">5-star hygiene standard</p>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <a
                href="#reserve-table"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#0B1E36] text-[#E5BF71] hover:bg-[#122b4c] font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                About Our Hospitality
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. OUR REGULAR MENU PACK SECTION */}
      {/* ========================================================================= */}
      <section id="regular-menu" className="py-20 bg-white border-t border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="font-sans text-xs uppercase font-bold tracking-widest text-[#0B1E36]">
              Complete Bill Of Fare
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1E36]">
              Our Regular Menu Pack
            </h2>
            <p className="font-sans text-xs sm:text-sm text-gray-500">
              Browse our diverse menu categorized by region and ingredients, crafted with passion.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food by name or ingredient..."
              className="w-full pl-11 pr-10 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B1E36]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0B1E36]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills (Matching Screenshot 1 Style) */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#E5BF71] text-[#0B1E36] shadow-md font-extrabold'
                    : 'bg-[#FAF8F5] text-gray-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Menu Items Grid (4 columns like Screenshot 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMenuItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FAF8F5] border border-slate-200 rounded-3xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-lg hover:border-[#E5BF71] transition-all duration-300 relative group"
              >
                {/* Top Circular Dish Image */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-3 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>

                {/* Item Name */}
                <h3 className="font-serif text-base font-bold text-[#0B1E36]">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="font-sans text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>

                {/* Price & Action Button */}
                <div className="w-full flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <span className="font-serif text-base font-bold text-[#0B1E36]">
                    ₱{item.price}
                  </span>
                  <button
                    onClick={() => {
                      setOrderDish(item);
                      setOrderQuantity(1);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-white border border-slate-300 text-[#0B1E36] text-[11px] font-bold hover:bg-[#0B1E36] hover:text-[#E5BF71] hover:border-[#0B1E36] transition-all cursor-pointer shadow-xs"
                  >
                    Add To Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredMenuItems.length === 0 && (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <Utensils className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No dishes match your selection.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="text-xs font-bold text-[#0B1E36] underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. RESERVE YOUR TABLE SECTION ("DO YOU HAVE ANY DINNER PLAN TODAY?") */}
      {/* ========================================================================= */}
      <section id="reserve-table" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="bg-[#0B1E36] text-white rounded-3xl p-8 sm:p-12 border border-[#E5BF71]/30 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Background Ring */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#E5BF71]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Content & Form */}
            <div className="lg:col-span-7 space-y-6">
              <span className="font-sans text-xs uppercase font-bold tracking-widest text-[#E5BF71]">
                Table Reservation
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                Do You Have Any Dinner <br className="hidden sm:block" />
                Plan Today? <span className="text-[#E5BF71] italic font-normal">Reserve Your Table</span>
              </h2>

              <p className="font-sans text-xs sm:text-sm text-blue-100/80 leading-relaxed max-w-lg">
                Make online reservations in seconds to secure the finest beachfront sunset view for your romantic date, family gathering, or celebration.
              </p>

              {/* Reservation Form */}
              {isResSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 border border-[#E5BF71]/40 rounded-2xl p-6 text-center space-y-3"
                >
                  <CheckCircle className="w-10 h-10 text-[#E5BF71] mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-[#E5BF71]">Table Reserved Successfully!</h3>
                  <p className="text-xs text-blue-100">
                    Thank you, {resName || 'Valued Guest'}. We have saved your table at {resSeating} for {resGuests} on {resDate || 'your selected date'}.
                  </p>
                  <button
                    onClick={() => setIsResSuccess(false)}
                    className="px-6 py-2 rounded-full bg-[#E5BF71] text-[#0B1E36] text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Reserve Another Table
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={resName}
                      onChange={(e) => setResName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-blue-200/60 focus:outline-none focus:border-[#E5BF71]"
                    />
                    <input
                      type="email"
                      required
                      value={resEmail}
                      onChange={(e) => setResEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-blue-200/60 focus:outline-none focus:border-[#E5BF71]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="date"
                      required
                      value={resDate}
                      onChange={(e) => setResDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#E5BF71]"
                    />
                    <input
                      type="time"
                      required
                      value={resTime}
                      onChange={(e) => setResTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#E5BF71]"
                    />
                    <select
                      value={resGuests}
                      onChange={(e) => setResGuests(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#142d4d] border border-white/20 text-xs text-white focus:outline-none focus:border-[#E5BF71]"
                    >
                      <option value="1 Guest">1 Guest</option>
                      <option value="2 Guests">2 Guests</option>
                      <option value="4 Guests">4 Guests</option>
                      <option value="6+ Guests">6+ Guests Party</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isResSubmitting}
                    className="px-8 py-3.5 rounded-full bg-[#E5BF71] text-[#0B1E36] hover:bg-[#ebd095] font-sans text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isResSubmitting ? 'Confirming...' : 'Make Reservation'}
                  </button>
                </form>
              )}
            </div>

            {/* Right Side Appetizing Circular Platter Image (Matching Screenshot 1) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80"
                  alt="Special Dinner Dish"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* ========================================================================= */}
      {/* 8. ORDER / QUICK CART MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {orderDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 space-y-5"
            >
              <button
                onClick={() => setOrderDish(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-gray-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={orderDish.image}
                  alt={orderDish.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1E36]">
                    Quick Order
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#0B1E36]">
                    {orderDish.name}
                  </h3>
                  <p className="font-serif text-sm font-bold text-[#E5BF71]">
                    ₱{orderDish.price * orderQuantity}
                  </p>
                </div>
              </div>

              {isOrderSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center text-emerald-800 space-y-1">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm">Added to Room Order!</h4>
                  <p className="text-xs">Our kitchen team is preparing your selection.</p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-sm text-slate-800">{orderQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(orderQuantity + 1)}
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Special Cooking Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Less spicy, dressing on side..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1E36]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#0B1E36] text-[#E5BF71] hover:bg-[#122b4c] font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Confirm Order (₱{orderDish.price * orderQuantity})
                  </button>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
