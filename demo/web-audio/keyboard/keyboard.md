# Keyboard

将会使用`AudioContext`, `OscillatorNode`, `PeriodicWave`, `GainNode`

由于 `OscillatorNode` 是基于 `AudioScheduledSourceNode`，也会有少许例子

## HTML 部分

### 键盘部分

键盘太宽无法完整的显示在显示器上，为了水平滚动而不使其 wrap 折叠

```html
<div class="container">
    <div class="keyboard">

    </div>
</div>
```

`<div>` 是一个可滚动的盒子

### 设置条

#### 音量控制

```html
<div class="settingsBar">
    <div class="left">
        <span>Volume: </span>
        <input type="range" min="0.0" max="1.0" step="0.01" value="0.5" list="volumes" name="volume">
        <datalist id="volumes">
            <option value="0.0" label="Mute">
            <option value="1.0" label="100%">
        </datalist>
    </div>
</div>
```

滑块，数值 0 - 1，步长 0.01，默认值 0.5 

#### 波形选择

```javascript
<div class="right">
    <span>Current waveform: </span>
    <select name="waveform">
        <option value="sine">Sine</option>
        <option value="square" selected>Square</option>
        <option value="sawtooth">Sawtooth</option>
        <option value="triangle">Triangle</option>
        <option value="custom">Custom</option>
    </select>
</div>
```

## 准备

```javascript
    audioContext = new window.AudioContext();
    oscillatorList = [];
    gainNode = null;

    keyboard = document.querySelector(".keyboard");
    wavePicker = document.querySelector("select[name='waveform']");
    volumeControl = document.querySelector("input[name='volume']");

    notefrequency = null;
    sineTerms = null;
    cosineTerms = null;
    customWaveform = null;
```

sineTerms 和 cosineTerms 用于存储数据生成自定义波形

## 音符表

```javascript
    function createNoteTable() {
        notefrequency = [];
        for (i = 0; i < 9; i++) {
            notefrequency[i] = [];
        }

        notefrequency[0]["A"] = 27.500000000000000;
        notefrequency[0]["A#"] = 29.135235094880619;
        notefrequency[0]["B"] = 30.867706328507756;

        notefrequency[1]["C"] = 32.703195662574829;
        notefrequency[1]["C#"] = 34.647828872109012;
        notefrequency[1]["D"] = 36.708095989675945;
        notefrequency[1]["D#"] = 38.890872965260113;
        notefrequency[1]["E"] = 41.203444614108741;
        notefrequency[1]["F"] = 43.653528929125485;
        notefrequency[1]["F#"] = 46.249302838954299;
        notefrequency[1]["G"] = 48.999429497718661;
        notefrequency[1]["G#"] = 51.913087197493142;
        notefrequency[1]["A"] = 55.000000000000000;
        notefrequency[1]["A#"] = 58.270470189761239;
        notefrequency[1]["B"] = 61.735412657015513;
        notefrequency[2]["C"] = 65.406391325149658;
        notefrequency[2]["C#"] = 69.295657744218024;
        notefrequency[2]["D"] = 73.416191979351890;
        notefrequency[2]["D#"] = 77.781745930520227;
        notefrequency[2]["E"] = 82.406889228217482;
        notefrequency[2]["F"] = 87.307057858250971;
        notefrequency[2]["F#"] = 92.498605677908599;
        notefrequency[2]["G"] = 97.998858995437323;
        notefrequency[2]["G#"] = 103.826174394986284;
        notefrequency[2]["A"] = 110.000000000000000;
        notefrequency[2]["A#"] = 116.540940379522479;
        notefrequency[2]["B"] = 123.470825314031027;

        notefrequency[3]["C"] = 130.812782650299317;
        notefrequency[3]["C#"] = 138.591315488436048;
        notefrequency[3]["D"] = 146.832383958703780;
        notefrequency[3]["D#"] = 155.563491861040455;
        notefrequency[3]["E"] = 164.813778456434964;
        notefrequency[3]["F"] = 174.614115716501942;
        notefrequency[3]["F#"] = 184.997211355817199;
        notefrequency[3]["G"] = 195.997717990874647;
        notefrequency[3]["G#"] = 207.652348789972569;
        notefrequency[3]["A"] = 220.000000000000000;
        notefrequency[3]["A#"] = 233.081880759044958;
        notefrequency[3]["B"] = 246.941650628062055;

        notefrequency[4]["C"] = 261.625565300598634;
        notefrequency[4]["C#"] = 277.182630976872096;
        notefrequency[4]["D"] = 293.664767917407560;
        notefrequency[4]["D#"] = 311.126983722080910;
        notefrequency[4]["E"] = 329.627556912869929;
        notefrequency[4]["F"] = 349.228231433003884;
        notefrequency[4]["F#"] = 369.994422711634398;
        notefrequency[4]["G"] = 391.995435981749294;
        notefrequency[4]["G#"] = 415.304697579945138;
        notefrequency[4]["A"] = 440.000000000000000;
        notefrequency[4]["A#"] = 466.163761518089916;
        notefrequency[4]["B"] = 493.883301256124111;

        notefrequency[5]["C"] = 523.251130601197269;
        notefrequency[5]["C#"] = 554.365261953744192;
        notefrequency[5]["D"] = 587.329535834815120;
        notefrequency[5]["D#"] = 622.253967444161821;
        notefrequency[5]["E"] = 659.255113825739859;
        notefrequency[5]["F"] = 698.456462866007768;
        notefrequency[5]["F#"] = 739.988845423268797;
        notefrequency[5]["G"] = 783.990871963498588;
        notefrequency[5]["G#"] = 830.609395159890277;
        notefrequency[5]["A"] = 880.000000000000000;
        notefrequency[5]["A#"] = 932.327523036179832;
        notefrequency[5]["B"] = 987.766602512248223;

        notefrequency[6]["C"] = 1046.502261202394538;
        notefrequency[6]["C#"] = 1108.730523907488384;
        notefrequency[6]["D"] = 1174.659071669630241;
        notefrequency[6]["D#"] = 1244.507934888323642;
        notefrequency[6]["E"] = 1318.510227651479718;
        notefrequency[6]["F"] = 1396.912925732015537;
        notefrequency[6]["F#"] = 1479.977690846537595;
        notefrequency[6]["G"] = 1567.981743926997176;
        notefrequency[6]["G#"] = 1661.218790319780554;
        notefrequency[6]["A"] = 1760.000000000000000;
        notefrequency[6]["A#"] = 1864.655046072359665;
        notefrequency[6]["B"] = 1975.533205024496447;
        notefrequency[7]["C"] = 2093.004522404789077;
        notefrequency[7]["C#"] = 2217.461047814976769;
        notefrequency[7]["D"] = 2349.318143339260482;
        notefrequency[7]["D#"] = 2489.015869776647285;
        notefrequency[7]["E"] = 2637.020455302959437;
        notefrequency[7]["F"] = 2793.825851464031075;
        notefrequency[7]["F#"] = 2959.955381693075191;
        notefrequency[7]["G"] = 3135.963487853994352;
        notefrequency[7]["G#"] = 3322.437580639561108;
        notefrequency[7]["A"] = 3520.000000000000000;
        notefrequency[7]["A#"] = 3729.310092144719331;
        notefrequency[7]["B"] = 3951.066410048992894;

        notefrequency[8]["C"] = 4186.009044809578154;
        
        return notefrequency;
    }
```

