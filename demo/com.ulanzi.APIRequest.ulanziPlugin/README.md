# com.ulanzi.APIRequest.ulanziPlugin (Node.js Example)

**English** | [简体中文](./README.zh.md)

## Introduction

To more intuitively demonstrate how to use the common Node.js library, this plugin uses API Request as the example.

> The current version is written according to the **Ulanzi JS Plugin Development Protocol - V2.1.2**.

For a detailed description of the `manifest.json` fields, see **[manifest.md](https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK/blob/main/manifest.md)**.

---

## File Overview

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

| Path | Description |
| --- | --- |
| `assets/` | Mainly stores host icon assets and action state switching assets. |
| `assets/actions/` | Mainly stores icons used for action state switching. |
| `dist/` | Runtime files generated after the Node.js build; the package can be large because it includes `node_modules`. |
| `libs/` | Common HTML library for plugin pages (referenced by action pages). It is not covered in detail here; see **[UlanziTechnology/plugin-common-html](https://github.com/UlanziTechnology/plugin-common-html)** for details and updates. |
| `plugin/` | JS runtime directory for development, including core modules and action handling. |
| `plugin/actions/` | Handles specific action logic. |
| `plugin/actions/ulanzi-api/` | Common Node.js library for the plugin (referenced by the node service). It is not covered in detail here; see **[UlanziTechnology/plugin-common-node](https://github.com/UlanziTechnology/plugin-common-node)** for details and updates. |
| `plugin/app.js` | Main service JS; `plugin-common-node` can be referenced here to connect to the host. |
| `property-inspector/` | Directory used to read and write configuration HTML and form data. |
| `property-inspector/getResult/` | Example action directory. |
| `property-inspector/getResult/inspector.html` | Configuration HTML. |
| `property-inspector/getResult/inspector.js` | Configuration JS for socket connection and form handling. |
| `manifest.json` | Plugin configuration file. For field details, see **[manifest.md](https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK/blob/main/manifest.md)**. |
| `package.json` | Project package management file; the example includes commonly used dependencies. |
| `webpack.config.js` | Build configuration file. |
| `de_DE.json`, `en.json`, `es_ES.json`, `ja_JP.json`, `ko_KR.json`, `pt_PT.json`, `zh_CN.json`, `zh_HK.json` | Multi-language translation files. |

## Notes and Conventions

1. **Main service** (`app.js`) stays connected to the UlanziStudio at all times. It implements the plugin's core logic, receives param changes from actions, and updates icon states.

2. **Action / PropertyInspector** (`inspector.html`) is destroyed when the user switches buttons. Keep it lightweight — only use it to send/receive configuration params.

3. Plugin package naming: `com.ulanzi.{pluginName}.ulanziPlugin`

4. The **main service UUID** must have exactly **4** dot-separated segments:
   `com.ulanzi.ulanzistudio.{pluginName}`

5. An **action UUID** must have **more than 4** segments to be distinguished from the main service:
   `com.ulanzi.ulanzistudio.{pluginName}.{actionName}`

6. When using Node.js as the main service, use `RandomPort` to avoid port conflicts between plugins. See **[UlanziTechnology/plugin-common-node 2. Generate Random Port](https://github.com/UlanziTechnology/plugin-common-node?tab=readme-ov-file#2-generate-random-port)**.

7. Use `Utils.getPluginPath()` to get the plugin root directory path — it handles differences between local Node and the host's packaged Node environment. See **[UlanziTechnology/plugin-common-node 3. Get Plugin Root Path](https://github.com/UlanziTechnology/plugin-common-node?tab=readme-ov-file#3-get-plugin-root-path)**.

8. H5 plugin development SDK: **[UlanziTechnology/plugin-common-html](https://github.com/UlanziTechnology/plugin-common-html)**

9. Node.js plugin development SDK: **[UlanziTechnology/plugin-common-node](https://github.com/UlanziTechnology/plugin-common-node)**

---

## package.json Dependencies

- `ws@^8.18.0`: Required by `common-node` for the WebSocket connection.
- `@svgdotjs/svg.js@3.2.4`, `svgdom@0.1.19`: Recommended icon drawing toolkits for `common-node`.
- `@babel/core@^7.24.9`
- `@babel/preset-env@^7.24.8`
- `babel-loader@^9.1.3`
- `node-polyfill-webpack-plugin@^4.0.0`
- `terser-webpack-plugin@^5.3.10`
- `webpack@^5.93.0`
- `webpack-cli@^5.1.4`

These `devDependencies` are mainly used for webpack builds and can be adjusted according to your project needs.

## Development and Debugging

### Install Development Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

## Local Debugging

1. During development, after installing dependencies, you can start the main service directly with `node plugin/app.js`.
2. After packaging, you can run `node dist/app.js` to start the main service and verify that the packaged program works properly.

## Host Debugging

1. When debugging, set `CodePath` in `manifest.json` to `plugin/app.js`.
2. After packaging and building, change `CodePath` in `manifest.json` back to `dist/app.js`.
