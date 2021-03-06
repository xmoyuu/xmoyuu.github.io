# 裁切

[demo/crop/canvas](https://xmoyuu.github.io/demo/crop/canvas)

```html
<body>
    <canvas id="canvas"></canvas>
    <canvas id="output"></canvas>
</body>

<script>
    context = canvas.getContext('2d')
    outputContext = output.getContext('2d')

    image = new Image()
    image.src = '清姬-bilibiliID-12662707-BY-Bison仓鼠仓-bilibiliUID-136107-NC.jpg'

    crop = {
        x: 0,
        y: 0,
        width: 400,
        height: 400,
        padding: 5,
    }

    output.width = crop.width
    output.height = crop.height

    function canvasInitZoom(image, canvas, canvasSize) {
        scale = image.width / image.height > 1 ?
            canvasSize / image.width : canvasSize / image.height
        canvas.width = image.width * scale
        canvas.height = image.height * scale
        return scale
    }

    function centre() {
        crop.x = (canvas.width - crop.width) / 2
        crop.y = (canvas.height - crop.height) / 2
    }

    function drawCrop(x, y, width, height) {
        context.fillStyle = 'rgba(0,0,0,0.5)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.clearRect(x, y, width, height)
    }

    function drawImage() {
        context.globalCompositeOperation = 'destination-over'
        context.drawImage(image,
            0, 0, image.width, image.height,
            0, 0, canvas.width, canvas.height,
        )
    }

    function drawOutput() {
        output.width = crop.width
        output.height = crop.height

        imageData = context.getImageData(crop.x, crop.y, crop.width, crop.height)
        outputContext.putImageData(imageData, 0, 0)
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        outputContext.clearRect(0, 0, output.width, output.height)

        centre()
        drawCrop(crop.x, crop.y, crop.width, crop.height)
        drawImage()
        drawOutput()
    }

    image.onload = () => {
        canvasInitZoom(image, canvas, 600)
        draw()
    }
</script>

```

先在画布上画出来，画布比例缩放，画出裁剪层，图片以及顺便画个输出

[demo/crop/control](https://xmoyuu.github.io/demo/crop/control)

```html
    <input type="file" id="file" accept="image/*">
    <br>
    <input type="range" id="canvasRange" min="1" max="100">
    <output id="canvasRangeOutput"></output>
    <br>
    <input type="range" id="outputRange" min="1">
    <output id="outputRangeOutput"></output>
    <br>
```

---

```javascript
   image.onload = () => {
        canvasRange.value = canvasInitZoom(image, canvas, 600) * 100
        canvasRangeOutput.value = `${Math.round(canvasRange.value)}%`
        outputRange.max = canvas.width > canvas.height ? canvas.height : canvas.width
        outputRange.value = crop.width
        outputRangeOutput.value = `${outputRange.value}px`
        draw()
    }

    file.onchange = event => {
        image = new Image()
        image.src = URL.createObjectURL(event.target.files[0])
        image.onload = () => {
            canvasInitZoom(image, canvas, 600)
            canvasRangeOnInput()
            draw()
        }
    }

    canvasRange.addEventListener("input", canvasRangeOnInput)
    function canvasRangeOnInput() {
        scale = canvasRange.value / 100
        canvas.width = image.width * scale
        canvas.height = image.height * scale

        outputRange.max = canvas.width > canvas.height ? canvas.height : canvas.width

        if (crop.width > canvas.width || crop.height > canvas.height) {
            crop.width = canvas.width
            crop.height = canvas.width
        }
        canvasRangeOutput.value = `${Math.round(canvasRange.value)}%`
        outputRangeOutput.value = `${outputRange.value}px`
        draw()
    }
    outputRange.addEventListener("input", outputRangeOnInput)
    function outputRangeOnInput() {
        crop.width = crop.height = output.width = output.height = + outputRange.value
        outputRangeOutput.value = `${outputRange.value}px`
        draw()
    }
```

稍微增加些控制

[demo/crop/move](https://xmoyuu.github.io/demo/crop/move)

```javascript
    let mouseDownX, mouseDownY, offsetX, offsetY
    dragging = false
    se = false
    sw = false
    nw = false
    ne = false
    canvas.addEventListener('mousedown', mousedown)
    canvas.addEventListener('mouseup', mouseup)
    canvas.addEventListener('mousemove', mousemove)

    function mousedown(event) {
        inCanvasX = event.pageX - canvas.offsetLeft
        inCanvasY = event.pageY - canvas.offsetTop
        if (
            (
                inCanvasX > (crop.x + crop.padding) &&
                inCanvasX < (crop.x + crop.width - crop.padding)
            ) &&
            (
                inCanvasY > (crop.y + crop.padding) &&
                inCanvasY < (crop.y + crop.height - crop.padding)
            )
        ) {
            mouseDownX = event.pageX - canvas.offsetLeft
            mouseDownY = event.pageY - canvas.offsetTop
            offsetX = mouseDownX - crop.x
            offsetY = mouseDownY - crop.y
            dragging = true
        }
        else if (
            (
                inCanvasX > (crop.x - crop.padding) &&
                inCanvasX < (crop.x + crop.padding)
            ) &&
            (
                inCanvasY > (crop.y - crop.padding) &&
                inCanvasY < (crop.y + crop.padding))
        ) {
            mouseDownX = event.pageX - canvas.offsetLeft
            mouseDownY = event.pageY - canvas.offsetTop
            offsetX = mouseDownX - crop.x
            offsetY = mouseDownY - crop.y
            sewidth = crop.width
            seheight = crop.height
            se = true
        }
        else if (
            (
                inCanvasX > (crop.x + crop.width - crop.padding) &&
                inCanvasX < (crop.x + crop.width + crop.padding)
            ) &&
            (
                inCanvasY > (crop.y - crop.padding) &&
                inCanvasY < (crop.y + crop.padding)
            )
        ) {
            mouseDownX = event.pageX - canvas.offsetLeft
            mouseDownY = event.pageY - canvas.offsetTop
            offsetX = mouseDownX - crop.x
            offsetY = mouseDownY - crop.y
            swwidth = crop.width
            swheight = crop.height
            sw = true
        }
        else if (
            (
                inCanvasX > (crop.x + crop.width - crop.padding) &&
                inCanvasX < (crop.x + crop.width + crop.padding)
            ) &&
            (
                inCanvasY > (crop.y + crop.height - crop.padding) &&
                inCanvasY < (crop.y + crop.height + crop.padding)
            )
        ) {
            mouseDownX = event.pageX - canvas.offsetLeft
            mouseDownY = event.pageY - canvas.offsetTop
            offsetX = mouseDownX - crop.x
            offsetY = mouseDownY - crop.y
            nwwidth = crop.width
            nwheight = crop.height
            nw = true
        }
        else if (
            (
                inCanvasX > (crop.x - crop.padding) &&
                inCanvasX < (crop.x + crop.padding)
            ) &&
            (
                inCanvasY > (crop.y + crop.height - crop.padding) &&
                inCanvasY < (crop.y + crop.height + crop.padding)
            )
        ) {
            mouseDownX = event.pageX - canvas.offsetLeft
            mouseDownY = event.pageY - canvas.offsetTop
            offsetX = mouseDownX - crop.x
            offsetY = mouseDownY - crop.y
            newidth = crop.width
            neheight = crop.height
            ne = true
        }
    }

    function mouseup(event) {
        dragging = false
        se = false
        sw = false
        nw = false
        ne = false
    }

    function mousemove(event) {
        mouseMoveX = event.pageX - canvas.offsetLeft
        mouseMoveY = event.pageY - canvas.offsetTop

        cursor(event)
        if (dragging) {
            crop.x = mouseMoveX - offsetX
            crop.y = mouseMoveY - offsetY
            context.clearRect(0, 0, canvas.width, canvas.height)
            drawWithotCentre()
        }
        else if (se) {
            crop.x = mouseMoveX - offsetX
            crop.y = mouseMoveY - offsetY
            crop.width = sewidth + (mouseDownX - crop.x)
            crop.height = seheight + (mouseDownY - crop.y)

            context.clearRect(0, 0, canvas.width, canvas.height)
            drawWithotCentre()
        }
        else if (sw) {
            crop.width = swwidth - (mouseDownX - mouseMoveX)
            crop.y = mouseMoveY - offsetY
            crop.height = swheight + (mouseDownY - (mouseMoveY - offsetY))
            context.clearRect(0, 0, canvas.width, canvas.height)
            drawWithotCentre()
        }
        else if (nw) {
            crop.width = nwwidth - (mouseDownX - mouseMoveX)
            crop.height = nwheight - (crop.y - (mouseMoveY - offsetY))
            context.clearRect(0, 0, canvas.width, canvas.height)
            drawWithotCentre()
        }
        else if (ne) {
            crop.x = mouseMoveX - offsetX
            crop.width = newidth + (mouseDownX - crop.x)
            crop.height = neheight - (crop.y - (mouseMoveY - offsetY))
            context.clearRect(0, 0, canvas.width, canvas.height)
            drawWithotCentre()
        }
    }

    function cursor(event) {
        inCanvasX = event.pageX - canvas.offsetLeft
        inCanvasY = event.pageY - canvas.offsetTop
        if (
            (
                inCanvasX > (crop.x + crop.padding) &&
                inCanvasX < (crop.x + crop.width - crop.padding)
            ) &&
            (
                inCanvasY > (crop.y + crop.padding) &&
                inCanvasY < (crop.y + crop.height - crop.padding)
            )
        ) {
            document.body.style.cursor = 'move'
        }
        else if (
            (
                inCanvasX > (crop.x - crop.padding) &&
                inCanvasX < (crop.x + crop.padding)
            ) &&
            (
                inCanvasY > (crop.y - crop.padding) &&
                inCanvasY < (crop.y + crop.padding))
        ) {
            document.body.style.cursor = 'se-resize'
        }
        else if (
            (
                inCanvasX > (crop.x + crop.width - crop.padding) &&
                inCanvasX < (crop.x + crop.width + crop.padding)
            ) &&
            (
                inCanvasY > (crop.y - crop.padding) &&
                inCanvasY < (crop.y + crop.padding)
            )
        ) {
            document.body.style.cursor = 'sw-resize'
        }
        else if (
            (
                inCanvasX > (crop.x + crop.width - crop.padding) &&
                inCanvasX < (crop.x + crop.width + crop.padding)
            ) &&
            (
                inCanvasY > (crop.y + crop.height - crop.padding) &&
                inCanvasY < (crop.y + crop.height + crop.padding)
            )
        ) {
            document.body.style.cursor = 'nw-resize'
        }
        else if (
            (
                inCanvasX > (crop.x - crop.padding) &&
                inCanvasX < (crop.x + crop.padding)
            ) &&
            (
                inCanvasY > (crop.y + crop.height - crop.padding) &&
                inCanvasY < (crop.y + crop.height + crop.padding)
            )
        ) {
            document.body.style.cursor = 'ne-resize'
        }
        else {
            document.body.style.cursor = 'default'
        }
    }
```

更加方便的移动
