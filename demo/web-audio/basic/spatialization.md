## 基础

使用 PannerNode 实现 3D spatializations 空间化

StereoPannerNode 立体

```javascript
    audioContext = new window.AudioContext();
```

## 创建收听者

```javascript
    listener = audioContext.listener;

    posX = window.innerWidth / 2;
    posY = window.innerHeight / 2;
    posZ = 300;

    if (listener.positionX) {
        listener.positionX.value = posX;
        listener.positionY.value = posY;
        listener.positionZ.value = posZ - 5;
    } else {
        listener.setPosition(posX, posY, posZ - 5);
    }
    if (listener.forwardX) {
        listener.forwardX.value = 0;
        listener.forwardY.value = 0;
        listener.forwardZ.value = -1;
        listener.upX.value = 0;
        listener.upY.value = 1;
        listener.upZ.value = 0;
    } else {
        listener.setOrientation(0, 0, -1, 0, 1, 0);
    }
```

收听者的位置被设置在可视中央，包含 XYZ 轴位置使之能在上下左右前后移动

收听者朝向方向的位置，up 属性表示收听者的头部位置

### 创建 PannerNode 节点

```javascript
    pannerModel = 'HRTF';
    distanceModel = 'linear';
    maxDistance = 10000;
    refDistance = 1;
    rollOff = 10;
    innerCone = 60;
    outerCone = 90;
    outerGain = 0.3;
```

`equalpower` 模型默认的方式

`HRTF` Head-related transfer function 头部有关的传递函数

`distanceModel` 距离模型包含线性 `linear`, 反转 `inverse`,  指数 `exponential`

`maxDistance` 设置最大距离时声音不会继续减少

`refDistance` 音量减少开始生效的距离

`rollOff` 音量减少的快慢

声音传播的角度

coneOuterGain 值为 0 使意味着声音椎外听不到声音，

```javascript
    positionX = posX;
    positionY = posY;
    positionZ = posZ;
    orientationX = 0.0;
    orientationY = 0.0;
    orientationZ = -1.0;
```

播放器的方向与朝向

```javascript
    pannerNode = new PannerNode(audioContext, {
        panningModel: pannerModel,

        distanceModel: distanceModel,
        maxDistance: maxDistance,
        refDistance: refDistance,
        rolloffFactor: rollOff,
        coneInnerAngle: innerCone,
        coneOuterAngle: outerCone,
        coneOuterGain: outerGain,

        positionX: positionX,
        positionY: positionY,
        positionZ: positionZ,
        orientationX: orientationX,
        orientationY: orientationY,
        orientationZ: orientationZ
    })
```

将参数传入以构造节点

## 控制台

```html
<div id="move-controls" aria-labelledby="move-boombox">
    <h3 id="move-boombox">Move Boombox</h3>

    <section class="move-controls_xy">
        <button data-control="left" aria-labelledby="move-boombox left-label">
            <span id="left-label">Left</span>
        </button>
        <button data-control="up" aria-labelledby="move-boombox up-label">
            <span id="up-label">Up</span>
        </button>
        <button data-control="right" aria-labelledby="move-boombox right-label">
            <span id="right-label">Right</span>
        </button>
        <button data-control="down" aria-labelledby="move-boombox down-label">
            <span id="down-label">Down</span>
        </button>
    </section>

    <section class="move-controls_z">
        <button data-control="back" aria-labelledby="move-boombox back-label">
            <span id="back-label">Back</span>
        </button>
        <button data-control="forward" aria-labelledby="move-boombox for-label">
            <span id="for-label">Forward</span>
        </button>
    </section>

    <section class="move-controls_rotate">
        <button data-control="rotate-left" aria-labelledby="move-boombox rleft-label">
            <span id="rleft-label">Rotate left</span>
        </button>
        <button data-control="rotate-down" aria-labelledby="move-boombox rdown-label">
            <span id="rdown-label">Rotate downwards</span>
        </button>
        <button data-control="rotate-right" aria-labelledby="move-boombox rright-label">
            <span id="-label">Rotate right</span>
        </button>
        <button data-control="rotate-up" aria-labelledby="move-boombox rup-label">
            <span id="rup-label">Rotate upwards</span>
        </button>
    </section>

</div>
```

---

```javascript
    // the transforms we can set
    transform = {
        xAxis: 0,
        yAxis: 0,
        zAxis: 0.8,
        rotateX: 0,
        rotateY: 0
    }

    // set up our bounds
    topBound = -posY;
    bottomBound = posY;
    rightBound = posX;
    leftBound = -posX;
    innerBound = 0.1;
    outerBound = 1.5;

    // set up rotation constants
    rotationRate = 60; // bigger number equals slower sound rotation
    q = Math.PI / rotationRate; //rotation increment in radians

    // get degrees for css
    degreesX = (q * 180) / Math.PI;
    degreesY = (q * 180) / Math.PI;
```

Bound 界限使播放器不会移动的太远

rotation 旋转，计算出旋转度以供 CSS 使用

