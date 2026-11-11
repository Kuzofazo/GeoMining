import React, { useState, useEffect } from 'react';
import { CRMUser, MiningLicense } from '../types/crm';
import { crmService } from '../lib/crmService';
import { CRMLogin } from '../components/crm/CRMLogin';
import { CRMHeader } from '../components/crm/CRMHeader';
import { CRMSidebar } from '../components/crm/CRMSidebar';
import { CRMDashboard } from '../components/crm/CRMDashboard';
import { CRMCompanies } from '../components/crm/CRMCompanies';
import { CRMLicenses } from '../components/crm/CRMLicenses';
import { CRMCompliance } from '../components/crm/CRMCompliance';
import { CRMClients } from '../components/crm/CRMClients';
import { CRMReports } from '../components/crm/CRMReports';
import { CRMSecurity } from '../components/crm/CRMSecurity';
import { CRMTasks } from '../components/crm/CRMTasks';
import { CRMEmployees } from '../components/crm/CRMEmployees';
import { CRMDocumentVault } from '../components/crm/CRMDocumentVault';
import { CRMTeamFeed } from '../components/crm/CRMTeamFeed';
import { CRMGisMap } from '../components/crm/CRMGisMap';

export const CRMPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<CRMUser | null>(() =>
    crmService.getCurrentUser()
  );
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [renewTargetLicense, setRenewTargetLicense] = useState<MiningLicense | null>(null);

  // Subscribe to CRM service updates (login, logout, role switch, audits)
  useEffect(() => {
    const unsubscribe = crmService.subscribe(() => {
      setCurrentUser(crmService.getCurrentUser());
    });
    return () => unsubscribe();
  }, []);

  // Automatic Session Inactivity Invalidation (30-minute timeout)
  useEffect(() => {
    if (!currentUser) return;

    const handleUserActivity = () => {
      crmService.touchSessionActivity();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    const intervalId = setInterval(() => {
      const { expired } = crmService.checkSessionTimeout(30);
      if (expired) {
        alert('Security Notice: Your session has expired due to 30 minutes of inactivity. Please re-authenticate.');
        setCurrentUser(null);
      }
    }, 30000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      clearInterval(intervalId);
    };
  }, [currentUser]);

  // Enforce tab access per role
  useEffect(() => {
    if (!currentUser) return;
    const registryAllowed = ['dashboard', 'companies', 'tasks', 'employees', 'documents', 'team_feed'];
    if (currentUser.role === 'registry_department' && !registryAllowed.includes(activeTab)) {
      setActiveTab('dashboard');
    } else if (
      (currentUser.role === 'management' || currentUser.role === 'administrator') &&
      activeTab === 'security'
    ) {
      setActiveTab('dashboard');
    }
  }, [currentUser, activeTab]);

  const handleLoginSuccess = () => {
    setCurrentUser(crmService.getCurrentUser());
  };

  const handleLogout = () => {
    crmService.logout();
    setCurrentUser(null);
  };

  const handleRenewLicense = (license: MiningLicense) => {
    setRenewTargetLicense(license);
    setActiveTab('licenses');
  };

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close mobile drawer when selecting tab
  };

  // If unauthenticated, display professional multi-role security login gate
  if (!currentUser) {
    return <CRMLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-['Outfit',sans-serif] selection:bg-[#2a602f] selection:text-white">
      {/* Statutory Header */}
      <CRMHeader
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSelectTab={handleTabSelect}
        onSearch={setGlobalSearch}
      />

      {/* Main Workspace with Sticky Sidebar */}
      <div className="flex-1 max-w-[120rem] w-full mx-auto flex">
        {/* Navigation Sidebar */}
        <CRMSidebar
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Dynamic Subcomponent Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <CRMDashboard
              onSelectTab={handleTabSelect}
              onOpenNewCompanyModal={() => setActiveTab('companies')}
              onOpenNewLicenseModal={() => setActiveTab('licenses')}
              onRenewLicense={handleRenewLicense}
            />
          )}

          {activeTab === 'companies' && (
            <CRMCompanies initialSearch={globalSearch} />
          )}

          {activeTab === 'tasks' && (
            <CRMTasks initialSearch={globalSearch} />
          )}

          {activeTab === 'employees' && (
            <CRMEmployees initialSearch={globalSearch} />
          )}

          {activeTab === 'documents' && (
            <CRMDocumentVault initialSearch={globalSearch} />
          )}

          {activeTab === 'team_feed' && (
            <CRMTeamFeed />
          )}

          {activeTab === 'licenses' && (
            <CRMLicenses
              initialSearch={globalSearch}
              onSelectTab={handleTabSelect}
              renewTargetLicense={renewTargetLicense}
              onClearRenewTarget={() => setRenewTargetLicense(null)}
            />
          )}

          {activeTab === 'map' && <CRMGisMap />}

          {activeTab === 'compliance' && <CRMCompliance />}

          {activeTab === 'clients' && (
            <CRMClients initialSearch={globalSearch} />
          )}

          {activeTab === 'reports' && <CRMReports />}

          {activeTab === 'security' && <CRMSecurity />}
        </main>
      </div>
    </div>
  );
};

export default CRMPage;

