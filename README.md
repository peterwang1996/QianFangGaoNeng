# 前方高能

## 这是个什么玩意儿

这是本 UP 主，哦不，本宝宝闲得蛋疼，写的一个黑科技小插件，用于 Chrome 浏览器（理论上 Webkit 内核的国产浏览器应该也可以用，但我还没测试过），作用就是在 Bilibili 的视频下面显示这么样一个图表：

![1](https://cloud.githubusercontent.com/assets/12966803/17796539/c10b5362-65f3-11e6-8f76-2d819aa67ec1.png)


如你所见，这个图表显示了当前视频在不同时间点的弹幕密度，它甚至还配有一个时间轴，可以随着视频的播放和跳转同步更新：

![2](https://cloud.githubusercontent.com/assets/12966803/17796541/c52921fe-65f3-11e6-8b70-0f436d98905d.gif)

甚至你在图表标线上面点击的时候，视频也会跳转到与之对应的时间点（准确地说是比选定的时间点提前一段时间，目前是5秒）：

![3](https://cloud.githubusercontent.com/assets/12966803/17796588/25faa034-65f4-11e6-923d-da1b884e8fda.gif)

// *μ*'s 的小姐姐们我爱你们啊！

这样宝宝们就可以一览众山小，快速空降到视频最精彩的部分，即便在还没有老司机刷“前方高能”的时候，也能提前准备好护目镜，防止被闪瞎了。

## 现在已经实现的功能

- 在 Bilibili 的所有视频下方显示弹幕密度图表
- 在新版（即没有 `<iframe>` 包裹的）官方播放器上实现时间轴和自动空降功能

## 计划中的功能

- 弄个像样的 Icon
- 对 Bilibili 的老版播放器和第三方播放器（如优酷腾讯爱奇艺的嵌入播放器）添加时间轴和自动空降的支持
- 增加对 AcFun 的支持
- 上线 Chrome Web Store

## 使用协议

本项目适用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 协议。

## 致谢

- 感谢 [Zepto.js](http://zeptojs.com/) 和 [echarts](http://echarts.baidu.com/) 两大开源项目的强力驱动
- 感谢 [coplay](https://github.com/Justineo/coplay) 项目提供的灵感和对 Bilibili 播放器 API 的解读
- 感谢光速兔同学（[@lightrabbit](https://github.com/lightrabbit)）对本项目以及本人在前端技术的探索道路上一直以来无私的帮助

## 更新日志

[V0.1 @ 2016-08-18] 基本功能完成，上线 GitHub
