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

  const navItems = [
    {
      id: 'dashboard',
      label: 'Management Dashboard',
      subtitle: 'KPIs & Expiration Radar',
      icon: LayoutDashboard,
      badge: metrics.urgentLicenses > 0 ? `${metrics.urgentLicenses} Urgent` : undefined,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/40',
    },
    {
      id: 'companies',
      label: 'Company Registration',
      subtitle: 'Corporate Cadastre & Directors',
      icon: Building2,
      badge: metrics.pendingCompanies > 0 ? `${metrics.pendingCompanies} Pending` : `${metrics.totalCompanies}`,
      badgeColor: metrics.pendingCompanies > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-300',
    },
    {
      id: 'licenses',
      label: 'Mining Licenses',
      subtitle: '12 Statutory Categories',
      icon: FileCheck2,
      badge: `${metrics.totalLicenses} Total`,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
    },
    {
      id: 'compliance',
      label: 'Regulatory Compliance',
      subtitle: 'EPA & MME Statutory Audits',
      icon: Scale,
      badge: `${metrics.complianceRate}% Rate`,
      badgeColor: metrics.complianceRate >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40',
    },
    {
      id: 'clients',
      label: 'Client CRM',
      subtitle: 'Pipeline & Engagements',
      icon: Users2,
      badge: `${metrics.totalClients}`,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'reports',
      label: 'Reports & Exports',
      subtitle: 'Audit Dossiers & CSV Analytics',
      icon: FileBarChart2,
    },
    {
      id: 'security',
      label: 'Security & Accountability',
      subtitle: 'RBAC Roles & Audit Trail',
      icon: ShieldAlert,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-16 sm:top-20 z-40 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-72 sm:w-80 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Quick Concession Status Summary Pill */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <MapPin size={11} className="text-emerald-400" />
                <span>Republic of Liberia</span>
              </span>
              <span className="text-emerald-400 font-bold">Cadastre Active</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div className="text-base font-black text-white">{metrics.totalCompanies}</div>
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Registered Entities</div>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div className="text-base font-black text-amber-400">{metrics.totalLicenses}</div>
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Active Licenses</div>
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
                      ? 'bg-gradient-to-r from-[#2d5a27] to-emerald-700 text-white font-bold shadow-lg shadow-emerald-950/50 border border-emerald-400/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={18}
                      className={isActive ? 'text-amber-300 shrink-0' : 'text-slate-400 shrink-0'}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-tight truncate">{item.label}</div>
                      <div
                        className={`text-[10px] leading-tight truncate ${
                          isActive ? 'text-emerald-100' : 'text-slate-400'
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-800 text-slate-300'
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
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span>Public Portal:</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
            >
              <span>geominingec.com</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <div className="text-[10px] text-slate-400 leading-relaxed">
            GEOMINING &amp; Environmental Consultancy INC. Statutory MME &amp; EPA Regulatory Compliance Management.
          </div>
        </div>
      </aside>
    </>
  );
};

