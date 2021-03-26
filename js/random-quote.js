function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function randomQuote(path, element) {
    fetch(path)
        .then(response => {
            if (response.status === 404) {
                return 404
            }
            return response.json()
        })
        .then(json => {
            random = getRandomInt(0, json.quote.length)
            quote = json.quote[random]
            element.innerHTML = `
                    「${quote.content} 」${quote.author}
                    ${quote.cite ? ` , <cite>${quote.cite}</cite>` : ''}
                    ${quote.url ? ` <a href='${quote.url}'>🔗</a>` : ''}
                    `
        })
}