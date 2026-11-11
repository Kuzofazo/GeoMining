import React, { useState } from 'react';
import {
  FileText,
  FolderLock,
  Download,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  Lock,
  Eye,
  Trash2,
  FileCheck2,
  Building2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  FileCode,
  Camera,
  Printer,
  X,
  Maximize2,
  RotateCw,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import { VaultDocument, VaultDocumentCategory } from '../../types/crm';
import { CRMDocumentScannerModal } from './CRMDocumentScannerModal';

interface CRMDocumentVaultProps {
  initialSearch?: string;
}

export const CRMDocumentVault: React.FC<CRMDocumentVaultProps> = ({ initialSearch = '' }) => {
  const [documents, setDocuments] = useState<VaultDocument[]>(() => crmService.getVaultDocuments());
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [previewRotation, setPreviewRotation] = useState<number>(0);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newCategory, setNewCategory] = useState<VaultDocumentCategory>('Articles of Incorporation');
  const [newDepartment, setNewDepartment] = useState('Registry Department');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newConfidential, setNewConfidential] = useState(false);
  const [newDescription, setNewDescription] = useState('');

  const currentUser = crmService.getCurrentUser();
  const companies = crmService.getCompanies();
  const canManageDocs = crmService.checkPermission('canManageDocuments');
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const refreshDocuments = () => {
    setDocuments(crmService.getVaultDocuments());
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.companyName && doc.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (categoryFilter === 'scanned_only') {
      return Boolean(doc.scanSource || doc.fileData);
    }
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;

    return true;
  });

  const handleDelete = (docId: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the document vault?`)) {
      crmService.deleteVaultDocument(docId);
      refreshDocuments();
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFileName.trim()) {
      alert('Please enter document title and file name');
      return;
    }

    const ext = newFileName.split('.').pop()?.toUpperCase() || 'PDF';

    crmService.addVaultDocument({
      title: newTitle,
      fileName: newFileName,
      fileSize: '2.4 MB',
      fileFormat: ext,
      category: newCategory,
      department: newDepartment,
      companyName: newCompanyName || undefined,
      confidential: newConfidential,
      description: newDescription,
      downloadUrl: '#',
    });

    // Reset Form
    setNewTitle('');
    setNewFileName('');
    setNewCompanyName('');
    setNewDescription('');
    setNewConfidential(false);
    setShowUploadModal(false);
    refreshDocuments();
  };

  const getFormatBadge = (format: string) => {
    switch (format.toUpperCase()) {
      case 'PDF':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-700">PDF</span>;
      case 'DOCX':
      case 'DOC':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-700">DOCX</span>;
      case 'XLSX':
      case 'CSV':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-[#2a602f]">XLSX</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-700">{format}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 text-[#2a602f] border border-emerald-200">
              <FolderLock size={20} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Centralized Document Vault
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Bitrix24-style corporate repository for concession deeds, EPA certifications, Articles of Incorporation & regulatory filings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowScannerModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2a602f] hover:bg-[#224f26] text-[#ffc30d] font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
            title="Scan physical documents directly using your phone camera or office printer scanner"
          >
            <Camera size={16} />
            <span>Scan Document</span>
          </button>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title, company, or type..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full md:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
        >
          <option value="all">All Document Categories ({documents.length})</option>
          <option value="scanned_only">📷 Scanned Documents Only ({documents.filter(d => d.scanSource || d.fileData).length})</option>
          <option value="Articles of Incorporation">Articles of Incorporation</option>
          <option value="Mining Concession Deed">Mining Concession Deed</option>
          <option value="EPA Clearance">EPA Clearance</option>
          <option value="MME Mineral Cadastre">MME Mineral Cadastre</option>
          <option value="Tax Clearance (LRA)">Tax Clearance (LRA)</option>
          <option value="Technical Survey & Report">Technical Survey & Report</option>
          <option value="Standard Operating Procedure (SOP)">SOP / Guidelines</option>
        </select>
      </div>

      {/* Document Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No documents found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Upload new statutory deeds or clear filters to view files stored in the vault.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {getFormatBadge(doc.fileFormat)}
                    {doc.scanSource && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                        {doc.scanSource === 'phone_camera' ? <Camera size={10} /> : <Printer size={10} />}
                        <span>{doc.scanSource === 'phone_camera' ? 'Phone Scan' : 'Printer Scan'}</span>
                      </span>
                    )}
                    {doc.confidential && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Lock size={10} /> Confidential
                      </span>
                    )}
                    {doc.verified && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#2a602f] border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck size={10} /> Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{doc.fileSize}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug mb-1">{doc.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{doc.description}</p>

                <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Category:</span>
                    <span className="font-semibold text-slate-800">{doc.category}</span>
                  </div>
                  {doc.companyName && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Company:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">{doc.companyName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Department:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">{doc.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Uploaded:</span>
                    <span className="text-slate-500">{doc.uploadedAt} by {doc.uploadedByName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {doc.fileData && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewDoc(doc);
                        setPreviewRotation(0);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#2a602f] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <Eye size={13} />
                      <span>View Scan</span>
                    </button>
                  )}

                  <a
                    href={doc.fileData || `#download-${doc.id}`}
                    download={doc.fileData ? doc.fileName : undefined}
                    onClick={(e) => {
                      if (!doc.fileData) {
                        e.preventDefault();
                        alert(`Initiating verified download for: ${doc.fileName}`);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                </div>

                {(isSuperAdmin || currentUser?.name === doc.uploadedByName) && (
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-[#2a602f]">
                  <Plus size={18} />
                </span>
                <h3 className="text-lg font-black text-slate-900">Archive Vault Document</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="py-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Articles of Incorporation - Nimba Mining Corp"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  File Name with Extension *
                </label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. Nimba_Mining_Corp_Articles.pdf"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Document Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as VaultDocumentCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
                  >
                    <option value="Articles of Incorporation">Articles of Incorporation</option>
                    <option value="Mining Concession Deed">Mining Concession Deed</option>
                    <option value="EPA Clearance">EPA Clearance</option>
                    <option value="MME Mineral Cadastre">MME Mineral Cadastre</option>
                    <option value="Tax Clearance (LRA)">Tax Clearance (LRA)</option>
                    <option value="Technical Survey & Report">Technical Survey & Report</option>
                    <option value="Standard Operating Procedure (SOP)">SOP / Guidelines</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Originating Department *
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
                  >
                    <option value="Registry Department">Registry Department</option>
                    <option value="Executive Directorate">Executive Directorate</option>
                    <option value="System & Concession Administration">System Administration</option>
                    <option value="Statutory Compliance & Environmental Audit">Compliance & EPA</option>
                    <option value="Super Admin / IT Infrastructure">IT Infrastructure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Tag Related Concession / Company (Optional)
                </label>
                <select
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
                >
                  <option value="">General Corporate Document</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.companyName}>
                      {c.companyName} ({c.county})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Summary / Scope
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summary of terms, statutory validity dates, or regulatory notes..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="confidentialCheck"
                  checked={newConfidential}
                  onChange={(e) => setNewConfidential(e.target.checked)}
                  className="w-4 h-4 text-[#2a602f] rounded focus:ring-[#2a602f]"
                />
                <label htmlFor="confidentialCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Confidential Document (Restrict view to Super Admin and Executive Directorate only)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2a602f] hover:bg-[#224f26] text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Upload & Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Scanner Studio Modal (Phone Camera & Printer Scanner) ───────── */}
      {showScannerModal && (
        <CRMDocumentScannerModal
          onClose={() => setShowScannerModal(false)}
          onDocumentSaved={(newDoc) => {
            refreshDocuments();
          }}
        />
      )}

      {/* ─── High-Resolution Scanned Document Preview Modal ───────────────── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setPreviewDoc(null)}
          />

          <div className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col font-['Outfit',sans-serif] overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2a602f] text-[#ffc30d] rounded-xl">
                  {previewDoc.scanSource === 'printer_scanner' ? <Printer size={18} /> : <Camera size={18} />}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-white">
                    {previewDoc.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {previewDoc.category} • {previewDoc.scanDevice || 'Official Scan'} • {previewDoc.fileSize}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewRotation((r) => (r + 90) % 360)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Rotate Document"
                >
                  <RotateCw size={14} />
                  <span className="hidden sm:inline">Rotate</span>
                </button>

                {previewDoc.fileData && (
                  <a
                    href={previewDoc.fileData}
                    download={previewDoc.fileName}
                    className="px-3 py-2 rounded-xl bg-[#2a602f] hover:bg-[#235027] text-[#ffc30d] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </a>
                )}

                <button
                  onClick={() => setPreviewDoc(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Document View Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/95 flex flex-col items-center justify-center min-h-[380px]">
              {previewDoc.fileData ? (
                <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-2 sm:p-4 transition-transform duration-200">
                  <img
                    src={previewDoc.fileData}
                    alt={previewDoc.title}
                    style={{ transform: `rotate(${previewRotation}deg)` }}
                    className="w-full h-auto object-contain rounded border border-slate-200 shadow-sm transition-transform duration-200"
                  />
                </div>
              ) : (
                <div className="text-center text-slate-400 p-8">
                  <FileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold">Standard Document Entry</p>
                  <p className="text-xs text-slate-500 mt-1">
                    This file was logged without embedded image data. Use the download link to retrieve it.
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <span><strong>Uploaded by:</strong> {previewDoc.uploadedByName}</span>
                <span><strong>Date:</strong> {previewDoc.uploadedAt}</span>
                {previewDoc.companyName && (
                  <span><strong>Company:</strong> {previewDoc.companyName}</span>
                )}
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ Synchronized with Supabase Cloud
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

