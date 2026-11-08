import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FileCheck2,
  Scale,
  Users2,
  FileBarChart2,
  ShieldAlert,
  AlertCircle,
  ExternalLink,
  MapPin,
  Clock,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';

interface CRMSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CRMSidebar: React.FC<CRMSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const metrics = crmService.getDashboardMetrics();
  const currentUser = crmService.getCurrentUser();
  const role = currentUser?.role || 'registry_department';

  const allNavItems = [
    {
      id: 'dashboard',
      label: 'Management Dashboard',
      subtitle: 'KPIs & Expiration Radar',
      icon: LayoutDashboard,
      badge: metrics.urgentLicenses > 0 ? `${metrics.urgentLicenses} Urgent` : undefined,
      badgeColor: 'bg-red-50 text-red-700 border border-red-200',
    },
    {
      id: 'companies',
      label: 'Company Registration',
      subtitle: role === 'registry_department' ? 'Data Entry & Submission' : 'Corporate Cadastre & Directors',
      icon: Building2,
      badge: metrics.pendingCompanies > 0 ? `${metrics.pendingCompanies} Pending` : `${metrics.totalCompanies}`,
      badgeColor:
        metrics.pendingCompanies > 0
          ? 'bg-amber-50 text-amber-800 border border-amber-300'
          : 'bg-slate-100 text-slate-600 border border-slate-200',
    },
    {
      id: 'licenses',
      label: 'Mining Licenses',
      subtitle: '12 Statutory Categories',
      icon: FileCheck2,
      badge: `${metrics.totalLicenses} Total`,
      badgeColor: 'bg-emerald-50 text-[#2a602f] border border-emerald-200 font-bold',
    },
    {
      id: 'compliance',
      label: 'Regulatory Compliance',
      subtitle: 'EPA & MME Statutory Audits',
      icon: Scale,
      badge: `${metrics.complianceRate}% Rate`,
      badgeColor:
        metrics.complianceRate >= 80
          ? 'bg-emerald-50 text-[#2a602f] border border-emerald-200 font-bold'
          : 'bg-red-50 text-red-700 border border-red-200',
    },
    {
      id: 'clients',
      label: 'Client CRM',
      subtitle: 'Pipeline & Engagements',
      icon: Users2,
      badge: `${metrics.totalClients}`,
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
    },
    {
      id: 'reports',
      label: 'Reports & Exports',
      subtitle: 'Audit Dossiers & CSV Analytics',
      icon: FileBarChart2,
    },
    {
      id: 'security',
      label: 'Security & Access Control',
      subtitle: 'Threat Surveillance & Telemetry',
      icon: ShieldAlert,
    },
  ];

  // Enforce role-based module filtering
  const navItems = allNavItems.filter((item) => {
    if (role === 'super_admin' || role === 'it_department') {
      return true; // Super admin has unrestricted access to every module
    }
    if (role === 'registry_department') {
      // Registry department is restricted to Dashboard and Company Registration data entry only
      return item.id === 'dashboard' || item.id === 'companies';
    }
    if (role === 'management' || role === 'administrator') {
      // Executive Director and Administrator see dashboard oversight, company records, licenses, compliance, and reports (NO security module)
      return item.id !== 'security';
    }
    if (role === 'compliance_officer') {
      return item.id !== 'companies' && item.id !== 'security';
    }
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-16 sm:top-20 z-40 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-72 sm:w-80 bg-white border-r border-slate-200 text-slate-700 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Quick Concession Status Summary Pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
              <span className="flex items-center gap-1.5">
                <MapPin size={11} className="text-[#2a602f]" />
                <span className="text-slate-700 font-bold">Republic of Liberia</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#2a602f] border border-emerald-200 font-black text-[9px]">
                Cadastre Active
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-base font-black text-slate-900">{metrics.totalCompanies}</div>
                <div className="text-[9px] text-slate-500 uppercase font-bold tracking-tight">Registered Entities</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-base font-black text-[#2a602f]">{metrics.totalLicenses}</div>
                <div className="text-[9px] text-slate-500 uppercase font-bold tracking-tight">Active Licenses</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Integrated Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all ${
                    isActive
                      ? 'bg-[#2a602f] text-white font-bold shadow-md shadow-emerald-950/20 border border-[#2a602f]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#2a602f] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={18}
                      className={isActive ? 'text-[#ffc30d] shrink-0' : 'text-slate-400 shrink-0'}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-tight truncate">{item.label}</div>
                      <div
                        className={`text-[10px] leading-tight truncate mt-0.5 ${
                          isActive ? 'text-emerald-100 font-normal' : 'text-slate-500 font-normal'
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 shadow-sm ${
                        isActive
                          ? 'bg-[#ffc30d] text-slate-950'
                          : item.badgeColor || 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom System & Public Link Box */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span className="font-medium">Public Portal:</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2a602f] hover:underline flex items-center gap-1 font-bold"
            >
              <span>geominingec.com</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <div className="text-[10px] text-slate-500 leading-relaxed font-normal">
            GEOMINING &amp; Environmental Consultancy INC. Statutory MME &amp; EPA Regulatory Compliance Management.
          </div>
        </div>
      </aside>
    </>
  );
};

export default CRMSidebar;
