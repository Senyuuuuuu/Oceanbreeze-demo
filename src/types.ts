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
  discounts?: number; // percentage discount (e.g. 10 for 10%)
  seasonalPricing?: { season: string; price: number; start: string; end: string }[];
  disabled?: boolean;
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
  avatar?: string;
}

export type StaffRole = 'Owner' | 'Manager' | 'Receptionist' | 'Housekeeping';

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  phone: string;
  avatar?: string;
  enabled: boolean;
  password?: string;
}

export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingHistory: string[]; // booking IDs
  totalStays: number;
  totalSpending: number;
  preferredRoom: string;
  notes?: string;
  specialRequests?: string;
}

export interface ReviewItem {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  reply?: string;
  hidden: boolean;
  date: string;
  ownerResponse?: string;
  status?: 'Approved' | 'Pending' | 'Flagged';
  featured?: boolean;
  checkInMonth?: string;
  timestamp?: string;
}

export type HousekeepingStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Ready' | 'Maintenance' | 'Out of Service' | 'Dirty';

export interface RoomStatusItem {
  id: string; // e.g. "101", "201", etc.
  roomNumber: string;
  roomType: string; // id matching deluxe, sunset, family, surfer
  housekeepingStatus: HousekeepingStatus;
  lastUpdated: string;
  assignedHousekeeper?: string;
  lastCleaned?: string;
  notes?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking_new' | 'booking_cancel' | 'payment' | 'checkin' | 'checkout' | 'low_availability' | 'maintenance';
  read: boolean;
  timestamp: string;
}

export interface HotelInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxes: number; // percentage
  serviceFees: number; // absolute or percentage
  cancellationPolicy: string;
  bookingRules: string;
}
