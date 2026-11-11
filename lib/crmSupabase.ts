import { supabase } from './supabase';
import {
  CompanyRecord,
  MiningLicense,
  ClientProfile,
  AuditLogEntry,
  CRMTask,
  VaultDocument,
  TeamMessage,
} from '../types/crm';

// ─── ROW CONVERTERS ──────────────────────────────────────────────────────────

export function companyToRow(c: CompanyRecord): Record<string, any> {
  return {
    id: c.id,
    company_name: c.companyName,
    registration_number: c.registrationNumber,
    tax_identification_number: c.taxIdentificationNumber,
    entity_type: c.entityType,
    license_type: c.licenseType || null,
    date_of_application: c.dateOfApplication || null,
    expiry_date: c.expiryDate || null,
    county: c.county,
    city_of_operation: c.cityOfOperation || 'Monrovia',
    registered_address: c.registeredAddress,
    office_address: c.officeAddress || null,
    owner_name: c.ownerName || null,
    cell_no: c.cellNo || null,
    primary_email: c.primaryEmail,
    primary_phone: c.primaryPhone,
    jurisdiction: c.jurisdiction || 'Monrovia, Liberia',
    registration_date: c.registrationDate || null,
    annual_renewal_date: c.annualRenewalDate || null,
    status: c.status,
    directors: c.directors || [],
    documents: c.documents || [],
    assigned_officer: c.assignedOfficer || 'Eric S. Myers',
    registered_by_user_id: (c.registeredByUserId && c.registeredByUserId.startsWith('Gmec-')) ? c.registeredByUserId : null,
    registered_by_name: c.registeredByName || null,
    registered_by_email: c.registeredByEmail || null,
    registered_by_role: c.registeredByRole || null,
    registered_by_department: c.registeredByDepartment || null,
    registered_at: c.registeredAt || null,
    approved_by: c.approvedBy || null,
    approved_at: c.approvedAt || null,
    approved_by_role: c.approvedByRole || null,
    approved_by_email: c.approvedByEmail || null,
    notes: c.notes || null,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  };
}

export function rowToCompany(r: any): CompanyRecord {
  return {
    id: r.id,
    companyName: r.company_name,
    registrationNumber: r.registration_number,
    taxIdentificationNumber: r.tax_identification_number,
    entityType: r.entity_type,
    licenseType: r.license_type || undefined,
    dateOfApplication: r.date_of_application || undefined,
    expiryDate: r.expiry_date || undefined,
    county: r.county || 'Montserrado',
    cityOfOperation: r.city_of_operation || 'Monrovia',
    registeredAddress: r.registered_address,
    officeAddress: r.office_address || undefined,
    ownerName: r.owner_name || undefined,
    cellNo: r.cell_no || undefined,
    primaryEmail: r.primary_email,
    primaryPhone: r.primary_phone,
    jurisdiction: r.jurisdiction || 'Monrovia, Liberia',
    registrationDate: r.registration_date,
    annualRenewalDate: r.annual_renewal_date,
    status: r.status,
    directors: r.directors || [],
    documents: r.documents || [],
    assignedOfficer: r.assigned_officer || 'Eric S. Myers',
    registeredByUserId: r.registered_by_user_id || undefined,
    registeredByName: r.registered_by_name || undefined,
    registeredByEmail: r.registered_by_email || undefined,
    registeredByRole: r.registered_by_role || undefined,
    registeredByDepartment: r.registered_by_department || undefined,
    registeredAt: r.registered_at || undefined,
    approvedBy: r.approved_by || undefined,
    approvedAt: r.approved_at || undefined,
    approvedByRole: r.approved_by_role || undefined,
    approvedByEmail: r.approved_by_email || undefined,
    notes: r.notes || undefined,
    createdAt: r.created_at || new Date().toISOString(),
    updatedAt: r.updated_at || new Date().toISOString(),
  };
}

