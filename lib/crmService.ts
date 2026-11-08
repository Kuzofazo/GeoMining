import {
  UserRole,
  CRMUser,
  CompanyRecord,
  MiningLicense,
  ClientProfile,
  AuditLogEntry,
  SystemNotification,
  ServiceRequest,
  CommunicationLog,
  FollowUpTask,
  CompanyDocument,
  RegistrationStatus,
  RenewalStatus,
} from '../types/crm';
import {
  INITIAL_CRM_USERS,
  INITIAL_COMPANIES,
  INITIAL_MINING_LICENSES,
  INITIAL_CLIENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from './crmData';

const STORAGE_KEYS = {
  COMPANIES: 'gmec_crm_companies_v1',
  LICENSES: 'gmec_crm_licenses_v1',
  CLIENTS: 'gmec_crm_clients_v1',
  USERS: 'gmec_crm_users_v1',
  AUDIT_LOGS: 'gmec_crm_audit_logs_v1',
  NOTIFICATIONS: 'gmec_crm_notifications_v1',
  SESSION: 'gmec_crm_session_user_v1',
};

// Safe JSON loader
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`[CRM Storage] Error reading ${key}, falling back to initial data`, err);
    return fallback;
  }
}

// Safe JSON saver
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`[CRM Storage] Error writing ${key}`, err);
  }
}

// ─── RBAC Role Permissions ─────────────────────────────────────────────────
export interface RolePermissions {
  canManageCompanies: boolean;
  canApproveRegistrations: boolean;
  canManageLicenses: boolean;
  canApproveCompliance: boolean;
  canManageClients: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canManageUsers: boolean;
  canDeleteRecords: boolean;
  canViewAuditLogs: boolean;
  canConfigureSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    canManageCompanies: true,
    canApproveRegistrations: true,
    canManageLicenses: true,
    canApproveCompliance: true,
    canManageClients: true,
    canViewReports: true,
    canExportData: true,
    canManageUsers: true,
    canDeleteRecords: true,
    canViewAuditLogs: true,
    canConfigureSettings: true,
  },
  administrator: {
    canManageCompanies: true,
    canApproveRegistrations: true,
    canManageLicenses: true,
    canApproveCompliance: true,
    canManageClients: true,
    canViewReports: true,
    canExportData: true,
    canManageUsers: true,
    canDeleteRecords: true,
    canViewAuditLogs: true,
    canConfigureSettings: true,
  },
  it_department: {
    canManageCompanies: true,
    canApproveRegistrations: false,
    canManageLicenses: true,
    canApproveCompliance: false,
    canManageClients: true,
    canViewReports: true,
    canExportData: true,
    canManageUsers: true,
    canDeleteRecords: true,
    canViewAuditLogs: true,
    canConfigureSettings: true,
  },
  registry_department: {
    canManageCompanies: true,
    canApproveRegistrations: true,
    canManageLicenses: false,
    canApproveCompliance: false,
    canManageClients: true,
    canViewReports: true,
    canExportData: true,
    canManageUsers: false,
    canDeleteRecords: false,
    canViewAuditLogs: false,
    canConfigureSettings: false,
  },
  compliance_officer: {
    canManageCompanies: false,
    canApproveRegistrations: false,
    canManageLicenses: true,
    canApproveCompliance: true,
    canManageClients: true,
    canViewReports: true,
    canExportData: true,
    canManageUsers: false,
    canDeleteRecords: false,
    canViewAuditLogs: true,
    canConfigureSettings: false,
  },
  management: {
    canManageCompanies: true,
    canApproveRegistrations: true,
    canManageLicenses: true,
    canApproveCompliance: true,
    canManageClients: true,
    canViewReports: true,
    canExportData: true,
    canManageUsers: false,
    canDeleteRecords: false,
    canViewAuditLogs: true,
    canConfigureSettings: false,
  },
};

