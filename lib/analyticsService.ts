// ─── Analytics Service ────────────────────────────────────────────────────────
// Fetches analytics data from Supabase, falls back to realistic demo data
// if the table hasn't been set up yet.

import { supabase } from './supabase';

export interface DailyMetric {
  date: string;
  label: string;
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  bounceRate: number;
  avgDuration: number;
}

export interface TopPage {
  page: string;
  views: number;
  pct: number;
}

export interface DeviceBreakdown {
  mobile: number;
  desktop: number;
  tablet: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number; // seconds
  bounceRate: number; // percent
  pageViewsChange: number; // % change vs prev period
  uniqueVisitorsChange: number;
  topPages: TopPage[];
  deviceBreakdown: DeviceBreakdown;
  trafficSources: TrafficSource[];
  trend: DailyMetric[];
  isDemo: boolean;
}

// ── Demo data generator ───────────────────────────────────────────────────────

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PAGE_NAMES = [
  '/',
  '/services',
  '/about-us',
  '/contact',
  '/blog',
  '/projects-services',
  '/gallery',
  '/careers',
  '/sustainability',
  '/our-team',
];

function buildDemoTrend(days: number): DailyMetric[] {
  const result: DailyMetric[] = [];
  const base = 120;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const multiplier = isWeekend ? 0.6 : 1 + Math.random() * 0.4;
    const views = Math.round(base * multiplier + randomInt(-15, 15));
    const unique = Math.round(views * 0.65 + randomInt(-10, 10));
    const sessions = Math.round(views * 0.72 + randomInt(-8, 8));
    const bounces = Math.round(sessions * (0.38 + Math.random() * 0.15));
    result.push({
      date: dateStr,
      label,
      pageViews: views,
      uniqueVisitors: unique,
      sessions,
      bounceRate: Math.round((bounces / sessions) * 100),
      avgDuration: randomInt(90, 240),
    });
  }
  return result;
}

function buildDemoSummary(days: number): AnalyticsSummary {
  const trend = buildDemoTrend(days);
  const totalViews = trend.reduce((s, r) => s + r.pageViews, 0);
  const totalUnique = trend.reduce((s, r) => s + r.uniqueVisitors, 0);
  const avgBounce = Math.round(
    trend.reduce((s, r) => s + r.bounceRate, 0) / trend.length
  );
  const avgDuration = Math.round(
    trend.reduce((s, r) => s + r.avgDuration, 0) / trend.length
  );
  const topPages: TopPage[] = PAGE_NAMES.map((p) => ({
    page: p,
    views: randomInt(30, 400),
    pct: 0,
  })).sort((a, b) => b.views - a.views);
  const totalTopViews = topPages.reduce((s, p) => s + p.views, 0);
  topPages.forEach((p) => {
    p.pct = Math.round((p.views / totalTopViews) * 100);
  });
  return {
    totalPageViews: totalViews,
    uniqueVisitors: totalUnique,
    avgSessionDuration: avgDuration,
    bounceRate: avgBounce,
    pageViewsChange: randomInt(-8, 22),
    uniqueVisitorsChange: randomInt(-5, 18),
    topPages: topPages.slice(0, 8),
    deviceBreakdown: { mobile: 54, desktop: 37, tablet: 9 },
    trafficSources: [
      { name: 'Direct', value: 42, color: '#2d5a27' },
      { name: 'Search', value: 33, color: '#3b82f6' },
      { name: 'Social', value: 18, color: '#f59e0b' },
      { name: 'Other', value: 7, color: '#94a3b8' },
    ],
    trend,
    isDemo: true,
  };
}

// ── Supabase fetcher ──────────────────────────────────────────────────────────

