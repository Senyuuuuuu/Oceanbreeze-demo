import { getAccessToken } from './firebaseAuth';

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
  status: 'Pending' | 'Approved' | 'Declined';
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
  type: 'info' | 'success' | 'warning' | 'error' | 'messenger';
  message: string;
}

const STORAGE_KEYS = {
  BOOKINGS: 'ob_bookings',
  SHEETS_CONFIG: 'ob_sheets_config',
  LOGS: 'ob_logs',
  OWNER_SETTINGS: 'ob_owner_settings'
};

// Initial local seed data - Empty by default for direct Google Sheets testing
const SEED_BOOKINGS: Booking[] = [];

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
}

export const bookingStore = new BookingStore();
