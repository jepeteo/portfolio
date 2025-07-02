// Enhanced Service Worker for Portfolio (2025)
// Implements advanced caching strategies and performance optimizations

const CACHE_NAME = 'portfolio-cache-v2-2025'
const STATIC_CACHE = 'portfolio-static-v2'
const DYNAMIC_CACHE = 'portfolio-dynamic-v2'
const IMAGE_CACHE = 'portfolio-images-v2'

// Resources to cache immediately
const STATIC_ASSETS = [
    '/portfolio/',
    '/portfolio/index.html',
    '/portfolio/manifest.json',
    // Core CSS and JS will be added dynamically
]

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
    // Static assets - Cache First
    static: [
        /\.(js|css|woff2?|ttf|eot)$/,
        /\/portfolio\/assets\//
    ],

    // Images - Cache First with fallback
    images: [
        /\.(png|jpg|jpeg|gif|webp|svg|ico)$/
    ],

    // API calls - Network First
    api: [
        /\/api\//,
        /formspree\.io/,
        /emailjs\.com/
    ],

    // HTML pages - Network First with cache fallback
    pages: [
        /\/portfolio\/.*\.html$/,
        /\/portfolio\/$/
    ]
}

// Install event - cache critical resources
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker v2...')

    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                return cache.addAll(STATIC_ASSETS)
            }),

            // Cache critical fonts and styles
            caches.open(IMAGE_CACHE).then(cache => {
                return cache.addAll([
                    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
                    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhiJ-Ek-_EeA.woff2'
                ]).catch(() => {
                    // Font loading failures are non-critical
                    console.warn('[SW] Failed to cache fonts')
                })
            })
        ]).then(() => {
            console.log('[SW] Installation complete')
            // Force activation of new service worker
            return self.skipWaiting()
        })
    )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker v2...')

    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE &&
                            cacheName !== DYNAMIC_CACHE &&
                            cacheName !== IMAGE_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName)
                            return caches.delete(cacheName)
                        }
                    })
                )
            }),

            // Take control of all clients
            self.clients.claim()
        ]).then(() => {
            console.log('[SW] Activation complete')
        })
    )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return
    }

    // Skip chrome-extension and other special schemes
    if (!url.protocol.startsWith('http')) {
        return
    }

    event.respondWith(handleRequest(request))
})

// Enhanced request handling with multiple caching strategies
async function handleRequest(request) {
    const url = new URL(request.url)

    try {
        // Static assets - Cache First strategy
        if (CACHE_STRATEGIES.static.some(pattern => pattern.test(url.pathname))) {
            return await cacheFirst(request, STATIC_CACHE)
        }

        // Images - Cache First with long TTL
        if (CACHE_STRATEGIES.images.some(pattern => pattern.test(url.pathname))) {
            return await cacheFirst(request, IMAGE_CACHE)
        }

        // API calls - Network First
        if (CACHE_STRATEGIES.api.some(pattern => pattern.test(url.href))) {
            return await networkFirst(request, DYNAMIC_CACHE)
        }

        // HTML pages - Network First with stale-while-revalidate
        if (CACHE_STRATEGIES.pages.some(pattern => pattern.test(url.pathname))) {
            return await staleWhileRevalidate(request, DYNAMIC_CACHE)
        }

        // Default: Network First for everything else
        return await networkFirst(request, DYNAMIC_CACHE)

    } catch (error) {
        console.error('[SW] Request failed:', error)

        // Return offline fallback for navigation requests
        if (request.mode === 'navigate') {
            const cache = await caches.open(STATIC_CACHE)
            return await cache.match('/portfolio/index.html') ||
                new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
        }

        throw error
    }
}

// Cache First strategy - good for static assets
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)

    if (cached) {
        // Return cached version immediately
        return cached
    }

    // Fetch from network and cache
    const response = await fetch(request)
    if (response.status === 200) {
        cache.put(request, response.clone())
    }
    return response
}

// Network First strategy - good for API calls
async function networkFirst(request, cacheName, timeout = 3000) {
    const cache = await caches.open(cacheName)

    try {
        // Try network first with timeout
        const networkResponse = await Promise.race([
            fetch(request),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Network timeout')), timeout)
            )
        ])

        // Cache successful responses
        if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone())
        }
        return networkResponse

    } catch (error) {
        // Fall back to cache
        const cached = await cache.match(request)
        if (cached) {
            console.warn('[SW] Network failed, serving from cache:', request.url)
            return cached
        }
        throw error
    }
}

// Stale While Revalidate strategy - good for pages
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)

    // Start fetch in background
    const fetchPromise = fetch(request).then(response => {
        if (response.status === 200) {
            cache.put(request, response.clone())
        }
        return response
    }).catch(() => {
        // Network error - cached version will be returned
    })

    // Return cached version immediately if available
    if (cached) {
        return cached
    }

    // Wait for network if no cache
    return await fetchPromise
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync())
    }
})

async function doBackgroundSync() {
    console.log('[SW] Performing background sync...')
    // Implement background sync logic here
    // e.g., send queued form submissions
}

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json()
        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: '/portfolio/icons/icon-192x192.png',
                badge: '/portfolio/icons/icon-72x72.png'
            })
        )
    }
})

// Performance monitoring
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }

    if (event.data && event.data.type === 'GET_CACHE_INFO') {
        event.ports[0].postMessage({
            caches: [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE]
        })
    }
})

console.log('[SW] Service Worker v2 loaded successfully')
