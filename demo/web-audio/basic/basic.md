# 基础

## 兼容性

[https://caniuse.com/#feat=audio-api](https://caniuse.com/#feat=audio-api)

[https://caniuse.com/#feat=mediarecorder](https://caniuse.com/#feat=mediarecorder)

## MediaElementSourceNode 媒体元素源节点

Web Audio API 在 AudioContext 音频环境内处理音频，由 AudioNode 音频节点构成。

```html
<audio src="Hanser.mp3" type="audio/mpeg"></audio>
<button data-playing="false" role="switch" aria-checked="false">
    <span>Play/Pause</span>
</button>
```

---

```javascript
    audioContext = new window.AudioContext();
```

创建音频环境

> 如果只是想处理音频数据，缓存和流式传输而不播放它，那么则使用离线音频环境 OfflineAudioContext

```javascript
    audioElement = document.querySelector('audio');
    sourceNode = audioContext.createMediaElementSource(audioElement);
    sourceNode.connect(audioContext.destination);
```

创建源节点然后连接至终点（音响）

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

给按钮添加暂停播放功能

播放完毕会触发一个 ended 事件

## GainNode 增益节点

```javascript
    sourceNode = audioContext.createMediaElementSource(audioElement);
    gainNode = audioContext.createGain();
    sourceNode.connect(gainNode).connect(audioContext.destination);
```

增加一个增益节点并连接以改变音量

```html
<input type="range" id="volume" min="0" max="2" value="1" step="0.01">
```

---

```javascript
    volumeControl = document.querySelector('#volume');
    volumeControl.addEventListener('input', function() {
        gainNode.gain.value = this.value;
    }, false);
```

节点对象的值，例如 GainNode.gain 不是简单值，它们实际上是  AudioParam 类型对象，这些被称为参数。不是直接设置  gain 的值，这使得它们更加的灵活，允许传入一系列特定的值以在例如一段时间内改变。

## StereoPannerNode 立体声平衡节点

```html
<input type="range" id="panner" min="-1" max="1" value="0" step="0.01">
```

---

```javascript
    audioElement = document.querySelector('audio');
    sourceNode = audioContext.createMediaElementSource(audioElement);
    gainNode = audioContext.createGain();
    pannerOptions = {
        pan: 0
    };
    stereoPannerNode = new StereoPannerNode(audioContext, pannerOptions);
    sourceNode.connect(gainNode).connect(stereoPannerNode).connect(audioContext.destination);
```

这次使用构造函数来生成节点

> audioContext.createStereoPanner();  
> 
> 目前生成节点的构造函数不是每个浏览器都支持，旧工厂函数支持更为广泛

```javascript
    pannerControl = document.querySelector('#panner');
    pannerControl.addEventListener('input', function() {
        stereoPannerNode.pan.value = this.value;
    }, false);
```

## 基本概念

通过以上实例我们基本了解了在音频环境 AudioContext 中

声源 → 音效 → 终点

音频节点通过输入与输出进行连接，形成一个链，从一个或多个源出发，通过一个或更多的节点，最终到输出终点。也可以不到终点，如果只是处理数据而不需要播放。

声源可以来自：

- 由 Javascript 生成，例如 OscillatorNode 振动发声器 `AudioContext.createOscillator`

```javascript
    audioContext = new window.AudioContext();
    oscillatorNode = audioContext.createOscillator();
    oscillatorNode.connect(audioContext.destination);
    // other values:square,sawtooth,triangle,custom
    oscillatorNode.type = 'sine';
    // hertz
    oscillatorNode.frequency.value = 2500;
    oscillatorNode.start();
    oscillatorNode.stop(1);
```

- 由脉冲编码调制（PCM）产生的原始数据，音频环境 AudioContext 可以调用一些方法来解码部分支持的格式，例如 `AudioContext.createBuffer()` , `AudioContext.createBufferSource()`  , `AudioContext.decodeAudioData()`

- HTML音频元素例如 `<video>` 或者 `<audio>` 例如 `AudioContext.createMediaElementSource()`

- 通过 WebRTC，MediaStream，例如获取麦克风 `AudioContext.createMediaStreamSource()`

无论是从 HTML 媒体元素例如 `<aduio>` 或者 `<video>` 元素获取文件还是 Fetch 文件后将其解码到缓冲区。 前者更常见于全长度音轨，后者更适合更短更小样的音轨。

使用缓冲区可以直接访问数据，这意味需要更精确的操作。

希望使用麦克风可用 Media Stream API 和 MediaStreamAudioSourceNode 接口，这对于 WebRTC 和想要记录分析时都有帮助

生成声音可以使用 OscillatorNode 完成，也可以通过创建缓冲区填充数据完成。

音效比如混响，双二阶滤波器，声相，压限器

> 为了直接播放一个音乐文件，通常通过 XHR 加载文件，通过 Buffer 解码，创建BufferSource。Scott Michaud 写了加载和解码一个或多个音频库 [AudioSampleLoader](https://github.com/ScottMichaud/AudioSampleLoader) 可以帮助简化操作

### 声音常识

声波形状决定音色

声波振幅决定音量

声波频率音高 do re mi fa so la xi do

模拟量转数字量过程为**数字化采样**，简称**采样**。

采样率就是1秒之内采样了多少个点，单位是 **Hz** 。

一般网上下载到的MP3音乐，其采样率一般是 44100 Hz。也就是说，1秒钟采样了 44100 个点。

44100Hz, 16 位, 立体声

每秒钟采样了44100个点，每个点占16位，16位就是2字节。

每秒钟需要占用空间 44100x2=88200 字节，就是大约 88 KB

由于这是立体声的，占两个声道，所以两个声道加起来，每秒钟就是大约 176 KB。

如果这个声音文件是 WAV 格式的，那么它每秒钟占用大约 176 KB，一分钟就是 176x60=10560 KB，比特率就是 1408 Kbps。

> 比特率 128 Kbps 就是 16 KB/s （128 byte / 8 = 16 Bit），即每秒 16 KB，每分钟就是 960 KB，一首 3 分钟的歌曲大约占用不到 3 MB 左右。

比特率越小，文件越小，压缩率越高

同一种文件格式，比特率越小代音质越差。文件格式不一样，比特率就不能用来对比音质了。

## 可用库

[howler.js](https://howlerjs.com/)：跨浏览器支持

[tone.js](https://tonejs.github.io/)：声音创作，提供了调度合成和效果

[R-audio](https://github.com/bbc/r-audio)：BBC 的 React 组件

## 自动播放政策

浏览器不应该允许音频自动播放，除非用户主动播放

创建的 AudioContext 无论脱机联机都会有状态：suspended, running, closed.

```javascript
    audioContext = new window.AudioContext();
    button = document.querySelector('button');
    button.addEventListener('click', function() {
        // check if context is in suspended state (autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }, false);
```

点击按钮使用 audioContext.resume() 方法播放

对于离线音频环境 OfflineAudioContext 则使用 startRendering()

## AudioParam values 媒体参数值

```javascript
    gainNode.gain.value = 0.5;
```

这样就可以使音量减半

```javascript
    gainNode.gain.setValueAtTime(1, audioContext.currentTime + 2);
```

使用方法要优先于直接赋值，在 2 秒内增益值设置为 1

## ConstantSourceNode 恒定源节点

Firefox 未实现此功能

```html
<span>Volume: </span>
<input type="range" min="0.0" max="1.0" step="0.01" value="0.8" name="volume" id="volumeControl">
<button>play</button>
```

---

```javascript
    audioContext = new window.AudioContext();

    function startOscillators() {
        oscillatorNodeC = audioContext.createOscillator();
        oscillatorNodeC.type = "sine";
        oscillatorNodeC.frequency.value = 261.625565300598634; // middle C
        oscillatorNodeC.connect(gainNodeC);

        oscillatorNodeE = audioContext.createOscillator();
        oscillatorNodeE.type = "sine";
        oscillatorNodeE.frequency.value = 329.627556912869929; // E
        oscillatorNodeE.connect(gainNodeE);

        oscillatorNodeG = audioContext.createOscillator();
        oscillatorNodeG.type = "sine";
        oscillatorNodeG.frequency.value = 391.995435981749294 // G
        oscillatorNodeG.connect(gainNodeG);

        oscillatorNodeC.start();
        oscillatorNodeE.start();
        oscillatorNodeG.start();

        playing = true;
    }

    function stopOscillators() {
        oscillatorNodeC.stop();
        oscillatorNodeE.stop();
        oscillatorNodeG.stop();
        playing = false;
    }

    gainNodeC = audioContext.createGain();
    gainNodeE = audioContext.createGain();
    gainNodeG = audioContext.createGain();

    gainNodeC.gain.value = 0.5;
    gainNodeE.gain.value = gainNodeC.gain.value;
    gainNodeG.gain.value = gainNodeC.gain.value;
    volumeControl.value = gainNodeC.gain.value;

    constantSourceNode = audioContext.createConstantSource();
    constantSourceNode.connect(gainNodeE.gain);
    constantSourceNode.connect(gainNodeG.gain);
    constantSourceNode.start();

    gainNodeC.connect(audioContext.destination);
    gainNodeE.connect(audioContext.destination);
    gainNodeG.connect(audioContext.destination);

    volumeControl = document.querySelector("#volumeControl");
    volumeControl.addEventListener("input", function() {
        constantSourceNode.offset.value = volumeControl.value;
    }, false);

    playing = false;
    playButton = document.querySelector('button');
    playButton.addEventListener("click", function() {
        if (playing) {
            playButton.innerHTML = "play";
            stopOscillators();
        } else {
            playButton.innerHTML = "stop";
            startOscillators();
        }
    }, false);
```

通过连接两个 gainNode 节点的值以同时控制

## 本地音频播放

```html
<input type="file" onchange="playMusic.call(this)" class="select-file">
<audio class="audio-node" autoplay></audio>
```

当用户选择文件后会触发 `onchange` 事件，在 `onchange` 回调里面就可以拿到文件的内容

```javascript
    function playMusic() {
        if (!this.value) {
            return;
        }
        fileReader = new FileReader();
        file = this.files[0];
        fileReader.onload = function () {
            arrayBuffer = this.result;
            console.log(arrayBuffer);
            // 转成一个blob
            blob = new Blob([new Int8Array(this.result)], {
                type: 'audio/mp3' // files[0].type
            });
            // 生成一个本地的blob url
            blobUrl = URL.createObjectURL(blob);
            console.log(blobUrl);
            // 给audio标签的src属性
            document.querySelector('.audio-node').src = blobUrl;

        }
        fileReader.readAsArrayBuffer(this.files[0]);
    }
```

files 是 `<input>` 元素的属性

使用 `FileReader` 读取文件，FileReader 的属性 result 包含数组缓存 arrayBuffer 二进制数据，可将这个 arrayBuffer 实例化一个 Uint8Array ，数组里面的每个元素都是一个无符号整型 8 位二进制数字。arrayBuffer 转换成一个 blob，`URL.createObjectURL(blob);`生成一个 url

fileReader.onload 由 readAsArrayBuffer 触发

```javascript
blob:null/1ecb3047-9222-4254-b59a-03981b2a9ee6
```

url 类似这样

将这个 url 设置为 `<audio>` 的 `src`

```javascript
blob = new Blob([new Int8Array(this.result)], {
    type: 'audio/mp3' // files[0].type
});
```

指定文件 mime 类型

mime 可以通过 `<input>`的 files[0].type 得到

files[0] 是 File 的实例

File 有 mime 类型，而 Blob 也有，因为 File 是继承于 Blob 的，两者是同根的

所以直接使用 File 就行

```javascript
    function playMusic() {
        if (!this.value) {
            return;
        }
        // 直接使用File对象生成blob url
        blobUrl = URL.createObjectURL(this.files[0]);
        document.querySelector('.audio-node').src = blobUrl;
    }
```

## 录音

```html
<audio src="Hanser.mp3" type="audio/mpeg"></audio>

<button data-playing="false" role="switch" aria-checked="false">
    <span>Play/Pause</span>
</button>
```

---

```javascript
    leftChannelDataArray = [];
    rightChannelDataArray = [];

    function onAduioProcess(e) {
        leftChannelData = e.inputBuffer.getChannelData(0);
        rightChannelData = e.inputBuffer.getChannelData(1);
        leftChannelDataArray.push(leftChannelData);
        rightChannelDataArray.push(rightChannelData);
        // console.log(leftChannelData, rightChannelData);
    }
```

scriptProcessorNode.onaudioprocess 的回调函数

将数据缓存压入到数组中

```javascript
    function mergeArray(array) {
        totalLength = array.length * array[0].length;
        resultArray = new Float32Array(totalLength);
        offset = 0;
        for (i = 0; i < array.length; i++) {
            resultArray.set(array[i], offset);
            offset += array[i].length;
        }
        return resultArray;
    }
```

一个数组里有多个 `Float32Array`，把它们合成单个 `Float32Array`

```javascript
    function interleaveLeftAndRightChannelArray(left, right) {
        totalLength = left.length + right.length;
        resultArray = new Float32Array(totalLength);
        for (i = 0; offset < totalLength; i++) {
            offset = i * 2;
            resultArray[offset] = left[i];
            resultArray[offset + 1] = right[i];
        }
        return resultArray;
    }
```

合并左右声道数据，WAV 的格式为左声道和右声道数据交错

```javascript
    function encodeWAV(array) {
        arrayBuffer = new ArrayBuffer(44 + array.length * 2);
        dataView = new DataView(arrayBuffer);

        /* RIFF identifier */
        writeString(dataView, 0, 'RIFF');
        /* RIFF chunk length */
        dataView.setUint32(4, 36 + array.length * 2, true);
        /* RIFF type */
        writeString(dataView, 8, 'WAVE');
        /* format chunk identifier */
        writeString(dataView, 12, 'fmt ');
        /* format chunk length */
        dataView.setUint32(16, 16, true);
        /* sample format (raw) */
        dataView.setUint16(20, 1, true);
        /* channel count */
        dataView.setUint16(22, numChannels, true);
        /* sample rate */
        dataView.setUint32(24, sampleRate, true);
        /* byte rate (sample rate * block align) */
        dataView.setUint32(28, sampleRate * 4, true);
        /* block align (channel count * bytes per sample) */
        dataView.setUint16(32, numChannels * 2, true);
        /* bits per sample */
        dataView.setUint16(34, 16, true);
        /* data chunk identifier */
        writeString(dataView, 36, 'data');
        /* data chunk length */
        dataView.setUint32(40, array.length * 2, true);

        floatTo16BitPCM(dataView, 44, array);

        return dataView;
    }
```

创建 WAV 文件，写入 WAV 头部信息，包括声道、采样率、位声等

写入录音数据

```javascript
    function floatTo16BitPCM(output, offset, input) {
        for (i = 0; i < input.length; i++ , offset += 2) {
            volume = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, volume < 0 ? volume * 0x8000 : volume * 0x7FFF, true);
        }
    }
```

16 位脉冲编码调制

写入 16 位位深即用 16 位二进制表示声音的强弱，16位表示的范围是 [-32768, +32767]，最大值是 32767 即 0x7FFF ，录音数据的取值范围是 [-1, 1] ，表示相对比例，用这个比例乘以最大值就是实际要存储的值。

```javascript
    function writeString(dataView, offset, string) {
        for (i = 0; i < string.length; i++) {
            dataView.setUint8(offset + i, string.charCodeAt(i));
        }
    }
```

字符串写入位置

```javascript
    function dataView2Blob(dataView) {
        blob = new Blob([dataView], { type: 'audio/wav' });
        return blob
    }
```

DataView 转换为 Blob 

```javascript
    BUFFER_SIZE = 4096;
    INPUT_CHANNEL_COUNT = 2;
    OUTPUT_CHANNEL_COUNT = 2;

    audioContext = new window.AudioContext();

    audioElement = document.querySelector('audio');
    sourceNode = audioContext.createMediaElementSource(audioElement);
    sourceNode.connect(audioContext.destination);

    scriptProcessorNode = audioContext.createScriptProcessor(BUFFER_SIZE, INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT);
    sourceNode.connect(scriptProcessorNode);
    scriptProcessorNode.connect(audioContext.destination);
```

创建连接节点

```javascript
    playButton = document.querySelector('button');
    playButton.addEventListener('click', function () {
        // check if context is in suspended state (autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        // play or pause track depending on state
        if (this.dataset.playing === 'false') {
            scriptProcessorNode.onaudioprocess = onAduioProcess;
            audioElement.play();
            sampleRate = audioContext.sampleRate;
            numChannels = 2;
            this.dataset.playing = 'true';
        } else if (this.dataset.playing === 'true') {
            audioElement.pause();
            leftArray = mergeArray(leftChannelDataArray);
            rightArray = mergeArray(rightChannelDataArray);
            interleaveArray = interleaveLeftAndRightChannelArray(leftArray, rightArray);
            WAVDataView = encodeWAV(interleaveArray);
            WAVblob = dataView2Blob(WAVDataView);
            console.log(WAVblob);
            saveBlob(WAVblob, '1.wav');
            this.dataset.playing = 'false';
        }
    }, false);

    audioElement.addEventListener('ended', () => {
        playButton.dataset.playing = 'false';
    }, false);
```

暂停时保存数据

```javascript
    saveBlob = (function () {
        a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (blob, fileName) {
            url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());
```

保存为文件

## XMLHttpRequest

```javascript
    audioContext = new window.AudioContext();

    request = new XMLHttpRequest();
    request.open('GET', './Hanser.mp3', true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        audioContext.decodeAudioData(request.response, function (buffer) {
            playBuffer(buffer);
        }, function () {
            // error handle
            // 例如文件损坏、格式不对
        });
    };
    request.send();
```

AudioContext 和 Canvas 画布差不多，可以在 AudioContext 里「画」出各种声音

使用 `XMLHTTPRequest` GET 请求获取 mp3 数据

可选项默认为 true，已完成事务的通知可供事件监听器使用；即异步执行操作；

若值为 false，则 send() 方法在收到响应之前不会返回；即同步执行操作；

[responseType](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType) 请求类型为 `arraybuffer` 二进制数组缓冲

请求加载的 mp3 数据回应将被存储至 `request.response`

使用 `AudioContext.decodeAudioData` 解码媒体数据为 PCM/WAV 格式的 `buffer`

```javascript
    function playBuffer(buffer) {
        sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.connect(audioContext.destination);
        sourceNode.start(0);
    }
```

`AudioContext.createBufferSource` 创建缓冲源 `sourceNode` 源节点对象

将缓冲 `buffer` 传入 `sourceNode.buffer` 源节点缓冲

`sourceNode.connect` 源节点连接终点 `AudioContext.destination` 音频输出口

`sourceNode.start(0);`

> `start(when, offset, duration)`
> 
> - when 何时开始，当前五秒后？十秒后？
> 
> - offset 偏移，从音频第几秒开始？
> 
> - duration 持续几秒？
> 
> 三个参数都可以省略即 `sourceNode.start()`

作为**声音源头**的 AudioNode （例如 SourceNode，以及将提及的振荡器OscillatorNode），声音播放完毕后其自身会立即销毁，若需要再次播放，则必须重新创建。

即重新播放同一个音频都需要重新调用 `playBuffer(buffer)` 函数

## 常用函数

`stop(when)` 何时结束，可省略立即结束

示例

```javascript
sourceNode.stop(ctx.currentTime + 5);
```

当前时间 + 5（5 秒后结束），SourceNode 销毁

```javascript
sourceNode.loop = true; // 循环
sourceNode.loopStart = 2.2; // 循环开始点
sourceNode.loopEnd = 6.0;// 循环结束点
```

```
sourceNode.onended = function () {
 alert('播放完毕！');
};
```

播放完毕后触发的事件

### 音量调节器

```javascript
function playBuffer(buffer, volume) {
  var sourceNode = ctx.createBufferSource();
  sourceNode.buffer = buffer;
  var gainNode = ctx.createGain();
  gainNode.gain.value = volume;
  sourceNode.connect(gainNode);
  gainNode.connect(ctx.destination);
  sourceNode.start(0);
}
```

取值范围 0.0-1.0

`gain` 是一个 `AudioParam` 对象，**AudioParam** 是个 Audio API 特有的对象。

**AudioParam** 不是 Node，而是一个很有用的类。

AudioParam 不仅可以直接给 `value` 一个固定值，而且能让数值产生**渐变**效果，例如让音量从高慢慢变低，产生淡出效果。

AudioParam.setValueAtTime()

```javascript
gainNode.gain.setValueAtTime(0.5, ctx.currentTime + 0);  
gainNode.gain.setValueAtTime(1.0, ctx.currentTime + 1);
```

0 秒音量为 0.5，1 秒后音量为1.0

```js
gainNode.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 1);
```

线性渐变音量为 1.0

```javascript
gainNode.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 1);
```

指数渐变音量为 1.0，初始不能为 0

```javascript
gainNode.gain.setValueCurveAtTime([0.0,0.2,0.5,0.1], ctx.currentTime + 0, 10);
```

音量以 0.0→0.2→0.5→0.1 弧线过渡 

### DynamicsCompressorNode 动态压缩器

动态混音器，用于把多个音源实时混音，并防止爆音

```javascript
var compressorNode = ctx.createDynamicsCompressor();
sourceNode1.connect(compressorNode);
sourceNode2.connect(compressorNode);
sourceNode3.connect(compressorNode);
compressorNode.connect(ctx.destination);
```
