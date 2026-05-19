// DocVault Service Worker — caches the app shell for full offline use
const CACHE_NAME = 'docvault-v1';

// The single HTML file IS the entire app (all JS/CSS inlined)
const ASSETS = [
  './DocVault.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      // For any uncached request, try network, then fall back silently
      return fetch(event.request).catch(() => cached);
    })
  );
});
