import React from 'react';
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
  FileText,
  Users2,
  Activity,
  PlusCircle,
  Download,
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

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNewCompanyModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#2a602f] text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 border border-white/80"
            >
              <PlusCircle size={15} />
              <span>Register Company</span>
            </button>
            <button
              onClick={onOpenNewLicenseModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ffc30d] hover:bg-[#e5ae0c] text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 border border-[#ffc30d]"
            >
              <FileCheck2 size={15} />
              <span>Issue Mining License</span>
            </button>
            <button
              onClick={() => onSelectTab('reports')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
            >
              <Download size={15} />
              <span>Export Dossier</span>
            </button>
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
          </div>
        </div>
      </div>

      {/* Recent Activity & Audit Trail Preview */}
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
            onClick={() => onSelectTab('security')}
            className="text-xs text-[#2d5a27] hover:text-emerald-800 font-bold uppercase tracking-wider underline flex items-center gap-1"
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
    </div>
  );
};