async function fetchFromSupabase(
  days: number
): Promise<AnalyticsSummary | null> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('site_analytics')
    .select('*')
    .gte('date', sinceStr)
    .order('date', { ascending: true });

  if (error || !data || data.length === 0) return null;

  // Build trend (group by date)
  const byDate = new Map<string, DailyMetric>();
  for (const row of data) {
    const existing = byDate.get(row.date);
    if (existing) {
      existing.pageViews += row.page_views ?? 0;
      existing.uniqueVisitors += row.unique_visits ?? 0;
      existing.sessions += row.sessions ?? 0;
      existing.bounceRate = 0; // recalc below
    } else {
      byDate.set(row.date, {
        date: row.date,
        label: new Date(row.date + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        pageViews: row.page_views ?? 0,
        uniqueVisitors: row.unique_visits ?? 0,
        sessions: row.sessions ?? 0,
        bounceRate: 0,
        avgDuration: Math.round(
          (row.total_duration_sec ?? 0) / Math.max(row.sessions ?? 1, 1)
        ),
      });
    }
  }

  const trend = [...byDate.values()];

  // Aggregate top pages
  const pageMap = new Map<string, number>();
  for (const row of data) {
    pageMap.set(row.page, (pageMap.get(row.page) ?? 0) + (row.page_views ?? 0));
  }
  const topPages = [...pageMap.entries()]
    .map(([page, views]) => ({ page, views, pct: 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);
  const totalTopViews = topPages.reduce((s, p) => s + p.views, 0);
  topPages.forEach((p) => {
    p.pct = totalTopViews > 0 ? Math.round((p.views / totalTopViews) * 100) : 0;
  });

  // Device totals
  const mobile = data.reduce((s, r) => s + (r.device_mobile ?? 0), 0);
  const desktop = data.reduce((s, r) => s + (r.device_desktop ?? 0), 0);
  const tablet = data.reduce((s, r) => s + (r.device_tablet ?? 0), 0);
  const totalDev = mobile + desktop + tablet || 1;

  // Traffic sources
  const direct = data.reduce((s, r) => s + (r.referrer_direct ?? 0), 0);
  const search = data.reduce((s, r) => s + (r.referrer_search ?? 0), 0);
  const social = data.reduce((s, r) => s + (r.referrer_social ?? 0), 0);
  const other = data.reduce((s, r) => s + (r.referrer_other ?? 0), 0);
  const totalRef = direct + search + social + other || 1;

  const totalViews = trend.reduce((s, r) => s + r.pageViews, 0);
  const totalUnique = trend.reduce((s, r) => s + r.uniqueVisitors, 0);
  const totalSessions = trend.reduce((s, r) => s + r.sessions, 0);
  const totalBounce = data.reduce((s, r) => s + (r.bounce_count ?? 0), 0);
  const totalDuration = data.reduce(
    (s, r) => s + (r.total_duration_sec ?? 0),
    0
  );

  return {
    totalPageViews: totalViews,
    uniqueVisitors: totalUnique,
    avgSessionDuration:
      totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0,
    bounceRate:
      totalSessions > 0 ? Math.round((totalBounce / totalSessions) * 100) : 0,
    pageViewsChange: 0,
    uniqueVisitorsChange: 0,
    topPages,
    deviceBreakdown: {
      mobile: Math.round((mobile / totalDev) * 100),
      desktop: Math.round((desktop / totalDev) * 100),
      tablet: Math.round((tablet / totalDev) * 100),
    },
    trafficSources: [
      {
        name: 'Direct',
        value: Math.round((direct / totalRef) * 100),
        color: '#2d5a27',
      },
      {
        name: 'Search',
        value: Math.round((search / totalRef) * 100),
        color: '#3b82f6',
      },
      {
        name: 'Social',
        value: Math.round((social / totalRef) * 100),
        color: '#f59e0b',
      },
      {
        name: 'Other',
        value: Math.round((other / totalRef) * 100),
        color: '#94a3b8',
      },
    ],
    trend,
    isDemo: false,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly';

export async function getAnalytics(
  period: AnalyticsPeriod
): Promise<AnalyticsSummary> {
  const days = period === 'daily' ? 30 : period === 'weekly' ? 90 : 365;
  try {
    const real = await fetchFromSupabase(days);
    if (real) return real;
  } catch {
    /* fall through to demo */
  }
  return buildDemoSummary(days);
}

export async function checkAnalyticsTableExists(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('site_analytics')
      .select('id')
      .limit(1);
    return !error;
  } catch {
    return false;
  }
}