export const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string; description: string }> = {
  super_admin: {
    label: 'Super Admin',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Supreme unconstrained authority across IT infrastructure, governance, and cadastre management.',
  },
  administrator: {
    label: 'Administrator',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Full operational administration, license approvals, and cadastre management.',
  },
  it_department: {
    label: 'IT & Security Department',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'System administration, security logs, user credentialing, and infrastructure.',
  },
  registry_department: {
    label: 'Registry Department',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Company registrations, incorporation records, document vetting, and registry status.',
  },
  compliance_officer: {
    label: 'Statutory Compliance Officer',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Mining license audits, EPA/MME statutory filings, obligations, and renewals.',
  },
  management: {
    label: 'Executive Director & Board',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    description: 'Executive leadership, KPI dashboards, strategic reporting, and directorate summaries.',
  },
};

// ─── In-Memory & LocalStorage CRM Store ─────────────────────────────────────
class CRMStore {
  private companies: CompanyRecord[] = [];
  private licenses: MiningLicense[] = [];
  private clients: ClientProfile[] = [];
  private users: (CRMUser & { defaultPassword: string })[] = [];
  private auditLogs: AuditLogEntry[] = [];
  private notifications: SystemNotification[] = [];
  private currentUser: CRMUser | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    this.companies = loadFromStorage(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    this.licenses = loadFromStorage(STORAGE_KEYS.LICENSES, INITIAL_MINING_LICENSES);
    this.clients = loadFromStorage(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);

    // Load users and ensure official accounts from INITIAL_CRM_USERS are synced with correct credentials
    const storedUsers = loadFromStorage<(CRMUser & { defaultPassword: string })[]>(STORAGE_KEYS.USERS, INITIAL_CRM_USERS);
    const userMap = new Map<string, CRMUser & { defaultPassword: string }>();
    INITIAL_CRM_USERS.forEach((u) => userMap.set(u.email.toLowerCase(), { ...u }));
    storedUsers.forEach((u) => {
      const official = userMap.get(u.email.toLowerCase());
      if (official) {
        userMap.set(u.email.toLowerCase(), {
          ...u,
          defaultPassword: official.defaultPassword,
          role: official.role,
          name: official.name,
          department: official.department,
        });
      } else {
        userMap.set(u.email.toLowerCase(), u);
      }
    });
    this.users = Array.from(userMap.values());
    saveToStorage(STORAGE_KEYS.USERS, this.users);

    this.auditLogs = loadFromStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.notifications = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);

    // Load active session user if present
    try {
      const storedSession = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (storedSession) {
        this.currentUser = JSON.parse(storedSession);
      }
    } catch {
      this.currentUser = null;
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // ─── Authentication & Session ───────────────────────────────────────────
  public getCurrentUser(): CRMUser | null {
    return this.currentUser;
  }

  public login(email: string, passwordAttempt: string): { success: boolean; error?: string; user?: CRMUser } {
    const user = this.users.find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (!user) {
      return { success: false, error: 'User account with this email not found.' };
    }
    if (user.status === 'suspended') {
      return { success: false, error: 'This account has been suspended by IT Security.' };
    }

    // Check password with case-sensitive exact match, plus tolerate alternate double @@ for zwleh
    const isPasswordValid =
      user.defaultPassword === passwordAttempt ||
      (user.email.toLowerCase() === 'zwleh@geominingec.com' &&
        (passwordAttempt === 'ZKW@#GMEC1234' || passwordAttempt === 'ZKW@@#GMEC1234'));

    if (!isPasswordValid) {
      return { success: false, error: 'Incorrect security password.' };
    }

    // Success: Set session
    const sessionUser: CRMUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      status: user.status,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    this.currentUser = sessionUser;
    sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));

    // Update lastLogin in user record
    user.lastLogin = sessionUser.lastLogin;
    saveToStorage(STORAGE_KEYS.USERS, this.users);

