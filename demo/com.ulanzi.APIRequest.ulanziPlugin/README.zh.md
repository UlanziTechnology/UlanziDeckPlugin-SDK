# com.ulanzi.APIRequest.ulanziPlugin（Node.js 示例）

[English](./README.md) | **简体中文**

## 简介

为了更直观地演示通用库 Node.js 版本的使用，我们使用 API Request 作为插件示例。

> 当前版本根据 **Ulanzi JS 插件开发协议 - V2.1.2** 编写。

`manifest.json` 配置字段详细说明，请参阅 **[manifest.zh.md](https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK/blob/main/manifest.zh.md)**。

---

## 文件介绍

```text
com.ulanzi.APIRequest.ulanziPlugin/
├── assets/
│   ├── icons/
│   └── actions/
├── dist/
├── libs/
├── plugin/
│   ├── actions/
│   │   ├── ulanzi-api/
│   │   └── ...
│   └── app.js
├── property-inspector/
│   ├── getResult/
│   │   ├── inspector.html
│   │   └── inspector.js
│   └── ...
├── manifest.json
├── package.json
├── webpack.config.js
├── de_DE.json
├── en.json
├── es_ES.json
├── ja_JP.json
├── ko_KR.json
├── pt_PT.json
├── zh_CN.json
└── zh_HK.json
```

| 路径 | 说明 |
| --- | --- |
| `assets/` | 主要用于存放上位机 icon 展示资源和 action 状态切换资源。 |
| `assets/actions/` | 主要用于存放 action 状态切换的 icon。 |
| `dist/` | Node.js 打包后的运行文件；由于包含 `node_modules`，插件包体积会较大。 |
| `libs/` | 插件 HTML 通用库（action 页面引用）。此处不做具体介绍，可前往 **[UlanziTechnology/plugin-common-html](https://github.com/UlanziTechnology/plugin-common-html)** 目录查看，更新版本请以该目录为准。 |
| `plugin/` | JS 开发运行目录，包含主要功能模块和 action 处理逻辑。 |
| `plugin/actions/` | 处理具体 action 逻辑。 |
| `plugin/actions/ulanzi-api/` | 插件 Node.js 通用库（node 服务引用）。此处不做具体介绍，可前往 **[UlanziTechnology/plugin-common-node](https://github.com/UlanziTechnology/plugin-common-node)** 目录查看，更新版本请以该目录为准。 |
| `plugin/app.js` | 主服务 JS，可在此引用 `plugin-common-node` 连接上位机。 |
| `property-inspector/` | 配置项 HTML 和 form 表单的读写目录。 |
| `property-inspector/getResult/` | action 名称示例目录。 |
| `property-inspector/getResult/inspector.html` | 配置项 HTML。 |
| `property-inspector/getResult/inspector.js` | 配置项 JS，用于 socket 连接和 form 表单处理。 |
| `manifest.json` | 插件配置文件，具体字段可前往 **[manifest.zh.md](https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK/blob/main/manifest.zh.md)** 查看。 |
| `package.json` | 项目包管理文件，示例中包含常用依赖包。 |
| `webpack.config.js` | 打包配置文件。 |
| `de_DE.json`、`en.json`、`es_ES.json`、`ja_JP.json`、`ko_KR.json`、`pt_PT.json`、`zh_CN.json`、`zh_HK.json` | 多语言翻译文件。 |

## 一些说明和约定

1. **主服务**（`app.js`）始终与 UlanziStudio 保持连接，负责插件核心逻辑、接收 action 的参数变更并更新图标状态。

2. **Action / 配置项**（`inspector.html`）在用户切换按键后会被销毁，应保持轻量——仅用于发送和接收配置参数。

3. 插件包命名规则：`com.ulanzi.{插件名}.ulanziPlugin`

4. **主服务 UUID** 必须恰好包含 **4** 个以点分隔的段：
   `com.ulanzi.ulanzistudio.{插件名}`

5. **Action UUID** 必须包含 **超过 4** 个段，以与主服务区分：
   `com.ulanzi.ulanzistudio.{插件名}.{actionName}`

6. 使用 Node.js 作为主服务时，请通过 `RandomPort` 生成端口，避免插件间端口冲突。详见 **[UlanziTechnology/plugin-common-node 2.生成随机端口](https://github.com/UlanziTechnology/plugin-common-node?tab=readme-ov-file#2-generate-random-port)**。

7. 使用 `Utils.getPluginPath()` 获取插件根目录路径，可兼容本地 Node 环境与上位机打包的 Node 环境之间的差异。详见 **[UlanziTechnology/plugin-common-node 3.获取插件根目录路径](https://github.com/UlanziTechnology/plugin-common-node?tab=readme-ov-file#3-get-plugin-root-path)**。

8. H5 插件开发 SDK：**[UlanziTechnology/plugin-common-html](https://github.com/UlanziTechnology/plugin-common-html)**

9. Node.js 插件开发 SDK：**[UlanziTechnology/plugin-common-node](https://github.com/UlanziTechnology/plugin-common-node)**

---

## package.json 依赖包介绍

- `ws@^8.18.0`：`common-node` 必备依赖包，用于连接 WebSocket。
- `@svgdotjs/svg.js@3.2.4`、`svgdom@0.1.19`：`common-node` 推荐的 icon 绘制工具包。
- `@babel/core@^7.24.9`
- `@babel/preset-env@^7.24.8`
- `babel-loader@^9.1.3`
- `node-polyfill-webpack-plugin@^4.0.0`
- `terser-webpack-plugin@^5.3.10`
- `webpack@^5.93.0`
- `webpack-cli@^5.1.4`

以上 `devDependencies` 主要是 webpack 打包依赖，可根据自身项目需求自行增减。

## 开发调试

### 安装开发依赖

```bash
npm install
```

### 项目打包

```bash
npm run build
```

## 本地调试

1. 开发过程中，安装依赖包后可直接运行 `node plugin/app.js` 启动主服务。
2. 打包完成后，可运行 `node dist/app.js` 启动主服务，检查打包后的程序是否能够正常使用。

## 上位机调试

1. 调试程序时，将 `manifest.json` 里的 `CodePath` 设置为 `plugin/app.js`。
2. 打包构建完成后，再将 `manifest.json` 里的 `CodePath` 改为 `dist/app.js`。
