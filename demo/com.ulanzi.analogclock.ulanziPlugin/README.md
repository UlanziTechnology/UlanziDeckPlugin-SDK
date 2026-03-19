# com.ulanzi.analogclock.ulanziPlugin (HTML Example)

**English** | [简体中文](./README.zh.md)

## Introduction

To more intuitively demonstrate how to use the common HTML library, we use analogclock as the plugin example.

> The current version is written according to the **Ulanzi JS Plugin Development Protocol - V2.1.2**.

For detailed descriptions of the `manifest.json` fields, see **[manifest.md](https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK/blob/main/manifest.md)**.

---

## File Overview

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

| Path | Description |
| --- | --- |
| `assets/` | Mainly stores host icon display assets and action state switching assets. |
| `libs/` | Common HTML library for the plugin (referenced by action pages). It is not described in detail here; please see **[UlanziTechnology/plugin-common-html](https://github.com/UlanziTechnology/plugin-common-html)**. Updates to `libs` should follow that directory. |
| `plugin/` | Main JS functional module directory, including action handling. |
| `plugin/actions/` | Handles specific action logic. |
| `plugin/app.html` | Main service HTML and entry point. |
| `plugin/app.js` | Main service JS. |
| `property-inspector/` | Directory for configuration HTML and form read/write logic. |
| `property-inspector/clock/` | Example action directory. |
| `property-inspector/clock/inspector.html` | Configuration HTML. |
| `property-inspector/clock/inspector.js` | Configuration JS used for socket connection and form handling. |
| `manifest.json` | Plugin configuration file. For field details, see **[manifest.md](https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK/blob/main/manifest.md)**. |
| `de_DE.json`, `en.json`, `es_ES.json`, `ja_JP.json`, `ko_KR.json`, `pt_PT.json`, `zh_CN.json`, `zh_HK.json` | Multi-language translation files. |

## Usage

### Notes and Conventions

1. **Main service** (`app.html`) stays connected to the UlanziStudio at all times. It implements the plugin's core logic, receives param changes from actions, and updates icon states.

2. **Action / PropertyInspector** (`inspector.html`) is destroyed when the user switches buttons. Keep it lightweight — only use it to send/receive configuration params.

3. Plugin package naming: `com.ulanzi.{pluginName}.ulanziPlugin`

4. The **main service UUID** must have exactly **4** dot-separated segments:
   `com.ulanzi.ulanzistudio.{pluginName}`

5. An **action UUID** must have **more than 4** segments to be distinguished from the main service:
   `com.ulanzi.ulanzistudio.{pluginName}.{actionName}`

6. Localization JSON files go in the **plugin root directory** (same level as `libs/`). Supported file names:
   `zh_CN.json` `zh_HK.json` `en.json` `ja_JP.json` `de_DE.json` `ko_KR.json` `pt_PT.json` `es_ES.json`

7. The built-in font **Source Han Sans SC** is referenced in `uspi.css`. Reference the same font in `app.html` when drawing icons on canvas.

8. The UlanziStudio background color is `#1e1f22` (set as `--uspi-bodybg` in `uspi.css`). Match this color when customizing action backgrounds.

9. The `controller` URL parameter indicates device type: `Keypad` (button) or `Encoder` (dial). Read it via `$UD.controller` after connecting.

10. H5 Plugin Development SDK: **[UlanziTechnology/plugin-common-html](https://github.com/UlanziTechnology/plugin-common-html)**

11. Node.js Plugin Development SDK: **[UlanziTechnology/plugin-common-node](https://github.com/UlanziTechnology/plugin-common-node)**

---

## Localization Translation File Rules

### Parameter Introduction

Take `zh_CN.json` as an example:

- `name`: plugin name
- `description`: plugin description
- `actions`: the plugin action list in array form. Each action should define `name` (action name) and `tooltip` (hover tooltip)
- `localization`: plugin content localization

There are two ways to localize content:

#### 1. Translate Based on English Content

Usage: in the action HTML page, add the `data-localize` attribute to the nodes that need translation. The HTML SDK will automatically read the English content of the node and translate it accordingly.

Note: in this case, `data-localize` does not need a value, but the page content should be written in English. Then add the corresponding language JSON file in the root directory, such as `zh_CN.json`.

#### 2. Translate Based on the Value of `data-localize`

Usage: in the action HTML page, add `data-localize="Blue"` to the nodes that need translation.

Note: unlike the first method, the SDK will translate according to the value of `data-localize` (for example, `Blue`).

### Example `zh_CN.json`

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
