# manifest.json 配置说明

<p align="start">
   <a href="./manifest.md">English</a> | <strong>简体中文</strong>
</p>

插件包安装到指定文件夹后，上位机会自动识别加载，解析 `manifest.json`，进行功能显示及资源加载。

---

## 完整示例

```json
{
  "Author": "Ulanzi",
  "Name": "OBS Studio",
  "Description": "OBS Studio Operation",
  "Icon": "resources/store_icon.png",
  "Version": "1.0.1",
  "Category": "OBS Studio",
  "CategoryIcon": "resources/icon.png",
  "CodePath": "source/main.html",
  "Type": "JavaScript",
  "Inspect": "--inspect=127.0.0.1:9201",
  "PrivateAPI": true,
  "UUID": "com.ulanzi.ulanzistudio.obsstudio",
  "Actions": [
    {
      "Name": "Record",
      "Icon": "resources/actions/record/icon.png",
      "PropertyInspectorPath": "source/actions/record/inspector.html",
      "state": 0,
      "States": [
        { "Name": "Start", "Image": "resources/actions/record/on.png" },
        { "Name": "Stop",  "Image": "resources/actions/record/off.png" }
      ],
      "Tooltip": "Start/Stop recording to file",
      "UUID": "com.ulanzi.ulanzistudio.obsstudio.record",
      "SupportedInMultiActions": false,
      "DisableAutomaticStates": true,
      "Controllers": ["Keypad"],
      "Devices": []
    }
  ],
  "OS": [
    { "Platform": "windows", "MinimumVersion": "10" },
    { "Platform": "mac",     "MinimumVersion": "10.11" }
  ],
  "Software": {
    "MinVersion": "2.1.0"
  },
  "ApplicationsToMonitor": {
    "windows": ["obs32.exe", "obs64.exe"],
    "mac": ["com.obsproject.obs-studio"]
  },
  "Profiles": [
    {
      "Name": "My Cool Profile",
      "DeviceType": 0,
      "Readonly": false,
      "DontAutoSwitchWhenInstalled": false,
      "AutoInstall": true
    }
  ],
  "InstallToDepsApp": {
    "Type": "JavaScript",
    "CodePath": "install/test.js"
  }
}
```

---

## 顶层字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `Author` | string | 是 | 开发者名称 |
| `Name` | string | 是 | 插件名称，显示在上位机插件列表中 |
| `Description` | string | 否 | 插件描述 |
| `Icon` | string | 是 | 插件图标路径，显示在上位机插件列表中，支持 SVG、PNG、JPG |
| `Version` | string | 是 | 插件版本号 |
| `Category` | string | 否 | 插件分类名称 |
| `CategoryIcon` | string | 否 | 插件分类图标路径 |
| `CodePath` | string | 是 | 插件主程序入口。`.html` 时使用 QWebEngineView 加载；`.js` 时使用 Node（v20.12.2）加载 |
| `Type` | string | 是 | 固定值 `"JavaScript"` |
| `Inspect` | string | 否 | Node.js 插件远程调试地址，格式 `--inspect=127.0.0.1:9201`，每个插件端口不可重复，需配合 `--nodeRemoteDebug` 启动参数使用 |
| `PrivateAPI` | boolean | 否 | 是否使用私有 API |
| `UUID` | string | 是 | 插件唯一标识，格式：`com.ulanzi.ulanzistudio.{插件名}`（4段） |
| `Actions` | array | 是 | Action 功能列表，见下方说明 |
| `OS` | array | 否 | 支持的操作系统及最低版本 |
| `Software` | object | 否 | 上位机版本要求 |
| `ApplicationsToMonitor` | object | 否 | 需要监控的应用程序 |
| `Profiles` | array | 否 | 插件关联的配置文件 |
| `InstallToDepsApp` | object | 否 | 安装到第三方 App 的脚本配置 |

---

## Actions 字段说明

