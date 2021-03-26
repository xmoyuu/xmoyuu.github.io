onconnect = event => {
    var port = event.ports[0]

    port.onmessage = event => {
        result = `Result:${event.data[0] * event.data[1]}`
        port.postMessage(result)
    }
}
