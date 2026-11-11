-- ============================================================================
-- GEOMINING & ENVIRONMENTAL CONSULTANCY INC (GMEC)
-- COMPLETE SUPABASE ENTERPRISE DATABASE SCHEMA & SEED DATA
-- Version: 7.0 (Official 24-Person Roster & Bitrix24 Enterprise Cadastre)
-- Generated: 2026-11-11
--
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/yvvalbuxdgulauupuwuk
-- 2. Navigate to "SQL Editor" on the left navigation bar.
-- 3. Click "New Query", paste this entire script, and click "Run" (or Ctrl + Enter).
-- ============================================================================

-- ── 0. PREREQUISITES & EXTENSIONS ───────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- SECTION 1: PUBLIC WEBSITE & CAREERS PORTAL TABLES
-- ============================================================================

-- ── 1.1 Job Postings Table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Monrovia, Liberia',
  type TEXT NOT NULL DEFAULT 'Full-time',
  description TEXT NOT NULL,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  offers JSONB DEFAULT '[]'::jsonb,
  deadline DATE,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 1.2 Job Applications Table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience TEXT,
  skills TEXT,
  linked_in TEXT,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 1.3 Partners & Institutional Inquiries Table ────────────────────────────
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  partnership_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'partnered', 'archived')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 1.4 Contact Form Submissions Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded', 'archived')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 1.5 News Desk, Blog & Event Articles Table ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT 'Industry Insights',
  section TEXT DEFAULT 'news_desk' CHECK (section IN ('news_desk', 'latest_articles', 'events')),
  author TEXT DEFAULT 'Technical Team',
  image_url TEXT DEFAULT '',
  read_time TEXT DEFAULT '5 min read',
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled')),
  is_featured BOOLEAN DEFAULT false,
  publish_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 1.6 Site Web Analytics Table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  page TEXT NOT NULL DEFAULT '/',
  page_views INTEGER NOT NULL DEFAULT 0,
  unique_visits INTEGER NOT NULL DEFAULT 0,
  sessions INTEGER NOT NULL DEFAULT 0,
  bounce_count INTEGER NOT NULL DEFAULT 0,
  total_duration_sec INTEGER NOT NULL DEFAULT 0,
  device_mobile INTEGER NOT NULL DEFAULT 0,
  device_desktop INTEGER NOT NULL DEFAULT 0,
  device_tablet INTEGER NOT NULL DEFAULT 0,
  referrer_direct INTEGER NOT NULL DEFAULT 0,
  referrer_search INTEGER NOT NULL DEFAULT 0,
  referrer_social INTEGER NOT NULL DEFAULT 0,
  referrer_other INTEGER NOT NULL DEFAULT 0,
  country TEXT DEFAULT 'Liberia',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (date, page)
);


-- ============================================================================
-- SECTION 2: GMEC ENTERPRISE CRM & BITRIX24 CADASTRE TABLES
-- ============================================================================

