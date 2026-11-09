import {
  CRMUser,
  CompanyRecord,
  MiningLicense,
  ClientProfile,
  AuditLogEntry,
  SystemNotification,
} from '../types/crm';

// Official GMEC CRM Authorized Departmental Personnel Accounts
export const INITIAL_CRM_USERS: (CRMUser & { defaultPassword: string })[] = [
  // Super Admin Logins
  {
    id: 'usr-sa-01',
    name: 'Daniel Bofosu Jr.',
    email: 'danielbofosujr@geominingec.com',
    defaultPassword: 'DBOJ@GMEC#1234',
    role: 'super_admin',
    department: 'Super Admin / IT Infrastructure',
    phone: '+231 88 654 3210',
    status: 'active',
    lastLogin: '2026-11-08 19:40',
  },
  {
    id: 'usr-sa-02',
    name: 'Mohammed S. Kromah',
    email: 'mskromah@geominingec.com',
    defaultPassword: 'MSK@#GMEC1234',
    role: 'super_admin',
    department: 'Super Admin / Executive Directorate',
    phone: '+231 77 777 2778',
    status: 'active',
    lastLogin: '2026-11-08 19:42',
  },
  {
    id: 'usr-sa-03',
    name: 'F. Kamara',
    email: 'fkamara@geominingec.com',
    defaultPassword: 'FLK@#GMEC1234',
    role: 'super_admin',
    department: 'Super Admin / Executive Operations',
    phone: '+231 77 000 1122',
    status: 'active',
    lastLogin: '2026-11-08 19:45',
  },

  // Executive Director
  {
    id: 'usr-ed-01',
    name: 'Carlos Etingban',
    email: 'carlosetingban@geominingec.com',
    defaultPassword: 'CET@#GMEC1234',
    role: 'management',
    department: 'Executive Directorate',
    phone: '+231 77 123 4567',
    status: 'active',
    lastLogin: '2026-11-08 18:30',
  },

  // Administrator
  {
    id: 'usr-adm-01',
    name: 'Z. Teewu',
    email: 'zteewu@geominingec.com',
    defaultPassword: 'ZAT@#GMEC1234',
    role: 'administrator',
    department: 'System & Concession Administration',
    phone: '+231 88 123 7890',
    status: 'active',
    lastLogin: '2026-11-08 17:15',
  },

  // Registry Department
  {
    id: 'usr-reg-01',
    name: 'E. Myers',
    email: 'emyers@geominingec.com',
    defaultPassword: 'EMS@#GMEC1234',
    role: 'registry_department',
    department: 'Registry Department (Head / Boss)',
    phone: '+231 77 987 6543',
    status: 'active',
    lastLogin: '2026-11-08 16:20',
  },
  {
    id: 'usr-reg-02',
    name: 'C. Mulbah',
    email: 'cmulbah@geominingec.com',
    defaultPassword: 'CLM@#GMEC1234',
    role: 'registry_department',
    department: 'Registry Department',
    phone: '+231 88 456 7891',
    status: 'active',
    lastLogin: '2026-11-08 15:10',
  },
  {
    id: 'usr-reg-03',
    name: 'A. Cooper',
    email: 'acooper@geominingec.com',
    defaultPassword: 'ALC@#GMEC1234',
    role: 'registry_department',
    department: 'Registry Department',
    phone: '+231 77 345 6789',
    status: 'active',
    lastLogin: '2026-11-08 14:05',
  },
  {
    id: 'usr-reg-04',
    name: 'R. Warner',
    email: 'rwarner@geominingec.com',
    defaultPassword: 'RW@#GMEC1234',
    role: 'registry_department',
    department: 'Registry Department',
    phone: '+231 88 234 5678',
    status: 'active',
    lastLogin: '2026-11-08 13:40',
  },
  {
    id: 'usr-reg-05',
    name: 'Z. Wleh',
    email: 'zwleh@geominingec.com',
    defaultPassword: 'ZKW@#GMEC1234',
    role: 'registry_department',
    department: 'Registry Department',
    phone: '+231 77 890 1234',
    status: 'active',
    lastLogin: '2026-11-08 12:15',
  },
  {
    id: 'usr-reg-06',
    name: 'E. Appleton',
    email: 'eappleton@geominingec.com',
    defaultPassword: 'ESA@#GMEC1234',
    role: 'registry_department',
    department: 'Registry Department',
    phone: '+231 77 000 0000',
    status: 'active',
    lastLogin: '2026-11-09 13:00',
  },
];

// Initial Company Registrations (Clean slate - ready for Registry Department intake)
export const INITIAL_COMPANIES: CompanyRecord[] = [];

// Initial Mining Licenses across Liberia (Clean slate - ready for fresh intake)
export const INITIAL_MINING_LICENSES: MiningLicense[] = [];

// Initial Client Profiles & CRM Pipelines (Clean slate - ready for fresh intake)
export const INITIAL_CLIENTS: ClientProfile[] = [];

// Initial Audit Trail & Security Logs
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-01',
    timestamp: '2026-11-08 14:30:15',
    userId: 'usr-admin-01',
    userName: 'Carlos E. Tingban',
    userRole: 'administrator',
    action: 'LOGIN',
    module: 'Security',
    details: 'Authenticated successfully from Monrovia HQ executive console.',
  },
  {
    id: 'aud-02',
    timestamp: '2026-11-08 13:10:44',
    userId: 'usr-comp-01',
    userName: 'Emmanuel K. Myers',
    userRole: 'compliance_officer',
    action: 'UPDATE',
    module: 'Compliance',
    targetRecordId: 'obl-01',
    targetRecordName: 'Quarterly Environmental Audit Filing (Q3 2026)',
    details: 'Status updated to COMPLIANT following receipt of official EPA clearance letter.',
  },
  {
    id: 'aud-03',
    timestamp: '2026-11-07 16:45:00',
    userId: 'usr-reg-01',
    userName: 'Helena K. Flomo',
    userRole: 'registry_department',
    action: 'DOCUMENT_UPLOAD',
    module: 'Company Registration',
    targetRecordId: 'comp-01',
    targetRecordName: 'Nimba Iron Ore Holdings Limited',
    details: 'Uploaded verified LRA Tax Clearance Certificate for Q3 2026.',
  },
  {
    id: 'aud-04',
    timestamp: '2026-11-06 11:20:10',
    userId: 'usr-mgmt-01',
    userName: 'Cyrus Michael Johnson',
    userRole: 'management',
    action: 'EXPORT',
    module: 'Reports',
    details: 'Exported Executive Concession Validity & Expiration Forecast report to CSV.',
  },
  {
    id: 'aud-05',
    timestamp: '2026-11-05 09:12:33',
    userId: 'usr-it-01',
    userName: 'Daniel Bofosu Jr.',
    userRole: 'it_department',
    action: 'UPDATE',
    module: 'User Management',
    targetRecordId: 'usr-reg-01',
    targetRecordName: 'Helena K. Flomo',
    details: 'Renewed session security tokens and updated Departmental role permissions.',
  },
];

// Initial System Notifications (Clean slate - ready for fresh intake)
export const INITIAL_NOTIFICATIONS: SystemNotification[] = [];
