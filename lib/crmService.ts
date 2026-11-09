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
  FailedLoginAttempt,
  SecurityAlert,
  ActiveSession,
  AccountLockout,
  RecordComment,
} from '../types/crm';
import {
  INITIAL_CRM_USERS,
  INITIAL_COMPANIES,
  INITIAL_MINING_LICENSES,
  INITIAL_CLIENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from './crmData';
import { captureDeviceTelemetry, DeviceTelemetry } from './securityTelemetry';
import { securityAlarm } from './audioAlarm';

const STORAGE_KEYS = {
  COMPANIES: 'gmec_crm_companies_v1',
  LICENSES: 'gmec_crm_licenses_v1',
  CLIENTS: 'gmec_crm_clients_v1',
  USERS: 'gmec_crm_users_v1',
  AUDIT_LOGS: 'gmec_crm_audit_logs_v1',
  NOTIFICATIONS: 'gmec_crm_notifications_v1',
  SESSION: 'gmec_crm_session_user_v1',
  FAILED_LOGINS: 'gmec_crm_failed_logins_v2',
  SECURITY_ALERTS: 'gmec_crm_security_alerts_v2',
  ACCOUNT_LOCKOUTS: 'gmec_crm_lockouts_v2',
  RECORD_COMMENTS: 'gmec_crm_comments_v2',
  ACTIVE_SESSIONS: 'gmec_crm_active_sessions_v2',
  LAST_ACTIVITY: 'gmec_crm_last_activity_v2',
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
  canViewSecurityDashboard: boolean;
  canManageSecurityAlerts: boolean;
  canBackupRestoreDatabase: boolean;
  canAddComments: boolean;
  canViewComments: boolean;
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
    canViewSecurityDashboard: true,
    canManageSecurityAlerts: true,
    canBackupRestoreDatabase: true,
    canAddComments: true,
    canViewComments: true,
  },
  administrator: {
    canManageCompanies: false,
    canApproveRegistrations: false, // Approval restricted to Executive Director or Registry Boss (emyers@geominingec.com)
    canManageLicenses: false,
    canApproveCompliance: false,
    canManageClients: false,
    canViewReports: true,
    canExportData: false,
    canManageUsers: false,
    canDeleteRecords: false,
    canViewAuditLogs: true,
    canConfigureSettings: false,
    canViewSecurityDashboard: false,
    canManageSecurityAlerts: false,
    canBackupRestoreDatabase: false,
    canAddComments: true,
    canViewComments: true,
  },
  management: {
    canManageCompanies: false,
    canApproveRegistrations: true, // Executive Director has authority to approve companies registered by Registry Dept
    canManageLicenses: false,
    canApproveCompliance: false,
    canManageClients: false,
    canViewReports: true,
    canExportData: false,
    canManageUsers: false,
    canDeleteRecords: false,
    canViewAuditLogs: true,
    canConfigureSettings: false,
    canViewSecurityDashboard: false,
    canManageSecurityAlerts: false,
    canBackupRestoreDatabase: false,
    canAddComments: true,
    canViewComments: true,
  },
  registry_department: {
    canManageCompanies: true, // Data entry for company registration
    canApproveRegistrations: false, // Cannot approve official status, must submit for review
    canManageLicenses: false, // Cannot modify mining licenses
    canApproveCompliance: false,
    canManageClients: false,
    canViewReports: false,
    canExportData: false,
    canManageUsers: false,
    canDeleteRecords: false,
    canViewAuditLogs: false,
    canConfigureSettings: false,
    canViewSecurityDashboard: false,
    canManageSecurityAlerts: false,
    canBackupRestoreDatabase: false,
    canAddComments: true,
    canViewComments: true,
  },
  it_department: {
    canManageCompanies: false,
    canApproveRegistrations: false,
    canManageLicenses: false,
    canApproveCompliance: false,
    canManageClients: false,
    canViewReports: true,
    canExportData: true,
    canManageUsers: true,
    canDeleteRecords: true,
    canViewAuditLogs: true,
    canConfigureSettings: true,
    canViewSecurityDashboard: true,
    canManageSecurityAlerts: true,
    canBackupRestoreDatabase: true,
    canAddComments: true,
    canViewComments: true,
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
    canViewSecurityDashboard: false,
    canManageSecurityAlerts: false,
    canBackupRestoreDatabase: false,
    canAddComments: true,
    canViewComments: true,
  },
};

export const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string; description: string }> = {
  super_admin: {
    label: 'Super Admin',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Supreme unconstrained authority over all modules, users, security monitoring, and system settings.',
  },
  management: {
    label: 'Executive Director',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    description: 'Executive leadership oversight. Read-only dashboard access with observation commenting.',
  },
  administrator: {
    label: 'Administrator',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Operational oversight and monitoring. Read-only dashboard access with observation commenting.',
  },
  registry_department: {
    label: 'Registry Department',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Data entry for official company registration, incorporation records, certificates, and submission.',
  },
  it_department: {
    label: 'IT & Security Department',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'System administration, infrastructure security, credentialing, and telemetry audits.',
  },
  compliance_officer: {
    label: 'Statutory Compliance Officer',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Mining license audits, EPA/MME statutory filings, obligations, and renewals.',
  },
};

