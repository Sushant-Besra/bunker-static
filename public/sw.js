// importScripts(
//   "https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js"
// );
console.log("In service worker");
const CACHE = "sw01";
this.addEventListener("install", (e) => {
  console.log("service worker installed");
  e.waitUntil(
    caches.open(CACHE).then((cache) => {
      cache.addAll([
        "/index.html",
        "/manifest.json",
        "/Vendor/Images/upi-code.png",
        "/Vendor/Style/style.css",
        "https://source.unsplash.com/700x220/?dark",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css",
      ]);
    })
  );
});
this.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      );
    })
  );
});
this.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;
      else fetch(e.request)
    })
  );
});

// workbox.routing.registerRoute(
//     ({request})=> request.destination === "image",
//     new workbox.strategies.CacheFirst()
// )
// // workbox.routing.registerRoute(
// //     new RegExp('/Vendor/js/.*\\.js'),
// //     new workbox.strategies.CacheFirst()
// // )
// workbox.routing.registerRoute(
//     new RegExp('/Vendor/Style/.*\\.css'),
//     new workbox.strategies.CacheFirst()
// )
// workbox.routing.registerRoute(
//     "/index.html",
//     new workbox.strategies.CacheFirst()
// )
