let ulanziLog = null; // 日志节点
let plugins = null; // 插件列表
let customMenu = null; // 自定义菜单节点
let config = {
  "language": "zh_CN",
  "loadAction": "no",
  "runMain": "no",
  "rootPath": "",
  serverPort: window.location.port
}  //默认配置

let activeKeys = {} // 当前激活的插件列表
let currentActiveKey = ''; // 当前激活的插件

let contextmenuKey = ''; // 右键菜单的key


const websocket = new WebSocket(`ws://127.0.0.1:${config.serverPort}/deckClient`)
websocket.onopen = function (evt) {

};
websocket.onclose = function (evt) {

}

websocket.onmessage = function (evt) {
  const jsonObj = JSON.parse(evt.data)
  if (jsonObj.cmd === 'log') {
    log(jsonObj)
  }
  if (jsonObj.cmd === 'listUpdated') {
    listUpdated(jsonObj.data)
  }
  if (jsonObj.cmd === 'init') {
    config = jsonObj.config
    activeKeys = jsonObj.activeKeys
    initRender()
  }
  if (jsonObj.cmd === 'state') {
    setStateIcon(jsonObj.param.statelist[0])
  }
  if (jsonObj.cmd === 'connectedMain') {
    connectedMain(jsonObj.connectedMain)
  }
  if (jsonObj.cmd === 'openurl') {
    window.open(jsonObj.url)
  }
  
}

function initRender(){
  setFormValue(config,form)
}

function connectedMain(data){
  for (const v of data) {
    const overlay = document.querySelector(`.slider-item-overlay[data-uuid="${v.UUID}"]`)
    overlay.style.display = 'none'
  }
}

function setStateIcon(iconData) {
  const data = iconData
  const { type, key } = data

  const uk = document.querySelector(`.ulanzi-key[data-key="${key}"]`)
  
  const ukImg = uk.getElementsByTagName('img')[0]
  let src = ''

  const { plugin, actionData, actionid, uuid } = activeKeys[key]

  if (type === 0) {
    //本地文件,状态列表
    src = `./${plugin}/${actionData.States[data.state].Image}`
  } else if ( type === 1) {
    //base64
    src = data.data
  } else if ( type === 3) {
    //gif base64
    src = data.gifdata
  } else if ( type === 2) {
    //本地绝对路径
    src = getRelativePath(data.path)
  } else if ( type === 4) {
    //本地gif绝对路径
    src = getRelativePath(data.gifpath)
  }
  if(!ukImg){
    uk.innerHTML = `<img src="${src}">`
  }else{
    ukImg.src = src
  }

}


//获取相对路径，适配上位机绝对路径
function getRelativePath(path){
  let rPath = path;
  const sStr = 'UlanziDeckSimulator/plugins/';

  if(rPath.indexOf(sStr) >= 0){
    rPath = rPath.split(sStr)[1]
  }


  return rPath
}


async function listUpdated(data) {
  plugins = data
  let listBuffer = []
  for (const k in data) {
    const v = data[k]

    // console.log('===k',k)
    // console.log('===v',v)
    let renderDate = v[config.language +'_DATA'] ? v[config.language +'_DATA'] : v

    let liBuffer = []
    for (let i = 0; i < renderDate.Actions.length; i++) {
      const action = renderDate.Actions[i]
      liBuffer.push(`<li class="draggable" draggable="true" data-action="${k + '___' + i}" title="${action.Tooltip}">
              <div class="icon-name action-icon">
                <img src="./${k}/${v.Actions[i]?.Icon}">
                <span>${action.Name}</span>
              </div>
            </li>`)
    }


    listBuffer.push(`
        <div class="ulanzi-slider-item">
          <div class="slider-item-title"  title="${renderDate.Description}">

            <div class="icon-name category-icon">
              <img src="./${k}/${v.Icon}">
              <span>${renderDate.Name}</span>
            </div>
          </div>
          <div class="slider-item-content">
            <ul class="slider-item-actions">
              ${liBuffer.join('')}
            </ul>
            <div class="slider-item-overlay" data-uuid="${v.UUID}">请先启动主服务</div>
          </div>
        </div>`)

  }
  document.querySelector("#ulanzi-list").innerHTML = listBuffer.join('')
  initializeDraggables()
}



function log(data) {

  // 创建一个新的div元素
  const logItem = document.createElement('div');
  logItem.className = 'log-item';

  // 创建时间显示的p标签
  const logTime = document.createElement('p');
  logTime.className = 'log-time';
  logTime.textContent = `[${data.time}]`;
  logItem.appendChild(logTime);

  // 创建日志信息的p标签
  const logText = document.createElement('p');
  logText.textContent = data.msg;
  logItem.appendChild(logText);

  if (data.code) {
    // 创建代码框div
    const codeBox = document.createElement('div');
    codeBox.className = 'fence-box code-box';

    // 创建代码显示的span标签
    const codeSpan = document.createElement('span');
    codeSpan.textContent = data.code;
    codeBox.appendChild(codeSpan);
    logItem.appendChild(codeBox);
  }


  // 将创建好的logItem添加到目标节点中
  ulanziLog.insertBefore(logItem, ulanziLog.firstChild);
}

