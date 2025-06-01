// Weather Widget Service Worker
const CACHE_NAME = 'weather-cache-v1';
const OFFLINE_URL = '/service/weather-widget/offline.json';

// Files to cache
const CACHED_URLS = [
    '/service/weather-widget/',
    '/service/weather-widget/index.html',
    '/service/weather-widget/weather-app.js',
    '/service/weather-widget/offline.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    console.log('Weather Widget Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(CACHED_URLS);
            })
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    console.log('Weather Widget Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event handler
self.addEventListener('fetch', (event) => {
    // Only handle API requests
    if (event.request.url.includes('/api/weather')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    // Cache the fresh data
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                })
                .catch(() => {
                    // If network fails, try to return cached data
                    return caches.match(event.request)
                        .then((response) => {
                            if (response) {
                                return response;
                            }
                            // If no cached data, return offline data
                            return caches.match(OFFLINE_URL);
                        });
                })
        );
    } else {
        // For non-API requests, use standard cache-first strategy
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                })
        );
    }
});
