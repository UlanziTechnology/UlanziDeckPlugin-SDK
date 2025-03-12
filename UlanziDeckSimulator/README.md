# UlanziDeck Simulator


<p align="start">
   <strong>English</strong> | <a href="./README.zh.md">简体中文</a>
</p>


## Introduction
The UlanziDeck Simulator is used to simulate communication between the UlanziDeck application and plugins. Developers can test plugin functionality on this simulator. This simulator is mainly used for development and debugging convenience. Please refer to the desktop software running results for specific operational effects.

## Running

```
npm install
npm start
```

## Instructions
 <ol>
  <li>Before starting plugin development, please visit <a href="https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK" target="_blank">Plugin Development SDK</a> and <a href="https://cloud.tencent.com/developer/article/2461403" target="_blank">Starting from Zero: Journey of UlanziDeck Plugin Development</a> to understand some development instructions and introductions</li>
  <li>To test plugins, please fill in manifest.json according to protocol requirements, then place it in the <strong>UlanziDeckSimulator/static/plugins</strong> directory. The simulator will automatically parse the plugin and display it in the simulator's left-side list. Plugin updates require clicking the <strong>Refresh Plugin List</strong> button to reload the plugin.</li>
  <li>In the current version, developers need to start the main service themselves. Please follow the prompts to start the main service before proceeding with operations.</li>
  <li>Debugging sequence: Start <strong>UlanziDeck simulator</strong> -> <strong>Confirm plugin main service is connected</strong> -> <strong>Drag in keyboard, debug action</strong></li>
  <li>The simulator does not support special UlanziDeck events: openview, selectdialog. If you have open dialog and select file/folder functionality, please test in the UlanziDeck application.</li>
  <li>The simulator currently does not have page switching and does not actively send setactive events. Developers should right-click to send events manually to test functionality.</li>
  <li>Actions are not loaded by default. Our goal is for developers to run the action page themselves to achieve development and debugging effects. Enabling action loading may cause websocket conflicts with developer-opened action pages, affecting test results.</li>
</ol>

## Features

1. UlanziDeck simulator, default port 39069
2. After successful startup, open http://127.0.0.1:39069 in browser
3. Follow simulator prompts for testing 