export function taskToRow(t: CRMTask): Record<string, any> {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    assigned_to_id: (t.assignedToId && t.assignedToId.startsWith('Gmec-')) ? t.assignedToId : null,
    assigned_to_name: t.assignedToName,
    assigned_to_email: t.assignedToEmail,
    assigned_to_role: t.assignedToRole,
    department: t.department,
    created_by_id: (t.createdById && t.createdById.startsWith('Gmec-')) ? t.createdById : null,
    created_by_name: t.createdByName,
    created_by_role: t.createdByRole,
    priority: t.priority,
    status: t.status,
    category: t.category,
    due_date: t.dueDate,
    due_time: t.dueTime || '17:00',
    checklist: t.checklist || [],
    related_company_id: t.relatedCompanyId || null,
    related_company_name: t.relatedCompanyName || null,
    related_license_id: null,
    completed_at: t.completedAt || null,
    completed_by_name: t.completedByName || null,
    reminder_sent: Boolean(t.reminderSent),
    notes: t.notes || null,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  };
}

export function rowToTask(r: any): CRMTask {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    assignedToId: r.assigned_to_id,
    assignedToName: r.assigned_to_name,
    assignedToEmail: r.assigned_to_email,
    assignedToRole: r.assigned_to_role,
    department: r.department,
    createdById: r.created_by_id,
    createdByName: r.created_by_name,
    createdByRole: r.created_by_role,
    priority: r.priority,
    status: r.status,
    category: r.category,
    dueDate: r.due_date,
    dueTime: r.due_time || '17:00',
    checklist: r.checklist || [],
    relatedCompanyId: r.related_company_id || undefined,
    relatedCompanyName: r.related_company_name || undefined,
    relatedLicenseId: r.related_license_id || undefined,
    completedAt: r.completed_at || undefined,
    completedByName: r.completed_by_name || undefined,
    reminderSent: Boolean(r.reminder_sent),
    notes: r.notes || undefined,
    createdAt: r.created_at || new Date().toISOString(),
    updatedAt: r.updated_at || new Date().toISOString(),
  };
}

export function docToRow(d: VaultDocument): Record<string, any> {
  return {
    id: d.id,
    title: d.title,
    file_name: d.fileName,
    file_size: d.fileSize,
    file_format: d.fileFormat,
    category: d.category,
    department: d.department,
    company_name: d.companyName || null,
    license_number: d.licenseNumber || null,
    uploaded_by_name: d.uploadedByName,
    uploaded_by_email: d.uploadedByEmail,
    uploaded_by_role: d.uploadedByRole,
    uploaded_at: d.uploadedAt,
    verified: Boolean(d.verified),
    confidential: Boolean(d.confidential),
    description: d.description || null,
    download_url: d.downloadUrl || '#',
    scan_source: d.scanSource || 'file_upload',
    scan_device: d.scanDevice || null,
    pages_count: d.pagesCount || 1,
    file_data: d.fileData || null,
    ocr_extracted_text: d.ocrExtractedText || null,
  };
}

export function rowToDoc(r: any): VaultDocument {
  return {
    id: r.id,
    title: r.title,
    fileName: r.file_name,
    fileSize: r.file_size,
    fileFormat: r.file_format || 'PDF',
    category: r.category,
    department: r.department,
    companyName: r.company_name || undefined,
    licenseNumber: r.license_number || undefined,
    uploadedByName: r.uploaded_by_name,
    uploadedByEmail: r.uploaded_by_email,
    uploadedByRole: r.uploaded_by_role,
    uploadedAt: r.uploaded_at,
    verified: Boolean(r.verified),
    confidential: Boolean(r.confidential),
    description: r.description || undefined,
    downloadUrl: r.download_url || '#',
    scanSource: r.scan_source || undefined,
    scanDevice: r.scan_device || undefined,
    pagesCount: r.pages_count || 1,
    fileData: r.file_data || undefined,
    ocrExtractedText: r.ocr_extracted_text || undefined,
  };
}

export function messageToRow(m: TeamMessage): Record<string, any> {
  return {
    id: m.id,
    author_id: (m.authorId && m.authorId.startsWith('Gmec-')) ? m.authorId : null,
    author_name: m.authorName,
    author_role: m.authorRole,
    author_department: m.authorDepartment,
    title: m.title || null,
    content: m.content,
    category: m.category,
    is_pinned: Boolean(m.isPinned),
    likes: m.likes || 0,
    liked_by_users: m.likedByUsers || [],
    replies: m.replies || [],
    timestamp: m.timestamp,
  };
}

