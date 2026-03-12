const CACHE_NAME = 'pulse-v1';

// Install event: activates the service worker immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event: takes control of the page immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch event: Mandatory for the "Install" button to appear in Chrome
self.addEventListener('fetch', (event) => {
  // We leave this empty to allow normal network behavior 
  // while still satisfying PWA requirements.
});
