import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, User, Mail, Phone, Calendar, DollarSign, Bookmark,
  TrendingUp, Award, HelpCircle, X, Check, Save, FileText, ChevronRight
} from 'lucide-react';
import { bookingStore } from '../../lib/bookingStore';
import { GuestProfile } from '../../types';

interface AdminGuestsProps {
  onRefresh: () => void;
}

export default function AdminGuests({ onRefresh }: AdminGuestsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<GuestProfile | null>(null);
  const [guests, setGuests] = useState<GuestProfile[]>(() => bookingStore.getGuests());
  const [editNotes, setEditNotes] = useState('');

  // Re-read from store to get the latest calculated metrics
  const refreshLocalGuests = () => {
    const list = bookingStore.getGuests();
    setGuests(list);
    
    // Sync current selected guest if open
    if (selectedGuest) {
      const updated = list.find(g => g.email === selectedGuest.email);
      if (updated) {
        setSelectedGuest(updated);
        setEditNotes(updated.notes || '');
      }
    }
    onRefresh();
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.phone.includes(searchTerm)
  );

  // Core statistical computations
  const totalGuestsCount = guests.length;
  const repeatGuestsCount = guests.filter(g => g.totalStays > 1).length;
  const topSpender = guests.reduce((prev, current) => (prev.totalSpending > current.totalSpending) ? prev : current, { name: 'None', totalSpending: 0 } as any);
  const avgStays = totalGuestsCount > 0 
    ? (guests.reduce((sum, g) => sum + g.totalStays, 0) / totalGuestsCount).toFixed(1) 
    : '0';

  const handleOpenGuestProfile = (guest: GuestProfile) => {
    setSelectedGuest(guest);
    setEditNotes(guest.notes || '');
  };

  const handleSaveNotes = () => {
    if (selectedGuest) {
      bookingStore.updateGuestNote(selectedGuest.email, editNotes);
      refreshLocalGuests();
    }
  };

  return (
    <div className="space-y-6" id="admin-guests">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Registered Customers</span>
            <span className="text-xl font-bold text-charcoal block mt-0.5">{totalGuestsCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Repeat Customers</span>
            <span className="text-xl font-bold text-charcoal block mt-0.5">{repeatGuestsCount} guests</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Average Visits / Guest</span>
            <span className="text-xl font-bold text-charcoal block mt-0.5">{avgStays} visits</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block truncate">Top Spender Account</span>
            <span className="text-sm font-bold text-charcoal block mt-1 truncate" title={`${topSpender.name} (₱${topSpender.totalSpending.toLocaleString()})`}>
              {topSpender.name} (₱{topSpender.totalSpending.toLocaleString()})
            </span>
          </div>
        </div>
      </div>

      {/* CRM Search & Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Search header */}
        <div className="p-5 border-b border-slate-50">
          <div className="relative w-full md:w-96">
            <Search className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guests by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 pl-10 pr-4 py-2 rounded-xl text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Guest CRM table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/55 border-b border-slate-100 font-sans text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Customer / Contact</th>
                <th className="py-4 px-3">Preferred Accommodation</th>
                <th className="py-4 px-3 text-center">Approved Stays</th>
                <th className="py-4 px-3 text-right">Total Spending</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-sans text-xs">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <User className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No customer profiles found matching this search.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g) => (
                  <tr 
                    key={g.id} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => handleOpenGuestProfile(g)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-charcoal font-serif font-bold flex items-center justify-center uppercase shrink-0 text-xs">
                          {g.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-charcoal text-sm group-hover:text-sunset transition-colors block">{g.name}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{g.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="font-semibold text-gray-500 uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                        {g.preferredRoom || '—'}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center font-bold text-charcoal">
                      {g.totalStays} Stays
                    </td>
                    <td className="py-4 px-3 text-right font-bold text-emerald-600 font-mono text-sm">
                      ₱{g.totalSpending.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenGuestProfile(g)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-gray-700 rounded-xl font-sans text-[10px] font-bold uppercase border border-slate-200 cursor-pointer transition-all flex items-center gap-1 ml-auto"
                      >
                        Profile Card <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Profile Details Sidebar */}
      <AnimatePresence>
        {selectedGuest && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGuest(null)}
              className="absolute inset-0 bg-charcoal"
            />

            {/* Profile Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sunset text-white font-serif font-bold text-md flex items-center justify-center uppercase shadow-md shadow-sunset/15">
                    {selectedGuest.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-serif text-md font-bold text-charcoal">{selectedGuest.name}</h4>
                    <span className="font-sans text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">{selectedGuest.id}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGuest(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CRM Card Content */}
              <div className="p-6 flex-1 space-y-6">
                
                {/* Contact Coordinates */}
                <div className="space-y-2 text-xs">
                  <h5 className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Contact Coordinates</h5>
                  <div className="border border-slate-100 rounded-xl divide-y divide-slate-50 p-1 bg-slate-50/20">
                    <div className="p-2.5 flex items-center gap-3 text-charcoal">
                      <Mail className="w-4 h-4 text-sunset" />
                      <a href={`mailto:${selectedGuest.email}`} className="hover:underline">{selectedGuest.email}</a>
                    </div>
                    <div className="p-2.5 flex items-center gap-3 text-charcoal">
                      <Phone className="w-4 h-4 text-sunset" />
                      <a href={`tel:${selectedGuest.phone}`} className="hover:underline">{selectedGuest.phone}</a>
                    </div>
                  </div>
                </div>

                {/* Account Metrics block */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold block">Visits Completed</span>
                    <span className="text-xl font-bold text-charcoal mt-1 block">{selectedGuest.totalStays} Stays</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold block">Total Spendings</span>
                    <span className="text-xl font-bold text-emerald-600 mt-1 block">₱{selectedGuest.totalSpending.toLocaleString()}</span>
                  </div>
                </div>

                {/* Booking references list */}
                <div className="space-y-3">
                  <h5 className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Reservation Ledger</h5>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {selectedGuest.bookingHistory.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No bookings registered.</p>
                    ) : (
                      selectedGuest.bookingHistory.map(bId => (
                        <div key={bId} className="p-2.5 border border-slate-100 rounded-xl flex items-center justify-between text-xs hover:border-slate-200 transition-colors">
                          <span className="font-mono font-bold text-charcoal">{bId}</span>
                          <span className="text-gray-400 font-medium">Preferred Room: <strong className="uppercase font-sans text-charcoal text-[10px]">{selectedGuest.preferredRoom}</strong></span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Preferences Internal Staff Notes (AUTOSAVED) */}
                <div className="space-y-2">
                  <h5 className="text-[10px] text-gray-400 uppercase tracking-wider font-bold flex items-center justify-between">
                    <span>Internal Staff Preferences & Notes</span>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-0.5">
                      <Save className="w-3 h-3" /> Autosaved
                    </span>
                  </h5>
                  <textarea
                    rows={4}
                    placeholder="Enter hospitality notes (e.g., pillows, allergy details, surf boards, complimentary requests, VIP notes)..."
                    value={editNotes}
                    onChange={(e) => {
                      setEditNotes(e.target.value);
                      bookingStore.updateGuestNote(selectedGuest.email, e.target.value);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Special Request */}
                {selectedGuest.specialRequests && (
                  <div className="space-y-2">
                    <h5 className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Latest Check-In Requests</h5>
                    <p className="p-3 bg-amber-50/40 text-amber-900 border border-amber-100/40 rounded-xl text-xs leading-relaxed font-sans italic">
                      "{selectedGuest.specialRequests}"
                    </p>
                  </div>
                )}

              </div>

              {/* Actions footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button
                  onClick={() => setSelectedGuest(null)}
                  className="px-5 py-2.5 bg-charcoal hover:bg-sunset text-white rounded-xl font-sans text-xs font-bold uppercase tracking-wider shadow-md shadow-charcoal/15 cursor-pointer transition-colors"
                >
                  Close Profile Card
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
