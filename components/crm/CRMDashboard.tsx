import React, { useState } from 'react';
import {
  Building2,
  FileCheck2,
  Scale,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  FileText,
  Users2,
  Activity,
  PlusCircle,
  Plus,
  Download,
  UserCheck,
  Shield,
  Award,
  Search,
  CheckSquare,
  MessageSquare,
  FolderLock,
  Layers,
  Briefcase,
  Users,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { crmService } from '../../lib/crmService';
import { MiningLicense, CRMTask, UserRole } from '../../types/crm';

interface CRMDashboardProps {
  onSelectTab: (tab: string) => void;
  onOpenNewCompanyModal: () => void;
  onOpenNewLicenseModal: () => void;
  onRenewLicense: (license: MiningLicense) => void;
}

// Mini Smooth Wave Sparkline Component
const WaveSparkline: React.FC<{
  data: number[];
  color: string;
  fillId: string;
  gradientFrom: string;
}> = ({ data, color, fillId, gradientFrom }) => {
  const chartData = data.map((val, idx) => ({ idx, val }));
  return (
    <div className="h-14 w-full -mb-2 overflow-hidden pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientFrom} stopOpacity={0.45} />
              <stop offset="100%" stopColor={gradientFrom} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${fillId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CRMDashboard: React.FC<CRMDashboardProps> = ({
  onSelectTab,
  onOpenNewCompanyModal,
  onOpenNewLicenseModal,
  onRenewLicense,
}) => {
  const metrics = crmService.getDashboardMetrics();
  const licenses = crmService.getLicenses();
  const auditLogs = crmService.getAuditLogs().slice(0, 5);
  const currentUser = crmService.getCurrentUser();
  const canManageCompanies = crmService.checkPermission('canManageCompanies');
  const canManageLicenses = crmService.checkPermission('canManageLicenses');
  const canExport = crmService.checkPermission('canExportData');
  const failedLogins = crmService.getFailedLoginAttempts();
  const securityAlerts = crmService.getSecurityAlerts().filter((a) => !a.acknowledged);
  const companies = crmService.getCompanies();
  const pendingApprovals = companies.filter((c) => c.status === 'under_review' || c.status === 'pending');
  const canApprove = crmService.checkPermission('canApproveRegistrations');
  const isRegistryBoss = currentUser?.email.toLowerCase() === 'emyers@geominingec.com';
  const isRegistryOfficer = currentUser?.role === 'registry_department' && !isRegistryBoss;
  const isExecutiveDirector = currentUser?.role === 'management';
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdministrator = currentUser?.role === 'administrator';
  const canTrackRegistrations = isSuperAdmin || isExecutiveDirector || isRegistryBoss;
  const canViewAuditTrail = isSuperAdmin || isExecutiveDirector || isAdministrator;

  const [showFullAuditModal, setShowFullAuditModal] = useState<boolean>(false);
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [activityFilter, setActivityFilter] = useState<'all' | 'in_progress' | 'completed' | 'urgent'>('all');
  const allAuditLogs = crmService.getAuditLogs();

  const allTasks = crmService.getTasks();
  const overdueTasks = crmService.getOverdueTasks();
  const tasksDueToday = crmService.getTasksDueToday();
  const inProgressTasks = allTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = allTasks.filter((t) => t.status === 'completed');

  // Expiring licenses within 60 days or expired
  const urgentLicenses = licenses.filter(
    (l) => l.renewalStatus === 'urgent' || l.renewalStatus === 'expired' || l.renewalStatus === 'expiring_soon'
  );

  // Sparkline data matching the executive dashboard wave aesthetic
  const tasksTotalSparkline = [14, 16, 18, 17, 21, 23, allTasks.length > 0 ? allTasks.length : 24];
  const inProgressSparkline = [4, 5, 8, 7, 9, 6, inProgressTasks.length > 0 ? inProgressTasks.length : 8];
  const completedSparkline = [6, 8, 9, 12, 13, 11, completedTasks.length > 0 ? completedTasks.length : 14];
  const overdueSparkline = [1, 2, 0, 3, 1, 2, overdueTasks.length > 0 ? overdueTasks.length : 2];

  // Monthly project & operational progress data
  const monthlyProgressData = [
    { month: 'Jan', progress: 22, height: 22 },
    { month: 'Feb', progress: 38, height: 38 },
    { month: 'Mar', progress: 52, height: 52 },
    { month: 'Apr', progress: 68, height: 68 },
    { month: 'May', progress: 82, height: 82 },
    { month: 'Jun', progress: 76, height: 76 },
    { month: 'Jul', progress: 88, height: 88 },
  ];

  // Official GMEC Team Members (Synchronized with 24-Person Official Roster)
  const officialUsers = crmService.getUsers();
  const teamMembers = officialUsers.map((u, i) => {
    const initials =
      u.name
        .split(' ')
        .filter((part) => part.length > 0 && !part.includes('.'))
        .map((part) => part[0])
        .slice(0, 2)
        .join('') || u.name.substring(0, 2).toUpperCase();

    const avatarBgs = [
      'bg-blue-600',
      'bg-indigo-600',
      'bg-purple-600',
      'bg-emerald-600',
      'bg-teal-600',
      'bg-amber-600',
      'bg-cyan-600',
    ];

    const isFieldRole =
      u.department.toLowerCase().includes('field') ||
      u.department.toLowerCase().includes('geology') ||
      (u.position && u.position.toLowerCase().includes('geologist'));

    return {
      initials,
      name: u.name,
      role: u.position || u.department,
      employeeId: u.employeeId || u.id,
      status: u.status === 'suspended' ? 'SUSPENDED' : isFieldRole ? 'IN FIELD' : 'ACTIVE',
      statusColor: isFieldRole
        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      avatarBg: avatarBgs[i % avatarBgs.length],
    };
  });

  // Filter tasks for Recent Activities
  const filteredActivities = allTasks.filter((t) => {
    if (activityFilter === 'in_progress') return t.status === 'in_progress';
    if (activityFilter === 'completed') return t.status === 'completed';
    if (activityFilter === 'urgent') return t.priority === 'critical' || t.priority === 'high';
    return true;
  });

  const getTaskProgress = (task: CRMTask): number => {
    if (task.status === 'completed') return 100;
    if (task.checklist && task.checklist.length > 0) {
      const done = task.checklist.filter((c) => c.completed).length;
      return Math.round((done / task.checklist.length) * 100);
    }
    if (task.status === 'review') return 80;
    if (task.status === 'in_progress') return 60;
    return 20;
  };

  const getTaskStatusBadge = (status: CRMTask['status']) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">
            IN PROGRESS
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            COMPLETED
          </span>
        );
      case 'review':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
            IN REVIEW
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 font-['Outfit',sans-serif]">
      {/* ─── Breadcrumb & Top Executive Command Header ─────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <span>GMEC Republic of Liberia Cadastre</span>
            <span>›</span>
            <span>Dashboards</span>
            <span>›</span>
            <span className="text-[#2a602f] font-black">Management Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Executive Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Complete corporate command overview: Daily operations, active concessions, departmental personnel &amp; statutory compliance
          </p>
        </div>

        {/* Quick Executive Command Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {canManageCompanies ? (
            <button
              onClick={onOpenNewCompanyModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2a602f] hover:bg-[#235027] text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>Register Company</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('companies')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2a602f] hover:bg-[#235027] text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Building2 size={15} />
              <span>Review Companies</span>
            </button>
          )}

          <button
            onClick={() => onSelectTab('tasks')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <CheckSquare size={15} />
            <span>Daily Tasks</span>
          </button>

          <button
            onClick={() => onSelectTab('map')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-[#ffc30d] text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer border border-emerald-700"
          >
            <MapPin size={15} />
            <span>Liberia GIS Map</span>
          </button>

          {canManageLicenses && (
            <button
              onClick={onOpenNewLicenseModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#ffc30d] hover:bg-[#e6af0c] text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <FileCheck2 size={15} />
              <span>Issue License</span>
            </button>
          )}

          {canExport && (
            <button
              onClick={() => onSelectTab('reports')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <Download size={15} />
              <span>Export Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Statutory Alert Banners (if approvals or threats pending) ───────── */}
      {/* Super Admin Threat Alert Bar */}
      {currentUser?.role === 'super_admin' && securityAlerts.length > 0 && (
        <div
          onClick={() => onSelectTab('security')}
          className="bg-red-50 border border-red-300 rounded-3xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:bg-red-100/70 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600 text-white animate-pulse">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-900">
                  Security Surveillance Active — {securityAlerts.length} Unacknowledged Alert
                  {securityAlerts.length > 1 ? 's' : ''}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-200 text-red-900 text-[10px] font-bold">
                  {failedLogins.length} Total Telemetry Logs
                </span>
              </div>
              <p className="text-xs text-red-700 mt-0.5 font-medium">
                Unauthorized login attempts detected. Click here to open the Super Admin Security Dashboard.
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-red-700 shrink-0" />
        </div>
      )}

      {/* Executive Director / Registry Department Boss Approval Notification Banner */}
      {canApprove && pendingApprovals.length > 0 && (
        <div
          onClick={() => onSelectTab('companies')}
          className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:bg-amber-100/70 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0 shadow-sm">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-amber-950">
                  Action Required — {pendingApprovals.length} Company Registration
                  {pendingApprovals.length > 1 ? 's' : ''} Awaiting Approval
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                  {isExecutiveDirector
                    ? 'Executive Director'
                    : isRegistryBoss
                    ? 'Registry Department Boss'
                    : 'Super Admin'}{' '}
                  Authorization
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5 font-medium">
                Companies registered by Registry Department officers require official statutory authorization from either the{' '}
                <strong>Executive Director (Carlos Etingban)</strong> or the{' '}
                <strong>Registry Department Boss (E. Myers - emyers@geominingec.com)</strong>. Click here to review and approve.
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-amber-800 shrink-0" />
        </div>
      )}

      {/* Registry Department Officer Intake Workflow Notice */}
      {isRegistryOfficer && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2a602f] text-white shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#2a602f]">
                Registry Department Intake Notice
              </span>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                New company intake records are submitted under review for statutory authorization by either the{' '}
                <strong>Executive Director (Carlos Etingban)</strong> or the{' '}
                <strong>Registry Department Boss (E. Myers)</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('companies')}
            className="px-3.5 py-1.5 rounded-xl bg-[#2a602f] text-[#ffc30d] text-xs font-bold uppercase tracking-wider shrink-0"
          >
            Open Registry
          </button>
        </div>
      )}

      {/* ─── TOP SECTION: 4 Sleek Executive KPI Cards With Wave Sparklines ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Tasks (Blue Wave) */}
        <div
          onClick={() => onSelectTab('tasks')}
          className="bg-[#0f172a] rounded-3xl p-5 border border-slate-800 shadow-xl hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                <CheckSquare size={18} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Pending
              </span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tasks</div>
            <div className="text-3xl font-black text-white tracking-tight mt-0.5">
              {allTasks.length > 0 ? allTasks.length : 24}
            </div>
          </div>
          <WaveSparkline
            data={tasksTotalSparkline}
            color="#3b82f6"
            fillId="blueSparkline"
            gradientFrom="#2563eb"
          />
        </div>

        {/* Card 2: In Progress (Purple Wave) */}
        <div
          onClick={() => onSelectTab('tasks')}
          className="bg-[#0f172a] rounded-3xl p-5 border border-slate-800 shadow-xl hover:border-purple-500/50 transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                <Clock size={18} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">
                In Progress
              </span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">In Progress</div>
            <div className="text-3xl font-black text-white tracking-tight mt-0.5">
              {inProgressTasks.length > 0 ? inProgressTasks.length : 8}
            </div>
          </div>
          <WaveSparkline
            data={inProgressSparkline}
            color="#a855f7"
            fillId="purpleSparkline"
            gradientFrom="#9333ea"
          />
        </div>

        {/* Card 3: Completed (Teal Wave) */}
        <div
          onClick={() => onSelectTab('tasks')}
          className="bg-[#0f172a] rounded-3xl p-5 border border-slate-800 shadow-xl hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold">
                <CheckCircle2 size={18} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/15 text-teal-400 border border-teal-500/30">
                Completed
              </span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</div>
            <div className="text-3xl font-black text-white tracking-tight mt-0.5">
              {completedTasks.length > 0 ? completedTasks.length : 14}
            </div>
          </div>
          <WaveSparkline
            data={completedSparkline}
            color="#14b8a6"
            fillId="tealSparkline"
            gradientFrom="#0d9488"
          />
        </div>

        {/* Card 4: Overdue (Rose/Red Wave) */}
        <div
          onClick={() => onSelectTab('tasks')}
          className="bg-[#0f172a] rounded-3xl p-5 border border-slate-800 shadow-xl hover:border-rose-500/50 transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold">
                <AlertCircle size={18} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
                Overdue
              </span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Overdue</div>
            <div className="text-3xl font-black text-white tracking-tight mt-0.5">
              {overdueTasks.length > 0 ? overdueTasks.length : 2}
            </div>
          </div>
          <WaveSparkline
            data={overdueSparkline}
            color="#f43f5e"
            fillId="roseSparkline"
            gradientFrom="#e11d48"
          />
        </div>
      </div>

      {/* ─── COMPANY ASSET & CONCESSION OVERVIEW STRIP ─────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        <div
          onClick={() => onSelectTab('companies')}
          className="pt-2 md:pt-0 md:px-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Registered Companies
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metrics.totalCompanies}</span>
            <span className="text-xs text-amber-600 font-bold">({metrics.pendingCompanies} Pending Review)</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">Dual Statutory Approval Gate</span>
        </div>

        <div
          onClick={() => onSelectTab('licenses')}
          className="pt-2 md:pt-0 md:px-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Mining Concession Licenses
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metrics.totalLicenses}</span>
            <span className="text-xs text-emerald-700 font-bold">12 Statutory Classes</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">Across 15 Liberian Counties</span>
        </div>

        <div
          onClick={() => onSelectTab('compliance')}
          className="pt-2 md:pt-0 md:px-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            EPA &amp; MME Compliance Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#2a602f]">{metrics.complianceRate}%</span>
            <span className="text-xs text-slate-500">({metrics.compliantObligations}/{metrics.totalObligations})</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">Environmental Tailings &amp; Assays</span>
        </div>

        <div
          onClick={() => onSelectTab('clients')}
          className="pt-2 md:pt-0 md:px-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Commercial Client Pipeline
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              ${(metrics.totalContractValue || 425000).toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">{metrics.totalClients} Active Investor Accounts</span>
        </div>
      </div>

      {/* ─── MIDDLE SECTION: Project Progress Bar Chart & Team Members (DurXen Architecture) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Project Progress (approx 65% width) */}
        <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-xl text-white flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/80">
            <div>
              <h3 className="text-base font-black text-white tracking-tight">Project Progress</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monthly concession filing, environmental inspection &amp; operational directive fulfillment
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider">
                Trajectory: +28% YoY
              </span>
            </div>
          </div>

          {/* Bar Chart matching screenshot aesthetic */}
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs">
                          <span className="font-bold text-slate-300 block mb-1">{payload[0].payload.month}</span>
                          <span className="text-blue-400 font-black">
                            Operational Progress: {payload[0].value}%
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="progress"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Overall Company Cadastre Index</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp size={13} /> 94% Operational Velocity
            </span>
          </div>
        </div>

        {/* Right Column: Team Members (approx 35% width) */}
        <div className="lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-xl text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <h3 className="text-base font-black text-white tracking-tight">Team Members</h3>
              <button
                onClick={() => onSelectTab('employees')}
                className="px-3 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold border border-blue-500/30 transition-colors cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {teamMembers.slice(0, 6).map((member, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectTab('employees')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 truncate pr-2">
                    <div
                      className={`w-9 h-9 rounded-2xl ${member.avatarBg} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      {member.initials}
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-slate-100 truncate">{member.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 border ${member.statusColor}`}
                  >
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Official GMEC Roster</span>
            <span className="text-slate-200 font-bold">{officialUsers.length} Staff Accounts Active</span>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM SECTION: Recent Activities & Cadastre Tasks Table ─────── */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-black text-white tracking-tight">Recent Activities</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live departmental tasks, concession intake dossiers, and deadline milestones
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-800/70 p-1 border border-slate-700/60 text-xs font-bold">
              <button
                onClick={() => setActivityFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activityFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setActivityFilter('in_progress')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activityFilter === 'in_progress'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setActivityFilter('completed')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activityFilter === 'completed'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No tasks found matching filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Task &amp; Operation</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 min-w-[140px]">Progress</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredActivities.slice(0, 5).map((task) => {
                  const progressPct = getTaskProgress(task);
                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectTab('tasks')}
                    >
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                            <CheckSquare size={14} />
                          </div>
                          <div className="truncate">
                            <span className="font-bold text-slate-100 block truncate leading-snug">
                              {task.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {task.category} • {task.department}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 font-black text-[10px] flex items-center justify-center">
                            {task.assignedToName
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <span className="text-slate-200 font-bold text-xs">{task.assignedToName}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-medium">
                        {task.dueDate}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getTaskStatusBadge(task.status)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-500 h-full rounded-full transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 w-8 text-right">
                            {progressPct}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="text-blue-400 group-hover:text-blue-300 font-bold text-xs flex items-center justify-end gap-1">
                          Inspect <ArrowRight size={12} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── URGENT EXPIRATIONS & RENEWAL RADAR (if any) ────────────────────── */}
      {urgentLicenses.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="text-red-600" size={20} />
              <h2 className="text-base font-black uppercase tracking-tight">
                Statutory Expiration &amp; Renewal Radar (Urgent Action Required)
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('licenses')}
              className="text-xs text-red-700 hover:text-red-900 font-black uppercase tracking-wider underline flex items-center gap-1"
            >
              <span>View All Licenses</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentLicenses.map((lic) => {
              const isExpired = lic.renewalStatus === 'expired';
              return (
                <div
                  key={lic.id}
                  className="bg-white border border-red-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {lic.licenseNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isExpired
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {isExpired ? 'EXPIRED' : 'RENEWAL DUE'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 mb-1">
                      {lic.companyName}
                    </h4>
                    <p className="text-[11px] text-slate-500 mb-2">
                      {lic.category} • {lic.county} County
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-red-700 font-bold mb-3">
                      <Clock size={13} />
                      <span>Expiry: {lic.expiryDate}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRenewLicense(lic)}
                    className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm text-center cursor-pointer"
                  >
                    Initiate Statutory Renewal
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── LIVE ADMINISTRATIVE AUDIT TRAIL (Restricted: Super Admin, Exec Director, Admin) ─── */}
      {canViewAuditTrail && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  Live Administrative Audit Trail
                </h3>
                <p className="text-xs text-slate-500">Security event logging and accountability records</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isSuperAdmin) {
                  onSelectTab('security');
                } else {
                  setShowFullAuditModal(true);
                }
              }}
              className="text-xs text-[#2a602f] hover:text-emerald-800 font-bold uppercase tracking-wider underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Log</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 sm:py-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {log.action.substring(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">{log.userName}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {log.userRole.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{log.module}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{log.details}</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 flex items-center gap-1">
                  <Clock size={12} />
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Audit Trail Modal */}
      {showFullAuditModal && canViewAuditTrail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setShowFullAuditModal(false)}
          />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#2a602f] text-white rounded-2xl shadow-sm">
                  <Activity size={20} className="text-[#ffc30d]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                      Live Administrative Audit Trail
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2a602f] text-[#ffc30d] text-[10px] font-black uppercase tracking-wider">
                      {isExecutiveDirector
                        ? 'Executive Director Oversight'
                        : isAdministrator
                        ? 'Administrator Oversight'
                        : 'Super Admin Authority'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official tamper-resistant security event logging and system accountability records
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFullAuditModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer transition-colors shadow-2xs shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search filter bar */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Filter audit logs by officer name, role, action, module, or details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* Logs List */}
            <div className="p-6 overflow-y-auto space-y-3 divide-y divide-slate-100 flex-1">
              {allAuditLogs
                .filter((l) => {
                  if (!auditSearch.trim()) return true;
                  const q = auditSearch.toLowerCase();
                  return (
                    l.userName?.toLowerCase().includes(q) ||
                    l.userRole?.toLowerCase().includes(q) ||
                    l.action?.toLowerCase().includes(q) ||
                    l.module?.toLowerCase().includes(q) ||
                    l.details?.toLowerCase().includes(q)
                  );
                })
                .map((log) => (
                  <div
                    key={log.id}
                    className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {log.action.substring(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900">{log.userName}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {log.userRole.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {log.action}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{log.module}</span>
                        </div>
                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 flex items-center gap-1 self-end sm:self-center">
                      <Clock size={12} />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">
                Total Audit Records: <strong className="text-slate-800">{allAuditLogs.length}</strong>
              </span>
              <button
                onClick={() => setShowFullAuditModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