function toast(msg) {
  const tt = document.querySelector("#toast")
  tt.innerHTML = msg
  tt.style.display = "block"
  setTimeout(() => {
    tt.style.display = "none"
  }, 2000)
}

function time() {
  return new Date().toLocaleString('zh-CN', { hour12: false })
}



function getFormValue(form) {
  if (typeof form === 'string') {
    form = document.querySelector(form);
  }

  const elements = form ? form.elements : '';

  if (!elements) {
    console.error('Could not find form!');
  }

  const formData = new FormData(form);
  let formValue = {};

  formData.forEach((value, key) => {
    if (!Reflect.has(formValue, key)) {
      formValue[key] = value;
      return;
    }
    if (!Array.isArray(formValue[key])) {
      formValue[key] = [formValue[key]];
    }
    formValue[key].push(value);
  });

  return formValue;
}

function setFormValue(jsn, form) {
  if (!jsn) {
    return;
  }

  if (typeof form === 'string') {
    form = document.querySelector(form);
  }

  const elements = form ? form.elements:'';

  if (!elements) {
    console.error('Could not find form!');
  }

  Array.from(elements)
    .filter((element) => element?element.name:null)
    .forEach((element) => {
      const { name, type } = element;
      const value = name in jsn ? jsn[name] : null;
      const isCheckOrRadio = type === 'checkbox' || type === 'radio';

      if (value === null) return;

      if (isCheckOrRadio) {
        const isSingle = value === element.value;
        if (isSingle || (Array.isArray(value) && value.includes(element.value))) {
          element.checked = true;
        }
      } else {
        element.value = value ? value : '';
      }
    });
}



document.addEventListener('DOMContentLoaded', function () {


  ulanziLog = document.getElementById('ulanzi-log')


  log({
    time: time(),
    msg: '正在连接上位机模拟器...',
  })

  ulanziLog.addEventListener('click', async function (event) {
    // 检查点击的目标是否是 .code-box 或其子元素
    const codeBox = event.target.closest('.code-box');
    if (codeBox) {
      // 获取要复制的文本内容
      const textToCopy = codeBox.querySelector('span').innerText;

      try {
        // 复制文本到剪贴板
        await navigator.clipboard.writeText(textToCopy);
        toast('复制成功！');
      } catch (err) {
        console.error('复制失败:', err);
        toast('复制失败，请尝试手动复制。');
      }
    }
  });

  //监听配置变化
  form = document.getElementById('ulanzi-config')
  form.addEventListener(
    'input',
    () => {
      const value = getFormValue(form);
      
      config = {
        ...config,
        ...value
      }
      send('config', { config })
      handleActiveCurrentKey()
    })


  //拖拽事件

  const ulanziKey = document.querySelectorAll('.ulanzi-key');
  customMenu = document.getElementById('custom-menu');
  // 目标区域的处理
  ulanziKey.forEach(uk => {
    uk.addEventListener('dragover', function (e) {
      e.preventDefault(); // 阻止默认行为以允许放置
    });

    uk.addEventListener('drop', function (e) {
      const index = uk.dataset.index
      const keyValue = keys[index]
      e.preventDefault();
      const data = e.dataTransfer.getData('text/plain'); // 获取拖拽的数据
      const plugin_action = data.split('___');
      const plugin = plugin_action[0];
      const action = plugin_action[1];
      const actionData = plugins[plugin].Actions[action];
      this.innerHTML = `<img src="./${plugin}/${actionData.Icon}">`; // 将数据放入目标区域

      log({
        time: time(),
        msg: `${actionData.UUID}拖入键盘，键值是${keyValue.key}，actionid是${keyValue.actionid}。上位机向主服务发送add和paramfromapp事件。请使用浏览器打开以下路径，调试该action。`,
        code: `http://127.0.0.1:${config.serverPort}/${plugin}/${actionData.PropertyInspectorPath}?address=127.0.0.1&port=${config.serverPort}&language=${config.language}&uuid=${actionData.UUID}&actionId=${keyValue.actionid}&key=${keyValue.key}`
      })
      send('add', { uuid: actionData.UUID, key: keyValue.key, actionid: keyValue.actionid })
      activeKeys[keyValue.key] = { uuid: actionData.UUID, key: keyValue.key, actionid: keyValue.actionid, plugin, actionData }
      send('activeKeys',{activeKeys})
      currentActiveKey = keyValue.key
      handleActiveCurrentKey()
    });

    //右键
    uk.addEventListener('contextmenu', function (event) {
      event.preventDefault();
      const imgLength = uk.getElementsByTagName('img')
      if (imgLength.length > 0) {
        showCustomMenu(event);
        contextmenuKey = uk.dataset.key
      }
    });

    //点击
    uk.addEventListener('click', function (event) {
      event.preventDefault();
      const imgLength = uk.getElementsByTagName('img')
      if (imgLength.length > 0) {
        showCustomMenu(event);
        currentActiveKey = uk.dataset.key
        handleActiveCurrentKey()
      }
    });


  });

  // 隐藏菜单
  document.addEventListener('click', function () {
    hideCustomMenu();
  });

  // 处理菜单项点击事件
  customMenu.addEventListener('click', function (event) {
    event.stopPropagation();
    const target = event.target;
    if (target.tagName === 'LI') {
      handleMenuItemClick(target.id);
    }
  });
})

