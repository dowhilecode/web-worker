// Service Worker script
const CACHE_NAME = 'news-app-v1';
const CACHED_URLS = [
    '/',
    '/index.html',
    '/app.js',
    '/service-worker.js',
    'https://dummyjson.com/posts'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...', event);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache opened', cache);
                return cache.addAll(CACHED_URLS);
            })
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
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
    console.log('Fetch event for:', event);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    return response;
                }

                // Otherwise, fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Add it to cache
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});

// Push notification event handler
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: 'icon.png',
        badge: 'badge.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('News Update', options)
    );
});

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});
