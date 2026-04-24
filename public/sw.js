const CACHE_NAME = 'tokendash-shell-v1'
const SHELL_URL = '/'
const PRECACHE_URLS = [SHELL_URL, '/manifest.webmanifest', '/app-icon-192.svg', '/app-icon-512.svg']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) =>
        Promise.all(cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName))),
      ),
      self.clients.claim(),
    ]),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)

  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(SHELL_URL, response.clone()))
          }

          return response
        })
        .catch(async () => (await caches.match(request)) || (await caches.match(SHELL_URL)) || Response.error()),
    )

    return
  }

  event.respondWith(
    caches.match(request).then(
      (cachedResponse) =>
        cachedResponse ||
        fetch(request)
          .then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()))
            }

            return response
          })
          .catch(() => cachedResponse || Response.error()),
    ),
  )
})
