import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, LayoutDashboard, Calendar, Bed, Users, 
  Sparkles, ClipboardList, Star, ShieldAlert, Settings, 
  LogOut, Bell, Menu, X, ChevronRight, User, ShieldCheck
} from 'lucide-react';
import { bookingStore, Booking } from '../../lib/bookingStore';
import { StaffAccount } from '../../types';

// Import sub-modules
import AdminOverview from './AdminOverview';
import AdminBookings from './AdminBookings';
import AdminRooms from './AdminRooms';
import AdminGuests from './AdminGuests';
import AdminHousekeeping from './AdminHousekeeping';
import AdminReviews from './AdminReviews';
import AdminLogs from './AdminLogs';
import AdminSettings from './AdminSettings';

interface AdminDashboardProps {
  user: StaffAccount;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Real-time state syncing
  const [bookings, setBookings] = useState<Booking[]>(() => bookingStore.getBookings());
  const [notifs, setNotifs] = useState(() => bookingStore.getNotifications());

  const handleRefresh = () => {
    setBookings(bookingStore.getBookings());
    setNotifs(bookingStore.getNotifications());
  };

  // Re-fetch occasionally or on manual action
  useEffect(() => {
    handleRefresh();
  }, [activeTab]);

  const handleClearNotif = (id: string) => {
    bookingStore.dismissNotification(id);
    setNotifs(bookingStore.getNotifications());
  };

  const handleLogoutClick = () => {
    if (confirm('Are you ready to log out of the resort backoffice?')) {
      bookingStore.addLog('auth', `Staff session terminated: ${user.name}`);
      onLogout();
    }
  };

  // List of active navigation items based on Role (RBAC)
  // Owner: Full access. Manager: Access to most except staff settings. Receptionist: Access to bookings/housekeeping. Housekeeping: Access ONLY to housekeeping.
  const allNavItems = [
    { id: 'overview', label: 'Resort Dashboard', icon: LayoutDashboard, component: AdminOverview, roles: ['Owner', 'Manager'] },
    { id: 'bookings', label: 'Reservations', icon: Calendar, component: AdminBookings, roles: ['Owner', 'Manager', 'Receptionist'] },
    { id: 'rooms', label: 'Suites & Villas', icon: Bed, component: AdminRooms, roles: ['Owner', 'Manager'] },
    { id: 'guests', label: 'Guest CRM', icon: Users, component: AdminGuests, roles: ['Owner', 'Manager', 'Receptionist'] },
    { id: 'housekeeping', label: 'Housekeeping', icon: ClipboardList, component: AdminHousekeeping, roles: ['Owner', 'Manager', 'Receptionist', 'Housekeeping'] },
    { id: 'reviews', label: 'Guest Feedbacks', icon: Star, component: AdminReviews, roles: ['Owner', 'Manager'] },
    { id: 'logs', label: 'Audit Log', icon: ShieldAlert, component: AdminLogs, roles: ['Owner'] },
    { id: 'settings', label: 'Settings', icon: Settings, component: AdminSettings, roles: ['Owner', 'Manager'] },
  ];

  // Filter nav items based on user's role
  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  // Determine current active component or fallback
  const currentTabObj = navItems.find(item => item.id === activeTab) || navItems[0];
  const CurrentModuleComponent = currentTabObj ? currentTabObj.component : AdminHousekeeping;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans select-none overflow-hidden" id="admin-dashboard">
      
