
import { UlanziApi } from './actions/ulanzi-api/index.js';

import APIRequest from './actions/APIRequest.js'


const ACTION_CACHES = {}

const $UD = new UlanziApi();

$UD.connect('com.ulanzi.ulanzistudio.APIRequest')
$UD.onConnected(conn => {})


//把插件某个功能配置到按键上
$UD.onAdd(jsn => {
  const context = jsn.context; //唯一id
  const instance = ACTION_CACHES[context];
  if (!instance) {
    ACTION_CACHES[context] = new APIRequest(context,$UD);
    onSetSettings(jsn,'init')
  } else {
    onSetSettings(jsn,'init')
  }
})

//插件功能活跃状态设置
$UD.onSetActive(jsn =>{
  const context = jsn.context
  const instance = ACTION_CACHES[context];
  if (instance) {
    instance.setActive(jsn.active)
  }
})

//按键按下时发送的事件
$UD.onRun(jsn =>{
  const context = jsn.context
  const instance = ACTION_CACHES[context];

  if (!instance) $UD.emit('add',jsn);
  else instance.sendRequest();
})

//移除插件的功能配置信息
$UD.onClear(jsn =>{
  if(jsn.param){
    for(let i = 0; i<jsn.param.length; i++){
      // const context = $UD.encodeContext(jsn.param[i])
      const context = jsn.param[i].context
      // console.log('===context clear', context)
      ACTION_CACHES[context].destroy()
      delete ACTION_CACHES[context]
    }
  }
})

//重载插件功能配置信息变化
$UD.onParamFromApp(jsn =>{
  onSetSettings(jsn)
})

//监听插件功能配置信息变化
$UD.onParamFromPlugin(jsn =>{
  onSetSettings(jsn)
})


//更新参数
function onSetSettings(jsn, type) {
  console.log('===onSetSettings:', jsn, type)
  const settings = jsn.param ||  {}
  const context = jsn.context
  const instance = ACTION_CACHES[context];
  if(!settings || !instance || JSON.stringify(settings) === '{}') return;

  instance.updateSettings(settings, type);
}