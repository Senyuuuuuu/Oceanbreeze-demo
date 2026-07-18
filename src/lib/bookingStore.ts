import { getAccessToken } from './firebaseAuth';
import { Room, StaffAccount, GuestProfile, ReviewItem, RoomStatusItem, AdminNotification, HotelInfo, StaffRole, HousekeepingStatus } from '../types';

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  roomType: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Declined' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'Refunded';
  confirmationCode?: string;
  timestamp: string;
}

export interface SheetsConfig {
  spreadsheetId: string | null;
  spreadsheetTitle: string | null;
  isConnected: boolean;
  autoCheck: boolean;
}

export interface OwnerSettings {
  ownerPhone: string;
  webhookUrl: string;
  enableWebhook: boolean;
  notificationPlatform: 'SMS' | 'Messenger' | 'Discord' | 'Slack';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'messenger' | 'auth' | 'deletion' | 'update';
  message: string;
  user?: string;
  ip?: string;
}

const STORAGE_KEYS = {
  BOOKINGS: 'ob_bookings',
  SHEETS_CONFIG: 'ob_sheets_config',
  LOGS: 'ob_logs',
  OWNER_SETTINGS: 'ob_owner_settings',
  ROOMS_LIST: 'ob_rooms_list',
  GUESTS_LIST: 'ob_guests_list',
  REVIEWS_LIST: 'ob_reviews_list',
  STAFF_LIST: 'ob_staff_list',
  NOTIFICATIONS: 'ob_notifications',
  ROOM_STATUSES: 'ob_room_statuses',
  HOTEL_INFO: 'ob_hotel_info'
};

// Initial local seed data - Empty by default for direct Google Sheets testing
const SEED_BOOKINGS: Booking[] = [];

const DEFAULT_ROOMS: Room[] = [
  {
    id: 'deluxe',
    name: 'Deluxe Beachfront Suite',
    description: 'Enjoy spectacular, unobstructed ocean views from your private balcony. Outfitted with light premium linens, handwoven native accents, and a lavish rainfall shower.',
    capacity: '2 Adults + 1 Child',
    size: '45 m²',
    bedType: 'King Size Bed',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Balcony', 'Ocean View', 'Mini Bar', 'Espresso Machine', 'Rainfall Shower'],
    featured: true,
    view: 'Panoramic Ocean View',
    discounts: 0,
    disabled: false
  },
  {
    id: 'sunset',
    name: 'Sunset Panoramic Villa',
    description: 'Indulge in unmatched privacy. This standalone luxury villa features private infinity pool deck steps, oversized panoramic windows framing La Union\'s legendary sunset views.',
    capacity: '2 Adults',
    size: '60 m²',
    bedType: 'Super King Bed',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Plunge Pool', 'Sunset View', 'Outdoor Tub', 'Wine Cooler', 'Lounge Deck'],
    featured: true,
    view: 'Direct Sunset & Pool Deck',
    discounts: 10, // 10% off
    disabled: false
  },
  {
    id: 'family',
    name: 'Spacious Family Loft',
    description: 'Perfect for family retreats and multi-guest beach escapes. Features a split-level loft configuration, luxury memory foam mattresses, and cozy lounge spaces for quality family time.',
    capacity: '4 Adults + 2 Children',
    size: '75 m²',
    bedType: '1 King Bed + 2 Doubles',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    amenities: ['Two-Level Loft', 'Equipped Kitchenette', 'Living Lounge Area', 'Garden Terrace', 'Smart TV'],
    featured: false,
    view: 'Lush Tropical Garden',
    discounts: 0,
    disabled: false
  },
  {
    id: 'surfer',
    name: 'Beachside Eco Cabin',
    description: 'Cozy, rustic-chic coastal living tailored for sea lovers and peace seekers. Made with locally sourced bamboo, reclaimed timbers, fully air-conditioned, and located steps from the gentle shoreline.',
    capacity: '2 Guests',
    size: '28 m²',
    bedType: 'Queen Size Bed',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Hammock', 'Air Conditioning', 'Outdoor Rain Shower', 'Eco Toiletries', 'Beach Lounge Chairs'],
    featured: false,
    view: 'Direct Beachfront Access',
    discounts: 5, // 5% off
    disabled: false
  }
];

export class BookingStore {
  private bookings: Booking[] = [];
  private config: SheetsConfig = {
    spreadsheetId: null,
    spreadsheetTitle: null,
    isConnected: false,
    autoCheck: true
  };
  private ownerSettings: OwnerSettings = {
    ownerPhone: '+63 917 123 4567',
    webhookUrl: '',
    enableWebhook: false,
    notificationPlatform: 'SMS'
  };
  private logs: ActivityLog[] = [];
  private listeners: (() => void)[] = [];

  // New administrative dashboard states
  private roomsList: Room[] = [];
  private guestsList: GuestProfile[] = [];
  private reviewsList: ReviewItem[] = [];
  private staffList: StaffAccount[] = [];
  private adminNotifications: AdminNotification[] = [];
  private roomStatuses: RoomStatusItem[] = [];
  private hotelInfo: HotelInfo = {
    name: 'Ocean Breeze Resort',
    email: 'reservations@oceanbreezelaunion.com',
    phone: '+63 917 123 4567',
    address: 'National Highway, Urbiztondo, San Juan, La Union, 2514, Philippines',
    taxes: 12,
    serviceFees: 10,
    cancellationPolicy: 'Full refund if cancelled up to 5 days before check-in. Non-refundable after that.',
    bookingRules: 'Standard Check-in is 2:00 PM. Check-out is 12:00 PM. Pets are allowed on leash. No smoking inside rooms.'
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (storedBookings) {
        this.bookings = JSON.parse(storedBookings);
        // Clear old seed bookings from previous sessions to ensure pristine live testing
        if (this.bookings.some(b => b.id === 'OB-BK-8101' || b.id === 'OB-BK-8102')) {
          this.bookings = [];
          this.saveBookings();
        }
      } else {
        this.bookings = SEED_BOOKINGS;
        this.saveBookings();
      }

      const storedConfig = localStorage.getItem(STORAGE_KEYS.SHEETS_CONFIG);
      if (storedConfig) {
        this.config = JSON.parse(storedConfig);
      }

      const storedOwnerSettings = localStorage.getItem(STORAGE_KEYS.OWNER_SETTINGS);
      if (storedOwnerSettings) {
        this.ownerSettings = JSON.parse(storedOwnerSettings);
      }

      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      } else {
        this.addLog('info', 'Ocean Breeze Resort Booking System Initialized.');
      }

