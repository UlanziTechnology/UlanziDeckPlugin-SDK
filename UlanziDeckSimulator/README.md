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
  <li>Before starting plugin development, please visit <a href="https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK" target="_blank">Plugin Development SDK</a> and <a href="https://cloud.tencent.com/developer/article/2461403" target="_blank">Starting from Zero: Journey of UlanziDeck Plugin Development</a> to learn the relevant development notes and introduction.</li>
  <li>To test plugins, please fill in manifest.json according to protocol requirements, then place it in the <strong>UlanziDeckSimulator/plugins</strong> directory. The simulator will automatically parse the plugin and display it in the simulator's left-side list. Plugin updates require clicking the <strong>Refresh Plugin List</strong> button to reload the plugin.</li>
  <li>In the current version, developers need to start the main service themselves. Please follow the prompts to start the main service before proceeding with operations.</li>
  <li>Debugging sequence: start the <strong>UlanziDeck Simulator</strong> -> <strong>confirm the plugin main service is connected</strong> -> <strong>drag in a keyboard and debug the action</strong></li>
  <li>Because of browser restrictions, the <strong>openview</strong> and <strong>openurl</strong> events cannot open local files. You can copy the returned path and open it manually.</li>
  <li>Because of browser restrictions, the <strong>selectdialog</strong> event cannot open a folder picker. You can enter the full file path directly in the dialog and still receive the complete event flow.</li>
  <li>The simulator currently does not have page switching and does not actively send setactive events. Developers should right-click to send events manually to test functionality.</li>
  <li>Actions are not loaded by default. Our goal is for developers to run the action page themselves to achieve development and debugging effects. Enabling action loading may cause websocket conflicts with developer-opened action pages, affecting test results.</li>
  <li>The simulator currently supports these events: <strong>"run"</strong> | <strong>"add"</strong> | <strong>"clear"</strong> | <strong>"paramfromapp"</strong> | <strong>"paramfromplugin"</strong> | <strong>"setactive"</strong> | <strong>"state"</strong> | <strong>"openurl"</strong> | <strong>"openview"</strong> | <strong>"selectdialog"</strong> | <strong>"sendToPropertyInspector"</strong> | <strong>"sendToPlugin"</strong> | <strong>"getSettings"</strong> | <strong>"setSettings"</strong> | <strong>"didReceiveSettings"</strong> | <strong>"setGlobalSettings"</strong> | <strong>"didReceiveGlobalSettings"</strong> | <strong>"getGlobalSettings"</strong> | <strong>"keydown"</strong> | <strong>"keyup"</strong> | <strong>"dialdown"</strong> | <strong>"dialup"</strong> | <strong>"dialrotate"</strong></li>
  <li>The simulator output is for reference only. Please use the desktop software behavior as the final source of truth.</li>
</ol>

## Features

1. UlanziDeck simulator, default port 39069
2. After successful startup, open http://127.0.0.1:39069 in browser
3. Follow simulator prompts for testing 
