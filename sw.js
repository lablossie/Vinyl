// Service worker: cachet de app-schil zodat de app ook offline (deels) opent.
// Verhoog CACHE_NAME bij elke inhoudelijke wijziging om de cache te forceren te vernieuwen.

const CACHE_NAME = 'platenkast-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/utils.js',
  './js/data/seedRecords.js',
  './js/state.js',
  './js/photoRecognize.js',
  './js/render/modal.js',
  './js/render/instellingen.js',
  './js/render/artiestenLijst.js',
  './js/render/artiestDetail.js',
  './js/render/albumDetail.js',
  './js/render/alleRecords.js',
  './js/render/wenslijst.js',
  './js/render/toevoegen.js',
  './js/router.js',
  './js/auth.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API-aanroepen altijd live ophalen, nooit uit de cache.
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (event.request.method === 'GET' && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
