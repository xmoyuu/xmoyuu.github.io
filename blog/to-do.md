# 待办

I never [to-do](https://xmoyuu.github.io/demo/to-do/to-do)

## 设置日期与时间

[demo/to-do/set-input-date-time](https://xmoyuu.github.io/demo/to-do/set-input-date-time.html)

```html
<main id="main">
    <label for="date">date:</label>
    <input id="date" type="date" required>

    <label for="time">time:</label>
    <input id="time" type="time" required>
</main>

<script id="script">
    function getDateLocaleJSON() {
        let date = new Date()
        let time = date.getTime()
        timezoneOffset = date.getTimezoneOffset() * 60000
        return new Date(time - timezoneOffset).toJSON()
    }

    setInputDateTime()
    function setInputDateTime() {
        dateLocaleJSON = getDateLocaleJSON()
        currentDate = dateLocaleJSON.slice(0, 10)
        currentTime = dateLocaleJSON.slice(11, 16)

        date.value = date.min = currentDate
        time.value = currentTime
    }
</script>
```

`date.getTime()` 获取时间单位是毫秒

`date.getTimezoneOffset()` 获取时区偏移单位是分

`getDateLocaleJSON()` 返回日期本地化 JSON：`2020-01-01T00:00:00.000Z`

通过 `slice` 切分出日期与时间

## 本地存储

[demo/to-do/local-storage](https://xmoyuu.github.io/demo/to-do/local-storage.html)

```html
<main id="main">
    <ul id="ul"></ul>

    <label for="todo">todo:</label>
    <input id="todo" type="text" required>

    <label for="date">date:</label>
    <input id="date" type="date" required>

    <label for="time">time:</label>
    <input id="time" type="time" required>

    <button id="add">+</button>
</main>

<script id="script">
    function getDateLocaleJSON() {
        let date = new Date()
        let time = date.getTime()
        timezoneOffset = date.getTimezoneOffset() * 60000
        return new Date(time - timezoneOffset).toJSON()
    }

    setInputDateTime()
    function setInputDateTime() {
        dateLocaleJSON = getDateLocaleJSON()
        currentDate = dateLocaleJSON.slice(0, 10)
        currentTime = dateLocaleJSON.slice(11, 16)

        date.value = date.min = currentDate
        time.value = currentTime
    }

    listItemArray = new Array()

    function newListItem() {
        return {
            todo: todo.value,
            date: date.value,
            time: time.value,
            notified: false,
        }
    }

    function setLocalStorageAsJSON(name, object) {
        localStorage.setItem(name, JSON.stringify(object))
    }

    function getLocalStorageJSONParse(name) {
        return JSON.parse(localStorage[name])
    }

    add.onclick = () => {
        listItem = newListItem()
        listItemArray.push(listItem)
        createListItem(listItem)
        setLocalStorageAsJSON('todo', listItemArray)
    }

    function createListItem(listItem) {
        li = document.createElement('li')
        if (listItem.notified) li.style.color = 'rgba(255,0,0,1)'
        li.innerText = `${listItem.todo}-${listItem.date}-${listItem.time}`
        li.appendChild(createDeleteButton())
        ul.appendChild(li)
    }

    function createDeleteButton() {
        deleteButton = document.createElement('button')
        deleteButton.innerText = 'X'
        deleteButton.className = 'delete'
        deleteButton.onclick = event => {
            deleteButtonALL = document.querySelectorAll('.delete')
            let deleteButtonIndex
            for (let index = 0; index < deleteButtonALL.length; index++) {
                const element = deleteButtonALL[index]
                if (event.target === element) {
                    deleteButtonIndex = index
                }
            }
            listItemArray.splice(deleteButtonIndex, 1)
            event.target.parentNode.parentNode.removeChild(event.target.parentNode)
            setLocalStorageAsJSON('todo', listItemArray)
        }
        return deleteButton
    }

    showToDo()
    function showToDo() {
        if (localStorage['todo']) {
            listItemArray = getLocalStorageJSONParse('todo')
            for (const iterator of listItemArray) {
                createListItem(iterator)
            }
        }
    }
</script>
```

将数组以 `JSON.stringify(object)` JSON 字符串化形式存入 `localStorage` 本地存储

```json
[{
    "todo": "1",
    "date": "2020-01-01",
    "time": "01:01",
    "notified": false
}, {
    "todo": "2",
    "date": "2020-02-02",
    "time": "02:02",
    "notified": false
}]
```

`event.target === element` 通过遍历元素是否与触发事件目标相同记录对应索引

`listItemArray.splice(deleteButtonIndex, 1)` 绞接数组去除索引项

## 请求通知权限

[demo/to-do/ask-notification-permission](https://xmoyuu.github.io/demo/to-do/ask-notification-permission.html)

```html
<main id="main">
    <button id="ask">ask notification permission</button>
</main>

<script id="script">
    askNotificationPermission()
    ask.onclick = () => {
        askNotificationPermission()
    }
    function askNotificationPermission() {
        if (window.Notification) {
            Notification.requestPermission()
                .then(result => {
                    if (Notification.permission != 'default') {
                        ask.hidden = true
                    }
                })
        } else {
            ask.hidden = true
        }
    }
</script>
```

## 通知

[demo/to-do/notification](https://xmoyuu.github.io/demo/to-do/notification)

```html
<main id="main">
    <button id="ask">ask notification permission</button>
    <button id="show">show notification</button>
</main>

<script id="script">
    function emojiAsFavicon(emoji, x, y) {
        canvas = document.createElement('canvas')
        canvas.height = 32
        canvas.width = 32
        context = canvas.getContext('2d')
        context.font = '28px serif'
        context.fillText(emoji, x, y)
        return canvas.toDataURL()
    }

    icon = emojiAsFavicon('🧐', -4, 28)
    image = '2019-bilibiliID-11371674-BY-你的心弦有我来过-bilibiliUID-11134708-NC.jpg'

    askNotificationPermission()
    ask.onclick = () => {
        askNotificationPermission()
    }
    function askNotificationPermission() {
        if (window.Notification) {
            Notification.requestPermission()
                .then(result => {
                    if (Notification.permission != 'default') {
                        ask.hidden = true
                    }
                })
        } else {
            ask.hidden = true
        }
    }

    function showNotification(title, body, icon, image) {
        if (window.Notification) {
            options = {
                body: body,
                icon: icon,
                image: image,
            }
            new Notification(title, options)
        }
    }

    show.addEventListener('click', () => {
        showNotification('title', 'hello', icon, image)
    })
</script>
```

### 延迟定时器

[demo/to-do/delay-timer](https://xmoyuu.github.io/demo/to-do/delay-timer)

```html
<script id="script">
    async function delay(s) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(2)
            }, s * 1000)
        })
    }

    timer()
    async function timer() {
        await delay(60 - new Date().getSeconds())
        check()
        setInterval(() => {
            check()
        }, 60 * 1000)
    }

    check()
    function check() {
        alert('hello')
    }
</script>
```

延迟到整分才启动时间间隔为一分钟的定时器

## 检测

```javascript
    function dash2slash(string) {
        return string.split('-').join('/')
    }

    check()
    function check() {
        for (const iterator of listItemArray) {
            if (!iterator.notified) {
                let date = new Date(`${dash2slash(iterator.date)} ${iterator.time}`)
                if (date < new Date()) {
                    iterator.notified = true
                    showNotification('todo', iterator.todo)
                }
            }
        }
        setLocalStorageAsJSON('todo', listItemArray)
        refreshView()
    }

    function refreshView() {
        ul.innerHTML = ''
        showToDo()
    }
```

对列表项数组进行检测，到时则将 notified 置为 true 并显示通知

ios mobile safari 浏览器的 `new Date` 的日期只接受 `2020/02/02` 格式
