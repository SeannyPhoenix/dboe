// src/serviceWorker/dboe.service.ts
if (!("ServiceWorkerGlobalScope" in self && self instanceof ServiceWorkerGlobalScope)) {
  throw new Error("Not running in ServiceWorkerGlobalScope");
}
var addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
  console.log("Resources added to cache:", resources);
};
self.oninstall = (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/dboe.js",
      "/dboe.css",
      "/dboe.shared.js",
      "/dboeportal.webmanifest"
    ])
  );
};
self.onfetch = async (event) => {
  event.respondWith(intercept(event.request));
};
async function intercept(request) {
  try {
    const match = await caches.match(request);
    if (match) {
      return match;
    }
  } catch (error) {
    console.error("Error intercepting request:", error);
  }
  return fetch(request);
}
