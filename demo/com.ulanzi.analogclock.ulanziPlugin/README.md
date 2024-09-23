# com.ulanzi.analogclock.ulanziPlugin （html版式示例）

## 简介
为了更直观的演示通用库 html 版本的使用，我们用analogclock来做插件例子

```bash
当前版本根据 Ulanzi JS 插件开发协议-V1.2.0 来编写
```


## 文件介绍
```bash
com.ulanzi.analogclock.ulanziPlugin
├── assets         //主要用于存放上位机icon的展示和action状态的切换
│   └── icons      
│       └── icon.png
├── libs    //插件通用库，此处不做具体介绍，可前往common-html目录查看。libs更新版本请以common-html/libs目录为准
│  
├── plugin  //js主要功能模块,包括action的处理
│   ├── actions   //处理具体action逻辑
│   ├── app.html  //主服务html，作为入口
│   └── app.js    //主服务js
├── property-inspector // 配置项html和form表单的读写
│   └── clock      //action的名称
│       ├── inspector.html  //配置项html
│       └── inspector.js  //配置项js，用于做socket连接和form表单的处理
├── manifest.json         //具体配置项的编写可查看插件协议
├── zh_CN.json      //中文翻译文件
├── en.json         //英文翻译文件
```


## 使用

### 一些说明和约定
```bash
1. 插件库的主服务（例app.html）会一直与上位机连接，用于做主要功能，包括上位机icon的更新等。

2. 插件库的配置项（例inspector.html），配置项我们后续称为action。切换功能按键之后就会被销毁，不宜做功能处理。主要用于发送配置项到上位机和同步上位机数据。

3. 为了统一管理，我们的插件包的名称为 com.ulanzi.插件名.ulanziPlugin

3. 为了通用库的正常使用，主服务连接的uuid我们约定长度是4。例：com.ulanzi.ulanzideck.插件名

4. 配置项连接的uuid要大于4用于区分。例：com.ulanzi.ulanzideck.插件名.插件action

5. 本地化文件放在插件根目录下，即与libs插件通用库同级。例：zh_CN.json en.json

6. 为了UI字体的统一，我们已经在udpi.css设置了开源字体思源黑体（Source Han Sans），在app.html也同样需要引用字体库。请大家在绘制icon时，统一使用'Source Han Sans'。

7. 上位机的背景颜色为 '#282828'，通用css（udpi.css）已经设定了'--udpi-bgcolor: #282828;'。若要自定义action的背景颜色应与上位机背景色相同，避免插件背景颜色过于突兀。

```

## 本地化翻译文件编写规则

### 参数介绍
```bash
以zh_CN.json为例

name:插件名称
description:插件描述
actions:插件action列表，数组形式。每个action需要填写name(action名称)和tooltip(悬浮提示)


localization: 插件内容本地化
使用规则：在action的html页面，将需要翻译的节点加上data-localize的属性。common-html的通用库会自动读取对应。
注意：编写页面时请默认使用英文，然后在根目录下添加语言环境对应的json，例如zh_CN.json

```

### zh_ CN.json 的示例
```json
{
  "Name" : "时钟模拟",
  "Description": "实时显示时间", 
  "Actions" :[
    {
      "Name": "设置时钟",
      "Tooltip": "更改时钟样式"
    }
  ],
  "Localization": {  
    "Face": "钟面",
    "Digital": "数字",
    "Black" : "黑色",
    "Blue" : "蓝色",
    "Blueish" : "浅蓝",
    "Green" : "绿色",
    "Red": "红色",
    "White": "白色",
    "Transparent": "透明"
  }
}

```


