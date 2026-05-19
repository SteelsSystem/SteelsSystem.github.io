/* Lex Forensica · Steel Manifold — Service Worker
 * Strategy:
 *   - Navigation requests: network-first with offline fallback to cached shell.
 *   - Same-origin static assets (HTML/CSS/JS/icons/images/svg): stale-while-revalidate.
 *   - Cross-origin (fonts, CDNs): pass-through (network), opportunistically cached on success.
 *   - Range requests / non-GET / chrome-extension: bypassed.
 * Versioned cache names guarantee clean upgrades.
 */
const VERSION = 'v1.0.0-2026-05-19';
const SHELL_CACHE = `lf-shell-${VERSION}`;
const RUNTIME_CACHE = `lf-runtime-${VERSION}`;
const CROSS_CACHE = `lf-cross-${VERSION}`;

// Conservative pre-cache: only the entry points + manifest + icons.
// Other HTML files are large; let runtime cache pick them up on visit.
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifold.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // Use individual adds so a single 404 doesn't kill the install.
    await Promise.all(PRECACHE_URLS.map(async (url) => {
      try {
        const req = new Request(url, { cache: 'reload' });
        const res = await fetch(req);
        if (res && res.ok) await cache.put(url, res.clone());
      } catch (_) { /* tolerate */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => {
      if (k !== SHELL_CACHE && k !== RUNTIME_CACHE && k !== CROSS_CACHE) {
        return caches.delete(k);
      }
      return null;
    }));
    await self.clients.claim();
  })());
});

// Allow page to ask SW to update immediately.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING' || (event.data && event.data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});

function isHTMLRequest(request) {
  if (request.mode === 'navigate') return true;
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

async function networkFirstHTML(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok && fresh.type !== 'opaque') {
      cache.put(request, fresh.clone()).catch(() => {});
    }
    return fresh;
  } catch (_) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    // Offline fallback: try manifold.html, then index, then '/'
    return (await cache.match('./manifold.html'))
        || (await cache.match('./index.html'))
        || (await cache.match('./'))
        || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then((res) => {
    if (res && res.ok && (res.type === 'basic' || res.type === 'cors')) {
      cache.put(request, res.clone()).catch(() => {});
    }
    return res;
  }).catch(() => null);
  return cached || (await networkPromise) || new Response('', { status: 504 });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // Skip range requests — let browser handle media seeking directly.
  if (req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.protocol === 'chrome-extension:' || url.protocol === 'about:') return;

  const sameOrigin = url.origin === self.location.origin;

  if (isHTMLRequest(req)) {
    event.respondWith(networkFirstHTML(req));
    return;
  }

  if (sameOrigin) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
    return;
  }

  // Cross-origin (fonts.googleapis.com, fonts.gstatic.com, etc.)
  event.respondWith(staleWhileRevalidate(req, CROSS_CACHE));
});
