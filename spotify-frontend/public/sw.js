self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Mandatory for PWA Install button to show up
self.addEventListener('fetch', (event) => {
  // Can be empty, but MUST exist
});
