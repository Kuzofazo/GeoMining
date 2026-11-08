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
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import {
  CompanyRecord,
  RegistrationStatus,
  EntityType,
  CompanyDirector,
  CompanyDocument,
} from '../../types/crm';
import { RecordCommentsModal } from './RecordCommentsModal';

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

  // New Company Form State
  const [newCompany, setNewCompany] = useState({
    companyName: '',
    registrationNumber: '',
    taxIdentificationNumber: '',
    entityType: 'Corporation' as EntityType,
    jurisdiction: 'Monrovia, Liberia',
    registeredAddress: '',
    county: 'Montserrado',
    primaryEmail: '',
    primaryPhone: '',
    registrationDate: new Date().toISOString().substring(0, 10),
    annualRenewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    status: 'under_review' as RegistrationStatus,
    assignedOfficer: 'Helena K. Flomo',
    notes: '',
    directorName: '',
    directorTitle: 'Managing Director',
    directorNationality: 'Liberian',
    directorIdNumber: '',
    directorShareholdingPct: 100,
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
  const canManage = crmService.checkPermission('canManageCompanies');
  const canApprove = crmService.checkPermission('canApproveRegistrations');
  const canDelete = crmService.checkPermission('canDeleteRecords');

  // Filtering
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      search === '' ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.taxIdentificationNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.county.toLowerCase().includes(search.toLowerCase()) ||
      c.directors.some((d) => d.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesEntity = entityFilter === 'all' || c.entityType === entityFilter;

    return matchesSearch && matchesStatus && matchesEntity;
  });

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.companyName || !newCompany.registrationNumber) return;

    const directors: CompanyDirector[] = newCompany.directorName
      ? [
          {
            id: `dir-${Date.now()}`,
            name: newCompany.directorName,
            title: newCompany.directorTitle,
            nationality: newCompany.directorNationality,
            idNumber: newCompany.directorIdNumber || 'PENDING-ID',
            shareholdingPct: Number(newCompany.directorShareholdingPct) || 100,
            email: newCompany.primaryEmail,
            phone: newCompany.primaryPhone,
          },
        ]
      : [];

    crmService.addCompany({
      companyName: newCompany.companyName,
      registrationNumber: newCompany.registrationNumber,
      taxIdentificationNumber: newCompany.taxIdentificationNumber || `TIN-${Math.floor(100000000 + Math.random() * 900000000)}`,
      entityType: newCompany.entityType,
      jurisdiction: newCompany.jurisdiction,
      registeredAddress: newCompany.registeredAddress || 'Monrovia, Liberia',
      county: newCompany.county,
      primaryEmail: newCompany.primaryEmail,
      primaryPhone: newCompany.primaryPhone,
      registrationDate: newCompany.registrationDate,
      annualRenewalDate: newCompany.annualRenewalDate,
      status: newCompany.status,
      assignedOfficer: newCompany.assignedOfficer,
      notes: newCompany.notes,
      directors,
    });

    setShowAddModal(false);
    // Reset
    setNewCompany({
      companyName: '',
      registrationNumber: '',
      taxIdentificationNumber: '',
      entityType: 'Corporation',
      jurisdiction: 'Monrovia, Liberia',
      registeredAddress: '',
      county: 'Montserrado',
      primaryEmail: '',
      primaryPhone: '',
      registrationDate: new Date().toISOString().substring(0, 10),
      annualRenewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      status: 'under_review',
      assignedOfficer: 'Helena K. Flomo',
      notes: '',
      directorName: '',
      directorTitle: 'Managing Director',
      directorNationality: 'Liberian',
      directorIdNumber: '',
      directorShareholdingPct: 100,
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
                <th className="py-3.5 px-4">Company Legal Name</th>
                <th className="py-3.5 px-4">Registration &amp; TIN</th>
                <th className="py-3.5 px-4">Entity Type</th>
                <th className="py-3.5 px-4">Jurisdiction / County</th>
                <th className="py-3.5 px-4">Key Directors</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No registered companies found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{comp.companyName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{comp.primaryEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] font-bold text-slate-900">{comp.registrationNumber}</div>
                      <div className="font-mono text-[10px] text-slate-400">{comp.taxIdentificationNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium">{comp.entityType}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-800 font-bold">
                        <MapPin size={12} className="text-emerald-600" />
                        <span>{comp.county}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[130px]">{comp.registeredAddress}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-bold text-slate-800">
                        {comp.directors.length > 0 ? comp.directors[0].name : 'None Listed'}
                      </div>
                      {comp.directors.length > 1 && (
                        <div className="text-[10px] text-emerald-600 font-bold">
                          +{comp.directors.length - 1} more director{comp.directors.length > 2 ? 's' : ''}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                        <FileText size={12} />
                        <span>{comp.documents.length} Files</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(comp.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
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
                ))
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
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-600 mr-1">Super Admin Actions:</span>
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Mark Active / Approved
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

              {!canApprove && crmService.getCurrentUser()?.role === 'registry_department' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange('under_review')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm cursor-pointer"
                  >
                    Submit for Super Admin Review &amp; Approval
                  </button>
                </div>
              )}
            </div>

            {/* Corporate Profile Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Entity &amp; Jurisdiction
                </span>
                <div className="text-xs font-bold text-slate-900">{selectedCompany.entityType}</div>
                <div className="text-xs text-slate-600 mt-1">{selectedCompany.jurisdiction}</div>
                <div className="text-xs text-slate-600">{selectedCompany.county} County</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Registration Dates
                </span>
                <div className="text-xs text-slate-600">
                  Registered: <strong className="text-slate-900">{selectedCompany.registrationDate}</strong>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Annual Re-filing: <strong className="text-amber-700">{selectedCompany.annualRenewalDate}</strong>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Assigned: {selectedCompany.assignedOfficer}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Official Communication
                </span>
                <div className="text-xs text-slate-900 font-bold flex items-center gap-1 truncate">
                  <Mail size={12} className="text-emerald-600 shrink-0" />
                  <span className="truncate">{selectedCompany.primaryEmail}</span>
                </div>
                <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  <Phone size={12} className="text-emerald-600 shrink-0" />
                  <span>{selectedCompany.primaryPhone}</span>
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

            <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Company Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompany.companyName}
                    onChange={(e) => setNewCompany({ ...newCompany, companyName: e.target.value })}
                    placeholder="e.g. Nimba Gold Consortium Ltd"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Registration Number (LBR) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompany.registrationNumber}
                    onChange={(e) => setNewCompany({ ...newCompany, registrationNumber: e.target.value })}
                    placeholder="e.g. LBR-CORP-2026-0922"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Entity Type
                  </label>
                  <select
                    value={newCompany.entityType}
                    onChange={(e) => setNewCompany({ ...newCompany, entityType: e.target.value as EntityType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Corporation">Corporation</option>
                    <option value="Limited Liability Company (LLC)">LLC</option>
                    <option value="Joint Venture (JV)">Joint Venture</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Artisanal Mining Cooperative">Mining Cooperative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    County (Liberia)
                  </label>
                  <select
                    value={newCompany.county}
                    onChange={(e) => setNewCompany({ ...newCompany, county: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {['Montserrado', 'Nimba', 'Bong', 'Grand Bassa', 'Lofa', 'Gbarpolu', 'Grand Cape Mount', 'Sinoe', 'Maryland', 'River Cess'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Status
                  </label>
                  <select
                    value={newCompany.status}
                    onChange={(e) => setNewCompany({ ...newCompany, status: e.target.value as RegistrationStatus })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="under_review">Under Review</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={newCompany.primaryEmail}
                    onChange={(e) => setNewCompany({ ...newCompany, primaryEmail: e.target.value })}
                    placeholder="info@company.lr"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={newCompany.primaryPhone}
                    onChange={(e) => setNewCompany({ ...newCompany, primaryPhone: e.target.value })}
                    placeholder="+231 77 000 0000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Primary Director Section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                  Lead Director / Beneficial Owner
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Director Full Name</label>
                    <input
                      type="text"
                      value={newCompany.directorName}
                      onChange={(e) => setNewCompany({ ...newCompany, directorName: e.target.value })}
                      placeholder="e.g. Carlos Tingban"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Nationality</label>
                    <input
                      type="text"
                      value={newCompany.directorNationality}
                      onChange={(e) => setNewCompany({ ...newCompany, directorNationality: e.target.value })}
                      placeholder="Liberian"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider shadow-md"
                >
                  Register Entity
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