每个 Action 代表插件中的一个可配置功能，可以被拖拽到设备按键上。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `Name` | string | 是 | 功能名称，显示在上位机插件列表中 |
| `Icon` | string | 是 | 功能图标，显示在上位机插件列表中 |
| `PropertyInspectorPath` | string | 否 | 配置项 HTML 文件路径（相对于插件根目录） |
| `state` | number | 否 | 当前默认图标编号，默认 `0` |
| `States` | array | 是 | 图标列表，每项包含 `Name`（暂时仅供插件自用）和 `Image`（图标路径） |
| `Tooltip` | string | 否 | 功能提示，显示在上位机插件列表中 |
| `UUID` | string | 是 | 功能唯一标识，格式：`{插件UUID}.{功能名}`（>4段）。注意：`com.ulanzi.ulanzistudio.obsstudio.record` 中，`obsstudio` 是插件名，`record` 是功能名 |
| `SupportedInMultiActions` | boolean | 否 | 是否支持多项操作，默认 `true` |
| `DisableAutomaticStates` | boolean | 否 | 是否禁用自动状态更新，默认 `false` |
| `Controllers` | array | 否 | Action 支持的控制器类型：`"Keypad"`（按键）、`"Encoder"`（旋钮）。不填时默认仅 Keypad |
| `Devices` | array | 否 | 支持的设备型号，只在指定设备上显示该 Action。空数组或不填时适配所有设备 |
| `Encoder` | object | 否 | 旋钮配置，仅当 `Controllers` 包含 `"Encoder"` 时有效 |

### Devices 字段说明

```json
"Devices": []              // 适配所有设备（推荐默认）
"Devices": ["D200X"]       // 仅在 D200X 上显示
"Devices": ["~Dial"]       // 排除 Dial，其余设备均显示
"Devices": ["D200", "~Dial"] // D200 显示，同时排除 Dial
```

支持的设备型号：`D200` | `D200H` | `Dial` | `D200X`

### Encoder 旋钮配置

```json
"Encoder": {
  "layout": "$UA1"          // 使用预置布局
  // 或
  "layout": "layout.json"   // 使用自定义布局文件（与 manifest.json 同级目录）
}
```

---

## OS 字段说明

```json
"OS": [
  { "Platform": "windows", "MinimumVersion": "10" },
  { "Platform": "mac",     "MinimumVersion": "10.11" }
]
```

| 字段 | 说明 |
|------|------|
| `Platform` | `"windows"` 或 `"mac"` |
| `MinimumVersion` | 操作系统最低版本号 |

---

## Software 字段说明

```json
"Software": {
  "MinVersion": "2.1.0"
}
```

| 字段 | 说明 |
|------|------|
| `MinVersion` | 上位机最低版本要求。不填该字段时不做版本限制 |
| ~~`MinimumVersion`~~ | 已弃用 |

---

## ApplicationsToMonitor 字段说明

上位机监控指定应用程序的启动与关闭，并触发对应事件通知插件。

```json
"ApplicationsToMonitor": {
  "windows": ["obs32.exe", "obs64.exe"],
  "mac": ["com.obsproject.obs-studio"]
}
```

---

## Profiles 字段说明

