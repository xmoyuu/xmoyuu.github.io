## 创造声音，排序，计时，调度

creating sound, sequencing, timing, scheduling

### sweep 扫频效果音 - 自定义波形

使用 `BaseAudioContext.createPeriodicWave` 自定义波形

```html
<script src="wavetable.js"></script>
```

---

示例中的波形表保存在单独 JavaScript 文件 [wavetable.js](https://github.com/mdn/webaudio-examples/blob/master/step-sequencer/wavetable.js) 中，因为有太多的值了。

这来自 [repository of wavetables,](https://github.com/GoogleChromeLabs/web-audio-samples/tree/gh-pages/samples/audio/wave-tables)，是从 [Web Audio API examples from Google Chrome Labs](https://github.com/GoogleChromeLabs/web-audio-samples/) 找到的

```javascript
    audioContext = new window.AudioContext();

    periodicWave = audioContext.createPeriodicWave(wavetable.real, wavetable.imag);

    function playSweep() {
        oscillatorNode = audioContext.createOscillator();
        oscillatorNode.setPeriodicWave(periodicWave);
        oscillatorNode.frequency.value = 440;
        oscillatorNode.connect(audioContext.destination);
        oscillatorNode.start();
        oscillatorNode.stop(audioContext.currentTime + 1);
    }
    playSweep()
```

### 控制幅度

```html
<label for="attack">Attack</label>
<input name="attack" id="attack" type="range" min="0" max="1" value="0.2" step="0.1" />

<label for="release">Release</label>
<input name="release" id="release" type="range" min="0" max="1" value="0.5" step="0.1" />
```

---

```javascript
    sweepLength = 2;
    function playSweep() {
        oscillatorNode = audioContext.createOscillator();
        oscillatorNode.setPeriodicWave(periodicWave);
        oscillatorNode.frequency.value = 440;

        gainNode = audioContext.createGain();
        gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        // set our attack
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + attackTime);
        // set our release
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + sweepLength - releaseTime);

        oscillatorNode.connect(gainNode).connect(audioContext.destination);
        oscillatorNode.start();
        oscillatorNode.stop(audioContext.currentTime + sweepLength);
    }
```

使声音具有过渡

```javascript
gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + attackTime);
```

从当前时间第 attackTime 秒音量线性达到最大值

```javascript
    attackTime = 0.2;
    attackControl = document.querySelector('#attack');
    attackControl.addEventListener('input', function () {
        attackTime = Number(this.value);
    }, false);

    releaseTime = 0.5;
    releaseControl = document.querySelector('#release');
    releaseControl.addEventListener('input', function () {
        releaseTime = Number(this.value);
    }, false);
```

### pulse 脉冲 - 低频振荡器调制

```javascript
    audioContext = new window.AudioContext();

    oscillatorNode = audioContext.createOscillator();
    oscillatorNode.type = 'sine';
    oscillatorNode.frequency.value = 880;

    oscillatorNodeLFO = audioContext.createOscillator();
    oscillatorNodeLFO.type = 'square';
    oscillatorNodeLFO.frequency.value = 30;

    gainNodeAMP = audioContext.createGain();
    gainNodeAMP.gain.setValueAtTime(1, audioContext.currentTime);

    pulseTime = 1;

    oscillatorNodeLFO.connect(gainNodeAMP.gain);
    oscillatorNode.connect(gainNodeAMP).connect(audioContext.destination);
    oscillatorNodeLFO.start();
    oscillatorNode.start();
    oscillatorNode.stop(audioContext.currentTime + pulseTime);
```

震荡器设置一个 880 赫兹的正弦波

一个 30 赫兹的方波

LFO low frequency oscillator 低频振荡器

AMP amplifier 功率放大器

```html
<label for="hz">Hz</label>
<input name="hz" id="hz" type="range" min="660" max="1320" value="880" step="1" />

<label for="lfo">LFO</label>
<input name="lfo" id="lfo" type="range" min="20" max="40" value="30" step="1" />
```

---

```javascript
    pulseHz = 880;
    hzControl = document.querySelector('#hz');
    hzControl.addEventListener('input', function () {
        pulseHz = Number(this.value);
        playPulse()
    }, false);

    lfoHz = 30;
    lfoControl = document.querySelector('#lfo');
    lfoControl.addEventListener('input', function () {
        lfoHz = Number(this.value);
        playPulse()
    }, false);
```

获取数值

```javascript
    audioContext = new window.AudioContext();
    
    pulseTime = 1;
    function playPulse() {
        oscillatorNode = audioContext.createOscillator();
        oscillatorNode.type = 'sine';
        oscillatorNode.frequency.setValueAtTime(pulseHz, audioContext.currentTime);

        oscillatorNodeLFO = audioContext.createOscillator();
        oscillatorNodeLFO.type = 'square';
        oscillatorNodeLFO.frequency.setValueAtTime(lfoHz, audioContext.currentTime);

        gainNodeAMP = audioContext.createGain();
        gainNodeAMP.gain.setValueAtTime(1, audioContext.currentTime);

        oscillatorNodeLFO.connect(gainNodeAMP.gain);
        oscillatorNode.connect(gainNodeAMP).connect(audioContext.destination);
        oscillatorNodeLFO.start();
        oscillatorNode.start();
        oscillatorNode.stop(audioContext.currentTime + pulseTime);
    }
```

封装为函数并且通过方法设置参数 oscillatorNodeLFO.frequency.setValueAtTime()

### noise 噪音 - 随机噪音缓存与双二阶滤波器

```javascript
    audioContext = new window.AudioContext();

    noiseLength=5;

    bufferSize = audioContext.sampleRate * noiseLength;
    buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);

    data = buffer.getChannelData(0); // get data

    // fill the buffer with noise
    for (i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = buffer;

    sourceNode.connect(audioContext.destination);
    sourceNode.start();
```

audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);

单声道 样本帧数 采样率即一秒包含帧个数

声道数*样本帧数/采样率=时长

往 bufferSize 里随机存  -1到1

0db full scale 满刻度电平

```javascript
    biquadFilterNode = audioContext.createBiquadFilter();
    biquadFilterNode.type = 'bandpass';
    biquadFilterNode.frequency.value = 1000;

    sourceNode.connect(biquadFilterNode).connect(audioContext.destination);
    sourceNode.start();
```

双二阶滤波器去掉高频或者低频的噪音

> 也可以试试 IIRFilterNode.

```html
<label for="duration">Duration</label>
<input name="duration" id="duration" type="range" min="0" max="2" value="1" step="0.1" />

<label for="band">Band</label>
<input name="band" id="band" type="range" min="400" max="1200" value="1000" step="5" />
```

---

```javascript
    noiseDuration = 1;
    durControl = document.querySelector('#duration');
    durControl.addEventListener('input', function () {
        noiseDuration = Number(this.value);
        playNoise()
    }, false);

    bandHz = 1000;
    bandControl = document.querySelector('#band');
    bandControl.addEventListener('input', function () {
        bandHz = Number(this.value);
        playNoise()
    }, false);
```

---

```javascript
function playNoise() {
        noiseLength = noiseDuration;

        bufferSize = audioContext.sampleRate * noiseLength;
        buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);

        data = buffer.getChannelData(0); // get data

        // fill the buffer with noise
        for (i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = buffer;

        biquadFilterNode = audioContext.createBiquadFilter();
        biquadFilterNode.type = 'bandpass';
        biquadFilterNode.frequency.value = bandHz;

        sourceNode.connect(biquadFilterNode).connect(audioContext.destination);
        sourceNode.start();
    }
```

## Dial up 拨号音效 - 加载声音

```javascript
    audioContext = new window.AudioContext();

    async function getFile(audioContext, filepath) {
        response = await fetch(filepath);
        arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

    async function setupSample() {
        filePath = 'dtmf.mp3';
        sample = await getFile(audioContext, filePath);
        return sample;
    }

    function playSample(audioContext, audioBuffer) {
        sampleSource = audioContext.createBufferSource();
        sampleSource.buffer = audioBuffer;
        sampleSource.connect(audioContext.destination)
        sampleSource.start();
        return sampleSource;
    }

    setupSample()
        .then((sample) => {
            dtmf = sample; // to be used in our playSample function
            playSample(audioContext, dtmf)
        });
```

为确保文件在使用前已加载并解码到一个缓冲区，创建一个异步 async 函数

```html
<label for="rate">Rate</label>
<input name="rate" id="rate" type="range" min="0.1" max="2" value="1" step="0.1" />
```

---

```javascript
    playbackRate = 1;
    rateControl = document.querySelector('#rate');
    rateControl.addEventListener('input', function () {
        playbackRate = Number(this.value);
        setupSample()
            .then((sample) => {
                dtmf = sample; // to be used in our playSample function
                playSample(audioContext, dtmf)
            });
    }, false);
```

playbackRate  播放速率

```javascript
    function playSample(audioContext, audioBuffer) {
        sampleSource = audioContext.createBufferSource();
        sampleSource.buffer = audioBuffer;
        sampleSource.playbackRate.setValueAtTime(playbackRate, audioContext.currentTime);
        sampleSource.connect(audioContext.destination)
        sampleSource.start();
        return sampleSource;
    }
```

sampleSource.playbackRate.setValueAtTime 设置值

### 调度系统

AudioContext 有 currentTime 属性，在第一次创建环境时检索秒数。

考虑 BMP 控制或者创建一个调度系统

```html
    <section class="controls-main">
        <h1>ModemDN</h1>
        <label for="bpm">BPM</label>
        <input name="bpm" id="bpm" type="range" min="60" max="180" value="120" step="1" />
        <span id="bpmval">120</span>
        <button data-playing="false">Play</button>
    </section>
```

---

```javascript
    audioContext = new window.AudioContext();

    tempo = 60.0;
    bpmControl = document.querySelector('#bpm');
    bpmValEl = document.querySelector('#bpmval');
    playButton = document.querySelector('[data-playing]');

    bpmControl.addEventListener('input', ev => {
        tempo = Number(ev.target.value);
        bpmValEl.innerText = tempo;
    }, false);

    isPlaying = false;
    playButton.addEventListener('click', function () {
        isPlaying = !isPlaying;
        if (isPlaying) { // start playing
            currentNote = 0;
            nextNoteTime = audioContext.currentTime;
            scheduler(); // kick off scheduling
            this.dataset.playing = 'true';
        } else {
            window.clearTimeout(timerID);
            this.dataset.playing = 'false';
        }
    })
```

Note 音符 currentNote 当前音符 nextNoteTime下一个音符

scheduler() 调度器

```html
    <div id="tracks">
        <!-- track one: bleep -->
        <section class="track-one">
            <h2>Sweep</h2>
            <section class="controls">
                <label for="attack">Att</label>
                <input name="attack" id="attack" type="range" min="0" max="1" value="0.2" step="0.1" />
                <label for="release">Rel</label>
                <input name="release" id="release" type="range" min="0" max="1" value="0.5" step="0.1" />
            </section>
            <!--

        -->
            <section class="pads">
                <button role="switch" aria-checked="false"><span>Voice 1, Note 1</span></button>
                <button role="switch" aria-checked="false"><span>Voice 1, Note 2</span></button>
                <button role="switch" aria-checked="false"><span>Voice 1, Note 3</span></button>
                <button role="switch" aria-checked="false"><span>Voice 1, Note 4</span></button>
            </section>
        </section>

        <!-- track two: pad/sweep -->
        <section class="track-two">
            <h2>Pulse</h2>
            <section class="controls">
                <label for="hz">Hz</label>
                <input name="hz" id="hz" type="range" min="660" max="1320" value="880" step="1" />
                <label for="lfo">LFO</label>
                <input name="lfo" id="lfo" type="range" min="20" max="40" value="30" step="1" />
            </section>
            <!--

        -->
            <section class="pads">
                <button role="switch" aria-checked="false"><span>Voice 2, Note 1</span></button>
                <button role="switch" aria-checked="false"><span>Voice 2, Note 2</span></button>
                <button role="switch" aria-checked="false"><span>Voice 2, Note 3</span></button>
                <button role="switch" aria-checked="false"><span>Voice 2, Note 4</span></button>
            </section>
        </section>

        <!-- track three: noise -->
        <section class="track-three">
            <h2>Noise</h2>
            <section class="controls">
                <label for="duration">Dur</label>
                <input name="duration" id="duration" type="range" min="0" max="2" value="1" step="0.1" />
                <label for="band">Band</label>
                <input name="band" id="band" type="range" min="400" max="1200" value="1000" step="5" />
            </section>
            <!--

        -->
            <section class="pads">
                <button role="switch" aria-checked="false"><span>Voice 3, Note 1</span></button>
                <button role="switch" aria-checked="false"><span>Voice 3, Note 2</span></button>
                <button role="switch" aria-checked="false"><span>Voice 3, Note 3</span></button>
                <button role="switch" aria-checked="false"><span>Voice 3, Note 4</span></button>
            </section>
        </section>

        <!-- track four: drill -->
        <section class="track-four">
            <h2>DTMF</h2>
            <section class="controls">
                <label for="rate">Rate</label>
                <input name="rate" id="rate" type="range" min="0.1" max="2" value="1" step="0.1" />
            </section>
            <!--

        -->
            <section class="pads">
                <button role="switch" aria-checked="false"><span>Voice 4, Note 1</span></button>
                <button role="switch" aria-checked="false"><span>Voice 4, Note 2</span></button>
                <button role="switch" aria-checked="false"><span>Voice 4, Note 3</span></button>
                <button role="switch" aria-checked="false"><span>Voice 4, Note 4</span></button>
            </section>
        </section>
    </div>
```

一个音效一个音轨，音轨由一排切换开关组成，还包含简单的控制部分

```javascript
    allPadButtons = document.querySelectorAll('#tracks button');

    // switch aria attribute on click
    allPadButtons.forEach(el => {
        el.addEventListener('click', () => {
            if (el.getAttribute('aria-checked') === 'false') {
                el.setAttribute('aria-checked', 'true');
                el.setAttribute('style', 'color:red')
            } else {
                el.setAttribute('aria-checked', 'false');
                el.setAttribute('style', 'color:black')
            }
        }, false)
    })
```

切换开关变更属性与颜色

```javascript
    currentNote = 0;
    nextNoteTime = 0.0; // when the next note is due.

    pads = document.querySelectorAll('.pads');
    notesInQueue = [];
    function scheduleNote(beatNumber, time) {
        // push the note on the queue, even if we're not playing.
        notesInQueue.push({ note: beatNumber, time: time });

        if (pads[0].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') {
            console.log("playSweep()");
        }
        if (pads[1].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') {
            console.log("playPulse()");
        }
        if (pads[2].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') {
            console.log("playNoise()");
        }
        if (pads[3].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') {
            console.log("playSourceNode(audioContext, sample);");
        }
    }
```

传入当前是第几个音符，并且检查音符是否可以播放

notesInQueue.push({ note: beatNumber, time: time });

播放记录压入栈，没啥特别的...纯粹记录...

```javascript
    lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
    scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

    function scheduler() {
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
            scheduleNote(currentNote, nextNoteTime);
            nextNote();
        }
        timerID = window.setTimeout(scheduler, lookahead);
    }
```

调度器 

nextNoteTime < audioContext.currentTime + scheduleAheadTime

当前时间（随时间变化） + 间隔时间，小于下一个音符开始的时间的时候

调用 scheduleNote(currentNote, nextNoteTime); 函数，传入当前的音符位置与下一个音符开始时间

```javascript
   function nextNote() {
        secondsPerBeat = 60.0 / tempo;

        nextNoteTime += secondsPerBeat; // Add beat length to last beat time

        // Advance the beat number, wrap to zero
        currentNote++;
        if (currentNote === 4) {
            currentNote = 0;
        }
    }
```

nextNote() 函数计算下一个音符开始的时间，并且给当前音符位置 +1，当位置到 4 清零

tempo 对应的是 bpm 取值 60-180 也就是说 secondsPerBeat 的值在 1 - 60/180 秒

```javascript
    lastNoteDrawn = 3;

    function draw() {
        drawNote = lastNoteDrawn;
        currentTime = audioContext.currentTime;

        while (notesInQueue.length && notesInQueue[0].time < currentTime) {
            drawNote = notesInQueue[0].note;
            notesInQueue.splice(0, 1);   // remove note from queue
        }

        // We only need to draw if the note has moved.
        if (lastNoteDrawn != drawNote) {
            pads.forEach(function (el, i) {
                el.children[lastNoteDrawn].style.borderColor = 'hsla(0, 0%, 10%, 1)';
                el.children[drawNote].style.borderColor = 'hsla(49, 99%, 50%, 1)';
            });

            lastNoteDrawn = drawNote;
        }
        // set up to draw again
        requestAnimationFrame(draw);
    }
```

可视化进程，从队列中获取第一个音符位置，然后清空队列

当前音符边框黄色，以前的音符边框黑色

requestAnimationFrame 重复调用自身

### 整合

唯一需要注意的是 dialup 因为需要确保加载，更改的地方就需要多加注意了

```html
<div class="loading">
    <p>Loading...</p>
</div>
```

---

```javascript
    loadingEl = document.querySelector('.loading');
    playButton = document.querySelector('[data-playing]');
    isPlaying = false;

    setupSample()
        .then((sample) => {
            loadingEl.style.display = 'none';

            dtmf = sample; // to be used in our playSample function
            playButton.addEventListener('click', function () {
                isPlaying = !isPlaying;
                if (isPlaying) { // start playing
                    // check if context is in suspended state (autoplay policy)
                    if (audioContext.state === 'suspended') {
                        audioContext.resume();
                    }
                    currentNote = 0;
                    nextNoteTime = audioContext.currentTime;
                    scheduler(); // kick off scheduling
                    draw();
                    this.dataset.playing = 'true';
                } else {
                    window.clearTimeout(timerID);
                    this.dataset.playing = 'false';
                }
            })

        });
```
