if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(reg => {
            console.log(`scope:${reg.scope}`)
        })
        .catch(error => {
            console.log(`registration failed: ${error}`)
        })
}