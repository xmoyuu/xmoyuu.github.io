http = require('http')

http.createServer((req, res) => {
    if (req.url === '/server-sent') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
        })
        res.write('retry: 10000\n')
        res.write('event: customevent\n')
        res.write(`data: ${new Date()}\n\n`)
        interval = setInterval(() => {
            res.write(`data: ${new Date()}\n\n`)
        }, 1000)

        req.connection.addListener('close', () => {
            clearInterval(interval)
        })
    }
}).listen(8844, '127.0.0.1')