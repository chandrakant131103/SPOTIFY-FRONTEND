const CACHE_NAME = 'pulse-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// This fetch listener is mandatory for the "Install" button to appear
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
