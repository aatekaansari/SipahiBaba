const CACHE_NAME = 'samsi-app-cache-v3'; // Cache version updated to ensure changes apply
const urlsToCache = [
'./', // Caches the root page (index.html)
'./index.html',
'./manifest.json',
'./logo.png',
'./icon-192x192.png',
'./icon-512x512.png',
'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',
'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(function(cache) {
console.log('Opened cache');
return cache.addAll(urlsToCache);
})
);
self.skipWaiting();
});

self.addEventListener('fetch', event => {
if (event.request.method !== 'GET') {
return;
}
event.respondWith(
caches.match(event.request)
.then(function(response) {
if (response) {
return response;
}
return fetch(event.request);
})
);
});

self.addEventListener('activate', event => {
const cacheWhitelist = [CACHE_NAME];
event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames.map(cacheName => {
if (cacheWhitelist.indexOf(cacheName) === -1) {
return caches.delete(cacheName);
}
})
);
})
);
self.clients.claim();
});
