/* AGEx Grand Plaza Service Worker (Safe, minimal, reliable) */
const VERSION = "v7"; // change this anytime you want to force-update
const CACHE = `agex-grandplaza-${VERSION}`;

const ASSETS = [
  "./",
  "./index.html",
  "./app.html",
  "./admin.html",
  "./styles.css",
  "./app.js",
  "./config.js",
  "./manifest.json",
  "./icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

/**
 * Strategy:
 * - For navigation (opening pages), always try network first, then cache.
 * - For static assets, cache-first.
 */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle our own origin
  if (url.origin !== self.location.origin) return;

  // NAVIGATION: network-first (prevents sticky 404 / old HTML)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match(req)).catch(() => caches.match("./app.html"))
    );
    return;
  }

  // ASSETS: cache-first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
