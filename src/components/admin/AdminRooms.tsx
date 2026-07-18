import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit, Trash2, Tag, Compass, Sparkles, Check, X, EyeOff,
  Image as ImageIcon, Bed, ShieldAlert, DollarSign, PlusCircle, ArrowUpDown, ChevronDown
} from 'lucide-react';
import { bookingStore } from '../../lib/bookingStore';
import { Room } from '../../types';

interface AdminRoomsProps {
  onRefresh: () => void;
}

export default function AdminRooms({ onRefresh }: AdminRoomsProps) {
  const [rooms, setRooms] = useState<Room[]>(() => bookingStore.getRooms());
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [formFields, setFormFields] = useState<Omit<Room, 'id'>>({
    name: '',
    description: '',
    capacity: '',
    size: '',
    bedType: '',
    price: 0,
    image: '',
    amenities: [],
    featured: false,
    view: '',
    discounts: 0,
    seasonalPricing: [],
    disabled: false
  });

  // Seasonal Pricing Form temporary state
  const [seasonalFields, setSeasonalFields] = useState({
    season: '',
    price: 0,
    start: '',
    end: ''
  });

  // Available Default Amenities checklist
  const DEFAULT_AMENITIES_CHECKLIST = [
    'Private Balcony', 'Ocean View', 'Mini Bar', 'Espresso Machine', 'Rainfall Shower',
    'Private Plunge Pool', 'Sunset View', 'Outdoor Tub', 'Wine Cooler', 'Lounge Deck',
    'Two-Level Loft', 'Equipped Kitchenette', 'Living Lounge Area', 'Garden Terrace', 'Smart TV',
    'Private Hammock', 'Air Conditioning', 'Outdoor Rain Shower', 'Eco Toiletries', 'Beach Lounge Chairs',
    'High Speed Wi-Fi', 'Complimentary Breakfast', 'Room Service'
  ];

  // Refresh rooms from store
  const refreshLocalRoomsList = () => {
    const list = bookingStore.getRooms();
    setRooms(list);
    onRefresh();
  };

  const handleToggleDisabled = (id: string, currentStatus: boolean) => {
    bookingStore.updateRoom(id, { disabled: !currentStatus });
    refreshLocalRoomsList();
  };

  const handleEditClick = (room: Room) => {
    setEditingRoom(room);
    setFormFields({
      name: room.name,
      description: room.description,
      capacity: room.capacity,
      size: room.size,
      bedType: room.bedType,
      price: room.price,
      image: room.image,
      amenities: room.amenities || [],
      featured: room.featured || false,
      view: room.view || '',
      discounts: room.discounts || 0,
      seasonalPricing: room.seasonalPricing || [],
      disabled: room.disabled || false
    });
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setFormFields({
      name: '',
      description: '',
      capacity: '2 Guests',
      size: '30 m²',
      bedType: 'Queen Size Bed',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      amenities: ['Air Conditioning', 'High Speed Wi-Fi', 'Rainfall Shower'],
      featured: false,
      view: 'Lush Garden Access',
      discounts: 0,
      seasonalPricing: [],
      disabled: false
    });
  };

  const handleSaveFields = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.name || formFields.price <= 0) {
      alert('Please fill in a valid room name and positive nightly price.');
      return;
    }

    if (editingRoom) {
      // Update room
      bookingStore.updateRoom(editingRoom.id, formFields);
      setEditingRoom(null);
    } else if (isAddingNew) {
      // Create room
      bookingStore.addRoom(formFields);
      setIsAddingNew(false);
    }
    refreshLocalRoomsList();
  };

  const handleDeleteRoom = (id: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to completely delete "${name}"? This operation cannot be undone.`)) {
      bookingStore.deleteRoom(id);
      refreshLocalRoomsList();
    }
  };

  // Amenities checklist toggle
  const handleAmenityCheck = (amenityName: string) => {
    const isChecked = formFields.amenities.includes(amenityName);
    const updated = isChecked 
      ? formFields.amenities.filter(a => a !== amenityName)
      : [...formFields.amenities, amenityName];
    setFormFields(prev => ({ ...prev, amenities: updated }));
  };

  // Seasonal CRUD helpers
  const handleAddSeasonalRule = () => {
    if (!seasonalFields.season || seasonalFields.price <= 0 || !seasonalFields.start || !seasonalFields.end) {
      alert('Please fill in all seasonal pricing rule inputs.');
      return;
    }
    const updated = [...(formFields.seasonalPricing || []), { ...seasonalFields }];
    setFormFields(prev => ({ ...prev, seasonalPricing: updated }));
    setSeasonalFields({ season: '', price: 0, start: '', end: '' });
  };

  const handleRemoveSeasonalRule = (index: number) => {
    const updated = (formFields.seasonalPricing || []).filter((_, idx) => idx !== index);
    setFormFields(prev => ({ ...prev, seasonalPricing: updated }));
  };

  return (
    <div className="space-y-6" id="admin-rooms">
      {/* Title & Trigger row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="font-serif text-lg font-bold text-charcoal">Resort Accommodations</h3>
          <p className="font-sans text-xs text-gray-500 mt-1">Configure pricing, details, photos, seasonal policies, and amenities.</p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="px-4 py-2.5 bg-sunset hover:bg-sunset/90 text-white rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-sunset/15 active:scale-98 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Room Category
        </button>
      </div>

      {/* Grid of existing rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map(room => {
          const discountPrice = room.discounts ? Math.round(room.price * (1 - room.discounts / 100)) : room.price;
          
          return (
            <motion.div
              layout
              key={room.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all group ${
                room.disabled ? 'border-dashed border-slate-200 bg-slate-50/40 opacity-75' : 'border-slate-100'
              }`}
            >
              {/* Photo Area */}
              <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={room.image}
                  alt={room.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                
                {/* Float badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {room.featured && (
                    <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                  {room.disabled && (
                    <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                      <EyeOff className="w-3 h-3" /> De-listed
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <h4 className="font-serif text-lg font-bold truncate pr-2">{room.name}</h4>
                    <span className="font-sans text-[10px] text-sand font-semibold uppercase tracking-wider">{room.view}</span>
                  </div>
                </div>
              </div>

              {/* Specs & Pricing */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="font-sans text-xs text-gray-500 leading-relaxed font-light line-clamp-2">
                  {room.description}
                </p>

                {/* Specs row */}
                <div className="grid grid-cols-3 gap-2 mt-4 py-3 border-y border-slate-50 text-[10px] text-gray-500 font-semibold tracking-wide uppercase font-sans">
                  <div>
                    <span className="text-gray-400 block font-normal">Capacity</span>
                    <span className="text-charcoal block truncate mt-0.5">{room.capacity}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-normal">Bed Configuration</span>
                    <span className="text-charcoal block truncate mt-0.5">{room.bedType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-normal">Floor Area</span>
                    <span className="text-charcoal block truncate mt-0.5">{room.size}</span>
                  </div>
                </div>

                {/* Amenities grid */}
                <div className="mt-4">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-1.5">Amenities</span>
                  <div className="flex flex-wrap gap-1">
                    {(room.amenities || []).slice(0, 5).map(amenity => (
                      <span key={amenity} className="text-[9px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md font-medium border border-slate-100">
                        {amenity}
                      </span>
                    ))}
                    {(room.amenities || []).length > 5 && (
                      <span className="text-[9px] text-gray-400 font-bold px-1 py-0.5">
                        +{room.amenities.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Seasonal schedules badge row */}
                {(room.seasonalPricing || []).length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-50">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-1">Active Seasonal Rates</span>
                    <div className="space-y-1">
                      {room.seasonalPricing?.map((sp, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] text-amber-800 bg-amber-50/50 border border-amber-100/50 px-2 py-1 rounded-md font-medium">
                          <span>{sp.season} ({sp.start} to {sp.end})</span>
                          <span className="font-bold">₱{sp.price.toLocaleString()}/night</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing summary & Controls */}
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-50">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold block">Base Rate / Night</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      {room.discounts ? (
                        <>
                          <span className="font-serif text-xl font-bold text-sunset">₱{discountPrice.toLocaleString()}</span>
                          <span className="font-sans text-xs text-gray-400 line-through">₱{room.price.toLocaleString()}</span>
                          <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold">{room.discounts}% OFF</span>
                        </>
                      ) : (
                        <span className="font-serif text-xl font-bold text-charcoal">₱{room.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Enable / disable toggle */}
                    <button
                      onClick={() => handleToggleDisabled(room.id, !!room.disabled)}
                      className={`px-2 py-1 rounded-lg border font-sans text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        room.disabled
                          ? 'bg-rose-50 border-rose-100 text-rose-800 hover:bg-rose-100'
                          : 'bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {room.disabled ? 'List room' : 'Delist'}
                    </button>

                    <button
                      onClick={() => handleEditClick(room)}
                      className="p-2 hover:bg-slate-100 border border-slate-200 rounded-lg text-gray-500 hover:text-charcoal transition-colors cursor-pointer"
                      title="Edit details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteRoom(room.id, room.name)}
                      className="p-2 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit / Add Room Overlay Dialog */}
      <AnimatePresence>
        {(editingRoom || isAddingNew) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => { setEditingRoom(null); setIsAddingNew(false); }}
              className="absolute inset-0 bg-charcoal"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h4 className="font-serif text-lg font-bold text-charcoal">
                    {editingRoom ? `Edit "${editingRoom.name}"` : 'Create New Room Category'}
                  </h4>
                  <p className="font-sans text-[11px] text-gray-400 mt-0.5">Customize specifications, seasonal overrides, and listings.</p>
                </div>
                <button
                  onClick={() => { setEditingRoom(null); setIsAddingNew(false); }}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form container */}
              <form onSubmit={handleSaveFields} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Row 1: Name, view, base rate */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Accommodation Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Surfer Eco Suite"
                      value={formFields.name}
                      onChange={(e) => setFormFields(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">View Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Garden Access & Surf Views"
                      value={formFields.view}
                      onChange={(e) => setFormFields(prev => ({ ...prev, view: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Base Rate / Night (₱)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formFields.price}
                      onChange={(e) => setFormFields(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: Description text */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Bio Description</label>
                  <textarea
                    rows={2}
                    placeholder="Enter short details about guest experiences in this room..."
                    value={formFields.description}
                    onChange={(e) => setFormFields(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Row 3: Image URL & discount, Capacity, Bed, Size */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Resort Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formFields.image}
                      onChange={(e) => setFormFields(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Capacity Specs</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Adults"
                      value={formFields.capacity}
                      onChange={(e) => setFormFields(prev => ({ ...prev, capacity: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Beds Spec</label>
                    <input
                      type="text"
                      placeholder="e.g. Super King Bed"
                      value={formFields.bedType}
                      onChange={(e) => setFormFields(prev => ({ ...prev, bedType: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Room Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 40 m²"
                      value={formFields.size}
                      onChange={(e) => setFormFields(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Promotional Discount (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formFields.discounts}
                      onChange={(e) => setFormFields(prev => ({ ...prev, discounts: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-6 pt-5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-charcoal cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formFields.featured}
                        onChange={(e) => setFormFields(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded border-slate-300 text-sunset focus:ring-sunset"
                      />
                      Feature on Home Screen
                    </label>
                  </div>
                </div>

                {/* Seasonal Rates Manager */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div>
                    <h5 className="text-xs font-bold text-charcoal uppercase tracking-wider">Seasonal Override Calendars</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5">Specify specific date intervals where nightly pricing automatically changes.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-slate-50 p-4 rounded-xl">
                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Season Label</label>
                      <input
                        type="text"
                        placeholder="e.g. Summer Peak"
                        value={seasonalFields.season}
                        onChange={(e) => setSeasonalFields(prev => ({ ...prev, season: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-sans text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Override Rate (₱)</label>
                      <input
                        type="number"
                        min={0}
                        value={seasonalFields.price}
                        onChange={(e) => setSeasonalFields(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-sans text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Start Day</label>
                      <input
                        type="date"
                        value={seasonalFields.start}
                        onChange={(e) => setSeasonalFields(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-sans text-charcoal"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">End Day</label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={seasonalFields.end}
                          onChange={(e) => setSeasonalFields(prev => ({ ...prev, end: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-sans text-charcoal"
                        />
                        <button
                          type="button"
                          onClick={handleAddSeasonalRule}
                          className="p-2 bg-charcoal hover:bg-sunset text-white rounded-lg cursor-pointer shrink-0 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* List of active seasonal pricing */}
                  {(formFields.seasonalPricing || []).length > 0 && (
                    <div className="space-y-2">
                      {formFields.seasonalPricing?.map((sp, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                          <div>
                            <span className="font-bold text-charcoal">{sp.season}</span>
                            <span className="text-gray-400 ml-2">({sp.start} to {sp.end})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-sunset">₱{sp.price.toLocaleString()}/night</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSeasonalRule(idx)}
                              className="text-rose-500 hover:text-rose-700 font-bold"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amenities Selection List */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div>
                    <h5 className="text-xs font-bold text-charcoal uppercase tracking-wider">Resort Amenities Matrix</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5">Select amenities included with this accommodation type.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DEFAULT_AMENITIES_CHECKLIST.map(amenity => {
                      const isChecked = formFields.amenities.includes(amenity);
                      return (
                        <label
                          key={amenity}
                          onClick={() => handleAmenityCheck(amenity)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all active:scale-97 select-none ${
                            isChecked
                              ? 'bg-slate-50 border-charcoal text-charcoal'
                              : 'bg-white border-slate-100 text-gray-500 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-charcoal border-charcoal text-white' : 'border-slate-200 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">{amenity}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </form>

              {/* Actions Footer */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 shrink-0">
                <button
                  type="button"
                  onClick={() => { setEditingRoom(null); setIsAddingNew(false); }}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-gray-700 rounded-xl border border-slate-200 font-sans text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFields}
                  className="px-5 py-2 bg-sunset hover:bg-sunset/90 text-white rounded-xl font-sans text-xs font-bold uppercase tracking-wider shadow-md shadow-sunset/15 cursor-pointer"
                >
                  Save Category
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
