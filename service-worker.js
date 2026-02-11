const CACHE_NAME = 'special-needs-pwa-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, copy))
              .catch(err => console.warn('Cache update failed', err))
          );
          return response;
        })
        .catch(err => {
          console.warn('Navigation fetch failed, falling back to cached index.html', err);
          return caches.match('./index.html');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(event.request)
          .then(response => {
            if (response.ok) {
              const copy = response.clone();
              event.waitUntil(
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, copy))
                  .catch(err => console.warn('Cache update failed', err))
              );
            }
            return response;
          })
          .catch(err => {
            console.warn('Resource fetch failed', err);
            return new Response('', { status: 504, statusText: 'Offline' });
          });
      })
  );
});
