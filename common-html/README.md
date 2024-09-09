# ulanzideck-plugin-common html版本

## 简介
为了让开发者提升创作者的工作效率，降低插件开发门槛，我们开发了这套Ulanzideck的插件通用库html版本。使用该插件库，无需再次开发socket连接，开发者只需关注插件本身所需要实现的功能，根据上位机的事件触发即可。


```bash
当前版本根据 Ulanzi JS 插件开发协议-V1.2.1 来编写
```


## 文件介绍
```bash
libs   //该文件夹就是插件通用库的功能
├── css
│   └── udpi.css      //通用样式，按照约定格式编写html, 即可生效
├── js
│   ├── constants.js      //上位机的事件常量，无需二次编写
│   ├── eventEmitter.js   //引发事件工具类，无需二次编写
│   ├── timers.js         //timer工具类，无需二次编写，用于提高性能
│   ├── utils.js          //一些常用方法的封装，欢迎大家补充，目前主要功能：获取配置项html的form表单和重载配置项html的form的表单
│   └── ulanzideckApi.js    //包括 ulanzi所有事件的封装，socket的连接，以及本地化的处理
├── assets
│   └── xxx.png          //css需要的icon，无需更改

```


## 使用

### 一些说明和约定
```bash
1. 插件库的主服务（例app.html）会一直与上位机连接，用于做主要功能，包括上位机icon的更新等。

2. 插件库的配置项（例inspector.html），配置项我们后续称为action。切换功能按键之后就会被销毁，不宜做功能处理。主要用于发送配置项到上位机和同步上位机数据。

3. 为了统一管理，我们的插件包的名称为 com.ulanzi.插件名.ulanziPlugin

4. 为了通用库的正常使用，主服务连接的uuid我们约定长度是4。例：com.ulanzi.ulanzideck.插件名

5. 配置项连接的uuid要大于4用于区分。例：com.ulanzi.ulanzideck.插件名.插件action

6. 本地化文件夹（langs）需放在与libs同级目录下，例：langs/zh.json

7. 为了UI字体的统一，我们已经在udpi.css设置了开源字体思源黑体（Source Han Sans），在app.html也同样需要引用字体库。请大家在绘制icon时，统一使用'Source Han Sans'。

8. 上位机的背景颜色为 '#282828'，通用css（udpi.css）已经设定了'--udpi-bgcolor: #282828;'。若要自定义action的背景颜色应与上位机背景色相同，避免插件背景颜色过于突兀。

```
### 使用步骤

```bash
通用库的具体使用和文件夹规范，可以查看 demo/com.ulanzi.analogclock.ulanziPlugin 的实现。
以下简单介绍通用库的使用：
```

#### * 特殊参数 context
由于一个action功能会配置到多个按键key上，因此common库为大家拼接了一个唯一值context。在我们创建功能实例的时候，只需保存唯一值context。若需要更新数据时，再根据对应的唯一值context，即可将消息发送到对应的key值上。
```bash
1. 特殊参数context, 是common库拼接出的唯一值，它连同接收到的message一起传递给主服务和action。

2. context的拼接规则是 uuid + '___' + key + '___' + actionid，由对应的$UD.encodeContext(msg)生成。

3. 同时我们提供 $UD.decodeContext(context) 来解构唯一值，返回 { uuid, key, actionid }。

4. 由于clear事件的param是数组形式，因此clear的context拼接在param里。请大家做clear处理时，注意循环获取。

```

#### 1. 引入通用库
```html
/**
 * ulanzideckApi 依赖 eventEmitter 和 utils ，需按以下顺序在html页面中引用
*/

<script src="../../libs/js/constants.js"></script>
<script src="../../libs/js/eventEmitter.js"></script>
<script src="../../libs/js/timers.js"></script>
<script src="../../libs/js/utils.js"></script>
<script src="../../libs/js/ulanzideckApi.js"></script>

```

#### 2. HTML适用通用css结构
```html
/**
 * 以配置项页面为例
*/


<!-- 配置项需用form包裹, 配置项用name来表示 -->
<!-- 即可使用Utils.getFormValue获取表单数据和Utils.setFormValue重载表单数据 -->
<form id="property-inspector">   


  <!-- 配置项的label和value用div.udpi-item包裹，label用udpi-item-label表示，value用udpi-item-value表示 -->
  <div class="udpi-item">
    <!-- data-localize 表示需要本地化，编写页面默认使用英文，在langs文件夹下配置对应的json-->
    <div class="udpi-item-label" data-localize>Name</div>
    <input type="text" class="udpi-item-value" name="name" value="test">
  </div>
  <div class="udpi-item">
    <div class="udpi-item-label" data-localize>Face</div>
    <select class="udpi-item-value select clockSelector" name="clock_index" >
      <option label="Blue" value="blue" data-localize></option>
      <option label="Green" value="green" data-localize></option>
    </select>
  </div>
</form>

```

