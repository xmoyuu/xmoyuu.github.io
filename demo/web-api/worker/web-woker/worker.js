importScripts('log.js', 'sleep.js')

function generator(event) {
    log(event.data)  
    for (let i = 0; i <= 100; i++) {
        postMessage(i)
        sleep(1000)
    }
    close()
}

onmessage = generator
// addEventListener('message', generator)