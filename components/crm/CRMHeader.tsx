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
  const [searchQuery, setSearchQuery] = useState('');

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

  const roleMeta = ROLE_LABELS[currentUser.role];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Left: Mobile Menu Toggle + Branding */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 group" title="Return to Public Website">
                <div className="p-1.5 bg-white/10 rounded-xl border border-white/20 group-hover:scale-105 transition-transform">
                  <Logo className="h-8 w-8 sm:h-9 sm:w-9" />
                </div>
              </a>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black tracking-tight uppercase text-white">
                    GMEC Regulatory Cadastre &amp; CRM
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase tracking-wider">
                    v2.4 Statutory
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
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
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Role Switcher, Notifications & User Session */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${roleMeta.badgeColor}`}
                title="Switch active role for testing or administrative handover"
              >
                <Shield size={13} className="shrink-0" />
                <span className="hidden xl:inline">{roleMeta.label}</span>
                <span className="xl:hidden uppercase text-[10px]">{currentUser.role.replace('_', ' ')}</span>
                <ChevronDown size={13} className="shrink-0 opacity-70" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Switch Active System Role:
                  </div>
                  <div className="space-y-1 mt-1">
                    {(
                      [
                        'super_admin',
                        'administrator',
                        'it_department',
                        'registry_department',
                        'compliance_officer',
                        'management',
                      ] as UserRole[]
                    ).map((r) => {
                      const isCurrent = currentUser.role === r;
                      const meta = ROLE_LABELS[r];
                      return (
                        <button
                          key={r}
                          onClick={() => handleRoleChange(r)}
                          className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                            isCurrent
                              ? 'bg-emerald-600/20 text-emerald-300 font-bold border border-emerald-500/30'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <Shield size={14} className={`mt-0.5 shrink-0 ${isCurrent ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <div className="min-w-0">
                            <div className="font-bold">{meta.label}</div>
                            <div className="text-[10px] text-slate-400 truncate font-normal">
                              {meta.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Statutory Reminders & Alerts"
                aria-label="View notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                      Statutory Notifications
                    </span>
                    <button
                      onClick={() => crmService.clearAllNotifications()}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold"
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
                            setShowNotifMenu(false);
                          }}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors border ${
                            n.read
                              ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                              : 'bg-slate-800 border-slate-700 text-slate-200'
                          } hover:border-emerald-500/50`}
                        >
                          <div className="flex items-start gap-2">
                            {n.type === 'critical' ? (
                              <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                            ) : n.type === 'warning' ? (
                              <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                            ) : (
                              <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-white text-[11px]">{n.title}</p>
                              <p className="text-[10px] text-slate-300 leading-relaxed mt-0.5">{n.message}</p>
                              <span className="text-[9px] text-slate-500 mt-1 block">{n.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Session Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-white truncate max-w-[130px]">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[130px]">{currentUser.department}</div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700/60 transition-colors"
                title="Sign out of CRM"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