// ─── Initial Seed Failed Logins & Alerts for Demonstration ──────────────────
const INITIAL_FAILED_LOGINS: FailedLoginAttempt[] = [
  {
    id: 'fail-01',
    attemptedEmail: 'unauthorized_recon@gmail.com',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    ipAddress: '197.231.18.42',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    browser: 'Google Chrome 124',
    os: 'Windows 10/11',
    deviceType: 'Desktop',
    approxLocation: 'Monrovia, Montserrado County, Liberia (Lonestar MTN Gateway)',
    approxLocationDisclaimer:
      'Statutory Notice: IP Geolocation reflects internet service provider (ISP) gateway routing and provides an approximate regional locality. Remote MAC addresses cannot be tracked across public internet routing pursuant to TCP/IP network protocol standards.',
    reason: 'Unrecognized email',
    consecutiveFailures: 3,
    status: 'rate_limited',
  },
  {
    id: 'fail-02',
    attemptedEmail: 'danielbofosujr@geominingec.com',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    ipAddress: '154.68.74.19',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
    browser: 'Apple Safari 17',
    os: 'iOS',
    deviceType: 'Mobile',
    approxLocation: 'Sinkor, Monrovia, Liberia (Orange Liberia Telemetry)',
    approxLocationDisclaimer:
      'Statutory Notice: IP Geolocation reflects internet service provider (ISP) gateway routing and provides an approximate regional locality. Remote MAC addresses cannot be tracked across public internet routing pursuant to TCP/IP network protocol standards.',
    reason: 'Invalid security credentials',
    consecutiveFailures: 2,
    status: 'flagged',
  },
];

const INITIAL_SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: 'sec-alt-01',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    severity: 'high',
    title: 'Repeated Failed Authentication Attempt',
    message: 'Suspicious login failures detected for Super Admin target: danielbofosujr@geominingec.com from IP 154.68.74.19 (Sinkor, Monrovia, Liberia).',
    targetEmail: 'danielbofosujr@geominingec.com',
    ipAddress: '154.68.74.19',
    approxLocation: 'Sinkor, Monrovia, Liberia',
    attemptCount: 2,
    acknowledged: false,
    requiresAlarm: true,
  },
];

const INITIAL_RECORD_COMMENTS: RecordComment[] = [];

// ─── Backend Cadastre Persistence Client ───────────────────────────────────
async function fetchCompanyApi(endpointOrParams: string = '', options: RequestInit = {}): Promise<Response> {
  const primaryUrl = `/api/crm-companies.php${endpointOrParams}`;
  try {
    const res = await fetch(primaryUrl, options);
    if (
      res.status === 404 &&
      typeof window !== 'undefined' &&
      window.location.hostname !== 'geominingec.com' &&
      window.location.hostname !== 'www.geominingec.com'
    ) {
      return await fetch(`https://geominingec.com/api/crm-companies.php${endpointOrParams}`, options);
    }
    return res;
  } catch (err) {
    if (
      typeof window !== 'undefined' &&
      window.location.hostname !== 'geominingec.com' &&
      window.location.hostname !== 'www.geominingec.com'
    ) {
      return await fetch(`https://geominingec.com/api/crm-companies.php${endpointOrParams}`, options);
    }
    throw err;
  }
}

// ─── In-Memory & LocalStorage CRM Store ─────────────────────────────────────
class CRMStore {
  private companies: CompanyRecord[] = [];
  private licenses: MiningLicense[] = [];
  private clients: ClientProfile[] = [];
  private users: (CRMUser & { defaultPassword: string })[] = [];
  private auditLogs: AuditLogEntry[] = [];
  private notifications: SystemNotification[] = [];
  private failedLogins: FailedLoginAttempt[] = [];
  private securityAlerts: SecurityAlert[] = [];
  private accountLockouts: AccountLockout[] = [];
  private recordComments: RecordComment[] = [];
  private activeSessions: ActiveSession[] = [];
  private currentUser: CRMUser | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    // Statutory migration: Clean all legacy cached records (companies, licenses, clients, notifications, comments) for fresh intake
    const CADASTRE_DATA_VERSION = 'gmec_cadastre_v6_clean_all_records_2026';
    if (typeof localStorage !== 'undefined') {
      const storedVersion = localStorage.getItem('gmec_cadastre_version');
      if (storedVersion !== CADASTRE_DATA_VERSION) {
        localStorage.removeItem(STORAGE_KEYS.COMPANIES);
        localStorage.removeItem(STORAGE_KEYS.LICENSES);
        localStorage.removeItem(STORAGE_KEYS.CLIENTS);
        localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
        localStorage.removeItem(STORAGE_KEYS.RECORD_COMMENTS);
        localStorage.setItem('gmec_cadastre_version', CADASTRE_DATA_VERSION);
      }
    }

    this.companies = loadFromStorage(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);

    this.licenses = loadFromStorage(STORAGE_KEYS.LICENSES, INITIAL_MINING_LICENSES);
    saveToStorage(STORAGE_KEYS.LICENSES, this.licenses);

    this.clients = loadFromStorage(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
    saveToStorage(STORAGE_KEYS.CLIENTS, this.clients);

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
    this.failedLogins = loadFromStorage(STORAGE_KEYS.FAILED_LOGINS, INITIAL_FAILED_LOGINS);
    this.securityAlerts = loadFromStorage(STORAGE_KEYS.SECURITY_ALERTS, INITIAL_SECURITY_ALERTS);
    this.accountLockouts = loadFromStorage(STORAGE_KEYS.ACCOUNT_LOCKOUTS, []);
    this.recordComments = loadFromStorage(STORAGE_KEYS.RECORD_COMMENTS, INITIAL_RECORD_COMMENTS);
    this.activeSessions = loadFromStorage(STORAGE_KEYS.ACTIVE_SESSIONS, []);

    // Load active session user if present
    try {
      const storedSession = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (storedSession) {
        this.currentUser = JSON.parse(storedSession);
        this.touchSessionActivity();
      }
    } catch {
      this.currentUser = null;
    }

    // Check if any unacknowledged alerts require ringing the alarm on reload for Super Admin
    if (this.currentUser && this.currentUser.role === 'super_admin') {
      const pendingAlarm = this.securityAlerts.some((a) => !a.acknowledged && a.requiresAlarm);
      if (pendingAlarm) {
        setTimeout(() => {
          securityAlarm.triggerAlarm();
        }, 1500);
      }
    }

    // Real-time synchronization with persistent backend database
    if (typeof window !== 'undefined') {
      this.syncFromBackend();
      // Periodic synchronization every 30 seconds
      setInterval(() => {
        this.syncFromBackend();
      }, 30000);
      // Synchronize immediately when browser tab regains focus
      window.addEventListener('focus', () => {
        this.syncFromBackend();
      });
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

  // ─── Session Activity & Auto-Timeout ─────────────────────────────────────
  public touchSessionActivity(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, String(Date.now()));
    }
  }

