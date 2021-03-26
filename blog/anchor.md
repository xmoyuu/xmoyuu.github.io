# 锚

这是用来固定的锚

# 软件

## Windows 10

### 系统安装

官方提供了工具用于[下载 Windows 10](https://www.microsoft.com/zh-cn/software-download/windows10) 最新版本镜像：

- 安装 Windows 10 后立即登录微软账号用户名会为邮箱前 5 位字符

- 自 1903 后可初始化设置第二键盘布局（输入法）

- OneDrive → 登录账号 → 取消链接此电脑 → 禁用开机自启动

### 微软拼音

初始化不设置第二键盘布局则需要在语言添加英语，注意第一顺位将为系统默认语言

`Win` + `Space`  切换至第二键盘布局（美式键盘）能避免例如智能感知 [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense) 的快捷键 `Ctrl` + `Space` 被微软拼音占用，或者游戏时在后台响应导致掉帧

- 键入 `uu` 进入 U 模式输入，`uubd` 能找到标点直角引号 `「」`

- 键入 `v` 进入 V 模式输入，`v2020.1.1` 2020 年 1 月 1 日

- 键入 `张三;r` 进入人名输入模式

- 键入 `日期`、`时间`、`农历`

### 网络

[Simple DNSCrypt](https://simplednscrypt.org/)：DNS 加密（[MIT](https://github.com/bitbeans/SimpleDnsCrypt)）

- 启用 DNSCrypt 服务 → 选择网卡

- 高级设置 → 备用 DNS 服务器中国大陆填 114.114.114.114:53

[TrafficMonitor](https://github.com/zhongyang219/TrafficMonitor)：网速监控，可嵌入到任务栏（[GPL](https://github.com/zhongyang219/TrafficMonitor)）

### 浏览器

[Firefox](https://www.mozilla.org/zh-CN/firefox/channel/desktop)：[开发者版本](https://www.mozilla.org/kab/firefox/developer)图标好看（[MPL](http://releases.mozilla.org/pub/firefox)）

[Vivaldi](https://vivaldi.com)：Opera 创始人[谭咏文](https://zh.wikipedia.org/wiki/谭咏文)再造浏览器（[Source](https://vivaldi.com/source)，不含界面代码）

扩展程序：

[Stylus](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)：用户样式管理器，清除浏览器存储时此扩展数据会被清除（[MIT](https://github.com/openstyles/stylus)）

- [用户样式列表](https://github.com/xmoyuu/xmoyuu.github.io/tree/master/data/user-css)

[Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)：提供用户脚本支持（[MIT](https://github.com/violentmonkey/violentmonkey)）

- [為什麼你們就是不能加個空格呢？](https://github.com/vinta/pangu.js/raw/master/browser_extensions/firefox/paranoid-auto-spacing.user.js)

- [智能划词翻译](https://greasyfork.org/zh-CN/scripts/35251)

- [Picviewer CE+](https://greasyfork.org/zh-CN/scripts/24204)

- [Search By Image](https://greasyfork.org/zh-CN/scripts/2998)

- [searchEngineJump](https://greasyfork.org/zh-CN/scripts/27752-searchenginejump-搜索引擎快捷跳转)

- [Super_preloaderPlus_one_改](https://greasyfork.org/zh-CN/scripts/33522)

快速拨号图片：[Pixiv ID: 58222697](https://www.pixiv.net/member_illust.php?mode=medium&illust_id=58222697) 

标题栏图片：[官方博客评论区](https://forum.vivaldi.net/topic/26952/perfect-textures-in-vivaldi/13)

[官方论坛 Modifications 板块](https://forum.vivaldi.net/category/52/modifications)

### 编辑器

[Mark Text](https://marktext.app/)：Markdown 编辑器，更推荐 [Typora](https://www.typora.io)（[MIT](https://github.com/marktext/marktext)）

[Visual Studio Code](https://code.visualstudio.com)：宇宙第一编辑器（[MIT](https://github.com/microsoft/vscode)）

- [Activitus Bar](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.activitusbar)：状态栏替代活动栏

- [Chinese (Simplified)](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)：中文语言包

- [Copy Relative Path](https://marketplace.visualstudio.com/items?itemName=alexdima.copy-relative-path)：复制文件相对路径

- [CSS Formatter](https://marketplace.visualstudio.com/items?itemName=aeschli.vscode-css-formatter)：CSS 格式化

- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)：Live Reload 本地服务器

- [Vibrancy](https://marketplace.visualstudio.com/items?itemName=eyhn.vscode-vibrancy)：亚克力效果 [issue](https://github.com/EYHN/vscode-vibrancy/issues/5#issuecomment-546591977)

用户设置 `settings.json`：

```json
{
    "editor.formatOnPaste": true,
    "editor.minimap.enabled": false,
    "editor.mouseWheelZoom": true,
    "editor.wordWrap": "bounded",
    "terminal.integrated.cursorBlinking": true,
    "terminal.integrated.cursorStyle": "line",
    "workbench.activityBar.visible": false,
    "window.title": "${dirty}${activeEditorMedium}${separator}${appName}",
    "liveServer.settings.AdvanceCustomBrowserCmdLine": "C:\\Program Files\\Firefox Developer Edition\\firefox.exe",
}
```

快捷键绑定 `keybindings.json` ：

```json
[
    {
        "key": "alt+n",
        "command": "selectNextSuggestion",
        "when": "suggestWidgetMultipleSuggestions && suggestWidgetVisible && textInputFocus"
    },
    {
        "key": "alt+p",
        "command": "selectPrevSuggestion",
        "when": "suggestWidgetMultipleSuggestions && suggestWidgetVisible && textInputFocus"
    }
]
```

### 图片编辑器

[Krita](https://krita.org/zh)：自由软件（[GPL](https://krita.org/en/download/krita-desktop)）

[Paint.NET](https://www.getpaint.net/index.html)：Windows 7 上非常好看，V3.5 后[不再开源](https://blog.getpaint.net/2009/11/06/a-new-license-for-paintnet-v35)（Free）

### 开发

[Git](https://git-scm.com)：分布式版本控制系统（[GPL](https://github.com/git/git)）

[Windows Terminal](https://www.microsoft.com/zh-cn/p/windows-terminal/9n0dx20hk701)：现代化的终端（[MIT](https://github.com/microsoft/terminal)）

```json
        "defaults": {
            // Put settings here that you want to apply to all profiles.
            "useAcrylic": true
        },
```

[GitHub Desktop](https://desktop.github.com)：GitHub 客户端（Free）

[VirtualBox](https://www.virtualbox.org)：虚拟机（[GPL](https://www.virtualbox.org/wiki/Downloads)）

### 其它

[火绒](https://www.huorong.cn)：好看（Free）

[7-Zip](http://www.7-zip.org)：解压缩软件，右键菜单计算文件哈希值（[GPL](http://www.7-zip.org/download.html)）

[f.lux](https://justgetflux.com)：自动调节屏幕色温，[f.lux 的故事](https://motherboard.vice.com/en_us/article/d7yvqq/the-story-behind-flux-the-night-owls-color-shifting-sleep-app-of-choice)（Free）

[KeePass](https://keepass.info)：密码管理器（[GPL](https://keepass.info/help/v2/license.html)）

> 集成-随系统启动
> 
> 高级-启动时最小化并锁定。

[QuickLook](http://pooi.moe/QuickLook)：简单的查看器，[插件列表](https://github.com/QL-Win/QuickLook/wiki/Available-Plugins)（[GPL](https://github.com/xupefei/QuickLook)）

[Snipaste](https://zh.snipaste.com)：好看的截图软件（Free）

# SNS

## Weibo

[@Fenng](https://m.weibo.cn/u/1577826897)

[@tombkeeper](https://m.weibo.cn/u/1401527553)

## Twitter

[@陈少举](https://twitter.com/chenshaoju)

[@方舟子](https://twitter.com/fangshimin)

![](../image/anchor/rgba.png)
