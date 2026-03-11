# manifest.json Reference

<p align="start">
   <strong>English</strong> | <a href="./manifest.zh.md">简体中文</a>
</p>

After a plugin package is installed to the designated folder, the host application automatically detects it, parses `manifest.json`, and loads the plugin's UI and resources.

---

## Full Example

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

## Top-Level Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Author` | string | Yes | Developer name |
| `Name` | string | Yes | Plugin name shown in the host application plugin list |
| `Description` | string | No | Plugin description |
| `Icon` | string | Yes | Plugin icon path shown in the plugin list. Supports SVG, PNG, JPG |
| `Version` | string | Yes | Plugin version number |
| `Category` | string | No | Plugin category name |
| `CategoryIcon` | string | No | Plugin category icon path |
| `CodePath` | string | Yes | Plugin main entry point. `.html` is loaded via QWebEngineView; `.js` is loaded via Node.js (v20.12.2) |
| `Type` | string | Yes | Fixed value `"JavaScript"` |
| `Inspect` | string | No | Node.js remote debug address, e.g. `--inspect=127.0.0.1:9201`. Each plugin must use a unique port. Requires `--nodeRemoteDebug` launch flag |
| `PrivateAPI` | boolean | No | Whether the plugin uses private APIs |
| `UUID` | string | Yes | Plugin unique identifier. Format: `com.ulanzi.ulanzistudio.{pluginName}` (4 segments) |
| `Actions` | array | Yes | List of action definitions. See Actions section below |
| `OS` | array | No | Supported operating systems and minimum versions |
| `Software` | object | No | Host application version requirement |
| `ApplicationsToMonitor` | object | No | Applications to monitor for launch/quit events |
| `Profiles` | array | No | Plugin profile configurations |
| `InstallToDepsApp` | object | No | Script to install into a third-party app alongside the plugin |

---

## Actions Fields