export function rowToMessage(r: any): TeamMessage {
  return {
    id: r.id,
    authorId: r.author_id,
    authorName: r.author_name,
    authorRole: r.author_role,
    authorDepartment: r.author_department,
    title: r.title || undefined,
    content: r.content,
    category: r.category || 'general',
    isPinned: Boolean(r.is_pinned),
    likes: r.likes || 0,
    likedByUsers: r.liked_by_users || [],
    replies: r.replies || [],
    timestamp: r.timestamp,
  };
}

// ─── SUPABASE API METHODS ────────────────────────────────────────────────────

export async function fetchCompaniesFromSupabase(): Promise<CompanyRecord[] | null> {
  try {
    const { data, error } = await supabase
      .from('crm_companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase CRM] Fetch companies notice:', error.message);
      return null;
    }
    return (data || []).map(rowToCompany);
  } catch (err: any) {
    console.warn('[Supabase CRM] Error fetching companies:', err?.message || err);
    return null;
  }
}

export async function upsertCompanyToSupabase(company: CompanyRecord): Promise<boolean> {
  try {
    const row = companyToRow(company);
    const { error } = await supabase.from('crm_companies').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase CRM] Upsert company error:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase CRM] Error saving company to cloud:', err?.message || err);
    return false;
  }
}

export async function deleteCompanyFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('crm_companies').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchTasksFromSupabase(): Promise<CRMTask[] | null> {
  try {
    const { data, error } = await supabase
      .from('crm_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase CRM] Fetch tasks notice:', error.message);
      return null;
    }
    return (data || []).map(rowToTask);
  } catch (err: any) {
    console.warn('[Supabase CRM] Error fetching tasks:', err?.message || err);
    return null;
  }
}

export async function upsertTaskToSupabase(task: CRMTask): Promise<boolean> {
  try {
    const row = taskToRow(task);
    const { error } = await supabase.from('crm_tasks').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase CRM] Upsert task error:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[Supabase CRM] Error saving task to cloud:', err?.message || err);
    return false;
  }
}

export async function deleteTaskFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('crm_tasks').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchVaultDocsFromSupabase(): Promise<VaultDocument[] | null> {
  try {
    const { data, error } = await supabase
      .from('crm_vault_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return null;
    return (data || []).map(rowToDoc);
  } catch {
    return null;
  }
}

export async function upsertVaultDocToSupabase(doc: VaultDocument): Promise<boolean> {
  try {
    const row = docToRow(doc);
    const { error } = await supabase.from('crm_vault_documents').upsert(row, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteVaultDocFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('crm_vault_documents').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchTeamMessagesFromSupabase(): Promise<TeamMessage[] | null> {
  try {
    const { data, error } = await supabase
      .from('crm_team_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return null;
    return (data || []).map(rowToMessage);
  } catch {
    return null;
  }
}

export async function upsertTeamMessageToSupabase(msg: TeamMessage): Promise<boolean> {
  try {
    const row = messageToRow(msg);
    const { error } = await supabase.from('crm_team_messages').upsert(row, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteTeamMessageFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('crm_team_messages').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function insertAuditLogToSupabase(log: AuditLogEntry): Promise<void> {
  try {
    await supabase.from('crm_audit_logs').insert({
      id: log.id,
      timestamp: log.timestamp,
      user_id: log.userId,
      user_name: log.userName,
      user_role: log.userRole,
      action: log.action,
      module: log.module,
      target_record_id: log.targetRecordId || null,
      target_record_name: log.targetRecordName || null,
      details: log.details,
    });
  } catch (err: any) {
    console.warn('[Supabase CRM] Audit log cloud sync deferred:', err?.message || err);
  }
}

export async function updateUserPasswordInSupabase(userId: string, newPassword: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('crm_users')
      .update({ default_password: newPassword })
      .eq('id', userId);
    return !error;
  } catch {
    return false;
  }
}

