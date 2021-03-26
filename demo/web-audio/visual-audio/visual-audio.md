# 音频可视化

## 波形示波器

```html
<audio src="Hanser.mp3" type="audio/mpeg"></audio>
<canvas width="300" height="100"></canvas>
```

---

```javascript
    audioElement = document.querySelector('audio');

    audioContext = new window.AudioContext();

    sourceNode = audioContext.createMediaElementSource(audioElement);
    analyserNode = audioContext.createAnalyser();

    sourceNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);
```

`analyserNode` 节点由 `AudioContext.createAnalyser()` 方法创建

分析器节点 `analyserNode` 将在一个特定的频率域里使用 Fast Fourier Transform (FFT) 快速傅立叶变换来捕获音频数据，这取决于 `AnalyserNode.fftSize` 的值，从 32 到 32768 范围内的 2 的非零幂，默认值为2048，表示信号样本的窗口大小。分析器节点`analyserNode` 不输出时也可以正常使用。

> 可以为 FFT 数据缩放范围指定一个最小值和最大值，使用 `AnalyserNode.minDecibels` 和 `AnalyserNode.maxDecibels` 进行设置，要获得不同数据的平均常量，使用 `AnalyserNode.smoothingTimeConstant`

```javascript
    analyserNode.fftSize = 2048;
    // bufferLength = analyserNode.fftSize;
    bufferLength = analyserNode.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
```

处理一个 2048 大小的 FFT。返回 AnalyserNode.frequencyBinCount 值，它是 FFT 的一半，然后调用 `Uint8Array()`，把 `frequencyBinCount` 作为它的长度参数 —— 这代表将对这个大小的 FFT 收集多少数据点。

捕获数据（见下文 `draw()` 函数），需要使用 `AnalyserNode.getFloatFrequencyData()` 或 `AnalyserNode.getByteFrequencyData()` 方法来获取频率数据，用 `AnalyserNode.getByteTimeDomainData()` 或 `AnalyserNode.getFloatTimeDomainData()` 来获取波形数据。

> 这些方法把数据复制进了一个特定的数组当中，所以在调用它们之前要先创建一个新数组。第一个方法和第四个方法会产生一个 32 位浮点数组，第二个和第三个方法会产生 8 位无符号整型数组，因此一个标准的 JavaScript 数组就不能使用。需要用 `Float32Array` 或者 `Uint8Array` 数组，具体需要哪个视情况而定。

```javascript
    canvas = document.querySelector('canvas')
    canvasCtx = canvas.getContext("2d");
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
```

获取并清空画布

```javascript
    function draw() {
        drawVisual = requestAnimationFrame(draw);
        analyserNode.getByteTimeDomainData(dataArray);
        // analyserNode.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(238, 238, 238)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
        canvasCtx.beginPath();
        sliceWidth = WIDTH * 1.0 / bufferLength;
        x = 0;
        for (i = 0; i < bufferLength; i++) {
            v = dataArray[i] / 128.0;
            y = v * HEIGHT / 2;
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }
    draw();
```

用 `requestAnimationFrame(draw)` 反复调用 `draw()` 函数保持绘图持续更新

`analyser.getByteTimeDomainData(dataArray)` 获取时间域上的数据

```javascript
        canvasCtx.fillStyle = 'rgb(238, 238, 238)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
```

由于反复被调用，纯色会反复填满画布以达到刷新的效果

```javascript
        sliceWidth = WIDTH * 1.0 / bufferLength;
```

用画布的总宽度除以数组的长度（与之前定义的 FrequencyBinCount 相等）得到每段线条的宽度

```javascript
        x = 0;
        for (i = 0; i < bufferLength; i++) {
            v = dataArray[i] / 128.0;
            y = v * HEIGHT / 2;
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
```

从横坐标 x=0 的地方开始，标点 (x,y)，最后在画布最右边的中央结束。

128 是 8 位 最大值 255 的中位数

最后 `canvasCtx.stroke()` 绘制

```html
<button data-playing="false" role="switch" aria-checked="false">
    <span>Play/Pause</span>
</button>
```

加个按钮播放

```javascript
    playButton = document.querySelector('button');
    playButton.addEventListener('click', function () {
        // check if context is in suspended state (autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        // play or pause track depending on state
        if (this.dataset.playing === 'false') {
            audioElement.play();
            this.dataset.playing = 'true';
        } else if (this.dataset.playing === 'true') {
            audioElement.pause();
            this.dataset.playing = 'false';
        }
    }, false);

    audioElement.addEventListener('ended', () => {
        playButton.dataset.playing = 'false';
    }, false);
```

## 频率条形图

```javascript
    analyserNode.fftSize = 256;
```

减小 FFT 的大小，使得每个频率条足够宽