-- ── 2.1 Authorized Departmental Personnel (CRM Users) ──────────────────────
CREATE TABLE IF NOT EXISTS public.crm_users (
  id TEXT PRIMARY KEY,                       -- e.g. 'Gmec-001'
  employee_id TEXT UNIQUE NOT NULL,         -- e.g. 'Gmec-001'
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  default_password TEXT NOT NULL,            -- e.g. 'C@GMEC1234'
  role TEXT NOT NULL CHECK (role IN (
    'super_admin',
    'administrator',
    'it_department',
    'registry_department',
    'compliance_officer',
    'management'
  )),
  department TEXT NOT NULL,
  phone TEXT DEFAULT '+231 77 000 0000',
  avatar TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2.2 Corporate Departments (Org Structure) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  head_name TEXT NOT NULL,
  head_email TEXT NOT NULL,
  employee_count INTEGER DEFAULT 1,
  active_task_count INTEGER DEFAULT 0,
  completed_task_count INTEGER DEFAULT 0,
  department_completion_rate INTEGER DEFAULT 85,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2.3 Registered Companies (Registry Intake & Cadastre) ───────────────────
CREATE TABLE IF NOT EXISTS public.crm_companies (
  id TEXT PRIMARY KEY,                       -- e.g. 'comp-1794357441'
  company_name TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,  -- e.g. 'LBR-CORP-2026-0881'
  tax_identification_number TEXT NOT NULL,   -- TIN
  entity_type TEXT NOT NULL DEFAULT 'Corporation',
  license_type TEXT,
  date_of_application DATE,
  expiry_date DATE,
  county TEXT NOT NULL DEFAULT 'Montserrado',
  city_of_operation TEXT DEFAULT 'Monrovia',
  registered_address TEXT NOT NULL,
  office_address TEXT,
  owner_name TEXT,
  cell_no TEXT,
  primary_email TEXT NOT NULL,
  primary_phone TEXT NOT NULL,
  jurisdiction TEXT NOT NULL DEFAULT 'Monrovia, Liberia',
  registration_date DATE DEFAULT CURRENT_DATE,
  annual_renewal_date DATE,
  status TEXT NOT NULL DEFAULT 'under_review' CHECK (status IN (
    'pending',
    'under_review',
    'approved',
    'active',
    'expired',
    'suspended',
    'rejected'
  )),
  directors JSONB DEFAULT '[]'::jsonb,
  documents JSONB DEFAULT '[]'::jsonb,
  assigned_officer TEXT NOT NULL DEFAULT 'Eric S. Myers',
  registered_by_user_id TEXT REFERENCES public.crm_users(id) ON DELETE SET NULL,
  registered_by_name TEXT,
  registered_by_email TEXT,
  registered_by_role TEXT,
  registered_by_department TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  approved_by_role TEXT,
  approved_by_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2.4 Statutory Mining Licenses (Liberia Cadastre) ────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_mining_licenses (
  id TEXT PRIMARY KEY,
  license_number TEXT UNIQUE NOT NULL,      -- e.g. 'MEL-2026-091'
  category TEXT NOT NULL,
  company_id TEXT REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  county TEXT NOT NULL,
  district TEXT,
  concession_area TEXT,                      -- e.g. '250 Sq. km'
  coordinates TEXT,                          -- e.g. '06°45''N, 008°30''W'
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  renewal_status TEXT NOT NULL DEFAULT 'current' CHECK (renewal_status IN (
    'current',
    'expiring_soon',
    'urgent',
    'in_renewal',
    'expired',
    'revoked'
  )),
  statutory_fee_usd NUMERIC(14, 2) DEFAULT 0.00,
  fee_payment_status TEXT DEFAULT 'paid' CHECK (fee_payment_status IN ('paid', 'partial', 'pending', 'overdue')),
  cadastral_code TEXT NOT NULL,
  primary_commodity TEXT NOT NULL DEFAULT 'Gold',
  compliance_obligations JSONB DEFAULT '[]'::jsonb,
  assigned_inspector TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2.5 CRM Client Profiles & Pipeline ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_clients (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'Commercial Operator',
  primary_contact_name TEXT NOT NULL,
  primary_contact_title TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Liberia',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'prospect', 'inactive')),
  total_contract_value_usd NUMERIC(14, 2) DEFAULT 0.00,
  account_manager TEXT NOT NULL,
  service_requests JSONB DEFAULT '[]'::jsonb,
  communication_logs JSONB DEFAULT '[]'::jsonb,
  follow_ups JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2.6 Daily Tasks & Kanban Tracking (Bitrix24) ────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_tasks (
  id TEXT PRIMARY KEY,                       -- e.g. 'tsk-001'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  assigned_to_id TEXT REFERENCES public.crm_users(id) ON DELETE SET NULL,
  assigned_to_name TEXT NOT NULL,
  assigned_to_email TEXT NOT NULL,
  assigned_to_role TEXT NOT NULL,
  department TEXT NOT NULL,
  created_by_id TEXT REFERENCES public.crm_users(id) ON DELETE SET NULL,
  created_by_name TEXT NOT NULL,
  created_by_role TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
  category TEXT NOT NULL DEFAULT 'Daily Intake',
  due_date DATE NOT NULL,
  due_time TEXT DEFAULT '17:00',
  checklist JSONB DEFAULT '[]'::jsonb,
  related_company_id TEXT REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  related_company_name TEXT,
  related_license_id TEXT REFERENCES public.crm_mining_licenses(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  completed_by_name TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2.7 Centralized Document Storage Vault ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_vault_documents (
  id TEXT PRIMARY KEY,                       -- e.g. 'doc-001'
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size TEXT NOT NULL,
  file_format TEXT NOT NULL DEFAULT 'PDF',
  category TEXT NOT NULL,
  department TEXT NOT NULL,
  company_name TEXT,
  license_number TEXT,
  uploaded_by_name TEXT NOT NULL,
  uploaded_by_email TEXT NOT NULL,
  uploaded_by_role TEXT NOT NULL,
  uploaded_at DATE DEFAULT CURRENT_DATE,
  verified BOOLEAN DEFAULT true,
  confidential BOOLEAN DEFAULT false,
  description TEXT,
  download_url TEXT DEFAULT '#',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2.8 Team Feed & Internal Broadcasts ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_team_messages (
  id TEXT PRIMARY KEY,                       -- e.g. 'msg-001'
  author_id TEXT REFERENCES public.crm_users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_department TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('announcement', 'operational', 'urgent', 'general')),
  is_pinned BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  liked_by_users JSONB DEFAULT '[]'::jsonb,
  replies JSONB DEFAULT '[]'::jsonb,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2.9 Tamper-Resistant Administrative Audit Trail ─────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'CREATE',
    'UPDATE',
    'DELETE',
    'STATUS_CHANGE',
    'DOCUMENT_UPLOAD',
    'EXPORT',
    'LOGIN',
    'LOGOUT',
    'SECURITY_ALERT',
    'ACCOUNT_LOCKOUT',
    'ACCOUNT_UNLOCK',
    'COMMENT_ADDED',
    'BACKUP_EXPORT',
    'BACKUP_RESTORE',
    'POST'
  )),
  module TEXT NOT NULL CHECK (module IN (
    'Company Registration',
    'Mining Licenses',
    'Compliance',
    'Client CRM',
    'User Management',
    'Reports',
    'Security',
    'Comments',
    'Disaster Recovery',
    'Daily Tasks',
    'Document Vault',
    'Team Feed',
    'Org Structure'
  )),
  target_record_id TEXT,
  target_record_name TEXT,
  details TEXT NOT NULL
);

-- ── 2.10 Statutory Reminders & Notifications ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('warning', 'info', 'critical', 'success')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  related_module TEXT,
  related_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2.11 Security Telemetry & Failed Login Surveillance ─────────────────────
CREATE TABLE IF NOT EXISTS public.crm_failed_logins (
  id TEXT PRIMARY KEY,
  attempted_email TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT DEFAULT 'Desktop',
  approx_location TEXT,
  approx_location_disclaimer TEXT,
  reason TEXT NOT NULL,
  consecutive_failures INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'flagged' CHECK (status IN ('flagged', 'rate_limited', 'locked_out'))
);

-- ── 2.12 Security Alerts & Threat Surveillance ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_security_alerts (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'warning')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_email TEXT,
  ip_address TEXT,
  approx_location TEXT,
  attempt_count INTEGER DEFAULT 1,
  acknowledged BOOLEAN DEFAULT false,
  requires_alarm BOOLEAN DEFAULT false
);

-- ── 2.13 Active User Sessions (Remote Termination Control) ──────────────────
CREATE TABLE IF NOT EXISTS public.crm_active_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.crm_users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  email TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  browser TEXT,
  device_type TEXT,
  approx_location TEXT,
  login_time TIMESTAMPTZ DEFAULT NOW(),
  last_active_time TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2.14 Account Lockouts (Brute Force Protection) ──────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_account_lockouts (
  email TEXT PRIMARY KEY,
  locked_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  failed_attempts INTEGER DEFAULT 5,
  locked_by TEXT DEFAULT 'SYSTEM_RATE_LIMITER',
  reason TEXT NOT NULL,
  client_ip TEXT NOT NULL,
  location TEXT
);

-- ── 2.15 Record Comments & Observations ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_record_comments (
  id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('company', 'license', 'compliance', 'client')),
  record_reference TEXT NOT NULL,
  user_id TEXT,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  department TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- SECTION 3: TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

DROP TRIGGER IF EXISTS trg_jobs_updated_at ON public.jobs;
CREATE TRIGGER trg_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_articles_updated_at ON public.articles;
CREATE TRIGGER trg_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_crm_users_updated_at ON public.crm_users;
CREATE TRIGGER trg_crm_users_updated_at BEFORE UPDATE ON public.crm_users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_crm_companies_updated_at ON public.crm_companies;
CREATE TRIGGER trg_crm_companies_updated_at BEFORE UPDATE ON public.crm_companies FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_crm_mining_licenses_updated_at ON public.crm_mining_licenses;
CREATE TRIGGER trg_crm_mining_licenses_updated_at BEFORE UPDATE ON public.crm_mining_licenses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_crm_tasks_updated_at ON public.crm_tasks;
CREATE TRIGGER trg_crm_tasks_updated_at BEFORE UPDATE ON public.crm_tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ============================================================================
-- SECTION 4: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.crm_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_mining_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_vault_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_team_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_failed_logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_account_lockouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_record_comments ENABLE ROW LEVEL SECURITY;

-- ── Public Website Policies ─────────────────────────────────────────────────
-- Jobs
CREATE POLICY "allow_anon_read_jobs" ON public.jobs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_all_manage_jobs" ON public.jobs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Applications (public insert, admin read)
CREATE POLICY "allow_anon_insert_applications" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "allow_admin_read_applications" ON public.applications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "allow_admin_manage_applications" ON public.applications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Partners (public insert, admin read)
CREATE POLICY "allow_anon_insert_partners" ON public.partners FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "allow_admin_read_partners" ON public.partners FOR SELECT TO anon, authenticated USING (true);

-- Contacts (public insert, admin read)
CREATE POLICY "allow_anon_insert_contacts" ON public.contacts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "allow_admin_read_contacts" ON public.contacts FOR SELECT TO anon, authenticated USING (true);

-- Articles (public read published, admin full access)
CREATE POLICY "allow_public_read_articles" ON public.articles FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "allow_admin_manage_articles" ON public.articles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Analytics (public insert/upsert, admin read)
CREATE POLICY "allow_anon_analytics_insert" ON public.site_analytics FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "allow_anon_analytics_update" ON public.site_analytics FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "allow_anon_analytics_select" ON public.site_analytics FOR SELECT TO anon, authenticated USING (true);

-- ── CRM & Cadastre Portal Policies ──────────────────────────────────────────
CREATE POLICY "allow_crm_users_access" ON public.crm_users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_departments_access" ON public.crm_departments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_companies_access" ON public.crm_companies FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_mining_licenses_access" ON public.crm_mining_licenses FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_clients_access" ON public.crm_clients FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_tasks_access" ON public.crm_tasks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_vault_documents_access" ON public.crm_vault_documents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_team_messages_access" ON public.crm_team_messages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_audit_logs_access" ON public.crm_audit_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_notifications_access" ON public.crm_notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_failed_logins_access" ON public.crm_failed_logins FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_security_alerts_access" ON public.crm_security_alerts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_active_sessions_access" ON public.crm_active_sessions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_account_lockouts_access" ON public.crm_account_lockouts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_crm_record_comments_access" ON public.crm_record_comments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- ============================================================================
-- SECTION 5: PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status, publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.site_analytics(date DESC);

CREATE INDEX IF NOT EXISTS idx_crm_users_email ON public.crm_users(email);
CREATE INDEX IF NOT EXISTS idx_crm_users_role ON public.crm_users(role);
CREATE INDEX IF NOT EXISTS idx_crm_companies_regno ON public.crm_companies(registration_number);
CREATE INDEX IF NOT EXISTS idx_crm_companies_status ON public.crm_companies(status);
CREATE INDEX IF NOT EXISTS idx_crm_companies_officer ON public.crm_companies(assigned_officer);
CREATE INDEX IF NOT EXISTS idx_crm_licenses_no ON public.crm_mining_licenses(license_number);
CREATE INDEX IF NOT EXISTS idx_crm_licenses_expiry ON public.crm_mining_licenses(expiry_date);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned ON public.crm_tasks(assigned_to_email, status);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due ON public.crm_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_audit_timestamp ON public.crm_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_crm_comments_record ON public.crm_record_comments(record_id);


-- ============================================================================
-- SECTION 6: SUPABASE STORAGE BUCKETS SETUP
-- ============================================================================

-- Insert standard public storage buckets if they do not already exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('resumes', 'resumes', true),
  ('article-images', 'article-images', true),
  ('crm-documents', 'crm-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage bucket access policies
CREATE POLICY "allow_public_resume_upload" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "allow_public_resume_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "allow_article_images_public" ON storage.objects
  FOR ALL TO anon, authenticated
  USING (bucket_id = 'article-images')
  WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "allow_crm_documents_public" ON storage.objects
  FOR ALL TO anon, authenticated
  USING (bucket_id = 'crm-documents')
  WITH CHECK (bucket_id = 'crm-documents');


-- ============================================================================
-- SECTION 7: SEED DATA — OFFICIAL 24-PERSON GMEC EMPLOYEE ROSTER
-- ============================================================================

-- Clean any old/mock users first
DELETE FROM public.crm_users WHERE employee_id NOT IN (
  'Gmec-001', 'Gmec-002', 'Gmec-003', 'Gmec-004', 'Gmec-005', 'Gmec-006',
  'Gmec-007', 'Gmec-008', 'Gmec-009', 'Gmec-010', 'Gmec-011', 'Gmec-012',
  'Gmec-013', 'Gmec-014', 'Gmec-015', 'Gmec-016', 'Gmec-017', 'Gmec-018',
  'Gmec-019', 'Gmec-020', 'Gmec-021', 'Gmec-022', 'Gmec-023', 'Gmec-024'
);

-- Upsert the official 24 personnel accounts
INSERT INTO public.crm_users (
  id, employee_id, name, position, email, default_password, role, department, phone, status
) VALUES
  ('Gmec-001', 'Gmec-001', 'Carlos E. Tingban, Sr.', 'Executive Director', 'carlosetingban@geominingec.com', 'C@GMEC1234', 'management', 'Executive Directorate', '+231 77 123 4567', 'active'),
  ('Gmec-002', 'Gmec-002', 'Z. Alexander Y. Teewu', 'Administrative Manager', 'zteewu@geominingec.com', 'Z@GMEC1234', 'administrator', 'Administration', '+231 88 123 7890', 'active'),
  ('Gmec-003', 'Gmec-003', 'Eric Kieh', 'Lead Mining Engineer', 'ekieh@geominingec.com', 'E@GMEC1234', 'compliance_officer', 'Mining Engineering & Geology', '+231 77 003 0030', 'active'),
  ('Gmec-004', 'Gmec-004', 'James Godson', 'Lead Environmentalist', 'jgodson@geominingec.com', 'J@GMEC1234', 'compliance_officer', 'Environmental & Compliance', '+231 88 004 0040', 'active'),
  ('Gmec-005', 'Gmec-005', 'Mohamed S. Kromah', 'Lead IT Officer', 'mskromah@geominingec.com', 'M@GMEC1234', 'super_admin', 'IT & Infrastructure', '+231 77 777 2778', 'active'),
  ('Gmec-006', 'Gmec-006', 'Eric S. Myers', 'Lead License Registrar', 'emyers@geominingec.com', 'E@GMEC1234', 'registry_department', 'Registry Department', '+231 77 987 6543', 'active'),
  ('Gmec-007', 'Gmec-007', 'Nathaniel D. Toplah', 'Field Manager', 'ntoplah@geominingec.com', 'N@GMEC1234', 'compliance_officer', 'Field Operations', '+231 88 007 0070', 'active'),
  ('Gmec-008', 'Gmec-008', 'Fofee L. Kamara', 'IT Officer', 'fkamara@geominingec.com', 'F@GMEC1234', 'it_department', 'IT & Infrastructure', '+231 77 008 0080', 'active'),
  ('Gmec-009', 'Gmec-009', 'Daniel B. Ofosu', 'IT Officer', 'danielbofosujr@geominingec.com', 'D@GMEC1234', 'super_admin', 'IT & Infrastructure', '+231 88 654 3210', 'active'),
  ('Gmec-010', 'Gmec-010', 'Joshua Zayzay', 'Geologist', 'jzayzay@geominingec.com', 'J@GMEC1234', 'compliance_officer', 'Mining Engineering & Geology', '+231 88 010 0100', 'active'),
  ('Gmec-011', 'Gmec-011', 'Nathan Dolo', 'Geologist', 'ndolo@geominingec.com', 'N@GMEC1234', 'compliance_officer', 'Mining Engineering & Geology', '+231 77 011 0110', 'active'),
  ('Gmec-012', 'Gmec-012', 'Julius B. McGill', 'Environmentalist', 'jmcgill@geominingec.com', 'J@GMEC1234', 'compliance_officer', 'Environmental & Compliance', '+231 77 012 0120', 'active'),
  ('Gmec-013', 'Gmec-013', 'Juah Karnga-Dahn', 'Environmentalist', 'jkdahn@geominingec.com', 'J@GMEC1234', 'compliance_officer', 'Environmental & Compliance', '+231 88 013 0130', 'active'),
  ('Gmec-014', 'Gmec-014', 'Rex Warner', 'Documents Agent', 'rwarner@geominingec.com', 'R@GMEC1234', 'registry_department', 'Registry Department', '+231 88 014 0140', 'active'),
  ('Gmec-015', 'Gmec-015', 'Comfort K.L. Mulbah', 'Documents Agent', 'cmulbah@geominingec.com', 'C@GMEC1234', 'registry_department', 'Registry Department', '+231 77 015 0150', 'active'),
  ('Gmec-016', 'Gmec-016', 'Eric S. Appleton', 'License Registrar', 'eappleton@geominingec.com', 'E@GMEC1234', 'registry_department', 'Registry Department', '+231 88 016 0160', 'active'),
  ('Gmec-017', 'Gmec-017', 'Zuala Kofa Wleh', 'License Registrar', 'zwleh@geominingec.com', 'Z@GMEC1234', 'registry_department', 'Registry Department', '+231 77 017 0170', 'active'),
  ('Gmec-018', 'Gmec-018', 'Alvin G. Cooper', 'License Registrar', 'acooper@geominingec.com', 'A@GMEC1234', 'registry_department', 'Registry Department', '+231 88 018 0180', 'active'),
  ('Gmec-019', 'Gmec-019', 'Leona C. Quoie', 'Receptionist', 'lquoie@geominingec.com', 'L@GMEC1234', 'administrator', 'Administration', '+231 77 019 0190', 'active'),
  ('Gmec-020', 'Gmec-020', 'James S. Somah', 'Security Director', 'jsomah@geominingec.com', 'J@GMEC1234', 'it_department', 'Security & Operations', '+231 88 020 0200', 'active'),
  ('Gmec-021', 'Gmec-021', 'Dell Tinbgan', 'Asst. Field Manager', 'dtinbgan@geominingec.com', 'D@GMEC1234', 'compliance_officer', 'Field Operations', '+231 77 021 0210', 'active'),
  ('Gmec-022', 'Gmec-022', 'Lovette G. Nagbe', 'Environmentalist', 'lgnagbe@geominingec.com', 'L@GMEC1234', 'compliance_officer', 'Environmental & Compliance', '+231 77 022 0220', 'active'),
  ('Gmec-023', 'Gmec-023', 'Tommy Nimely', 'Security', 'tnimely@geominingec.com', 'T@GMEC1234', 'compliance_officer', 'Security & Operations', '+231 77 023 0230', 'active'),
  ('Gmec-024', 'Gmec-024', 'Howard Washington', 'Security', 'hwashington@geominingec.com', 'H@GMEC1234', 'compliance_officer', 'Security & Operations', '+231 88 024 0240', 'active')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  default_password = EXCLUDED.default_password,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status;

-- ── 7.2 Seed Data: 8 Corporate Departments (Org Chart) ──────────────────────
INSERT INTO public.crm_departments (
  id, name, head_name, head_email, employee_count, active_task_count, completed_task_count, department_completion_rate, description
) VALUES
  ('dept-exec', 'Executive Directorate', 'Carlos E. Tingban, Sr.', 'carlosetingban@geominingec.com', 1, 1, 3, 85, 'Executive leadership oversight, corporate strategy, statutory approvals, and government liaison.'),
  ('dept-admin', 'Administration', 'Z. Alexander Y. Teewu', 'zteewu@geominingec.com', 2, 1, 5, 88, 'Administrative management, personnel coordination, front desk reception, and office logistics.'),
  ('dept-it', 'IT & Infrastructure', 'Mohamed S. Kromah', 'mskromah@geominingec.com', 3, 1, 8, 92, 'Enterprise IT infrastructure, security telemetry, database persistence, and disaster recovery.'),
  ('dept-registry', 'Registry Department', 'Eric S. Myers', 'emyers@geominingec.com', 6, 3, 14, 90, 'Official corporate registration intake, legal documentation, TIN validation, and provenance records.'),
  ('dept-mining', 'Mining Engineering & Geology', 'Eric Kieh', 'ekieh@geominingec.com', 3, 2, 7, 86, 'Mineral exploration, geological surveying, resource modeling, and mining engineering plans.'),
  ('dept-compliance', 'Environmental & Compliance', 'James Godson', 'jgodson@geominingec.com', 4, 2, 9, 89, 'EPA & MME statutory filings, tailings dam safety inspections, and environmental compliance audits.'),
  ('dept-field', 'Field Operations', 'Nathaniel D. Toplah', 'ntoplah@geominingec.com', 2, 2, 6, 84, 'On-site concession inspections, field coordination, and operational ground assessments across Liberia.'),
  ('dept-security', 'Security & Operations', 'James S. Somah', 'jsomah@geominingec.com', 3, 1, 5, 91, 'Physical site security, concession perimeter protection, and operational safety enforcement.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  head_name = EXCLUDED.head_name,
  head_email = EXCLUDED.head_email,
  employee_count = EXCLUDED.employee_count,
  description = EXCLUDED.description;

-- ── 7.3 Seed Data: Initial Bitrix24 Daily Tasks ─────────────────────────────
INSERT INTO public.crm_tasks (
  id, title, description, assigned_to_id, assigned_to_name, assigned_to_email, assigned_to_role, department,
  created_by_id, created_by_name, created_by_role, priority, status, category, due_date, due_time, checklist
) VALUES
  ('tsk-001', 'Review Registry Intake Dossiers for New Concession Applications',
   'Verify corporate documentation, Articles of Incorporation, and taxpayer identification numbers (TIN) for newly registered mining entities.',
   'Gmec-016', 'Eric S. Appleton', 'eappleton@geominingec.com', 'registry_department', 'Registry Department',
   'Gmec-002', 'Z. Alexander Y. Teewu', 'administrator', 'high', 'todo', 'Daily Intake', CURRENT_DATE, '16:00',
   '[{"id":"chk-1","title":"Verify official corporate legal name","completed":true},{"id":"chk-2","title":"Cross-check Liberian Business Registry (LBR) number","completed":false},{"id":"chk-3","title":"Ensure TIN and primary contact details match","completed":false}]'::jsonb),
  
  ('tsk-002', 'Statutory Verification & Oversight on Pending Registrations',
   'Conduct final statutory review for corporate entity submissions awaiting Executive or Registry Boss authorization.',
   'Gmec-006', 'Eric S. Myers', 'emyers@geominingec.com', 'registry_department', 'Registry Department',
   'Gmec-001', 'Carlos E. Tingban, Sr.', 'management', 'critical', 'in_progress', 'Concession Verification', CURRENT_DATE + INTERVAL '1 day', '14:30',
   '[{"id":"chk-4","title":"Inspect provenance logging of registering officer","completed":true},{"id":"chk-5","title":"Validate jurisdictional coordinates & concession county","completed":true},{"id":"chk-6","title":"Affix official statutory approval seal","completed":false}]'::jsonb),
  
  ('tsk-003', 'Quarterly Environmental Compliance & Tailings Monitoring Audit',
   'Coordinate with EPA Liberia inspectorate to audit sediment logs, effluent compliance, and safety reports for active concession sites.',
   'Gmec-004', 'James Godson', 'jgodson@geominingec.com', 'compliance_officer', 'Environmental & Compliance',
   'Gmec-005', 'Mohamed S. Kromah', 'super_admin', 'medium', 'review', 'Regulatory Audit', CURRENT_DATE + INTERVAL '3 days', '17:00',
   '[{"id":"chk-7","title":"Review water quality assay reports","completed":true},{"id":"chk-8","title":"Verify tailings dam slope stability certificates","completed":true},{"id":"chk-9","title":"File formal compliance index with MME inspectorate","completed":false}]'::jsonb),
  
  ('tsk-004', 'Disaster Recovery Snapshot & Infrastructure Telemetry Audit',
   'Execute automated cryptographic backup of Cadastre records and verify TLS session token security across all active terminals.',
   'Gmec-009', 'Daniel B. Ofosu', 'danielbofosujr@geominingec.com', 'super_admin', 'IT & Infrastructure',
   'Gmec-005', 'Mohamed S. Kromah', 'super_admin', 'high', 'completed', 'General Operations', CURRENT_DATE, '11:00',
   '[{"id":"chk-10","title":"Export JSON disaster recovery snapshot","completed":true},{"id":"chk-11","title":"Audit anomalous IP geolocation routing logs","completed":true},{"id":"chk-12","title":"Verify database persistence and state synchronization","completed":true}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ── 7.4 Seed Data: Initial Document Vault Entries ───────────────────────────
INSERT INTO public.crm_vault_documents (
  id, title, file_name, file_size, file_format, category, department, uploaded_by_name, uploaded_by_email, uploaded_by_role, description
) VALUES
  ('doc-001', 'Liberia Minerals & Mining Law of 2000 (Statutory Cadastre Edition)', 'Liberia_Minerals_Mining_Law_2000_Cadastre.pdf', '4.8 MB', 'PDF', 'MME Mineral Cadastre', 'Executive Directorate', 'Carlos E. Tingban, Sr.', 'carlosetingban@geominingec.com', 'management', 'Foundational statutory framework governing all exploration, commercial quarry, artisanal, and Class A concessions in Liberia.'),
  ('doc-002', 'EPA Guidelines for Mine Tailings and Effluent Water Management', 'EPA_Tailings_Effluent_Guidelines_2026.pdf', '3.2 MB', 'PDF', 'EPA Clearance', 'Environmental & Compliance', 'James Godson', 'jgodson@geominingec.com', 'compliance_officer', 'Mandatory environmental protection standards for industrial mining concession operators.'),
  ('doc-003', 'GMEC Standard Operating Procedure for Corporate Concession Registry', 'GMEC_SOP_Concession_Registry_v3.docx', '1.4 MB', 'DOCX', 'Standard Operating Procedure (SOP)', 'Registry Department', 'Eric S. Myers', 'emyers@geominingec.com', 'registry_department', 'Operational guidelines for intake, provenance logging, and dual-statutory approval requirements.'),
  ('doc-004', 'LRA Extractive Sector Tax Withholding & Royalty Matrix (FY2026-2027)', 'LRA_Extractive_Royalty_Matrix_2026.xlsx', '850 KB', 'XLSX', 'Tax Clearance (LRA)', 'IT & Infrastructure', 'Daniel B. Ofosu', 'danielbofosujr@geominingec.com', 'super_admin', 'Official fiscal schedules for surface rental, statutory inspection levies, and bullion export royalties.')
ON CONFLICT (id) DO NOTHING;

-- ── 7.5 Seed Data: Initial Team Broadcast Messages ──────────────────────────
INSERT INTO public.crm_team_messages (
  id, author_id, author_name, author_role, author_department, title, content, category, is_pinned, likes, liked_by_users, replies, timestamp
) VALUES
  ('msg-001', 'Gmec-005', 'Mohamed S. Kromah', 'super_admin', 'IT & Infrastructure',
   '🚀 GMEC Enterprise Cadastre & CRM System Online',
   'All departmental personnel: The CRM has been upgraded with Bitrix24 enterprise capabilities including Centralized Daily Tasks, Employee Profiles & Org Structure, Document Storage Vault, and Real-Time Internal Communication. Please check your assigned daily tasks and ensure all statutory deadlines are maintained.',
   'announcement', true, 6,
   '["carlosetingban@geominingec.com", "emyers@geominingec.com", "zteewu@geominingec.com", "eappleton@geominingec.com"]'::jsonb,
   '[{"id":"rep-001","authorId":"Gmec-001","authorName":"Carlos E. Tingban, Sr.","authorRole":"management","authorDepartment":"Executive Directorate","content":"Acknowledged. All officers should monitor daily task completion rates closely to maintain our department KPI benchmarks.","timestamp":"Today at 09:15"},{"id":"rep-002","authorId":"Gmec-016","authorName":"Eric S. Appleton","authorRole":"registry_department","authorDepartment":"Registry Department","content":"Registry Department standing by. Daily intake dossiers are being reviewed pursuant to the updated SOP.","timestamp":"Today at 09:30"}]'::jsonb,
   'Today at 08:30'),
  
  ('msg-002', 'Gmec-002', 'Z. Alexander Y. Teewu', 'administrator', 'Administration',
   '📋 Concession Document Vault Filing Reminder',
   'When uploading new Articles of Incorporation or Environmental Clearance certificates, please attach the official PDF copy directly in the Document Vault and tag the associated company legal name.',
   'operational', false, 4,
   '["emyers@geominingec.com", "cmulbah@geominingec.com"]'::jsonb,
   '[]'::jsonb,
   'Yesterday at 15:40')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- END OF SCRIPT — ALL 21 TABLES, RLS POLICIES, STORAGE BUCKETS, AND SEED DATA READY
-- ============================================================================
