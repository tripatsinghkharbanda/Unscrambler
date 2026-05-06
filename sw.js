/* Unscramble Words Pro — Service Worker v1
   Strategy:
   - App-shell assets: cache-first (instant repeat visits)
   - HTML pages:       network-first with cache fallback (fresh content preferred)
   - CDN resources:    stale-while-revalidate
*/
const CACHE_NAME = 'wup-shell-v1';
const PRECACHE = [
  '/',
  '/app.js',
  '/dictionary.js',
  '/favicon.svg',
  '/theme-toggle.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // App-shell assets: cache-first
  if (PRECACHE.includes(url.pathname) || url.pathname.endsWith('.js') || url.pathname.endsWith('.svg')) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return resp;
        })
      )
    );
    return;
  }

  // HTML pages: network-first, fall back to cache
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
});
