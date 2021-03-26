function emojiAsFavicon(emoji, x, y) {
    canvas = document.createElement('canvas')
    canvas.height = 32
    canvas.width = 32
    context = canvas.getContext('2d')
    context.font = '28px serif'
    context.fillText(emoji, x, y)
    icon.href = canvas.toDataURL()

    // string = `background:url('${canvas.toDataURL()}')no-repeat;font-size:32px;`
    // console.log(`%c  `, string)
}

function emojiAsAppleTouchIcon(emoji, x, y) {
    canvas = document.createElement('canvas')
    canvas.height = 180
    canvas.width = 180
    context = canvas.getContext('2d')
    context.font = '160px serif'
    context.fillText(emoji, x, y)
    appleTouchIcon.href = canvas.toDataURL()
}