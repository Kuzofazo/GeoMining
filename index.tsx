import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Website from './Website';

import { HelmetProvider } from 'react-helmet-async';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Website />
    </HelmetProvider>
  </React.StrictMode>
);

// -------------------------------------------------------
// SILENT BACKGROUND UPDATE CHECKER
// No UI shown — users simply see the refreshed site.
// -------------------------------------------------------
let isUpdating = false;

async function enforceVersionUpdate() {
  if (isUpdating) return;
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    if (!res.ok) return;
    const data = await res.json();

    // New version on server — silently refresh
    if (data.version && data.version !== __APP_VERSION__) {
      isUpdating = true;

      // 1. Clear all Service Worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // 2. Unregister all Service Workers
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          await reg.unregister();
        }
      }

      // 3. Hard-reload immediately — no toast, no delay
      window.location.reload();
    }
  } catch {
    // Ignore — offline or server unreachable
  }
}

// -------------------------------------------------------
// SILENT BACKGROUND UPDATE CHECKER & SERVICE WORKER
// Only active in production builds. In development,
// any existing service workers are cleaned up.
// -------------------------------------------------------
if (import.meta.env.PROD) {
  // ---- Event-driven checks (instant on tab focus / reconnect) ----
  window.addEventListener('load', enforceVersionUpdate);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') enforceVersionUpdate();
  });
  window.addEventListener('focus', enforceVersionUpdate);
  window.addEventListener('online', enforceVersionUpdate);

  // ---- Passive polling: 30s when visible, 2 min when backgrounded ----
  (function startVersionPolling() {
    let pollTimer: ReturnType<typeof setTimeout> | null = null;

    function scheduleNextCheck() {
      if (pollTimer) clearTimeout(pollTimer);
      const interval =
        document.visibilityState === 'visible' ? 30_000 : 120_000;
      pollTimer = setTimeout(async () => {
        await enforceVersionUpdate();
        scheduleNextCheck();
      }, interval);
    }

    document.addEventListener('visibilitychange', () => scheduleNextCheck());
    scheduleNextCheck();
  })();

  if ('serviceWorker' in navigator) {
    // Register our update-detecting SW on page load
    window.addEventListener('load', () => {
      registerServiceWorker();
    });
  }
} else {
  // In development: unregister any leftover service workers that may interfere with HMR
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister();
      }
    });
  }
}

async function registerServiceWorker() {
  try {
    // First: unregister any legacy service workers that may be stale
    const existingRegistrations =
      await navigator.serviceWorker.getRegistrations();
    for (const reg of existingRegistrations) {
      // If it's NOT our sw.js (e.g. an old Workbox or other SW), remove it
      if (reg.active?.scriptURL && !reg.active.scriptURL.endsWith('/sw.js')) {
        await reg.unregister();
        console.log(
          '[App] Removed legacy service worker:',
          reg.active.scriptURL
        );
      }
    }

    // Register our update-detecting service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      // updateViaCache: 'none' forces the browser to ALWAYS check the
      // network for a new sw.js on every page load, bypassing HTTP cache.
      // This is the key setting that makes updates instant.
      updateViaCache: 'none',
    });

    console.log('[App] Service Worker registered:', registration.scope);

    // ---- Handle SW update lifecycle ----

    // Case 1: A new SW is waiting (installed but not yet active)
    if (registration.waiting) {
      activateWaitingSW(registration.waiting);
    }

    // Case 2: A new SW finishes installing while page is open
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (
          newWorker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          // New version available and ready — activate it immediately
          console.log('[App] New SW version available — activating...');
          activateWaitingSW(newWorker);
        }
      });
    });

    // Case 3: SW controller changed (new SW took control) → reload page
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log(
        '[App] SW controller changed — reloading for latest version...'
      );
      window.location.reload();
    });

    // Check for updates every 60 seconds (catches updates even without a fresh page load)
    setInterval(() => {
      registration.update().catch(() => {
        // Silently ignore update check failures (offline, etc.)
      });
    }, 60_000);
  } catch (error) {
    console.error('[App] Service Worker registration failed:', error);
  }
}

/**
 * Tells a waiting Service Worker to skip waiting and activate immediately.
 * This triggers the 'controllerchange' event above, which reloads the page.
 */
function activateWaitingSW(worker: ServiceWorker) {
  worker.postMessage({ type: 'SKIP_WAITING' });
}
