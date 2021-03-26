```html
<audio src="Hanser.mp3" type="audio/mpeg"></audio>
<button data-playing="false" role="switch" aria-checked="false">
    <span>Play/Pause</span>
</button>
```

---

```javascript
<script src="recorder.js"></script>
```

引入文件

```javascript
    audioContext = new window.AudioContext();

    audioElement = document.querySelector('audio');
    sourceNode = audioContext.createMediaElementSource(audioElement);
    sourceNode.connect(audioContext.destination);
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
            rec = new Recorder(sourceNode);
            // start recording
            rec.record();
            audioElement.play();
            this.dataset.playing = 'true';
        } else if (this.dataset.playing === 'true') {
            audioElement.pause();
            rec.stop()
            // export it to WAV
            rec.exportWAV(function (e) {
                console.log(e);
                saveBlob(e, '1.wav');
                rec.clear();
                console.log("clear");
            });
            this.dataset.playing = 'false';
        }
    }, false);

    audioElement.addEventListener('ended', () => {
        playButton.dataset.playing = 'false';
    }, false);
```

播放时录制，暂停时保存

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

保存文件


