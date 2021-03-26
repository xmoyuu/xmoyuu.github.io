addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1')
            .then(cache => {
                return cache.addAll([
                    '/',
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
                        if (
                            event.request.url.search("demo/stream") == -1
                        ) {
                            cache.put(event.request, response.clone())
                        }
                        return response
                    })
            })
    )
})