const CACHE_NAME = "my-site-cache-v1";
const urlsToCache = [
    "/", // Cache the root of the site
    "/index.html", // Main HTML file
    "/styles.css", // CSS file
    "/script.js", // Main JavaScript file
    "/images/logo.png" // Example image
];

// Install the service worker and cache static assets
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

// Intercept fetch requests and serve cached responses if available
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // If a cached response exists, return it
            if (response) {
                return response;
            }
            // Otherwise, fetch the request from the network
            return fetch(event.request);
        })
    );
});

// Activate the service worker and clean up old caches
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
