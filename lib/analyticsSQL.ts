// ─── Analytics SQL ────────────────────────────────────────────────────────────
// Run this SQL in your Supabase SQL Editor to enable the Analytics Dashboard.

export const ANALYTICS_TABLE_SQL = `
-- site_analytics: one row per page per day
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date          date NOT NULL,
  page          text NOT NULL DEFAULT '/',
  page_views    integer NOT NULL DEFAULT 0,
  unique_visits integer NOT NULL DEFAULT 0,
  sessions      integer NOT NULL DEFAULT 0,
  bounce_count  integer NOT NULL DEFAULT 0,
  total_duration_sec integer NOT NULL DEFAULT 0,
  device_mobile integer NOT NULL DEFAULT 0,
  device_desktop integer NOT NULL DEFAULT 0,
  device_tablet integer NOT NULL DEFAULT 0,
  referrer_direct  integer NOT NULL DEFAULT 0,
  referrer_search  integer NOT NULL DEFAULT 0,
  referrer_social  integer NOT NULL DEFAULT 0,
  referrer_other   integer NOT NULL DEFAULT 0,
  country          text,
  created_at    timestamptz DEFAULT now(),
  UNIQUE (date, page)
);

-- Allow anonymous inserts (tracker runs on public site)
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_anon_insert" ON public.site_analytics
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_anon_select" ON public.site_analytics
  FOR SELECT TO anon USING (true);

-- Index for fast range queries
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.site_analytics (date DESC);
`.trim();
