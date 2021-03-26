# 开篇

What's past is prologue

这是用来记录这个页面是如何工作的开篇

## 软件

[Visual Studio Code](https://code.visualstudio.com)：宇宙第一编辑器（[MIT](https://github.com/microsoft/vscode)）

- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)：Live Reload 本地服务器

[Mark Text](https://marktext.app/)：Markdown 编辑器，更推荐 [Typora](https://www.typora.io)（[MIT](https://github.com/marktext/marktext)）

[GitHub Desktop](https://desktop.github.com)：GitHub 客户端（Free）

## GitHub Pages

将名为 `xmoyuu.github.io` 的文件夹上传到了 [GitHub](https://github.com/xmoyuu/xmoyuu.github.io)

`username.github.io` 格式命名的文件夹名即其域名，可被访问读取索引页 `index.html` 

这就是 [GitHub Pages](https://pages.github.com/)

## 前端路由

参考：[Web 前端路由原理解析和实现](https://github.com/whinc/blog/issues/13)

### history-popstate

[/demo/blog/router/history-popstate](https://xmoyuu.github.io/demo/blog/router/history-popstate)

```html
<body>
    <nav>
        <ul>
            <li><a href="/home">home</a></li>
            <li><a href="/about">about</a></li>
        </ul>
    </nav>
    <main>
        <article id="article">loading...</article>
    </main>
</body>

<script>
    onPopState()
    addEventListener('popstate', onPopState)
    function onPopState() {
        switch (location.pathname) {
            case '/home':
                article.innerHTML = 'home'
                return
            case '/about':
                article.innerHTML = 'about'
                return
            default:
                return
        }
    }

    paths = document.querySelectorAll('a[href]')
    onLoad(paths)
    function onLoad(paths) {
        paths.forEach(element => {
            element.addEventListener('click', event => {
                event.preventDefault()
                history.pushState(null, '',
                    element.getAttribute('href'),
                )
                onPopState()
            })
        })
    }
</script>
```

浏览器前进后退改变 URL 时会触发 `popstate` 事件

对 https://xmoyuu.github.io/index.html

`history.pushState(null,'',anchor)` 将使浏览器地址栏显示

为 https://xmoyuu.github.io/anchor

并不会导致浏览器加载 anchor ，这使页面实际停留在 `index.html`

这就是造假

### hashchange

[/demo/blog/router/hashchange](https://xmoyuu.github.io/demo/blog/router/hashchange)

```html
<body>
    <nav>
        <ul>
            <li><a href="#/home">home</a></li>
            <li><a href="#/about">about</a></li>
        </ul>
    </nav>
    <main>
        <article id="article">loading...</article>
    </main>
</body>

<script>
    onHashChange()
    addEventListener('hashchange', onHashChange)
    function onHashChange() {
        switch (location.hash) {
            case '#/home':
                article.innerHTML = 'home'
                return
            case '#/about':
                article.innerHTML = 'about'
                return
            default:
                return
        }
    }        
</script>
```

[/demo/blog/router/document-fragment#bottom](https://xmoyuu.github.io/demo/blog/router/document-fragment.html#bottom)

哈希符 hash sign `#` 本是用来方便链接到对应的文档片段 document fragment

也正是因为只是在文档内，没有其它行为，导致了各种奇特用法

### 对比

监听 `hashchange` 事件实现的路由的问题在于非浏览器，例如微信会有跳转末尾加参数

基于 `history.pushState` 和监听 `popstate` 事件实现的路由问题在于，

例如 `anchor` 在 `/` 根目录中实际并不存在...而是被放在了 /blog/ 文件夹中：[/blog/anchor](https://xmoyuu.github.io/blog/anchor)

直接访问 https://xmoyuu.github.io/anchor 而不是通过 `index.html` 获取对应文件便会见到 [404 File not found](https://xmoyuu.github.io/demo/blog/router/404)，这意味着通常需要服务器强制指向 `index.html`

## 404 页面重定向

参考：[Single Page Apps for GitHub Pages](https://github.com/rafrex/spa-github-pages)

GitHub Pages 可以[自定义 404 页面](https://help.github.com/en/github/working-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)

[/404](https://xmoyuu.github.io/404)

```javascript
        let { protocol, hostname, port, pathname, search, hash } = location
        location.replace(
            protocol + '//'
            + hostname
            + (port ? ':' + port : '')
            + '/?pathname=' + pathname
            + (search ? '&search=' + search.slice(1).replace(/&/g, '~and~') : '')
            + hash
        )
```

将 https://xmoyuu.github.io/one/two?a=b&c=d#hash 

重定向

为 https://xmoyuu.github.io/?pathname=/one/two&search=a=b~and~c=d#hash

由于 `?` 后的是查询参数这样实际访问的便是 `index.html`

[/js/redirect-handle.js](https://xmoyuu.github.io/js/redirect-handle.js)

```javascript
let { protocol, hostname, port, pathname, search, hash } = location
if (search) {
    newLocation = {}
    search.slice(1).split('&').forEach(element => {
        array = element.split('=')
        newLocation[array[0]] = array.slice(1).join('=').replace(/~and~/g, '&')
    })
    if (newLocation.pathname !== undefined) {
        history.replaceState(null, null,
            pathname.slice(0, -1)
            + (newLocation.pathname || '')
            + (newLocation.search ? ('?' + newLocation.search) : '')
            + hash
        )
    }
}
```

`history.replaceState` 能触发 `popstate` 事件

## 随机引用

[/demo/blog/random-quote/random-quote.html](https://xmoyuu.github.io/demo/blog/random-quote/random-quote)

```html
<body>
    <blockquote id="blockquote"></blockquote>
</body>

<script>
    function getRandomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min
    }

    randomQuote('quote.json', blockquote)
    function randomQuote(path, element) {
        fetch(path)
            .then(response => {
                if (response.status === 404) {
                    return 404
                }
                return response.json()
            })
            .then(json => {
                random = getRandomInt(0, json.quote.length)
                quote = json.quote[random]
                element.innerHTML = `
                    「${quote.content} 」${quote.author}
                    ${quote.cite ? ` , <cite>${quote.cite}</cite>` : ''}
                    ${quote.url ? ` <a href='${quote.url}'>🔗</a>` : ''}
                    `
            })
    }
</script>
```

`getRandomInt` 返回 min<=x<max 随机整数

## 通过 GitHub API 获取对应 Markdown 的 HTML 文件

参考：[REST API v3](https://developer.github.com/v3/)

[/demo/blog/fetch-github-api-content/fetch-github-api-content](https://xmoyuu.github.io/demo/blog/fetch-github-api-content/fetch-github-api-content)

```html
<body>
    <article id="article"></article>
</body>

<script>
    fetchGithubAPIContent(article)
    function fetchGithubAPIContent(element) {
        url = 'https://api.github.com/repos/xmoyuu/xmoyuu.github.io/contents/blog/anchor.md'
        fetch(url, {
            headers:
            {
                'Accept': 'application/vnd.github.v3.html'
            }
        })
            .then(response => {
                if (response.status === 404) {
                    return 404
                }
                return response.text()
            })
            .then(text => {
                element.innerHTML = text
            })
    }
</script>
```

通过在头部添加参数

`'Accept': 'application/vnd.github.v3.html'`

获取到转换后的 HTML 文件

## 絵文字作为图标

参考：[Emojis as favicons](https://koddsson.com/posts/emoji-favicon/)

[/demo/blog/emoji-as-favicon/emoji-as-favicon](https://xmoyuu.github.io/demo/blog/emoji-as-favicon/emoji-as-favicon)

```html
<head>
    <link rel="icon" type="image/png">
    <link rel="apple-touch-icon">

    <script>
        icon = document.querySelector('link[rel=icon]')
        appleTouchIcon = document.querySelector('link[rel=apple-touch-icon]')
        emojiAsFavicon('🧐', -4, 28)
        emojiAsAppleTouchIcon('🧐', 10, 150)

        function emojiAsFavicon(emoji, x, y) {
            canvas = document.createElement('canvas')
            canvas.height = 32
            canvas.width = 32
            context = canvas.getContext('2d')
            context.font = '28px serif'
            context.fillText(emoji, x, y)
            icon.href = canvas.toDataURL()

            // string = `background:url('${canvas.toDataURL()}')no-repeat;font-size:32px;`
            // console.log(`%c  `, string)
        }

        function emojiAsAppleTouchIcon(emoji, x, y) {
            canvas = document.createElement('canvas')
            canvas.height = 180
            canvas.width = 180
            context = canvas.getContext('2d')
            context.font = '160px serif'
            context.fillText(emoji, x, y)
            appleTouchIcon.href = canvas.toDataURL()
        }
    </script>
</head>
```

通过 `canvas.toDataURL()` 生成一个 data URL 链接

## 跟随系统设置亮暗主题

[dark.css](https://xmoyuu.github.io/demo/blog/prefers-color-scheme/dark.css)

```css
body {
    background-color: rgb(33, 33, 33);
    color: white;
}
```

[light.css](https://xmoyuu.github.io/demo/blog/prefers-color-scheme/light.css)

```css
body {
    background-color: rgb(233, 233, 233);
    color: black;
}
```

[/demo/blog/prefers-color-scheme/prefers-color-scheme](https://xmoyuu.github.io/demo/blog/prefers-color-scheme/prefers-color-scheme)

```html
<head>
    <link rel="stylesheet" href="dark.css">
    <link rel="stylesheet" href="light.css" media="(prefers-color-scheme: light)">
</head>
```

`F12` 开发工具 → Settings → Preferences → Rendering → Emulate CSS media feature prefers-color-scheme

模拟切换

[GitHub syntax theme](https://github.com/primer/github-syntax-theme-generator)：GitHub 语法主题

## Service Worker 缓存所有请求内容

[/demo/blog/service-worker/service-worker-register](https://xmoyuu.github.io/demo/blog/service-worker/service-worker-register.html)

```html
<head>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(reg => {
                    console.log('registration succeeded')
                    console.log(`scope:${reg.scope}`)
                })
                .catch(error => {
                    console.log(`registration failed: ${error}`)
                })
        }
    </script>
</head>
```

注册 Service Worker

[/demo/blog/service-worker/service-worker.js](https://xmoyuu.github.io/demo/blog/service-worker/service-worker.js)

```javascript
addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1')
            .then(cache => {
                return cache.addAll([
                    'service-worker-register.html',
                ])
            })
    )
})

addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response
                return fetch(event.request)
            })
            .then(response => {
                return caches.open('v1')
                    .then(cache => {
                        cache.put(event.request, response.clone())
                        return response
                    })
            })
    )
})
```

初始安装并缓存内容

随后拦截所有请求并缓存所有请求内容
