const CACHE_NAME = 'pulse-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// THIS IS THE FIX: It must respond to a fetch to trigger the Install icon
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response("Offline");
    })
  );
});
