// ── Field Hub Service Worker ──────────────────────────────────────────────────
// Strategy: Cache-first for assets, Network-first for HTML pages
// Update the CACHE_VERSION when deploying new releases
// ──────────────────────────────────────────────────────────────────────────────

const CACHE_VERSION  = 'v1.1.0';
const STATIC_CACHE   = `field-hub-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE  = `field-hub-dynamic-${CACHE_VERSION}`;

// Files to pre-cache on install (app shell)
const PRECACHE_URLS = [
  '/workFr0g/',
  '/workFr0g/index.html',
  '/workFr0g/manifest.json',
  '/workFr0g/xcmg-reference/index.html',
  '/workFr0g/quick-reference/index.html',
  '/workFr0g/gas-symbols/index.html',
  '/workFr0g/charging-guide/index.html',
  '/workFr0g/icons/icon-180.png',
  '/workFr0g/icons/icon-192.png',
  '/workFr0g/icons/icon-512.png',
];

// Max entries in the dynamic runtime cache
const DYNAMIC_CACHE_LIMIT = 60;

// ── Install: pre-cache shell ──────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Install', CACHE_VERSION);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activate', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // HTML pages → Network-first (fresh content when online, fallback to cache)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Everything else → Cache-first (fast load, update in background)
  event.respondWith(cacheFirst(request));
});

// ── Strategies ───────────────────────────────────────────────────────────────

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? offlineFallback(request);
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await trimCache(DYNAMIC_CACHE, DYNAMIC_CACHE_LIMIT);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return offlineFallback(request);
  }
}

function offlineFallback(request) {
  // Return the cached hub root as a fallback for unknown HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    return caches.match('/workFr0g/index.html');
  }
  return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
}

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys  = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
  }
}

// ── Background sync placeholder (for future DLR submission) ──────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-dlr') {
    console.log('[SW] Background sync: DLR');
    // TODO: flush queued daily log submissions
  }
});
