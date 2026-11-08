import React, { useState } from 'react';
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
} from 'lucide-react';
import { crmService, ROLE_PERMISSIONS, ROLE_LABELS } from '../../lib/crmService';
import { UserRole, CRMUser } from '../../types/crm';

export const CRMSecurity: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'matrix' | 'audit_logs'>('users');
  const [auditSearch, setAuditSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'compliance_officer' as UserRole,
    department: 'Statutory Compliance',
    phone: '',
    password: '',
  });

  const users = crmService.getUsers();
  const auditLogs = crmService.getAuditLogs();
  const currentUser = crmService.getCurrentUser();
  const canManageUsers = crmService.checkPermission('canManageUsers');

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <ShieldAlert size={20} className="text-amber-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Security, RBAC Governance &amp; Audit Logs
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Strict role-based access control (RBAC), multi-departmental credentialing, tamper-evident audit logging, and statutory accountability governance.
          </p>
        </div>

        {canManageUsers && (
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus size={16} className="text-amber-400" />
            <span>Provision User Account</span>
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
            activeSubTab === 'users'
              ? 'bg-[#2d5a27] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users size={14} />
          <span>Authorized Personnel ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
            activeSubTab === 'matrix'
              ? 'bg-[#2d5a27] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <KeyRound size={14} />
          <span>Role Permissions Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit_logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
            activeSubTab === 'audit_logs'
              ? 'bg-[#2d5a27] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity size={14} />
          <span>System Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* Sub Tab 1: Authorized Personnel */}
      {activeSubTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
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
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center">
                            {u.name.substring(0, 1)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              {u.name} {isCurrent && <span className="text-[10px] text-emerald-700 font-bold">(You)</span>}
                            </div>
                            <div className="text-[10px] text-slate-400">{u.phone || 'No direct extension'}</div>
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
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                              u.status === 'active'
                                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-bold">Protected</span>
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

      {/* Sub Tab 2: Role Permissions Matrix */}
      {activeSubTab === 'matrix' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
              Statutory Role-Based Access Control (RBAC) Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Visual overview of granular permissions enforced across the 5 designated system roles.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">System Capability / Module</th>
                  <th className="py-3 px-3 text-center">Admin</th>
                  <th className="py-3 px-3 text-center">IT Dept</th>
                  <th className="py-3 px-3 text-center">Registry</th>
                  <th className="py-3 px-3 text-center">Compliance</th>
                  <th className="py-3 px-3 text-center">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                {[
                  { key: 'canManageCompanies', label: 'Company Registration Database (Create/Edit)' },
                  { key: 'canApproveRegistrations', label: 'Approve & Validate Entity Registrations' },
                  { key: 'canManageLicenses', label: 'Issue & Maintain Mining Licenses' },
                  { key: 'canApproveCompliance', label: 'Certify EPA & MME Compliance Audits' },
                  { key: 'canManageClients', label: 'Client CRM & Commercial Engagements' },
                  { key: 'canViewReports', label: 'Access Executive Management Dashboard' },
                  { key: 'canExportData', label: 'Export Official Dossiers & CSV Datasets' },
                  { key: 'canManageUsers', label: 'User Provisioning & Role Management' },
                  { key: 'canDeleteRecords', label: 'Revoke Licenses & Delete Records' },
                  { key: 'canViewAuditLogs', label: 'Inspect Security Audit Logs' },
                  { key: 'canConfigureSettings', label: 'System Configuration & Key Access' },
                ].map((row) => (
                  <tr key={row.key} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.label}</td>
                    {(
                      [
                        'administrator',
                        'it_department',
                        'registry_department',
                        'compliance_officer',
                        'management',
                      ] as UserRole[]
                    ).map((r) => {
                      const allowed = ROLE_PERMISSIONS[r][row.key as keyof typeof ROLE_PERMISSIONS['administrator']];
                      return (
                        <td key={r} className="py-3 px-3 text-center">
                          {allowed ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800">
                              <CheckCircle2 size={14} />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                              <XCircle size={14} />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub Tab 3: Security Audit Trail */}
      {activeSubTab === 'audit_logs' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit trail by user, action, target record, or message..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Action Types</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="STATUS_CHANGE">STATUS_CHANGE</option>
                <option value="DOCUMENT_UPLOAD">DOCUMENT_UPLOAD</option>
                <option value="EXPORT">EXPORT</option>
                <option value="LOGIN">LOGIN</option>
                <option value="LOGOUT">LOGOUT</option>
              </select>

              <button
                onClick={() => crmService.exportDataToCSV('audit_logs')}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Download size={13} className="text-amber-400" />
                <span>Export Log</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Acting Officer</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Module</th>
                    <th className="py-3 px-4">Target Record</th>
                    <th className="py-3 px-4">Details &amp; Audit Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{log.userName}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{log.userRole.replace('_', ' ')}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-bold">{log.module}</td>
                      <td className="py-3 px-4">
                        {log.targetRecordName ? (
                          <span className="font-semibold text-slate-800 truncate max-w-[150px] block">
                            {log.targetRecordName}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px]">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-xs leading-relaxed max-w-md">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add User Modal ──────────────────────────────────────────────── */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowAddUserModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Provision Authorized User</h3>
              <button onClick={() => setShowAddUserModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Samuel B. Kpoto"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="samuel@geominingec.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Departmental Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="administrator">Administrator</option>
                    <option value="it_department">IT Department</option>
                    <option value="registry_department">Registry Dept</option>
                    <option value="compliance_officer">Compliance Officer</option>
                    <option value="management">Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Department</label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Passkey *</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-black uppercase tracking-wider"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

