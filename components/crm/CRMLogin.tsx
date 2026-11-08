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
} from 'lucide-react';
import { UserRole } from '../../types/crm';
import { crmService, ROLE_LABELS } from '../../lib/crmService';
import { INITIAL_CRM_USERS } from '../../lib/crmData';
import Logo from '../Logo';

interface CRMLoginProps {
  onLoginSuccess: () => void;
}

export const CRMLogin: React.FC<CRMLoginProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('administrator');
  const [email, setEmail] = useState('admin@geominingec.com');
  const [password, setPassword] = useState('GMEC@Admin2026!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const preset = INITIAL_CRM_USERS.find((u) => u.role === role);
    if (preset) {
      setEmail(preset.email);
      setPassword(preset.defaultPassword);
      setError(null);
    }
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
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-[#1b3817] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-emerald-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl ring-1 ring-white/10">
            <Logo className="h-16 w-16" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-widest mb-3">
          <Shield size={13} className="text-emerald-400" />
          <span>Statutory Enterprise System</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          GMEC Integrated{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
            Regulatory CRM
          </span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
          Company Registration, Mining License Cadastre, Statutory Compliance &amp; Client Management.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Role selector tabs */}
          <div className="mb-6">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Select Departmental Role for Access:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  { role: 'administrator', label: 'Admin', icon: Shield },
                  { role: 'it_department', label: 'IT Security', icon: KeyRound },
                  { role: 'registry_department', label: 'Registry', icon: Building2 },
                  { role: 'compliance_officer', label: 'Compliance', icon: FileCheck2 },
                  { role: 'management', label: 'Management', icon: Briefcase },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleRoleSelect(item.role)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left border ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#2d5a27] to-emerald-700 text-white border-emerald-400 shadow-lg shadow-emerald-900/30'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={14} className={isSelected ? 'text-amber-300' : 'text-slate-400'} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">
              Active role capability:{' '}
              <span className="text-emerald-300 font-bold">
                {ROLE_LABELS[selectedRole].description}
              </span>
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/40 text-red-300 text-xs font-medium p-3.5 rounded-xl">
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5">
                Authorized Corporate Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium transition-all"
                  placeholder="name@geominingec.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300">
                  Security Passkey
                </label>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Preset loaded
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-widest bg-gradient-to-r from-emerald-600 via-[#2d5a27] to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white shadow-xl shadow-emerald-950/50 hover:shadow-emerald-900/60 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Access Secure Cadastre &amp; CRM</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-amber-300" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Card */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 bg-slate-950/50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-[10px] font-black uppercase tracking-wider mb-2">
              <CheckCircle2 size={13} />
              <span>Multi-Role Access Configured</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <p>
                Signed role: <strong className="text-white">{ROLE_LABELS[selectedRole].label}</strong>
              </p>
              <p>
                Email: <span className="font-mono text-emerald-300">{email}</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                You can switch between any of the 5 roles instantly once signed in via the top navigation bar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

