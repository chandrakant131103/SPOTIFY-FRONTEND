self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Desktop Chrome needs this fetch handler to enable the install icon
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
