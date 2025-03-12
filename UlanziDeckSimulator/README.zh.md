# 上位机模拟器

<p align="start">
   <a href="./README.md">English</a> | <strong>简体中文</strong>
</p>

## 介绍
上位机模拟器，用于模拟上位机与插件之间的通信，开发者可以在此模拟器上测试插件功能。本模拟器主要用于方便开发调试，具体运行效果请以桌面软件运行结果为准。


## 运行

```
npm install
npm start
```


## 说明
 <ol >
  <li>开始编写插件前，请前往 <a href="https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK
    " target="_blank">插件开发SDK</a> 和 <a href="https://cloud.tencent.com/developer/article/2461403" target="_blank">从零开始：UlanziDeck插件开发之旅</a> 了解一些开发说明和介绍</li>
  <li>测试插件请按照协议要求填写manifest.json，然后放在 UlanziDeckSimulator/static/plugins 目录中。模拟器会自动解析插件，并展示在模拟器左侧列表当中。插件更新需要点击 <strong>刷新插件列表</strong> 按钮，让模拟器重载插件。</li>
  <li>当前版本，主服务需要开发者自行启动，请按照提示启动主服务再进行操作。</li>
  <li>调试顺序：启动上位机模拟器 -> 确认插件主服务已连接 -> 拖入键盘，调试action</li>
  <li>模拟器不支持上位机的特殊事件：openview， selectdialog。若有打开弹窗和选择文件/文件夹功能，请在上位机中测试。</li>
  <li>模拟器暂时没有页面切换，不主动发送setactive事件，请开发者右键自行发送事件来测试功能。</li>
  <li>默认不加载action，我们的目的是让开发者自己运行action页面已达到开发调试的效果。打开加载action可能会导致与开发者打开的action页面有websocket冲突，影响测试结果。</li>
</ol>

## 功能

1. 上位机模拟器，默认端口39069
2. 启动成功，浏览器打开http://127.0.0.1:39069
3. 按照模拟器提示，进行测试
