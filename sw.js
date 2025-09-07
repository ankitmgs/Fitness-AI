// const CACHE_NAME = 'fittrack-ai-cache-v1';
// // This list includes the essential files for the app shell.
// // You will need to add your own icon files in an /icons/ directory.
// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/index.tsx', // The main script entrypoint
//   '/manifest.json',
//   '/icons/icon-192x192.png',
//   '/icons/icon-512x512.png',
//   '/icons/maskable-icon-512x512.png',
//   // External resources
//   'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
//   'https://cdn.tailwindcss.com'
// ];

// // Install the service worker and cache the app shell
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache) => {
//         console.log('Opened cache and caching app shell');
//         return cache.addAll(urlsToCache);
//       })
//       .catch(err => {
//         console.error('Failed to cache app shell:', err);
//       })
//   );
// });

// // Clean up old caches on activation
// self.addEventListener('activate', (event) => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             console.log('Deleting old cache:', cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// // Serve cached content when offline using a cache-first strategy
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((response) => {
//         // Cache hit - return response
//         if (response) {
//           return response;
//         }

//         // Not in cache - fetch from network
//         return fetch(event.request).then(
//           (response) => {
//             // Check if we received a valid response
//             if (!response || response.status !== 200 || !['basic', 'cors'].includes(response.type)) {
//               return response;
//             }
            
//             // Do not cache API calls
//             if (event.request.url.includes('googleapis.com')) {
//                 return response;
//             }

//             // Clone the response to cache it
//             const responseToCache = response.clone();

//             caches.open(CACHE_NAME)
//               .then((cache) => {
//                 cache.put(event.request, responseToCache);
//               });

//             return response;
//           }
//         );
//       })
//   );
// });
