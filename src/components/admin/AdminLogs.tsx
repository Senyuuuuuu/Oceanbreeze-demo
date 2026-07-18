import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, Clock, Search, Filter, AlertTriangle, Info, Trash2, 
  Key, Save, RefreshCw, FileText, Download, CheckSquare
} from 'lucide-react';
import { bookingStore, ActivityLog } from '../../lib/bookingStore';

interface AdminLogsProps {
  onRefresh: () => void;
}

export default function AdminLogs({ onRefresh }: AdminLogsProps) {
  const [logs, setLogs] = useState<ActivityLog[]>(() => bookingStore.getLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const refreshLogs = () => {
    const list = bookingStore.getLogs();
    setLogs(list);
    onRefresh();
  };

  const handleClearLogs = () => {
    if (confirm('Are you absolutely sure you want to completely erase the security audit trails? This is a sensitive compliance action.')) {
      bookingStore.clearLogs();
      bookingStore.addLog('deletion', 'Security audit log cleared by management.');
      refreshLogs();
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.timestamp.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const warningsCount = logs.filter(l => l.type === 'warning').length;

  return (
    <div className="space-y-6" id="admin-logs">
      {/* Title row */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-charcoal">Resort Security Audit Trail</h3>
          <p className="font-sans text-xs text-gray-500 mt-1">Immutable logging of check-ins, price adjustments, auth attempts, and sync actions.</p>
        </div>

        <button
          onClick={handleClearLogs}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-rose-100 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Erase Audit Ledger
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
            <CheckSquare className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total Audits Processed</span>
            <span className="text-xs font-bold text-charcoal block mt-0.5">{logs.length} operations</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Security Warnings</span>
            <span className="text-xs font-bold text-rose-800 block mt-0.5">{warningsCount} warnings logged</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">System Health</span>
            <span className="text-xs font-bold text-emerald-800 block mt-0.5">Compliant & Logging</span>
          </div>
        </div>
      </div>

      {/* Filters & search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-xs font-sans text-charcoal focus:bg-white focus:outline-none focus:border-sunset transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-charcoal text-[11px] cursor-pointer"
            >
              <option value="All">All Operations</option>
              <option value="info">Info Logs</option>
              <option value="auth">Auth Audits</option>
              <option value="warning">Warnings</option>
              <option value="update">Updates</option>
              <option value="deletion">Deletions</option>
            </select>
          </div>
        </div>

        {/* List ledger entries */}
        <div className="divide-y divide-slate-50 font-mono text-[11px]">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-sans text-xs">
              <Shield className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No security entries match your filtering parameters.
            </div>
          ) : (
            filteredLogs.map(log => {
              let icon = <Info className="w-3.5 h-3.5 text-slate-500" />;
              let textClass = 'text-gray-600';
              let badgeBg = 'bg-slate-50 text-slate-600 border-slate-100';

              if (log.type === 'auth') {
                icon = <Key className="w-3.5 h-3.5 text-sky-600" />;
                textClass = 'text-sky-900 font-semibold';
                badgeBg = 'bg-sky-50 text-sky-800 border-sky-100';
              } else if (log.type === 'warning') {
                icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />;
                textClass = 'text-rose-900 font-bold';
                badgeBg = 'bg-rose-50 text-rose-800 border-rose-100';
              } else if (log.type === 'update') {
                icon = <Save className="w-3.5 h-3.5 text-amber-600" />;
                textClass = 'text-amber-900';
                badgeBg = 'bg-amber-50 text-amber-800 border-amber-100';
              } else if (log.type === 'deletion') {
                icon = <Trash2 className="w-3.5 h-3.5 text-red-600" />;
                textClass = 'text-red-900';
                badgeBg = 'bg-red-50 text-red-800 border-red-100';
              }

              return (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">{icon}</div>
                    <span className={`${textClass} leading-relaxed`}>{log.message}</span>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-slate-100">
                      {log.type}
                    </span>
                    <span className="text-gray-400 shrink-0 font-sans tracking-wide text-[10px]">{log.timestamp}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
