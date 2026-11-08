import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Scale,
  Eye,
  Trash2,
  X,
  Building2,
  Coins,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import {
  MiningLicense,
  LiberianLicenseCategory,
  RenewalStatus,
  ComplianceObligation,
} from '../../types/crm';

const LIBERIAN_LICENSE_CATEGORIES: LiberianLicenseCategory[] = [
  'Class A – Industrial Mining License',
  'Class B – Semi-Mechanized Mining License',
  'Class C – Artisanal Mining License',
  'Mineral Exploration License',
  'Prospecting License',
  'Commercial Rock Quarry License',
  'River Sand Mining License',
  'Dealer / Exporter License (Gold & Diamonds)',
  'Mineral Broker License',
  'Commercial Blasting Permit',
  'Certified Blaster License',
  'Laterite Mining Permit',
];

interface CRMLicensesProps {
  initialSearch?: string;
  onSelectTab?: (tab: string) => void;
  renewTargetLicense?: MiningLicense | null;
  onClearRenewTarget?: () => void;
}

export const CRMLicenses: React.FC<CRMLicensesProps> = ({
  initialSearch = '',
  onSelectTab,
  renewTargetLicense,
  onClearRenewTarget,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLicense, setSelectedLicense] = useState<MiningLicense | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [renewalModalLicense, setRenewalModalLicense] = useState<MiningLicense | null>(renewTargetLicense || null);

  // Renewal Form State
  const [renewalExpiryDate, setRenewalExpiryDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  );
  const [renewalFee, setRenewalFee] = useState(10000);

  // New License State
  const companies = crmService.getCompanies();
  const [newLic, setNewLic] = useState({
    licenseNumber: '',
    category: 'Mineral Exploration License' as LiberianLicenseCategory,
    companyId: companies[0]?.id || '',
    companyName: companies[0]?.companyName || '',
    county: 'Nimba',
    district: '',
    concessionArea: '250 Sq. km',
    coordinates: "07°20'N, 008°40'W",
    issueDate: new Date().toISOString().substring(0, 10),
    expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    renewalStatus: 'current' as RenewalStatus,
    statutoryFeeUSD: 25000,
    feePaymentStatus: 'paid' as MiningLicense['feePaymentStatus'],
    cadastralCode: `CAD-LBR-${Math.floor(1000 + Math.random() * 9000)}`,
    primaryCommodity: 'Gold' as MiningLicense['primaryCommodity'],
    assignedInspector: 'Emmanuel K. Myers',
    notes: '',
  });

  const licenses = crmService.getLicenses();
  const canManage = crmService.checkPermission('canManageLicenses');
  const canApproveCompliance = crmService.checkPermission('canApproveCompliance');
  const canDelete = crmService.checkPermission('canDeleteRecords');

  // React to prop change
  React.useEffect(() => {
    if (renewTargetLicense) {
      setRenewalModalLicense(renewTargetLicense);
      setRenewalFee(renewTargetLicense.statutoryFeeUSD);
    }
  }, [renewTargetLicense]);

  // Filtering
  const filteredLicenses = licenses.filter((lic) => {
    const matchesSearch =
      search === '' ||
      lic.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      lic.companyName.toLowerCase().includes(search.toLowerCase()) ||
      lic.category.toLowerCase().includes(search.toLowerCase()) ||
      lic.cadastralCode.toLowerCase().includes(search.toLowerCase()) ||
      lic.county.toLowerCase().includes(search.toLowerCase()) ||
      lic.primaryCommodity.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || lic.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || lic.renewalStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleIssueLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLic.licenseNumber || !newLic.companyId) return;

    const company = companies.find((c) => c.id === newLic.companyId);

    crmService.addLicense({
      licenseNumber: newLic.licenseNumber,
      category: newLic.category,
      companyId: newLic.companyId,
      companyName: company?.companyName || newLic.companyName,
      county: newLic.county,
      district: newLic.district,
      concessionArea: newLic.concessionArea,
      coordinates: newLic.coordinates,
      issueDate: newLic.issueDate,
      expiryDate: newLic.expiryDate,
      renewalStatus: newLic.renewalStatus,
      statutoryFeeUSD: Number(newLic.statutoryFeeUSD) || 10000,
      feePaymentStatus: newLic.feePaymentStatus,
      cadastralCode: newLic.cadastralCode,
      primaryCommodity: newLic.primaryCommodity,
      assignedInspector: newLic.assignedInspector,
      notes: newLic.notes,
    });

    setShowIssueModal(false);
  };

  const handleConfirmRenewal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewalModalLicense) return;

    crmService.renewLicense(renewalModalLicense.id, renewalExpiryDate, Number(renewalFee) || 10000);
    setRenewalModalLicense(null);
    if (onClearRenewTarget) onClearRenewTarget();
  };

  const handleToggleObligation = (licenseId: string, obligationId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'compliant' ? 'pending' : 'compliant';
    crmService.updateComplianceObligationStatus(licenseId, obligationId, nextStatus);
    setSelectedLicense(crmService.getLicenseById(licenseId) || null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to revoke/delete this mining license from the cadastre?')) {
      crmService.deleteLicense(id);
      setSelectedLicense(null);
    }
  };

  const getStatusBadge = (status: RenewalStatus) => {
    const map: Record<RenewalStatus, { bg: string; text: string; border: string; label: string }> = {
      current: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Valid / Current' },
      expiring_soon: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Expiring Soon' },
      urgent: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Urgent (<30 Days)' },
      in_renewal: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'In Renewal' },
      expired: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300', label: 'Expired' },
      revoked: { bg: 'bg-slate-200', text: 'text-slate-700', border: 'border-slate-400', label: 'Revoked' },
    };
    const c = map[status] || map.current;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${c.bg} ${c.text} ${c.border}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <FileCheck2 size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Mining License Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Statutory tracking of all 12 Liberian license categories, concession block coordinates, EPA environmental covenants, and validity renewal windows.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowIssueModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus size={16} />
            <span>Issue Mining License</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by license number, company, category, cadastral code, or commodity..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-[200px] truncate"
          >
            <option value="all">All 12 License Categories</option>
            {LIBERIAN_LICENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Renewal Statuses</option>
            <option value="current">Current / Valid</option>
            <option value="urgent">Urgent (&lt;30 Days)</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Licenses Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">License Number &amp; Cadastre</th>
                <th className="py-3.5 px-4">License Category</th>
                <th className="py-3.5 px-4">Concession Holder</th>
                <th className="py-3.5 px-4">Location &amp; Area</th>
                <th className="py-3.5 px-4">Commodity</th>
                <th className="py-3.5 px-4">Validity Window</th>
                <th className="py-3.5 px-4">Renewal Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No mining licenses found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLicenses.map((lic) => {
                  const now = new Date().getTime();
                  const exp = new Date(lic.expiryDate).getTime();
                  const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={lic.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs font-black text-slate-900">{lic.licenseNumber}</div>
                        <div className="font-mono text-[10px] text-slate-400">{lic.cadastralCode}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 text-xs">{lic.category}</div>
                        <div className="text-[10px] text-slate-400">Fee: ${lic.statutoryFeeUSD.toLocaleString()}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">{lic.companyName}</div>
                        <div className="text-[10px] text-slate-400">Inspector: {lic.assignedInspector}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <MapPin size={12} className="text-amber-600" />
                          <span>{lic.county}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold">{lic.concessionArea}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-black">
                          {lic.primaryCommodity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-slate-700">Expires: <strong className="text-slate-900">{lic.expiryDate}</strong></div>
                        <div className={`text-[10px] font-bold mt-0.5 ${daysLeft < 0 ? 'text-rose-600' : daysLeft < 30 ? 'text-red-600' : 'text-slate-400'}`}>
                          {daysLeft < 0 ? `Overdue by ${Math.abs(daysLeft)}d` : `${daysLeft} days remaining`}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(lic.renewalStatus)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedLicense(lic)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
                            title="Inspect Compliance & Details"
                          >
                            <Eye size={13} />
                            <span>Details</span>
                          </button>

                          {canManage && (
                            <button
                              onClick={() => {
                                setRenewalModalLicense(lic);
                                setRenewalFee(lic.statutoryFeeUSD);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition-colors flex items-center gap-1 border border-amber-200"
                              title="Renew License Expiration"
                            >
                              <RefreshCw size={12} />
                              <span>Renew</span>
                            </button>
                          )}

                          {canDelete && (
                            <button
                              onClick={() => handleDelete(lic.id)}
                              className="p-1.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete License"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── License Detail & Compliance Modal ────────────────────────────── */}
      {selectedLicense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setSelectedLicense(null)} />
          <div className="relative bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200 shrink-0">
                  <FileCheck2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight font-mono">
                      {selectedLicense.licenseNumber}
                    </h2>
                    {getStatusBadge(selectedLicense.renewalStatus)}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedLicense.category} • Concession Holder: <strong className="text-slate-900">{selectedLicense.companyName}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLicense(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* Concession Cadastral Summary Cards */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Cadastre &amp; Location</span>
                <div className="font-mono text-xs font-bold text-slate-900">{selectedLicense.cadastralCode}</div>
                <div className="text-xs text-slate-600 mt-0.5">{selectedLicense.county} County</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedLicense.coordinates || 'N/A'}</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Concession Area &amp; Ore</span>
                <div className="text-xs font-bold text-slate-900">{selectedLicense.concessionArea}</div>
                <div className="text-xs text-slate-600 mt-0.5">Commodity: <strong className="text-amber-700">{selectedLicense.primaryCommodity}</strong></div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Statutory Fees &amp; Term</span>
                <div className="text-xs font-bold text-slate-900">${selectedLicense.statutoryFeeUSD.toLocaleString()} USD</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Valid: {selectedLicense.issueDate} &rarr; <span className="text-red-700 font-bold">{selectedLicense.expiryDate}</span>
                </div>
              </div>
            </div>

            {/* Compliance Obligations Checklist */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Scale size={16} className="text-[#2d5a27]" />
                  <span>EPA &amp; Statutory Compliance Obligations</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">Click status to toggle compliance</span>
              </div>

              <div className="space-y-2.5">
                {selectedLicense.complianceObligations.map((obl) => {
                  const isCompliant = obl.status === 'compliant';
                  const isOverdue = obl.status === 'overdue';
                  return (
                    <div
                      key={obl.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          onClick={() => {
                            if (canApproveCompliance) {
                              handleToggleObligation(selectedLicense.id, obl.id, obl.status);
                            }
                          }}
                          className={`cursor-pointer p-1.5 rounded-xl border mt-0.5 transition-colors ${
                            isCompliant
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                              : isOverdue
                              ? 'bg-red-100 text-red-700 border-red-300'
                              : 'bg-amber-100 text-amber-700 border-amber-300'
                          }`}
                        >
                          {isCompliant ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{obl.title}</div>
                          <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{obl.description}</div>
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                            <span>Regulator: <strong className="text-slate-700">{obl.regulator}</strong></span>
                            <span>•</span>
                            <span>Due Date: <strong className="text-slate-700">{obl.dueDate}</strong></span>
                            {obl.referenceNumber && (
                              <>
                                <span>•</span>
                                <span className="font-mono font-bold text-slate-600">Ref: {obl.referenceNumber}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (canApproveCompliance) {
                            handleToggleObligation(selectedLicense.id, obl.id, obl.status);
                          }
                        }}
                        disabled={!canApproveCompliance}
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border shrink-0 transition-colors ${
                          isCompliant
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {obl.status}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Renewal Action in Modal */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedLicense(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Close
              </button>
              {canManage && (
                <button
                  type="button"
                  onClick={() => {
                    setRenewalModalLicense(selectedLicense);
                    setSelectedLicense(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <RefreshCw size={13} />
                  <span>Renew This License</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Issue New License Modal ─────────────────────────────────────── */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowIssueModal(false)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <FileCheck2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    Issue Mining License
                  </h2>
                  <p className="text-xs text-slate-500">Record a statutory mineral concession into the Liberian cadastre</p>
                </div>
              </div>
              <button onClick={() => setShowIssueModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleIssueLicense} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    License Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLic.licenseNumber}
                    onChange={(e) => setNewLic({ ...newLic, licenseNumber: e.target.value })}
                    placeholder="e.g. MEL-2026-0099"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Concession Holder (Company) *
                  </label>
                  <select
                    value={newLic.companyId}
                    onChange={(e) => setNewLic({ ...newLic, companyId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Liberian Statutory License Category *
                </label>
                <select
                  value={newLic.category}
                  onChange={(e) => setNewLic({ ...newLic, category: e.target.value as LiberianLicenseCategory })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  {LIBERIAN_LICENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">County</label>
                  <select
                    value={newLic.county}
                    onChange={(e) => setNewLic({ ...newLic, county: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    {['Nimba', 'Bong', 'Montserrado', 'Grand Bassa', 'Lofa', 'Gbarpolu', 'Sinoe', 'Grand Cape Mount'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Concession Area</label>
                  <input
                    type="text"
                    value={newLic.concessionArea}
                    onChange={(e) => setNewLic({ ...newLic, concessionArea: e.target.value })}
                    placeholder="e.g. 250 Sq. km"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Commodity</label>
                  <select
                    value={newLic.primaryCommodity}
                    onChange={(e) => setNewLic({ ...newLic, primaryCommodity: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  >
                    {['Gold', 'Diamonds', 'Iron Ore', 'Lithium', 'Bauxite', 'Aggregates', 'River Sand', 'Laterite', 'Multi-Commodity'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={newLic.issueDate}
                    onChange={(e) => setNewLic({ ...newLic, issueDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Expiration Date *</label>
                  <input
                    type="date"
                    required
                    value={newLic.expiryDate}
                    onChange={(e) => setNewLic({ ...newLic, expiryDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-wider shadow-md"
                >
                  Issue &amp; Enroll License
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Renew License Modal ─────────────────────────────────────────── */}
      {renewalModalLicense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setRenewalModalLicense(null)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-amber-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Statutory License Renewal
                </h3>
              </div>
              <button onClick={() => setRenewalModalLicense(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-4 text-xs">
              <div className="font-bold text-slate-900">{renewalModalLicense.licenseNumber}</div>
              <div className="text-slate-500">{renewalModalLicense.category}</div>
              <div className="text-slate-600 font-semibold mt-1">Concession: {renewalModalLicense.companyName}</div>
              <div className="text-red-700 font-bold mt-1">Current Expiration: {renewalModalLicense.expiryDate}</div>
            </div>

            <form onSubmit={handleConfirmRenewal} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  New Extended Expiration Date *
                </label>
                <input
                  type="date"
                  required
                  value={renewalExpiryDate}
                  onChange={(e) => setRenewalExpiryDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Statutory Renewal Fee Paid (USD)
                </label>
                <input
                  type="number"
                  value={renewalFee}
                  onChange={(e) => setRenewalFee(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px]">
                <ShieldCheck size={14} className="inline mr-1" />
                <span>Renewal will reset license status to VALID/CURRENT and record compliance audit log.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenewalModalLicense(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-wider"
                >
                  Confirm Renewal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

