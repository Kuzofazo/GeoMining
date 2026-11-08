import React, { useState } from 'react';
import {
  FileBarChart2,
  Download,
  Printer,
  Search,
  Filter,
  Building2,
  FileCheck2,
  Users2,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import Logo from '../Logo';

export const CRMReports: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<
    'executive_summary' | 'license_expiry' | 'compliance_audit' | 'company_directory'
  >('executive_summary');

  const metrics = crmService.getDashboardMetrics();
  const companies = crmService.getCompanies();
  const licenses = crmService.getLicenses();
  const clients = crmService.getClients();
  const auditLogs = crmService.getAuditLogs();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-[#2d5a27] rounded-xl">
              <FileBarChart2 size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Management Reporting &amp; Regulatory Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Exportable regulatory audits, statutory compliance dossiers, concession validity forecasts, and CSV datasets for the Ministry of Mines &amp; Energy and Executive Directorate.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <Printer size={15} className="text-amber-400" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* CSV Export Quick Action Cards (print:hidden) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-emerald-500 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-emerald-50 text-[#2d5a27] rounded-xl">
                <Building2 size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {companies.length} Records
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase">Companies Cadastre</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Registration numbers, TINs, directors, dates</p>
          </div>
          <button
            onClick={() => crmService.exportDataToCSV('companies')}
            className="mt-3 w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#2d5a27] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-emerald-200"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-amber-500 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <FileCheck2 size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {licenses.length} Records
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase">Mining Licenses</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">12 categories, expirations, fees, coordinates</p>
          </div>
          <button
            onClick={() => crmService.exportDataToCSV('licenses')}
            className="mt-3 w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-amber-200"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-blue-500 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Users2 size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {clients.length} Clients
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase">Clients &amp; Pipeline</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Investor profiles, contract values, stages</p>
          </div>
          <button
            onClick={() => crmService.exportDataToCSV('clients')}
            className="mt-3 w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-blue-200"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-purple-500 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                <ShieldCheck size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {auditLogs.length} Events
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase">Security Audit Trail</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Every login, edit, upload, and export event</p>
          </div>
          <button
            onClick={() => crmService.exportDataToCSV('audit_logs')}
            className="mt-3 w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-purple-200"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ─── Printable Formal Regulatory Dossier ─────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Dossier Header */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-50 rounded-2xl border border-slate-200 shrink-0">
              <Logo className="h-16 w-16" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2d5a27]">
                Republic of Liberia • Extractive Industries Cadastre
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                GEOMINING &amp; Environmental Consultancy INC
              </h2>
              <p className="text-xs text-slate-500">
                Official Regulatory Compliance, Mineral Concessions &amp; Corporate Intelligence Dossier
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-bold text-slate-900">Document Ref: GMEC-REG-{new Date().getFullYear()}-001</div>
            <div className="text-slate-500 text-[11px]">Date Generated: {new Date().toISOString().substring(0, 10)}</div>
            <div className="text-[10px] text-emerald-700 font-bold uppercase mt-1">Status: Certified Official</div>
          </div>
        </div>

        {/* Section 1: Executive Cadastral Summary */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
            01. Executive Cadastre Statistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-slate-900">{metrics.totalCompanies}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Total Registered Entities</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">{metrics.activeCompanies} Active</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-amber-600">{metrics.totalLicenses}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Concession Licenses</div>
              <div className="text-[10px] text-slate-500 mt-0.5">12 Statutory Classes</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-emerald-700">{metrics.complianceRate}%</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Statutory Compliance</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-0.5">EPA &amp; MME Aligned</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-blue-700">${(metrics.totalContractValue / 1000).toFixed(0)}k</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Pipeline Commitments</div>
              <div className="text-[10px] text-blue-600 font-bold mt-0.5">{metrics.totalClients} Corporate Clients</div>
            </div>
          </div>
        </div>

        {/* Section 2: Concession Validity & Expiration Forecast */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              02. Mining License Validity &amp; Expiration Forecast
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Sorted by Expiration Date</span>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">License No</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Concessionaire</th>
                  <th className="py-2.5 px-3">County</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3">Renewal Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {licenses.map((lic) => (
                  <tr key={lic.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{lic.licenseNumber}</td>
                    <td className="py-2.5 px-3">{lic.category}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{lic.companyName}</td>
                    <td className="py-2.5 px-3">{lic.county}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{lic.expiryDate}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-800">
                        {lic.renewalStatus.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Registered Corporate Entities Overview */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
            03. Registered Corporate Entities in Liberian Cadastre
          </h3>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Company Legal Name</th>
                  <th className="py-2.5 px-3">Reg No</th>
                  <th className="py-2.5 px-3">TIN</th>
                  <th className="py-2.5 px-3">Entity Type</th>
                  <th className="py-2.5 px-3">County</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{c.companyName}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">{c.registrationNumber}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">{c.taxIdentificationNumber}</td>
                    <td className="py-2.5 px-3">{c.entityType}</td>
                    <td className="py-2.5 px-3">{c.county}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Attestation & Directorate Signatures */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-6">
              Registry &amp; Cadastre Authority
            </div>
            <div className="border-b border-slate-400 w-48 mb-2" />
            <div className="font-bold text-slate-900">Helena K. Flomo</div>
            <div className="text-[11px] text-slate-500">Chief Registrar • GMEC Cadastre</div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-6">
              Executive Director Approval
            </div>
            <div className="border-b border-slate-400 w-48 ml-auto mb-2" />
            <div className="font-bold text-slate-900">Carlos E. Tingban</div>
            <div className="text-[11px] text-slate-500">
              Executive Director &amp; Former Assistant Minister for Mines
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

