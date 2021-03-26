onmessage = event => {
    result = fibonacci(Number(event.data))
    postMessage(result)
}

function fibonacci(number) {
    a = 1, b = 0
    while (number >= 0) {
        temp = a
        a = a + b
        b = temp
        number--
    }
    return b
}