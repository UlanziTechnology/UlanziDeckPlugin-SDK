# com.ulanzi.ulanzideck.teamspeak5 (Node.js Example)

<p align="start">
   <strong>English</strong> | <a href="./README.zh.md">简体中文</a>
</p>

## Introduction
To better demonstrate the usage of the common library Node.js version, we use TeamSpeak 5 as a plugin example.

```bash
Current version is written according to Ulanzi JS Plugin Development Protocol-V1.2.2
```

## File Structure
```bash
com.ulanzi.teamspeak5.ulanziPlugin
├── assets         //Mainly used to store UlanziDeck icons display and action state switching
│   ├── icons      
│       └── icon.png
│   └── actions       //Mainly used to store icons for action state switching
├── dist    //Node packaged runtime files, large plugin size due to node_modules
├── libs    //Plugin HTML common library (for action page reference). For details, check UlanziTechnology/plugin-common-html directory. For libs version updates, refer to UlanziTechnology/plugin-common-html.
├── plugin  //JS development runtime directory. Main function modules, including action handling
│   ├── actions   //Handle specific action logic
│       ├── plugin-common-node  // Plugin node common library (for node service reference). For details, check UlanziTechnology/plugin-common-node directory. For updates, refer to UlanziTechnology/plugin-common-node
│       └── ...   // Remaining plugin function js files
│   └── app.js    //Main service js, can reference plugin-common-node here to connect with UlanziDeck
├── property-inspector // Configuration HTML and form read/write
│   ├── afk      //Action name
│       ├── inspector.html  //Configuration HTML
│       └── inspector.js  //Configuration js, for socket connection and form handling
│   └── ...       //Same directory structure for other actions
├── manifest.json         //For specific configuration writing, check plugin protocol
├── package.json         //Project package management file, example includes commonly used dependencies
├── webpack.config.js    //Package configuration
├── zh_CN.json      //Chinese translation file
├── en.json         //English translation file
```

## Notes and Conventions
```bash
1. The plugin library's main service (e.g., app.js) maintains constant connection with the UlanziDeck for main functionalities, including UlanziDeck icon updates.

2. The plugin library's configuration items (e.g., inspector.html), referred to as actions, are destroyed after switching function buttons and shouldn't handle functionalities. Mainly used for sending configurations to UlanziDeck and syncing UlanziDeck data.

3. For unified management, our plugin package names follow the format: com.ulanzi.pluginName.ulanziPlugin

4. For proper use of the common library, we specify main service connection UUID length as 4. Example: com.ulanzi.ulanzideck.pluginName

5. Configuration item connection UUID should be longer than 4 for distinction. Example: com.ulanzi.ulanzideck.pluginName.pluginAction

6. When using Node as main service, to avoid port conflicts, please use RandomPort provided by plugin-common-node. For details, check UlanziTechnology/plugin-common-node

7. Due to differences between local and UlanziDeck Node environments, and path-related issues after packaging, we provide Utils.getPluginPath() method to get plugin root directory local path. Use as needed. For details, check UlanziTechnology/plugin-common-node
```

## package.json Dependencies Introduction
```bash
    # common-node required dependency for websocket connection
    "ws": "^8.18.0"

    # common-node recommended icon drawing toolkit
    "@svgdotjs/svg.js": "^3.2.4",
    "svgdom": "^0.1.19",

    #devDependencies contains webpack packaging dependencies, add according to your project needs
    "@babel/core": "^7.24.9",
    "@babel/preset-env": "^7.24.8",
    "babel-loader": "^9.1.3",
    "node-polyfill-webpack-plugin": "^4.0.0",
    "terser-webpack-plugin": "^5.3.10",
    "webpack": "^5.93.0",
    "webpack-cli": "^5.1.4"
```

## Development and Debugging

### Install Development Dependencies
```bash
npm install # Install dependencies
```

### Project Build
```bash
npm run build # Package and build
```

## Local Debugging
```bash
1. During development, after installing dependencies, directly run node plugin/app.js to start main service
2. After packaging, use node dist/app.js to start main service and check if the packaged program works properly
```

## UlanziDeck Debugging
```bash
1. Debug program: Set CodePath in manifest.json to plugin/app.js
2. After packaging and building, change CodePath in manifest.json to dist/app.js
``` 