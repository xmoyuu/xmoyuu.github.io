# 位

binary digit is bit

## 绘制 rgba.png

[demo/bit/rgba-png-download](https://xmoyuu.github.io/demo/bit/rgba-png-download)

```html
<body>
    <canvas id="canvas"></canvas>
    <button id="png">download as PNG</button>
</body>

<script>
    canvas.width = 2
    canvas.height = 2

    context = canvas.getContext('2d')

    context.fillStyle = 'rgba(255,0,0,1)'
    context.fillRect(0, 0, 1, 1)

    context.fillStyle = 'rgba(0,255,0,1)'
    context.fillRect(1, 0, 1, 1)

    context.fillStyle = 'rgba(0,0,255,1)'
    context.fillRect(0, 1, 1, 1)

    context.fillStyle = 'rgba(255,255,255,0)'
    context.fillRect(1, 1, 1, 1)

    function downloadAsPNG(canvas) {
        a = document.createElement('a')
        a.download = 'rgba.png'
        a.href = canvas.toDataURL()
        a.click()
    }
    png.onclick = () => {
        downloadAsPNG(canvas)
    }
</script>
```

## 缩放

[demo/bit/rgba-png-zoom](https://xmoyuu.github.io/demo/bit/rgba-png-zoom)

```html
<body>
    <canvas id="canvas"></canvas>
    <button id="png">download as PNG</button>
    <br>
    <canvas id="zoom"></canvas>
</body>

<script>
    canvas.width = 2
    canvas.height = 2

    context = canvas.getContext('2d')

    context.fillStyle = 'rgba(255,0,0,1)'
    context.fillRect(0, 0, 1, 1)

    context.fillStyle = 'rgba(0,255,0,1)'
    context.fillRect(1, 0, 1, 1)

    context.fillStyle = 'rgba(0,0,255,1)'
    context.fillRect(0, 1, 1, 1)

    context.fillStyle = 'rgba(255,255,255,0)'
    context.fillRect(1, 1, 1, 1)

    function downloadAsPNG(canvas) {
        a = document.createElement('a')
        a.download = 'rgba.png'
        a.href = canvas.toDataURL()
        a.click()
    }
    png.onclick = () => {
        downloadAsPNG(canvas)
    }

    zoom.width = 100
    zoom.height = 100

    zoomContext = zoom.getContext('2d')

    zoomContext.imageSmoothingEnabled = false
    zoomContext.drawImage(
        canvas,
        0, 0,
        100, 100,
    )
</script>
```

2 × 2 的图片太小了，放大看看

## ArrayBuffer

[demo/bit/rgba-png-fetchA](https://xmoyuu.github.io/demo/bit/rgba-png-fetch)

```html
<body>
    <table>
        <thead>
            <tr>
                <td>index</td>
                <th scope="col">0</th>
                <th scope="col">1</th>
                <th scope="col">2</th>
                <th scope="col">3</th>
            </tr>
        </thead>
        <tbody id="decimal"></tbody>
    </table>

    <table>
        <thead>
            <tr>
                <td>index</td>
                <th scope="col">0</th>
                <th scope="col">1</th>
                <th scope="col">2</th>
                <th scope="col">3</th>
            </tr>
        </thead>
        <tbody id="hexadecimal"></tbody>
    </table>

    <table>
        <thead>
            <tr>
                <td>index</td>
                <th scope="col">0</th>
                <th scope="col">1</th>
                <th scope="col">2</th>
                <th scope="col">3</th>
            </tr>
        </thead>
        <tbody id="ascii"></tbody>
    </table>
</body>

<style>
    table {
        border-collapse: collapse;
        border: 2px solid rgb(200, 200, 200);
        letter-spacing: 1px;
        font-size: 0.8rem;
        display: inline-block;
    }

    td,
    th {
        border: 1px solid rgb(190, 190, 190);
        padding: 10px 20px;
    }

    th {
        background-color: rgb(235, 235, 235);
    }

    td {
        text-align: center;
    }

    tr:nth-child(even) td {
        background-color: rgb(250, 250, 250);
    }

    tr:nth-child(odd) td {
        background-color: rgb(245, 245, 245);
    }

    caption {
        padding: 10px;
    }
</style>

<script>
    fetch('rgba.png')
        .then(response => {
            return response.arrayBuffer()
        })
        .then(arrayBuffer => {
            arrayBufferView = new Uint8Array(arrayBuffer)
            return arrayBufferView
        })
        .then(arrayBufferView => {
            array = new Array
            for (i = 0; i < arrayBufferView.length; i += 4) {
                array.push(arrayBufferView.slice(i, i + 4))
            }
            // console.table(array)
            return array
        })
        .then(
            array => {
                array.forEach((element, i) => {
                    decimal.innerHTML +=
                        `
                        <tr>
                        <th scope="row">${i}</th>
                        <td>${element[0] != undefined ? element[0] : ''}</td>
                        <td>${element[1] != undefined ? element[1] : ''}</td>
                        <td>${element[2] != undefined ? element[2] : ''}</td>
                        <td>${element[3] != undefined ? element[3] : ''}</td>
                        </tr>
                        `
                    hexadecimal.innerHTML +=
                        `
                        <tr>
                        <th scope="row">${i}</th>
                        <td>${element[0] != undefined ? element[0].toString(16) : ''}</td>
                        <td>${element[1] != undefined ? element[1].toString(16) : ''}</td>
                        <td>${element[2] != undefined ? element[2].toString(16) : ''}</td>
                        <td>${element[3] != undefined ? element[3].toString(16) : ''}</td>
                        </tr>
                        `
                    ascii.innerHTML +=
                        `
                        <tr>
                        <th scope="row">${i}</th>
                        <td>${65 <= element[0] && element[0] <= 90 ? String.fromCharCode(element[0]) : ''}</td>
                        <td>${65 <= element[1] && element[1] <= 90 ? String.fromCharCode(element[1]) : ''}</td>
                        <td>${65 <= element[2] && element[2] <= 90 ? String.fromCharCode(element[2]) : ''}</td>
                        <td>${65 <= element[3] && element[3] <= 90 ? String.fromCharCode(element[3]) : ''}</td>
                        </tr>
                        `
                })
            }
        )
</script>
```

数据如下：

| index | 0   | 1   | 2   | 3   |
|:-----:|:---:|:---:|:---:|:---:|
| 0     | 137 | 80  | 78  | 71  |
| 1     | 13  | 10  | 26  | 10  |
| 2     | 0   | 0   | 0   | 13  |
| 3     | 73  | 72  | 68  | 82  |
| 4     | 0   | 0   | 0   | 2   |
| 5     | 0   | 0   | 0   | 2   |
| 6     | 8   | 6   | 0   | 0   |
| 7     | 0   | 114 | 182 | 13  |
| 8     | 36  | 0   | 0   | 0   |
| 9     | 22  | 73  | 68  | 65  |
| 10    | 84  | 8   | 153 | 5   |
| 11    | 193 | 1   | 1   | 0   |
| 12    | 0   | 0   | 128 | 16  |
| 13    | 255 | 79  | 23  | 34  |
| 14    | 9   | 5   | 3   | 63  |
| 15    | 210 | 5   | 251 | 90  |
| 16    | 148 | 45  | 72  | 0   |
| 17    | 0   | 0   | 0   | 73  |
| 18    | 69  | 78  | 68  | 174 |
| 19    | 66  | 96  | 130 |     |

### signature 识别标志

| index | 0   | 1   | 2   | 3   |
|:-----:|:---:|:---:|:---:|:---:|
| 0     | 137 | 80  | 78  | 71  |
| 1     | 13  | 10  | 26  | 10  |

根据 [PNG (Portable Network Graphics) Specification](http://www.libpng.org/pub/png/spec/1.2/png-1.2-pdg.html) 规范

PNG 文件的前 8 个字节

非 ASCII 值（ 137 > 127 ）减少文本文件被识别为 PNG 文件的概率，同时还可 catch 捕获清除位 7 的不良文件传输——‭`0101 1111` ‬，格式名即为 PNG

`[80,78,71]` 即 `['P','N','G']`

`[13,10]` 即  `['\r','\n']` CR-LF sequence 换行符片段可 catch 捕获换行的不良文件传输

`[26]` control-Z（SYN，synchronous idle）字节在 MS-DOS 会停止文件显示

`\n -> \r\n` 反向转换

### IHDR（ Image header ）

| index | 0   | 1   | 2   | 3   |
|:-----:|:---:|:---:|:---:|:---:|
| ...   | ... | ... | ... | ... |
| 2     | 0   | 0   | 0   | 13  |
| 3     | 73  | 72  | 68  | 82  |
| 4     | 0   | 0   | 0   | 2   |
| 5     | 0   | 0   | 0   | 2   |
| 6     | 8   | 6   | 0   | 0   |
| 7     | 0   | 114 | 182 | 13  |
| 8     | 36  | ... | ... | ... |

`[73，72，68，82]` 即 `['I','H','D','R']` 

IHDR 块包含 13 个字节

| type            | byte |
|:---------------:|:----:|
| Width 宽         | 4    |
| Height 高        | 4    |
| Bit depth 位深    | 1    |
| Color type 颜色类型 | 1    |
| Compression 压缩  | 1    |
| Filter 过滤       | 1    |
| Interlace 交错    | 1    |

宽为 2，高为 2，为照顾无符号四字节有困难的语言最大值为 2^31-1  即 2147483647

位深为 8，有效值：1, 2, 4, 8, 16

颜色类型组合 1（调色板） + 2（RGB） + 4（A），有效值：0 , 2,4 , 6

位深和颜色类型允许的组合：

| 位深                 | 颜色类型 |                   |
|:------------------:|:----:|:-----------------:|
| 1 , 2 , 4 , 8 , 16 | 0    | grayscale         |
| 8 , 16             | 2    | R , G , B         |
| 1 , 2 , 4 , 8      | 3    | palette           |
| 8 , 16             | 4    | grayscale + alpha |
| 8 , 16             | 6    | R , G , B , A     |

压缩方法只有 0 —— deflate/inflate

过滤方法也只有 0

数据无交错 0 交错 1

[CRC 计算](https://www.tahapaksu.com/crc/)，这里使用 `[73,72,68,82,0,0,0,2,0,0,0,2,8,6,0,0,0]` 十六进制字符串 `4948445200000002000000020806000000` 计算得 `[72,b6,d,24]` 即 `[114,182,13,36]`

### IDAT ( Image data )

| index | 0   | 1   | 2   | 3   |
|:-----:|:---:|:---:|:---:|:---:|
| ...   | ... | ... | ... | ... |
| 8     | ... | 0   | 0   | 0   |
| 9     | 22  | 73  | 68  | 65  |
| 10    | 84  | 8   | 153 | 5   |
| 11    | 193 | 1   | 1   | 0   |
| 12    | 0   | 0   | 128 | 16  |
| 13    | 255 | 79  | 23  | 34  |
| 14    | 9   | 5   | 3   | 63  |
| 15    | 210 | 5   | 251 | 90  |
| 16    | 148 | 45  | 72  | ... |

IDAT 块包含 22 个字节

`[73,68,65,84]` 即 `['I','D','A','T']`

十六进制字符串 `49444154089905c101010000008010ff4f17220905033fd205fb` CRC 计算得 `[5A,94,2D,48]` 即 `[90,148,45,72]`

[demo/bit/pako-inflate](https://xmoyuu.github.io/demo/bit/pako-inflate)

`[8,153,5,193,1,1,0,0,0,128,16,255,79,23,34,9,5,3,63,210,5,251,90,148,45,72]`

解压得

`[0,255,0,0,255,0,255,0,255,0,0,0,255,255,0,0,0,0]` 一看就是四个像素的 RGBA

### IEND ( Image end )

| index | 0   | 1   | 2   | 3   |
|:-----:|:---:|:---:|:---:|:---:|
| ...   | ... | ... | ... | ... |
| 16    | ... | ... | ... | 0   |
| 17    | 0   | 0   | 0   | 73  |
| 18    | 69  | 78  | 68  | 174 |
| 19    | 66  | 96  | 130 |     |

IEND 块包含 0 个字节

`[73,69,78,68]` 即 `['I','E','N','D']` 

十六进制字符串 `49454e44` CRC 计算得 `[AE,42,60,82]` 即 `[174,66,96,130]`

## BMP

表格来源：[BMP file format - Wikipedia](https://en.wikipedia.org/wiki/BMP_file_format)

| Offset                                     | Size | Hex value    | Value                              | Description                                                                                                                                                                        |
| ------------------------------------------ | ---- | ------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BMP Header                                 |      |              |                                    |                                                                                                                                                                                    |
| 0h                                         | 2    | 42 4D        | "BM"                               | ID field (42h, 4Dh)                                                                                                                                                                |
| 2h                                         | 4    | 9A 00 00 00  | 154 bytes (122+32)                 | Size of the BMP file                                                                                                                                                               |
| 6h                                         | 2    | 00 00        | Unused                             | Application specific                                                                                                                                                               |
| 8h                                         | 2    | 00 00        | Unused                             | Application specific                                                                                                                                                               |
| Ah                                         | 4    | 7A 00 00 00  | 122 bytes (14+108)                 | Offset where the pixel array (bitmap data) can be found                                                                                                                            |
| DIB Header                                 |      |              |                                    |                                                                                                                                                                                    |
| Eh                                         | 4    | 6C 00 00 00  | 108 bytes                          | Number of bytes in the DIB header (from this point)                                                                                                                                |
| 12h                                        | 4    | 04 00 00 00  | 4 pixels (left to right order)     | Width of the bitmap in pixels                                                                                                                                                      |
| 16h                                        | 4    | 02 00 00 00  | 2 pixels (bottom to top order)     | Height of the bitmap in pixels                                                                                                                                                     |
| 1Ah                                        | 2    | 01 00        | 1 plane                            | Number of color planes being used                                                                                                                                                  |
| 1Ch                                        | 2    | 20 00        | 32 bits                            | Number of bits per pixel                                                                                                                                                           |
| 1Eh                                        | 4    | 03 00 00 00  | 3                                  | BI_BITFIELDS, no pixel array compression used                                                                                                                                      |
| 22h                                        | 4    | 20 00 00 00  | 32 bytes                           | Size of the raw bitmap data (including padding)                                                                                                                                    |
| 26h                                        | 4    | 13 0B 00 00  | 2835 pixels/metre horizontal       | Print resolution of the image,<br>[72 DPI](https://proxy.raycoder.me/-----https://en.wikipedia.org/wiki/Dots_per_inch "Dots per inch") × 39.3701 inches per metre yields 2834.6472 |
| 2Ah                                        | 4    | 13 0B 00 00  | 2835 pixels/metre vertical         |                                                                                                                                                                                    |
| 2Eh                                        | 4    | 00 00 00 00  | 0 colors                           | Number of colors in the palette                                                                                                                                                    |
| 32h                                        | 4    | 00 00 00 00  | 0 important colors                 | 0 means all colors are important                                                                                                                                                   |
| 36h                                        | 4    | 00 00 FF 00  | 00FF0000 in big-endian             | Red channel bit mask (valid because BI_BITFIELDS is specified)                                                                                                                     |
| 3Ah                                        | 4    | 00 FF 00 00  | 0000FF00 in big-endian             | Green channel bit mask (valid because BI_BITFIELDS is specified)                                                                                                                   |
| 3Eh                                        | 4    | FF 00 00 00  | 000000FF in big-endian             | Blue channel bit mask (valid because BI_BITFIELDS is specified)                                                                                                                    |
| 42h                                        | 4    | 00 00 00 FF  | FF000000 in big-endian             | Alpha channel bit mask                                                                                                                                                             |
| 46h                                        | 4    | 20 6E 69 57  | little-endian "`Win` "             | LCS_WINDOWS_COLOR_SPACE                                                                                                                                                            |
| 4Ah                                        | 24h  | 24h* 00...00 | CIEXYZTRIPLE Color Space endpoints | Unused for LCS "`Win` " or "`sRGB`"                                                                                                                                                |
| 6Eh                                        | 4    | 00 00 00 00  | 0 Red Gamma                        | Unused for LCS "`Win` " or "`sRGB`"                                                                                                                                                |
| 72h                                        | 4    | 00 00 00 00  | 0 Green Gamma                      | Unused for LCS "`Win` " or "`sRGB`"                                                                                                                                                |
| 76h                                        | 4    | 00 00 00 00  | 0 Blue Gamma                       | Unused for LCS "`Win` " or "`sRGB`"                                                                                                                                                |
| Start of the Pixel Array (the bitmap Data) |      |              |                                    |                                                                                                                                                                                    |
| 7Ah                                        | 4    | FF 00 00 7F  | 255 0 0 127                        | Blue (Alpha: 127), Pixel (1,0)                                                                                                                                                     |
| 7Eh                                        | 4    | 00 FF 00 7F  | 0 255 0 127                        | Green (Alpha: 127), Pixel (1,1)                                                                                                                                                    |
| 82h                                        | 4    | 00 00 FF 7F  | 0 0 255 127                        | Red (Alpha: 127), Pixel (1,2)                                                                                                                                                      |
| 86h                                        | 4    | FF FF FF 7F  | 255 255 255 127                    | White (Alpha: 127), Pixel (1,3)                                                                                                                                                    |
| 8Ah                                        | 4    | FF 00 00 FF  | 255 0 0 255                        | Blue (Alpha: 255), Pixel (0,0)                                                                                                                                                     |
| 8Eh                                        | 4    | 00 FF 00 FF  | 0 255 0 255                        | Green (Alpha: 255), Pixel (0,1)                                                                                                                                                    |
| 92h                                        | 4    | 00 00 FF FF  | 0 0 255 255                        | Red (Alpha: 255), Pixel (0,2)                                                                                                                                                      |
| 96h                                        | 4    | FF FF FF FF  | 255 255 255 255                    | White (Alpha: 255), Pixel (0,3)                                                                                                                                                    |

[demo/bit/rgba-bmp-download](https://xmoyuu.github.io/demo/bit/rgba-bmp-download)

```html
<script>
        function createBMP(context) {
        imageData = context.getImageData(0, 0, canvas.width, canvas.height)

        // 32-bit bitmap with opacity values in the alpha channel (Windows DIB Header BITMAPV4HEADER) 

        function write32BitIntLittleEndian(dest, number) {
            dest.push(number & 0xff)
            dest.push((number & 0xff00) >>> 8)
            dest.push((number & 0xff0000) >>> 16)
            dest.push(number >>> 24)
        }

        function write16BitIntLittleEndian(dest, number) {
            dest.push(number & 0xff)
            dest.push((number & 0xff00) >>> 8)
        }

        imageWidth = imageData.width
        imageHeight = imageData.height
        dataSize = imageWidth * imageHeight * 4
        fileSize = dataSize + 122

        applicationSpecific = 0

        BMPHeaderSize = 14
        DIBHeaderSize = 108
        offset = BMPHeaderSize + DIBHeaderSize

        colorPlanes = 1
        bit = 32
        compression = 3
        // 3:unused
        printResolution = Math.ceil(72 * 39.3701)
        palette = 0
        importantColor = 0
        // 0:all are important
        RBitMask = 0xFF000000
        GBitMask = 0x00FF0000
        BBitMask = 0x0000FF00
        ABitMask = 0x000000FF

        BMPHeader = new Array
        DIBHeader = new Array
        pixel = new Array

        BMPHeader.push(0x42, 0x4D)
        // 'B','M'

        write32BitIntLittleEndian(BMPHeader, fileSize)
        write32BitIntLittleEndian(BMPHeader, applicationSpecific)
        write32BitIntLittleEndian(BMPHeader, offset)

        write32BitIntLittleEndian(DIBHeader, DIBHeaderSize)
        write32BitIntLittleEndian(DIBHeader, imageWidth)
        write32BitIntLittleEndian(DIBHeader, imageHeight)
        write16BitIntLittleEndian(DIBHeader, colorPlanes)
        write16BitIntLittleEndian(DIBHeader, bit)
        write32BitIntLittleEndian(DIBHeader, compression)
        write32BitIntLittleEndian(DIBHeader, dataSize)
        write32BitIntLittleEndian(DIBHeader, printResolution)
        write32BitIntLittleEndian(DIBHeader, printResolution)
        write32BitIntLittleEndian(DIBHeader, palette)
        write32BitIntLittleEndian(DIBHeader, importantColor)
        write32BitIntLittleEndian(DIBHeader, RBitMask)
        write32BitIntLittleEndian(DIBHeader, GBitMask)
        write32BitIntLittleEndian(DIBHeader, BBitMask)
        write32BitIntLittleEndian(DIBHeader, ABitMask)

        DIBHeader.push(0x20, 0x6E, 0x69, 0x57)
        //['w','i','n,''']
        for (i = 48; i > 0; i--) {
            DIBHeader.push(0x00)
        }

        for (i = imageHeight - 1; i >= 0; i--) {
            index = imageWidth * i * 4
            for (j = 0; j < imageWidth; j++) {
                x = 4 * j
                pixel.push(imageData.data[index + x + 3])
                pixel.push(imageData.data[index + x + 2])
                pixel.push(imageData.data[index + x + 1])
                pixel.push(imageData.data[index + x])
            }
        }
        return BMPHeader.concat(DIBHeader).concat(pixel)
    }

    function createBMPURL(data) {
        string = new String
        for (i = 0; i < data.length; i++) {
            string += String.fromCharCode(data[i])
        }
        return `data:image/bmp;base64,${btoa(string)}`
    }
</script>

<button onmousedown="downloadAsBMP(context)">download as BMP</button>
<script>
    function downloadAsBMP(context) {
        link = document.createElement('a')
        link.download = 'rgba.bmp'
        bmp = createBMP(context)
        link.href = createBMPURL(bmp)
        link.click()
    }
</script>
```

根据格式写入数据，注意这里修改了 RGBA bit mask 以按照顺序，与表格不同