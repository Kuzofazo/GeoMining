// ─── Analytics Tracker ────────────────────────────────────────────────────────
// Runs on the PUBLIC site. Tracks page views and upserts daily aggregates
// into the Supabase `site_analytics` table. Completely cookie-free.

import { supabase } from './supabase';

const SESSION_KEY = 'gm_session_id';
const VISITED_KEY = 'gm_visited_pages';
const BOUNCE_TIMEOUT = 30_000; // 30 s without interaction = potential bounce

// ── Helpers ──────────────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function getReferrerCategory(): 'direct' | 'search' | 'social' | 'other' {
  const ref = document.referrer;
  if (!ref) return 'direct';
  if (/google|bing|yahoo|duckduckgo|baidu/i.test(ref)) return 'search';
  if (/facebook|twitter|instagram|linkedin|tiktok|x\.com/i.test(ref))
    return 'social';
  return 'other';
}

function getVisitedPages(): Set<string> {
  try {
    const raw = sessionStorage.getItem(VISITED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markPageVisited(page: string): boolean {
  const visited = getVisitedPages();
  const isNew = !visited.has(page);
  visited.add(page);
  try {
    sessionStorage.setItem(VISITED_KEY, JSON.stringify([...visited]));
  } catch {
    /* ignore */
  }
  return isNew;
}

// ── Main Tracker ─────────────────────────────────────────────────────────────

export async function trackPageView(): Promise<void> {
  try {
    const page = window.location.pathname || '/';
    const date = getTodayDate();
    const device = getDeviceType();
    const referrer = getReferrerCategory();
    const isUniqueVisit = markPageVisited(page);

    // Session tracking
    getOrCreateSessionId();

    // Build the increment payload
    const deviceIncrement = {
      device_mobile: device === 'mobile' ? 1 : 0,
      device_desktop: device === 'desktop' ? 1 : 0,
      device_tablet: device === 'tablet' ? 1 : 0,
    };

    const referrerIncrement = {
      referrer_direct: referrer === 'direct' ? 1 : 0,
      referrer_search: referrer === 'search' ? 1 : 0,
      referrer_social: referrer === 'social' ? 1 : 0,
      referrer_other: referrer === 'other' ? 1 : 0,
    };

    // Try upsert via RPC (increment) or plain upsert
    const { error } = await supabase.rpc('upsert_analytics', {
      p_date: date,
      p_page: page,
      p_unique: isUniqueVisit ? 1 : 0,
      p_device_mobile: deviceIncrement.device_mobile,
      p_device_desktop: deviceIncrement.device_desktop,
      p_device_tablet: deviceIncrement.device_tablet,
      p_referrer_direct: referrerIncrement.referrer_direct,
      p_referrer_search: referrerIncrement.referrer_search,
      p_referrer_social: referrerIncrement.referrer_social,
      p_referrer_other: referrerIncrement.referrer_other,
    });

    // Fallback: plain upsert if RPC doesn't exist yet
    if (error) {
      await supabase.from('site_analytics').upsert(
        {
          date,
          page,
          page_views: 1,
          unique_visits: isUniqueVisit ? 1 : 0,
          sessions: 1,
          ...deviceIncrement,
          ...referrerIncrement,
        },
        { onConflict: 'date,page', ignoreDuplicates: false }
      );
    }

    // Bounce detection: set a flag, clear it on interaction
    let bounceTimer: ReturnType<typeof setTimeout> | null = null;
    const clearBounce = async () => {
      if (bounceTimer) {
        clearTimeout(bounceTimer);
        bounceTimer = null;
      }
      // User interacted — not a bounce, no action needed
      document.removeEventListener('click', clearBounce);
      document.removeEventListener('scroll', clearBounce);
      document.removeEventListener('keydown', clearBounce);
    };

    bounceTimer = setTimeout(async () => {
      // User didn't interact within timeout — count as bounce
      await supabase
        .from('site_analytics')
        .update({ bounce_count: 1 })
        .eq('date', date)
        .eq('page', page);
    }, BOUNCE_TIMEOUT);

    document.addEventListener('click', clearBounce, { once: true });
    document.addEventListener('scroll', clearBounce, { once: true });
    document.addEventListener('keydown', clearBounce, { once: true });
  } catch {
    // Silently fail — never break the public site
  }
}

// ── Init (call once at app root) ─────────────────────────────────────────────
export function initAnalyticsTracker(): void {
  // Track initial page load
  trackPageView();
}
