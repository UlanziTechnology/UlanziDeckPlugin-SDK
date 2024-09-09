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
├── langs      //放翻译文件，需要和libs在同一级目录下。json 文件中的 Localization为页面对照的翻译项
│   ├── en.json      
│   ├── zh.json    
│   └── zh_CN.json    
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
```


## 使用

### 一些说明和约定
```bash
1. 插件库的主服务（例app.html）会一直与上位机连接，用于做主要功能，包括上位机icon的更新等。

2. 插件库的配置项（例inspector.html），配置项我们后续称为action。切换功能按键之后就会被销毁，不宜做功能处理。主要用于发送配置项到上位机和同步上位机数据。

3. 为了统一管理，我们的插件包的名称为 com.ulanzi.插件名.ulanziPlugin

3. 为了通用库的正常使用，主服务连接的uuid我们约定长度是4。例：com.ulanzi.ulanzideck.插件名

4. 配置项连接的uuid要大于4用于区分。例：com.ulanzi.ulanzideck.插件名.插件action

5. 本地化文件夹（langs）需放在与libs同级目录下，例：langs/zh.json

6. 为了UI字体的统一，我们已经在udpi.css设置了开源字体思源黑体（Source Han Sans），在app.html也同样需要引用字体库。请大家在绘制icon时，统一使用'Source Han Sans'。

7. 上位机的背景颜色为 '#282828'，通用css（udpi.css）已经设定了'--udpi-bgcolor: #282828;'。若要自定义action的背景颜色应与上位机背景色相同，避免插件背景颜色过于突兀。

```