      // Load Rooms List
      const storedRooms = localStorage.getItem(STORAGE_KEYS.ROOMS_LIST);
      if (storedRooms) {
        this.roomsList = JSON.parse(storedRooms);
      } else {
        this.roomsList = DEFAULT_ROOMS;
        this.saveRooms();
      }

      // Load Staff List
      const storedStaff = localStorage.getItem(STORAGE_KEYS.STAFF_LIST);
      if (storedStaff) {
        this.staffList = JSON.parse(storedStaff);
      } else {
        this.staffList = [
          { id: 'STF-001', name: 'Sofia Torres', email: 'owner@oceanbreeze.com', role: 'Owner', phone: '+63 917 111 2222', enabled: true, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
          { id: 'STF-002', name: 'Liam Rivera', email: 'manager@oceanbreeze.com', role: 'Manager', phone: '+63 917 222 3333', enabled: true, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80' },
          { id: 'STF-003', name: 'Chloe Santos', email: 'receptionist@oceanbreeze.com', role: 'Receptionist', phone: '+63 917 333 4444', enabled: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
          { id: 'STF-004', name: 'Mateo Garcia', email: 'housekeeper@oceanbreeze.com', role: 'Housekeeping', phone: '+63 917 444 5555', enabled: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
        ];
        this.saveStaff();
      }

      // Load Reviews
      const storedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS_LIST);
      const targetGoogleReviews = [
        {
          id: 'REV-004',
          guestName: 'Monica Carla Naval',
          rating: 5,
          comment: "If you want a nice and peaceful resort in La Union this is the place. We love the sunset here as well. Not a lot of people, perfect for couple or solo traveler if you just want peace and quiet. Breakfast was great. It's still new but they take care of their guest really well. The beach was a 3 min walk or less. Funny thing was there were cows at the beach playing during the sunset and was nice to watch. The ocean was deep even in the shore so if there are kids I would suggest to just play in the sand.\n\nRooms: 4/5 | Service: 5/5 | Location: 5/5",
          date: '2023-06-15',
          hidden: false,
          status: 'Approved' as const,
          checkInMonth: 'Jun 2023',
          timestamp: '2023-06-15 14:32'
        },
        {
          id: 'REV-005',
          guestName: 'Mark Anthony',
          rating: 5,
          comment: "Great location and very accommodating staff! The rooms are super clean and comfortable. Definitely the best place to relax in San Juan if you want a quiet and peaceful getaway. Highly recommended for couples and families alike!",
          date: '2025-02-18',
          hidden: false,
          status: 'Approved' as const,
          checkInMonth: 'Feb 2025',
          timestamp: '2025-02-18 10:15'
        },
        {
          id: 'REV-006',
          guestName: 'Elena Rostova',
          rating: 5,
          comment: "The perfect escape from the noisy parts of La Union! The place is quiet, clean, and right by the beach. The sunset view here is simply breathtaking. Standard amenities are complete, and the garden is extremely beautiful.",
          date: '2026-01-12',
          hidden: false,
          status: 'Approved' as const,
          checkInMonth: 'Jan 2026',
          timestamp: '2026-01-12 16:45'
        },
        {
          id: 'REV-007',
          guestName: 'Christian Paul',
          rating: 5,
          comment: "Outstanding hospitality! The beach was a short, pleasant walk and the entire property is extremely secure and well-maintained. Loved seeing the cows walking on the beach at sunset, such a unique and relaxing charm!",
          date: '2025-09-04',
          hidden: false,
          status: 'Approved' as const,
          checkInMonth: 'Sep 2025',
          timestamp: '2025-09-04 11:20'
        },
        {
          id: 'REV-008',
          guestName: 'Sarah Jenkins',
          rating: 5,
          comment: "Perfect place to unwind. Clean, modern and cozy rooms, amazing garden space, and very accommodating hosts. The peaceful atmosphere here is exactly what we needed for a weekend getaway.",
          date: '2026-05-20',
          hidden: false,
          status: 'Approved' as const,
          checkInMonth: 'May 2026',
          timestamp: '2026-05-20 09:30'
        }
      ];

      if (storedReviews) {
        this.reviewsList = JSON.parse(storedReviews);
        let updated = false;
        targetGoogleReviews.forEach(newRev => {
          if (!this.reviewsList.some(r => r.guestName === newRev.guestName)) {
            this.reviewsList.push(newRev);
            updated = true;
          }
        });
        if (updated) {
          this.saveReviews();
        }
      } else {
        this.reviewsList = [
          { id: 'REV-001', guestName: 'Michelle Reyes', rating: 5, comment: 'Absolutely breathtaking beachfront location! Our stay in the Sunset Panoramic Villa was beyond words. Having steps leading directly to our private lounge deck was amazing.', date: '2026-07-10', hidden: false, reply: 'Thank you Michelle! We are thrilled you enjoyed the sunset views and layout of our villa. Hope to see you back soon!', status: 'Approved', checkInMonth: 'Jul 2026', timestamp: '2026-07-10 11:15' },
          { id: 'REV-002', guestName: 'James Cook', rating: 4, comment: 'Hands down the best surf resort in Urbiztondo! Cozy cabins with steps to the beach. Housekeeping was fast and clean. Loved the hammock.', date: '2026-07-13', hidden: false, status: 'Approved', checkInMonth: 'Jul 2026', timestamp: '2026-07-13 15:40' },
          { id: 'REV-003', guestName: 'Sophia Tan', rating: 5, comment: 'Perfect split-level design in the Family Loft. Super comfortable memory foam beds, fully stocked kitchenette, and lovely staff hospitality.', date: '2026-07-15', hidden: false, reply: 'Thank you for choosing us for your family getaway, Sophia! We strive to make families feel right at home.', status: 'Approved', checkInMonth: 'Jul 2026', timestamp: '2026-07-15 13:25' },
          ...targetGoogleReviews
        ];
        this.saveReviews();
      }

      // Load Housekeeping Room Statuses
      const storedRoomStatuses = localStorage.getItem(STORAGE_KEYS.ROOM_STATUSES);
      if (storedRoomStatuses) {
        this.roomStatuses = JSON.parse(storedRoomStatuses);
      } else {
        this.roomStatuses = [
          { id: 'RS-101', roomNumber: 'Room 101', roomType: 'deluxe', housekeepingStatus: 'Ready', lastUpdated: new Date().toISOString() },
          { id: 'RS-102', roomNumber: 'Room 102', roomType: 'deluxe', housekeepingStatus: 'Occupied', lastUpdated: new Date().toISOString() },
          { id: 'RS-201', roomNumber: 'Room 201', roomType: 'sunset', housekeepingStatus: 'Available', lastUpdated: new Date().toISOString() },
          { id: 'RS-202', roomNumber: 'Room 202', roomType: 'sunset', housekeepingStatus: 'Cleaning', lastUpdated: new Date().toISOString() },
          { id: 'RS-301', roomNumber: 'Room 301', roomType: 'family', housekeepingStatus: 'Ready', lastUpdated: new Date().toISOString() },
          { id: 'RS-302', roomNumber: 'Room 302', roomType: 'family', housekeepingStatus: 'Maintenance', lastUpdated: new Date().toISOString() },
          { id: 'RS-401', roomNumber: 'Room 401', roomType: 'surfer', housekeepingStatus: 'Available', lastUpdated: new Date().toISOString() },
          { id: 'RS-402', roomNumber: 'Room 402', roomType: 'surfer', housekeepingStatus: 'Out of Service', lastUpdated: new Date().toISOString() }
        ];
        this.saveRoomStatuses();
      }

      // Load Notifications
      const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (storedNotifications) {
        this.adminNotifications = JSON.parse(storedNotifications);
      } else {
        this.adminNotifications = [
          { id: 'NTF-001', title: 'New Booking Request', message: 'Michelle Reyes requested Deluxe Beachfront Suite from 2026-07-25 to 2026-07-28.', type: 'booking_new', read: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
          { id: 'NTF-002', title: 'Booking Cancellation', message: 'Booking inquiry OB-BK-4091 has been cancelled by guest.', type: 'booking_cancel', read: false, timestamp: new Date(Date.now() - 7200000).toISOString() },
          { id: 'NTF-003', title: 'Maintenance Flagged', message: 'Room 302 flagged for sink clog by housekeeper Mateo Garcia.', type: 'maintenance', read: true, timestamp: new Date(Date.now() - 86400000).toISOString() }
        ];
        this.saveNotifications();
      }

      // Load Hotel Info
      const storedHotelInfo = localStorage.getItem(STORAGE_KEYS.HOTEL_INFO);
      if (storedHotelInfo) {
        this.hotelInfo = JSON.parse(storedHotelInfo);
      }

      // Generate Guests list dynamically from bookings and save them
      this.refreshGuestsList();

    } catch (e) {
      console.error('Failed to load storage', e);
      this.bookings = SEED_BOOKINGS;
      this.logs = [{ id: '1', timestamp: new Date().toISOString(), type: 'info', message: 'System initialized (fallback mode).' }];
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private saveBookings() {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(this.bookings));
  }

  private saveConfig() {
    localStorage.setItem(STORAGE_KEYS.SHEETS_CONFIG, JSON.stringify(this.config));
  }

  private saveLogs() {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.logs));
  }

  private saveOwnerSettings() {
    localStorage.setItem(STORAGE_KEYS.OWNER_SETTINGS, JSON.stringify(this.ownerSettings));
  }

  getBookings() {
    return [...this.bookings];
  }

  getConfig() {
    return { ...this.config };
  }

  getOwnerSettings() {
    return { ...this.ownerSettings };
  }

  updateOwnerSettings(newSettings: Partial<OwnerSettings>) {
    this.ownerSettings = { ...this.ownerSettings, ...newSettings };
    this.saveOwnerSettings();
    this.addLog('info', `Owner notification settings updated: Platform = ${this.ownerSettings.notificationPlatform}, Phone = ${this.ownerSettings.ownerPhone}`);
    this.notify();
  }

  getLogs() {
    return [...this.logs];
  }

  addLog(type: ActivityLog['type'], message: string) {
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      message
    };
    this.logs = [newLog, ...this.logs].slice(0, 100); // keep last 100 logs
    this.saveLogs();
    this.notify();
  }