```javascript
    function draw() {
        drawVisual = requestAnimationFrame(draw);
        // analyserNode.getByteTimeDomainData(dataArray);
        analyserNode.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(238, 238, 238)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        barWidth = (WIDTH / bufferLength) * 2.5;
        x = 0;

        for (i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
```

---

```javascript
        analyserNode.getByteFrequencyData(dataArray);
```

获取频率数据

```javascript
        barWidth = (WIDTH / bufferLength) * 2.5;
        x = 0;
```

设置一个 `barWidth` 变量，它等于每一个条形的宽度。理论上用画布宽度除以条的个数就可以了，但是在这里还要乘以2.5。（笔者注：不乘其实效果更好...）这是因为有很多返回的频率区域中是没有声音的，我们每天听到的大多数声音也只是在一个很小的频率区域当中。在条形图中我们肯定不想看到大片的空白条，所以就把一些能正常显示的条形拉宽来填充这些空白区域。

记录当前条形位置变量 x

```javascript
        for (i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

            x += barWidth + 1;
        }
```

条形的高度 barHeight 等于数组的数值，条形越高，填充色越亮

在 `HEIGHT-barHeight/2` 的位置画每一条，这是因为想让每个条形从底部向上伸出，而不是从顶部向下，一半则是因为这样条形看起来更美观。

-

浮点数数据获取请参考：https://github.com/mdn/voice-change-o-matic-float-data/blob/gh-pages/scripts/app.js

## Oscillator 振荡器

```html
<canvas></canvas>
<button class="mute">Mute</button>
```

---

```javascript
    audioContext = new window.AudioContext();
    
    oscillatorNode = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    oscillatorNode.connect(gainNode).connect(audioContext.destination);
```

创建连接节点

```javascript
    maxFreq = 6000;
    maxVol = 1;

    initialFreq = 3000;
    initialVol = 0.5;

    // set options for the oscillator

    oscillatorNode.type = 'sine';
    oscillatorNode.frequency.value = initialFreq;
    oscillatorNode.start();

    gainNode.gain.value = initialVol;
```

初始化设置，设定频率与音量的最大以及初始值。

> 人耳的频率范围 20Hz 到 20000Hz

生成类型为正弦波 sine，方波 square，锯齿波 sawtooth，三角波 triangle，自定义 custom 是可选数值

```javascript
    document.onmousemove = updatePage;

    function updatePage(e) {
        CurX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        CurY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

        oscillatorNode.frequency.value = (CurX / window.innerWidth) * maxFreq;
        gainNode.gain.value = (CurY / window.innerHeight) * maxVol;

        canvasDraw();
    }
```

当鼠标移动时调用 updatePage() 函数

updatePage() 获取鼠标坐标值

`event.clientY` 和 `document.body.scrollTop` 配合能在出现滚动条时确定鼠标坐标值而不是当前可视区域的坐标数值

鼠标坐标除以页面宽高的得到百分比再去乘以频率或声音最大值得到该点坐标对应的数值

越往右频率越高，越下声音越大

最后调用 `canvasDraw()` 绘制可视化

```javascript
    function random(number1, number2) {
        randomNo = number1 + (Math.floor(Math.random() * (number2 - number1)) + 1);
        return randomNo;
    }

    canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvasCtx = canvas.getContext('2d');

    function canvasDraw() {
        rX = CurX;
        rY = CurY;
        rC = Math.floor((gainNode.gain.value / maxVol) * 30);

        canvasCtx.globalAlpha = 0.2;

        for (i = 1; i <= 15; i = i + 2) {
            canvasCtx.beginPath();
            canvasCtx.fillStyle = 'rgb(' + 100 + (i * 10) + ',' + Math.floor((gainNode.gain.value / maxVol) * 255) + ',' + Math.floor((oscillatorNode.frequency.value / maxFreq) * 255) + ')';
            canvasCtx.arc(rX + random(0, 50), rY + random(0, 50), rC / 2 + i, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
            canvasCtx.fill();
            canvasCtx.closePath();
        }
    }
```

随机函数被用来生成圆的中心坐标（x,y）

rC 是圆的半径这意味着音量越大圆越大

Alpha 阿尔法透明通道，透明度

音量与频率改变后颜色也随之改变

```javascript
    var mute = document.querySelector('.mute');
    mute.onclick = function () {
        if (mute.id == "") {
            gainNode.disconnect(audioContext.destination);
            mute.id = "activated";
            mute.innerHTML = "Unmute";
        } else {
            gainNode.connect(audioContext.destination);
            mute.id = "";
            mute.innerHTML = "Mute";
        }
    }
```

静音，调用 disconnect 方法，将切断 gainNode 与 destination 节点的链接
