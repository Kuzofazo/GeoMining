import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  FileText,
  UserCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Eye,
  Trash2,
  Download,
  Upload,
  X,
  FileCheck,
  MapPin,
  Mail,
  Phone,
  Shield,
  Clock,
  Sparkles,
  MessageSquare,
  Send,
  Award,
  Globe,
  Briefcase,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import {
  CompanyRecord,
  RegistrationStatus,
  EntityType,
  CompanyDirector,
  CompanyDocument,
  LiberianLicenseCategory,
} from '../../types/crm';
import { RecordCommentsModal } from './RecordCommentsModal';

export const LIBERIAN_LICENSE_CATEGORIES: LiberianLicenseCategory[] = [
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

export const LIBERIAN_COUNTIES = [
  'Montserrado',
  'Nimba',
  'Bong',
  'Grand Bassa',
  'Lofa',
  'Gbarpolu',
  'Grand Cape Mount',
  'Grand Gedeh',
  'Sinoe',
  'Maryland',
  'River Cess',
  'River Gee',
  'Bomi',
  'Grand Kru',
  'Margibi',
];

interface CRMCompaniesProps {
  initialSearch?: string;
}

export const CRMCompanies: React.FC<CRMCompaniesProps> = ({ initialSearch = '' }) => {
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<CompanyRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [commentTargetCompany, setCommentTargetCompany] = useState<CompanyRecord | null>(null);

  // New Company Form State — explicitly matching user requirements:
  // Company Name, Licenses Types, Date of Application, Expire Date, County/city of Operation, Company Office address, Name of Owner, Cell No., Email
  const [newCompany, setNewCompany] = useState({
    companyName: '',
    registrationNumber: '',
    taxIdentificationNumber: '',
    licenseType: 'Class A – Industrial Mining License' as LiberianLicenseCategory,
    dateOfApplication: new Date().toISOString().substring(0, 10),
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    county: 'Montserrado',
    cityOfOperation: 'Monrovia',
    registeredAddress: '',
    officeAddress: '',
    ownerName: '',
    cellNo: '',
    primaryEmail: '',
    primaryPhone: '',
    entityType: 'Corporation' as EntityType,
    status: 'under_review' as RegistrationStatus,
    assignedOfficer: 'Helena K. Flomo',
    notes: '',
    directorNationality: 'Liberian',
  });

  // Document Upload State
  const [newDoc, setNewDoc] = useState({
    title: '',
    documentType: 'Articles of Incorporation' as CompanyDocument['documentType'],
    fileName: '',
    fileSize: '2.5 MB',
    notes: '',
  });

  const companies = crmService.getCompanies();
  const currentUser = crmService.getCurrentUser();
  const isRegistryDept = currentUser?.role === 'registry_department';
  const isAdministrator = currentUser?.role === 'administrator';
  const isExecutiveDirector = currentUser?.role === 'management';
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canManage = crmService.checkPermission('canManageCompanies');
  const canApprove = crmService.checkPermission('canApproveRegistrations');
  const canDelete = crmService.checkPermission('canDeleteRecords');
  const pendingApprovalCount = companies.filter((c) => c.status === 'under_review' || c.status === 'pending').length;

  const handleQuickApprove = (company: CompanyRecord) => {
    crmService.updateCompanyStatus(company.id, 'approved');
  };

  // Filtering
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      search === '' ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      (c.licenseType && c.licenseType.toLowerCase().includes(search.toLowerCase())) ||
      (c.ownerName && c.ownerName.toLowerCase().includes(search.toLowerCase())) ||
      (c.cityOfOperation && c.cityOfOperation.toLowerCase().includes(search.toLowerCase())) ||
      (c.cellNo && c.cellNo.toLowerCase().includes(search.toLowerCase())) ||
      (c.officeAddress && c.officeAddress.toLowerCase().includes(search.toLowerCase())) ||
      c.county.toLowerCase().includes(search.toLowerCase()) ||
      c.directors.some((d) => d.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesEntity = entityFilter === 'all' || c.entityType === entityFilter;

    return matchesSearch && matchesStatus && matchesEntity;
  });

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.companyName.trim()) return;

    const regNum = newCompany.registrationNumber.trim() || `LBR-CORP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const tin = newCompany.taxIdentificationNumber.trim() || `TIN-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const officeAddr = newCompany.officeAddress.trim() || newCompany.registeredAddress.trim() || `${newCompany.cityOfOperation || 'Monrovia'}, ${newCompany.county}, Liberia`;
    const phoneVal = newCompany.cellNo.trim() || newCompany.primaryPhone.trim() || '+231 77 000 0000';
    const emailVal = newCompany.primaryEmail.trim() || 'info@company.lr';

    const directors: CompanyDirector[] = newCompany.ownerName.trim()
      ? [
          {
            id: `dir-${Date.now()}`,
            name: newCompany.ownerName.trim(),
            title: 'Principal Owner / Managing Director',
            nationality: newCompany.directorNationality.trim() || 'Liberian',
            idNumber: 'VERIFIED-ID',
            shareholdingPct: 100,
            email: emailVal,
            phone: phoneVal,
          },
        ]
      : [];

    crmService.addCompany({
      companyName: newCompany.companyName.trim(),
      registrationNumber: regNum,
      taxIdentificationNumber: tin,
      entityType: newCompany.entityType,
      licenseType: newCompany.licenseType,
      dateOfApplication: newCompany.dateOfApplication,
      expiryDate: newCompany.expiryDate,
      county: newCompany.county,
      cityOfOperation: newCompany.cityOfOperation.trim() || 'Monrovia',
      registeredAddress: officeAddr,
      officeAddress: officeAddr,
      ownerName: newCompany.ownerName.trim(),
      cellNo: phoneVal,
      primaryPhone: phoneVal,
      primaryEmail: emailVal,
      jurisdiction: `${newCompany.cityOfOperation || 'Monrovia'}, ${newCompany.county}, Liberia`,
      registrationDate: newCompany.dateOfApplication,
      annualRenewalDate: newCompany.expiryDate,
      status: newCompany.status,
      assignedOfficer: newCompany.assignedOfficer,
      notes: newCompany.notes,
      directors,
    });

    setShowAddModal(false);
    // Reset Form
    setNewCompany({
      companyName: '',
      registrationNumber: '',
      taxIdentificationNumber: '',
      licenseType: 'Class A – Industrial Mining License',
      dateOfApplication: new Date().toISOString().substring(0, 10),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      county: 'Montserrado',
      cityOfOperation: 'Monrovia',
      registeredAddress: '',
      officeAddress: '',
      ownerName: '',
      cellNo: '',
      primaryEmail: '',
      primaryPhone: '',
      entityType: 'Corporation',
      status: 'under_review',
      assignedOfficer: 'Helena K. Flomo',
      notes: '',
      directorNationality: 'Liberian',
    });
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany || !newDoc.title) return;

    crmService.addCompanyDocument(selectedCompany.id, {
      title: newDoc.title,
      documentType: newDoc.documentType,
      fileName: newDoc.fileName || `${newDoc.title.replace(/\s+/g, '_')}_Official.pdf`,
      fileSize: newDoc.fileSize,
      notes: newDoc.notes,
    });

    // Refresh selected company
    setSelectedCompany(crmService.getCompanyById(selectedCompany.id) || null);
    setShowDocUploadModal(false);
    setNewDoc({
      title: '',
      documentType: 'Articles of Incorporation',
      fileName: '',
      fileSize: '2.5 MB',
      notes: '',
    });
  };

  const handleStatusChange = (status: RegistrationStatus) => {
    if (!selectedCompany) return;
    crmService.updateCompanyStatus(selectedCompany.id, status);
    setSelectedCompany(crmService.getCompanyById(selectedCompany.id) || null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this company registration? This action is logged.')) {
      crmService.deleteCompany(id);
      setSelectedCompany(null);
    }
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    const config: Record<RegistrationStatus, { bg: string; text: string; border: string }> = {
      active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
      approved: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
      under_review: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      pending: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      expired: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      suspended: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
      rejected: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
    };
    const c = config[status] || config.pending;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${c.bg} ${c.text} ${c.border}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-[#2d5a27] rounded-xl">
              <Building2 size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Company Registration Database
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Official repository of mineral concession holders, commercial entities, registered directors, and statutory corporate incorporation documents in Liberia.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2a602f] hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus size={16} className="text-[#ffc30d]" />
            <span>New Company Registration</span>
          </button>
        )}
      </div>

      {/* Administrator / Executive Director Approval Banner */}
      {canApprove && pendingApprovalCount > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-white to-emerald-50 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-sm shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-amber-950">
                  {pendingApprovalCount} Company Registration{pendingApprovalCount > 1 ? 's' : ''} Awaiting Approval
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                  {isExecutiveDirector ? 'Executive Director' : isAdministrator ? 'Administrator' : 'Super Admin'} Authorization
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Companies registered by the Registry Department require official authorization from either the <strong>Administrator (Z. Teewu)</strong> or <strong>Executive Director (Carlos Etingban)</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter(statusFilter === 'under_review' ? 'all' : 'under_review')}
            className="px-4 py-2 rounded-xl bg-[#2a602f] hover:bg-[#1e4621] text-[#ffc30d] font-black text-xs uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-sm"
          >
            {statusFilter === 'under_review' ? 'Show All Companies' : `Filter Pending (${pendingApprovalCount})`}
          </button>
        </div>
      )}

      {/* Registry Department Intake Informational Notice */}
      {isRegistryDept && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2a602f] text-white rounded-2xl shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#2a602f]">
                Registry Department Corporate Intake
              </span>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                New company intake records are placed <strong>Under Review</strong> and routed to either the <strong>Administrator (Z. Teewu)</strong> or <strong>Executive Director (Carlos Etingban)</strong> for statutory authorization.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, registration number, TIN, director, or county..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Statuses ({companies.length})</option>
            <option value="active">Active</option>
            <option value="under_review">Under Review</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Entity Filter */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Entity Types</option>
            <option value="Corporation">Corporation</option>
            <option value="Limited Liability Company (LLC)">LLC</option>
            <option value="Joint Venture (JV)">Joint Venture</option>
            <option value="Artisanal Mining Cooperative">Cooperative</option>
          </select>
        </div>
      </div>

      {/* Companies Data Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Company Name &amp; License Type</th>
                <th className="py-3.5 px-4">Name of Owner</th>
                <th className="py-3.5 px-4">County / City &amp; Office Address</th>
                <th className="py-3.5 px-4">Application &amp; Expire Dates</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No registered companies found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((comp) => {
                  const owner = comp.ownerName || comp.directors?.[0]?.name || 'Not Disclosed';
                  const appDate = comp.dateOfApplication || comp.registrationDate || '—';
                  const expDate = comp.expiryDate || comp.annualRenewalDate || '—';
                  const cell = comp.cellNo || comp.primaryPhone || '—';
                  const email = comp.primaryEmail || '—';
                  const city = comp.cityOfOperation || 'Monrovia';
                  const office = comp.officeAddress || comp.registeredAddress || `${city}, ${comp.county}, Liberia`;
                  const license = comp.licenseType || 'Class A – Industrial Mining License';

                  return (
                    <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{comp.companyName}</div>
                        <div
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-[#2a602f] border border-emerald-200 text-[10px] font-bold mt-1 max-w-[220px] truncate"
                          title={license}
                        >
                          <Award size={10} className="shrink-0 text-[#2a602f]" />
                          <span className="truncate">{license}</span>
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 mt-1">
                          {comp.registrationNumber} • {comp.entityType}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <UserCheck size={13} className="text-[#2a602f] shrink-0" />
                          <span>{owner}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Beneficial Owner / Managing Dir</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
                          <MapPin size={12} className="text-[#2a602f] shrink-0" />
                          <span>
                            {comp.county} • {city}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[200px] mt-0.5" title={office}>
                          {office}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-700">
                          <span className="text-slate-400 font-semibold">Applied:</span>{' '}
                          <strong className="text-slate-900">{appDate}</strong>
                        </div>
                        <div className="text-[11px] text-slate-700 mt-0.5">
                          <span className="text-slate-400 font-semibold">Expires:</span>{' '}
                          <strong className="text-amber-700">{expDate}</strong>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                          <Phone size={11} className="text-[#2a602f] shrink-0" />
                          <span>{cell}</span>
                        </div>
                        <div
                          className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5 truncate max-w-[170px]"
                          title={email}
                        >
                          <Mail size={11} className="text-slate-400 shrink-0" />
                          <span className="truncate">{email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {comp.status === 'under_review' || comp.status === 'pending' ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                              <Clock size={10} className="text-amber-700" />
                              <span>Pending Approval</span>
                            </span>
                            <div className="text-[9px] text-amber-900 font-bold mt-0.5">
                              Admin / Exec Dir Review
                            </div>
                            {comp.registeredByName && (
                              <div className="text-[9px] text-slate-400 truncate max-w-[120px]" title={comp.registeredByName}>
                                By {comp.registeredByName.split('(')[0].trim()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            {getStatusBadge(comp.status)}
                            {comp.approvedBy && (
                              <div
                                className="text-[9px] text-emerald-800 font-extrabold mt-0.5 flex items-center gap-0.5 truncate max-w-[130px]"
                                title={`Authorized by ${comp.approvedBy} on ${comp.approvedAt || ''}`}
                              >
                                <CheckCircle2 size={10} className="text-[#2a602f] shrink-0" />
                                <span className="truncate">{comp.approvedBy.split('(')[0].trim()}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canApprove && (comp.status === 'under_review' || comp.status === 'pending') && (
                            <button
                              onClick={() => handleQuickApprove(comp)}
                              className="px-2.5 py-1.5 rounded-xl bg-[#2a602f] hover:bg-[#1e4621] text-[#ffc30d] font-black text-xs transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                              title={
                                isExecutiveDirector
                                  ? 'Approve as Executive Director'
                                  : isAdministrator
                                  ? 'Approve as Administrator'
                                  : 'Approve as Super Admin'
                              }
                            >
                              <CheckCircle2 size={13} />
                              <span>Approve</span>
                            </button>
                          )}
                          <button
                            onClick={() => setCommentTargetCompany(comp)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-[#2a602f] text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                            title="View and Add Observations"
                          >
                            <MessageSquare size={13} className="text-[#2a602f]" />
                            <span>Notes</span>
                            {crmService.getComments(comp.id).length > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full bg-[#ffc30d] text-slate-950 font-black text-[9px]">
                                {crmService.getComments(comp.id).length}
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() => setSelectedCompany(comp)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#2d5a27] hover:text-white text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Dossier</span>
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(comp.id)}
                              className="p-1.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete Company Record"
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

      {/* ─── Company Dossier Modal ────────────────────────────────────────── */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setSelectedCompany(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-emerald-50 text-[#2d5a27] rounded-2xl border border-emerald-200 shrink-0">
                  <Building2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {selectedCompany.companyName}
                    </h2>
                    {getStatusBadge(selectedCompany.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Registration No: <span className="font-mono font-bold text-slate-900">{selectedCompany.registrationNumber}</span> • TIN: <span className="font-mono text-slate-900">{selectedCompany.taxIdentificationNumber}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCompany(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Transition Control & Observations Bar */}
            <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCommentTargetCompany(selectedCompany)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-[#2a602f] text-xs font-bold transition-all border border-slate-300 shadow-sm cursor-pointer"
                >
                  <MessageSquare size={13} className="text-[#2a602f]" />
                  <span>Observations &amp; Inter-Departmental Notes</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#ffc30d] text-slate-950 font-black text-[10px]">
                    {crmService.getComments(selectedCompany.id).length}
                  </span>
                </button>
              </div>

              {canApprove && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 mr-1 flex items-center gap-1">
                    <Shield size={13} className="text-[#2a602f]" />
                    <span>
                      {isExecutiveDirector
                        ? 'Executive Director Authority:'
                        : isAdministrator
                        ? 'Administrator Authority:'
                        : 'Super Admin Authority:'}
                    </span>
                  </span>
                  {(selectedCompany.status === 'under_review' || selectedCompany.status === 'pending') && (
                    <button
                      onClick={() => handleStatusChange('approved')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2a602f] hover:bg-[#1e4621] text-[#ffc30d] text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md cursor-pointer transition-all"
                    >
                      <CheckCircle2 size={13} />
                      <span>Approve Registration</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Mark Active
                  </button>
                  <button
                    onClick={() => handleStatusChange('under_review')}
                    className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Put Under Review
                  </button>
                  <button
                    onClick={() => handleStatusChange('expired')}
                    className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Flag Expired
                  </button>
                  <button
                    onClick={() => handleStatusChange('suspended')}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Suspend Entity
                  </button>
                </div>
              )}

              {isRegistryDept && (
                <div className="flex items-center gap-2">
                  <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                    <Clock size={13} className="text-amber-700" />
                    <span>Awaiting authorization by either the Administrator (Z. Teewu) or Executive Director (Carlos Etingban)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Corporate Profile Details — full field set per user requirements */}
            <div className="mt-6 space-y-3">
              {/* Approval status banner */}
              {selectedCompany.approvedBy ? (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#2a602f] uppercase tracking-wider">
                        Official Statutory Approval Granted
                      </div>
                      <div className="text-xs text-slate-700 font-medium mt-0.5">
                        Authorized &amp; Approved by <strong className="text-slate-900">{selectedCompany.approvedBy}</strong>
                        {selectedCompany.approvedAt && ` on ${selectedCompany.approvedAt}`}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#ffc30d] text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                    Cadastre Verified
                  </span>
                </div>
              ) : (selectedCompany.status === 'under_review' || selectedCompany.status === 'pending') && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-amber-950 uppercase tracking-wider">
                        Awaiting Administrator or Executive Director Authorization
                      </div>
                      <div className="text-xs text-amber-900 font-medium mt-0.5">
                        {selectedCompany.registeredByName ? `Submitted by ${selectedCompany.registeredByName}. ` : ''}
                        Corporate registration records added by the Registry Department must be authorized by either the <strong>Administrator (Z. Teewu)</strong> or <strong>Executive Director (Carlos Etingban)</strong>.
                      </div>
                    </div>
                  </div>
                  {canApprove && (
                    <button
                      onClick={() => handleStatusChange('approved')}
                      className="px-4 py-2 rounded-xl bg-[#2a602f] hover:bg-[#1e4621] text-[#ffc30d] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 transition-all hover:scale-102"
                    >
                      <CheckCircle2 size={15} />
                      <span>Approve Registration</span>
                    </button>
                  )}
                </div>
              )}
              {/* Row 1: License Type + Entity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#2a602f] block mb-1.5 flex items-center gap-1">
                    <Award size={11} className="inline" /> License Types
                  </span>
                  <div className="text-sm font-black text-[#2a602f]">
                    {selectedCompany.licenseType || 'Class A – Industrial Mining License'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{selectedCompany.entityType} • {selectedCompany.registrationNumber}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                    Name of Owner
                  </span>
                  <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <UserCheck size={14} className="text-[#2a602f]" />
                    {selectedCompany.ownerName || selectedCompany.directors?.[0]?.name || 'Not Disclosed'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Principal Owner / Managing Director
                  </div>
                </div>
              </div>

              {/* Row 2: Application Date + Expire Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                    <Clock size={11} className="inline" /> Date of Application
                  </span>
                  <div className="text-sm font-black text-slate-900">
                    {selectedCompany.dateOfApplication || selectedCompany.registrationDate || '—'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Application Filing Date</div>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1.5 flex items-center gap-1">
                    <Clock size={11} className="inline" /> Expire Date
                  </span>
                  <div className="text-sm font-black text-amber-800">
                    {selectedCompany.expiryDate || selectedCompany.annualRenewalDate || '—'}
                  </div>
                  <div className="text-[11px] text-amber-600 mt-1">License / Registration Expiry</div>
                </div>
              </div>

              {/* Row 3: County / City + Office Address */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1">
                  <MapPin size={11} className="inline text-[#2a602f]" /> County / City of Operation &amp; Company Office Address
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase mb-0.5">County &amp; City</div>
                    <div className="text-sm font-black text-slate-900">
                      {selectedCompany.county}
                      {selectedCompany.cityOfOperation ? ` • ${selectedCompany.cityOfOperation}` : ''}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase mb-0.5">Company Office Address</div>
                    <div className="text-xs font-bold text-slate-800">
                      {selectedCompany.officeAddress || selectedCompany.registeredAddress || selectedCompany.jurisdiction || '—'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Contact Details */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#2a602f] block mb-2 flex items-center gap-1">
                  <Phone size={11} className="inline" /> Contact Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white rounded-xl border border-emerald-200 shrink-0">
                      <Phone size={13} className="text-[#2a602f]" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">Cell No.</div>
                      <div className="text-sm font-black text-slate-900">
                        {selectedCompany.cellNo || selectedCompany.primaryPhone || '—'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-2 bg-white rounded-xl border border-emerald-200 shrink-0">
                      <Mail size={13} className="text-[#2a602f]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 font-semibold">Email.</div>
                      <div className="text-sm font-black text-slate-900 truncate" title={selectedCompany.primaryEmail}>
                        {selectedCompany.primaryEmail || '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Directors & Beneficial Ownership */}
            <div className="mt-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <UserCheck size={16} className="text-emerald-700" />
                <span>Registered Directors &amp; Beneficial Owners</span>
              </h3>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Director Name</th>
                      <th className="py-2.5 px-3">Title / Office</th>
                      <th className="py-2.5 px-3">Nationality</th>
                      <th className="py-2.5 px-3">ID / Passport</th>
                      <th className="py-2.5 px-3 text-right">Shareholding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {selectedCompany.directors.map((dir) => (
                      <tr key={dir.id}>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{dir.name}</td>
                        <td className="py-2.5 px-3">{dir.title}</td>
                        <td className="py-2.5 px-3">{dir.nationality}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">{dir.idNumber}</td>
                        <td className="py-2.5 px-3 text-right font-black text-emerald-800">
                          {dir.shareholdingPct}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statutory Documents */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <FileText size={16} className="text-amber-600" />
                  <span>Statutory Corporate Documents ({selectedCompany.documents.length})</span>
                </h3>

                {canManage && (
                  <button
                    onClick={() => setShowDocUploadModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#2d5a27] border border-emerald-200 text-xs font-bold transition-colors"
                  >
                    <Upload size={13} />
                    <span>Attach Document</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedCompany.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 hover:border-emerald-500/50 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="p-2 bg-white rounded-xl border border-slate-200 text-[#2d5a27] shrink-0 mt-0.5">
                        <FileCheck size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">{doc.title}</div>
                        <div className="text-[10px] text-slate-500">{doc.documentType}</div>
                        <div className="text-[9px] text-slate-400 mt-1">
                          {doc.fileName} • {doc.fileSize} • Uploaded {doc.uploadedAt}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedCompany.notes && (
              <div className="mt-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block mb-1">
                  Cadastral Review Notes:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedCompany.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Add Company Modal ────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-[#2d5a27] rounded-xl">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    New Company Registration
                  </h2>
                  <p className="text-xs text-slate-500">Record an official corporate entity in the GMEC Cadastre</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-5 text-xs">

              {/* ── SECTION 1: Company Name & License Type ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Building2 size={13} className="text-[#2a602f]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#2a602f]">Company Information</span>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompany.companyName}
                    onChange={(e) => setNewCompany({ ...newCompany, companyName: e.target.value })}
                    placeholder="e.g. Nimba Gold Consortium Ltd"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    License Types *
                  </label>
                  <select
                    required
                    value={newCompany.licenseType}
                    onChange={(e) => setNewCompany({ ...newCompany, licenseType: e.target.value as LiberianLicenseCategory })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                  >
                    {LIBERIAN_LICENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Registration Number (LBR)
                    </label>
                    <input
                      type="text"
                      value={newCompany.registrationNumber}
                      onChange={(e) => setNewCompany({ ...newCompany, registrationNumber: e.target.value })}
                      placeholder="e.g. LBR-CORP-2026-0922"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Entity Type
                    </label>
                    <select
                      value={newCompany.entityType}
                      onChange={(e) => setNewCompany({ ...newCompany, entityType: e.target.value as EntityType })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                    >
                      <option value="Corporation">Corporation</option>
                      <option value="Limited Liability Company (LLC)">LLC</option>
                      <option value="Joint Venture (JV)">Joint Venture</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Artisanal Mining Cooperative">Mining Cooperative</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: Application & Expire Dates ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Clock size={13} className="text-[#2a602f]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#2a602f]">License Dates &amp; Status</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Date of Application *
                    </label>
                    <input
                      type="date"
                      required
                      value={newCompany.dateOfApplication}
                      onChange={(e) => setNewCompany({ ...newCompany, dateOfApplication: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Expire Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newCompany.expiryDate}
                      onChange={(e) => setNewCompany({ ...newCompany, expiryDate: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Status / Workflow
                    </label>
                    {isRegistryDept ? (
                      <div className="w-full p-2 bg-amber-50 border border-amber-300 rounded-xl font-bold text-amber-950 text-xs flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <span>Under Review</span>
                          <span className="text-[9px] font-black bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded uppercase">
                            Approval Required
                          </span>
                        </div>
                        <span className="text-[9px] font-medium text-amber-800 mt-0.5">
                          Requires Admin or Exec Dir approval
                        </span>
                      </div>
                    ) : (
                      <select
                        value={newCompany.status}
                        onChange={(e) => setNewCompany({ ...newCompany, status: e.target.value as RegistrationStatus })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                      >
                        <option value="under_review">Under Review</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="approved">Approved</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: County / City of Operation & Office Address ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <MapPin size={13} className="text-[#2a602f]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#2a602f]">County / City of Operation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      County (Liberia) *
                    </label>
                    <select
                      required
                      value={newCompany.county}
                      onChange={(e) => setNewCompany({ ...newCompany, county: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                    >
                      {LIBERIAN_COUNTIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      City of Operation *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCompany.cityOfOperation}
                      onChange={(e) => setNewCompany({ ...newCompany, cityOfOperation: e.target.value })}
                      placeholder="e.g. Monrovia"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Company Office Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompany.officeAddress}
                    onChange={(e) => setNewCompany({ ...newCompany, officeAddress: e.target.value })}
                    placeholder="e.g. 14 Tubman Boulevard, Sinkor, Monrovia, Liberia"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                  />
                </div>
              </div>

              {/* ── SECTION 4: Name of Owner ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <UserCheck size={13} className="text-[#2a602f]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#2a602f]">Name of Owner</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Full Name of Owner *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCompany.ownerName}
                      onChange={(e) => setNewCompany({ ...newCompany, ownerName: e.target.value })}
                      placeholder="e.g. Emmanuel T. Johnson"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Owner Nationality
                    </label>
                    <input
                      type="text"
                      value={newCompany.directorNationality}
                      onChange={(e) => setNewCompany({ ...newCompany, directorNationality: e.target.value })}
                      placeholder="Liberian"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 5: Contact Details ── */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-[#2a602f]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#2a602f]">Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Cell No. *
                    </label>
                    <div className="relative">
                      <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={newCompany.cellNo}
                        onChange={(e) => setNewCompany({ ...newCompany, cellNo: e.target.value, primaryPhone: e.target.value })}
                        placeholder="+231 77 000 0000"
                        className="w-full pl-8 p-2.5 bg-white border border-emerald-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      Email. *
                    </label>
                    <div className="relative">
                      <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={newCompany.primaryEmail}
                        onChange={(e) => setNewCompany({ ...newCompany, primaryEmail: e.target.value })}
                        placeholder="info@company.lr"
                        className="w-full pl-8 p-2.5 bg-white border border-emerald-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a602f]/30 focus:border-[#2a602f]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Statutory Routing Notice for Registry Department ── */}
              {isRegistryDept && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
                  <div className="p-1.5 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
                    <Clock size={14} />
                  </div>
                  <div className="text-xs text-amber-950">
                    <span className="font-black uppercase tracking-wider block">Statutory Executive Approval Required</span>
                    <span className="text-amber-900 mt-0.5 block">
                      This company record will be submitted <strong>Under Review</strong>. Official cadastre approval must be authorized by either the <strong>Administrator (Z. Teewu)</strong> or the <strong>Executive Director (Carlos Etingban)</strong> before becoming active.
                    </span>
                  </div>
                </div>
              )}

              {/* ── Action Buttons ── */}
              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-black uppercase tracking-wider shadow-md transition-colors"
                  style={{ backgroundColor: '#2a602f', color: '#ffc30d' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1e4621'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a602f'; }}
                >
                  ✦ Register Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Attach Document Modal ────────────────────────────────────────── */}
      {showDocUploadModal && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowDocUploadModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Attach Corporate Document</h3>
              <button onClick={() => setShowDocUploadModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="e.g. 2026 EPA Environmental Clearance"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Document Type
                </label>
                <select
                  value={newDoc.documentType}
                  onChange={(e) => setNewDoc({ ...newDoc, documentType: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                >
                  <option value="Articles of Incorporation">Articles of Incorporation</option>
                  <option value="Business Registration Certificate">Business Registration Certificate</option>
                  <option value="Tax Clearance Certificate (LRA)">LRA Tax Clearance</option>
                  <option value="EPA Environmental Clearance">EPA Environmental Clearance</option>
                  <option value="MME Mineral Cadastre Clearance">MME Cadastre Clearance</option>
                  <option value="Proof of Identification">Proof of Identification</option>
                  <option value="Bank Reference Letter">Bank Reference Letter</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px]">
                <CheckCircle2 size={13} className="inline mr-1" />
                <span>Document will be marked as verified and logged in the audit trail.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDocUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-wider cursor-pointer"
                >
                  Upload &amp; Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Observations & Comments Modal */}
      {commentTargetCompany && (
        <RecordCommentsModal
          isOpen={true}
          onClose={() => setCommentTargetCompany(null)}
          recordId={commentTargetCompany.id}
          recordType="company"
          recordTitle={commentTargetCompany.companyName}
          recordReference={commentTargetCompany.registrationNumber}
        />
      )}
    </div>
  );
};

