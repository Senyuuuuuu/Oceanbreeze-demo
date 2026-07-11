export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: string;
  size: string;
  bedType: string;
  price: number;
  image: string;
  amenities: string[];
  featured: boolean;
  view: string;
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  iconName: string; // matches lucide icon name
}

export interface GalleryItem {
  id: string;
  url: string;
  category: 'rooms' | 'beach' | 'pool' | 'events' | 'sunset';
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}
