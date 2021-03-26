
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function fetchQuoteJson(event) {
    path = event.data
    fetch(path)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                return Promise.reject({
                    status: response.status,
                    statusText: response.statusText
                })
            }
        })
        .then(json => {
            random = getRandomInt(0, json.quote.length)
            postMessage(json.quote[random])
        })
        .catch(error => {
            if (error.status === 404) {
                postMessage(error.status)
            }
        })
}
onmessage = fetchQuoteJson