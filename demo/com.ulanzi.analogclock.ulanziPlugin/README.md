# com.ulanzi.analogclock.ulanziPlugin (HTML Version Example)

<p align="start">
   <strong>English</strong> | <a href="./README.zh.md">简体中文</a>
</p>

## Introduction
To demonstrate the use of the general library HTML version more intuitively, we use analogclock as a plugin example.

```bash
The current version is written according to the Ulanzi JS Plugin Development Protocol-V1.2.2
```


## File Description
```bash
com.ulanzi.analogclock.ulanziPlugin
├── assets         //Mainly used to store the display of UlanziDeck icons and action state switching
│   └── icons      
│       └── icon.png
├── libs    //Plugin HTML common library (referenced by action pages). This is not described in detail here, please refer to the UlanziTechnology/plugin-common-html directory. For updated versions of libs, please refer to the UlanziTechnology/plugin-common-html directory.
├── plugin  //Main JS functional modules, including action handling
│   ├── actions   //Handle specific action logic
│   ├── app.html  //Main service HTML, serves as the entry point
│   └── app.js    //Main service JS
├── property-inspector // Configuration HTML and form reading/writing
│   └── clock      //Action name
│       ├── inspector.html  //Configuration HTML
│       └── inspector.js  //Configuration JS, used for socket connection and form handling
├── manifest.json         //For specific configuration items, please refer to the plugin protocol
├── zh_CN.json      //Chinese translation file
├── en.json         //English translation file
```


## Usage

### Some Explanations and Conventions
```bash
1. The main service of the plugin library (e.g., app.html) will always be connected to the UlanziDeck for main functionality, including updating the UlanziDeck icon.

2. The configuration item of the plugin library (e.g., inspector.html), which we later refer to as action, will be destroyed after switching function buttons and is not suitable for functional processing. It is mainly used to send configuration items to the UlanziDeck and synchronize UlanziDeck data.

3. For unified management, our plugin package name is com.ulanzi.pluginName.ulanziPlugin

4. For the normal use of the common library, we stipulate that the UUID of the main service connection is 4 in length. Example: com.ulanzi.ulanzideck.pluginName

5. The UUID of the configuration item connection should be greater than 4 to distinguish it. Example: com.ulanzi.ulanzideck.pluginName.pluginAction

6. Localization files are placed in the plugin root directory, at the same level as the libs plugin common library. Example: zh_CN.json en.json

7. For UI font consistency, we have already set the open-source font Source Han Sans SC in udpi.css, and app.html also needs to reference the font library. Please use 'Source Han Sans SC' uniformly when drawing icons.

8. The background color of the UlanziDeck is '#282828', and the common CSS (udpi.css) has already set '--udpi-bgcolor: #282828;'. If you want to customize the background color of an action, it should be the same as the UlanziDeck's background color to avoid the plugin's background color being too jarring.

```

## Localization Translation File Writing Rules

### Parameter Introduction
```bash
Taking zh_CN.json as an example

name: Plugin name
description: Plugin description
actions: Plugin action list, in array form. Each action needs to fill in name (action name) and tooltip (hover tip)

localization: Plugin content localization
There are two ways of localization:

1. Translation based on English content
Usage rule: In the action's HTML page, add the data-localize attribute to nodes that need translation. The HTML SDK will automatically read the node's English content for corresponding translation.
Note: In this case, data-localize does not need to be assigned a value, but please use English when writing the page. Then add the corresponding language environment JSON in the root directory, such as zh_CN.json

2. Translation based on the value of data-localize
Usage rule: In the action's HTML page, add the attribute data-localize="Blue" to nodes that need translation.
Note: Unlike the first method, the SDK will translate according to the value of data-localize (e.g., Blue).

```

### Example of zh_CN.json
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