```json
"Profiles": [
  {
    "Name": "My Cool Profile",
    "DeviceType": 0,
    "Readonly": false,
    "DontAutoSwitchWhenInstalled": false,
    "AutoInstall": true
  }
]
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `Name` | string | 配置文件名称 |
| `DeviceType` | number | 目标设备类型 |
| `Readonly` | boolean | 是否只读 |
| `DontAutoSwitchWhenInstalled` | boolean | 安装后是否禁止自动切换 |
| `AutoInstall` | boolean | 是否自动安装 |

---

## InstallToDepsApp 字段说明

安装插件时，同时向第三方 App 安装依赖脚本。

```json
"InstallToDepsApp": {
  "Type": "JavaScript",
  "CodePath": "install/test.js"
}
```

---

## D200X 旋钮布局

D200X 设备的旋钮区域具有独立的布局画布，可以自定义显示内容。

### 画布尺寸

布局画布宽高为 **126 × 140**（单个旋钮插槽），左上角为 (0, 0)，右下角为 (126, 140)。

| 参数 | 值 |
|------|------|
| 完整显示区域 | 458 × 196 px |
| 单插槽尺寸 | 126 × 140 px |
| 上位机换算系数（上位机端） | 0.286 |
| 上位机换算系数（下位机端） | 0.75 |

### 设置布局的两种方式

**方式一：在 manifest.json 中声明**

```json
"Encoder": {
  "layout": "$UA1"         // 预置布局
  // 或
  "layout": "layout.json"  // 自定义布局文件（与 manifest.json 同级）
}
```

**方式二：通过通信协议动态设置**

通过 SDK 的 `setFeedbackLayout` 协议在运行时设置布局。

---

### 预置布局

#### `$UA1` — 图标 + 文字

上方图标区域 + 下方文字区域的组合布局。

```json
{
  "id": "$UA1",
  "items": [
    {
      "type": "pixmap",
      "key": "icon",
      "background": "transparent",
      "enabled": true,
      "rect": [13, 0, 100, 100],
      "zOrder": 0,
      "value": "images/hotkey.svg"
    },
    {
      "type": "text",
      "key": "title",
      "background": "transparent",
      "enabled": true,
      "rect": [0, 105, 126, 35],
      "zOrder": 1,
      "alignment": "center",
      "color": "#dfdfdf",
      "font": { "size": 7 },
      "text": ""
    }
  ]
}
```

#### `$UA2` — 文字 + 文字

上下两个文字区域的组合布局。

```json
{
  "id": "$UA2",
  "items": [
    {
      "type": "text",
      "key": "text2",
      "background": "#000000",
      "enabled": true,
      "opacity": 1,
      "rect": [28, 7, 126, 70],
      "zOrder": 0,
      "alignment": "center",
      "color": "white",
      "font": { "size": 8 },
      "text": "test1"
    },
    {
      "type": "text",
      "key": "title",
      "background": "#000000",
      "enabled": true,
      "rect": [0, 95, 126, 39],
      "zOrder": 1,
      "alignment": "center",
      "color": "white",
      "font": { "size": 8 },
      "text": "test"
    }
  ]
}
```

> `key` 为 `"icon"` 时等同于普通按键的图标；`key` 为 `"title"` 时等同于普通按键的标题。非这两个特殊 key 的元素不会自动存取数据，需要主动调用协议更新。

---

### 布局元素

#### 1. 文字元素（`type: "text"`）

用于渲染文本内容，支持字体样式、对齐方式、溢出处理。

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `type` | string | - | 是 | 固定值 `"text"` |
| `key` | string | - | 是 | 同一布局内唯一 |
| `background` | string | - | 否 | 背景色或渐变，支持命名颜色（如 `"white"`）、十六进制（如 `"#204cde"`）、渐变（如 `"0:#ff0000,1:#00ff00"`） |
| `enabled` | boolean | `true` | 否 | `false` 时隐藏 |
| `opacity` | number | `1` | 否 | 透明度，范围 0.1~1，步长 0.1 |
| `rect` | Rect | - | 是 | 元素坐标与尺寸，见 Rect 类型说明 |
| `zOrder` | number | `0` | 否 | 层叠顺序，范围 0~700，值越大越靠上 |
| `alignment` | string | `"center"` | 否 | 水平对齐方式：`"center"` / `"left"` / `"right"`。若 key=`"title"` 则优先使用用户在软件中配置的标题对齐方式 |
| `color` | string | `"white"` | 否 | 文字颜色。若 key=`"title"` 则优先使用用户在软件中配置的标题颜色 |
| `font` | Font | - | 否 | 字体配置，包含 `size`（必填）和 `weight`。若 key=`"title"` 则优先使用用户配置的字体 |
| `text` | string | - | 是 | 显示的文本内容 |
| `textOverflow` | string | - | 否 | 文字溢出处理，`"ellipsis"` 表示截断并显示省略号 |

配置示例：

```json
{
  "type": "text",
  "key": "title",
  "text": "Volume",
  "color": "#ffffff",
  "alignment": "center",
  "font": { "size": 14, "weight": 500 },
  "textOverflow": "ellipsis",
  "background": "#2d3436",
  "enabled": true,
  "opacity": 1,
  "rect": { "x": 0, "y": 10, "width": 200, "height": 20 },
  "zOrder": 10
}
```

#### 2. 图片元素（`type: "pixmap"`）

用于渲染图片资源，支持本地文件路径或 Base64 编码格式。

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `type` | string | - | 是 | 固定值 `"pixmap"` |
| `key` | string | - | 是 | 同一布局内唯一 |
| `background` | string | - | 否 | 背景色或渐变 |
| `enabled` | boolean | `true` | 否 | `false` 时隐藏 |
| `opacity` | number | `1` | 否 | 透明度，范围 0.1~1 |
| `rect` | Rect | - | 是 | 元素坐标与尺寸 |
| `zOrder` | number | `0` | 否 | 层叠顺序，范围 0~700 |
| `value` | string | - | 是 | 图片来源：本地路径（相对插件根目录）或 Base64 编码字符串（需包含完整 MIME 类型，如 `data:image/png;base64,...`） |

配置示例（本地文件）：

```json
{
  "type": "pixmap",
  "key": "mute-icon",
  "value": "icons/mute.png",
  "background": "transparent",
  "enabled": true,
  "opacity": 0.9,
  "rect": { "x": 160, "y": 30, "width": 30, "height": 30 },
  "zOrder": 20
}
```