Each action represents a configurable function that can be assigned to a device key.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Name` | string | Yes | Action name shown in the host application plugin list |
| `Icon` | string | Yes | Action icon shown in the plugin list |
| `PropertyInspectorPath` | string | No | Path to the PropertyInspector HTML file (relative to plugin root) |
| `state` | number | No | Default active state index, default `0` |
| `States` | array | Yes | Icon state list. Each item has `Name` (plugin use only) and `Image` (icon path) |
| `Tooltip` | string | No | Action tooltip shown in the plugin list |
| `UUID` | string | Yes | Action unique identifier. Format: `{pluginUUID}.{actionName}` (more than 4 segments). E.g. in `com.ulanzi.ulanzistudio.obsstudio.record`, `obsstudio` is the plugin name and `record` is the action name |
| `SupportedInMultiActions` | boolean | No | Whether the action supports multi-actions, default `true` |
| `DisableAutomaticStates` | boolean | No | Whether to disable automatic state updates, default `false` |
| `Controllers` | array | No | Supported controller types: `"Keypad"` (button) and/or `"Encoder"` (dial). Defaults to Keypad only if omitted |
| `Devices` | array | No | Supported device models. The action is only shown on listed devices. Empty array or omitted means all devices |
| `Encoder` | object | No | Dial configuration. Only used when `Controllers` includes `"Encoder"` |

### Devices Field

```json
"Devices": []              // All devices (recommended default)
"Devices": ["D200X"]       // D200X only
"Devices": ["~Dial"]       // All devices except Dial
"Devices": ["D200", "~Dial"] // D200 included, Dial excluded
```

Supported device models: `D200` | `D200H` | `Dial` | `D200X`

### Encoder Configuration

```json
"Encoder": {
  "layout": "$UA1"          // Use a built-in layout
  // or
  "layout": "layout.json"   // Use a custom layout file (same directory as manifest.json)
}
```

---

## OS Field

```json
"OS": [
  { "Platform": "windows", "MinimumVersion": "10" },
  { "Platform": "mac",     "MinimumVersion": "10.11" }
]
```

| Field | Description |
|-------|-------------|
| `Platform` | `"windows"` or `"mac"` |
| `MinimumVersion` | Minimum OS version required |

---

## Software Field

```json
"Software": {
  "MinVersion": "2.1.0"
}
```

| Field | Description |
|-------|-------------|
| `MinVersion` | Minimum host application version required. No restriction if omitted |
| ~~`MinimumVersion`~~ | Deprecated |

---

## ApplicationsToMonitor Field

The host application monitors the specified apps and notifies the plugin when they launch or quit.

```json
"ApplicationsToMonitor": {
  "windows": ["obs32.exe", "obs64.exe"],
  "mac": ["com.obsproject.obs-studio"]
}
```

---

## Profiles Field

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

| Field | Type | Description |
|-------|------|-------------|
| `Name` | string | Profile name |
| `DeviceType` | number | Target device type |
| `Readonly` | boolean | Whether the profile is read-only |
| `DontAutoSwitchWhenInstalled` | boolean | Prevent auto-switching to this profile after install |
| `AutoInstall` | boolean | Automatically install the profile |

---

## InstallToDepsApp Field

Installs a dependency script into a third-party app when the plugin is installed.

```json
"InstallToDepsApp": {
  "Type": "JavaScript",
  "CodePath": "install/test.js"
}
```

---

## D200X Dial Layout

The D200X device's dial area has an independent layout canvas for customizing display content.

### Canvas Dimensions

The layout canvas for a single dial slot is **126 × 140**, with the origin (0, 0) at the top-left and (126, 140) at the bottom-right.

| Parameter | Value |
|-----------|-------|
| Full display area | 458 × 196 px |
| Single slot size | 126 × 140 px |
| Host-side scale factor | 0.286 |
| Device-side scale factor | 0.75 |

### Two Ways to Set Layout

**Option 1: Declare in manifest.json**

```json
"Encoder": {
  "layout": "$UA1"         // Built-in layout
  // or
  "layout": "layout.json"  // Custom layout file (same directory as manifest.json)
}
```

**Option 2: Set dynamically via protocol**

Use the `setFeedbackLayout` SDK call to update the layout at runtime.

---

### Built-in Layouts

#### `$UA1` — Icon + Text

Icon area on top with a text label below.

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

#### `$UA2` — Text + Text

Two text areas stacked vertically.

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

> When `key` is `"icon"`, the element behaves like the button's standard icon. When `key` is `"title"`, it behaves like the button's standard title. Elements with any other key are not auto-persisted and must be updated manually via protocol calls.

---

### Layout Elements

#### 1. Text Element (`type: "text"`)

Renders text content with support for font styling, alignment, and overflow handling.

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `type` | string | - | Yes | Fixed value `"text"` |
| `key` | string | - | Yes | Unique within the layout |
| `background` | string | - | No | Background color or gradient. Supports named colors (`"white"`), hex (`"#204cde"`), gradient (`"0:#ff0000,1:#00ff00"`) |
| `enabled` | boolean | `true` | No | Hidden when `false` |
| `opacity` | number | `1` | No | Opacity, range 0.1~1, step 0.1 |
| `rect` | Rect | - | Yes | Element position and size. See Rect type below |
| `zOrder` | number | `0` | No | Stacking order, range 0~700. Higher value renders on top |
| `alignment` | string | `"center"` | No | Horizontal alignment: `"center"` / `"left"` / `"right"`. When key=`"title"`, the user's title alignment setting in the host app takes priority |
| `color` | string | `"white"` | No | Text color. When key=`"title"`, the user's title color setting takes priority |
| `font` | Font | - | No | Font config with `size` (required) and `weight`. When key=`"title"`, the user's font setting takes priority |
| `text` | string | - | Yes | Text content to display |
| `textOverflow` | string | - | No | Overflow behavior. `"ellipsis"` truncates with `…` |

Example:

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

#### 2. Image Element (`type: "pixmap"`)

Renders image resources from a local file path or Base64 encoded string.

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `type` | string | - | Yes | Fixed value `"pixmap"` |
| `key` | string | - | Yes | Unique within the layout |
| `background` | string | - | No | Background color or gradient |
| `enabled` | boolean | `true` | No | Hidden when `false` |
| `opacity` | number | `1` | No | Opacity, range 0.1~1 |
| `rect` | Rect | - | Yes | Element position and size |
| `zOrder` | number | `0` | No | Stacking order, range 0~700 |
| `value` | string | - | Yes | Image source: local path (relative to plugin root) or Base64 string with full MIME type (e.g. `data:image/png;base64,...`) |

Example (local file):

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