#### 3. 连接上位机
以配置项页面为例, 简单展示一些方法使用，具体可查看[<a href="#title-4">4.接收事件 上位机->插件</a>][<a href="#title-5">5.发送事件 插件->上位机</a>]
```html

/**
 * $UD 是 ulanzideckApi 的实例，通过 $UD.connect(uuid) 来连接websocket
 * 
*/

<script>
  //连接socket，连接成功后，会触发事件onConnected
  $UD.connect('com.ulanzi.ulanzideck.analogclock.clock');
  $UD.onConnected(conn => {
    //表示已连接，可在此处渲染动态节点

  })


  //配置到按键
  $UD.onAdd( message => {
    //实现功能，可以在此处实现配置项的重载
  })

  //获取初始化参数
  $UD.onParamFromApp( message => {
      //实现功能，可以在此处实现配置项的重载
  })

  //配置参数
  function sendData(params){
    $UD.sendParamFromPlugin(params)
  }

</script>

```

#### <a id="title-4">4. 接收事件 上位机->插件</a>
```js
/**
 * 监听socket连接成功的事件，以及上位机发出的事件
*/
1. $UD.onConnected(conn => ())  //websocket连接成功
2. $UD.onClose(conn => ())  // websocket 断开连接
3. $UD.onError(conn => ())  //websocket 错误
4. $UD.onAdd(message => ())     //接收上位机发出 "cmd": "add" 的事件
5. $UD.onParamFromApp(message => ())  //接收上位机发出 "cmd": "paramfromapp" 的事件
6. $UD.onParamFromPlugin(message => ())  //接收上位机发出 "cmd": "paramfromplugin" 的事件
7. $UD.onRun(message => ())  //接收上位机发出 "cmd": "run" 的事件
8. $UD.onSetActive(message => ())  //接收上位机发出 "cmd": "setactive" 的事件
9. $UD.onClear(message => ())  //接收上位机发出 "cmd": "clear" 的事件
10. $UD.onSelectdialog(message => ())  //接收上位机返回的 "cmd": "selectdialog" 的事件，用于接收选择文件/文件夹的结果

```

#### <a id="title-5">5. 发送事件 插件->上位机</a>

```js
/**
 * 向上位机发送配置参数
 * @param {object} settings 必传 | 配置参数
 * @param {object} context 可选 | 唯一值。非必传，由action页面发出时可以不传，由主服务发出必传
*/
1. $UD.sendParamFromPlugin(settings, context) 

/**
 * 设置图标-使⽤配置⾥的图标列表编号，请对照manifest.json。
 * @param {string} context 必传 |唯一值, 接收到的message里面common库会自动拼接给出
 * @param {number} state 必传 | 图标列表编号，
 * @param {string} text 可选 | icon是否显示文字
*/
2. $UD.setStateIcon(context, state, text) 


  /**
 * 设置图标-使⽤⾃定义图标
 * @param {string} context 必传 |唯一值,每个message里面common库会自动拼接给出
 * @param {string} data 必传 | base64格式的icon
 * @param {string} text 可选 | icon是否显示文字
*/
3. $UD.setBaseDataIcon(context, data, text) 


/**
 * 设置图标-使⽤本地图片文件
 * @param {string} context 必传 |唯一值,每个message里面common库会自动拼接给出
 * @param {string} path  必传 | 本地图片路径，⽀持打开插件根⽬录下的url链接（以/ ./ 起始的链接）
 * @param {string} text 可选 | icon是否显示文字
*/
4. $UD.setPathIcon(context, path, text) 


/**
 * 设置图标-使⽤⾃定义的动图
 * @param {string} context 必传 |唯一值,每个message里面common库会自动拼接给出
 * @param {string} gifdata  必传 | ⾃定义gif的base64编码数据
 * @param {string} text 可选 | icon是否显示文字
*/
5. $UD.setGifDataIcon(context, gifdata, text) 



  /**
 * 设置图标-使⽤本地gif⽂件
 * @param {string} context 必传 |唯一值,每个message里面common库会自动拼接给出，
 * @param {string} gifdata  必传 | 本地gif图片路径，⽀持打开插件根⽬录下的url链接（以/ ./ 起始的链接）
 * @param {string} text 可选 | icon是否显示文字
*/
6. $UD.setGifPathIcon(context, gifpath, text) 


/**
 * 请求上位机弹出Toast消息提⽰
 *  @param {string} msg 必传 | 窗口级消息提示
*/
7. $UD.toast(msg) 

/**
 * 请求上位机弹出选择对话框:选择文件
 *  @param {string} filter 可选 | 文件过滤器。筛选文件的类型，例如 "filter": "image(*.jpg *.png *.gif)" 或者 筛选文件 file(*.txt *.json) 等
 * 该请求的选择结果请通过 onSelectdialog 事件接收
*/
8. $UD.selectFileDialog(filter) 


/**
 * 请求上位机弹出选择对话框:选择文件夹
 * 该请求的选择结果请通过 onSelectdialog 事件接收
*/
9. $UD.selectFolderDialog() 


/**
 * 请求上位机使⽤浏览器打开url
 * @param {string} url 必传 | 直接远程地址和本地地址，⽀持打开插件根⽬录下的url链接（以/ ./ 起始的链接）
 * @param {local} boolean 可选 | 若为本地地址为true
*/
10. $UD.openUrl(url, local) 


/**
 * 请求上位机机显⽰弹窗；弹窗后，test.html需要主动关闭，测试到window.close()可以通知弹窗关闭
 *  @param {string} url 必传 | 本地html路径  (即将废弃， openUrl 方法已满足大多数打开链接的场景。若需要弹窗场景，我们后续会更新弹窗组件库，请关注)
*/
11. $UD.openView(url, width = 200, height = 200, x = 100, y = 100) 


```