import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, RefreshCw, FileText, Download, Check, X,
  Eye, Printer, MoreVertical, Calendar, User, Phone, Mail,
  ChevronRight, Sparkles, CreditCard, Layers, SlidersHorizontal, ArrowDownWideNarrow
} from 'lucide-react';
import { bookingStore, Booking } from '../../lib/bookingStore';

interface AdminBookingsProps {
  bookings: Booking[];
  onRefresh: () => void;
}

export default function AdminBookings({ bookings, onRefresh }: AdminBookingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  // Get current hotel parameters to calculate invoice totals
  const hotelInfo = bookingStore.getHotelInfo();
  const rooms = bookingStore.getRooms();

  // Search, filter, and sort logic
  const filteredBookings = bookings
    .filter(b => {
      const matchesSearch = 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.id && b.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.confirmationCode && b.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchesRoom = roomFilter === 'All' || b.roomType === roomFilter;

      return matchesSearch && matchesStatus && matchesRoom;
    })
    .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());

  // Handle manual Google Sheets trigger
  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Polling Google Sheets...');
    try {
      await bookingStore.pullBookingsFromSheets();
      setSyncStatus('Sync complete!');
      onRefresh();
      setTimeout(() => setSyncStatus(''), 2000);
    } catch (e: any) {
      setSyncStatus(`Failed: ${e.message}`);
      setTimeout(() => setSyncStatus(''), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  // State transitions inside dashboard
  const handleStatusChange = (id: string, nextStatus: Booking['status']) => {
    const code = nextStatus === 'Approved' ? `OB-${String(Math.floor(100000 + Math.random() * 900000))}` : undefined;
    bookingStore.adminUpdateBookingStatus(id, nextStatus, code);
    
    // Auto-update local drawer if opened
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(prev => prev ? { ...prev, status: nextStatus, confirmationCode: code || prev.confirmationCode } as Booking : null);
    }
    
    onRefresh();
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Guest Name', 'Email', 'Phone', 'Room Code', 'Check-In', 'Check-Out', 'Guests', 'Status', 'Code', 'Created'];
    const rows = filteredBookings.map(b => [
      b.id,
      b.name,
      b.email,
      b.phone,
      b.roomType,
      b.checkIn,
      b.checkOut,
      b.guests,
      b.status,
      b.confirmationCode || 'N/A',
      b.timestamp
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ocean_breeze_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    bookingStore.addLog('info', 'Exported booking records spreadsheet to CSV.');
  };

  // PDF / Invoice Printing helper
  const handlePrintInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !selectedBooking) return;

    const b = selectedBooking;
    const room = rooms.find(r => r.id === b.roomType) || rooms[0];
    const rate = room ? room.price : 5000;
    
    // Calculate nights
    const start = new Date(b.checkIn);
    const end = new Date(b.checkOut);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    
    const subtotal = rate * nights;
    const vat = Math.round(subtotal * (hotelInfo.taxes / 100));
    const serviceCharge = Math.round(subtotal * (hotelInfo.serviceFees / 100));
    const total = subtotal + vat + serviceCharge;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${b.id}</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; color: #1e293b; padding: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e293b; }
            .logo span { color: #f59e0b; }
            .details { margin: 40px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
            .card { background: #f8fafc; padding: 20px; border-radius: 12px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .table th { border-bottom: 2px solid #e2e8f0; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; color: #64748b; }
            .table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .totals { margin-top: 40px; margin-left: auto; width: 300px; font-size: 14px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 12px; }
            .footer { margin-top: 80px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Ocean <span>Breeze</span></div>
              <p style="font-size: 12px; color: #64748b; margin-top: 4px;">Urbiztondo, San Juan, La Union, Philippines</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; font-size: 20px; color: #1e293b;">RESERVATION INVOICE</h2>
              <p style="font-size: 12px; color: #64748b; margin-top: 4px;">Booking ID: <strong>${b.id}</strong></p>
              <p style="font-size: 12px; color: #64748b; margin-top: 2px;">Code: <strong>${b.confirmationCode || 'N/A'}</strong></p>
            </div>
          </div>

          <div class="details">
            <div class="card">
              <h4 style="margin: 0 0 10px 0; color: #64748b; font-size: 11px; text-transform: uppercase;">GUEST INFORMATION</h4>
              <p style="margin: 4px 0; font-weight: bold; font-size: 15px;">${b.name}</p>
              <p style="margin: 4px 0; font-size: 13px;">${b.email}</p>
              <p style="margin: 4px 0; font-size: 13px;">${b.phone}</p>
            </div>
            <div class="card">
              <h4 style="margin: 0 0 10px 0; color: #64748b; font-size: 11px; text-transform: uppercase;">STAY DETAILS</h4>
              <p style="margin: 4px 0; font-weight: bold;">${room ? room.name : b.roomType.toUpperCase()}</p>
              <p style="margin: 4px 0; font-size: 13px;">Check In: <strong>${b.checkIn}</strong> (2:00 PM)</p>
              <p style="margin: 4px 0; font-size: 13px;">Check Out: <strong>${b.checkOut}</strong> (12:00 PM)</p>
              <p style="margin: 4px 0; font-size: 13px;">Nights: <strong>${nights} Nights</strong> • Guests: <strong>${b.guests} Guests</strong></p>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Daily Rate</th>
                <th style="text-align: right;">Quantity</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Accommodation Charge (${room ? room.name : b.roomType.toUpperCase()})</td>
                <td style="text-align: right;">₱${rate.toLocaleString()}</td>
                <td style="text-align: right;">${nights} Nights</td>
                <td style="text-align: right;">₱${subtotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>₱${subtotal.toLocaleString()}</span>
            </div>
            <div class="totals-row">
              <span>VAT / Taxes (${hotelInfo.taxes}%):</span>
              <span>₱${vat.toLocaleString()}</span>
            </div>
            <div class="totals-row">
              <span>Service Fees (${hotelInfo.serviceFees}%):</span>
              <span>₱${serviceCharge.toLocaleString()}</span>
            </div>
            <div class="totals-row grand-total">
              <span>Grand Total:</span>
              <span>₱${total.toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for choosing Ocean Breeze Resort. We hope you have an incredible surfing escape.</p>
            <p>© ${new Date().getFullYear()} Ocean Breeze Resort. Urbiztondo Beach, San Juan, La Union.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    bookingStore.addLog('info', `Generated printed invoice document for booking ID: ${b.id}`);
  };

  return (
    <div className="space-y-6" id="admin-bookings">
      {/* Search and Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bookings by guest name, ID, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 pl-10 pr-4 py-2 rounded-xl text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-charcoal font-sans text-[11px] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Room Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl text-xs">
            <Layers className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-charcoal font-sans text-[11px] cursor-pointer"
            >
              <option value="All">All Rooms</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-charcoal transition-colors tooltip cursor-pointer"
            title="Export Spreadsheet"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Sheets Sync trigger */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className={`px-3 py-1.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              isSyncing 
                ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                : 'bg-sunset text-white hover:bg-sunset/90 shadow-md shadow-sunset/10'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Sheets'}
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="text-[10px] bg-slate-100 text-charcoal border border-slate-200 text-center py-1.5 px-3 rounded-lg font-mono tracking-wide font-medium">
          {syncStatus}
        </div>
      )}

      {/* Main Table view */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-sans text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Guest / ID</th>
                <th className="py-4 px-3">Room Type</th>
                <th className="py-4 px-3">Check-In / Out</th>
                <th className="py-4 px-3">Guests</th>
                <th className="py-4 px-3 text-center">Status</th>
                <th className="py-4 px-3">Conf. Code</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-sans text-xs">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <SlidersHorizontal className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No reservations found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  // Get visual styling for status badges
                  let statusClass = 'bg-slate-100 text-slate-700 border-slate-200/50';
                  if (b.status === 'Pending') statusClass = 'bg-amber-50 text-amber-700 border-amber-100';
                  else if (b.status === 'Approved' || b.status === 'Confirmed') statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  else if (b.status === 'Checked In') statusClass = 'bg-sky-50 text-sky-700 border-sky-100';
                  else if (b.status === 'Checked Out') statusClass = 'bg-slate-100 text-slate-500 border-slate-200';
                  else if (b.status === 'Declined' || b.status === 'Cancelled') statusClass = 'bg-rose-50 text-rose-700 border-rose-100';

                  return (
                    <tr 
                      key={b.id} 
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                      onClick={() => setSelectedBooking(b)}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-bold text-charcoal text-sm group-hover:text-sunset transition-colors block">{b.name}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{b.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="font-medium text-gray-600 uppercase text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                          {b.roomType}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div>
                          <span className="font-semibold text-charcoal block">{b.checkIn}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">to {b.checkOut}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3 font-semibold text-charcoal">{b.guests} pax</td>
                      <td className="py-4 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusClass}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 font-mono font-bold text-gray-500">
                        {b.confirmationCode || '—'}
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-gray-400 hover:text-charcoal transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {b.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(b.id, 'Approved')}
                                className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer"
                                title="Approve Booking"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(b.id, 'Declined')}
                                className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Decline Booking"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {b.status === 'Approved' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'Checked In')}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[10px] uppercase tracking-wider border border-emerald-100 cursor-pointer"
                              title="Process Check-in"
                            >
                              Check-In
                            </button>
                          )}

                          {b.status === 'Checked In' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'Checked Out')}
                              className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg font-bold text-[10px] uppercase tracking-wider border border-sky-100 cursor-pointer"
                              title="Process Check-out"
                            >
                              Check-Out
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Drawer Slide-out Details panel */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="absolute inset-0 bg-charcoal"
            />

            {/* Sidebar content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal">Inquiry Details</h3>
                  <span className="font-sans text-[10px] font-mono uppercase text-gray-400 tracking-wider block mt-0.5">{selectedBooking.id}</span>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-gray-400 hover:text-charcoal transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="p-6 flex-1 space-y-6">
                
                {/* Guest Profile Section */}
                <div className="space-y-3">
                  <h4 className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">Guest Credentials</h4>
                  <div className="bg-slate-50 p-4 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-3 text-xs text-charcoal">
                      <User className="w-4 h-4 text-sunset shrink-0" />
                      <span className="font-bold">{selectedBooking.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-charcoal">
                      <Mail className="w-4 h-4 text-sunset shrink-0" />
                      <a href={`mailto:${selectedBooking.email}`} className="hover:underline">{selectedBooking.email}</a>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-charcoal">
                      <Phone className="w-4 h-4 text-sunset shrink-0" />
                      <a href={`tel:${selectedBooking.phone}`} className="hover:underline">{selectedBooking.phone}</a>
                    </div>
                  </div>
                </div>

                {/* Reservation Parameters */}
                <div className="space-y-3">
                  <h4 className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stay Matrix</h4>
                  <div className="border border-slate-100 rounded-xl divide-y divide-slate-100">
                    <div className="p-3 flex justify-between items-center text-xs">
                      <span className="text-gray-500">Accommodation Type</span>
                      <span className="font-bold text-charcoal uppercase">{selectedBooking.roomType}</span>
                    </div>
                    <div className="p-3 flex justify-between items-center text-xs">
                      <span className="text-gray-500">Check In Date</span>
                      <span className="font-bold text-charcoal">{selectedBooking.checkIn} (2:00 PM)</span>
                    </div>
                    <div className="p-3 flex justify-between items-center text-xs">
                      <span className="text-gray-500">Check Out Date</span>
                      <span className="font-bold text-charcoal">{selectedBooking.checkOut} (12:00 PM)</span>
                    </div>
                    <div className="p-3 flex justify-between items-center text-xs">
                      <span className="text-gray-500">Number of Guests</span>
                      <span className="font-bold text-sunset">{selectedBooking.guests} Guests</span>
                    </div>
                  </div>
                </div>

                {/* Special Request */}
                {selectedBooking.message && (
                  <div className="space-y-3">
                    <h4 className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">Special Requests</h4>
                    <p className="p-3 bg-amber-50/40 text-amber-900 border border-amber-100/40 rounded-xl text-xs leading-relaxed italic">
                      "{selectedBooking.message}"
                    </p>
                  </div>
                )}

                {/* Financial breakdown */}
                <div className="space-y-3">
                  <h4 className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price Estimation</h4>
                  <div className="bg-slate-50/80 p-4 rounded-xl divide-y divide-slate-200/50 space-y-3">
                    {(() => {
                      const roomObj = rooms.find(r => r.id === selectedBooking.roomType);
                      const roomPrice = roomObj ? roomObj.price : 5000;
                      const start = new Date(selectedBooking.checkIn);
                      const end = new Date(selectedBooking.checkOut);
                      const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                      
                      const subtotal = roomPrice * nights;
                      const taxes = Math.round(subtotal * (hotelInfo.taxes / 100));
                      const fees = Math.round(subtotal * (hotelInfo.serviceFees / 100));
                      const total = subtotal + taxes + fees;

                      return (
                        <>
                          <div className="space-y-2 text-xs pt-0">
                            <div className="flex justify-between">
                              <span className="text-gray-500">₱{roomPrice.toLocaleString()} × {nights} Nights</span>
                              <span className="font-semibold text-charcoal">₱{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">VAT / Taxes (${hotelInfo.taxes}%)</span>
                              <span className="font-semibold text-charcoal">₱{taxes.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Resort Service Fees (${hotelInfo.serviceFees}%)</span>
                              <span className="font-semibold text-charcoal">₱{fees.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-3 text-sm font-bold text-charcoal">
                            <span>Grand Total</span>
                            <span className="text-lg text-sunset">₱{total.toLocaleString()}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="p-6 border-t border-slate-100 space-y-3 bg-slate-50/50">
                <div className="flex gap-3">
                  {/* Print invoice button */}
                  <button
                    onClick={handlePrintInvoice}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-gray-700 hover:bg-slate-50 transition-colors font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print Invoice
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {selectedBooking.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'Declined')}
                        className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-charcoal transition-colors font-sans text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'Approved')}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  )}

                  {selectedBooking.status === 'Approved' && (
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, 'Checked In')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors font-sans text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Process Check-In
                    </button>
                  )}

                  {selectedBooking.status === 'Checked In' && (
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, 'Checked Out')}
                      className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-colors font-sans text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Process Check-Out
                    </button>
                  )}

                  {['Approved', 'Checked In', 'Pending'].includes(selectedBooking.status) && (
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, 'Cancelled')}
                      className="w-full py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-sans text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
