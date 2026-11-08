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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-[#1b3817] text-white flex flex-col justify-center py-10 sm:py-14 sm:px-6 lg:px-8 selection:bg-emerald-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Top Branding Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center relative z-10 px-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl ring-1 ring-white/10">
            <Logo className="h-16 w-16" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-widest mb-3">
          <Shield size={13} className="text-emerald-400" />
          <span>Republic of Liberia • Mining Cadastre &amp; Corporate CRM</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
          GMEC Regulatory{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
            Cadastre &amp; CRM Portal
          </span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Secure executive access for Super Admins, Executive Directorate, System Administration, and the Registry Department.
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4 relative z-10">
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Quick Authorized Personnel Filter Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <UserCheck size={13} className="text-emerald-400" />
                <span>Authorized Personnel Quick-Select:</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
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
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Officer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {filteredUsers.map((u) => {
                const isSelected = email.toLowerCase() === u.email.toLowerCase();
                const roleBadge = ROLE_LABELS[u.role];
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-950/80 to-slate-800 text-white border-emerald-400 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-500/30'
                        : 'bg-slate-800/40 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-black ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-700 text-slate-300'
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
                        <span className="text-xs font-bold truncate text-white">
                          {u.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2
                            size={12}
                            className="text-emerald-400 shrink-0"
                          />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {u.email}
                      </div>
                      <div className="text-[9px] font-semibold text-emerald-400/90 truncate mt-0.5">
                        {u.department}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/40 text-red-300 text-xs font-medium p-3.5 rounded-xl animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5">
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
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-all"
                  placeholder="name@geominingec.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300">
                  Security Passkey
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  {showPassword ? (
                    <>
                      <EyeOff size={12} />
                      <span>Hide passkey</span>
                    </>
                  ) : (
                    <>
                      <Eye size={12} />
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
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-all"
                  placeholder="Security Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-4 px-4 rounded-xl font-black text-xs uppercase tracking-widest bg-gradient-to-r from-emerald-600 via-[#2d5a27] to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white shadow-xl shadow-emerald-950/50 hover:shadow-emerald-900/60 transition-all flex items-center justify-center gap-2 group active:scale-[0.99] cursor-pointer"
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
            <div className="pt-4 border-t border-slate-800 bg-slate-950/60 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-slate-400 font-medium">Selected Official:</span>
                <span className="text-emerald-400 font-bold">
                  {currentUserMeta.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Department Role:</span>
                <span className="text-amber-400 font-semibold">
                  {ROLE_LABELS[currentUserMeta.role].label}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-2 font-normal">
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