      {/* 1. Large Screen Left Sidebar */}
      <aside 
        className={`hidden md:flex flex-col justify-between bg-charcoal text-slate-300 h-screen transition-all duration-300 border-r border-slate-800 shrink-0 select-none ${
          isSidebarOpen ? 'w-64 p-6' : 'w-20 p-4 items-center'
        }`}
      >
        <div className="space-y-8 w-full">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-serif font-bold shrink-0 shadow-lg shadow-amber-500/10">
              OB
            </div>
            {isSidebarOpen && (
              <div>
                <span className="font-serif text-md font-bold text-white tracking-wide block">Ocean Breeze</span>
                <span className="text-[9px] text-amber-500 font-sans font-bold uppercase tracking-widest block mt-0.5">Hotel Backoffice</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 w-full pt-4">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold flex items-center gap-3 transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-slate-800 text-amber-500 font-extrabold shadow-inner' 
                      : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Details */}
        <div className="w-full pt-4 border-t border-slate-800/80">
          {isSidebarOpen ? (
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-xl">
                <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center font-bold font-serif text-white uppercase shadow">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <span className="font-sans text-xs font-bold text-white block truncate">{user.name}</span>
                  <span className="text-[9px] text-amber-500 font-sans font-bold uppercase tracking-wider block mt-0.5">{user.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogoutClick}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-sans font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-3 cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogoutClick}
              className="p-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Mobile Nav Header Ticker */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-charcoal text-white z-40 px-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-serif font-bold text-sm">
            OB
          </div>
          <div>
            <span className="font-serif text-sm font-bold text-white block">Ocean Breeze</span>
            <span className="text-[8px] text-amber-500 font-sans uppercase block mt-0.5">Hotel Backoffice</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 hover:bg-slate-800 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu Overlays */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-16 bottom-0 left-0 w-64 bg-charcoal text-slate-300 z-40 p-6 flex flex-col justify-between border-r border-slate-800 md:hidden"
          >
            <nav className="space-y-1.5 pt-4">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold flex items-center gap-3 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-slate-800 text-amber-500 font-extrabold shadow-inner' 
                        : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <item.icon className="w-4.5 h-4.5 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-xl mb-4">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center font-bold font-serif text-white uppercase text-xs">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <span className="font-sans text-xs font-bold text-white block">{user.name}</span>
                  <span className="text-[9px] text-amber-500 font-sans uppercase block mt-0.5">{user.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogoutClick}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-sans font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-3 cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 3. Main Body Container */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0">
        
        {/* Top Header bar */}
        <header className="bg-white border-b border-slate-100 px-6 md:px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:block p-1.5 hover:bg-slate-50 text-gray-400 hover:text-charcoal rounded-lg cursor-pointer"
              title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-sans text-xs font-bold text-charcoal tracking-wide bg-slate-100 px-2.5 py-1 rounded-md uppercase">
                Authorized Node Session • {user.role} Access
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Realtime Bell Alert list dropdown */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 bg-slate-50 border border-slate-200/50 hover:bg-slate-100 rounded-lg text-gray-500 hover:text-charcoal transition-all relative cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              {notifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-sans font-extrabold animate-pulse">
                  {notifs.length}
                </span>
              )}
            </button>

            {/* Notifications overlay dropdown panel */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  {/* Invisible click backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-10 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 space-y-3 overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                      <h4 className="font-sans text-xs font-bold text-charcoal">Resort Event Alerts</h4>
                      <span className="text-[9px] bg-slate-100 text-gray-500 px-1.5 py-0.5 rounded font-bold">{notifs.length} new</span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      {notifs.length === 0 ? (
                        <p className="text-[11px] text-gray-400 py-6 text-center">No unread notifications.</p>
                      ) : (
                        notifs.map(notif => (
                          <div key={notif.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100/40 relative flex items-start gap-2 group">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                            <div className="flex-1 pr-4">
                              <p className="font-sans text-[11px] text-charcoal leading-relaxed">{notif.message}</p>
                              <span className="font-sans text-[9px] text-gray-400 mt-1 block">{notif.time}</span>
                            </div>
                            <button
                              onClick={() => handleClearNotif(notif.id)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-charcoal p-0.5"
                              title="Dismiss"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <span className="w-px h-6 bg-slate-100 block" />

            {/* Profile trigger */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-charcoal text-amber-500 flex items-center justify-center font-bold text-sm">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <span className="font-sans text-xs font-bold text-charcoal block">{user.name}</span>
                <span className="text-[9px] text-gray-400 block mt-0.5 uppercase tracking-wider">{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Component Screen */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="h-full"
            >
              <CurrentModuleComponent bookings={bookings} onRefresh={handleRefresh} onTabChange={setActiveTab} />
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

    </div>
  );
}
