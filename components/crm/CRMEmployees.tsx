import React, { useState } from 'react';
import {
  Users,
  Building,
  Award,
  TrendingUp,
  Search,
  Filter,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  BarChart3,
  Briefcase,
  ChevronRight,
  UserCheck,
  Key,
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import { EmployeePerformanceMetric, DepartmentSummary, UserRole } from '../../types/crm';

interface CRMEmployeesProps {
  initialSearch?: string;
}

export const CRMEmployees: React.FC<CRMEmployeesProps> = ({ initialSearch = '' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'departments' | 'performance'>('directory');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeePerformanceMetric | null>(null);

  // Admin Password Reset Modal State (Super Admin / Admin capability)
  const [resetTargetUser, setResetTargetUser] = useState<{
    id: string;
    name: string;
    email: string;
    employeeId?: string;
    role: string;
  } | null>(null);
  const [adminNewPassword, setAdminNewPassword] = useState<string>('');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedPassword, setCopiedPassword] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const users = crmService.getUsers();
  const departments = crmService.getDepartments();
  const performanceMetrics = crmService.getEmployeePerformanceMetrics();
  const currentUser = crmService.getCurrentUser();
  const canAdminReset =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'administrator' ||
    crmService.checkPermission('canManageUsers');

  const filteredMetrics = performanceMetrics.filter((emp) => {
    const matchesSearch =
      emp.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (departmentFilter !== 'all' && !emp.department.toLowerCase().includes(departmentFilter.toLowerCase())) {
      return false;
    }

    return true;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">Super Admin</span>;
      case 'management':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">Executive Director</span>;
      case 'administrator':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-300">Administrator</span>;
      case 'registry_department':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-[#2a602f] border border-emerald-200">Registry Dept</span>;
      case 'compliance_officer':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">Compliance</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{role}</span>;
    }
  };

  const getEfficiencyBadge = (score: number) => {
    if (score >= 90) {
      return <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-[#2a602f] border border-emerald-200">★ {score}% Grade A</span>;
    }
    if (score >= 80) {
      return <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-200">★ {score}% Grade B</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-200">{score}% Passing</span>;
  };

  const handleExportPerformanceCSV = () => {
    const headers = ['Employee Name', 'Email', 'Role', 'Department', 'Assigned Tasks', 'Completed', 'In Progress', 'Overdue', 'Completion Rate %', 'On-Time Rate %', 'Efficiency Score', 'Companies Registered'];
    const rows = performanceMetrics.map((p) => [
      `"${p.userName}"`,
      `"${p.userEmail}"`,
      `"${p.role}"`,
      `"${p.department}"`,
      p.totalAssignedTasks,
      p.completedTasks,
      p.inProgressTasks,
      p.overdueTasks,
      `${p.completionRatePct}%`,
      `${p.onTimeRatePct}%`,
      `${p.efficiencyScore}%`,
      p.registeredCompaniesCount || 0,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `GMEC_Employee_Performance_Report_${new Date().toISOString().substring(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 text-[#2a602f] border border-emerald-200">
              <Users size={20} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Employee Profiles & Departments
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Bitrix24-style corporate personnel directory, departmental org structure & staff performance KPI reports
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('directory')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'directory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Personnel Directory
            </button>
            <button
              onClick={() => setActiveSubTab('departments')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'departments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Departments & Org
            </button>
            <button
              onClick={() => setActiveSubTab('performance')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'performance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Performance Reports
            </button>
          </div>

          {activeSubTab === 'performance' && (
            <button
              onClick={handleExportPerformanceCSV}
              className="px-3 py-2 rounded-xl bg-[#2a602f] hover:bg-[#224f26] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: PERSONNEL DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Search & Department Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employee by name, email, role..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">All Departments ({performanceMetrics.length} Staff)</option>
              <option value="Executive Directorate">Executive Directorate</option>
              <option value="Administration">Administration</option>
              <option value="IT & Infrastructure">IT & Infrastructure</option>
              <option value="Registry Department">Registry Department</option>
              <option value="Mining Engineering">Mining Engineering & Geology</option>
              <option value="Environmental">Environmental & Compliance</option>
              <option value="Field Operations">Field Operations</option>
              <option value="Security">Security & Operations</option>
            </select>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMetrics.map((emp) => {
              const userObj = users.find((u) => u.id === emp.userId);
              return (
                <div
                  key={emp.userId}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#2a602f]/10 text-[#2a602f] font-black text-base flex items-center justify-center border border-[#2a602f]/20">
                          {emp.userName
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-slate-100 text-slate-700 border border-slate-200">
                              {emp.employeeId || userObj?.employeeId || emp.userId}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{emp.userName}</h4>
                          </div>
                          {(emp.position || userObj?.position) && (
                            <span className="text-[11px] font-bold text-[#2a602f] block leading-tight">
                              {emp.position || userObj?.position}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 block font-mono">{emp.userEmail}</span>
                        </div>
                      </div>
                      {getRoleBadge(emp.role)}
                    </div>

                    <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building size={13} className="text-slate-400 shrink-0" />
                        <span className="font-medium truncate">{emp.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={13} className="text-slate-400 shrink-0" />
                        <span>{userObj?.phone || '+231 77 000 0000'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span className="text-[11px] text-slate-500">Active session: {emp.lastActive || 'Today'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Bitrix24 Efficiency
                      </span>
                      {getEfficiencyBadge(emp.efficiencyScore)}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Tasks Completed
                      </span>
                      <span className="font-black text-slate-800 text-xs">
                        {emp.completedTasks} / {emp.totalAssignedTasks}
                      </span>
                    </div>
                  </div>

                  {canAdminReset && (
                    <button
                      onClick={() => {
                        const targetId = userObj?.id || emp.userId;
                        const defaultSuggest = `Gmec@${emp.employeeId || '2026'}!`;
                        setResetTargetUser({
                          id: targetId,
                          name: emp.userName,
                          email: emp.userEmail,
                          employeeId: emp.employeeId || userObj?.employeeId,
                          role: emp.role,
                        });
                        setAdminNewPassword(defaultSuggest);
                        setShowAdminPassword(true);
                        setResetStatus(null);
                        setCopiedPassword(false);
                      }}
                      className="mt-3 w-full py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#2a602f] border border-slate-200 hover:border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                      title="Super Admin / Administrator: Reset this staff member's password"
                    >
                      <Key size={13} className="text-[#2a602f]" />
                      <span>Reset Staff Password</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DEPARTMENTS & ORG STRUCTURE */}
      {activeSubTab === 'departments' && (
        <div className="space-y-6">
          <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-sm">
            <h3 className="text-lg font-black tracking-tight mb-1">
              GMEC Cadastre & Corporate Organizational Chart
            </h3>
            <p className="text-xs text-emerald-100/80 max-w-2xl">
              Official administrative command structure established under the Executive Directorate. All departmental branches operate with synchronized role permissions and provenance logging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                        <Briefcase size={16} />
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{dept.name}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {dept.employeeCount} Officers
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-4">{dept.description}</p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Head of Department
                    </span>
                    <span className="font-bold text-slate-900">{dept.headName}</span>
                    <span className="text-[11px] text-slate-500 block">{dept.headEmail}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Operational Completion Rate</span>
                    <span className="text-[#2a602f] font-black">{dept.departmentCompletionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2a602f] h-full transition-all"
                      style={{ width: `${dept.departmentCompletionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: EMPLOYEE PERFORMANCE REPORTS */}
      {activeSubTab === 'performance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Departmental Efficiency & Output Leaderboard
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time KPI metrics derived from daily task completions, statutory deadlines & company registration dossiers
                </p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Officer Name & Department</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Assigned Tasks</th>
                  <th className="py-3 px-4">Completed</th>
                  <th className="py-3 px-4">Overdue</th>
                  <th className="py-3 px-4">Completion %</th>
                  <th className="py-3 px-4">On-Time %</th>
                  <th className="py-3 px-4">Bitrix24 Efficiency</th>
                  <th className="py-3 px-4">Dossiers Filed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {performanceMetrics.map((p) => (
                  <tr key={p.userId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{p.userName}</div>
                      <div className="text-[10px] text-slate-500">{p.department}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">{getRoleBadge(p.role)}</td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                      {p.totalAssignedTasks}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#2a602f]">
                      {p.completedTasks}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-red-600">
                      {p.overdueTasks > 0 ? (
                        <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-[10px]">
                          {p.overdueTasks} Overdue
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                      {p.completionRatePct}%
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                      {p.onTimeRatePct}%
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getEfficiencyBadge(p.efficiencyScore)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-black text-slate-900">
                      {p.registeredCompaniesCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* ─── Super Admin / Admin Staff Password Reset Modal ───────────────── */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => {
              if (!isResetting) setResetTargetUser(null);
            }}
          />

          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 border border-slate-100 font-['Outfit',sans-serif] text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shadow-xs">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Admin Password Reset
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Executive override for {resetTargetUser.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setResetTargetUser(null)}
                disabled={isResetting}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Target Staff Summary */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-5">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">{resetTargetUser.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#ffc30d] text-slate-950 text-[10px] font-black uppercase">
                  {resetTargetUser.employeeId || resetTargetUser.id}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">{resetTargetUser.email}</div>
              <div className="text-[10px] text-purple-700 font-bold uppercase tracking-wider mt-1">
                Role: {resetTargetUser.role.replace('_', ' ')}
              </div>
            </div>

            {/* Status alerts */}
            {resetStatus && (
              <div
                className={`mb-5 p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2.5 border ${
                  resetStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {resetStatus.type === 'success' ? (
                  <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p>{resetStatus.message}</p>
                  {resetStatus.type === 'success' && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <code className="px-2.5 py-1 bg-white border border-emerald-200 rounded-lg text-slate-900 font-mono text-xs">
                        {adminNewPassword}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(adminNewPassword);
                          setCopiedPassword(true);
                          setTimeout(() => setCopiedPassword(false), 2500);
                        }}
                        className="px-2 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedPassword ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedPassword ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!adminNewPassword || adminNewPassword.trim().length < 8) {
                  setResetStatus({
                    type: 'error',
                    message: 'Password must be at least 8 characters long.',
                  });
                  return;
                }
                setIsResetting(true);
                try {
                  const res = crmService.adminResetUserPassword(
                    resetTargetUser.id,
                    adminNewPassword.trim()
                  );
                  if (res.success) {
                    setResetStatus({
                      type: 'success',
                      message: `Password reset successfully for ${resetTargetUser.name}. The new credential is synchronized to Supabase. Provide it securely to the employee:`,
                    });
                  } else {
                    setResetStatus({
                      type: 'error',
                      message: res.error || 'Failed to reset password. Insufficient permissions.',
                    });
                  }
                } catch (err: any) {
                  setResetStatus({
                    type: 'error',
                    message: err?.message || 'Error occurred while resetting password.',
                  });
                } finally {
                  setIsResetting(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    New Staff Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const randDigits = Math.floor(1000 + Math.random() * 9000);
                      const generated = `Gmec@${resetTargetUser.employeeId || 'Pass'}${randDigits}!`;
                      setAdminNewPassword(generated);
                      setShowAdminPassword(true);
                    }}
                    className="text-[10px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={11} />
                    <span>Generate Strong Password</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminNewPassword}
                    onChange={(e) => setAdminNewPassword(e.target.value)}
                    required
                    placeholder="Enter new 8+ char password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-purple-600 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showAdminPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Minimum 8 characters. Will override current password in Supabase cloud storage.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  disabled={isResetting}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  {isResetting ? (
                    <span>Synchronizing...</span>
                  ) : (
                    <>
                      <Key size={14} />
                      <span>Commit Password Reset</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