    this.logAudit('LOGIN', 'Security', `User logged in successfully via ${user.role} role credentials.`);
    this.notify();
    return { success: true, user: sessionUser };
  }

  public switchRoleUser(role: UserRole): CRMUser {
    const targetUser = this.users.find((u) => u.role === role) || this.users[0];
    const sessionUser: CRMUser = {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      department: targetUser.department,
      phone: targetUser.phone,
      status: targetUser.status,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    this.currentUser = sessionUser;
    sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    this.logAudit('LOGIN', 'Security', `Switched active administrative session to: ${targetUser.name} (${role})`);
    this.notify();
    return sessionUser;
  }

  public logout(): void {
    if (this.currentUser) {
      this.logAudit('LOGOUT', 'Security', `User ${this.currentUser.name} signed out.`);
    }
    this.currentUser = null;
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    this.notify();
  }

  public checkPermission(action: keyof RolePermissions): boolean {
    if (!this.currentUser) return false;
    return ROLE_PERMISSIONS[this.currentUser.role][action];
  }

  // ─── Audit Trail Helper ────────────────────────────────────────────────
  public logAudit(
    action: AuditLogEntry['action'],
    module: AuditLogEntry['module'],
    details: string,
    targetRecordId?: string,
    targetRecordName?: string
  ): void {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: this.currentUser?.id || 'system',
      userName: this.currentUser?.name || 'Automated System',
      userRole: this.currentUser?.role || 'administrator',
      action,
      module,
      targetRecordId,
      targetRecordName,
      details,
    };
    this.auditLogs.unshift(entry);
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // ─── Company Registration CRUD ──────────────────────────────────────────
  public getCompanies(): CompanyRecord[] {
    return [...this.companies];
  }

  public getCompanyById(id: string): CompanyRecord | undefined {
    return this.companies.find((c) => c.id === id);
  }

  public addCompany(data: Omit<CompanyRecord, 'id' | 'createdAt' | 'updatedAt' | 'documents'>): CompanyRecord {
    const newCompany: CompanyRecord = {
      ...data,
      id: `comp-${Date.now()}`,
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.companies.unshift(newCompany);
    saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
    this.logAudit('CREATE', 'Company Registration', `Created new company entity: ${newCompany.companyName} (${newCompany.registrationNumber})`, newCompany.id, newCompany.companyName);
    this.notify();
    return newCompany;
  }

  public updateCompany(id: string, updates: Partial<CompanyRecord>): CompanyRecord | null {
    const index = this.companies.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const oldName = this.companies[index].companyName;
    this.companies[index] = {
      ...this.companies[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
    this.logAudit('UPDATE', 'Company Registration', `Updated registration details for: ${oldName}`, id, oldName);
    this.notify();
    return this.companies[index];
  }

  public updateCompanyStatus(id: string, status: RegistrationStatus): boolean {
    const company = this.companies.find((c) => c.id === id);
    if (!company) return false;
    const oldStatus = company.status;
    company.status = status;
    company.updatedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
    this.logAudit('STATUS_CHANGE', 'Company Registration', `Status transitioned from ${oldStatus.toUpperCase()} to ${status.toUpperCase()} for ${company.companyName}`, id, company.companyName);
    this.notify();
    return true;
  }

  public addCompanyDocument(companyId: string, document: Omit<CompanyDocument, 'id' | 'uploadedAt' | 'uploadedBy' | 'verified'>): CompanyDocument | null {
    const company = this.companies.find((c) => c.id === companyId);
    if (!company) return null;

    const newDoc: CompanyDocument = {
      ...document,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().substring(0, 10),
      uploadedBy: this.currentUser?.name || 'Registry Officer',
      verified: true,
    };
    company.documents.unshift(newDoc);
    company.updatedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
    this.logAudit('DOCUMENT_UPLOAD', 'Company Registration', `Attached verified document: ${newDoc.title} (${newDoc.documentType})`, companyId, company.companyName);
    this.notify();
    return newDoc;
  }

  public deleteCompany(id: string): boolean {
    const company = this.companies.find((c) => c.id === id);
    if (!company) return false;
    this.companies = this.companies.filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
    this.logAudit('DELETE', 'Company Registration', `Deleted company record: ${company.companyName}`, id, company.companyName);
    this.notify();
    return true;
  }

  // ─── Mining Licenses CRUD ───────────────────────────────────────────────
  public getLicenses(): MiningLicense[] {
    return [...this.licenses];
  }

  public getLicenseById(id: string): MiningLicense | undefined {
    return this.licenses.find((l) => l.id === id);
  }

  public addLicense(data: Omit<MiningLicense, 'id' | 'updatedAt' | 'complianceObligations'>): MiningLicense {
    // Generate default statutory compliance obligations
    const obligations = [
      {
        id: `obl-${Date.now()}-1`,
        title: 'Quarterly Environmental Audit Filing (EPA)',
        regulator: 'EPA Liberia' as const,
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        status: 'pending' as const,
        description: 'Mandatory quarterly environmental monitoring and water analysis.',
      },
      {
        id: `obl-${Date.now()}-2`,
        title: 'Concession Cadastral Surface Rental Fee (MME)',
        regulator: 'Ministry of Mines & Energy (MME)' as const,
        dueDate: data.expiryDate,
        status: 'pending' as const,
        description: 'Annual statutory surface rent per square kilometer.',
      },
    ];

    const newLicense: MiningLicense = {
      ...data,
      id: `lic-${Date.now()}`,
      complianceObligations: obligations,
      updatedAt: new Date().toISOString(),
    };
    this.licenses.unshift(newLicense);
    saveToStorage(STORAGE_KEYS.LICENSES, this.licenses);
    this.logAudit('CREATE', 'Mining Licenses', `Issued new mining license: ${newLicense.licenseNumber} (${newLicense.category}) for ${newLicense.companyName}`, newLicense.id, newLicense.licenseNumber);
    this.notify();
    return newLicense;
  }

  public updateLicense(id: string, updates: Partial<MiningLicense>): MiningLicense | null {
    const index = this.licenses.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const oldLic = this.licenses[index];
    this.licenses[index] = {
      ...oldLic,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.LICENSES, this.licenses);
    this.logAudit('UPDATE', 'Mining Licenses', `Updated license details for ${oldLic.licenseNumber}`, id, oldLic.licenseNumber);
    this.notify();
    return this.licenses[index];
  }

  public renewLicense(id: string, newExpiryDate: string, statutoryFee: number): boolean {
    const license = this.licenses.find((l) => l.id === id);
    if (!license) return false;

    const oldExpiry = license.expiryDate;
    license.expiryDate = newExpiryDate;
    license.renewalStatus = 'current';
    license.statutoryFeeUSD = statutoryFee;
    license.feePaymentStatus = 'paid';
    license.updatedAt = new Date().toISOString();

    saveToStorage(STORAGE_KEYS.LICENSES, this.licenses);
    this.logAudit('STATUS_CHANGE', 'Mining Licenses', `Renewed license ${license.licenseNumber} from ${oldExpiry} to ${newExpiryDate}`, id, license.licenseNumber);
    this.notify();
    return true;
  }

  public updateComplianceObligationStatus(licenseId: string, obligationId: string, status: 'compliant' | 'pending' | 'overdue' | 'waived'): boolean {
    const license = this.licenses.find((l) => l.id === licenseId);
    if (!license) return false;
    const obl = license.complianceObligations.find((o) => o.id === obligationId);
    if (!obl) return false;

    const oldStatus = obl.status;
    obl.status = status;
    obl.lastCheckedDate = new Date().toISOString().substring(0, 10);
    license.updatedAt = new Date().toISOString();

    saveToStorage(STORAGE_KEYS.LICENSES, this.licenses);
    this.logAudit('UPDATE', 'Compliance', `Updated compliance obligation [${obl.title}] on license ${license.licenseNumber} to ${status.toUpperCase()} (was ${oldStatus})`, licenseId, license.licenseNumber);
    this.notify();
    return true;
  }

  public deleteLicense(id: string): boolean {
    const license = this.licenses.find((l) => l.id === id);
    if (!license) return false;
    this.licenses = this.licenses.filter((l) => l.id !== id);
    saveToStorage(STORAGE_KEYS.LICENSES, this.licenses);
    this.logAudit('DELETE', 'Mining Licenses', `Deleted license record: ${license.licenseNumber}`, id, license.licenseNumber);
    this.notify();
    return true;
  }

  // ─── Client CRM CRUD ────────────────────────────────────────────────────
  public getClients(): ClientProfile[] {
    return [...this.clients];
  }

  public getClientById(id: string): ClientProfile | undefined {
    return this.clients.find((c) => c.id === id);
  }

  public addClient(data: Omit<ClientProfile, 'id' | 'createdAt' | 'serviceRequests' | 'communicationLogs' | 'followUps'>): ClientProfile {
    const newClient: ClientProfile = {
      ...data,
      id: `clt-${Date.now()}`,
      serviceRequests: [],
      communicationLogs: [],
      followUps: [],
      createdAt: new Date().toISOString().substring(0, 10),
    };
    this.clients.unshift(newClient);
    saveToStorage(STORAGE_KEYS.CLIENTS, this.clients);
    this.logAudit('CREATE', 'Client CRM', `Registered client account: ${newClient.clientName}`, newClient.id, newClient.clientName);
    this.notify();
    return newClient;
  }

  public updateClient(id: string, updates: Partial<ClientProfile>): ClientProfile | null {
    const index = this.clients.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const oldClient = this.clients[index];
    this.clients[index] = {
      ...oldClient,
      ...updates,
    };
    saveToStorage(STORAGE_KEYS.CLIENTS, this.clients);
    this.logAudit('UPDATE', 'Client CRM', `Updated client profile: ${oldClient.clientName}`, id, oldClient.clientName);
    this.notify();
    return this.clients[index];
  }

  public addServiceRequest(clientId: string, request: Omit<ServiceRequest, 'id' | 'clientId'>): ServiceRequest | null {
    const client = this.clients.find((c) => c.id === clientId);
    if (!client) return null;

    const newReq: ServiceRequest = {
      ...request,
      id: `sr-${Date.now()}`,
      clientId,
    };
    client.serviceRequests.unshift(newReq);
    client.totalContractValueUSD += newReq.estimatedValueUSD;
    saveToStorage(STORAGE_KEYS.CLIENTS, this.clients);
    this.logAudit('CREATE', 'Client CRM', `Created service engagement: ${newReq.serviceTitle} ($${newReq.estimatedValueUSD.toLocaleString()})`, clientId, client.clientName);
    this.notify();
    return newReq;
  }

  public addCommunicationLog(clientId: string, log: Omit<CommunicationLog, 'id' | 'clientId'>): CommunicationLog | null {
    const client = this.clients.find((c) => c.id === clientId);
    if (!client) return null;

    const newLog: CommunicationLog = {
      ...log,
      id: `com-${Date.now()}`,
      clientId,
    };
    client.communicationLogs.unshift(newLog);
    saveToStorage(STORAGE_KEYS.CLIENTS, this.clients);
    this.logAudit('CREATE', 'Client CRM', `Logged ${newLog.channel} correspondence with ${client.clientName}`, clientId, client.clientName);
    this.notify();
    return newLog;
  }

  public addFollowUpTask(clientId: string, task: Omit<FollowUpTask, 'id' | 'clientId'>): FollowUpTask | null {
    const client = this.clients.find((c) => c.id === clientId);
    if (!client) return null;

    const newTask: FollowUpTask = {
      ...task,
      id: `tsk-${Date.now()}`,
      clientId,
    };
    client.followUps.unshift(newTask);
    saveToStorage(STORAGE_KEYS.CLIENTS, this.clients);
    this.logAudit('CREATE', 'Client CRM', `Assigned task: ${newTask.title} (Due: ${newTask.dueDate})`, clientId, client.clientName);
    this.notify();
    return newTask;
  }

  public toggleFollowUpTask(clientId: string, taskId: string): boolean {
    const client = this.clients.find((c) => c.id === clientId);
    if (!client) return false;
    const task = client.followUps.find((t) => t.id === taskId);
    if (!task) return false;
    task.completed = !task.completed;
    saveToStorage(STORAGE_KEYS.CLIENTS, this.clients);
    this.notify();
    return true;
  }

  public deleteClient(id: string): boolean {
    const client = this.clients.find((c) => c.id === id);
    if (!client) return false;
    this.clients = this.clients.filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTS, this.clients);
    this.logAudit('DELETE', 'Client CRM', `Deleted client profile: ${client.clientName}`, id, client.clientName);
    this.notify();
    return true;
  }

  // ─── Users & Security ──────────────────────────────────────────────────
  public getUsers(): CRMUser[] {
    return this.users.map(({ defaultPassword, ...u }) => u);
  }

  public addUser(data: Omit<CRMUser, 'id'>, password: string): CRMUser {
    const newUser = {
      ...data,
      id: `usr-${Date.now()}`,
      defaultPassword: password,
      status: 'active' as const,
    };
    this.users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, this.users);
    this.logAudit('CREATE', 'User Management', `Provisioned user account for ${newUser.name} with role ${newUser.role}`, newUser.id, newUser.name);
    this.notify();
    const { defaultPassword, ...safeUser } = newUser;
    return safeUser;
  }

  public updateUserStatus(userId: string, status: 'active' | 'suspended'): boolean {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return false;
    user.status = status;
    saveToStorage(STORAGE_KEYS.USERS, this.users);
    this.logAudit('UPDATE', 'User Management', `Changed status for ${user.name} to ${status.toUpperCase()}`, userId, user.name);
    this.notify();
    return true;
  }

  // ─── Audit Logs & Notifications ─────────────────────────────────────────
  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  public getNotifications(): SystemNotification[] {
    return [...this.notifications];
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
      this.notify();
    }
  }

  public clearAllNotifications(): void {
    this.notifications.forEach((n) => (n.read = true));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  // ─── Expiration Forecaster & Notifications Refresh ───────────────────────
  public refreshAlerts(): void {
    const now = new Date().getTime();
    const newAlerts: SystemNotification[] = [];

    // Check licenses
    this.licenses.forEach((lic) => {
      const exp = new Date(lic.expiryDate).getTime();
      const daysRemaining = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));

      if (daysRemaining < 0 && lic.renewalStatus !== 'expired' && lic.renewalStatus !== 'revoked') {
        lic.renewalStatus = 'expired';
        newAlerts.push({
          id: `alert-exp-${lic.id}`,
          type: 'critical',
          title: `License EXPIRED: ${lic.licenseNumber}`,
          message: `${lic.category} held by ${lic.companyName} expired on ${lic.expiryDate}. Immediate statutory regularization required.`,
          timestamp: 'Just now',
          read: false,
          relatedModule: 'Mining Licenses',
          relatedId: lic.id,
        });
      } else if (daysRemaining <= 30 && daysRemaining >= 0 && lic.renewalStatus !== 'urgent') {
        lic.renewalStatus = 'urgent';
        newAlerts.push({
          id: `alert-urg-${lic.id}`,
          type: 'critical',
          title: `Urgent Expiration (${daysRemaining} Days): ${lic.licenseNumber}`,
          message: `${lic.category} (${lic.companyName}) expires in ${daysRemaining} days on ${lic.expiryDate}.`,
          timestamp: 'Just now',
          read: false,
          relatedModule: 'Mining Licenses',
          relatedId: lic.id,
        });
      } else if (daysRemaining <= 60 && daysRemaining > 30 && lic.renewalStatus !== 'expiring_soon') {
        lic.renewalStatus = 'expiring_soon';
        newAlerts.push({
          id: `alert-soon-${lic.id}`,
          type: 'warning',
          title: `Upcoming Renewal (${daysRemaining} Days): ${lic.licenseNumber}`,
          message: `${lic.category} expires in ${daysRemaining} days. Prepare MME filing dossier.`,
          timestamp: 'Just now',
          read: false,
          relatedModule: 'Mining Licenses',
          relatedId: lic.id,
        });
      }
    });

    if (newAlerts.length > 0) {
      this.notifications = [...newAlerts, ...this.notifications];
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
      saveToStorage(STORAGE_KEYS.LICENSES, this.licenses);
      this.notify();
    }
  }

  // ─── Dashboard Stats & KPIs ──────────────────────────────────────────────
  public getDashboardMetrics() {
    const totalCompanies = this.companies.length;
    const activeCompanies = this.companies.filter((c) => c.status === 'active').length;
    const pendingCompanies = this.companies.filter((c) => c.status === 'pending' || c.status === 'under_review').length;

    const totalLicenses = this.licenses.length;
    const activeLicenses = this.licenses.filter((l) => l.renewalStatus === 'current' || l.renewalStatus === 'expiring_soon').length;
    const urgentLicenses = this.licenses.filter((l) => l.renewalStatus === 'urgent').length;
    const expiredLicenses = this.licenses.filter((l) => l.renewalStatus === 'expired').length;

    const totalClients = this.clients.length;
    const totalContractValue = this.clients.reduce((acc, c) => acc + (c.totalContractValueUSD || 0), 0);

    // Compute all compliance obligations
    let totalObligations = 0;
    let compliantObligations = 0;
    this.licenses.forEach((l) => {
      l.complianceObligations.forEach((o) => {
        totalObligations++;
        if (o.status === 'compliant') compliantObligations++;
      });
    });
    const complianceRate = totalObligations > 0 ? Math.round((compliantObligations / totalObligations) * 100) : 100;

    // County breakdown
    const countyDistribution: Record<string, number> = {};
    this.licenses.forEach((l) => {
      countyDistribution[l.county] = (countyDistribution[l.county] || 0) + 1;
    });

    // Category breakdown
    const categoryDistribution: Record<string, number> = {};
    this.licenses.forEach((l) => {
      categoryDistribution[l.category] = (categoryDistribution[l.category] || 0) + 1;
    });

    return {
      totalCompanies,
      activeCompanies,
      pendingCompanies,
      totalLicenses,
      activeLicenses,
      urgentLicenses,
      expiredLicenses,
      totalClients,
      totalContractValue,
      totalObligations,
      compliantObligations,
      complianceRate,
      countyDistribution,
      categoryDistribution,
    };
  }

  // ─── CSV Export Utility ──────────────────────────────────────────────────
  public exportDataToCSV(type: 'companies' | 'licenses' | 'clients' | 'audit_logs'): void {
    let csvContent = '';
    let filename = `GMEC_Report_${type}_${new Date().toISOString().substring(0, 10)}.csv`;

    if (type === 'companies') {
      const headers = ['Company Name', 'Reg Number', 'TIN', 'Entity Type', 'County', 'Status', 'Registration Date', 'Annual Renewal', 'Officer'];
      const rows = this.companies.map((c) => [
        `"${c.companyName}"`,
        `"${c.registrationNumber}"`,
        `"${c.taxIdentificationNumber}"`,
        `"${c.entityType}"`,
        `"${c.county}"`,
        `"${c.status.toUpperCase()}"`,
        `"${c.registrationDate}"`,
        `"${c.annualRenewalDate}"`,
        `"${c.assignedOfficer}"`,
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (type === 'licenses') {
      const headers = ['License No', 'Category', 'Company Name', 'County', 'Concession Area', 'Issue Date', 'Expiry Date', 'Status', 'Commodity', 'Fee USD', 'Fee Status'];
      const rows = this.licenses.map((l) => [
        `"${l.licenseNumber}"`,
        `"${l.category}"`,
        `"${l.companyName}"`,
        `"${l.county}"`,
        `"${l.concessionArea}"`,
        `"${l.issueDate}"`,
        `"${l.expiryDate}"`,
        `"${l.renewalStatus.toUpperCase()}"`,
        `"${l.primaryCommodity}"`,
        l.statutoryFeeUSD,
        `"${l.feePaymentStatus.toUpperCase()}"`,
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (type === 'clients') {
      const headers = ['Client Name', 'Tier', 'Primary Contact', 'Email', 'Phone', 'Country', 'Status', 'Total Value (USD)', 'Account Manager'];
      const rows = this.clients.map((c) => [
        `"${c.clientName}"`,
        `"${c.tier}"`,
        `"${c.primaryContactName}"`,
        `"${c.email}"`,
        `"${c.phone}"`,
        `"${c.country}"`,
        `"${c.status.toUpperCase()}"`,
        c.totalContractValueUSD,
        `"${c.accountManager}"`,
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (type === 'audit_logs') {
      const headers = ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Target Record', 'Details'];
      const rows = this.auditLogs.map((a) => [
        `"${a.timestamp}"`,
        `"${a.userName}"`,
        `"${a.userRole}"`,
        `"${a.action}"`,
        `"${a.module}"`,
        `"${a.targetRecordName || a.targetRecordId || 'N/A'}"`,
        `"${a.details.replace(/"/g, '""')}"`,
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.logAudit('EXPORT', 'Reports', `Generated and downloaded CSV export: ${filename}`);
  }
}

// Global Singleton Instance
export const crmService = new CRMStore();

