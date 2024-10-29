# com.ulanzi.ulanzideck.teamspeak5 （node版式示例）

## 简介
为了更直观的演示通用库 node 版本的使用，我们用teamspeak5来做插件例子

```bash
当前版本根据 Ulanzi JS 插件开发协议-V1.2.1 来编写
```


## 文件介绍
```bash
com.ulanzi.teamspeak5.ulanziPlugin
├── assets         //主要用于存放上位机icon的展示和action状态的切换
│   ├── icons      
│       └── icon.png
│   └── actions       //主要用于存放action状态切换的icon
├── dist    //node打包后的运行文件，因为含有node_mudules会导致插件包体积过大
├── libs    //插件html通用库（action页面引用），此处不做具体介绍，可前往 UlanziTechnology/plugin-common-html 目录查看。libs更新版本请以 UlanziTechnology/plugin-common-html 目录为准。
├── plugin  //js开发运行目录。主要功能模块,包括action的处理
│   ├── actions   //处理具体action逻辑
│       ├── plugin-common-node  // 插件node通用库（node服务引用），此处不做具体介绍，可前往 UlanziTechnology/plugin-common-node 目录查看。更新版本请以 UlanziTechnology/plugin-common-node 目录为准
│       └── ...   // 剩下的都是插件功能js
│   └── app.js    //主服务js，此处可引用 plugin-common-node，连接上位机
├── property-inspector // 配置项html和form表单的读写
│   ├── afk      //action的名称
│       ├── inspector.html  //配置项html
│       └── inspector.js  //配置项js，用于做socket连接和form表单的处理
│   └── ...       //同样的目录结构是其他的action
├── manifest.json         //具体配置项的编写可查看插件协议
├── package.json         //项目包管理文件，示例包含了常用的依赖包
├── webpack.config.js    //打包配置
├── zh_CN.json      //中文翻译文件
├── en.json         //英文翻译文件
```


## 一些说明和约定
```bash
1. 插件库的主服务（例app.js）会一直与上位机连接，用于做主要功能，包括上位机icon的更新等。

2. 插件库的配置项（例inspector.html），配置项我们后续称为action。切换功能按键之后就会被销毁，不宜做功能处理。主要用于发送配置项到上位机和同步上位机数据。

3. 为了统一管理，我们的插件包的名称为 com.ulanzi.插件名.ulanziPlugin

4. 为了通用库的正常使用，主服务连接的uuid我们约定长度是4。例：com.ulanzi.ulanzideck.插件名

5. 配置项连接的uuid要大于4用于区分。例：com.ulanzi.ulanzideck.插件名.插件action

6. 在使用node来做主服务时，为了避免端口冲突，请通过 plugin-common-node 提供的 RandomPort 来生成端口。具体可查看 UlanziTechnology/plugin-common-node 

7. 由于本地的node环境和上位机node环境运行的区别，以及程序打包之后获取本地路径会出现一些的bug，因此我们提供Utils.getPluginPath()方法来获取插件根目录的本地路径，大家按需使用。具体可查看 UlanziTechnology/plugin-common-node

```



## package.json 依赖包介绍
```bash

    # common-node 必备依赖包，连接websocket
    "ws": "^8.18.0"

    # common-node 推荐绘制icon工具包
    "@svgdotjs/svg.js": "^3.2.4",
    "svgdom": "^0.1.19",

    #devDependencies目录下的是webpack打包依赖包，可根据自身项目打包自己添加
    "@babel/core": "^7.24.9",
    "@babel/preset-env": "^7.24.8",
    "babel-loader": "^9.1.3",
    "node-polyfill-webpack-plugin": "^4.0.0",
    "terser-webpack-plugin": "^5.3.10",
    "webpack": "^5.93.0",
    "webpack-cli": "^5.1.4"
    

```
## 开发调试

### 安装开发依赖
```bash
npm install # 安装依赖包

```
### 项目打包
```bash
npm run build # 打包构建

```

## 本地调试

```bash

1. 开发过程，安装依赖包之后 直接 node plugin/app.js即可启动主服务
2. 打包完可以使用 node dist/app.js 启动主服务，检查打包之后程序是否可以正常使用

```


## 上位机调试

```bash

1. 调试程序：将manifest.json里面的CodePath路径设为plugin/app.js
2. 打包构建完成后，将manifest.json里面的CodePath路径换成dist/app.js

```