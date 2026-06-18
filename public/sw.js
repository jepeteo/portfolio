// Service worker intentionally retired.
//
// Why: Vercel already serves hashed /assets/ and /images/ with
// `Cache-Control: public, max-age=31536000, immutable`, so the browser HTTP
// cache handles repeat-visit asset caching. A custom caching service worker was
// therefore redundant and risked serving stale HTML and outdated SEO metadata
// (the previous version also carried dead `/portfolio/` path rules and unused
// push / background-sync code).
//
// This tombstone clears any caches created by the old service worker and
// unregisters itself, so previously-installed clients are cleaned up on their
// next visit. New visitors install it once and it immediately removes itself.

// Kept (empty) so scripts/verify-sw-precache.js can still parse the file.
const STATIC_ASSETS = []
void STATIC_ASSETS

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.clients.claim()
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: "window" })
      clients.forEach((client) => client.navigate(client.url))
    })()
  )
})
