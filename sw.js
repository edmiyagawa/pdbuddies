const CACHE_NAME = "pixie-dust-buddies-v7";
const SHEET_CACHE_KEY = "/api/sheet";
const APP_SHELL = [
  "/",
  "/index.html",
  "/config.js",
  "/app.js",
  "/styles.css",
  "/ship3d.js",
  "/manifest.webmanifest",
  "/data/pd-app-data.json",
  "/assets/pwa-icon.svg",
  "/assets/pwa-icon-192.png",
  "/assets/pwa-icon-512.png",
  "/assets/hero-ship.jpg",
  "/assets/gift-flatlay.jpg",
  "/assets/characters/anna.png",
  "/assets/characters/ariel.png",
  "/assets/characters/aurora.png",
  "/assets/characters/belle.png",
  "/assets/characters/cinderella.png",
  "/assets/characters/elsa.png",
  "/assets/characters/jasmine.png",
  "/assets/characters/lineup-1.png",
  "/assets/characters/lineup-2.png",
  "/assets/characters/lineup-3.png",
  "/assets/characters/lineup-4.png",
  "/assets/characters/lineup-5.png",
  "/assets/characters/lineup-6.png",
  "/assets/characters/lineup-7.png",
  "/assets/characters/lineup-8.png",
  "/assets/characters/lineup-9.png",
  "/assets/characters/lineup-10.png",
  "/assets/characters/merida.png",
  "/assets/characters/moana.png",
  "/assets/characters/mulan.png",
  "/assets/characters/pocahontas.png",
  "/assets/characters/rapunzel.png",
  "/assets/characters/snow-white.png",
  "/assets/characters/tiana.png",
  "/assets/characters/tinkerbell.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "/index.html"));
    return;
  }

  if (url.pathname === "/api/sheet") {
    event.respondWith(networkFirst(request, SHEET_CACHE_KEY));
    return;
  }

  if ([".css", ".js", ".webmanifest"].some((extension) => url.pathname.endsWith(extension))) {
    event.respondWith(networkFirst(request, url.pathname));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(cacheKey(request), response.clone());
    }
    return response;
  } catch (error) {
    return cached || new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function networkFirst(request, fallbackKey) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(fallbackKey || cacheKey(request), response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(fallbackKey || request, { ignoreSearch: true });
    if (cached) return cached;
    const shell = await cache.match("/index.html");
    return shell || new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

function cacheKey(request) {
  const url = new URL(request.url);
  return `${url.pathname}${url.search}`;
}
