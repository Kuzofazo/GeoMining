import React, { useState } from 'react';
import {
  Building2,
  FileCheck2,
  Scale,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
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
} from 'lucide-react';
import {
  BarChart,
  Bar,
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
import { MiningLicense } from '../../types/crm';

interface CRMDashboardProps {
  onSelectTab: (tab: string) => void;
  onOpenNewCompanyModal: () => void;
  onOpenNewLicenseModal: () => void;
  onRenewLicense: (license: MiningLicense) => void;
}

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
  // Administrative Audit Trail is strictly visible only to Super Admin, Executive Director, and Administrator
  const canViewAuditTrail = isSuperAdmin || isExecutiveDirector || isAdministrator;
  const [showFullAuditModal, setShowFullAuditModal] = useState<boolean>(false);
  const [auditSearch, setAuditSearch] = useState<string>('');
  const allAuditLogs = crmService.getAuditLogs();

  // Expiring licenses within 60 days or expired
  const urgentLicenses = licenses.filter(
    (l) => l.renewalStatus === 'urgent' || l.renewalStatus === 'expired' || l.renewalStatus === 'expiring_soon'
  );

  // County Distribution Chart Data
  const countyChartData = Object.entries(metrics.countyDistribution).map(([county, count]) => ({
    name: county,
    count,
  }));

  // Category Distribution Chart Data
  const categoryChartData = Object.entries(metrics.categoryDistribution).map(([category, count]) => ({
    name: category.replace('License', '').replace('Package', '').trim(),
    value: count,
  }));

  const COLORS = ['#2a602f', '#ffc30d', '#1e40af', '#059669', '#d97706', '#0f766e', '#475569'];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Super Admin Threat Alert Bar (if failed logins active) */}
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
                  Security Surveillance Active — {securityAlerts.length} Unacknowledged Alert{securityAlerts.length > 1 ? 's' : ''}
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
                  Action Required — {pendingApprovals.length} Company Registration{pendingApprovals.length > 1 ? 's' : ''} Awaiting Approval
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
                Companies registered by Registry Department officers require official statutory authorization from either the <strong>Executive Director (Carlos Etingban)</strong> or the <strong>Registry Department Boss (E. Myers - emyers@geominingec.com)</strong>. Click here to review and approve.
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
                New company intake records are submitted under review for statutory authorization by either the <strong>Executive Director (Carlos Etingban)</strong> or the <strong>Registry Department Boss (E. Myers)</strong>.
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

      {/* Top Welcome & Quick Actions Bar */}
      <div className="bg-[#2a602f] border border-[#235027] rounded-3xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc30d] text-slate-950 text-[10px] font-black uppercase tracking-widest mb-3 shadow-sm">
              <ShieldCheck size={13} />
              <span>Executive Management Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Regulatory Compliance &amp; Cadastre Portal
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
              Real-time monitoring of corporate entity registrations, mineral exploration concessions, EPA statutory audits, and strategic client engagements across the Republic of Liberia.
            </p>
          </div>

          {/* Action Buttons with Role Checking */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {canManageCompanies ? (
              <button
                onClick={onOpenNewCompanyModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#2a602f] text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 border border-white/80 cursor-pointer"
              >
                <PlusCircle size={15} />
                <span>Register Company</span>
              </button>
            ) : (
              <button
                onClick={() => onSelectTab('companies')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#2a602f] text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 border border-white/80 cursor-pointer"
              >
                <Building2 size={15} />
                <span>Review Companies</span>
              </button>
            )}

            {canManageLicenses ? (
              <button
                onClick={onOpenNewLicenseModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ffc30d] hover:bg-[#e5ae0c] text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 border border-[#ffc30d] cursor-pointer"
              >
                <FileCheck2 size={15} />
                <span>Issue Mining License</span>
              </button>
            ) : (
              <button
                onClick={() => onSelectTab('licenses')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ffc30d] hover:bg-[#e5ae0c] text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 border border-[#ffc30d] cursor-pointer"
              >
                <FileCheck2 size={15} />
                <span>Inspect Concessions</span>
              </button>
            )}

            {canExport && (
              <button
                onClick={() => onSelectTab('reports')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <Download size={15} />
                <span>Export Dossier</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Companies */}
        <div
          onClick={() => onSelectTab('companies')}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#2d5a27] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-[#2d5a27] border border-emerald-200">
              {metrics.activeCompanies} Active
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">{metrics.totalCompanies}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Registered Companies
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Pending Review: <strong className="text-amber-600">{metrics.pendingCompanies}</strong></span>
            <ArrowRight size={14} className="text-[#2d5a27] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Mining Licenses */}
        <div
          onClick={() => onSelectTab('licenses')}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-amber-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck2 size={24} />
            </div>
            {metrics.urgentLicenses > 0 ? (
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                <AlertTriangle size={11} />
                {metrics.urgentLicenses} Urgent
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                All Current
              </span>
            )}
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">{metrics.totalLicenses}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Statutory Mining Licenses
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Expiring &lt;30d: <strong className="text-red-600">{metrics.urgentLicenses}</strong></span>
            <ArrowRight size={14} className="text-amber-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Compliance Index */}
        <div
          onClick={() => onSelectTab('compliance')}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-purple-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Scale size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              EPA &amp; MME
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">{metrics.complianceRate}%</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Statutory Compliance Rate
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>{metrics.compliantObligations} / {metrics.totalObligations} Audits Verified</span>
            <ArrowRight size={14} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Clients & Total Pipeline */}
        <div
          onClick={() => onSelectTab('clients')}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users2 size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Pipeline
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            ${(metrics.totalContractValue / 1000).toFixed(0)}k
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Total Client Engagements
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Active Clients: <strong>{metrics.totalClients}</strong></span>
            <ArrowRight size={14} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Urgent Expirations Radar Banner */}
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
                    className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm text-center"
                  >
                    Initiate Statutory Renewal
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analytics Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Concessions by County (8 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                Active Mining Concessions by County
              </h3>
              <p className="text-xs text-slate-500">Distribution across Liberian administrative jurisdictions</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl text-[#2d5a27]">
              <MapPin size={18} />
            </div>
          </div>

          <div className="h-64 w-full">
            {countyChartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2d5a27] flex items-center justify-center mb-2">
                  <MapPin size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">No Active Concessions on Record</span>
                <span className="text-[11px] text-slate-500 mt-1 max-w-xs">County distribution map will populate automatically when new mining licenses are registered.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="count" fill="#2a602f" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Chart: License Categories Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                Statutory License Tiers
              </h3>
              <p className="text-xs text-slate-500">12 Statutory License Categories</p>
            </div>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <FileCheck2 size={18} />
            </div>
          </div>

          <div className="h-64 w-full">
            {categoryChartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
                  <FileCheck2 size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">No License Categories Active</span>
                <span className="text-[11px] text-slate-500 mt-1 max-w-xs">Tier distribution pie chart will activate dynamically upon new license issuance.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Officer Company Registry Intake Tracker — Super Admin, Executive Director & Registry Boss */}
      {canTrackRegistrations && (
        <div className="bg-white border-2 border-emerald-500/20 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#2a602f] text-white shadow-sm">
                <UserCheck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    Officer Company Registry Intake &amp; Provenance Tracker
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffc30d]/20 text-emerald-900 border border-[#ffc30d]/40 text-[10px] font-black uppercase">
                    {isExecutiveDirector
                      ? 'Executive Director Oversight'
                      : isRegistryBoss
                      ? 'Registry Boss Console'
                      : 'Super Admin Authority'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track who entered every corporate entity into the GMEC Cadastre, submission timestamps, and statutory approvals.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('companies')}
              className="text-xs text-[#2a602f] hover:text-[#1e4621] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
            >
              <span>Companies Directory</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {companies.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#2d5a27] border border-emerald-200 flex items-center justify-center mx-auto mb-2.5">
                <Building2 size={22} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                Cadastre Ready for Fresh Intake
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-3">
                All legacy company records have been cleared. The Registry Department can now record and submit new companies directly.
              </p>
              {canManageCompanies && (
                <button
                  onClick={onOpenNewCompanyModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2a602f] hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                >
                  <Plus size={14} className="text-[#ffc30d]" />
                  <span>Register Company</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {companies.slice(0, 6).map((comp) => {
                const officerName = comp.registeredByName || 'Official Cadastre Officer';
                const officerEmail = comp.registeredByEmail || 'N/A';
                const officerDept = comp.registeredByDepartment || comp.registeredByRole?.replace('_', ' ') || 'Registry Dept';
                const filedDate = comp.registeredAt ? comp.registeredAt.substring(0, 10) : comp.dateOfApplication || comp.registrationDate || '—';
                const isPending = comp.status === 'under_review' || comp.status === 'pending';

                return (
                  <div
                    key={comp.id}
                    onClick={() => onSelectTab('companies')}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-[#2a602f] bg-slate-50/60 hover:bg-white transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-[#2a602f] transition-colors">
                        {comp.companyName}
                      </span>
                      {isPending ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                          Under Review
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-200 shrink-0">
                          {comp.status}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mb-2">
                      {comp.registrationNumber} • {comp.county} County
                    </div>

                    {/* Officer Intake Tracking Box */}
                    <div className="pt-2 border-t border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs">
                        <UserCheck size={12} className="text-[#2a602f] shrink-0" />
                        <span className="text-[10px] text-slate-400 font-semibold">Entered by:</span>
                        <strong className="text-slate-900 text-[11px] truncate">{officerName}</strong>
                      </div>
                      <div className="text-[10px] text-slate-500 pl-4 truncate">
                        {officerEmail} • <span className="text-slate-400">{officerDept}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pl-4 pt-0.5">
                        <span>Filed: {filedDate}</span>
                        {comp.approvedBy && (
                          <span className="text-emerald-700 font-bold truncate max-w-[130px]" title={comp.approvedBy}>
                            ✓ {comp.approvedBy.split('(')[0].trim()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Recent Activity & Audit Trail Preview - Strictly restricted to Super Admin, Executive Director, and Administrator */}
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
              className="text-xs text-[#2d5a27] hover:text-emerald-800 font-bold uppercase tracking-wider underline flex items-center gap-1 cursor-pointer"
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

      {/* Full Audit Trail Modal for Executive Director, Administrator & Super Admin */}
      {showFullAuditModal && canViewAuditTrail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowFullAuditModal(false)} />
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
                  <div key={log.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
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

