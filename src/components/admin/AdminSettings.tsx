import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Percent, Users, Bell, Save, Trash2, Plus, 
  Shield, Check, X, ShieldAlert, Sparkles, UserPlus
} from 'lucide-react';
import { bookingStore } from '../../lib/bookingStore';
import { StaffAccount, HotelInfo } from '../../types';

interface AdminSettingsProps {
  onRefresh: () => void;
}

export default function AdminSettings({ onRefresh }: AdminSettingsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'hotel' | 'staff' | 'notifications'>('hotel');
  
  // Local state pulled from bookingStore
  const [hotelInfo, setHotelInfo] = useState<HotelInfo>(() => bookingStore.getHotelInfo());
  const [staffList, setStaffList] = useState<StaffAccount[]>(() => bookingStore.getStaffAccounts());
  
  // Add Staff form states
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    role: 'Receptionist' as StaffAccount['role'],
    password: ''
  });

  // Notification toggles
  const [notifBooking, setNotifBooking] = useState(true);
  const [notifCheckOut, setNotifCheckOut] = useState(true);
  const [notifSheetBackup, setNotifSheetBackup] = useState(true);

  // Success indicator
  const [saveStatus, setSaveStatus] = useState('');

  const refreshLocalState = () => {
    setHotelInfo(bookingStore.getHotelInfo());
    setStaffList(bookingStore.getStaffAccounts());
    onRefresh();
  };

  const handleSaveHotelInfo = (e: React.FormEvent) => {
    e.preventDefault();
    bookingStore.updateHotelInfo(hotelInfo);
    triggerSuccessToast('Hotel credentials and parameters saved successfully!');
    refreshLocalState();
  };

  const triggerSuccessToast = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Staff CRUD
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email || !staffForm.password) {
      alert('Please fill in all staff details.');
      return;
    }

    const exists = staffList.some(s => s.email.toLowerCase() === staffForm.email.toLowerCase());
    if (exists) {
      alert('A staff account with this email address already exists.');
      return;
    }

    bookingStore.addStaffAccount({
      name: staffForm.name,
      email: staffForm.email,
      role: staffForm.role,
      password: staffForm.password, // Stored in store, hashed in real setups
      phone: '',
      enabled: true
    });

    setIsAddingStaff(false);
    setStaffForm({ name: '', email: '', role: 'Receptionist', password: '' });
    triggerSuccessToast('New staff member added successfully!');
    refreshLocalState();
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (staffList.length <= 1) {
      alert('Cannot delete the last staff account. The hotel requires at least one administrator.');
      return;
    }
    const victim = staffList.find(s => s.id === id);
    if (victim?.role === 'Owner') {
      alert('For security compliance, the Owner account cannot be deleted from this panel.');
      return;
    }

    if (confirm(`Are you absolutely sure you want to remove "${name}" from staff access?`)) {
      bookingStore.deleteStaffAccount(id);
      triggerSuccessToast('Staff member access revoked.');
      refreshLocalState();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="admin-settings">
      {/* Toast alert */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-xs font-sans font-bold flex items-center gap-2 border border-emerald-500"
          >
            <Check className="w-4.5 h-4.5" />
            <span>{saveStatus}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row h-full min-h-[500px]">
        {/* Settings Left sub-rail */}
        <div className="w-full md:w-56 bg-slate-50/50 border-r border-slate-100 p-5 space-y-2 flex-shrink-0">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block px-2.5 mb-2">Category</span>
          
          <button
            onClick={() => setActiveSubTab('hotel')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-sans font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeSubTab === 'hotel' 
                ? 'bg-white text-sunset shadow-sm border border-slate-100' 
                : 'text-gray-500 hover:bg-slate-50'
            }`}
          >
            <Building className="w-4 h-4" /> Brand & Surcharges
          </button>

          <button
            onClick={() => setActiveSubTab('staff')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-sans font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeSubTab === 'staff' 
                ? 'bg-white text-sunset shadow-sm border border-slate-100' 
                : 'text-gray-500 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" /> Staff Access (RBAC)
          </button>

          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-sans font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeSubTab === 'notifications' 
                ? 'bg-white text-sunset shadow-sm border border-slate-100' 
                : 'text-gray-500 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4" /> Trigger Actions
          </button>
        </div>

        {/* Setting content details */}
        <div className="flex-1 p-6 md:p-8">
          
          {/* Subtab 1: Hotel Info & Fees */}
          {activeSubTab === 'hotel' && (
            <form onSubmit={handleSaveHotelInfo} className="space-y-6">
              <div>
                <h4 className="font-serif text-md font-bold text-charcoal">Resort Profiles & Parameters</h4>
                <p className="font-sans text-[11px] text-gray-400 mt-0.5">Edit billing variables, address metadata, and global resort metrics.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Resort Title</label>
                  <input
                    type="text"
                    required
                    value={hotelInfo.name}
                    onChange={(e) => setHotelInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Physical Address</label>
                  <input
                    type="text"
                    required
                    value={hotelInfo.address}
                    onChange={(e) => setHotelInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Official Reservation Email</label>
                  <input
                    type="email"
                    required
                    value={hotelInfo.email}
                    onChange={(e) => setHotelInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Frontdesk Phone</label>
                  <input
                    type="text"
                    required
                    value={hotelInfo.phone}
                    onChange={(e) => setHotelInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Surcharges Section */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-charcoal uppercase tracking-wider">Billing Fee Configurations</h5>
                  <p className="text-[10px] text-gray-400 mt-0.5">Surcharges added automatically to guest invoices at checkout.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">VAT / Tax Surcharge (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={hotelInfo.taxes}
                      onChange={(e) => setHotelInfo(prev => ({ ...prev, taxes: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Resort Service Fee (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={hotelInfo.serviceFees}
                      onChange={(e) => setHotelInfo(prev => ({ ...prev, serviceFees: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-sunset hover:bg-sunset/90 text-white rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-sunset/15 cursor-pointer transition-all active:scale-98"
                >
                  <Save className="w-4 h-4" /> Save Specifications
                </button>
              </div>
            </form>
          )}

          {/* Subtab 2: Staff Accounts (RBAC CRUD) */}
          {activeSubTab === 'staff' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif text-md font-bold text-charcoal">Authorized Staff Credentials</h4>
                  <p className="font-sans text-[11px] text-gray-400 mt-0.5">Revoke, add, or elevate structural hotel manager permissions.</p>
                </div>
                {!isAddingStaff && (
                  <button
                    onClick={() => setIsAddingStaff(true)}
                    className="px-3.5 py-2 bg-charcoal hover:bg-sunset text-white rounded-xl font-sans text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Staff Account
                  </button>
                )}
              </div>

              {/* Add staff form */}
              <AnimatePresence>
                {isAddingStaff && (
                  <motion.form 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleCreateStaff}
                    className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 overflow-hidden space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Staff Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Elena Santos"
                          value={staffForm.name}
                          onChange={(e) => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-sans text-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Access Email</label>
                        <input
                          type="email"
                          required
                          placeholder="elena@oceanbreeze.com"
                          value={staffForm.email}
                          onChange={(e) => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-sans text-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Default Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={staffForm.password}
                          onChange={(e) => setStaffForm(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-sans text-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Assigned Role</label>
                        <select
                          value={staffForm.role}
                          onChange={(e) => setStaffForm(prev => ({ ...prev, role: e.target.value as StaffAccount['role'] }))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-sans text-charcoal outline-none cursor-pointer"
                        >
                          <option value="Manager">Manager</option>
                          <option value="Receptionist">Receptionist</option>
                          <option value="Housekeeping">Housekeeping (Staff)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingStaff(false)}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-gray-500 font-sans font-bold text-[10px] uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-sunset text-white rounded-lg font-sans font-bold text-[10px] uppercase shadow-sm cursor-pointer"
                      >
                        Authorize Staff
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Staff grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {staffList.map(staff => {
                  let badge = 'bg-slate-50 border-slate-100 text-slate-500';
                  if (staff.role === 'Owner') badge = 'bg-amber-500 border-amber-500 text-white shadow-sm';
                  else if (staff.role === 'Manager') badge = 'bg-charcoal border-charcoal text-white';
                  else if (staff.role === 'Receptionist') badge = 'bg-sky-50 border-sky-100 text-sky-800';
                  else if (staff.role === 'Housekeeping') badge = 'bg-teal-50 border-teal-100 text-teal-800';

                  return (
                    <div 
                      key={staff.id} 
                      className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-50 text-charcoal flex items-center justify-center font-serif font-bold text-xs uppercase border border-slate-100">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-xs font-bold text-charcoal">{staff.name}</span>
                            <span className={`text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${badge}`}>
                              {staff.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{staff.email}</span>
                        </div>
                      </div>

                      {staff.role !== 'Owner' && (
                        <button
                          onClick={() => handleDeleteStaff(staff.id, staff.name)}
                          className="p-1.5 bg-slate-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Revoke access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subtab 3: Automations and Notifications */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-md font-bold text-charcoal">Resort Automation Triggers</h4>
                <p className="font-sans text-[11px] text-gray-400 mt-0.5">Toggle automated cron actions, webhook backups, and logs.</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifBooking}
                    onChange={(e) => setNotifBooking(e.target.checked)}
                    className="rounded border-slate-300 text-sunset focus:ring-sunset mt-1"
                  />
                  <div>
                    <span className="font-sans text-xs font-bold text-charcoal block">Real-time Admin Notifications</span>
                    <span className="font-sans text-[11px] text-gray-400 block mt-0.5">Push top-nav warnings inside dashboard when guests register a new stay inquiry.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifCheckOut}
                    onChange={(e) => setNotifCheckOut(e.target.checked)}
                    className="rounded border-slate-300 text-sunset focus:ring-sunset mt-1"
                  />
                  <div>
                    <span className="font-sans text-xs font-bold text-charcoal block">Automated Housekeeping Release</span>
                    <span className="font-sans text-[11px] text-gray-400 block mt-0.5">Automatically mark a room housekeeping state as "Dirty" the moment a check-out is processed.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifSheetBackup}
                    onChange={(e) => setNotifSheetBackup(e.target.checked)}
                    className="rounded border-slate-300 text-sunset focus:ring-sunset mt-1"
                  />
                  <div>
                    <span className="font-sans text-xs font-bold text-charcoal block">Google Sheets Automated cron</span>
                    <span className="font-sans text-[11px] text-gray-400 block mt-0.5">Automatically push guest spreadsheet changes to Google Sheets upon admin manual action click.</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => triggerSuccessToast('Resort automation rules saved successfully!')}
                  className="px-5 py-2 bg-charcoal hover:bg-sunset text-white rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-charcoal/15 cursor-pointer transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Automation Board
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
