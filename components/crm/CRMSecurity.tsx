import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  ShieldCheck,
  KeyRound,
  Lock,
  Search,
  Filter,
  Activity,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  Clock,
  UserCheck,
  FileCheck2,
  AlertCircle,
  Download,
  Upload,
  Volume2,
  VolumeX,
  Bell,
  Globe,
  Monitor,
  Smartphone,
  AlertTriangle,
  RotateCcw,
  Unlock,
  Radio,
  FileDown,
} from 'lucide-react';
import { crmService, ROLE_PERMISSIONS, ROLE_LABELS } from '../../lib/crmService';
import { UserRole, CRMUser, FailedLoginAttempt, SecurityAlert, AccountLockout, ActiveSession } from '../../types/crm';
import { securityAlarm } from '../../lib/audioAlarm';

export const CRMSecurity: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'monitoring' | 'users' | 'matrix' | 'audit_logs' | 'backup'>('monitoring');
  const [auditSearch, setAuditSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(securityAlarm.isAlarmActive());
  const [isAlarmMuted, setIsAlarmMuted] = useState(securityAlarm.isAlarmMuted());
  const [backupRestoreError, setBackupRestoreError] = useState<string | null>(null);
  const [backupRestoreSuccess, setBackupRestoreSuccess] = useState<string | null>(null);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'compliance_officer' as UserRole,
    department: 'Statutory Compliance',
    phone: '',
    password: '',
  });

  const currentUser = crmService.getCurrentUser();
  const canAccessSecurity = crmService.checkPermission('canViewSecurityDashboard');
  const canManageUsers = crmService.checkPermission('canManageUsers');

  // Alarm subscription
  useEffect(() => {
    const unsub = securityAlarm.subscribe((ringing, muted) => {
      setIsAlarmPlaying(ringing);
      setIsAlarmMuted(muted);
    });
    return () => unsub();
  }, []);

  // Access check: only Super Admin and authorized IT personnel
  if (!canAccessSecurity) {
    return (
      <div className="bg-white border border-red-200 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm my-8">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <Lock size={32} />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
          Restricted Security Zone
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
          Access to the GMEC Security Monitoring, User Vault, and Tamper-Resistant Audit Telemetry is strictly limited to authenticated <span className="font-bold text-red-700">Super Administrators</span>.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 font-mono">
          <span>Active Role:</span>
          <span className="font-bold text-slate-800 uppercase">{currentUser?.role}</span>
          <span>• Action Logged to Central Cadastre</span>
        </div>
      </div>
    );
  }

  const users = crmService.getUsers();
  const auditLogs = crmService.getAuditLogs();
  const failedLogins = crmService.getFailedLoginAttempts();
  const securityAlerts = crmService.getSecurityAlerts();
  const lockouts = crmService.getAccountLockouts();
  const activeSessions = crmService.getActiveSessions();

  // Filter audit logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      auditSearch === '' ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.targetRecordName && log.targetRecordName.toLowerCase().includes(auditSearch.toLowerCase())) ||
      log.module.toLowerCase().includes(auditSearch.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;

    crmService.addUser(
      {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        phone: newUser.phone,
        status: 'active',
      },
      newUser.password
    );

    setShowAddUserModal(false);
    setNewUser({
      name: '',
      email: '',
      role: 'compliance_officer',
      department: 'Statutory Compliance',
      phone: '',
      password: '',
    });
  };

  const handleToggleUserStatus = (userId: string, currentStatus: 'active' | 'suspended') => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    crmService.updateUserStatus(userId, nextStatus);
  };

  const handleUnlockAccount = (email: string) => {
    crmService.unlockAccount(email);
  };

  const handleTerminateSession = (sessionId: string) => {
    if (confirm('Are you sure you want to terminate this active remote session? The user will be instantly logged out.')) {
      crmService.terminateSession(sessionId);
    }
  };

  const handleBackupExport = () => {
    try {
      crmService.exportSystemBackup();
      setBackupRestoreSuccess('Encrypted database disaster recovery snapshot successfully created and downloaded.');
    } catch (err: unknown) {
      setBackupRestoreError(err instanceof Error ? err.message : 'Backup export failed.');
    }
  };

  const handleBackupRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = crmService.restoreSystemBackup(content);
      if (res.success) {
        setBackupRestoreSuccess('Database successfully restored from backup snapshot.');
        setBackupRestoreError(null);
      } else {
        setBackupRestoreError(res.error || 'Restore failed.');
        setBackupRestoreSuccess(null);
      }
    };
    reader.readAsText(file);
  };

  const activeAlarmCount = securityAlerts.filter((a) => !a.acknowledged && a.requiresAlarm).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Super Admin Audible Alarm Emergency Banner */}
      {isAlarmPlaying && (
        <div className="bg-red-600 text-white p-4 sm:p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-red-400 animate-pulse">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="p-3 bg-white/20 rounded-2xl animate-bounce">
              <Radio size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-black text-sm uppercase tracking-widest text-amber-300">
                  CRITICAL SECURITY ALERT — AUDIBLE ALARM ACTIVE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
                  {activeAlarmCount} Active
                </span>
              </div>
              <p className="text-xs text-red-100 font-medium mt-0.5">
                Unauthorized or repeated failed authentication attempts detected on the Cadastre. Inspect the live telemetry log below.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => securityAlarm.toggleMute()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
            >
              {isAlarmMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isAlarmMuted ? 'Unmute Alarm' : 'Mute Tone'}</span>
            </button>

            <button
              onClick={() => crmService.dismissAllAlerts()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-red-700 hover:bg-slate-100 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <CheckCircle2 size={15} />
              <span>Acknowledge &amp; Silence</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 text-[#2a602f] border border-emerald-200 rounded-2xl shadow-sm">
              <ShieldAlert size={22} className="text-[#2a602f]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                  Security, Access Control &amp; Threat Monitoring
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                  Super Admin Exclusive
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live failed login surveillance, IP telemetry, brute-force rate limiter, remote session management, and tamper-resistant audit logs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (securityAlarm.isAlarmActive()) {
                securityAlarm.stopAlarm();
              } else {
                securityAlarm.triggerAlarm();
              }
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
            title="Test audible siren generator"
          >
            <Radio size={14} className={isAlarmPlaying ? 'text-red-600 animate-pulse' : 'text-slate-500'} />
            <span>{isAlarmPlaying ? 'Stop Siren' : 'Test Siren Tone'}</span>
          </button>

          {canManageUsers && (
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2a602f] hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <Plus size={16} className="text-[#ffc30d]" />
              <span>Provision User</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('monitoring')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
            activeSubTab === 'monitoring'
              ? 'bg-[#2a602f] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio size={14} className={failedLogins.length > 0 ? 'text-[#ffc30d]' : ''} />
          <span>Login Surveillance ({failedLogins.length})</span>
          {failedLogins.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-black">
              {failedLogins.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
            activeSubTab === 'users'
              ? 'bg-[#2a602f] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users size={14} />
          <span>Authorized Personnel ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
            activeSubTab === 'matrix'
              ? 'bg-[#2a602f] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <KeyRound size={14} />
          <span>Role Permissions Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit_logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
            activeSubTab === 'audit_logs'
              ? 'bg-[#2a602f] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity size={14} />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
            activeSubTab === 'backup'
              ? 'bg-[#2a602f] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download size={14} />
          <span>Disaster Recovery &amp; Backups</span>
        </button>
      </div>

      {/* ─── Sub Tab 1: Live Login Surveillance & Telemetry ──────────────── */}
      {activeSubTab === 'monitoring' && (
        <div className="space-y-6">
          {/* Top Threat KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Failed Login Attempts
                </span>
                <span className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
                  <AlertCircle size={16} />
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900">{failedLogins.length}</div>
              <p className="text-[10px] text-slate-500 mt-1">Logged with source IP &amp; telemetry</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Temporary Lockouts
                </span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Lock size={16} />
                </span>
              </div>
              <div className="text-2xl font-black text-amber-600">{lockouts.length}</div>
              <p className="text-[10px] text-slate-500 mt-1">Rate limited after 5 failed attempts</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Active Sessions
                </span>
                <span className="p-2 rounded-xl bg-emerald-50 text-[#2a602f] border border-emerald-200">
                  <Monitor size={16} />
                </span>
              </div>
              <div className="text-2xl font-black text-[#2a602f]">{activeSessions.length}</div>
              <p className="text-[10px] text-slate-500 mt-1">30-min auto inactivity timeout</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Brute-Force Shield
                </span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <ShieldCheck size={16} />
                </span>
              </div>
              <div className="text-2xl font-black text-blue-700">ARMED</div>
              <p className="text-[10px] text-slate-500 mt-1">Input sanitization &amp; TLS 256-bit</p>
            </div>
          </div>

          {/* Account Lockouts Section (if any) */}
          {lockouts.length > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-amber-800" />
                <h3 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                  Active Account Lockouts ({lockouts.length})
                </h3>
              </div>
              <div className="space-y-2">
                {lockouts.map((l) => (
                  <div
                    key={l.email}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white border border-amber-200 rounded-2xl text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 font-mono">{l.email}</div>
                      <div className="text-[11px] text-slate-500">
                        Locked at: {new Date(l.lockedAt).toLocaleTimeString()} • Reason: {l.reason} • Source IP: {l.clientIp}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnlockAccount(l.email)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase transition-all shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                      <Unlock size={14} />
                      <span>Unlock Account</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Failed Login Surveillance Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Unauthorized Authentication Attempts Log
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed source telemetry recorded by the GMEC security gateway upon credential rejection.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                Tracking: IP • User-Agent • ISP Geolocation
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Attempted Email</th>
                    <th className="py-3.5 px-4">Source IP Address</th>
                    <th className="py-3.5 px-4">Approximate Location</th>
                    <th className="py-3.5 px-4">Device &amp; Browser</th>
                    <th className="py-3.5 px-4">Failure Reason</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {failedLogins.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No unauthorized login attempts recorded. All authentications normal.
                      </td>
                    </tr>
                  ) : (
                    failedLogins.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                          {item.attemptedEmail}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-slate-800 whitespace-nowrap">
                          {item.ipAddress}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="text-[11px] text-slate-800 truncate" title={item.approxLocation}>
                            {item.approxLocation}
                          </div>
                          <div
                            className="text-[9px] text-slate-400 truncate cursor-help mt-0.5"
                            title={item.approxLocationDisclaimer}
                          >
                            ⚠️ Approx ISP node (No remote MAC tracked)
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-800">
                            {item.deviceType === 'Mobile' ? (
                              <Smartphone size={13} className="text-slate-400 shrink-0" />
                            ) : (
                              <Monitor size={13} className="text-slate-400 shrink-0" />
                            )}
                            <span>{item.browser}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{item.os}</div>
                        </td>
                        <td className="py-3.5 px-4 text-red-700 font-medium">
                          {item.reason}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              item.status === 'locked_out'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : item.status === 'rate_limited'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {item.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Statutory Technical Notice footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed font-normal flex items-start gap-2">
              <Globe size={13} className="text-[#2a602f] shrink-0 mt-0.5" />
              <span>
                <strong>Statutory Technical Disclosure:</strong> IP-based geolocation resolves to the nearest internet gateway and ISP exchange point. Pursuant to cybersecurity and RFC internet engineering standards, physical hardware MAC addresses are layer-2 link addresses and are not transmitted or visible over public WAN routings.
              </span>
            </div>
          </div>

          {/* Active Sessions Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Active Administrative Sessions ({activeSessions.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time active tokens. Super Admin can instantly invalidate any remote session.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Source IP</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Login Time</th>
                    <th className="py-3 px-4 text-right">Session Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {activeSessions.map((s) => {
                    const isSelf = s.email.toLowerCase() === currentUser?.email.toLowerCase();
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">
                            {s.userName} {isSelf && <span className="text-[10px] text-emerald-700 font-bold">(Current Device)</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">{s.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-100 text-slate-700">
                            {s.userRole}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-800">{s.ipAddress}</td>
                        <td className="py-3 px-4 text-[11px] text-slate-600 max-w-xs truncate">{s.approxLocation}</td>
                        <td className="py-3 px-4 text-[11px] text-slate-500">{s.loginTime}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleTerminateSession(s.id)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                          >
                            Terminate Session
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Sub Tab 2: Authorized Personnel ─────────────────────────────── */}
      {activeSubTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Authorized Departmental Personnel Accounts ({users.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-department credentials under Super Admin directory management.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Authorized Officer</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Official Email</th>
                  <th className="py-3.5 px-4">Last Active</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {users.map((u) => {
                  const roleMeta = ROLE_LABELS[u.role];
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#2a602f] text-[#ffc30d] font-black text-xs flex items-center justify-center">
                            {u.name.substring(0, 1)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              {u.name} {isCurrent && <span className="text-[10px] text-emerald-700 font-bold">(You)</span>}
                            </div>
                            <div className="text-[10px] text-slate-400">{u.phone || 'Direct extension'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${roleMeta.badgeColor}`}>
                          {roleMeta.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-semibold">{u.department}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">{u.lastLogin || 'Recent'}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {canManageUsers && !isCurrent ? (
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                              u.status === 'active'
                                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend Access' : 'Reactivate'}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Self Account</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Sub Tab 3: Role Permissions Matrix ─────────────────────────── */}
      {activeSubTab === 'matrix' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Statutory Role Permissions &amp; Access Control Matrix (RBAC)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict compartmentalization enforced at both UI view layers and internal service mutation guards.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Permission Capability</th>
                  <th className="py-3.5 px-4 text-center">Super Admin</th>
                  <th className="py-3.5 px-4 text-center">Executive Director</th>
                  <th className="py-3.5 px-4 text-center">Administrator</th>
                  <th className="py-3.5 px-4 text-center">Registry Dept</th>
                  <th className="py-3.5 px-4 text-center">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {[
                  { key: 'canManageCompanies', label: 'Company Registration (Create / Update)' },
                  { key: 'canApproveRegistrations', label: 'Official Registration Approval / Sign-off' },
                  { key: 'canManageLicenses', label: 'Mining Licenses Management (Issue / Renew)' },
                  { key: 'canApproveCompliance', label: 'Compliance Audit Approval & Obligation Waiver' },
                  { key: 'canManageClients', label: 'Client CRM Pipeline & Contracts' },
                  { key: 'canViewReports', label: 'Management Dashboard & Cadastre Reports' },
                  { key: 'canExportData', label: 'Download CSV / Export Statutory Data' },
                  { key: 'canManageUsers', label: 'User Provisioning & Suspend Accounts' },
                  { key: 'canDeleteRecords', label: 'Delete Records (Permanent Purge)' },
                  { key: 'canViewSecurityDashboard', label: 'Security Surveillance & Login Telemetry' },
                  { key: 'canAddComments', label: 'Add Observation Comments to Records' },
                  { key: 'canBackupRestoreDatabase', label: 'Disaster Recovery Database Backup & Restore' },
                ].map((row) => (
                  <tr key={row.key} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.label}</td>
                    <td className="py-3.5 px-4 text-center">
                      {ROLE_PERMISSIONS.super_admin[row.key as keyof typeof ROLE_PERMISSIONS.super_admin] ? (
                        <CheckCircle2 size={16} className="text-[#2a602f] mx-auto" />
                      ) : (
                        <XCircle size={16} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {ROLE_PERMISSIONS.management[row.key as keyof typeof ROLE_PERMISSIONS.management] ? (
                        <CheckCircle2 size={16} className="text-[#2a602f] mx-auto" />
                      ) : (
                        <XCircle size={16} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {ROLE_PERMISSIONS.administrator[row.key as keyof typeof ROLE_PERMISSIONS.administrator] ? (
                        <CheckCircle2 size={16} className="text-[#2a602f] mx-auto" />
                      ) : (
                        <XCircle size={16} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {ROLE_PERMISSIONS.registry_department[row.key as keyof typeof ROLE_PERMISSIONS.registry_department] ? (
                        <CheckCircle2 size={16} className="text-[#2a602f] mx-auto" />
                      ) : (
                        <XCircle size={16} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {ROLE_PERMISSIONS.compliance_officer[row.key as keyof typeof ROLE_PERMISSIONS.compliance_officer] ? (
                        <CheckCircle2 size={16} className="text-[#2a602f] mx-auto" />
                      ) : (
                        <XCircle size={16} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Sub Tab 4: Tamper-Resistant Security Audit Trail ─────────────── */}
      {activeSubTab === 'audit_logs' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1 max-w-sm relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit trail by user, action, details..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2a602f] focus:ring-1 focus:ring-[#2a602f]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#2a602f]"
              >
                <option value="all">All Actions</option>
                <option value="SECURITY_ALERT">Security Alerts</option>
                <option value="LOGIN">Logins</option>
                <option value="LOGOUT">Logouts</option>
                <option value="CREATE">Create Record</option>
                <option value="UPDATE">Update Record</option>
                <option value="DELETE">Delete Record</option>
                <option value="COMMENT_ADDED">Observations</option>
                <option value="STATUS_CHANGE">Status Change</option>
              </select>

              <button
                onClick={() => crmService.exportDataToCSV('audit_logs')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2a602f] hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm"
              >
                <FileDown size={14} className="text-[#ffc30d]" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Officer</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Target Record</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No audit records match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{log.userName}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{log.userRole}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            log.action === 'SECURITY_ALERT'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : log.action === 'DELETE'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : log.action === 'CREATE'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{log.module}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {log.targetRecordName || log.targetRecordId || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px] max-w-md">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Sub Tab 5: Disaster Recovery & Backups ─────────────────────── */}
      {activeSubTab === 'backup' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
              Disaster Recovery, Database Snapshot &amp; Integrity Verification
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Export encrypted JSON backup snapshots containing all companies, licenses, clients, users, audit logs, and observation notes.
            </p>
          </div>

          {backupRestoreSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#2a602f] shrink-0" />
              <span>{backupRestoreSuccess}</span>
            </div>
          )}

          {backupRestoreError && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span>{backupRestoreError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Backup Card */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase">
                <Download size={18} className="text-[#2a602f]" />
                <span>Export System Snapshot</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate an immediate point-in-time JSON database backup of all registered mineral concessions, company documents, director records, and security audit logs.
              </p>
              <button
                onClick={handleBackupExport}
                className="w-full py-3 px-4 rounded-xl bg-[#2a602f] hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={15} className="text-[#ffc30d]" />
                <span>Download Database Backup</span>
              </button>
            </div>

            {/* Restore Backup Card */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase">
                <Upload size={18} className="text-amber-700" />
                <span>Restore From Backup Snapshot</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Restore the Cadastre system state from an authorized GMEC JSON backup file. Validates checksum before applying updates.
              </p>
              <label className="w-full py-3 px-4 rounded-xl bg-white border-2 border-dashed border-slate-300 hover:border-[#2a602f] text-slate-700 hover:text-[#2a602f] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                <Upload size={15} />
                <span>Upload &amp; Restore Snapshot</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleBackupRestoreFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Provision User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">
              Provision Authorized User Account
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Create an authenticated officer profile with strict departmental role mapping.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Officer Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Helena K. Flomo"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2a602f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="name@geominingec.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2a602f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#2a602f]"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="management">Executive Director</option>
                    <option value="administrator">Administrator</option>
                    <option value="registry_department">Registry Department</option>
                    <option value="compliance_officer">Statutory Compliance</option>
                    <option value="it_department">IT Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#2a602f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Temporary Security Password</label>
                <input
                  type="text"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="e.g. SEC@#GMEC2026"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#2a602f]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-[#2a602f] hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Confirm Account Provisioning
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMSecurity;
