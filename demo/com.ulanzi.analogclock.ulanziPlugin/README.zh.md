# com.ulanzi.analogclock.ulanziPlugin（HTML 版式示例）

[English](./README.md) | **简体中文**

## 简介

为了更直观地演示通用库 HTML 版本的使用，我们使用 analogclock 作为插件示例。

> 当前版本根据 **Ulanzi JS 插件开发协议 - V2.1.2** 编写。

`manifest.json` 配置字段详细说明，请参阅 **[manifest.zh.md](https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK/blob/main/manifest.zh.md)**。

---

## 文件介绍

```text
com.ulanzi.analogclock.ulanziPlugin/
├── assets/
│   └── icons/
│       └── icon.png
├── libs/
├── plugin/
│   ├── actions/
│   ├── app.html
│   └── app.js
├── property-inspector/
│   └── clock/
│       ├── inspector.html
│       └── inspector.js
├── manifest.json
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
| `assets/` | 主要用于存放上位机 icon 的展示资源和 action 状态切换资源。 |
| `libs/` | 插件 HTML 通用库（action 页面引用），此处不做具体介绍，可前往 **[UlanziTechnology/plugin-common-html](https://github.com/UlanziTechnology/plugin-common-html)** 目录查看；libs 更新版本请以该目录为准。 |
| `plugin/` | JS 主要功能模块目录，包括 action 的处理。 |
| `plugin/actions/` | 处理具体 action 逻辑。 |
| `plugin/app.html` | 主服务 HTML，作为入口。 |
| `plugin/app.js` | 主服务 JS。 |
| `property-inspector/` | 配置项 HTML 和 form 表单的读写目录。 |
| `property-inspector/clock/` | action 名称示例目录。 |
| `property-inspector/clock/inspector.html` | 配置项 HTML。 |
| `property-inspector/clock/inspector.js` | 配置项 JS，用于做 socket 连接和 form 表单处理。 |
| `manifest.json` | 插件配置文件，具体配置项可前往 **[manifest.zh.md](https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK/blob/main/manifest.zh.md)** 查看。 |
| `de_DE.json`、`en.json`、`es_ES.json`、`ja_JP.json`、`ko_KR.json`、`pt_PT.json`、`zh_CN.json`、`zh_HK.json` | 多语言翻译文件。 |

## 使用

### 一些说明和约定

1. **主服务**（如 `app.html`）始终与上位机保持连接，负责实现插件的核心功能：接收 action 配置变更、更新 icon 状态等。

2. **配置项页面 / PropertyInspector**（如 `inspector.html`）在用户切换功能按键后会被销毁，不适合做功能逻辑处理，主要用于发送和同步配置参数。

3. 插件包命名规范：`com.ulanzi.{插件名}.ulanziPlugin`

4. **主服务 UUID** 必须由恰好 **4** 个点分隔段组成：
   `com.ulanzi.ulanzistudio.{插件名}`

5. **action UUID** 必须超过 4 段，以便与主服务区分：
   `com.ulanzi.ulanzistudio.{插件名}.{actionName}`

6. 本地化 JSON 文件放在**插件根目录**（与 `libs/` 同级）。支持的文件名：
   `zh_CN.json` `zh_HK.json` `en.json` `ja_JP.json` `de_DE.json` `ko_KR.json` `pt_PT.json` `es_ES.json`

7. `uspi.css` 中已引用上位机内置的开源字体**思源黑体（Source Han Sans SC）**。在 `app.html` 中使用 Canvas 绘制 icon 时，请统一使用 `'Source Han Sans SC'`。

8. 上位机背景颜色为 `#1e1f22`（已在 `uspi.css` 中设为 `--uspi-bodybg`）。若自定义 action 背景色，建议与此保持一致，避免视觉突兀。

9. `controller` URL 参数表示设备类型：`Keypad`（普通按键）或 `Encoder`（旋钮）。连接后可通过 `$UD.controller` 读取。

10. H5 插件开发 SDK：**[UlanziTechnology/plugin-common-html](https://github.com/UlanziTechnology/plugin-common-html)**

11. Node.js 插件开发 SDK：**[UlanziTechnology/plugin-common-node](https://github.com/UlanziTechnology/plugin-common-node)**

---

## 本地化翻译文件编写规则

### 参数介绍

以 `zh_CN.json` 为例：

- `name`：插件名称
- `description`：插件描述
- `actions`：插件 action 列表，数组形式。每个 action 需要填写 `name`（action 名称）和 `tooltip`（悬浮提示）
- `localization`：插件内容本地化

本地化有两种方式：

#### 1. 根据英文内容翻译

使用规则：在 action 的 HTML 页面，将需要翻译的节点加上 `data-localize` 属性。HTML 的 SDK 会自动读取节点的英文内容进行对应翻译。

注意：此时 `data-localize` 不需要赋予值，但是编写页面时请使用英文。之后在根目录下添加语言环境对应的 JSON，例如 `zh_CN.json`。

#### 2. 根据 `data-localize` 的值翻译

使用规则：在 action 的 HTML 页面，将需要翻译的节点加上 `data-localize="Blue"` 属性。

注意：与第一种不同，此时 SDK 会根据 `data-localize` 的值（例：`Blue`）来进行对应翻译。

### `zh_CN.json` 的示例

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
