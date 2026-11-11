import React, { useState } from 'react';
import {
  Bell,
  Search,
  LogOut,
  Shield,
  ChevronDown,
  Menu,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  UserCheck,
  RefreshCw,
  Key,
  Lock,
  Eye,
  EyeOff,
  User,
  Check,
} from 'lucide-react';
import { CRMUser, UserRole } from '../../types/crm';
import { crmService, ROLE_LABELS } from '../../lib/crmService';
import Logo from '../Logo';

interface CRMHeaderProps {
  currentUser: CRMUser;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onSelectTab: (tab: string) => void;
  onSearch: (query: string) => void;
}

export const CRMHeader: React.FC<CRMHeaderProps> = ({
  currentUser,
  onLogout,
  onToggleSidebar,
  onSelectTab,
  onSearch,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const notifications = crmService.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleChange = (role: UserRole) => {
    crmService.switchRoleUser(role);
    setShowRoleMenu(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword.trim()) {
      setPasswordStatus({ type: 'error', message: 'Please enter your current password.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match. Please verify.' });
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordStatus({ type: 'error', message: 'New password must be different from current password.' });
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const res = crmService.changeUserPassword(currentUser.id, currentPassword, newPassword);
      if (res.success) {
        setPasswordStatus({
          type: 'success',
          message: 'Password successfully updated! Your new password has been saved.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordStatus(null);
        }, 1800);
      } else {
        setPasswordStatus({ type: 'error', message: res.error || 'Failed to update password.' });
      }
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err?.message || 'Error updating password.' });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const roleMeta = ROLE_LABELS[currentUser.role];

  return (
    <header className="sticky top-0 z-30 bg-[#2a602f] border-b border-[#235027] text-white shadow-md font-['Outfit',sans-serif]">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Left: Mobile Menu Toggle + Branding */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 group" title="Return to Public Website">
                <div className="p-1.5 bg-white rounded-xl border border-white/40 shadow-sm group-hover:scale-105 transition-transform">
                  <Logo className="h-8 w-8 sm:h-9 sm:w-9" />
                </div>
              </a>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black tracking-tight uppercase text-white">
                    GMEC Regulatory Cadastre &amp; CRM
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffc30d] text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                    v2.4 Statutory
                  </span>
                </div>
                <p className="text-[10px] text-emerald-100 font-medium">
                  Mining Licenses • Corporate Registration • EPA Compliance • Client Portal
                </p>
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search companies, licenses, clients, coordinates..."
                className="w-full bg-white border border-emerald-900/40 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ffc30d] focus:ring-2 focus:ring-[#ffc30d]/30 transition-all font-medium shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Role Switcher, Notifications & User Session */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Role Badge / Super Admin Switcher */}
            <div className="relative">
              {currentUser.role === 'super_admin' ? (
                <>
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white text-slate-900 border border-slate-200 text-xs font-bold transition-all shadow-sm hover:bg-slate-50 cursor-pointer"
                    title="Super Admin Role Preview Switcher"
                  >
                    <Shield size={13} className="shrink-0 text-[#2a602f]" />
                    <span className="hidden xl:inline">{roleMeta.label}</span>
                    <span className="xl:hidden uppercase text-[10px]">Super Admin</span>
                    <ChevronDown size={13} className="shrink-0 opacity-60" />
                  </button>

                  {showRoleMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Super Admin Role Preview:
                      </div>
                      <div className="space-y-1 mt-1">
                        {(
                          [
                            'super_admin',
                            'management',
                            'administrator',
                            'registry_department',
                            'compliance_officer',
                            'it_department',
                          ] as UserRole[]
                        ).map((r) => {
                          const isCurrent = currentUser.role === r;
                          const meta = ROLE_LABELS[r];
                          return (
                            <button
                              key={r}
                              onClick={() => handleRoleChange(r)}
                              className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                                isCurrent
                                  ? 'bg-emerald-50 text-[#2a602f] font-bold border border-emerald-200 shadow-sm'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <Shield size={14} className={`mt-0.5 shrink-0 ${isCurrent ? 'text-[#2a602f]' : 'text-slate-400'}`} />
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900">{meta.label}</div>
                                <div className="text-[10px] text-slate-500 truncate font-normal">
                                  {meta.description}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white text-slate-900 border border-slate-200 text-xs font-bold shadow-sm"
                  title="Official Departmental Credential Role"
                >
                  <Shield size={13} className="shrink-0 text-[#2a602f]" />
                  <span className="hidden xl:inline">{roleMeta.label}</span>
                  <span className="xl:hidden uppercase text-[10px]">{currentUser.role.replace('_', ' ')}</span>
                </div>
              )}
            </div>

            {/* Super Admin Threat Surveillance Radar Button */}
            {currentUser.role === 'super_admin' && (
              <button
                onClick={() => onSelectTab('security')}
                className={`relative p-2 rounded-xl transition-colors shadow-sm flex items-center justify-center ${
                  crmService.getFailedLoginAttempts().length > 0
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
                title="Super Admin Threat Monitoring & Failed Login Telemetry"
                aria-label="Security Monitoring"
              >
                <Shield size={18} className="text-[#ffc30d]" />
                {crmService.getFailedLoginAttempts().length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 border border-white text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {crmService.getFailedLoginAttempts().length}
                  </span>
                )}
              </button>
            )}

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors shadow-sm"
                title="Statutory Reminders & Alerts"
                aria-label="View notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ffc30d] text-slate-950 text-[9px] font-black flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 text-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Statutory Notifications
                    </span>
                    <button
                      onClick={() => crmService.clearAllNotifications()}
                      className="text-[10px] text-[#2a602f] hover:underline font-bold"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No active notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            crmService.markNotificationAsRead(n.id);
                            if (n.relatedModule === 'Mining Licenses') onSelectTab('licenses');
                            else if (n.relatedModule === 'Company Registration') onSelectTab('companies');
                            else if (n.relatedModule === 'Daily Tasks') onSelectTab('tasks');
                            setShowNotifMenu(false);
                          }}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors border ${
                            n.read
                              ? 'bg-slate-50 border-slate-200 text-slate-500'
                              : 'bg-emerald-50/60 border-emerald-200 text-slate-800 font-medium'
                          } hover:border-[#2a602f]`}
                        >
                          <div className="flex items-start gap-2">
                            {n.type === 'critical' ? (
                              <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                            ) : n.type === 'warning' ? (
                              <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            ) : (
                              <Info size={14} className="text-[#2a602f] shrink-0 mt-0.5" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-900 text-[11px]">{n.title}</p>
                              <p className="text-[10px] text-slate-600 leading-relaxed mt-0.5">{n.message}</p>
                              <span className="text-[9px] text-slate-400 mt-1 block">{n.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* D. Staff Self-Service Profile & Password Dropdown */}
            <div className="relative pl-2 border-l border-white/20">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Account Settings & Password"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#ffc30d] text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('') || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-black text-white truncate max-w-[130px] leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-emerald-200 font-bold truncate max-w-[130px]">
                    {currentUser.employeeId || currentUser.id} • {currentUser.department}
                  </div>
                </div>
                <ChevronDown size={14} className="hidden sm:block shrink-0 opacity-70" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-slate-100 bg-slate-50/70 rounded-xl mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#ffc30d] text-slate-950 text-[9px] font-black uppercase">
                        {currentUser.employeeId || currentUser.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{currentUser.email}</div>
                    <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-1">
                      {roleMeta.label}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setPasswordStatus(null);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setShowPasswordModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-left"
                    >
                      <Key size={15} className="text-[#2a602f]" />
                      <span>Change My Password</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onSelectTab('tasks');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-left"
                    >
                      <User size={15} className="text-blue-600" />
                      <span>My Assigned Tasks</span>
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={15} className="text-rose-500" />
                        <span>Sign Out of CRM</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── D. Staff Self-Service Password Change Modal ─────────────────── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setShowPasswordModal(false)}
          />

          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 border border-slate-100 font-['Outfit',sans-serif] text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#2a602f] border border-emerald-200 flex items-center justify-center shadow-xs">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Change Staff Password
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Self-service credential update for {currentUser.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Status alerts */}
            {passwordStatus && (
              <div
                className={`mb-5 p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2.5 border ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {passwordStatus.type === 'success' ? (
                  <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{passwordStatus.message}</span>
              </div>
            )}

            {/* Password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Employee ID Tag */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Account Identifier:</span>
                <span className="font-mono font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                  {currentUser.employeeId || currentUser.id} • {currentUser.email}
                </span>
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password (e.g. C@GMEC1234)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2a602f] focus:ring-2 focus:ring-[#2a602f]/20 font-medium transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  New Private Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2a602f] focus:ring-2 focus:ring-[#2a602f]/20 font-medium transition-all"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        newPassword.length < 8
                          ? 'bg-rose-500'
                          : newPassword.length < 12
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="font-bold text-slate-500">
                      {newPassword.length < 8 ? 'Too short' : newPassword.length < 12 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2a602f] focus:ring-2 focus:ring-[#2a602f]/20 font-medium transition-all"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="px-5 py-2.5 rounded-xl bg-[#2a602f] hover:bg-[#235027] text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default CRMHeader;
