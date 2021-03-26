log = console.dir

function sleep(ms) {
    time = new Date().getTime()
    while (new Date().getTime() < time + ms);
}

object = {}
proxy = new Proxy(object, {
    set: (target, key, value) => {
        target[key] = value
        post(value)
        return true
    }
})

function post(value) {
    postMessage(value)
}

function generator(event) {
    log(event.data)
    for (let i = 0; i <= 100; i++) {
        proxy.value = i
        sleep(1000)
    }
    close()
}

onmessage = generator
// addEventListener('message', generator)