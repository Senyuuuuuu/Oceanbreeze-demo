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
  ChevronDown
} from 'lucide-react';
import PageHeader from './PageHeader';
import MarannaLogo from './MarannaLogo';

// Typings for Menu Items
interface MenuItem {
  name: string;
  price: number;
  description: string;
  category: 'breakfast' | 'international' | 'mains' | 'vegetables' | 'pasta_noodles' | 'salads_soups' | 'addons';
  subcategory?: 'arabic' | 'malaysian' | 'beef' | 'pork' | 'chicken' | 'seafood' | 'pasta' | 'noodles' | 'salads' | 'soups';
  tags?: string[];
  image: string;
}

const MENU_ITEMS: MenuItem[] = [
  // BREAKFAST
  {
    name: 'Tocilog',
    price: 250,
    description: 'Sweet Filipino cured pork served with garlic fried rice, sunny-side-up egg, and unlimited Barako coffee.',
    category: 'breakfast',
    tags: ['Filipino Classic', 'Breakfast', 'Includes Coffee'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Cornsilog',
    price: 250,
    description: 'Savory corned beef sautéed with onions, served with garlic fried rice, farm egg, and unlimited Barako coffee.',
    category: 'breakfast',
    tags: ['Filipino Classic', 'Breakfast', 'Includes Coffee'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Hamsilog',
    price: 250,
    description: 'Premium grilled ham slices served with garlic fried rice, sunny-side-up egg, and unlimited Barako coffee.',
    category: 'breakfast',
    tags: ['Breakfast', 'Includes Coffee'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Longsilog',
    price: 250,
    description: 'Local sweet & garlicky sausage (longganisa) served with garlic fried rice, egg, and unlimited Barako coffee.',
    category: 'breakfast',
    tags: ['Filipino Classic', 'Local Specialty', 'Breakfast', 'Includes Coffee'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Bangsilog',
    price: 250,
    description: 'Golden pan-fried marinated milkfish (bangus) served with garlic fried rice, egg, and unlimited Barako coffee.',
    category: 'breakfast',
    tags: ['Filipino Classic', 'Seafood', 'Breakfast', 'Includes Coffee'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'
  },

  // INTERNATIONAL - ARABIC
  {
    name: 'Biryani Chicken',
    price: 290,
    description: 'Aromatic basmati rice layered with tender spiced chicken, saffron, and fresh herbs.',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Spicy', 'Popular'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Biryani Beef',
    price: 320,
    description: 'Luxurious saffron basmati rice layered with slow-braised tender beef and middle-eastern spices.',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Spicy', 'Beef'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Kabsa Chicken',
    price: 290,
    description: 'Traditional Arab rice dish cooked with roasted chicken, raisins, almonds, and intensive cardamom blend.',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Signature'],
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Kabsa Beef',
    price: 320,
    description: 'Saffron spiced kabsa rice topped with melt-in-the-mouth simmered beef flank, dried limes, and nuts.',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Beef'],
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Mandi Chicken',
    price: 290,
    description: 'Yemeni spiced rice dish with exceptionally tender chicken, cooked slowly in charcoal smoke infusion.',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Smoky'],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Mandi Beef',
    price: 320,
    description: 'Yemeni smoked basmati rice served with smoked beef chuck roast and house garlic sauce.',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Beef', 'Smoky'],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Shawarma Chicken',
    price: 165,
    description: 'Perfectly spiced shaved chicken wraps with garlic toum sauce, pickles, wrapped in flatbread, served with fries.',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Wrap', 'Served with Fries'],
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Shawarma Beef',
    price: 210,
    description: 'Spiced shaved beef, tahini dressing, grilled onions and tomatoes wrapped in flatbread, served with fries.',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Wrap', 'Beef', 'Served with Fries'],
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Shish Tawook Chicken',
    price: 250,
    description: 'Skewers of grilled chicken cubes marinated in garlic, lemon, and yogurt, served with rice, fries or bread.',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Grilled'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Shish Tawook Beef',
    price: 290,
    description: 'Charcoal grilled beef skewers heavily marinated in premium spices, served with rice, fries or bread.',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Grilled', 'Beef'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Kofta Kebab Beef',
    price: 240,
    description: 'Savory minced beef with onions, parsley, and traditional spices, grilled on charcoal skewers. Served with rice, fries or bread.',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Grilled', 'Beef'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Hummus Duo',
    price: 120,
    description: 'Smooth purée of local chickpeas, tahini, lemon juice, and virgin olive oil. Custom add-ons: Grilled Tomatoes (+25) or Grilled Peppers (+45).',
    category: 'international',
    subcategory: 'arabic',
    tags: ['Arabic', 'Vegetarian', 'Dip'],
    image: 'https://images.unsplash.com/photo-1577906096429-f73ae2c31243?auto=format&fit=crop&w=600&q=80'
  },

  // INTERNATIONAL - MALAYSIAN
  {
    name: 'Rendang Chicken',
    price: 280,
    description: 'Authentic Malaysian slow-cooked chicken in coconut milk, lemongrass, ginger, and rich kerisik (toasted coconut paste).',
    category: 'international',
    subcategory: 'malaysian',
    tags: ['Malaysian', 'Spicy', 'Curry'],
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Rendang Beef',
    price: 310,
    description: 'Iconic caramelized beef rendang, slow-cooked for hours until incredibly tender and saturated with coconut dry curry.',
    category: 'international',
    subcategory: 'malaysian',
    tags: ['Malaysian', 'Spicy', 'Beef', 'Signature'],
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Satay Chicken with Rice',
    price: 150,
    description: 'Grilled spiced chicken skewers served with savory sweet-spicy peanut sauce and steamed rice.',
    category: 'international',
    subcategory: 'malaysian',
    tags: ['Malaysian', 'Grilled', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Satay Beef with Rice',
    price: 195,
    description: 'Marinated tender beef skewers charcoal-grilled, served with authentic peanut dip and steamed rice.',
    category: 'international',
    subcategory: 'malaysian',
    tags: ['Malaysian', 'Grilled', 'Beef', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Nasi Lemak Special',
    price: 310,
    description: 'Malaysia’s national dish—fragrant rice cooked in coconut milk & pandan, served with fresh prawns, squid, boiled egg, peanuts, and rich sambal.',
    category: 'international',
    subcategory: 'malaysian',
    tags: ['Malaysian', 'Seafood', 'Spicy', 'Popular'],
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Nasi Goreng',
    price: 280,
    description: 'Indonesian-Malaysian style aromatic fried rice tossed with egg, mixed garden vegetables, tofu, and sautéed prawns.',
    category: 'international',
    subcategory: 'malaysian',
    tags: ['Malaysian', 'Seafood', 'Rice'],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80'
  },

  // MAINS - BEEF
  {
    name: 'Chilli Con Carne',
    price: 310,
    description: 'Spicy ground beef slow-simmered with red kidney beans, tomatoes, and chili peppers, served with chips or mashed potatoes.',
    category: 'mains',
    subcategory: 'beef',
    tags: ['Beef', 'Spicy'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Beef Steak Tagalog',
    price: 290,
    description: 'Filipino "Bistek"—thinly sliced beef steak simmered in soy sauce, fresh calamansi juice, garlic, and lots of caramelized onion rings. Served with rice.',
    category: 'mains',
    subcategory: 'beef',
    tags: ['Filipino Classic', 'Beef', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Beef Caldereta',
    price: 290,
    description: 'Comforting beef stew with tomato paste, liver spread, bell peppers, carrots, cheese, and olives. Served with rice.',
    category: 'mains',
    subcategory: 'beef',
    tags: ['Filipino Classic', 'Beef', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Bulalo Feast',
    price: 540,
    description: 'Comforting bone-in beef shank soup with tender marrow, sweet native corn, cabbage, and green beans. Good for 2 (no rice).',
    category: 'mains',
    subcategory: 'beef',
    tags: ['Filipino Classic', 'Soup', 'Beef', 'Good for 2'],
    image: 'https://images.unsplash.com/photo-1608500218900-8afa1350a601?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pinapaitan',
    price: 420,
    description: 'Acclaimed authentic Ilocano bitter-savory beef innards soup cooked with bile, ginger, chilies, and local citrus. Good for 2 (no rice).',
    category: 'mains',
    subcategory: 'beef',
    tags: ['Filipino Classic', 'Local Specialty', 'Spicy', 'Good for 2'],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
  },

  // MAINS - PORK
  {
    name: 'Honey-Glazed Pork Chop',
    price: 480,
    description: 'Brined and pan-seared thick pork chop drizzled with aromatic honey-garlic glaze, served with chips or mashed potatoes.',
    category: 'mains',
    subcategory: 'pork',
    tags: ['Pork'],
    image: 'https://images.unsplash.com/photo-1432139548538-84b271175759?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Sweet and Sour Pork',
    price: 320,
    description: 'Crispy deep-fried pork nuggets tossed in a perfect sweet & tangy glaze with bell peppers, onions, and sweet pineapples.',
    category: 'mains',
    subcategory: 'pork',
    tags: ['Pork'],
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pork Adobo Classic',
    price: 280,
    description: 'Slow-braised pork belly chunks in naturally fermented coconut vinegar, premium soy sauce, garlic, and bay leaves.',
    category: 'mains',
    subcategory: 'pork',
    tags: ['Filipino Classic', 'Pork'],
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pork Inihaw (300g)',
    price: 380,
    description: 'Charcoal-grilled thick pork chop or marinated liempo (pork belly) served with local vinegar dipping sauce.',
    category: 'mains',
    subcategory: 'pork',
    tags: ['Filipino Classic', 'Grilled', 'Pork'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },

  // MAINS - CHICKEN
  {
    name: 'Sweet and Sour Chicken',
    price: 290,
    description: 'Battered tender chicken breast chunks wok-fried and coated with sweet & sour glaze, pineapple and peppers. Served with rice.',
    category: 'mains',
    subcategory: 'chicken',
    tags: ['Chicken', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Chicken Adobo',
    price: 270,
    description: 'Traditional slow-cooked chicken pieces in garlic, peppercorns, soy sauce, and vinegar reduction. Served with rice.',
    category: 'mains',
    subcategory: 'chicken',
    tags: ['Filipino Classic', 'Chicken', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Menudo Special',
    price: 270,
    description: 'Hearty pork and chicken stew with finely diced potatoes, carrots, bell peppers, and sweet raisins in tomato gravy. Served with rice.',
    category: 'mains',
    subcategory: 'chicken',
    tags: ['Filipino Classic', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Tinola Chicken',
    price: 250,
    description: 'Sustenance chicken soup flavored with sliced ginger, green papaya wedges, and fresh chili leaves. Served with rice.',
    category: 'mains',
    subcategory: 'chicken',
    tags: ['Filipino Classic', 'Soup', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
  },

  // MAINS - SEAFOOD
  {
    name: 'Kilawin (250g)',
    price: 390,
    description: 'Fresh coastal raw Tuna or Tangigue cubes instantly cured in premium local vinegar, calamansi, ginger, red onions, and bird’s eye chili. Served with rice.',
    category: 'mains',
    subcategory: 'seafood',
    tags: ['Filipino Classic', 'Seafood', 'Spicy', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Inihaw na Pusit (200-250g)',
    price: 390,
    description: 'Succulent charcoal-grilled squid stuffed with chopped onions and ripe tomatoes, basted with native sweet soy-lemon glaze. Served with rice.',
    category: 'mains',
    subcategory: 'seafood',
    tags: ['Filipino Classic', 'Seafood', 'Grilled', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Inihaw na Isda (Pompano)',
    price: 380,
    description: 'Fresh local Pompano (200-250g) stuffed with herbs and charcoal-grilled, served with soy-calamansi dip and rice.',
    category: 'mains',
    subcategory: 'seafood',
    tags: ['Filipino Classic', 'Seafood', 'Grilled', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Inihaw na Isda (Bangus)',
    price: 320,
    description: 'Fresh stuffed local milkfish (300-350g) stuffed with onions, ginger and tomatoes, grilled on charcoal, served with rice.',
    category: 'mains',
    subcategory: 'seafood',
    tags: ['Filipino Classic', 'Seafood', 'Grilled', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Buttered Mussels (500g)',
    price: 350,
    description: 'Plump seasonal local mussels sautéed in white wine garlic-butter broth, served with rice.',
    category: 'mains',
    subcategory: 'seafood',
    tags: ['Seafood', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Buttered Shrimps (250g)',
    price: 390,
    description: 'Wild caught sweet coastal shrimps sautéed in garlic-infused real butter and parsley, served with rice.',
    category: 'mains',
    subcategory: 'seafood',
    tags: ['Seafood', 'Served with Rice', 'Popular'],
    image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Steamed Prawns (250g)',
    price: 390,
    description: 'Plump fresh prawns delicately steamed with ginger sprigs and scallions, served with calamansi dipping sauce and rice.',
    category: 'mains',
    subcategory: 'seafood',
    tags: ['Seafood', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Grilled Tuna with Butter Garlic Lemon',
    price: 450,
    description: 'Sizzling seared local Yellowfin tuna steak glazed in rich garlic lemon butter, served with mashed potato.',
    category: 'mains',
    subcategory: 'seafood',
    tags: ['Seafood', 'Grilled', 'Signature'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Fried Fish with Chinese Sauce',
    price: 390,
    description: 'Crispy fried local catch filet (200-250g) drizzled with Chinese sweet-savory ginger soy glaze. Served with rice.',
    category: 'mains',
    subcategory: 'seafood',
    tags: ['Seafood', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Steamed Fish',
    price: 390,
    description: 'Steamed daily catch fish (200-250g) prepared with sesame-scented soy broth, ginger silvers, and cilantro. Served with rice.',
    category: 'mains',
    subcategory: 'seafood',
    tags: ['Seafood', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Sinigang Catch',
    price: 420,
    description: 'The national classic—sour tamarind broth with fresh fish or plump prawns, garden radish, string beans, and water spinach. Good for 2, served with rice.',
    category: 'mains',
    subcategory: 'seafood',
    tags: ['Filipino Classic', 'Seafood', 'Soup', 'Good for 2', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
  },

  // VEGETABLES
  {
    name: 'Chopseuy',
    price: 260,
    description: 'A colorful medley of wok-fried local garden vegetables (cauliflower, carrots, cabbage, baby corn) in a savory oyster-garlic glaze.',
    category: 'vegetables',
    tags: ['Vegetarian', 'Healthy'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pinakbet Ilocano',
    price: 230,
    description: 'Authentic northern specialty of squash, eggplant, okra, string beans, and bitter melon sautéed with rich shrimp paste (bagoong).',
    category: 'vegetables',
    tags: ['Filipino Classic', 'Local Specialty'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Dinengdeng',
    price: 230,
    description: 'Traditional native clear broth simmered with grilled fish steak, string beans, eggplant, squash blossoms, and savory bagoong.',
    category: 'vegetables',
    tags: ['Filipino Classic', 'Local Specialty', 'Soup'],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Buridibod',
    price: 250,
    description: 'Traditional Ilocano soup cooked with sweet potato (kamote) mashed in broth, seasonal greens, and pan-fried fish flakes.',
    category: 'vegetables',
    tags: ['Filipino Classic', 'Local Specialty', 'Soup'],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Mixed Local Vegetables (Steamed)',
    price: 250,
    description: 'Fresh local farm harvest delicately steamed to retain crispness and natural nutrients. Served with native dips.',
    category: 'vegetables',
    tags: ['Vegetarian', 'Healthy'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Blanched Kangkong with Bagoong',
    price: 120,
    description: 'Crispy river spinach lightly blanched, served with a separate side of aromatic sautéed shrimp paste.',
    category: 'vegetables',
    tags: ['Local Specialty'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Stir-fried Kangkong',
    price: 120,
    description: 'River spinach (water spinach) quickly sautéed in a blazing wok with minced garlic, soy sauce, and sesame hints.',
    category: 'vegetables',
    tags: ['Vegetarian', 'Healthy'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Laing served with Rice',
    price: 190,
    description: 'Shredded taro leaves slow-cooked in rich coconut milk, ginger, shrimp paste, and bird’s eye chili. Served with rice.',
    category: 'vegetables',
    tags: ['Filipino Classic', 'Spicy', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Ginataang Kalabasa with Sitaw',
    price: 190,
    description: 'Native sweet squash and crisp string beans cooked in slow-simmered rich coconut cream. Served with rice.',
    category: 'vegetables',
    tags: ['Filipino Classic', 'Vegetarian Friendly', 'Served with Rice'],
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80'
  },

  // PASTA AND NOODLES
  {
    name: 'Spaghetti Bolognese',
    price: 320,
    description: 'Slow-simmered minced lean beef and herb-tomato ragout over spaghetti, topped with parmesan. Served with toasted garlic bread.',
    category: 'pasta_noodles',
    subcategory: 'pasta',
    tags: ['Pasta', 'Served with Garlic Bread'],
    image: 'https://images.unsplash.com/photo-1516100882582-76c9a1a5d629?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Seafood Carbonara',
    price: 320,
    description: 'Creamy reduction sauce of farm egg yolk, garlic, crisp bacon bits, sautéed squid, and coastal shrimps with toasted garlic bread.',
    category: 'pasta_noodles',
    subcategory: 'pasta',
    tags: ['Pasta', 'Seafood', 'Served with Garlic Bread', 'Popular'],
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Seafood Alfredo',
    price: 320,
    description: 'Indulgent butter, heavy cream and parmesan sauce with pan-seared plump scallops, calamari, and shrimps. Served with toasted garlic bread.',
    category: 'pasta_noodles',
    subcategory: 'pasta',
    tags: ['Pasta', 'Seafood', 'Served with Garlic Bread'],
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Baked Pasta Penne',
    price: 290,
    description: 'Penne pasta tossed in rich meat marinara sauce, baked under a thick, golden blanket of bubbly mozzarella and cheddar. Served with garlic bread.',
    category: 'pasta_noodles',
    subcategory: 'pasta',
    tags: ['Pasta', 'Served with Garlic Bread'],
    image: 'https://images.unsplash.com/photo-1563379971899-660589a01cc3?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Fresh Basil Pesto Pasta',
    price: 290,
    description: 'Spaghetti coated in an aromatic emerald sauce of pounded fresh sweet basil, garlic, pine nuts, parmesan, and extra virgin olive oil. Served with garlic bread.',
    category: 'pasta_noodles',
    subcategory: 'pasta',
    tags: ['Pasta', 'Vegetarian', 'Served with Garlic Bread'],
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Stir-fried Spicy Pasta',
    price: 280,
    description: 'Wok-tossed spaghetti in olive oil, toasted garlic, bird’s eye chili flakes, fresh cherry tomatoes, and bell peppers. Served with garlic bread.',
    category: 'pasta_noodles',
    subcategory: 'pasta',
    tags: ['Pasta', 'Spicy', 'Served with Garlic Bread'],
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pansit Bihon Feast',
    price: 250,
    description: 'Traditional thin rice vermicelli noodles stir-fried with sautéed chicken, shrimps, wood ear mushrooms, and shredded vegetables. Good for 2.',
    category: 'pasta_noodles',
    subcategory: 'noodles',
    tags: ['Filipino Classic', 'Noodles', 'Good for 2'],
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pansit Canton',
    price: 250,
    description: 'Savory thick egg noodles stir-fried in garlic-soy seasoning with pork slices, small shrimps, cabbage, carrots, and sweet peas. Good for 2.',
    category: 'pasta_noodles',
    subcategory: 'noodles',
    tags: ['Filipino Classic', 'Noodles', 'Good for 2'],
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pansit Sotanghon',
    price: 250,
    description: 'Delicate clear bean thread cellophane glass noodles stir-fried with shredded chicken, toasted garlic, and wood ear mushrooms. Good for 2.',
    category: 'pasta_noodles',
    subcategory: 'noodles',
    tags: ['Filipino Classic', 'Noodles', 'Good for 2'],
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Mixed Pansit (Bihon & Canton)',
    price: 250,
    description: 'The best of both worlds—fine rice vermicelli and thick egg noodles stir-fried together with meats, seafood, and crispy vegetables. Good for 2.',
    category: 'pasta_noodles',
    subcategory: 'noodles',
    tags: ['Filipino Classic', 'Noodles', 'Good for 2', 'Popular'],
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80'
  },

  // SALADS AND SOUPS
  {
    name: 'Pasta with Balsamic Vinegar',
    price: 320,
    description: 'Chilled penne pasta salad tossed with fresh cherry tomatoes, baby arugula, sweet basil, and a generous splash of balsamic glaze.',
    category: 'salads_soups',
    subcategory: 'salads',
    tags: ['Salad', 'Vegetarian', 'Healthy'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Shrimp, Cobb, and Avocado Salad',
    price: 320,
    description: 'Plump grilled Cajun shrimps, creamy avocado wedges, sweet corn kernels, crispy bacon, boiled egg, and field greens with dressing.',
    category: 'salads_soups',
    subcategory: 'salads',
    tags: ['Salad', 'Seafood', 'Healthy', 'Popular'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Greens with Tuna',
    price: 290,
    description: 'Mixed field baby greens topped with premium flaked chunk tuna, olives, thin cucumber ribbons, and calamansi vinaigrette.',
    category: 'salads_soups',
    subcategory: 'salads',
    tags: ['Salad', 'Seafood', 'Healthy'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Greens with Grilled Chicken Breast',
    price: 290,
    description: 'Crisp field greens and sliced premium grilled chicken breast, fresh cucumbers, tomatoes, and house herb vinaigrette.',
    category: 'salads_soups',
    subcategory: 'salads',
    tags: ['Salad', 'Healthy', 'Chicken'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Ranch House Salad',
    price: 310,
    description: 'Crispy chopped romaine lettuce, cherry tomatoes, bacon bits, and sourdough croutons drenched in creamy ranch sauce.',
    category: 'salads_soups',
    subcategory: 'salads',
    tags: ['Salad'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Lentil Soup',
    price: 150,
    description: 'Comforting, protein-rich brown lentils slow-simmered with onions, carrots, and Mediterranean spices, finished with olive oil.',
    category: 'salads_soups',
    subcategory: 'soups',
    tags: ['Soup', 'Vegetarian', 'Healthy'],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pumpkin Cream Soup',
    price: 150,
    description: 'Velvety soup of roasted local sweet pumpkins puréed with cream and fresh sage, served warm with a hint of toasted seeds.',
    category: 'salads_soups',
    subcategory: 'soups',
    tags: ['Soup', 'Vegetarian'],
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Tomato Basil Soup',
    price: 150,
    description: 'Comforting roasted vine-ripened tomatoes puréed with fresh basil leaves, cream, and garlic olive oil. Served with a toasted bread wedge.',
    category: 'salads_soups',
    subcategory: 'soups',
    tags: ['Soup', 'Vegetarian'],
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=600&q=80'
  },

  // ADDONS
  {
    name: 'Plain Rice (1 Cup)',
    price: 35,
    description: 'Freshly steamed premium local white jasmine rice.',
    category: 'addons',
    tags: ['Add-on'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'Full Menu', icon: Utensils },
  { id: 'breakfast', name: 'Breakfasts', icon: Coffee },
  { id: 'international', name: 'International', icon: Globe },
  { id: 'mains', name: 'Main Courses', icon: Sparkles },
  { id: 'vegetables', name: 'Vegetables', icon: Leaf },
  { id: 'pasta_noodles', name: 'Pasta & Noodles', icon: Utensils },
  { id: 'salads_soups', name: 'Salads & Soups', icon: Soup },
  { id: 'addons', name: 'Add-ons', icon: Sparkles }
];

export default function Restaurant() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState<'all' | 'arabic' | 'malaysian' | 'beef' | 'pork' | 'chicken' | 'seafood' | 'pasta' | 'noodles' | 'salads' | 'soups'>('all');

  // Reservation Form State
  const [reservationName, setReservationName] = useState('');
  const [reservationEmail, setReservationEmail] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [reservationGuests, setReservationGuests] = useState('2');
  const [reservationSeating, setReservationSeating] = useState('Sunset Deck (Beachfront)');
  const [reservationOccasion, setReservationOccasion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Filter items based on category, subcategory and search query
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Subcategory filter (inside International, Mains, Pasta, Salads/Soups)
      if (
        selectedCategory === 'international' && 
        activeSubcategory !== 'all' && 
        item.subcategory !== activeSubcategory
      ) {
        return false;
      }
      if (
        selectedCategory === 'mains' && 
        activeSubcategory !== 'all' && 
        item.subcategory !== activeSubcategory
      ) {
        return false;
      }
      if (
        selectedCategory === 'pasta_noodles' && 
        activeSubcategory !== 'all' && 
        item.subcategory !== activeSubcategory
      ) {
        return false;
      }
      if (
        selectedCategory === 'salads_soups' && 
        activeSubcategory !== 'all' && 
        item.subcategory !== activeSubcategory
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [selectedCategory, activeSubcategory, searchQuery]);

  // Handle category changes and reset subcategories
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveSubcategory('all');
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API reservation request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitSuccess(true);
      // Reset form
      setReservationName('');
      setReservationEmail('');
      setReservationDate('');
      setReservationTime('');
      setReservationGuests('2');
      setReservationOccasion('');
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Premium Header */}
      <PageHeader
        title="Maranna Restaurant"
        subtitle="Experience world-class culinary mastery blending rich coastal Filipino flavors, traditional Arabic classics, and authentic Malaysian cuisine."
        category="Dining & Lounge"
        backgroundImageUrl="https://pyfjjniwiaqvalpwqkzg.supabase.co/storage/v1/object/public/Assets/473748832_122132546324567801_2877340831206792826_n.jpg"
        imageOpacity="opacity-70"
        objectPosition="object-[center_65%]"
      />

      {/* Brand & Narrative Block */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        <div className="lg:col-span-5 flex justify-center bg-[#0B1E36] rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Subtle gold sparks inside the logo card */}
          <div className="absolute top-4 right-4 text-[#E5BF71]/35 animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <MarannaLogo size="xl" withText={true} inverse={true} />
        </div>
        
        <div className="lg:col-span-7 space-y-6">
          <span className="font-sans text-xs uppercase font-bold tracking-[0.25em] text-sunset">
            Ocean Breeze Culinary Sanctuary
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal leading-tight">
            Traditional Heritage <br />
            <span className="text-coral">With An International Accent</span>
          </h2>
          <div className="h-1 w-20 bg-sunset rounded-full"></div>
          
          <p className="font-sans text-sm md:text-base text-gray-600 leading-relaxed">
            Welcome to <strong className="text-charcoal font-semibold">Maranna</strong>, a seaside culinary destination curated to serve resort guests and local connoisseurs alike. Overlooking the legendary La Union sunset, our kitchen prepares a rare convergence of three worlds: comforting northern Filipino delicacies, authentic fragrant Malaysian satays & curries, and sophisticated Arabic spiced rice dishes.
          </p>
          <p className="font-sans text-sm md:text-base text-gray-600 leading-relaxed">
            Every dish is prepared using fresh ocean catches pulled from San Juan’s coastlines, organic local vegetables, and genuine imported culinary spices. Start your day with our signature Silog breakfasts paired with <strong className="text-charcoal font-semibold">unlimited local Barako coffee</strong>, or dine in the breeze with a shared seafood platter as the sunset stains the beach.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <Clock className="w-5 h-5 text-sunset mb-2" />
              <span className="font-sans text-xs font-bold text-charcoal">Opening Hours</span>
              <span className="font-sans text-[10px] text-gray-500 mt-1">6:00 AM – 10:00 PM</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <Globe className="w-5 h-5 text-sunset mb-2" />
              <span className="font-sans text-xs font-bold text-charcoal">Cuisine Styles</span>
              <span className="font-sans text-[10px] text-gray-500 mt-1">Filipino, Arabic, Malaysian</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <MapPin className="w-5 h-5 text-sunset mb-2" />
              <span className="font-sans text-xs font-bold text-charcoal">Ambience</span>
              <span className="font-sans text-[10px] text-gray-500 mt-1">Al-Fresco Deck & Lounge</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <Coffee className="w-5 h-5 text-sunset mb-2" />
              <span className="font-sans text-xs font-bold text-charcoal">Special Perk</span>
              <span className="font-sans text-[10px] text-gray-500 mt-1">Unlimited Barako Coffee</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Menu Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-50/50 py-16 md:py-24 border-y border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Menu Intro */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="font-sans text-xs uppercase font-bold tracking-[0.2em] text-coral">
              Curated Dining Bill of Fare
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
              Explore Our Menus
            </h2>
            <p className="font-sans text-xs sm:text-sm text-gray-500">
              Browse through local seaside breakfast collections, rich traditional curries, high-heat stir-fried noodles, and ocean delicacies cooked to pristine standards.
            </p>
          </div>

          {/* Search and Categories Toolbar */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-md border border-slate-100 mb-8 space-y-4">
            {/* Search Input */}
            <div className="relative w-full max-w-lg mx-auto">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items (e.g., 'Rendang', 'Pusit', 'Biryani', 'Salad')..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sunset focus:bg-white text-sm transition-all text-charcoal placeholder-gray-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-sunset hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Main Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
              {CATEGORIES.map(category => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B1E36] text-[#E5BF71] shadow-lg shadow-blue-900/10'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* Subcategories (Conditional rendering based on category) */}
            <AnimatePresence mode="wait">
              {selectedCategory === 'international' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex justify-center gap-3 pt-2 border-t border-slate-100"
                >
                  {(['all', 'arabic', 'malaysian'] as const).map(sub => (
                    <button
                      key={sub}
                      onClick={() => setActiveSubcategory(sub)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        activeSubcategory === sub
                          ? 'bg-sunset text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {sub === 'all' ? 'All Styles' : sub}
                    </button>
                  ))}
                </motion.div>
              )}

              {selectedCategory === 'mains' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex justify-center gap-2 flex-wrap pt-2 border-t border-slate-100"
                >
                  {(['all', 'beef', 'pork', 'chicken', 'seafood'] as const).map(sub => (
                    <button
                      key={sub}
                      onClick={() => setActiveSubcategory(sub)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        activeSubcategory === sub
                          ? 'bg-sunset text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {sub === 'all' ? 'All Meats & Seafood' : sub}
                    </button>
                  ))}
                </motion.div>
              )}

              {selectedCategory === 'pasta_noodles' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex justify-center gap-3 pt-2 border-t border-slate-100"
                >
                  {(['all', 'pasta', 'noodles'] as const).map(sub => (
                    <button
                      key={sub}
                      onClick={() => setActiveSubcategory(sub)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        activeSubcategory === sub
                          ? 'bg-sunset text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {sub === 'all' ? 'All Pasta/Noodles' : sub}
                    </button>
                  ))}
                </motion.div>
              )}

              {selectedCategory === 'salads_soups' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex justify-center gap-3 pt-2 border-t border-slate-100"
                >
                  {(['all', 'salads', 'soups'] as const).map(sub => (
                    <button
                      key={sub}
                      onClick={() => setActiveSubcategory(sub)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        activeSubcategory === sub
                          ? 'bg-sunset text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {sub === 'all' ? 'All Salads & Soups' : sub}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu Items Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  {/* Photo Frame */}
                  <div className="relative h-48 overflow-hidden bg-slate-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    
                    {/* Floating Price Tag */}
                    <div className="absolute bottom-4 right-4 bg-[#0B1E36] border border-[#E5BF71]/35 px-4 py-1.5 rounded-full text-xs font-bold text-[#E5BF71] font-sans shadow-md">
                      ₱{item.price}
                    </div>

                    {/* Category Label */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold text-charcoal">
                      {item.category.replace('_', ' & ')}
                    </div>
                  </div>

                  {/* Details Frame */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-serif text-lg font-bold text-charcoal leading-snug group-hover:text-sunset transition-colors">
                        {item.name}
                      </h3>
                      <p className="font-sans text-xs text-gray-500 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Tags block */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-50 mt-4">
                      {item.tags?.map(tag => (
                        <span 
                          key={tag}
                          className="bg-slate-50 text-slate-500 border border-slate-100 rounded-full px-2 py-0.5 text-[9px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty state */}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-16 text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-slate-100 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal">No Dishes Found</h3>
                <p className="font-sans text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't find any dishes matching "{searchQuery}". Try selecting a different category or refining your query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setActiveSubcategory('all');
                  }}
                  className="px-5 py-2 rounded-full bg-sunset text-white text-xs font-bold uppercase tracking-wider hover:bg-sunset/90 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </motion.div>
          
          {/* Note about coffee */}
          <div className="mt-12 p-5 rounded-3xl bg-[#0B1E36]/5 border border-slate-100 max-w-2xl mx-auto flex gap-4 items-center">
            <Coffee className="w-8 h-8 text-sunset shrink-0" />
            <div className="font-sans text-xs text-slate-600 leading-relaxed">
              <strong className="text-charcoal block mb-0.5 font-bold">Uncapped Local Barako Coffee</strong>
              All breakfast orders automatically include unlimited servings of our rich, organic, locally sourced Barako drip coffee roasted in the Highlands of La Union.
            </div>
          </div>

        </div>
      </motion.section>

      {/* Reservation Section */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#0B1E36] rounded-[40px] overflow-hidden shadow-2xl border border-white/5 relative">
          
          {/* Ambient Design Details */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-sunset opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-coral opacity-10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Left: Interactive Reservation Summary */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between text-white relative z-10">
            <div className="space-y-6">
              <span className="font-sans text-xs uppercase font-bold tracking-[0.25em] text-[#E5BF71]">
                Book An Experience
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Secure Your <br />
                <span className="text-[#E5BF71]">Sunset Deck Table</span>
              </h2>
              <div className="h-1 w-16 bg-[#E5BF71] rounded-full"></div>
              
              <p className="font-sans text-sm text-blue-100/85 leading-relaxed">
                Tables on our elevated beachfront deck are highly coveted, especially between 5:00 PM and 7:00 PM as the legendary San Juan sunset sets over the ocean.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-4 h-4 text-[#E5BF71] shrink-0 mt-0.5" />
                  <span className="font-sans text-xs text-blue-100/90">First-row seaside tables are prioritized for early bookings.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-4 h-4 text-[#E5BF71] shrink-0 mt-0.5" />
                  <span className="font-sans text-xs text-blue-100/90">Special arrangements can be made for birthdays, proposals, and surf parties.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-4 h-4 text-[#E5BF71] shrink-0 mt-0.5" />
                  <span className="font-sans text-xs text-blue-100/90">No deposit required. Table reservations will be held for 15 minutes.</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 mt-8 lg:mt-0">
              <span className="font-sans text-[10px] text-blue-200/60 uppercase tracking-widest block">For Immediate Help</span>
              <span className="font-sans text-md font-bold text-[#E5BF71] block mt-1">+63 917 123 4567</span>
              <span className="font-sans text-[10px] text-blue-200/80 mt-0.5 block">dining@oceanbreezelu.com</span>
            </div>
          </div>

          {/* Right: Reservation Form */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-lg p-8 sm:p-12 lg:p-16 border-l border-white/5 flex flex-col justify-center relative z-10">
            
            <AnimatePresence mode="wait">
              {!isSubmitSuccess ? (
                <motion.form
                  key="reservation-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleReservationSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-wider text-blue-200/90">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={reservationName}
                        onChange={(e) => setReservationName(e.target.value)}
                        placeholder="Benyamin Namt_..."
                        className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-sans placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#E5BF71] focus:bg-white/15"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-wider text-blue-200/90">Email Address</label>
                      <input
                        type="email"
                        required
                        value={reservationEmail}
                        onChange={(e) => setReservationEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-sans placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#E5BF71] focus:bg-white/15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-wider text-blue-200/90">Choose Date</label>
                      <input
                        type="date"
                        required
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#E5BF71] focus:bg-white/15 color-scheme-dark"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-wider text-blue-200/90">Preferred Time</label>
                      <input
                        type="time"
                        required
                        value={reservationTime}
                        onChange={(e) => setReservationTime(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#E5BF71] focus:bg-white/15 color-scheme-dark"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-wider text-blue-200/90">Number of Guests</label>
                      <div className="relative">
                        <select
                          value={reservationGuests}
                          onChange={(e) => setReservationGuests(e.target.value)}
                          className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-sans appearance-none focus:outline-none focus:ring-2 focus:ring-[#E5BF71] focus:bg-white/15 cursor-pointer"
                        >
                          <option value="1" className="text-charcoal bg-white">1 Guest</option>
                          <option value="2" className="text-charcoal bg-white">2 Guests</option>
                          <option value="4" className="text-charcoal bg-white">4 Guests</option>
                          <option value="6" className="text-charcoal bg-white">6 Guests</option>
                          <option value="8" className="text-charcoal bg-white">8+ Guests (Group)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-white/50 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-wider text-blue-200/90">Seating Area</label>
                      <div className="relative">
                        <select
                          value={reservationSeating}
                          onChange={(e) => setReservationSeating(e.target.value)}
                          className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-sans appearance-none focus:outline-none focus:ring-2 focus:ring-[#E5BF71] focus:bg-white/15 cursor-pointer"
                        >
                          <option value="Sunset Deck (Beachfront)" className="text-charcoal bg-white">Sunset Deck (Beachfront)</option>
                          <option value="Poolside Terrace" className="text-charcoal bg-white">Poolside Terrace</option>
                          <option value="Indoor AC Sanctuary" className="text-charcoal bg-white">Indoor AC Sanctuary</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-white/50 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-sans text-[10px] uppercase font-bold tracking-wider text-blue-200/90">Special Celebrations / Occasions (Optional)</label>
                    <input
                      type="text"
                      value={reservationOccasion}
                      onChange={(e) => setReservationOccasion(e.target.value)}
                      placeholder="e.g., Honeymoon Dinner, Anniversary, Birthday cake surprise..."
                      className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-sans placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#E5BF71] focus:bg-white/15"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-[#E5BF71] hover:bg-[#F2D491] text-[#0B1E36] font-sans text-xs font-bold uppercase tracking-wider shadow-xl shadow-amber-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-[#0B1E36] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Request Table Reservation
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="reservation-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-[#E5BF71]/10 border border-[#E5BF71]/30 flex items-center justify-center text-[#E5BF71] mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">Table Request Received!</h3>
                    <p className="font-sans text-xs text-blue-100/80 max-w-sm mx-auto leading-relaxed">
                      Thank you for choosing Maranna, our culinary concierge is verifying availability and will send a confirmation email with your reservation code shortly.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsSubmitSuccess(false)}
                    className="px-6 py-2.5 rounded-full border border-white/20 text-white font-sans text-[11px] font-bold uppercase tracking-wider hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Reserve Another Table
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </motion.section>

    </div>
  );
}
