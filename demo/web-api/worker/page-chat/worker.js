
nextNumber = 0
function getNextnumber() {
    return nextNumber++
}

pages = {}
onconnect = event => {
    pageNumber = getNextnumber()

    event.ports[0]._data = { port: event.ports[0], pageNumber: pageNumber }
    pages[pageNumber] = event.ports[0]._data
    console.log(pages[pageNumber])
    console.log(pages)

    event.ports[0].postMessage(`num ${pageNumber}`)

    event.ports[0].onmessage = getMessage
}

function getMessage(event) {
    switch (event.data.substr(0, 4)) {
        case 'txt ':
            pageNumber = event.target._data.pageNumber
            message = event.data.substr(4)
            for (i in pages) {
                pages[i].port.postMessage(`txt ${pageNumber} ${message}`)
            }
            break
        case 'msg ':
            me = event.target._data
            from = pages[event.data.substr(4).split(' ', 1)[0]]
            console.log(event.target)
            console.log(`from:${from.pageNumber}`)
            if (from) {
                channel = new MessageChannel()
                me.port.postMessage(`msg ${from.pageNumber}`, [channel.port1])
                from.port.postMessage(`msg ${me.pageNumber}`, [channel.port2])
            }
            break
    }
}
