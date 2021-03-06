addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1')
            .then(cache => {
                return cache.addAll([
                    'service-worker-register.html',
                ])
            })
    )
})

addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response
                return fetch(event.request)
            })
            .then(response => {
                return caches.open('v1')
                    .then(cache => {
                        cache.put(event.request, response.clone())
                        return response
                    })
            })
    )
})