import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileCheck2,
  Users2,
  Briefcase,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../../types/crm';
import { crmService, ROLE_LABELS } from '../../lib/crmService';
import { INITIAL_CRM_USERS } from '../../lib/crmData';
import Logo from '../Logo';

interface CRMLoginProps {
  onLoginSuccess: () => void;
}

export const CRMLogin: React.FC<CRMLoginProps> = ({ onLoginSuccess }) => {
  // Default to Super Admin Daniel Bofosu Jr.
  const [email, setEmail] = useState('danielbofosujr@geominingec.com');
  const [password, setPassword] = useState('DBOJ@GMEC#1234');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'super_admin' | 'executive' | 'administrator' | 'registry'
  >('all');

  const handleSelectUser = (user: (typeof INITIAL_CRM_USERS)[number]) => {
    setEmail(user.email);
    setPassword(user.defaultPassword);
    setError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = crmService.login(email, password);
      setIsLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 350);
  };

  // Filtered users for quick selector
  const filteredUsers = INITIAL_CRM_USERS.filter((u) => {
    if (selectedCategory === 'super_admin') return u.role === 'super_admin';
    if (selectedCategory === 'executive') return u.role === 'management';
    if (selectedCategory === 'administrator') return u.role === 'administrator';
    if (selectedCategory === 'registry') return u.role === 'registry_department';
    return true;
  });

  const currentUserMeta = INITIAL_CRM_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#fff] text-slate-800 font-sans selection:bg-[#2d5a27] selection:text-white flex flex-col justify-center py-10 sm:py-16 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient background glows tailored for clean #fff background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-gradient-to-b from-emerald-100/60 via-emerald-50/40 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-[-100px] w-96 h-96 bg-amber-100/50 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-[-100px] w-96 h-96 bg-emerald-100/40 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Top Branding Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center relative z-10 px-4">
        <div className="flex justify-center mb-4">
          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xl ring-1 ring-slate-100">
            <Logo className="h-16 w-16 md:h-20 md:w-20" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#2d5a27] text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <Shield size={13} className="text-[#2d5a27]" />
          <span>Republic of Liberia • Mining Cadastre &amp; Corporate CRM</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-tight">
          GMEC Regulatory{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d5a27] via-emerald-700 to-amber-600">
            Cadastre &amp; CRM Portal
          </span>
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Secure executive access for Super Admins, Executive Directorate, System Administration, and the Registry Department.
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4 relative z-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6 ring-1 ring-slate-100">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2d5a27] via-emerald-500 to-amber-500" />

          {/* Quick Authorized Personnel Filter Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <UserCheck size={14} className="text-[#2d5a27]" />
                <span>Authorized Personnel Quick-Select:</span>
              </label>
              <span className="text-[11px] text-slate-500 font-semibold">
                {INITIAL_CRM_USERS.length} Registered Officers
              </span>
            </div>

            {/* Department Filter Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                { id: 'all', label: 'All Accounts' },
                { id: 'super_admin', label: 'Super Admin (3)' },
                { id: 'executive', label: 'Executive Director (1)' },
                { id: 'administrator', label: 'Administrator (1)' },
                { id: 'registry', label: 'Registry Dept (5)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                    selectedCategory === cat.id
                      ? 'bg-[#2d5a27] text-white border-[#2d5a27] shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Officer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
              {filteredUsers.map((u) => {
                const isSelected = email.toLowerCase() === u.email.toLowerCase();
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-emerald-50/80 border-[#2d5a27] text-slate-900 shadow-md ring-1 ring-[#2d5a27]/30'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-black ${
                        isSelected
                          ? 'bg-[#2d5a27] text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {u.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black truncate text-slate-900">
                          {u.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2
                            size={13}
                            className="text-[#2d5a27] shrink-0"
                          />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-mono">
                        {u.email}
                      </div>
                      <div className="text-[10px] font-bold text-[#2d5a27] truncate mt-0.5">
                        {u.department}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-2xl animate-in fade-in shadow-sm">
              <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Authorized Corporate Email / Username
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 focus:bg-white font-mono transition-all"
                  placeholder="name@geominingec.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                  Security Passkey
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#2d5a27] font-semibold transition-colors"
                >
                  {showPassword ? (
                    <>
                      <EyeOff size={13} />
                      <span>Hide passkey</span>
                    </>
                  ) : (
                    <>
                      <Eye size={13} />
                      <span>Show passkey</span>
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-12 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 focus:bg-white font-mono transition-all"
                  placeholder="Security Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-4 px-4 rounded-xl font-black text-xs uppercase tracking-widest bg-[#2d5a27] hover:bg-emerald-800 text-white shadow-xl shadow-emerald-950/20 hover:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 group active:scale-[0.99] cursor-pointer border border-emerald-600/30"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying GMEC Credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Regulatory Cadastre &amp; CRM</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform text-amber-300"
                  />
                </>
              )}
            </button>
          </form>

          {/* Active Selection Details Badge */}
          {currentUserMeta && (
            <div className="pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-500 font-medium">Selected Official:</span>
                <span className="text-[#2d5a27] font-black">
                  {currentUserMeta.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Department Role:</span>
                <span className="text-amber-700 font-bold">
                  {ROLE_LABELS[currentUserMeta.role].label}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-2 font-normal leading-relaxed">
                {ROLE_LABELS[currentUserMeta.role].description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRMLogin;
