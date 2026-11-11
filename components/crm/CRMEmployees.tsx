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

  const users = crmService.getUsers();
  const departments = crmService.getDepartments();
  const performanceMetrics = crmService.getEmployeePerformanceMetrics();
  const currentUser = crmService.getCurrentUser();

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
    </div>
  );
};