function refreshList() {
  send('refreshList')
}

function send(cmd, data) {
  websocket.send(JSON.stringify({
    cmd,
    ...data
  }));
}

// 初始化单个可拖动节点
function initializeDraggable(draggable) {
  draggable.addEventListener('dragstart', function (e) {
    const dragImage = draggable.getElementsByTagName('img')[0];
    console.log('===dragImage', dragImage)
    const action = draggable.dataset.action
    // const img = new Image();
    // img.src = dragImage.src;
    // img.width = 32 ;
    // img.height = 32 ;
    e.dataTransfer.setData('text/plain', action); // 设置拖拽数据
    e.dataTransfer.setDragImage(dragImage, 20, 20); // 设置拖拽时显示的图像
    setTimeout(() => { this.style.opacity = '0.5'; }, 0); // 可视化拖动效果

  });

  draggable.addEventListener('dragend', function () {
    this.style.opacity = '1'; // 拖动结束恢复原样
  });
}

// 初始化所有已有的可拖动节点
function initializeDraggables() {
  const draggables = document.querySelectorAll('.draggable');
  draggables.forEach(initializeDraggable);
}

// 显示自定义菜单
function showCustomMenu(event) {
  customMenu.style.display = 'block';
  customMenu.style.left = event.pageX + 'px';
  customMenu.style.top = event.pageY + 'px';
}

// 隐藏自定义菜单
function hideCustomMenu() {
  customMenu.style.display = 'none';
}



// 处理菜单项点击的具体逻辑
function handleMenuItemClick(itemId) {
  const { uuid, key, actionid } = activeKeys[contextmenuKey]
  switch (itemId) {
    case 'menu-run':
      send('run', { uuid, key, actionid })
      log({
        time: time(),
        msg: `运行 ${uuid}___${key}___${actionid}。上位机向主服务发送run事件。`
      })
      break;
    case 'menu-clear':
      send('clear', { "param": [{ uuid, key, actionid }] })
      log({
        time: time(),
        msg: `删除 ${uuid}___${key}___${actionid}。上位机向主服务发送clear事件。`
      })
      const element = document.querySelector('.ulanzi-key[data-key="' + key + '"]');
      element.removeChild(element.firstChild);
      if(contextmenuKey == currentActiveKey){
        document.querySelector('.action-iframe').innerHTML = ''
        currentActiveKey = ''
        handleActiveCurrentKey()
      }
      break;
    case 'menu-setactive':
      send('setactive', { uuid, key, actionid, active: true })
      log({
        time: time(),
        msg: `设置活跃状态 ${uuid}___${key}___${actionid}。活跃状态触发时，有状态变化，主服务要更新icon。`
      })
      break;
    case 'menu-setnoactive':
      send('setactive', { uuid, key, actionid, active: false })
      log({
        time: time(),
        msg: `设置非活跃状态 ${uuid}___${key}___${actionid}。非活跃状态下，若有定时任务，主服务要保持后台静默运行，但是不用发送消息到上位机。`
      })
      break;
    default:
      break;
  }
  hideCustomMenu();
}


function handleActiveCurrentKey() {
  let activeElement = null;
  if (currentActiveKey) {
    activeElement = document.querySelector('.ulanzi-key[data-key="' + currentActiveKey + '"]');
    activeElement.classList.add('active');

    if (config.loadAction === 'yes') {
      const { plugin, actionData, actionid, key, uuid } = activeKeys[currentActiveKey]
      document.querySelector('.action-iframe').innerHTML = `<iframe src="http://127.0.0.1:${config.serverPort}/${plugin}/${actionData.PropertyInspectorPath}?address=127.0.0.1&port=${config.serverPort}&language=${config.language}&uuid=${uuid}&actionId=${actionid}&key=${key}"></iframe>`
    }
  }


  // 使用 querySelectorAll 查找所有 .ulanzi-key 元素
  const allUlanziKeys = document.querySelectorAll('.ulanzi-key');

  // 遍历所有 .ulanzi-key 元素，删除 active 类名
  allUlanziKeys.forEach(element => {
    if (element !== activeElement) {
      element.classList.remove('active');
    }
  });


}

