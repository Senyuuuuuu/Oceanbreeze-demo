import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, User, Wrench, 
  Trash2, RefreshCw, Clock, FileEdit, ClipboardList, HelpCircle
} from 'lucide-react';
import { bookingStore } from '../../lib/bookingStore';
import { RoomStatusItem } from '../../types';

interface AdminHousekeepingProps {
  onRefresh: () => void;
}

export default function AdminHousekeeping({ onRefresh }: AdminHousekeepingProps) {
  const [statuses, setStatuses] = useState<RoomStatusItem[]>(() => bookingStore.getRoomStatuses());
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string | null>(null);
  const [housekeeperFilter, setHousekeeperFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [noteText, setNoteText] = useState('');

  const refreshStatuses = () => {
    const list = bookingStore.getRoomStatuses();
    setStatuses(list);
    onRefresh();
  };

  const handleStatusChange = (roomNumber: string, status: RoomStatusItem['housekeepingStatus']) => {
    const patch: Partial<RoomStatusItem> = { housekeepingStatus: status };
    if (status === 'Ready' || status === 'Available') {
      patch.lastCleaned = new Date().toLocaleString();
    }
    bookingStore.updateRoomStatus(roomNumber, patch);
    refreshStatuses();
  };

  const handleHousekeeperAssign = (roomNumber: string, housekeeper: string) => {
    bookingStore.updateRoomStatus(roomNumber, { assignedHousekeeper: housekeeper });
    refreshStatuses();
  };

  const handleSaveNotes = (roomNumber: string) => {
    bookingStore.updateRoomStatus(roomNumber, { notes: noteText });
    setSelectedRoomNumber(null);
    setNoteText('');
    refreshStatuses();
  };

  const handleStartEditingNotes = (item: RoomStatusItem) => {
    setSelectedRoomNumber(item.roomNumber);
    setNoteText(item.notes || '');
  };

  // KPI calculations
  const dirtyCount = statuses.filter(s => s.housekeepingStatus === 'Dirty').length;
  const cleaningCount = statuses.filter(s => s.housekeepingStatus === 'Cleaning').length;
  const readyCount = statuses.filter(s => ['Ready', 'Available'].includes(s.housekeepingStatus)).length;
  const maintenanceCount = statuses.filter(s => ['Maintenance', 'Out of Service'].includes(s.housekeepingStatus)).length;

  const filteredStatuses = statuses.filter(item => {
    const matchesHousekeeper = housekeeperFilter === 'All' || item.assignedHousekeeper === housekeeperFilter;
    const matchesStatus = statusFilter === 'All' || item.housekeepingStatus === statusFilter;
    return matchesHousekeeper && matchesStatus;
  });

  return (
    <div className="space-y-6" id="admin-housekeeping">
      {/* Title block */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h3 className="font-serif text-lg font-bold text-charcoal">Mateo & Liam's Housekeeping Board</h3>
          <p className="font-sans text-xs text-gray-500 mt-1">Live status, assignments, and structural logs for room turn-downs.</p>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2.5">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={housekeeperFilter}
              onChange={(e) => setHousekeeperFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-charcoal cursor-pointer text-[11px]"
            >
              <option value="All">All Housekeepers</option>
              <option value="Mateo">Mateo</option>
              <option value="Liam">Liam</option>
              <option value="Elena">Elena</option>
              <option value="None">Unassigned</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
            <ClipboardList className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-charcoal cursor-pointer text-[11px]"
            >
              <option value="All">All Statuses</option>
              <option value="Ready">Ready</option>
              <option value="Dirty">Dirty</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Housekeeping KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
            {dirtyCount}
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Dirty Rooms</span>
            <span className="text-xs text-charcoal font-semibold block mt-0.5">Need attention</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
            {cleaningCount}
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">In Cleaning</span>
            <span className="text-xs text-charcoal font-semibold block mt-0.5">Mateo/Liam active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            {readyCount}
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Inspected / Ready</span>
            <span className="text-xs text-charcoal font-semibold block mt-0.5">Checked & pristine</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
            {maintenanceCount}
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Maintenance</span>
            <span className="text-xs text-charcoal font-semibold block mt-0.5">Repairs logged</span>
          </div>
        </div>
      </div>

      {/* Floor Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredStatuses.map((item) => {
          let badgeColor = 'bg-slate-100 border-slate-200 text-slate-700';
          if (item.housekeepingStatus === 'Ready' || item.housekeepingStatus === 'Available') {
            badgeColor = 'bg-emerald-50 border-emerald-100 text-emerald-800';
          } else if (item.housekeepingStatus === 'Dirty') {
            badgeColor = 'bg-rose-50 border-rose-100 text-rose-800 animate-pulse';
          } else if (item.housekeepingStatus === 'Cleaning') {
            badgeColor = 'bg-amber-50 border-amber-100 text-amber-800';
          } else if (item.housekeepingStatus === 'Maintenance') {
            badgeColor = 'bg-indigo-50 border-indigo-100 text-indigo-800';
          }

          const isEditingNotes = selectedRoomNumber === item.roomNumber;

          return (
            <div 
              key={item.roomNumber}
              className={`bg-white rounded-2xl border p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all ${
                item.housekeepingStatus === 'Dirty' ? 'border-rose-100' : 'border-slate-100'
              }`}
            >
              {/* Header: Room & Status badge */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-serif text-md font-bold text-charcoal block">Room {item.roomNumber}</span>
                  <span className="font-sans text-[9px] text-gray-400 uppercase tracking-wider font-semibold block mt-0.5">{item.roomType}</span>
                </div>
                <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                  {item.housekeepingStatus}
                </span>
              </div>

              {/* Status fast toggles */}
              <div className="space-y-1">
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold block">Update Status</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleStatusChange(item.roomNumber, 'Dirty')}
                    className={`p-1 text-[9px] font-sans font-bold uppercase tracking-wider rounded-md border text-center transition-colors cursor-pointer ${
                      item.housekeepingStatus === 'Dirty' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 border-slate-100 text-gray-500 hover:bg-slate-100'
                    }`}
                  >
                    Dirty
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.roomNumber, 'Cleaning')}
                    className={`p-1 text-[9px] font-sans font-bold uppercase tracking-wider rounded-md border text-center transition-colors cursor-pointer ${
                      item.housekeepingStatus === 'Cleaning' ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 border-slate-100 text-gray-500 hover:bg-slate-100'
                    }`}
                  >
                    Clean
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.roomNumber, 'Ready')}
                    className={`p-1 text-[9px] font-sans font-bold uppercase tracking-wider rounded-md border text-center transition-colors cursor-pointer ${
                      ['Ready', 'Available'].includes(item.housekeepingStatus) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-100 text-gray-500 hover:bg-slate-100'
                    }`}
                  >
                    Ready
                  </button>
                </div>
              </div>

              {/* Housekeeper Assignment */}
              <div className="space-y-1">
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold block">Assigned Staff</span>
                <select
                  value={item.assignedHousekeeper || 'None'}
                  onChange={(e) => handleHousekeeperAssign(item.roomNumber, e.target.value === 'None' ? '' : e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg text-xs font-sans text-charcoal outline-none cursor-pointer"
                >
                  <option value="None">Select Housekeeper</option>
                  <option value="Mateo">Mateo (Lead)</option>
                  <option value="Liam">Liam</option>
                  <option value="Elena">Elena</option>
                </select>
              </div>

              {/* Maintenance logs & internal issues */}
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Housekeeping Notes</span>
                  {!isEditingNotes && (
                    <button
                      onClick={() => handleStartEditingNotes(item)}
                      className="text-[9px] text-sunset font-semibold uppercase hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingNotes ? (
                  <div className="space-y-1.5">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="e.g. Broken water valve, missing pool towel..."
                      className="w-full bg-white border border-slate-200 p-2 rounded text-[10px] font-sans text-charcoal focus:outline-none focus:border-sunset resize-none"
                      rows={2}
                    />
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setSelectedRoomNumber(null)}
                        className="px-2 py-0.5 bg-slate-100 text-charcoal font-semibold rounded text-[9px] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(item.roomNumber)}
                        className="px-2 py-0.5 bg-charcoal text-white font-semibold rounded text-[9px] cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-600 font-light leading-relaxed min-h-[14px]">
                    {item.notes ? `"${item.notes}"` : <span className="text-gray-300 italic">No structural warnings</span>}
                  </p>
                )}
              </div>

              {/* Cleaned Timestamp Footer */}
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[9px] text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Last clean:
                </span>
                <span className="font-mono">{item.lastCleaned ? item.lastCleaned.split(',')[0] : 'Never'}</span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