```javascript
    moveControls = document.querySelector('#move-controls').querySelectorAll('button');

    boombox = document.querySelector('.boombox-body');

    function moveBoombox(direction, prevMove) {
        switch (direction) {
            case 'left':
                if (transform.xAxis > leftBound) {
                    transform.xAxis -= 5;
                    pannerNode.positionX.value -= 0.1;
                }
                break;
            case 'up':
                if (transform.yAxis > topBound) {
                    transform.yAxis -= 5;
                    pannerNode.positionY.value -= 0.3;
                }
                break;
            case 'right':
                if (transform.xAxis < rightBound) {
                    transform.xAxis += 5;
                    pannerNode.positionX.value += 0.1;
                }
                break;
            case 'down':
                if (transform.yAxis < bottomBound) {
                    transform.yAxis += 5;
                    pannerNode.positionY.value += 0.3;
                }
                break;
            case 'back':
                if (transform.zAxis > innerBound) {
                    transform.zAxis -= 0.01;
                    pannerNode.positionZ.value -= 20;
                }
                break;
            case 'forward':
                if (transform.zAxis < outerBound) {
                    transform.zAxis += 0.01;
                    pannerNode.positionZ.value += 20;
                }
                break;
            case 'rotate-right':
                transform.rotateY += degreesY;
                console.log(transform.rotateY);
                // 'left' is rotation about y-axis with negative angle increment
                z = pannerNode.orientationZ.value * Math.cos(-q) - pannerNode.orientationX.value * Math.sin(-q);
                x = pannerNode.orientationZ.value * Math.sin(-q) + pannerNode.orientationX.value * Math.cos(-q);
                y = pannerNode.orientationY.value;
                pannerNode.orientationX.value = x;
                pannerNode.orientationY.value = y;
                pannerNode.orientationZ.value = z;
                break;
            case 'rotate-left':
                transform.rotateY -= degreesY;
                // 'right' is rotation about y-axis with positive angle increment
                z = pannerNode.orientationZ.value * Math.cos(q) - pannerNode.orientationX.value * Math.sin(q);
                x = pannerNode.orientationZ.value * Math.sin(q) + pannerNode.orientationX.value * Math.cos(q);
                y = pannerNode.orientationY.value;
                pannerNode.orientationX.value = x;
                pannerNode.orientationY.value = y;
                pannerNode.orientationZ.value = z;
                break;
            case 'rotate-up':
                transform.rotateX += degreesX;
                // 'up' is rotation about x-axis with negative angle increment
                z = pannerNode.orientationZ.value * Math.cos(-q) - pannerNode.orientationY.value * Math.sin(-q);
                y = pannerNode.orientationZ.value * Math.sin(-q) + pannerNode.orientationY.value * Math.cos(-q);
                x = pannerNode.orientationX.value;
                pannerNode.orientationX.value = x;
                pannerNode.orientationY.value = y;
                pannerNode.orientationZ.value = z;
                break;
            case 'rotate-down':
                transform.rotateX -= degreesX;
                // 'down' is rotation about x-axis with positive angle increment
                z = pannerNode.orientationZ.value * Math.cos(q) - pannerNode.orientationY.value * Math.sin(q);
                y = pannerNode.orientationZ.value * Math.sin(q) + pannerNode.orientationY.value * Math.cos(q);
                x = pannerNode.orientationX.value;
                pannerNode.orientationX.value = x;
                pannerNode.orientationY.value = y;
                pannerNode.orientationZ.value = z;
                break;
        }


        boombox.style.transform = 'translateX(' + transform.xAxis + 'px) translateY(' + transform.yAxis + 'px) scale(' + transform.zAxis + ') rotateY(' + transform.rotateY + 'deg) rotateX(' + transform.rotateX + 'deg)';
        move = prevMove || {};
        move.frameId = requestAnimationFrame(() => moveBoombox(direction, move));
        return move;
    }
```

---

```javascript
            case 'rotate-right':
                transform.rotateY += degreesY;
                console.log(transform.rotateY);
                // 'left' is rotation about y-axis with negative angle increment
                z = pannerNode.orientationZ.value * Math.cos(-q) - pannerNode.orientationX.value * Math.sin(-q);
                x = pannerNode.orientationZ.value * Math.sin(-q) + pannerNode.orientationX.value * Math.cos(-q);
                y = pannerNode.orientationY.value;
                pannerNode.orientationX.value = x;
                pannerNode.orientationY.value = y;
                pannerNode.orientationZ.value = z;
                break;
```

使用了 Math.cos 和 Math.sin 帮助重新计算播放器朝向方向

```javascript
    moveControls.forEach(function (el) {
        let moving;
        el.addEventListener('mousedown', function () {
            direction = this.dataset.control;
            if (moving && moving.frameId) {
                window.cancelAnimationFrame(moving.frameId);
            }
            moving = moveBoombox(direction);
        }, false);
        window.addEventListener('mouseup', function () {
            if (moving && moving.frameId) {
                window.cancelAnimationFrame(moving.frameId);
            }
        }, false)
    })
```

---

```html
<section class="boombox-body">
    <audio src="Hanser.mp3" type="audio/mpeg"></audio>
    <button data-playing="false" role="switch" aria-checked="false">
        <span>Play/Pause</span>
    </button>
    <input type="range" id="volume" min="0" max="2" value="1" step="0.01">
    <input type="range" id="panner" min="-1" max="1" value="0" step="0.01">
</section>
```

---

```javascript
    audioElement = document.querySelector('audio');
    sourceNode = audioContext.createMediaElementSource(audioElement);
    gainNode = audioContext.createGain();
    pannerOptions = { pan: 0 };
    // stereoPannerNode = new StereoPannerNode(audioContext, pannerOptions);
    // sourceNode.connect(gainNode).connect(stereoPannerNode).connect(audioContext.destination);
    sourceNode.connect(gainNode).connect(pannerNode).connect(audioContext.destination);


    volumeControl = document.querySelector('#volume');

    volumeControl.addEventListener('input', function () {
        gainNode.gain.value = this.value;
    }, false);

    pannerControl = document.querySelector('#panner');
    pannerControl.addEventListener('input', function () {
        stereoPannerNode.pan.value = this.value;
    }, false);

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
