/**
 * GeoMining EC - Update-Detecting Service Worker
 *
 * Strategy:
 * - index.html  → Network-first (always fetch fresh, fallback to cache)
 * - Assets      → Cache-first (Vite content-hashes guarantee freshness)
 * - API calls   → Network-only (never cache dynamic data)
 *
 * On activation, this SW immediately takes control of all open clients
 * and forces a page reload so users always see the latest version.
 */

const SW_VERSION = '__SW_VERSION__'; // Replaced at build time by vite plugin
const CACHE_NAME = `geomining-v${SW_VERSION}`;

// Assets that should be cached long-term (Vite hashed files)
const ASSET_CACHE_PATTERNS = [
  /\/assets\/.*\.(js|css|woff2?|png|jpg|jpeg|svg|webp|avif|ico)$/,
];

// Requests that should NEVER be cached
const NEVER_CACHE_PATTERNS = [
  /\/supabase_api\//,
  /supabase\.co/,
  /\/api\//,
  /\.php/,
  /formspree\.io/,
  /formsubmit\.co/,
  /googleapis\.com\/css/, // Google Fonts CSS (has its own caching)
  /chrome-extension/,
  /version\.json/,
  /manifest\.json/,
  /sw\.js/,
];

// -------------------------------------------------------
// INSTALL: Pre-cache shell (index.html only)
// -------------------------------------------------------
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing version: ${SW_VERSION}`);

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Cache the app shell
        return cache.addAll(['/']);
      })
      .then(() => {
        // Skip waiting: activate immediately, don't wait for old tabs to close
        return self.skipWaiting();
      })
  );
});

// -------------------------------------------------------
// ACTIVATE: Clean old caches, take control immediately
// -------------------------------------------------------
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating version: ${SW_VERSION}`);

  event.waitUntil(
    Promise.all([
      // Delete ALL old caches that don't match current version
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log(`[SW] Deleting old cache: ${name}`);
              return caches.delete(name);
            })
        );
      }),
      // Immediately claim all open clients (tabs/windows)
      self.clients.claim(),
    ])
  );
});

// -------------------------------------------------------
// FETCH: Intelligent routing strategy
// -------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Never cache API calls or 3rd-party dynamic requests
  if (NEVER_CACHE_PATTERNS.some((pattern) => pattern.test(request.url))) {
    event.respondWith(fetch(request));
    return;
  }

  // STRATEGY 1: Network-first for HTML (index.html / navigation)
  if (
    request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // STRATEGY 2: Cache-first for hashed Vite assets
  if (ASSET_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // STRATEGY 3: Network-first for everything else
  event.respondWith(networkFirstStrategy(request));
});

// -------------------------------------------------------
// STRATEGY: Network-First (HTML, dynamic content)
// Always tries network, falls back to cache if offline
// -------------------------------------------------------
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed: serve from cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log(`[SW] Serving from cache (offline): ${request.url}`);
      return cachedResponse;
    }

    // No cache either: serve offline page or error
    return new Response('Offline - please check your internet connection', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// -------------------------------------------------------
// STRATEGY: Cache-First (Vite hashed assets)
// Serves from cache instantly, fetches and updates cache in background
// -------------------------------------------------------
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  // Not in cache yet: fetch, cache, return
  const networkResponse = await fetch(request);
  if (networkResponse && networkResponse.status === 200) {
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

// -------------------------------------------------------
// MESSAGE: Allow clients to trigger SW update check
// -------------------------------------------------------
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: SW_VERSION });
  }
});
