const CACHE_NAME = 'samsi-app-cache-v2'; // v2 to ensure update
const urlsToCache = [
'/',
'/index.html',
'/manifest.json',
'https://raw.githubusercontent.com/aatekaansari/SipahiBaba/main/logo.png',
'https://raw.githubusercontent.com/aatekaansari/SipahiBaba/main/icon-192x192.png',
'https://raw.githubusercontent.com/aatekaansari/SipahiBaba/main/icon-512x512.png',
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

// Network first for html, and cache first for others
if (event.request.mode === 'navigate') {
event.respondWith(
fetch(event.request).catch(() => caches.match(event.request))
);
return;
}

event.respondWith(
caches.match(event.request)
.then(function(response) {
return response || fetch(event.request).then(fetchResponse => {
return caches.open(CACHE_NAME).then(cache => {
cache.put(event.request, fetchResponse.clone());
return fetchResponse;
});
});
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
