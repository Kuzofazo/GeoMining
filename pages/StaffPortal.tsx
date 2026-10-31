import React, { useState } from 'react';
import SEO from '../components/SEO';
import Logo from '../components/Logo';
import {
  Mail,
  ShieldCheck,
  ExternalLink,
  HelpCircle,
  Phone,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Layers,
} from 'lucide-react';

const StaffPortal: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const customLoginUrl =
    'https://accounts.zoho.com/signin?servicename=VirtualOffice&signupurl=https://www.zoho.com/workplace/signup.html&serviceurl=https://workplace.zoho.com';
  const fallbackLoginUrl = 'https://mail.zoho.com';

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fff] text-slate-800 font-sans selection:bg-[#2d5a27] selection:text-white pt-24 sm:pt-28 pb-20 relative overflow-hidden">
      <SEO
        title="GMEC Staff Workspace & Webmail Portal | GEOMINING & Environmental Consultancy"
        description="Official internal GMEC staff workspace and corporate email access hub for employees and field consultants of GEOMINING & Environmental Consultancy INC."
        keywords="GMEC staff portal, geomining webmail, GMEC employee login, GMEC corporate mail Liberia"
      />

      {/* Decorative ambient background glows tailored for clean #fff background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-gradient-to-b from-emerald-100/50 via-emerald-50/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-[-100px] w-96 h-96 bg-amber-100/40 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-2/3 left-[-120px] w-[450px] h-[450px] bg-emerald-100/40 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#2d5a27] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <ShieldCheck size={14} className="text-[#2d5a27]" />
            <span>GMEC Authorized Personnel Workspace</span>
          </div>

          <div className="flex justify-center mb-6">
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xl ring-1 ring-slate-100">
              <Logo className="h-16 w-16 md:h-20 md:w-20" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-4">
            GMEC Staff{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d5a27] via-emerald-600 to-amber-600">
              Webmail &amp; Digital Hub
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Welcome to the official communication and enterprise workspace of{' '}
            <span className="text-slate-900 font-semibold">
              GEOMINING &amp; Environmental Consultancy INC
            </span>
            . Access your company email, geological archives, project
            documentation, and team tools.
          </p>
        </div>

        {/* Primary Action Hero Card: GMEC Webmail Launcher */}
        <div className="relative max-w-4xl mx-auto mb-14">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#2d5a27]/30 via-emerald-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-70 transition duration-1000" />

          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
            {/* Top highlight bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2d5a27] via-emerald-500 to-amber-500" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Information & Login Format */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#2d5a27]">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>GMEC Enterprise Staff Workspace</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                  Sign In to Your GMEC Staff Mailbox
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Use your corporate email credentials to access your unified
                  GMEC inbox, confidential client correspondence, and geological
                  survey archives.
                </p>

                {/* Email format pill */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                      Default GMEC User Format
                    </span>
                    <span className="text-sm font-mono text-[#2d5a27] font-bold">
                      yourname@geominingec.com
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('@geominingec.com', 'domain')}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-white bg-white hover:bg-[#2d5a27] px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-[#2d5a27] transition-all shrink-0 font-medium shadow-sm"
                    title="Copy domain"
                  >
                    {copiedField === 'domain' ? (
                      <>
                        <Check size={13} className="text-emerald-600" />
                        <span className="text-emerald-700 font-bold">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Domain</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>
                    Encrypted with TLS 1.3 &amp; GMEC Multi-Factor
                    Authentication
                  </span>
                </div>
              </div>

              {/* Right Column: CTA Buttons */}
              <div className="lg:col-span-5 flex flex-col gap-3.5 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
                <a
                  href={customLoginUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#2d5a27] via-[#23471e] to-[#2d5a27] hover:from-[#1b3617] hover:to-[#1b3617] text-white py-4 px-6 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#2d5a27]/30 border border-emerald-600/30 transition-all transform active:scale-95"
                >
                  <Mail
                    size={18}
                    className="shrink-0 text-amber-400 group-hover:scale-110 transition-transform"
                  />
                  <span>Launch GMEC Workspace &amp; Mail</span>
                  <ExternalLink
                    size={15}
                    className="text-emerald-200 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>

                <a
                  href={fallbackLoginUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-300 hover:border-amber-400 transition-all text-center shadow-sm"
                >
                  <RefreshCw size={13} className="text-amber-500" />
                  <span>Direct GMEC Webmail Login</span>
                </a>

                <div className="text-[11px] text-center text-slate-500 pt-2 border-t border-slate-200">
                  <span>Having trouble logging in? Contact </span>
                  <a
                    href="mailto:danielbofosujr@geominingec.com?cc=mskromah%40geominingec.com%2Cfkamara%40geominingec.com&subject=Staff%20Webmail%20Login%20Support"
                    className="text-amber-600 hover:text-amber-700 hover:underline font-bold"
                  >
                    IT Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Executive GMEC Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-14">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-emerald-400/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2d5a27] border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#2d5a27] transition-colors">
              GMEC Corporate Mailbox
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unified email management with personalized @geominingec.com
              addresses, integrated team calendars, and secure contact
              directories.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-amber-400/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
              Exploration &amp; EIA Archives
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Encrypted cloud synchronization for mineral exploration datasets,
              statutory EPA/MME compliance reports, and field mission logs.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-emerald-400/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2d5a27] border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#2d5a27] transition-colors">
              Operations &amp; Dispatch
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Centralized collaboration hub for field geologists, environmental
              auditors, and corporate management across Liberia and West Africa.
            </p>
          </div>
        </div>

        {/* IT Help Desk & Support Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-5xl mx-auto text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2d5a27]/50 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-white mb-1">
                  Need Account Assistance or Password Reset?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Contact the GMEC IT Administration team for account
                  provisioning, security keys, or email configuration support.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="mailto:danielbofosujr@geominingec.com?cc=mskromah%40geominingec.com%2Cfkamara%40geominingec.com&subject=GMEC%20Staff%20Webmail%20Access%20Request"
                className="inline-flex items-center gap-2 bg-[#2d5a27] hover:bg-[#23471e] text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md border border-emerald-500/30"
              >
                <Mail size={15} className="text-amber-400" />
                <span>Email IT Support</span>
              </a>

              <a
                href="tel:+231777772778"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-700 transition-all"
              >
                <Phone size={15} className="text-emerald-400" />
                <span>+231 77 777 2778</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPortal;
