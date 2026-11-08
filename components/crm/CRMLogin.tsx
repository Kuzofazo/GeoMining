import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import Logo from '../Logo';

interface CRMLoginProps {
  onLoginSuccess: () => void;
}

export const CRMLogin: React.FC<CRMLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your corporate email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = crmService.login(email.trim(), password);
      setIsLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || 'Invalid credentials. Please verify your email and password.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#fff] text-slate-800 font-sans selection:bg-[#2d5a27] selection:text-white flex flex-col justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle ambient corporate background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-gradient-to-b from-emerald-100/50 via-emerald-50/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-[-100px] w-96 h-96 bg-amber-100/40 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-[-100px] w-96 h-96 bg-emerald-100/30 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Welcome Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xl ring-1 ring-slate-100/80">
              <Logo className="h-16 w-16 md:h-20 md:w-20" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#2d5a27] text-[11px] font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Shield size={13} className="text-[#2d5a27]" />
            <span>Authorized Personnel Only</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d5a27] via-emerald-700 to-amber-600">
              GEOMINING &amp; ENVIRONMENTAL CONSULTANCY INC
            </span>
          </h1>

          <p className="mt-2 text-sm sm:text-base font-bold text-slate-700 uppercase tracking-wider">
            CRM Portal
          </p>

          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Please enter your authorized corporate credentials to sign in.
          </p>
        </div>

        {/* Secure Login Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden ring-1 ring-slate-100">
          {/* Top subtle brand bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2d5a27] via-emerald-500 to-amber-500" />

          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-2xl animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="crm-email"
                className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2"
              >
                Corporate Email / Username
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  id="crm-email"
                  type="email"
                  required
                  autoComplete="username"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 focus:bg-white transition-all font-medium"
                  placeholder="name@geominingec.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="crm-password"
                  className="block text-xs font-black uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#2d5a27] font-semibold transition-colors"
                >
                  {showPassword ? (
                    <>
                      <EyeOff size={13} />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye size={13} />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  id="crm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-12 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 focus:bg-white transition-all font-mono"
                  placeholder="Enter your security passkey"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-4 px-4 rounded-xl font-black text-xs uppercase tracking-widest bg-[#2d5a27] hover:bg-emerald-800 text-white shadow-xl shadow-emerald-950/20 hover:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 group active:scale-[0.99] cursor-pointer border border-emerald-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform text-amber-300"
                  />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Protected by TLS 256-bit statutory encryption. Unauthorized access attempts are monitored and recorded in the GMEC audit logs.
            </p>
          </div>
        </div>

        {/* Back to Website link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-[#2d5a27] transition-colors"
          >
            ← Return to GMEC Public Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default CRMLogin;
