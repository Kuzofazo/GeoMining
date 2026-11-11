import React, { useRef } from 'react';
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  Building2,
  FileCheck2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  UserCheck,
  Award,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CompanyRecord, MiningLicense } from '../../types/crm';
import Logo from '../Logo';

interface CRMOfficialDossierModalProps {
  company?: CompanyRecord | null;
  license?: MiningLicense | null;
  onClose: () => void;
}

export const CRMOfficialDossierModal: React.FC<CRMOfficialDossierModalProps> = ({
  company,
  license,
  onClose,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!company && !license) return null;

  const handlePrint = () => {
    window.print();
  };

  const entityName = company?.companyName || license?.companyName || 'Liberian Mineral Concessionaire';
  const regNo = company?.registrationNumber || license?.licenseNumber || 'LBR-CAD-2026-000';
  const tin = company?.taxIdentificationNumber || 'TIN-00892415-LR';
  const county = company?.county || license?.county || 'Montserrado';
  const issueDate = company?.registrationDate || license?.issueDate || '2026-01-15';
  const expiryDate = company?.annualRenewalDate || license?.expiryDate || '2027-01-15';
  const assignedOfficer = company?.assignedOfficer || 'Eric S. Myers';
  const approvedBy = company?.approvedBy || 'Carlos E. Tingban, Sr. (Executive Director)';
  const status = company?.status || license?.status || 'active';

  const verificationUrl = `https://geominingec.com/verify?id=${encodeURIComponent(
    company?.id || license?.id || 'dossier'
  )}&reg=${encodeURIComponent(regNo)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm print:hidden"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative bg-white w-full max-w-4xl max-h-[96vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 print:m-0 print:p-0 print:max-w-none print:shadow-none print:rounded-none font-['Outfit',sans-serif]">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2a602f] rounded-xl text-[#ffc30d]">
              <Award size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight uppercase">
                Official Statutory Dossier
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                GMEC Republic of Liberia Mineral Cadastre • Letterhead Document
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2a602f] hover:bg-[#235027] text-[#ffc30d] text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Official Dossier Page */}
        <div
          ref={printAreaRef}
          className="p-8 sm:p-12 print:p-8 bg-white text-slate-900 selection:bg-emerald-100"
        >
          {/* GMEC Official Letterhead */}
          <div className="border-b-4 border-[#2a602f] pb-6 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 p-1 rounded-full border-2 border-[#2a602f] bg-white shrink-0 shadow-sm flex items-center justify-center">
                  <Logo className="w-full h-full" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#2a602f] tracking-tight uppercase leading-tight font-serif">
                    GeoMining &amp; Environmental Consultancy Inc.
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 tracking-wide uppercase mt-0.5">
                    Republic of Liberia Mineral Cadastre &amp; Statutory Registry
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Tubman Boulevard, Congo Town, Monrovia, Republic of Liberia • Tel: +231 77 000 0000 / +231 88 000 0000
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    LBR Incorporation Reg: 05/2018-091 • Taxpayer Identification No (TIN): 005423891
                  </p>
                </div>
              </div>

              {/* Official Seal Watermark Stamp */}
              <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-2xl border-2 border-dashed border-[#ffc30d] bg-amber-50/50 text-center shrink-0 w-32">
                <ShieldCheck size={26} className="text-[#2a602f]" />
                <span className="text-[9px] font-black uppercase text-amber-900 mt-1 tracking-wider leading-tight">
                  Official Statutory Seal
                </span>
                <span className="text-[8px] font-mono text-emerald-800 font-bold">VERIFIED 2026</span>
              </div>
            </div>
          </div>

          {/* Dossier Meta & Tracking Strip */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Dossier Tracking Number
              </span>
              <span className="font-mono text-sm font-black text-slate-900">
                GMEC-CAD-LBR-2026-{(company?.id || license?.id || '001').toUpperCase().replace(/[^A-Z0-9-]/g, '')}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Date of Issuance
              </span>
              <span className="font-bold text-slate-900">{issueDate}</span>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Statutory Status
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                {status.toUpperCase()}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Annual Renewal Expiry
              </span>
              <span className="font-bold text-slate-900">{expiryDate}</span>
            </div>
          </div>

          {/* Title Banner */}
          <div className="text-center py-3 bg-[#2a602f] text-white rounded-2xl mb-6 shadow-sm">
            <h2 className="text-sm sm:text-base font-black tracking-widest uppercase">
              Official Statutory Concession &amp; Corporate Verification Dossier
            </h2>
            <p className="text-[11px] text-emerald-100 font-medium">
              Ministry of Mines &amp; Energy (MME) • Environmental Protection Agency (EPA Liberia) Reference
            </p>
          </div>

          {/* Section 1: Entity Profile & Concession Data */}
          <div className="mb-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#2a602f] pb-1 border-b border-slate-200 flex items-center gap-2">
              <Building2 size={15} />
              <span>1. Corporate Entity &amp; Concessionaire Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                  Official Legal Registered Name
                </span>
                <span className="text-sm font-black text-slate-900">{entityName}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                  Business Registration (LBR) Number
                </span>
                <span className="font-mono text-sm font-black text-slate-900">{regNo}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                  Tax Identification Number (TIN)
                </span>
                <span className="font-mono text-sm font-black text-slate-900">{tin}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                  Concession County &amp; Jurisdiction
                </span>
                <span className="text-sm font-black text-slate-900">
                  {county} County, Republic of Liberia
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                  Principal Executive Contact / Owner
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {company?.ownerName || 'Authorized Corporate Representative'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                  Official Office Address &amp; Tel
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {company?.registeredAddress || company?.officeAddress || 'Monrovia, Liberia'} •{' '}
                  {company?.primaryPhone || '+231 77 000 0000'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Statutory Approvals & Cadastral Provenance */}
          <div className="mb-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#2a602f] pb-1 border-b border-slate-200 flex items-center gap-2">
              <FileCheck2 size={15} />
              <span>2. Statutory Chain of Custody &amp; Verification Clearance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-0.5">
                  Lead License Registrar
                </span>
                <span className="text-xs font-black text-slate-900">{assignedOfficer}</span>
                <span className="text-[10px] text-slate-500 block">GMEC Registry Department</span>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-0.5">
                  Statutory Authorization Gate
                </span>
                <span className="text-xs font-black text-slate-900">{approvedBy}</span>
                <span className="text-[10px] text-slate-500 block">Executive Director Authorization</span>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-0.5">
                  EPA Environmental Clearance
                </span>
                <span className="text-xs font-black text-[#2a602f]">COMPLIANT • AUDITED</span>
                <span className="text-[10px] text-slate-500 block">Effluent &amp; Tailings Verified</span>
              </div>
            </div>
          </div>

          {/* Section 3: Registered Directors (if company) */}
          {company?.directors && company.directors.length > 0 && (
            <div className="mb-6 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#2a602f] pb-1 border-b border-slate-200 flex items-center gap-2">
                <UserCheck size={15} />
                <span>3. Registered Directors &amp; Beneficial Owners</span>
              </h3>

              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                    <tr>
                      <th className="py-2 px-3">Full Legal Name</th>
                      <th className="py-2 px-3">Title / Office</th>
                      <th className="py-2 px-3">Nationality</th>
                      <th className="py-2 px-3 text-right">Equity Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {company.directors.map((d, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-bold text-slate-900">{d.name}</td>
                        <td className="py-2 px-3 text-slate-600">{d.role}</td>
                        <td className="py-2 px-3 text-slate-600">{d.nationality}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          {d.shareholdingPercentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: Cryptographic Verification Stamp & Signatures */}
          <div className="mt-8 pt-6 border-t-2 border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* QR Verification Seal */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <div className="p-1.5 bg-white rounded-xl border border-slate-300 shadow-xs shrink-0">
                  <QRCodeSVG value={verificationUrl} size={64} level="H" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#2a602f] block">
                    Cryptographic Cadastre Stamp
                  </span>
                  <p className="text-[10px] text-slate-500 max-w-[200px] leading-tight mt-0.5">
                    Scan with any smartphone camera to verify statutory authenticity on the Republic of Liberia registry.
                  </p>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex items-center gap-8 text-center">
                <div className="space-y-1">
                  <div className="w-36 border-b-2 border-slate-800 pb-8 italic font-serif text-slate-400 text-xs">
                    Carlos E. Tingban, Sr.
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-900 block">
                    Carlos E. Tingban, Sr.
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold block">
                    Executive Director, GMEC Inc.
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="w-36 border-b-2 border-slate-800 pb-8 italic font-serif text-slate-400 text-xs">
                    Eric S. Myers
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-900 block">
                    Eric S. Myers
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold block">
                    Lead License Registrar
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-slate-400 font-medium">
              Official document issued by GeoMining &amp; Environmental Consultancy Inc. in accordance with the Minerals and Mining Law of the Republic of Liberia.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMOfficialDossierModal;

