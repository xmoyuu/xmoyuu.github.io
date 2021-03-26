# 流

Panta Rhei 万物皆流

参考：https://ccloli.com/201910/from-fetch-to-streams/

## 须知

快捷键 `F12` →  Dev Tool 开发者工具 →  Network 网络 → [Throttling](https://developer.mozilla.org/docs/Tools/Network_Monitor/Throttling) 节流

Disable cache 禁用缓存进行测试

## 可读流

[demo/stream/readable-stream](https://xmoyuu.github.io/demo/stream/readable-stream)

```html
<body>
    <img id="image" height="30%">
</body>

<script>
    fetch('2019-bilibiliID-11371674-BY-你的心弦有我来过-bilibiliUID-11134708-NC.jpg')
        .then(response => stream(response))
        .then(stream => new Response(stream))
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .then(url => image.src = url)
        .catch(error => console.error(error))

    function stream(response) {
        return new ReadableStream({
            start(controller) {
                reader = response.body.getReader()
                pump()
                function pump() {
                    reader.read()
                        .then(({ done, value }) => {
                            if (done) {
                                controller.close()
                                return
                            }
                            controller.enqueue(value)
                            pump()
                        })
                }
            }
        })
    }
</script>
```

`fetch` 会取的 [`response.body`](https://developer.mozilla.org/docs/Web/API/Body/body) 回应主体是一个 `ReadableStream` 可读流，因此具有 `getReader()` 获取读取器方法

在新构造的 `ReadableStream` 可读流中 `reader.read()` 读取器读取数值，通过 `controller.enqueue(value)` 控制器入列值，当 `done` 完成时关闭控制器 `controller.close()` 并返回

### 进度

[demo/stream/readable-stream-progress](https://xmoyuu.github.io/demo/stream/readable-stream-progress)

```html
<body>
    <progress value="0" max="1" id="progress"></progress>
    <img id="image" height="30%">
</body>

<script>
    fetch('2019-bilibiliID-11371674-BY-你的心弦有我来过-bilibiliUID-11134708-NC.jpg')
        .then(response => stream(response))
        .then(stream => new Response(stream))
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .then(url => image.src = url)
        .catch(error => console.error(error))

    function stream(response) {
        return new ReadableStream(
            {
                start(controller) {
                    reader = response.body.getReader()
                    contentLength = response.headers.get('content-length')
                    loadedLength = 0
                    pump()
                    function pump() {
                        reader.read()
                            .then(
                                ({ done, value }) => {
                                    if (done) {
                                        controller.close()
                                        return
                                    }
                                    loadedLength += value.length
                                    progress.value = loadedLength / contentLength
                                    controller.enqueue(value)
                                    pump()
                                }
                            )
                    }
                }
            }
        )
    }
</script>
```

`response.headers.get('content-length')` 获取内容长度，累计队列长度，从而计算进度

### 分流

[demo/stream/readable-stream-progress-tee](https://xmoyuu.github.io/demo/stream/readable-stream-progress-tee)

```html
<body>
    <progress value="0" max="1" id="progress"></progress>
    <img id="image" height="30%">
</body>

<script>
    fetch('2019-bilibiliID-11371674-BY-你的心弦有我来过-bilibiliUID-11134708-NC.jpg')
        .then(response => stream(response))
        .then(stream => new Response(stream))
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .then(url => image.src = url)
        .catch(error => console.error(error))

    function stream(response) {
        [progressStream, returnStream] = response.body.tee()
        reader = progressStream.getReader()
        contentLength = response.headers.get('content-length')
        loadedLength = 0
        pump()
        function pump() {
            reader.read()
                .then(({ done, value }) => {
                    if (done) {
                        return
                    }
                    loadedLength += value.length
                    progress.value = loadedLength / contentLength
                    pump()
                })
        }
        return returnStream
    }
</script>
```

字母 T 形象分流

通过 `ReadableStream.tee()` 可得到两条独立复制，可分别被两个不同读取器读取

### Abort 中止

[demo/stream/fetch-abort](https://xmoyuu.github.io/demo/stream/fetch-abort)

```html
<body>
    <button id="button">Download</button>
    <span id="downloading"></span>
    <img id="image" height="30%">
</body>

<script>
    let abortController, isDownloading

    button.onclick = () => {
        if (isDownloading) {
            isDownloading = false
            abortController.abort()
        }
        else {
            isDownloading = true
            downloading.textContent = ''
            request()
        }
    }

    function request() {
        abortController = new AbortController()
        signal = abortController.signal
        fetch('2019-bilibiliID-11371674-BY-你的心弦有我来过-bilibiliUID-11134708-NC.jpg', { signal })
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => image.src = url)
            .catch(event => {
                isDownloading = false
                downloading.textContent = event.message
            })
        signal.onabort = () => { }
    }
</script>
```

`fetch` 会取时设置 `AbortController` 中止控制器 `signa` 信号

`AbortController.abort()` 中止会取

[demo/stream/readable-stream-progress-abort](https://xmoyuu.github.io/demo/stream/readable-stream-progress-abort)

```html
<body>
    <progress value="0" max="1" id="progress"></progress>
    <button id="button">Download</button>
    <span id="downloading"></span>
    <img id="image" height="30%">
</body>

<script>
    let abortController, isDownloading

    button.onclick = () => {
        if (isDownloading) {
            isDownloading = false
            abortController.abort()
        }
        else {
            isDownloading = true
            downloading.textContent = ''
            request()
        }
    }

    function request() {
        abortController = new AbortController()
        signal = abortController.signal
        fetch('2019-bilibiliID-11371674-BY-你的心弦有我来过-bilibiliUID-11134708-NC.jpg', { signal })
            .then(response => stream(response))
            .then(stream => new Response(stream))
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => image.src = url)
            .catch(event => {
                isDownloading = false
                downloading.textContent = event.message
            })
        signal.onabort = function () { }
    }

    function stream(response) {
        return new ReadableStream({
            start(controller) {
                reader = response.body.getReader()
                contentLength = response.headers.get('content-length')
                loadedLength = 0
                pump()
                function pump() {
                    reader.read()
                        .then(({ done, value }) => {
                            if (done) {
                                controller.close()
                                return
                            }
                            loadedLength += value.length
                            progress.value = loadedLength / contentLength
                            controller.enqueue(value)
                            pump()
                        })
                        .catch(event => {
                            isDownloading = false
                            downloading.textContent = event.message
                        })
                }
            }
        })
    }
</script>
```

### 继续

[demo/stream/readable-stream-progress-resume](https://xmoyuu.github.io/demo/stream/readable-stream-progress-resume)

```html
<body>
    <progress value="0" max="1" id="progress"></progress>
    <button id="button">Download</button>
    <span id="downloading"></span>
    <img id="image" height="30%">
</body>

<script>
    let abortController, isDownloading
    chunks = []
    loadedLength = 0

    button.onclick = () => {
        if (isDownloading) {
            isDownloading = false
            abortController.abort()
        }
        else {
            isDownloading = true
            downloading.textContent = ''
            request()
        }
    }

    function request() {
        abortController = new AbortController()
        signal = abortController.signal
        fetch('2019-bilibiliID-11371674-BY-你的心弦有我来过-bilibiliUID-11134708-NC.jpg', {
            headers:
            {
                'Range': `bytes=${loadedLength}-`
            },
            signal,
        })
            .then(response => stream(response))
            .then(stream => new Response(stream))
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => image.src = url)
            .catch(event => {
                isDownloading = false
                downloading.textContent = event.message
            })
        signal.onabort = () => { }
    }

    function stream(response) {
        return new ReadableStream({
            start(controller) {
                reader = response.body.getReader()
                contentLength = response.headers.get('content-length')
                pump()
                function pump() {
                    reader.read()
                        .then(({ done, value }) => {
                            if (done) {
                                let chunk
                                while (chunk = chunks.shift()) {
                                    controller.enqueue(chunk)
                                }
                                controller.close()
                                return
                            }
                            loadedLength += value.length
                            progress.value = loadedLength / contentLength
                            chunks.push(value)
                            pump()
                        })
                        .catch(event => {
                            isDownloading = false
                            downloading.textContent = event.message
                        })
                }
            }
        })
    }
</script>
```

值暂存于数组 `chunks` 块，在 `done` 完成时分块入列

通过设置请求头 `headers` 在中止处继续 `fetch` 会取