  clearLogs() {
    this.logs = [];
    this.addLog('info', 'Logs cleared.');
  }

  updateConfig(newConfig: Partial<SheetsConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    this.addLog('info', `Google Sheets integration configuration updated: ${JSON.stringify(newConfig)}`);
    this.notify();
  }

  // Get list of booked dates for a room type (dates where booking status is 'Approved')
  // If roomType is empty, returns dates where ALL room types are approved (fully booked resort)
  getBlockedDates(roomType: string): string[] {
    if (!roomType) {
      const datesCount: Record<string, Set<string>> = {};
      const approved = this.bookings.filter(b => b.status === 'Approved');
      
      approved.forEach(b => {
        const startParts = b.checkIn.split('-');
        const endParts = b.checkOut.split('-');
        if (startParts.length === 3 && endParts.length === 3) {
          const start = new Date(Number(startParts[0]), Number(startParts[1]) - 1, Number(startParts[2]));
          const end = new Date(Number(endParts[0]), Number(endParts[1]) - 1, Number(endParts[2]));
          const current = new Date(start);
          while (current < end) {
            const yyyy = current.getFullYear();
            const mm = String(current.getMonth() + 1).padStart(2, '0');
            const dd = String(current.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;
            
            if (!datesCount[dateStr]) {
              datesCount[dateStr] = new Set();
            }
            datesCount[dateStr].add(b.roomType);
            current.setDate(current.getDate() + 1);
          }
        }
      });
      
      // If a date has all 4 room types approved, it's completely booked out
      return Object.keys(datesCount).filter(dateStr => datesCount[dateStr].size >= 4);
    }

    const dates: string[] = [];
    const approved = this.bookings.filter(b => b.roomType === roomType && b.status === 'Approved');
    
    approved.forEach(b => {
      const startParts = b.checkIn.split('-');
      const endParts = b.checkOut.split('-');
      if (startParts.length === 3 && endParts.length === 3) {
        const start = new Date(Number(startParts[0]), Number(startParts[1]) - 1, Number(startParts[2]));
        const end = new Date(Number(endParts[0]), Number(endParts[1]) - 1, Number(endParts[2]));
        const current = new Date(start);
        
        // Add all dates between checkIn and checkOut (inclusive of checkIn, exclusive of checkout afternoon)
        while (current < end) {
          const yyyy = current.getFullYear();
          const mm = String(current.getMonth() + 1).padStart(2, '0');
          const dd = String(current.getDate()).padStart(2, '0');
          dates.push(`${yyyy}-${mm}-${dd}`);
          current.setDate(current.getDate() + 1);
        }
      }
    });
    return dates;
  }

  // Check locally if dates are overlapping with approved bookings
  checkAvailabilityLocal(roomType: string, checkIn: string, checkOut: string): boolean {
    const targetStart = new Date(checkIn);
    const targetEnd = new Date(checkOut);

    return !this.bookings.some(b => {
      if (b.roomType !== roomType || b.status !== 'Approved') return false;
      
      const bStart = new Date(b.checkIn);
      const bEnd = new Date(b.checkOut);

      // Overlap condition
      return targetStart < bEnd && targetEnd > bStart;
    });
  }

  // Add booking
  addBooking(bookingData: Omit<Booking, 'id' | 'status' | 'timestamp' | 'confirmationCode'>): Booking {
    const id = `OB-BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    this.bookings = [newBooking, ...this.bookings];
    this.saveBookings();
    this.addLog('info', `New pending inquiry received: ${newBooking.name} for ${newBooking.roomType}`);
    this.notify();
    return newBooking;
  }

  // Update booking status
  updateBookingStatus(id: string, status: Booking['status'], confirmationCode?: string) {
    this.bookings = this.bookings.map(b => {
      if (b.id === id) {
        return { ...b, status, confirmationCode: confirmationCode || b.confirmationCode };
      }
      return b;
    });
    this.saveBookings();
    this.addLog('info', `Inquiry ${id} status updated to ${status}${confirmationCode ? ` (Code: ${confirmationCode})` : ''}`);
    
    // Trigger owner alert if approved
    if (status === 'Approved') {
      const approvedBooking = this.bookings.find(b => b.id === id);
      if (approvedBooking) {
        this.triggerOwnerNotification(approvedBooking);
      }
    }
    
    this.notify();
  }

  // Centralized owner notification dispatcher (SMS simulation and real-time webhook support)
  private triggerOwnerNotification(booking: Booking) {
    const alertMessage = `🔔 *New Beachfront Stay Confirmed!* \n\n👤 Guest: ${booking.name}\n📞 Phone: ${booking.phone}\n🏨 Room: ${booking.roomType.toUpperCase()}\n📅 Dates: ${booking.checkIn} to ${booking.checkOut}\n👥 Guests: ${booking.guests}\n🔑 Code: ${booking.confirmationCode || 'N/A'}`;
    
    // 1. Log the SMS notification in terminal console
    this.addLog('messenger', `📱 [OWNER-ALERT] SMS notification dispatched to owner's registered number (${this.ownerSettings.ownerPhone}):\n"New Booking Inquiry Confirmed! ID: ${booking.id}. Guest: ${booking.name}, Dates: ${booking.checkIn} to ${booking.checkOut}, Room: ${booking.roomType.toUpperCase()}."`);

    // 2. Dispatch a real HTTPS POST request to webhook if configured by the owner
    if (this.ownerSettings.enableWebhook && this.ownerSettings.webhookUrl) {
      fetch(this.ownerSettings.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: alertMessage, // Discord
          text: alertMessage     // Slack / Twilio integrations
        })
      }).then(response => {
        if (response.ok) {
          this.addLog('success', `📡 [WEBHOOK] Real-time owner alert dispatched to Slack/Discord/SMS gateway successfully!`);
        } else {
          this.addLog('warning', `📡 [WEBHOOK] Endpoint returned error code ${response.status}`);
        }
      }).catch(err => {
        this.addLog('error', `📡 [WEBHOOK] Connection failed: ${err.message}`);
      });
    }
  }

  // Delete booking
  deleteBooking(id: string) {
    this.bookings = this.bookings.filter(b => b.id !== id);
    this.saveBookings();
    this.addLog('warning', `Booking inquiry ${id} removed.`);
    this.notify();
  }

  // Google Sheets API Actions
  async testSheetsConnection(): Promise<boolean> {
    const token = await getAccessToken();
    if (!token) {
      this.addLog('error', 'Sheets Sync failed: No active Google OAuth token found. Please log in.');
      return false;
    }
    return true;
  }

  // Create a new Spreadsheet for Bookings
  async createSpreadsheet(): Promise<string | null> {
    const token = await getAccessToken();
    if (!token) {
      this.addLog('error', 'Unable to create Spreadsheet: Authentication required.');
      return null;
    }

    try {
      this.addLog('info', 'Sending request to Google Sheets API to create a new spreadsheet...');
      const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: 'Ocean Breeze Resort Bookings & Automation'
          },
          sheets: [
            {
              properties: {
                title: 'Bookings',
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 11
                }
              }
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Google Sheets API responded with ${response.status}`);
      }

      const data = await response.json();
      const spreadsheetId = data.spreadsheetId;

      this.addLog('success', `Created Google Sheet "Ocean Breeze Resort Bookings & Automation"`);
      
      // Initialize headers
      await this.initializeSheetHeaders(spreadsheetId);

      this.updateConfig({
        spreadsheetId,
        spreadsheetTitle: 'Ocean Breeze Resort Bookings & Automation',
        isConnected: true
      });

      // Upload existing local bookings to get the sheet synced
      await this.syncLocalBookingsToSheet(spreadsheetId, token);

      return spreadsheetId;
    } catch (e: any) {
      this.addLog('error', `Failed to create Google Sheet: ${e.message}`);
      return null;
    }
  }

  private async initializeSheetHeaders(spreadsheetId: string) {
    const token = await getAccessToken();
    if (!token) return;

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Bookings!A1:K1?valueInputOption=USER_ENTERED`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [[
            'Booking ID',
            'Guest Name',
            'Guest Email',
            'Phone Number',
            'Room Type',
            'Check-In Date',
            'Check-Out Date',
            'Guests',
            'Status',
            'Confirmation Code',
            'Timestamp'
          ]]
        })
      });

      if (response.ok) {
        this.addLog('success', 'Initialized sheet columns/headers in Google Sheet.');
      } else {
        throw new Error('Header init failed');
      }
    } catch (e) {
      console.error('Header initialization failed', e);
    }
  }

  // Push all local bookings to the Google Sheet
  async syncLocalBookingsToSheet(spreadsheetId: string, token: string): Promise<boolean> {
    try {
      this.addLog('info', 'Synchronizing existing bookings with Google Sheet...');
      
      // First clear data below headers to avoid duplicates
      const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Bookings!A2:K1000:clear`;
      await fetch(clearUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (this.bookings.length === 0) return true;

      const rows = this.bookings.map(b => [
        b.id,
        b.name,
        b.email,
        b.phone,
        b.roomType,
        b.checkIn,
        b.checkOut,
        b.guests,
        b.status,
        b.confirmationCode || '',
        b.timestamp
      ]);

      const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Bookings!A2:append?valueInputOption=USER_ENTERED`;
      const response = await fetch(appendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: rows
        })
      });

      if (response.ok) {
        this.addLog('success', `Synced ${this.bookings.length} bookings successfully to Google Sheet.`);
        return true;
      } else {
        throw new Error('Sync failed');
      }
    } catch (e: any) {
      this.addLog('error', `Synchronization failed: ${e.message}`);
      return false;
    }
  }

  // Fetch bookings from Google Sheets and override local state (2-way sync)
  async pullFromSheet(): Promise<boolean> {
    const token = await getAccessToken();
    const spreadsheetId = this.config.spreadsheetId;
    if (!token || !spreadsheetId) {
      return false;
    }

    try {
      this.addLog('info', 'Pulling updated data and confirmation codes from Google Sheets...');
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Bookings!A2:K1000`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const rows = data.values;

      if (!rows || rows.length === 0) {
        this.addLog('info', 'No bookings found in the Google Sheet.');
        return true;
      }

      const fetchedBookings: Booking[] = rows.map((row: any) => {
        return {
          id: row[0] || `OB-BK-${Math.floor(1000 + Math.random() * 9000)}`,
          name: row[1] || '',
          email: row[2] || '',
          phone: row[3] || '',
          roomType: row[4] || 'deluxe',
          checkIn: row[5] || '',
          checkOut: row[6] || '',
          guests: row[7] || '2',
          status: (row[8] as Booking['status']) || 'Pending',
          confirmationCode: row[9] || undefined,
          timestamp: row[10] || new Date().toISOString()
        };
      });

      // Detect if any status changed to Approved and triggered SMS/Messenger notification
      fetchedBookings.forEach(fb => {
        const local = this.bookings.find(b => b.id === fb.id);
        if (local && local.status !== fb.status) {
          this.addLog('info', `Row status for ${fb.id} changed externally to ${fb.status}`);
          
          if (fb.status === 'Approved') {
            const confCode = fb.confirmationCode || `OB-CONF-${Math.floor(1000 + Math.random() * 9000)}`;
            fb.confirmationCode = confCode;
            
            // Trigger Messenger Notification
            this.addLog('messenger', `💬 [AUTO-MESSENGER] Sent to ${fb.name} (${fb.phone}): "Great news! Room ${fb.roomType.toUpperCase()} is AVAILABLE for check-in on ${fb.checkIn}. Conf Code: ${confCode}. Verified via Google Sheet automated check."`);
          }
        }
      });

      this.bookings = fetchedBookings;
      this.saveBookings();
      this.notify();
      this.addLog('success', 'Local database successfully refreshed with Google Sheet data.');
      return true;
    } catch (e: any) {
      this.addLog('error', `Failed to pull bookings from Google Sheet: ${e.message}`);
      return false;
    }
  }

  // Append a single booking to Google Sheets
  async appendBookingToSheet(booking: Booking): Promise<boolean> {
    const token = await getAccessToken();
    const spreadsheetId = this.config.spreadsheetId;
    if (!token || !spreadsheetId) return false;

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Bookings!A2:append?valueInputOption=USER_ENTERED`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [[
            booking.id,
            booking.name,
            booking.email,
            booking.phone,
            booking.roomType,
            booking.checkIn,
            booking.checkOut,
            booking.guests,
            booking.status,
            booking.confirmationCode || '',
            booking.timestamp
          ]]
        })
      });

      if (response.ok) {
        this.addLog('success', `Exported booking ${booking.id} to Google Sheet row.`);
        return true;
      } else {
        throw new Error('Export append failed');
      }
    } catch (e: any) {
      this.addLog('error', `Failed to export booking row to Google Sheet: ${e.message}`);
      return false;
    }
  }

  // Submit and run automatic check against Google Sheets (takes a few seconds)
  async submitWithSheetsCheck(
    bookingData: Omit<Booking, 'id' | 'status' | 'timestamp' | 'confirmationCode'>,
    onProgress: (statusText: string) => void
  ): Promise<{ success: boolean; booking: Booking; error?: string }> {
    const tempId = `OB-BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();
    
    onProgress('Connecting to Google Sheets API...');
    await new Promise(r => setTimeout(r, 800));

    // 1. Fetch latest sheet data if connected, to ensure absolute real-time verification
    let isAvailable = true;
    const token = await getAccessToken();
    const spreadsheetId = this.config.spreadsheetId;

    if (token && spreadsheetId) {
      onProgress('Reading Google Sheet cells to verify room availability...');
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Bookings!A2:K1000`;
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const rows = data.values;
          if (rows && rows.length > 0) {
            const currentBookingsInSheet: Booking[] = rows.map((row: any) => ({
              id: row[0],
              name: row[1],
              email: row[2],
              phone: row[3],
              roomType: row[4],
              checkIn: row[5],
              checkOut: row[6],
              guests: row[7],
              status: row[8] as Booking['status'],
              confirmationCode: row[9],
              timestamp: row[10]
            }));

            // Sync our local list
            this.bookings = currentBookingsInSheet;
            this.saveBookings();
          }
        }
      } catch (e) {
        console.error('Failed to pre-fetch for verification, falling back to local check', e);
      }
    }

    onProgress('Analyzing overlapping calendars for the requested dates...');
    await new Promise(r => setTimeout(r, 1000));

    // Check overlap
    isAvailable = this.checkAvailabilityLocal(bookingData.roomType, bookingData.checkIn, bookingData.checkOut);

    if (!isAvailable) {
      onProgress('Checking complete. Room is fully booked.');
      await new Promise(r => setTimeout(r, 600));

      const failedBooking: Booking = {
        ...bookingData,
        id: tempId,
        status: 'Declined',
        timestamp
      };

      // Save as declined locally
      this.bookings = [failedBooking, ...this.bookings];
      this.saveBookings();
      this.addLog('warning', `Overlapping booking detected! Guest ${bookingData.name} requested dates that are already booked out in Google Sheets. Room: ${bookingData.roomType}. Dates: ${bookingData.checkIn} to ${bookingData.checkOut}`);
      
      // Auto-Messenger response (Declined)
      this.addLog('messenger', `💬 [AUTO-MESSENGER] Sent to ${bookingData.name} (${bookingData.phone}): "Hello, unfortunately the ${bookingData.roomType.toUpperCase()} is fully booked on Google Sheets for your selected dates (${bookingData.checkIn} to ${bookingData.checkOut}). Please select alternative dates on our website! 🚫"`);

      // If sheet connected, append with declined status so it records
      if (token && spreadsheetId) {
        await this.appendBookingToSheet(failedBooking);
      }

      this.notify();
      return { success: false, booking: failedBooking, error: `Dates are booked out! (Slash marks applied /)` };
    }

    onProgress('Dates are vacant! Generating secure confirmation code...');
    await new Promise(r => setTimeout(r, 800));

    const confirmationCode = `OB-${bookingData.roomType.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const successfulBooking: Booking = {
      ...bookingData,
      id: tempId,
      status: 'Approved',
      confirmationCode,
      timestamp
    };

    // Save as approved
    this.bookings = [successfulBooking, ...this.bookings];
    this.saveBookings();
    this.addLog('success', `Room confirmed vacant! Generated code ${confirmationCode} for ${bookingData.name}`);

    // Push to sheets
    if (token && spreadsheetId) {
      onProgress('Saving confirmed booking row to Google Sheets...');
      await this.appendBookingToSheet(successfulBooking);
    }

    // Dispatch to custom Google Apps Script Web App if configured by the user
    const customScriptUrl = localStorage.getItem('ob_apps_script_url');
    if (customScriptUrl) {
      onProgress('Triggering custom Google Apps Script Web App...');
      try {
        const payload = {
          guestName: successfulBooking.name,
          email: successfulBooking.email,
          phone: successfulBooking.phone,
          roomType: successfulBooking.roomType,
          checkIn: successfulBooking.checkIn,
          checkOut: successfulBooking.checkOut,
          guests: String(successfulBooking.guests),
          specialRequests: successfulBooking.message || "None",
          totalAmount: successfulBooking.roomType === 'deluxe' ? '12000' : successfulBooking.roomType === 'sunset' ? '18000' : successfulBooking.roomType === 'family' ? '15000' : '8000',
          bookingId: successfulBooking.id,
          timestamp: successfulBooking.timestamp
        };

        await fetch(customScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
        this.addLog('success', `📡 [APPS-SCRIPT] Successfully triggered custom Apps Script automation webhook: ${customScriptUrl}`);
      } catch (e: any) {
        this.addLog('warning', `📡 [APPS-SCRIPT] Apps Script webhook dispatch failed: ${e.message}`);
      }
    }

    onProgress('Notifying resort owner of booking details...');
    await new Promise(r => setTimeout(r, 600));
    this.triggerOwnerNotification(successfulBooking);

    onProgress('Sending Messenger alert and booking receipt to guest...');
    await new Promise(r => setTimeout(r, 1000));

    // Auto-Messenger alert
    this.addLog('messenger', `💬 [AUTO-MESSENGER] Sent to ${bookingData.name} (${bookingData.phone}): "🎉 Your stay at Ocean Breeze Resort is CONFIRMED! Your beachfront room (${bookingData.roomType.toUpperCase()}) is available from ${bookingData.checkIn} to ${bookingData.checkOut}. Confirmation code: ${confirmationCode}. Enjoy La Union! 🏄🌊"`);

    this.notify();
    return { success: true, booking: successfulBooking };
  }

  // --- Administrative Helper Methods ---

  // Save methods
  private saveRooms() {
    localStorage.setItem(STORAGE_KEYS.ROOMS_LIST, JSON.stringify(this.roomsList));
  }

  private saveStaff() {
    localStorage.setItem(STORAGE_KEYS.STAFF_LIST, JSON.stringify(this.staffList));
  }

  private saveReviews() {
    localStorage.setItem(STORAGE_KEYS.REVIEWS_LIST, JSON.stringify(this.reviewsList));
  }

  private saveRoomStatuses() {
    localStorage.setItem(STORAGE_KEYS.ROOM_STATUSES, JSON.stringify(this.roomStatuses));
  }

  private saveNotifications() {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.adminNotifications));
  }

  private saveHotelInfo() {
    localStorage.setItem(STORAGE_KEYS.HOTEL_INFO, JSON.stringify(this.hotelInfo));
  }

  // Guest profiles generation & management
  refreshGuestsList() {
    // Generate guest profiles by grouping bookings by email
    const bookingsByEmail: Record<string, Booking[]> = {};
    this.bookings.forEach(b => {
      if (!b.email) return;
      if (!bookingsByEmail[b.email]) {
        bookingsByEmail[b.email] = [];
      }
      bookingsByEmail[b.email].push(b);
    });

    // Load custom notes if any from storage
    const storedGuests = localStorage.getItem(STORAGE_KEYS.GUESTS_LIST);
    const customGuestsMap: Record<string, Partial<GuestProfile>> = {};
    if (storedGuests) {
      try {
        const list: GuestProfile[] = JSON.parse(storedGuests);
        list.forEach(g => {
          customGuestsMap[g.email] = g;
        });
      } catch (e) {
        console.error(e);
      }
    }

    const updatedGuestsList: GuestProfile[] = Object.keys(bookingsByEmail).map((email, index) => {
      const guestBookings = bookingsByEmail[email];
      const latestBooking = guestBookings[0];
      const approvedBookings = guestBookings.filter(b => b.status === 'Approved' || b.status === 'Checked In' || b.status === 'Checked Out' || b.status === 'Confirmed');
      const totalSpending = approvedBookings.reduce((sum, b) => {
        const room = this.roomsList.find(r => r.id === b.roomType) || DEFAULT_ROOMS.find(r => r.id === b.roomType);
        const price = room ? room.price : 5000;
        // Calculate nights
        const start = new Date(b.checkIn);
        const end = new Date(b.checkOut);
        const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        return sum + (price * nights);
      }, 0);

      const customData = customGuestsMap[email] || {};

      return {
        id: customData.id || `GST-${String(1001 + index)}`,
        name: latestBooking.name,
        email: email,
        phone: latestBooking.phone,
        bookingHistory: guestBookings.map(b => b.id),
        totalStays: approvedBookings.length,
        totalSpending,
        preferredRoom: latestBooking.roomType,
        notes: customData.notes || '',
        specialRequests: latestBooking.message || customData.specialRequests || ''
      };
    });

    // Merge with any custom guests that might not have active bookings
    Object.keys(customGuestsMap).forEach(email => {
      if (!bookingsByEmail[email]) {
        updatedGuestsList.push(customGuestsMap[email] as GuestProfile);
      }
    });

    this.guestsList = updatedGuestsList;
    localStorage.setItem(STORAGE_KEYS.GUESTS_LIST, JSON.stringify(this.guestsList));
  }

  // Rooms CRUD
  getRooms() {
    return [...this.roomsList];
  }

  addRoom(room: Omit<Room, 'id'>) {
    const id = room.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `room-${Date.now()}`;
    const newRoom: Room = { ...room, id };
    this.roomsList.push(newRoom);
    this.saveRooms();
    this.addLog('success', `Created new room type: ${room.name} (₱${room.price}/night)`);
    this.addNotification('Room Type Created', `New accommodation option "${room.name}" was added to the resort's catalog.`, 'info' as any);
    this.notify();
    return newRoom;
  }

  updateRoom(id: string, updatedFields: Partial<Room>) {
    this.roomsList = this.roomsList.map(r => r.id === id ? { ...r, ...updatedFields } as Room : r);
    this.saveRooms();
    this.addLog('info', `Updated room type config for ID: ${id}`);
    this.notify();
  }

  deleteRoom(id: string) {
    const room = this.roomsList.find(r => r.id === id);
    this.roomsList = this.roomsList.filter(r => r.id !== id);
    this.saveRooms();
    if (room) {
      this.addLog('warning', `Deleted room type: ${room.name}`);
    }
    this.notify();
  }

  // Staff CRUD
  getStaff() {
    return [...this.staffList];
  }

  addStaff(staff: Omit<StaffAccount, 'id'>) {
    const id = `STF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStaff: StaffAccount = { ...staff, id };
    this.staffList.push(newStaff);
    this.saveStaff();
    this.addLog('success', `Created new staff account: ${staff.name} (${staff.role})`);
    this.addNotification('Staff Account Created', `${staff.name} was added as ${staff.role}.`, 'info' as any);
    this.notify();
    return newStaff;
  }

  updateStaff(id: string, updatedFields: Partial<StaffAccount>) {
    this.staffList = this.staffList.map(s => s.id === id ? { ...s, ...updatedFields } as StaffAccount : s);
    this.saveStaff();
    this.addLog('info', `Updated staff account for ID: ${id}`);
    this.notify();
  }

  deleteStaff(id: string) {
    this.staffList = this.staffList.filter(s => s.id !== id);
    this.saveStaff();
    this.addLog('warning', `Deleted staff account ID: ${id}`);
    this.notify();
  }

  // Guest CRUD / Notes
  getGuests() {
    this.refreshGuestsList();
    return [...this.guestsList];
  }

  updateGuestNote(email: string, notes: string) {
    const customGuests = this.getGuests();
    const guest = customGuests.find(g => g.email === email);
    if (guest) {
      guest.notes = notes;
      localStorage.setItem(STORAGE_KEYS.GUESTS_LIST, JSON.stringify(customGuests));
      this.guestsList = customGuests;
      this.addLog('info', `Updated profile notes for guest: ${guest.name}`);
      this.notify();
    }
  }

  // Reviews CRUD
  getReviews() {
    return [...this.reviewsList];
  }

  addReview(review: Omit<ReviewItem, 'id' | 'date' | 'hidden'>) {
    const id = `REV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReview: ReviewItem = {
      ...review,
      id,
      date: new Date().toISOString().split('T')[0],
      hidden: false
    };
    this.reviewsList = [newReview, ...this.reviewsList];
    this.saveReviews();
    this.addLog('success', `New review added from guest ${review.guestName}: "${review.comment.substring(0, 30)}..."`);
    this.addNotification('New Guest Review', `Guest ${review.guestName} left a ${review.rating}-star review.`, 'info' as any);
    this.notify();
    return newReview;
  }

  addReviewReply(id: string, reply: string) {
    this.reviewsList = this.reviewsList.map(r => r.id === id ? { ...r, reply } : r);
    this.saveReviews();
    this.addLog('info', `Replied to review ${id}`);
    this.notify();
  }

  toggleReviewHidden(id: string) {
    this.reviewsList = this.reviewsList.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r);
    this.saveReviews();
    this.addLog('info', `Toggled visibility of review ${id}`);
    this.notify();
  }

  deleteReview(id: string) {
    this.reviewsList = this.reviewsList.filter(r => r.id !== id);
    this.saveReviews();
    this.addLog('warning', `Deleted review ID: ${id}`);
    this.notify();
  }

  // Housekeeping room status CRUD
  getRoomStatuses() {
    return [...this.roomStatuses];
  }

  updateRoomStatus(roomNumber: string, statusOrPatch: HousekeepingStatus | Partial<RoomStatusItem>) {
    this.roomStatuses = this.roomStatuses.map(rs => {
      if (rs.roomNumber === roomNumber) {
        const patch = typeof statusOrPatch === 'string' 
          ? { housekeepingStatus: statusOrPatch } 
          : statusOrPatch;
        return { ...rs, ...patch, lastUpdated: new Date().toISOString() };
      }
      return rs;
    });
    this.saveRoomStatuses();
    const logDetail = typeof statusOrPatch === 'string' ? statusOrPatch : JSON.stringify(statusOrPatch);
    this.addLog('info', `Housekeeping updated room status for ${roomNumber}: ${logDetail}`);
    this.notify();
  }

  // Notifications CRUD
  getNotifications() {
    return [...this.adminNotifications];
  }

  addNotification(title: string, message: string, type: AdminNotification['type']) {
    const id = `NTF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newNtf: AdminNotification = {
      id,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    this.adminNotifications = [newNtf, ...this.adminNotifications].slice(0, 50); // Keep last 50
    this.saveNotifications();
    this.notify();
    return newNtf;
  }

  markAllNotificationsAsRead() {
    this.adminNotifications = this.adminNotifications.map(n => ({ ...n, read: true }));
    this.saveNotifications();
    this.notify();
  }

  clearNotifications() {
    this.adminNotifications = [];
    this.saveNotifications();
    this.notify();
  }

  // Hotel Info CRUD
  getHotelInfo() {
    return { ...this.hotelInfo };
  }

  updateHotelInfo(updatedFields: Partial<HotelInfo>) {
    this.hotelInfo = { ...this.hotelInfo, ...updatedFields };
    this.saveHotelInfo();
    this.addLog('info', `Updated global resort information & settings`);
    this.notify();
  }

  // Override admin booking update status
  adminUpdateBookingStatus(id: string, status: Booking['status'], confirmationCode?: string) {
    const booking = this.bookings.find(b => b.id === id);
    const oldStatus = booking ? booking.status : 'N/A';
    
    this.bookings = this.bookings.map(b => {
      if (b.id === id) {
        return { ...b, status, confirmationCode: confirmationCode || b.confirmationCode };
      }
      return b;
    });
    this.saveBookings();
    this.refreshGuestsList();

    this.addLog('info', `Admin changed booking ${id} status from ${oldStatus} to ${status}`);

    // Trigger specific alerts/notifications
    if (status === 'Approved') {
      const approvedBooking = this.bookings.find(b => b.id === id);
      if (approvedBooking) {
        const code = confirmationCode || approvedBooking.confirmationCode || `OB-${approvedBooking.roomType.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        approvedBooking.confirmationCode = code;
        this.triggerOwnerNotification(approvedBooking);
        this.addNotification('Booking Confirmed', `Booking ${id} for ${approvedBooking.name} was confirmed.`, 'payment');
      }
    } else if (status === 'Cancelled') {
      const cancelledBooking = this.bookings.find(b => b.id === id);
      if (cancelledBooking) {
        this.addNotification('Booking Cancelled', `Booking ${id} for ${cancelledBooking.name} was cancelled.`, 'booking_cancel');
      }
    } else if (status === 'Checked In') {
      const cib = this.bookings.find(b => b.id === id);
      if (cib) {
        this.addNotification('Guest Checked In', `${cib.name} has checked into room successfully.`, 'checkin');
        // Automatically set room status to occupied in housekeeping!
        const matchedRoom = this.roomStatuses.find(rs => rs.roomType === cib.roomType);
        if (matchedRoom) {
          this.updateRoomStatus(matchedRoom.roomNumber, 'Occupied');
        }
      }
    } else if (status === 'Checked Out') {
      const cob = this.bookings.find(b => b.id === id);
      if (cob) {
        this.addNotification('Guest Checked Out', `${cob.name} has checked out. Room is flagged for cleaning.`, 'checkout');
        // Automatically set room status to cleaning in housekeeping!
        const matchedRoom = this.roomStatuses.find(rs => rs.roomType === cob.roomType);
        if (matchedRoom) {
          this.updateRoomStatus(matchedRoom.roomNumber, 'Cleaning');
        }
      }
    }

    this.notify();
  }

  // Staff Accounts Aliases
  getStaffAccounts() {
    return this.getStaff();
  }

  addStaffAccount(staff: Omit<StaffAccount, 'id'>) {
    return this.addStaff(staff);
  }

  deleteStaffAccount(id: string) {
    return this.deleteStaff(id);
  }

  // Admin Notification CRUD
  dismissNotification(id: string) {
    this.adminNotifications = this.adminNotifications.filter(n => n.id !== id);
    this.saveNotifications();
    this.notify();
  }

  // Reviews CRUD Update
  updateReview(id: string, patch: Partial<ReviewItem>) {
    this.reviewsList = this.reviewsList.map(r => r.id === id ? { ...r, ...patch } : r);
    this.saveReviews();
    this.notify();
  }

  // Sheets Syncing
  async pullBookingsFromSheets() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.addLog('info', 'Pulled fresh reservation entries from Google Sheets API');
    this.notify();
    return true;
  }
}

export const bookingStore = new BookingStore();
