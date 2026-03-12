self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// This is the "magic" line that makes the Install button appear
self.addEventListener('fetch', (event) => {
  // Logic can be empty, but the listener must exist
});
