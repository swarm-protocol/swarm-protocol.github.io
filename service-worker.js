const CACHE_NAME = 'special-needs-pwa-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './public/',
  './public/index.html',
  './public/emotes/',
  './public/emotes/index.html',
  './public/emotes/manifest.json',
  './public/emotes/icon-192.png',
  './public/emotes/icon-512.png',
  './public/nopaste/',
  './public/nopaste/index.html',
  './public/nopaste/style.css',
  './public/nopaste/script.js',
  './public/feeds/',
  './public/feeds/index.html',
  './public/filehost/',
  './public/filehost/index.html',
  './public/blog/',
  './public/blog/index.html',
  './public/irc/',
  './public/irc/index.html'
];

const updateCache = (request, response) =>
  caches.open(CACHE_NAME)
    .then(cache => cache.put(request, response)
      .catch(err => console.warn('Cache put failed for', request.url, err)))
    .catch(err => console.warn('Cache open failed for', request.url, err));

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('special-needs-pwa-') && key !== CACHE_NAME).map(key => caches.delete(key))
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
          if (response && response.ok && (response.type === 'basic' || response.type === 'default')) {
            const copy = response.clone();
            event.waitUntil(
              updateCache(event.request, copy)
            );
          }
          return response;
        })
        .catch(err => {
          console.warn('Navigation fetch failed, falling back to cache', err);
          return caches.match(event.request).then(cached => cached || caches.match('./index.html'));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) {
          event.waitUntil(
            fetch(event.request)
              .then(response => {
                if (response.ok) {
                  const copy = response.clone();
                  return updateCache(event.request, copy);
                }
              })
              .catch(err => console.warn('Resource refresh failed', err))
          );
          return cached;
        }
        return fetch(event.request)
          .then(response => {
            if (response.ok) {
              const copy = response.clone();
              event.waitUntil(
                updateCache(event.request, copy)
              );
            }
            return response;
          })
          .catch(err => {
            console.warn('Resource fetch failed', err);
            const acceptsHtml = event.request.headers.get('accept')?.includes('text/html');
            if (acceptsHtml) {
              return new Response(
                '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Offline</title></head><body><main><p>Resource unavailable while offline. Reconnect and try again.</p></main></body></html>',
                { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/html' } }
              );
            }
            return new Response('Resource unavailable: offline.', {
              status: 503,
              statusText: 'Offline',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});
