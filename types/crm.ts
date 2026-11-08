// CRM & Mining Regulatory Management Types for GEOMINING & Environmental Consultancy

export type UserRole =
  | 'administrator'
  | 'it_department'
  | 'registry_department'
  | 'compliance_officer'
  | 'management';

export interface CRMUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  phone?: string;
  status: 'active' | 'suspended';
  lastLogin?: string;
}

export type RegistrationStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'active'
  | 'expired'
  | 'suspended'
  | 'rejected';

export type EntityType =
  | 'Corporation'
  | 'Limited Liability Company (LLC)'
  | 'Joint Venture (JV)'
  | 'Sole Proprietorship'
  | 'Partnership'
  | 'Artisanal Mining Cooperative';

export interface CompanyDirector {
  id: string;
  name: string;
  title: string;
  nationality: string;
  idNumber: string;
  shareholdingPct: number;
  phone?: string;
  email?: string;
}

export interface CompanyDocument {
  id: string;
  title: string;
  documentType:
    | 'Articles of Incorporation'
    | 'Business Registration Certificate'
    | 'Tax Clearance Certificate (LRA)'
    | 'EPA Environmental Clearance'
    | 'MME Mineral Cadastre Clearance'
    | 'Proof of Identification'
    | 'Bank Reference Letter'
    | 'Other';
  fileUrl?: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  verified: boolean;
  notes?: string;
}

export interface CompanyRecord {
  id: string;
  companyName: string;
  registrationNumber: string; // e.g. LBR-CORP-2026-0881
  taxIdentificationNumber: string; // TIN
  entityType: EntityType;
  jurisdiction: string; // e.g. Monrovia, Liberia
  registeredAddress: string;
  county: string; // e.g. Montserrado, Nimba, Bong
  primaryEmail: string;
  primaryPhone: string;
  registrationDate: string; // YYYY-MM-DD
  annualRenewalDate: string;
  status: RegistrationStatus;
  directors: CompanyDirector[];
  documents: CompanyDocument[];
  assignedOfficer: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type LiberianLicenseCategory =
  | 'Class A – Industrial Mining License'
  | 'Class B – Semi-Mechanized Mining License'
  | 'Class C – Artisanal Mining License'
  | 'Mineral Exploration License'
  | 'Prospecting License'
  | 'Commercial Rock Quarry License'
  | 'River Sand Mining License'
  | 'Dealer / Exporter License (Gold & Diamonds)'
  | 'Mineral Broker License'
  | 'Commercial Blasting Permit'
  | 'Certified Blaster License'
  | 'Laterite Mining Permit';

export type RenewalStatus =
  | 'current'
  | 'expiring_soon' // < 60 days
  | 'urgent' // < 30 days
  | 'in_renewal'
  | 'expired'
  | 'revoked';

export interface ComplianceObligation {
  id: string;
  title: string;
  regulator: 'EPA Liberia' | 'Ministry of Mines & Energy (MME)' | 'Liberia Revenue Authority (LRA)' | 'Forestry Development Authority (FDA)' | 'Local Community';
  dueDate: string;
  status: 'compliant' | 'pending' | 'overdue' | 'waived';
  description: string;
  lastCheckedDate?: string;
  referenceNumber?: string;
}

export interface MiningLicense {
  id: string;
  licenseNumber: string; // e.g. MEL-2026-091
  category: LiberianLicenseCategory;
  companyId: string;
  companyName: string;
  county: string;
  district?: string;
  concessionArea: string; // e.g. "250 Sq. km" or "100 Acres"
  coordinates?: string; // e.g. "06°45'N, 008°30'W"
  issueDate: string;
  expiryDate: string;
  renewalStatus: RenewalStatus;
  statutoryFeeUSD: number;
  feePaymentStatus: 'paid' | 'partial' | 'pending' | 'overdue';
  cadastralCode: string;
  primaryCommodity: 'Gold' | 'Diamonds' | 'Iron Ore' | 'Lithium' | 'Bauxite' | 'Aggregates' | 'River Sand' | 'Laterite' | 'Multi-Commodity';
  complianceObligations: ComplianceObligation[];
  assignedInspector: string;
  notes?: string;
  updatedAt: string;
}

export type ClientTier =
  | 'Tier 1 Enterprise'
  | 'Strategic Investor'
  | 'Commercial Operator'
  | 'Artisanal Cooperative'
  | 'Government / Institutional';

export type ServiceRequestStage =
  | 'inquiry'
  | 'due_diligence'
  | 'proposal_submitted'
  | 'contract_signed'
  | 'in_progress'
  | 'statutory_review'
  | 'completed'
  | 'on_hold';

export interface ServiceRequest {
  id: string;
  clientId: string;
  serviceTitle: string;
  serviceCategory:
    | 'Mining License Package Acquisition'
    | 'Statutory Due Diligence & Title Verification'
    | 'Environmental & Social Impact Assessment (ESIA)'
    | 'Mineral Exploration & Geological Surveys'
    | 'Geotechnical Engineering & Slope Stability'
    | 'Client Security & Concession Advisory'
    | 'EPA Regulatory Compliance Audit';
  estimatedValueUSD: number;
  stage: ServiceRequestStage;
  startDate: string;
  targetCompletionDate: string;
  leadConsultant: string;
  progressPct: number;
  notes?: string;
}

export interface CommunicationLog {
  id: string;
  clientId: string;
  date: string;
  channel: 'In-Person Meeting' | 'Phone Call' | 'Official Email' | 'Field Mission' | 'Formal Letter';
  summary: string;
  conductedBy: string;
  nextFollowUpDate?: string;
}

export interface FollowUpTask {
  id: string;
  clientId: string;
  companyId?: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean;
  category: 'Registration' | 'License Renewal' | 'Compliance Audit' | 'Client Follow-up';
}

export interface ClientProfile {
  id: string;
  companyId?: string;
  clientName: string;
  tier: ClientTier;
  primaryContactName: string;
  primaryContactTitle: string;
  email: string;
  phone: string;
  country: string; // Origin of investor: e.g. Liberia, China, UK, USA, Australia
  status: 'active' | 'prospect' | 'inactive';
  totalContractValueUSD: number;
  accountManager: string;
  serviceRequests: ServiceRequest[];
  communicationLogs: CommunicationLog[];
  followUps: FollowUpTask[];
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'DOCUMENT_UPLOAD' | 'EXPORT' | 'LOGIN' | 'LOGOUT';
  module: 'Company Registration' | 'Mining Licenses' | 'Compliance' | 'Client CRM' | 'User Management' | 'Reports' | 'Security';
  targetRecordId?: string;
  targetRecordName?: string;
  details: string;
}

export interface SystemNotification {
  id: string;
  type: 'warning' | 'info' | 'critical' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedModule?: string;
  relatedId?: string;
}

