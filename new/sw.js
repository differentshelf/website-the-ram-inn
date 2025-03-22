// Service Worker for The Ram Inn website
const CACHE_NAME = 'ram-inn-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/images/ram-inn-hero.jpg',
  '/images/ram-inn-hero-webp.webp',
  '/images/pub-interior.jpg',
  '/images/menu-background.mp4',
  '/images/menu-background-poster.jpg',
  '/images/cotswold-landscape.jpg',
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/favicon.ico',
  '/manifest.json',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css',
  'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
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
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Check if valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Don't cache if it's a Google Maps URL or other external resources
                if (!event.request.url.includes('maps.google.com') && 
                    !event.request.url.includes('maps.googleapis.com') &&
                    !event.request.url.includes('google-analytics.com')) {
                  cache.put(event.request, responseToCache);
                }
              });
              
            return response;
          }
        );
      })
  );
});

// Handle offline fallback
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('index.html');
        })
    );
  }
});
