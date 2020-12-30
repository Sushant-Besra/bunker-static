// importScripts(
//   "https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js"
// );

cacheFiles = [
  "/",
  "/index.html",
  "/manifest.json",
  "/Vendor/Images/upi-code.png",
  "/Vendor/Style/style.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css",
]
console.log("In service worker");
// this.addEventListener("install", (e) => {
//   console.log("service worker installed");
//   e.waitUntil(
//     caches.open(CACHE).then((cache) => {
//       cache.addAll(cahchefiles);
//     })
//   );
// });
// this.addEventListener("activate", (e) => {
//   e.waitUntil(
//     caches.keys().then((keys) => {
//       return Promise.all(
//         keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
//       );
//     })
//   );
// });
// this.addEventListener("fetch", (e) => {
//   e.respondWith(
//     caches.match(e.request).then((res) => {
//       if (res) return res;
//       else fetch(e.request)
//     })
//   );
// });


const CACHE_VERSION = 10;
const CURRENT_CACHE = `main-${CACHE_VERSION}`;

// these are the routes we are going to cache for offline support

// on activation we clean up the previously registered service workers
self.addEventListener('activate', evt =>
  evt.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CURRENT_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  )
);

// on install we download the routes we want to cache for offline
self.addEventListener('install', evt =>
  evt.waitUntil(
    caches.open(CURRENT_CACHE).then(cache => {
      return cache.addAll(cacheFiles);
    })
  )
);

// fetch the resource from the network
const fromNetwork = (request, timeout) =>
  new Promise((fulfill, reject) => {
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then(response => {
      clearTimeout(timeoutId);
      fulfill(response);
      update(request);
    }, reject);
  });

// fetch the resource from the browser cache
const fromCache = request =>
  caches
    .open(CURRENT_CACHE)
    .then(cache =>
      cache
        .match(request)
        .then(matching => matching || cache.match('/offline/'))
    );

// cache the current page to make it available for offline
const update = request =>
  caches
    .open(CURRENT_CACHE)
    .then(cache =>
      fetch(request).then(response => cache.put(request, response))
    );

// general strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache)
self.addEventListener('fetch', evt => {
  evt.respondWith(
    fromNetwork(evt.request, 10000).catch(() => fromCache(evt.request))
  );
  evt.waitUntil(update(evt.request));
});