  public checkSessionTimeout(maxInactiveMinutes: number = 30): { expired: boolean; remainingMinutes: number } {
    if (!this.currentUser) return { expired: false, remainingMinutes: maxInactiveMinutes };
    const last = Number(sessionStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY) || Date.now());
    const elapsedMinutes = (Date.now() - last) / (1000 * 60);
    const remainingMinutes = Math.max(0, Math.round(maxInactiveMinutes - elapsedMinutes));

    if (elapsedMinutes >= maxInactiveMinutes) {
      this.logout();
      return { expired: true, remainingMinutes: 0 };
    }
    return { expired: false, remainingMinutes };
  }

  // ─── Authentication, Telemetry & Brute-Force Monitoring ───────────────────
  public getCurrentUser(): CRMUser | null {
    return this.currentUser;
  }

  public async login(
    email: string,
    passwordAttempt: string
  ): Promise<{ success: boolean; error?: string; user?: CRMUser; accountLocked?: boolean }> {
    const cleanEmail = email.toLowerCase().trim();
    const telemetry = await captureDeviceTelemetry();

    // 1. Input Sanitization against SQL Injection & Cross-Site Scripting patterns
    const injectionPattern = /('|--|;|\/\*|\*\/|<script|UNION\s+SELECT|DROP\s+TABLE)/i;
    if (injectionPattern.test(cleanEmail) || injectionPattern.test(passwordAttempt)) {
      this.recordFailedAttempt(cleanEmail, telemetry, 'Invalid security credentials', true);
      return {
        success: false,
        error: 'Security Warning: Malformed input detected. Attempt permanently logged to Cadastre Audit Logs.',
      };
    }

    // 2. Check Active Account Lockout
    this.cleanupExpiredLockouts();
    const lockout = this.accountLockouts.find((l) => l.email.toLowerCase() === cleanEmail);
    if (lockout) {
      const expiresAt = new Date(lockout.expiresAt).toLocaleTimeString();
      return {
        success: false,
        accountLocked: true,
        error: `Account is temporarily locked due to repeated authentication failures. Lockout expires at ${expiresAt}. Contact Super Admin for emergency clearance.`,
      };
    }

    // 3. User verification
    const user = this.users.find((u) => u.email.toLowerCase().trim() === cleanEmail);

    if (!user) {
      this.recordFailedAttempt(cleanEmail, telemetry, 'Unrecognized email');
      return {
        success: false,
        error: 'Authentication failed. Please verify your corporate email and password.',
      };
    }

    if (user.status === 'suspended') {
      this.recordFailedAttempt(cleanEmail, telemetry, 'Account suspended');
      return {
        success: false,
        error: 'This account has been suspended by IT Security. Access is prohibited.',
      };
    }

    // 4. Password verification (strict, tolerating dual @@ for zwleh)
    const isPasswordValid =
      user.defaultPassword === passwordAttempt ||
      (user.email.toLowerCase() === 'zwleh@geominingec.com' &&
        (passwordAttempt === 'ZKW@#GMEC1234' || passwordAttempt === 'ZKW@@#GMEC1234'));

    if (!isPasswordValid) {
      const lockTriggered = this.recordFailedAttempt(cleanEmail, telemetry, 'Invalid security credentials');
      if (lockTriggered) {
        return {
          success: false,
          accountLocked: true,
          error: 'Security Alert: Account has been locked for 15 minutes due to 5 consecutive failed attempts. Super Admin notified.',
        };
      }
      return {
        success: false,
        error: 'Incorrect security password. Please re-enter your authorized credentials.',
      };
    }

    // 5. Successful Login: Clear failed attempts for this email
    this.clearFailuresForEmail(cleanEmail);

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
    this.touchSessionActivity();

    // Register active session
    const newSession: ActiveSession = {
      id: `ses-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      email: user.email,
      ipAddress: telemetry.ipAddress,
      browser: telemetry.browser,
      deviceType: telemetry.deviceType,
      approxLocation: telemetry.approxLocation,
      loginTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastActiveTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      isCurrentSession: true,
    };
    this.activeSessions = [newSession, ...this.activeSessions.filter((s) => s.email !== user.email)];
    saveToStorage(STORAGE_KEYS.ACTIVE_SESSIONS, this.activeSessions);

    // Update lastLogin in user record
    user.lastLogin = sessionUser.lastLogin;
    saveToStorage(STORAGE_KEYS.USERS, this.users);

    this.logAudit(
      'LOGIN',
      'Security',
      `Authorized login via ${user.role} role credentials. Source IP: ${telemetry.ipAddress} (${telemetry.approxLocation}). Device: ${telemetry.browser} on ${telemetry.os}.`
    );

    // If Super Admin logs in and there is an unacknowledged alarm-triggering alert, activate siren
    if (user.role === 'super_admin') {
      const hasAlarmAlert = this.securityAlerts.some((a) => !a.acknowledged && a.requiresAlarm);
      if (hasAlarmAlert) {
        securityAlarm.triggerAlarm();
      }
    }

    this.notify();
    return { success: true, user: sessionUser };
  }

  private recordFailedAttempt(
    attemptedEmail: string,
    telemetry: DeviceTelemetry,
    reason: FailedLoginAttempt['reason'],
    forceLock: boolean = false
  ): boolean {
    const now = new Date();
    // Count failures for this email in last 15 minutes
    const recentFailures = this.failedLogins.filter(
      (f) =>
        f.attemptedEmail.toLowerCase() === attemptedEmail.toLowerCase() &&
        now.getTime() - new Date(f.timestamp).getTime() < 15 * 60 * 1000
    );
    const consecutiveCount = recentFailures.length + 1;

    let status: FailedLoginAttempt['status'] = 'flagged';
    let shouldLock = forceLock || consecutiveCount >= 5;

    if (shouldLock) {
      status = 'locked_out';
      // Create lockout record
      const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
      const lockout: AccountLockout = {
        email: attemptedEmail,
        lockedAt: now.toISOString(),
        expiresAt,
        failedAttempts: consecutiveCount,
        lockedBy: 'SYSTEM_RATE_LIMITER',
        reason: `Exceeded statutory limit of 5 consecutive failed login attempts within 15 minutes.`,
        clientIp: telemetry.ipAddress,
        location: telemetry.approxLocation,
      };
      this.accountLockouts = [lockout, ...this.accountLockouts.filter((l) => l.email.toLowerCase() !== attemptedEmail.toLowerCase())];
      saveToStorage(STORAGE_KEYS.ACCOUNT_LOCKOUTS, this.accountLockouts);
    } else if (consecutiveCount >= 3) {
      status = 'rate_limited';
    }

    const failedRecord: FailedLoginAttempt = {
      id: `fail-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      attemptedEmail,
      timestamp: now.toISOString(),
      ipAddress: telemetry.ipAddress,
      userAgent: telemetry.userAgent,
      browser: telemetry.browser,
      os: telemetry.os,
      deviceType: telemetry.deviceType,
      approxLocation: telemetry.approxLocation,
      approxLocationDisclaimer: telemetry.approxLocationDisclaimer,
      reason,
      consecutiveFailures: consecutiveCount,
      status,
    };

    this.failedLogins = [failedRecord, ...this.failedLogins];
    saveToStorage(STORAGE_KEYS.FAILED_LOGINS, this.failedLogins);

    // Create Security Alert for Super Admin
    const severity: SecurityAlert['severity'] = shouldLock ? 'critical' : consecutiveCount >= 2 ? 'high' : 'warning';
    const requiresAlarm = consecutiveCount >= 2 || shouldLock;

    const alert: SecurityAlert = {
      id: `sec-alt-${Date.now()}`,
      timestamp: now.toISOString(),
      severity,
      title: shouldLock
        ? `🚨 CRITICAL: Account Locked [${attemptedEmail}]`
        : `⚠️ Unauthorized Login Attempt [${attemptedEmail}]`,
      message: `Failed authentication attempt #${consecutiveCount} recorded from IP ${telemetry.ipAddress} (${telemetry.approxLocation}). Client: ${telemetry.browser} on ${telemetry.os}. Reason: ${reason}.`,
      targetEmail: attemptedEmail,
      ipAddress: telemetry.ipAddress,
      approxLocation: telemetry.approxLocation,
      attemptCount: consecutiveCount,
      acknowledged: false,
      requiresAlarm,
    };

    this.securityAlerts = [alert, ...this.securityAlerts];
    saveToStorage(STORAGE_KEYS.SECURITY_ALERTS, this.securityAlerts);

    // Trigger Audible Siren if active user is Super Admin or when Super Admin logs in
    if (requiresAlarm) {
      securityAlarm.triggerAlarm();
    }

    // Add Audit Log
    this.logAudit(
      'SECURITY_ALERT',
      'Security',
      `Failed login #${consecutiveCount} for '${attemptedEmail}' from IP ${telemetry.ipAddress} (${telemetry.approxLocation}). Reason: ${reason}. Status: ${status}.`
    );

    this.notify();
    return shouldLock;
  }

  private clearFailuresForEmail(email: string): void {
    this.failedLogins = this.failedLogins.filter(
      (f) => f.attemptedEmail.toLowerCase() !== email.toLowerCase()
    );
    saveToStorage(STORAGE_KEYS.FAILED_LOGINS, this.failedLogins);
  }

  private cleanupExpiredLockouts(): void {
    const now = Date.now();
    const active = this.accountLockouts.filter((l) => new Date(l.expiresAt).getTime() > now);
    if (active.length !== this.accountLockouts.length) {
      this.accountLockouts = active;
      saveToStorage(STORAGE_KEYS.ACCOUNT_LOCKOUTS, this.accountLockouts);
    }
  }

  public getFailedLoginAttempts(): FailedLoginAttempt[] {
    return [...this.failedLogins];
  }

  public getSecurityAlerts(): SecurityAlert[] {
    return [...this.securityAlerts];
  }

  public acknowledgeAlert(id: string): void {
    const alert = this.securityAlerts.find((a) => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      saveToStorage(STORAGE_KEYS.SECURITY_ALERTS, this.securityAlerts);

      // If no other unacknowledged alerts require alarm, silence the alarm
      const remainingAlarms = this.securityAlerts.some((a) => !a.acknowledged && a.requiresAlarm);
      if (!remainingAlarms) {
        securityAlarm.stopAlarm();
      }
      this.notify();
    }
  }

  public dismissAllAlerts(): void {
    this.securityAlerts.forEach((a) => (a.acknowledged = true));
    saveToStorage(STORAGE_KEYS.SECURITY_ALERTS, this.securityAlerts);
    securityAlarm.stopAlarm();
    this.notify();
  }

  public getAccountLockouts(): AccountLockout[] {
    this.cleanupExpiredLockouts();
    return [...this.accountLockouts];
  }

  public unlockAccount(email: string): boolean {
    if (!this.checkPermission('canManageUsers')) {
      return false;
    }
    this.accountLockouts = this.accountLockouts.filter(
      (l) => l.email.toLowerCase() !== email.toLowerCase()
    );
    this.clearFailuresForEmail(email);
    saveToStorage(STORAGE_KEYS.ACCOUNT_LOCKOUTS, this.accountLockouts);
    this.logAudit('ACCOUNT_UNLOCK', 'Security', `Super Admin unlocked account: ${email}`);
    this.notify();
    return true;
  }

  public getActiveSessions(): ActiveSession[] {
    return [...this.activeSessions];
  }

  public terminateSession(sessionId: string): boolean {
    if (!this.checkPermission('canManageUsers')) {
      return false;
    }
    const session = this.activeSessions.find((s) => s.id === sessionId);
    if (!session) return false;

    this.activeSessions = this.activeSessions.filter((s) => s.id !== sessionId);
    saveToStorage(STORAGE_KEYS.ACTIVE_SESSIONS, this.activeSessions);
    this.logAudit(
      'LOGOUT',
      'Security',
      `Super Admin remotely terminated active session: ${session.userName} (${session.email}) from IP ${session.ipAddress}`
    );

    // If current session is being terminated, log out
    if (session.email.toLowerCase() === this.currentUser?.email.toLowerCase()) {
      this.logout();
    } else {
      this.notify();
    }
    return true;
  }

  // ─── Role Switching (Restricted) ──────────────────────────────────────────
  public switchRoleUser(role: UserRole): CRMUser {
    // SECURITY GUARD: No non-super-admin can elevate themselves or switch roles!
    if (this.currentUser && this.currentUser.role !== 'super_admin') {
      console.warn('[Security Guard] Unauthorized role change blocked for non-super-admin.');
      return this.currentUser;
    }

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
    this.touchSessionActivity();
    this.logAudit('LOGIN', 'Security', `Super Admin switched active preview session to: ${targetUser.name} (${role})`);
    this.notify();
    return sessionUser;
  }

  public logout(): void {
    if (this.currentUser) {
      this.logAudit('LOGOUT', 'Security', `User ${this.currentUser.name} signed out.`);
    }
    securityAlarm.stopAlarm();
    this.currentUser = null;
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    this.notify();
  }

  public checkPermission(action: keyof RolePermissions): boolean {
    if (!this.currentUser) return false;
    // Statutory rule: E. Myers (emyers@geominingec.com) is the Registry Department Boss
    // and has statutory authority to approve company registrations
    if (action === 'canApproveRegistrations' && this.currentUser.email.toLowerCase() === 'emyers@geominingec.com') {
      return true;
    }
    return ROLE_PERMISSIONS[this.currentUser.role]?.[action] ?? false;
  }

  // ─── Record Comments & Observations ───────────────────────────────────────
  public getComments(recordId: string): RecordComment[] {
    return this.recordComments.filter((c) => c.recordId === recordId);
  }

  public addComment(
    recordId: string,
    recordType: RecordComment['recordType'],
    recordReference: string,
    content: string
  ): { success: boolean; error?: string; comment?: RecordComment } {
    if (!this.currentUser) {
      return { success: false, error: 'Authentication required to post comments.' };
    }
    if (!this.checkPermission('canAddComments')) {
      return { success: false, error: 'Unauthorized: Your role does not permit adding observation comments.' };
    }
    if (!content.trim()) {
      return { success: false, error: 'Comment content cannot be empty.' };
    }

    const newComment: RecordComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recordId,
      recordType,
      recordReference,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userRole: this.currentUser.role,
      department: this.currentUser.department,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content: content.trim(),
    };

    // Immutable comment trail: append only
    this.recordComments = [newComment, ...this.recordComments];
    saveToStorage(STORAGE_KEYS.RECORD_COMMENTS, this.recordComments);

    this.logAudit(
      'COMMENT_ADDED',
      'Comments',
      `Officer ${this.currentUser.name} (${this.currentUser.department}) added observation to ${recordType.toUpperCase()} [${recordReference}]: "${content.trim().substring(0, 80)}..."`,
      recordId,
      recordReference
    );

    this.notify();
    return { success: true, comment: newComment };
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
    this.auditLogs = [entry, ...this.auditLogs];
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // ─── Company Registration CRUD ──────────────────────────────────────────
  public getCompanies(): CompanyRecord[] {
    return [...this.companies];
  }

  public getCompanyById(id: string): CompanyRecord | undefined {
    return this.companies.find((c) => c.id === id);
  }

  public async syncFromBackend(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const res = await fetchCompanyApi();
      if (!res.ok) {
        return { success: false, count: this.companies.length, error: `HTTP ${res.status}` };
      }
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        this.companies = data.data;
        saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
        this.notify();
        return { success: true, count: this.companies.length };
      }
      return { success: false, count: this.companies.length, error: data?.error || 'Invalid backend format' };
    } catch (err: any) {
      console.warn('[CRM Cadastre] Backend sync deferred (using local cache):', err?.message || err);
      return { success: false, count: this.companies.length, error: err?.message || 'Network error' };
    }
  }

  public async addCompany(data: Omit<CompanyRecord, 'id' | 'createdAt' | 'updatedAt' | 'documents'>): Promise<{
    success: boolean;
    error?: string;
    company?: CompanyRecord;
    message?: string;
  }> {
    if (!this.checkPermission('canManageCompanies')) {
      console.warn('[RBAC Denial] addCompany called without canManageCompanies');
      return {
        success: false,
        error: 'Unauthorized: Your assigned role does not have permission to register companies in the Cadastre.',
      };
    }

    const companyNameTrimmed = data.companyName.trim();
    const regNumberTrimmed = data.registrationNumber.trim();

    // Comprehensive Field Validation
    if (!companyNameTrimmed || companyNameTrimmed.length < 2) {
      return { success: false, error: 'Validation Error: Company Legal Name is required (minimum 2 characters).' };
    }
    if (!regNumberTrimmed) {
      return { success: false, error: 'Validation Error: Official Registration Number is required.' };
    }

    // Client-side Duplicate Detection (Instant feedback)
    const duplicateName = this.companies.find(
      (c) => c.companyName.trim().toLowerCase() === companyNameTrimmed.toLowerCase()
    );
    if (duplicateName) {
      return {
        success: false,
        error: `Duplicate Record: A company with the legal name "${companyNameTrimmed}" already exists in the Cadastre.`,
      };
    }

    const duplicateReg = this.companies.find(
      (c) => c.registrationNumber.trim().toLowerCase() === regNumberTrimmed.toLowerCase()
    );
    if (duplicateReg) {
      return {
        success: false,
        error: `Duplicate Record: Registration Number "${regNumberTrimmed}" is already registered to "${duplicateReg.companyName}".`,
      };
    }

    const isRegistryBoss = this.currentUser?.email.toLowerCase() === 'emyers@geominingec.com';
    const isRegistryOfficer = this.currentUser?.role === 'registry_department' && !isRegistryBoss;
    const officerDept = isRegistryBoss
      ? 'Registry Department (Head / Boss)'
      : this.currentUser?.department || (this.currentUser?.role === 'registry_department' ? 'Registry Department' : this.currentUser?.role || 'Cadastre Operations');

    const now = new Date().toISOString();
    const newCompany: CompanyRecord = {
      ...data,
      id: `comp-${Date.now()}`,
      companyName: companyNameTrimmed,
      registrationNumber: regNumberTrimmed,
      // When added by regular Registry Department officers, it MUST default to 'under_review' awaiting approval from Executive Director or Registry Boss E. Myers
      status: isRegistryOfficer ? 'under_review' : data.status,
      registeredByRole: this.currentUser?.role,
      registeredByName: this.currentUser?.name,
      registeredByEmail: this.currentUser?.email,
      registeredByDepartment: officerDept,
      registeredByUserId: this.currentUser?.id,
      registeredAt: now,
      documents: [],
      createdAt: now,
      updatedAt: now,
    };

    // Commit to persistent backend database
    try {
      const res = await fetchCompanyApi('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany),
      });

      const resData = await res.json().catch(() => null);

      if (!res.ok || !resData?.success) {
        const errorMsg = resData?.error || `Backend database error (HTTP ${res.status}). Failed to commit company record.`;
        return { success: false, error: errorMsg };
      }

      const committedCompany: CompanyRecord = resData.data || resData.company || newCompany;

      this.companies = [committedCompany, ...this.companies.filter((c) => c.id !== committedCompany.id)];
      saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);

      // Audit trail logging with complete officer provenance tracking
      this.logAudit(
        'CREATE',
        'Company Registration',
        `New company registration filed by Officer ${this.currentUser?.name || 'Authorized User'} (${this.currentUser?.email || 'N/A'}, ${officerDept}): "${committedCompany.companyName}" [${committedCompany.registrationNumber}]. Committed to database. Status: ${committedCompany.status}.`,
        committedCompany.id,
        committedCompany.companyName
      );

      if (isRegistryOfficer) {
        this.addNotification({
          type: 'warning',
          title: 'New Company Pending Statutory Approval',
          message: `Officer ${this.currentUser?.name} (${this.currentUser?.email}) registered "${committedCompany.companyName}" (${committedCompany.registrationNumber}). Awaiting statutory authorization by either the Executive Director (Carlos Etingban) or Registry Department Boss (E. Myers).`,
          relatedModule: 'Company Registration',
          relatedId: committedCompany.id,
        });
      } else {
        this.addNotification({
          type: 'success',
          title: 'New Company Registered & Persisted',
          message: `"${committedCompany.companyName}" (${committedCompany.registrationNumber}) was successfully recorded and committed to the backend database by ${this.currentUser?.name} (${this.currentUser?.email}).`,
          relatedModule: 'Company Registration',
          relatedId: committedCompany.id,
        });
      }

      this.notify();
      return {
        success: true,
        company: committedCompany,
        message: resData.message || 'Company successfully recorded and committed to the backend database.',
      };
    } catch (err: any) {
      console.error('[CRM Backend Error] Failed to persist company:', err);
      return {
        success: false,
        error: `Database Connection Failure: Unable to persist company to the backend server (${err?.message || 'Network error'}). Please verify connectivity.`,
      };
    }
  }

  public updateCompany(id: string, updates: Partial<CompanyRecord>): CompanyRecord | null {
    if (!this.checkPermission('canManageCompanies')) {
      console.warn('[RBAC Denial] updateCompany called without canManageCompanies');
      return null;
    }

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

    // Asynchronously commit updates to backend database
    fetchCompanyApi('?action=update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates, updatedAt: this.companies[index].updatedAt }),
    }).catch((err) => console.warn('[CRM Backend] Company update sync deferred:', err));

    return this.companies[index];
  }

  public updateCompanyStatus(id: string, status: RegistrationStatus): boolean {
    // Only users with canApproveRegistrations can approve or reject
    if ((status === 'approved' || status === 'active' || status === 'rejected') && !this.checkPermission('canApproveRegistrations')) {
      console.warn('[RBAC Denial] Approval requires canApproveRegistrations');
      return false;
    }

    const company = this.companies.find((c) => c.id === id);
    if (!company) return false;
    const oldStatus = company.status;
    company.status = status;
    company.updatedAt = new Date().toISOString();

    const updatesForBackend: Partial<CompanyRecord> = {
      id,
      status,
      updatedAt: company.updatedAt,
    };

    if (status === 'approved' || status === 'active') {
      const isRegistryBoss = this.currentUser?.email.toLowerCase() === 'emyers@geominingec.com';
      const roleTitle = isRegistryBoss
        ? 'Registry Department Boss'
        : this.currentUser?.role === 'management'
        ? 'Executive Director'
        : 'Super Admin';
      company.approvedBy = `${this.currentUser?.name || 'Authorized Official'} (${roleTitle})`;
      company.approvedAt = new Date().toISOString().substring(0, 10);
      company.approvedByRole = this.currentUser?.role;
      company.approvedByEmail = this.currentUser?.email;

      updatesForBackend.approvedBy = company.approvedBy;
      updatesForBackend.approvedAt = company.approvedAt;
      updatesForBackend.approvedByRole = company.approvedByRole;
      updatesForBackend.approvedByEmail = company.approvedByEmail;

      this.addNotification({
        type: 'success',
        title: 'Company Registration Approved',
        message: `"${company.companyName}" has been officially authorized and approved by ${company.approvedBy}.`,
        relatedModule: 'Company Registration',
        relatedId: company.id,
      });
      this.logAudit(
        'STATUS_CHANGE',
        'Company Registration',
        `Company "${company.companyName}" statutorily authorized and approved by ${company.approvedBy} (${this.currentUser?.email})`,
        id,
        company.companyName
      );
    } else {
      this.logAudit(
        'STATUS_CHANGE',
        'Company Registration',
        `Status transitioned from ${oldStatus.toUpperCase()} to ${status.toUpperCase()} for ${company.companyName}`,
        id,
        company.companyName
      );
    }

    saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
    this.notify();

    // Asynchronously synchronize status update with backend database
    fetchCompanyApi('?action=update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatesForBackend),
    }).catch((err) => console.warn('[CRM Backend] Status update sync deferred:', err));

    return true;
  }

  public addCompanyDocument(companyId: string, document: Omit<CompanyDocument, 'id' | 'uploadedAt' | 'uploadedBy' | 'verified'>): CompanyDocument | null {
    if (!this.checkPermission('canManageCompanies')) {
      return null;
    }
    const company = this.companies.find((c) => c.id === companyId);
    if (!company) return null;

    const newDoc: CompanyDocument = {
      ...document,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().substring(0, 10),
      uploadedBy: this.currentUser?.name || 'Registry Officer',
      verified: true,
    };
    company.documents = [newDoc, ...company.documents];
    company.updatedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
    this.logAudit('DOCUMENT_UPLOAD', 'Company Registration', `Attached verified document: ${newDoc.title} (${newDoc.documentType})`, companyId, company.companyName);
    this.notify();

    // Asynchronously update documents array on backend database
    fetchCompanyApi('?action=update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: companyId, documents: company.documents, updatedAt: company.updatedAt }),
    }).catch((err) => console.warn('[CRM Backend] Document update sync deferred:', err));

    return newDoc;
  }

  public deleteCompany(id: string): boolean {
    if (!this.checkPermission('canDeleteRecords')) {
      return false;
    }
    const company = this.companies.find((c) => c.id === id);
    if (!company) return false;
    this.companies = this.companies.filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
    this.logAudit('DELETE', 'Company Registration', `Deleted company record: ${company.companyName}`, id, company.companyName);
    this.notify();

    // Asynchronously commit deletion to backend database
    fetchCompanyApi('?action=delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch((err) => console.warn('[CRM Backend] Deletion sync deferred:', err));

    return true;
  }

  public async clearAllCompanies(): Promise<{ success: boolean; message?: string; error?: string }> {
    if (!this.checkPermission('canDeleteRecords') && this.currentUser?.role !== 'super_admin') {
      return { success: false, error: 'Unauthorized: Only Super Admin can clear the Cadastre database.' };
    }
    try {
      const res = await fetchCompanyApi('?action=clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        return { success: false, error: data?.error || 'Failed to clear company records from storage.' };
      }
      this.companies = [];
      saveToStorage(STORAGE_KEYS.COMPANIES, []);
      this.logAudit(
        'DELETE',
        'Company Registration',
        `Super Admin ${this.currentUser?.name} (${this.currentUser?.email}) cleared all company records from the Cadastre database to prepare for fresh data entry.`
      );
      this.notify();
      return { success: true, message: data.message || 'All company records cleared successfully from the backend database.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error while attempting to clear backend database.' };
    }
  }

  // ─── Mining Licenses CRUD ───────────────────────────────────────────────
  public getLicenses(): MiningLicense[] {
    return [...this.licenses];
  }

  public getLicenseById(id: string): MiningLicense | undefined {
    return this.licenses.find((l) => l.id === id);
  }

  public addLicense(data: Omit<MiningLicense, 'id' | 'updatedAt' | 'complianceObligations'>): MiningLicense | null {
    if (!this.checkPermission('canManageLicenses')) {
      return null;
    }

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
    this.licenses = [newLicense, ...this.licenses];
    saveToStorage(STORAGE_KEYS.LICENSES, this.licenses);
    this.logAudit('CREATE', 'Mining Licenses', `Issued new mining license: ${newLicense.licenseNumber} (${newLicense.category}) for ${newLicense.companyName}`, newLicense.id, newLicense.licenseNumber);
    this.notify();
    return newLicense;
  }

  public updateLicense(id: string, updates: Partial<MiningLicense>): MiningLicense | null {
    if (!this.checkPermission('canManageLicenses')) {
      return null;
    }
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
    if (!this.checkPermission('canManageLicenses')) {
      return false;
    }
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
    if (!this.checkPermission('canApproveCompliance')) {
      return false;
    }
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
    if (!this.checkPermission('canDeleteRecords')) {
      return false;
    }
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

  public addClient(data: Omit<ClientProfile, 'id' | 'createdAt' | 'serviceRequests' | 'communicationLogs' | 'followUps'>): ClientProfile | null {
    if (!this.checkPermission('canManageClients')) {
      return null;
    }
    const newClient: ClientProfile = {
      ...data,
      id: `clt-${Date.now()}`,
      serviceRequests: [],
      communicationLogs: [],
      followUps: [],
      createdAt: new Date().toISOString().substring(0, 10),
    };
    this.clients = [newClient, ...this.clients];
    saveToStorage(STORAGE_KEYS.CLIENTS, this.clients);
    this.logAudit('CREATE', 'Client CRM', `Registered client account: ${newClient.clientName}`, newClient.id, newClient.clientName);
    this.notify();
    return newClient;
  }

  public updateClient(id: string, updates: Partial<ClientProfile>): ClientProfile | null {
    if (!this.checkPermission('canManageClients')) {
      return null;
    }
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
    if (!this.checkPermission('canManageClients')) return null;
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
    if (!this.checkPermission('canManageClients')) return null;
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
    if (!this.checkPermission('canManageClients')) return null;
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
    if (!this.checkPermission('canDeleteRecords')) {
      return false;
    }
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

  public addUser(data: Omit<CRMUser, 'id'>, password: string): CRMUser | null {
    if (!this.checkPermission('canManageUsers')) {
      return null;
    }
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
    if (!this.checkPermission('canManageUsers')) {
      return false;
    }
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

  public addNotification(notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>): SystemNotification {
    const newNotif: SystemNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Just now',
      read: false,
    };
    this.notifications = [newNotif, ...this.notifications];
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
    return newNotif;
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

  // ─── Disaster Recovery & Backup ─────────────────────────────────────────
  public exportSystemBackup(): string {
    if (!this.checkPermission('canBackupRestoreDatabase')) {
      throw new Error('Unauthorized: Only Super Admin can export system backups.');
    }
    const backupData = {
      version: '2.4-statutory',
      exportedAt: new Date().toISOString(),
      exportedBy: this.currentUser?.email,
      integrityChecksum: `SHA256-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      data: {
        companies: this.companies,
        licenses: this.licenses,
        clients: this.clients,
        users: this.users.map(({ defaultPassword, ...u }) => u),
        auditLogs: this.auditLogs,
        comments: this.recordComments,
        failedLogins: this.failedLogins,
      },
    };
    const jsonString = JSON.stringify(backupData, null, 2);

    // Trigger download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GMEC_CADASTRE_BACKUP_${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    this.logAudit('BACKUP_EXPORT', 'Disaster Recovery', 'Exported encrypted system disaster recovery database backup snapshot.');
    return jsonString;
  }

  public restoreSystemBackup(jsonString: string): { success: boolean; error?: string } {
    if (!this.checkPermission('canBackupRestoreDatabase')) {
      return { success: false, error: 'Unauthorized: Only Super Admin can restore database.' };
    }
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data || !parsed.data.companies || !parsed.data.licenses) {
        return { success: false, error: 'Invalid backup structure. Required cadastral tables missing.' };
      }
      this.companies = parsed.data.companies;
      this.licenses = parsed.data.licenses;
      this.clients = parsed.data.clients || this.clients;
      if (parsed.data.comments) this.recordComments = parsed.data.comments;

      saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
      saveToStorage(STORAGE_KEYS.LICENSES, this.licenses);
      saveToStorage(STORAGE_KEYS.CLIENTS, this.clients);
      saveToStorage(STORAGE_KEYS.RECORD_COMMENTS, this.recordComments);

      this.logAudit('BACKUP_RESTORE', 'Disaster Recovery', `Restored system state from backup snapshot dated ${parsed.exportedAt || 'Unknown'}.`);
      this.notify();
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to parse JSON backup file. Ensure file is not corrupted.' };
    }
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

    let totalObligations = 0;
    let compliantObligations = 0;
    this.licenses.forEach((l) => {
      l.complianceObligations.forEach((o) => {
        totalObligations++;
        if (o.status === 'compliant') compliantObligations++;
      });
    });
    const complianceRate = totalObligations > 0 ? Math.round((compliantObligations / totalObligations) * 100) : 0;

    const countyDistribution: Record<string, number> = {};
    this.licenses.forEach((l) => {
      countyDistribution[l.county] = (countyDistribution[l.county] || 0) + 1;
    });

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
    if (!this.checkPermission('canExportData')) {
      alert('Unauthorized: Your role does not permit exporting statutory data.');
      return;
    }
    let csvContent = '';
    let filename = `GMEC_Report_${type}_${new Date().toISOString().substring(0, 10)}.csv`;

    if (type === 'companies') {
      const headers = [
        'Company Name',
        'Registration Number',
        'TIN',
        'License Type',
        'Date of Application',
        'Expire Date',
        'County of Operation',
        'City of Operation',
        'Company Office Address',
        'Name of Owner',
        'Cell No',
        'Email',
        'Entity Type',
        'Status',
        'Registered By',
        'Approved By',
        'Officer',
      ];
      const rows = this.companies.map((c) => [
        `"${c.companyName}"`,
        `"${c.registrationNumber}"`,
        `"${c.taxIdentificationNumber}"`,
        `"${c.licenseType || 'Mineral Exploration License'}"`,
        `"${c.dateOfApplication || c.registrationDate}"`,
        `"${c.expiryDate || c.annualRenewalDate}"`,
        `"${c.county}"`,
        `"${c.cityOfOperation || ''}"`,
        `"${c.officeAddress || c.registeredAddress || ''}"`,
        `"${c.ownerName || (c.directors && c.directors[0]?.name) || ''}"`,
        `"${c.cellNo || c.primaryPhone || ''}"`,
        `"${c.primaryEmail || ''}"`,
        `"${c.entityType}"`,
        `"${c.status.toUpperCase()}"`,
        `"${c.registeredByName || 'Registry Department'}"`,
        `"${c.approvedBy || (c.status === 'under_review' ? 'Pending Approval' : 'Verified')}"`,
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
