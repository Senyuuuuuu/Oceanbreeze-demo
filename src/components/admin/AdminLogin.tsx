import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Mail, Lock, AlertCircle, RefreshCw, Compass } from 'lucide-react';
import { bookingStore } from '../../lib/bookingStore';
import { StaffAccount } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (user: StaffAccount) => void;
  onBackToHome: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToHome }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Rate limiting states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  // Auto-decrement lockout timer
  useEffect(() => {
    if (lockoutTimeLeft > 0) {
      const timer = setTimeout(() => {
        setLockoutTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutTimeLeft]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (lockoutTimeLeft > 0) {
      setErrorMsg(`Too many failed attempts. Locked out. Please wait ${lockoutTimeLeft}s.`);
      return;
    }

    if (!email || !password) {
      setErrorMsg('Please supply both your email address and secure passcode.');
      return;
    }

    setIsLoading(true);

    // Simulate server cryptographic delay (security best practice against timing attacks)
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const staffList = bookingStore.getStaffAccounts();
      const match = staffList.find(s => s.email.toLowerCase() === email.toLowerCase().trim());
      const expectedPassword = match?.password || 'admin';

      if (match && expectedPassword === password) {
        // Log log entry
        bookingStore.addLog('auth', `Staff session authorized: ${match.name} (${match.role})`);
        
        // Reset rate limiting
        setFailedAttempts(0);
        onLoginSuccess(match);
      } else {
        // Increment failures
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        
        if (nextAttempts >= 5) {
          setLockoutTimeLeft(30); // 30s lockout
          setErrorMsg('Security lockout: 5 failed attempts. Access blocked for 30 seconds.');
          bookingStore.addLog('warning', `Brute force warning: 5 failed admin login attempts for ${email}`);
        } else {
          setErrorMsg(`Invalid credentials. Attempt ${nextAttempts} of 5 before lockout.`);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication framework failure.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-sunset selection:text-white" id="admin-login">
      {/* Visual background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-100/40 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-white p-8 rounded-2xl border border-slate-100 shadow-xl"
      >
        {/* Brand logo */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 bg-charcoal text-amber-500 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-charcoal/10">
            <Shield className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal">Resort Management</h2>
            <p className="font-sans text-[11px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Staff Secure Authentication Node</p>
          </div>
        </div>

        {/* Error Alert Box */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Access Email</label>
            <div className="relative">
              <Mail className="w-4.5 h-4.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                disabled={isLoading || lockoutTimeLeft > 0}
                placeholder="e.g. owner@oceanbreeze.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/85 pl-10 pr-3 py-2.5 rounded-xl text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Secure Passcode</label>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                disabled={isLoading || lockoutTimeLeft > 0}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/85 pl-10 pr-3 py-2.5 rounded-xl text-xs font-sans text-charcoal focus:bg-white focus:border-sunset focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || lockoutTimeLeft > 0}
            className={`w-full py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
              lockoutTimeLeft > 0 
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-sunset hover:bg-sunset/92 text-white shadow-md shadow-sunset/15 active:scale-98'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Decrypting session...</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Authorize Access</span>
              </>
            )}
          </button>
        </form>

        {/* Back to guest site footer */}
        <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-center">
          <button
            onClick={onBackToHome}
            className="text-[11px] font-sans font-bold uppercase tracking-wider text-gray-400 hover:text-sunset transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" /> Return to Guest Site
          </button>
        </div>
      </motion.div>
    </div>
  );
}
