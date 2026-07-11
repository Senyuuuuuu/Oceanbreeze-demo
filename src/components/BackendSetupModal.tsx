import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertCircle, RefreshCw, LogIn, LogOut, FileSpreadsheet, 
  Settings, Phone, Terminal, Play, Clipboard
} from 'lucide-react';
import { auth, googleSignIn, logout, getAccessToken } from '../lib/firebaseAuth';
import { bookingStore, Booking, SheetsConfig, OwnerSettings, ActivityLog } from '../lib/bookingStore';

interface BackendSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackendSetupModal({ isOpen, onClose }: BackendSetupModalProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<SheetsConfig>(bookingStore.getConfig());
  const [ownerSettings, setOwnerSettings] = useState<OwnerSettings>(bookingStore.getOwnerSettings());
  const [logs, setLogs] = useState<ActivityLog[]>(bookingStore.getLogs());
  const [manualSpreadsheetId, setManualSpreadsheetId] = useState<string>('');
  const [testBookingCount, setTestBookingCount] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    // Refresh states when modal opens
    setConfig(bookingStore.getConfig());
    setOwnerSettings(bookingStore.getOwnerSettings());
    setLogs(bookingStore.getLogs());
    setTestBookingCount(bookingStore.getBookings().length);

    const unsubscribeStore = bookingStore.subscribe(() => {
      setConfig(bookingStore.getConfig());
      setOwnerSettings(bookingStore.getOwnerSettings());
      setLogs(bookingStore.getLogs());
    });

    const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => {
      unsubscribeStore();
      unsubscribeAuth();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        bookingStore.addLog('success', `Owner Google Authentication successful: ${res.user.email}`);
      }
    } catch (e: any) {
      bookingStore.addLog('error', `Authentication error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      bookingStore.updateConfig({
        isConnected: false,
        spreadsheetId: null,
        spreadsheetTitle: null
      });
      bookingStore.addLog('warning', 'Google account disconnected.');
    } catch (e: any) {
      bookingStore.addLog('error', `Logout error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewSheet = async () => {
    setLoading(true);
    try {
      const spreadsheetId = await bookingStore.createSpreadsheet();
      if (spreadsheetId) {
        bookingStore.addLog('success', `New Google Spreadsheet connected! ID: ${spreadsheetId}`);
      }
    } catch (e: any) {
      bookingStore.addLog('error', `Creation error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkManualSheet = async () => {
    if (!manualSpreadsheetId.trim()) return;
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        bookingStore.addLog('error', 'Authentication token required to link spreadsheet.');
        setLoading(false);
        return;
      }

      bookingStore.addLog('info', `Attempting connection to Spreadsheet ID: ${manualSpreadsheetId}...`);
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${manualSpreadsheetId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to access Spreadsheet. Check sharing access or ID. Status: ${response.status}`);
      }

      const data = await response.json();
      const title = data.properties.title || 'Manually Connected Spreadsheet';

      bookingStore.updateConfig({
        spreadsheetId: manualSpreadsheetId,
        spreadsheetTitle: title,
        isConnected: true
      });

      // Synchronize initial data
      await bookingStore.syncLocalBookingsToSheet(manualSpreadsheetId, token);
      bookingStore.addLog('success', `Google Sheet "${title}" successfully linked and synchronized.`);
      setManualSpreadsheetId('');
    } catch (e: any) {
      bookingStore.addLog('error', `Link failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePullLatest = async () => {
    setLoading(true);
    try {
      const success = await bookingStore.pullFromSheet();
      if (success) {
        bookingStore.addLog('success', 'Two-way synchronization completed: Pulled latest rows.');
      } else {
        bookingStore.addLog('warning', 'Pull sync failed. Verify authentication.');
      }
    } catch (e: any) {
      bookingStore.addLog('error', `Pull error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    bookingStore.addLog('info', 'Spreadsheet ID copied to clipboard.');
  };

  return (
    <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sunset/10 rounded-2xl flex items-center justify-center text-sunset">
              <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-charcoal">Resort Backend Setup</h2>
              <p className="text-xs text-gray-400 mt-0.5">Google Sheets backend connection & Owner SMS settings</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-charcoal transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Step 1: Owner Google Auth */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-orange-50 text-sunset text-[10px] font-bold flex items-center justify-center">1</span>
              Google Account Authentication
            </h3>
            
            {!user ? (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-charcoal">Google Drive & Sheets Access</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 max-w-md leading-relaxed">
                    Log in with your Google account to grant permission to read/write spreadsheet cells securely.
                  </p>
                </div>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-charcoal hover:bg-charcoal/90 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> Connect Google
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-charcoal">Connected as Owner</p>
                    <p className="text-[10px] text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleGoogleLogout}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Disconnect
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Spreadsheet linking */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center justify-center">2</span>
              Google Sheets Backend Connection
            </h3>

            {!user ? (
              <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 text-center">
                <p className="text-xs text-amber-700 font-semibold flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Google Authentication Required
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Please link your Google account above first to establish the spreadsheet database connection.
                </p>
              </div>
            ) : config.isConnected && config.spreadsheetId ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-charcoal">{config.spreadsheetTitle}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 break-all flex items-center gap-1">
                        ID: {config.spreadsheetId.substring(0, 16)}...
                        <button 
                          onClick={() => copyToClipboard(config.spreadsheetId!)}
                          className="hover:text-sunset focus:outline-none"
                          title="Copy Full ID"
                        >
                          <Clipboard className="w-3 h-3 cursor-pointer" />
                        </button>
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/edit`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 font-semibold text-[10px] transition-all cursor-pointer"
                  >
                    Open Live Sheet
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200/60">
                  <button
                    onClick={handlePullLatest}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-charcoal hover:bg-charcoal/90 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Pull Latest Statuses
                  </button>
                  <p className="text-[10px] text-gray-400 italic">
                    💡 Pulls any check-in modifications/manual confirmation codes directly from the sheet columns!
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-charcoal">Option A: Auto-Create Database</h4>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                        Generate a pre-formatted bookings spreadsheet containing correct headers and real-time validation checks.
                      </p>
                    </div>
                    <button
                      onClick={handleCreateNewSheet}
                      disabled={loading}
                      className="mt-4 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/15 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" /> Create New Spreadsheet
                    </button>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
                    <h4 className="text-xs font-bold text-charcoal">Option B: Link Existing Sheet</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Enter the ID of an existing Google Spreadsheet to sync booking logs.
                    </p>
                    <input
                      type="text"
                      placeholder="Spreadsheet Unique ID..."
                      value={manualSpreadsheetId}
                      onChange={(e) => setManualSpreadsheetId(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-slate-50 text-charcoal font-mono focus:outline-none focus:border-sunset"
                    />
                    <button
                      onClick={handleLinkManualSheet}
                      disabled={loading || !manualSpreadsheetId.trim()}
                      className="w-full py-2 rounded-xl bg-charcoal hover:bg-charcoal/90 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Link Spreadsheet ID
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Owner SMS Settings */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-orange-50 text-sunset text-[10px] font-bold flex items-center justify-center">3</span>
              Owner SMS Alert Notification
            </h3>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-sunset" /> Registered Phone Number (SMS)
                </label>
                <input
                  type="text"
                  value={ownerSettings.ownerPhone}
                  onChange={(e) => bookingStore.updateOwnerSettings({ ownerPhone: e.target.value })}
                  placeholder="+63 917 123 4567"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-charcoal font-semibold focus:outline-none focus:border-sunset"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Notification Format / Channel
                </label>
                <select
                  value={ownerSettings.notificationPlatform}
                  onChange={(e) => bookingStore.updateOwnerSettings({ notificationPlatform: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-charcoal focus:outline-none focus:border-sunset"
                >
                  <option value="SMS">SMS Gateway Alert (Simulated Logs)</option>
                  <option value="Messenger">Messenger Direct (Chat Simulation)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 4: Real-time Terminal Log Console */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-sunset" />
              Live Backend Verification Console
            </h3>
            <div className="bg-charcoal text-green-400 p-4 rounded-2xl font-mono text-[10px] space-y-1.5 max-h-40 overflow-y-auto shadow-inner border border-gray-800">
              {logs.length === 0 ? (
                <div className="text-gray-500 italic">No activity logged. Trigger a booking inquiry to watch terminal outputs...</div>
              ) : (
                logs.slice(-6).reverse().map((log) => (
                  <div key={log.id} className="leading-relaxed border-b border-white/5 pb-1 last:border-0">
                    <span className="text-gray-500 mr-1">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={`font-bold mr-1 ${
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'warning' ? 'text-amber-400' : 'text-blue-400'
                    }`}>
                      {log.type.toUpperCase()}:
                    </span>
                    <span className="text-gray-300">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between rounded-b-3xl">
          <p className="text-[10px] text-gray-400 max-w-sm">
            All spreadsheet credentials and owner configurations are safely stored only in your browser's private local state. No third-party servers are involved.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-charcoal hover:bg-charcoal/90 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>

      </div>
    </div>
  );
}
