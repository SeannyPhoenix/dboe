if (!("ServiceWorkerGlobalScope" in self && self instanceof ServiceWorkerGlobalScope)) {
  throw new Error("Not running in ServiceWorkerGlobalScope");
}

const sw = self as ServiceWorkerGlobalScope;

// Bump this whenever precached assets change so clients pick up new versions.
const CACHE_VERSION = 1;
const CACHE_PREFIX = "dboe-";
const CACHE_NAME = `${CACHE_PREFIX}v${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/dboe.js",
  "/dboe.css",
  "/dboe.shared.js",
  "/dboe.webmanifest",
  "/dboe-icon-192.png",
  "/dboe-icon-512.png",
  "/Monaspace Xenon Var.woff2",
  "/Monaspace Neon Var.woff2",
];

sw.addEventListener("install", (event) => {
  console.log("Service worker installing...");
  event.waitUntil(precache().then(() => sw.skipWaiting()));
});

sw.addEventListener("activate", (event) => {
  console.log("Service worker activating...");
  event.waitUntil(deleteOldCaches().then(() => sw.clients.claim()));
});

sw.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== sw.location.origin) {
    return;
  }
  event.respondWith(intercept(event));
});

async function precache(): Promise<void> {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(PRECACHE_URLS);
}

async function deleteOldCaches(): Promise<void> {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key)),
  );
}

async function intercept(event: FetchEvent): Promise<Response> {
  const { request } = event;
  const cache = await caches.open(CACHE_NAME);

  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      event.waitUntil(cache.put(request, response.clone()));
    }
    return response;
  } catch (error) {
    if (request.mode === "navigate") {
      const fallback = await cache.match("/index.html");
      if (fallback) {
        return fallback;
      }
    }
    throw error;
  }
}