属性的值是音符的频率 HZ

### 创建按键

```javascript
    function createKey(note, octave, frequency) {
        keyElement = document.createElement("div");
        labelElement = document.createElement("div");

        keyElement.className = "key";
        keyElement.dataset["octave"] = octave;
        keyElement.dataset["note"] = note;
        keyElement.dataset["frequency"] = frequency;

        labelElement.innerHTML = note + "<sub>" + octave + "</sub>";
        keyElement.appendChild(labelElement);

        keyElement.addEventListener("mousedown", notePressed, false);
        keyElement.addEventListener("mouseup", noteReleased, false);
        keyElement.addEventListener("mouseover", notePressed, false);
        keyElement.addEventListener("mouseleave", noteReleased, false);

        return keyElement;
    }
```

### 构建键盘

```javascript
    function setup() {
        notefrequency = createNoteTable();

        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = volumeControl.value;

        volumeControl.addEventListener("change", function () {
            gainNode.gain.value = volumeControl.value
        }, false);

        // Create the keys; skip any that are sharp or flat; for
        // our purposes we don't need them. Each octave is inserted
        // into a <div> of class "octave".

        notefrequency.forEach(function (keys, index) {
            keyList = Object.entries(keys);
            octaveElement = document.createElement("div");
            octaveElement.className = "octave";

            keyList.forEach(function (key) {
                if (key[0].length == 1) {
                    octaveElement.appendChild(createKey(key[0], index, key[1]));
                }
            });

            keyboard.appendChild(octaveElement);
        });

        document.querySelector("div[data-note='B'][data-octave='5']").scrollIntoView(false);

        sineTerms = new Float32Array([0, 0, 1, 0, 1]);
        cosineTerms = new Float32Array(sineTerms.length);
        customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

        for (i = 0; i < 9; i++) {
            oscillatorList[i] = [];
        }
    }
    setup();
```

获取音符表

事件监听调用动态改变音量函数

创建增益节点，并将获取到的数值传入增益节点

Object.entries 获取键值对 `[key, value]`

检查音符的名称是否是多个字符，跳过忽略这些尖锐的音符。单字符则调用 createKey 函数创建按键。

滚动八度音阶 5 和 B 的音符进入可视范围

使用 createPeriodicWave 构建自定义波形

初始化振荡器列表

### 播放

```javascript
    function playTone(frequency) {
        oscillator = audioContext.createOscillator();
        oscillator.connect(gainNode);

        type = wavePicker.options[wavePicker.selectedIndex].value;
        if (type == "custom") {
            oscillator.setPeriodicWave(customWaveform);
        } else {
            oscillator.type = type;
        }

        oscillator.frequency.value = frequency;
        oscillator.start();

        return oscillator;
    }
```

根据选项创建振荡器并获取类型赋值

```javascript
    function notePressed(event) {
        if (event.buttons & 1) {
            dataset = event.target.dataset;
            if (!dataset["pressed"]) {
                oscillatorList[dataset["octave"][dataset["note"]]] = playTone(dataset["frequency"]);
                dataset["pressed"] = "yes";
            }
        }
    }

    function noteReleased(event) {
        dataset = event.target.dataset;

        if (dataset && dataset["pressed"]) {
            oscillatorList[dataset["octave"][dataset["note"]]].stop();
            oscillatorList[dataset["octave"][dataset["note"]]] = null;
            delete dataset["pressed"];
        }
    }
```

注意 target 的目标可能是 `labelElement.innerHTML = note + "" + octave + "";`

不存在 dataset，需要判断修改为父元素或者留出大量空白方便点击获取目标。

## 样式

```css
    .key {
        cursor: pointer;
        font: 16px "Open Sans", "Lucida Grande", "Arial", sans-serif;
        border: 1px solid black;
        border-radius: 5px;
        width: 20px;
        height: 80px;
        text-align: center;
        box-shadow: 2px 2px darkgray;
        display: inline-block;
        position: relative;
        margin-right: 3px;
        user-select: none;
    }
```


