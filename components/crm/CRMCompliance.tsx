import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  Building2,
  FileCheck2,
  Plus,
  X,
  FileText,
  Calendar,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import { MiningLicense, ComplianceObligation } from '../../types/crm';

export const CRMCompliance: React.FC = () => {
  const [search, setSearch] = useState('');
  const [regulatorFilter, setRegulatorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingObligation, setEditingObligation] = useState<{
    license: MiningLicense;
    obligation: ComplianceObligation;
  } | null>(null);

  const [newStatus, setNewStatus] = useState<ComplianceObligation['status']>('compliant');
  const [refNumber, setRefNumber] = useState('');

  const licenses = crmService.getLicenses();
  const metrics = crmService.getDashboardMetrics();
  const canApprove = crmService.checkPermission('canApproveCompliance');

  // Flatten obligations with license context
  const allObligations: { license: MiningLicense; obligation: ComplianceObligation }[] = [];
  licenses.forEach((lic) => {
    lic.complianceObligations.forEach((obl) => {
      allObligations.push({ license: lic, obligation: obl });
    });
  });

  const filtered = allObligations.filter(({ license, obligation }) => {
    const matchesSearch =
      search === '' ||
      obligation.title.toLowerCase().includes(search.toLowerCase()) ||
      license.companyName.toLowerCase().includes(search.toLowerCase()) ||
      license.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      obligation.regulator.toLowerCase().includes(search.toLowerCase());

    const matchesRegulator = regulatorFilter === 'all' || obligation.regulator === regulatorFilter;
    const matchesStatus = statusFilter === 'all' || obligation.status === statusFilter;

    return matchesSearch && matchesRegulator && matchesStatus;
  });

  const handleUpdateObligation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingObligation) return;

    crmService.updateComplianceObligationStatus(
      editingObligation.license.id,
      editingObligation.obligation.id,
      newStatus
    );

    // Update reference number if provided
    if (refNumber.trim()) {
      editingObligation.obligation.referenceNumber = refNumber.trim();
    }

    setEditingObligation(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Scale size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Regulatory Compliance &amp; EPA Audit Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Statutory tracking of environmental impact covenants (EIA/ESIA), EPA water testing audits, MME cadastral surface rentals, and community development escrows in Liberia.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-2xl border border-purple-200 text-purple-900 font-bold text-xs shrink-0">
          <ShieldCheck size={16} className="text-purple-700" />
          <span>Statutory Index: <strong>{metrics.complianceRate}% Compliant</strong></span>
        </div>
      </div>

      {/* 4 Compliance Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Monitored Obligations</div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalObligations}</div>
          <p className="text-[11px] text-slate-400 mt-1">Across {metrics.totalLicenses} active concessions</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">Fully Verified Compliant</div>
          <div className="text-2xl font-black text-emerald-700">{metrics.compliantObligations}</div>
          <p className="text-[11px] text-emerald-600 mt-1">Clearances issued &amp; logged</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">Pending Field Audits</div>
          <div className="text-2xl font-black text-amber-600">
            {allObligations.filter((o) => o.obligation.status === 'pending').length}
          </div>
          <p className="text-[11px] text-amber-600 mt-1">Awaiting inspection sign-off</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-red-700 text-xs font-bold uppercase tracking-wider mb-1">Statutory Overdue</div>
          <div className="text-2xl font-black text-red-600">
            {allObligations.filter((o) => o.obligation.status === 'overdue').length}
          </div>
          <p className="text-[11px] text-red-600 mt-1">Requires immediate regularization</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by obligation name, concession company, regulator, or license..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={regulatorFilter}
            onChange={(e) => setRegulatorFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All Regulatory Bodies</option>
            <option value="EPA Liberia">EPA Liberia</option>
            <option value="Ministry of Mines & Energy (MME)">Ministry of Mines &amp; Energy (MME)</option>
            <option value="Liberia Revenue Authority (LRA)">Liberia Revenue Authority (LRA)</option>
            <option value="Local Community">Local Community (CDA)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All Compliance Statuses</option>
            <option value="compliant">Compliant</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="waived">Waived</option>
          </select>
        </div>
      </div>

      {/* Obligations List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
            No compliance obligations match your current search criteria.
          </div>
        ) : (
          filtered.map(({ license, obligation }) => {
            const isCompliant = obligation.status === 'compliant';
            const isOverdue = obligation.status === 'overdue';

            return (
              <div
                key={obligation.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-purple-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`p-2.5 rounded-2xl border shrink-0 mt-0.5 ${
                      isCompliant
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isOverdue
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {isCompliant ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{obligation.title}</h4>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        {obligation.regulator}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{obligation.description}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 flex-wrap">
                      <span>Concession: <strong className="text-slate-800">{license.companyName}</strong></span>
                      <span>•</span>
                      <span>License: <strong className="font-mono text-slate-800">{license.licenseNumber}</strong></span>
                      <span>•</span>
                      <span>County: <strong className="text-slate-800">{license.county}</strong></span>
                      <span>•</span>
                      <span>Due: <strong className="text-slate-800">{obligation.dueDate}</strong></span>
                      {obligation.referenceNumber && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Ref: {obligation.referenceNumber}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <span
                    className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border ${
                      isCompliant
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isOverdue
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {obligation.status}
                  </span>

                  {canApprove && (
                    <button
                      onClick={() => {
                        setEditingObligation({ license, obligation });
                        setNewStatus(obligation.status);
                        setRefNumber(obligation.referenceNumber || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                    >
                      Update Status
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── Update Obligation Modal ─────────────────────────────────────── */}
      {editingObligation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setEditingObligation(null)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Update Compliance Status</h3>
              <button onClick={() => setEditingObligation(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-4 text-xs">
              <div className="font-bold text-slate-900">{editingObligation.obligation.title}</div>
              <div className="text-slate-500 mt-0.5">{editingObligation.license.companyName} ({editingObligation.license.licenseNumber})</div>
            </div>

            <form onSubmit={handleUpdateObligation} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Statutory Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option value="compliant">Compliant (Audit / Fee Cleared)</option>
                  <option value="pending">Pending (Awaiting Documentation)</option>
                  <option value="overdue">Overdue (Statutory Penalty Flagged)</option>
                  <option value="waived">Waived (Written MME/EPA Exemption)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Official Clearance / Audit Ref Number
                </label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="e.g. EPA-LR-AUD-2026-99"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingObligation(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black uppercase tracking-wider"
                >
                  Save &amp; Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

