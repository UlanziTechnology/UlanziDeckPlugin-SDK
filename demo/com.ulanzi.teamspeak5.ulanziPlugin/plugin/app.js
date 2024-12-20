
import { UlanzideckApi } from './actions/plugin-common-node/index.js';
import TeamSpeakPlugin from "./actions/teamspeak.js";
import MicMute from "./actions/micmute.js";
import SoundMute from "./actions/soundmute.js";
import AFK from "./actions/afk.js";
import OverlayUsers from "./actions/overlay.js";
import PTT from "./actions/ptt.js";
import PTM from "./actions/ptm.js";
import RWhisper from "./actions/rwhisper.js";
import QWhisper from "./actions/qwhisper.js";
import LWhisper from "./actions/lwhisper.js";

const ACTION_CACHES = {}
const $UD = new UlanzideckApi();

$UD.connect('com.ulanzi.ulanzideck.teamspeak5')
$UD.onConnected(conn => {})

const $TeamSpeak= new TeamSpeakPlugin();



$TeamSpeak.on('connecting',()=>{
  for(let context in ACTION_CACHES){
    console.warn('===app TeamSpeak connecting',context)
    ACTION_CACHES[context].updatePluginParams({connectState:'connecting'})
  }
})
$TeamSpeak.on('connected',()=>{
  for(let context in ACTION_CACHES){
    console.warn('===app TeamSpeak connected',context)
    ACTION_CACHES[context].updatePluginParams({connectState:'connected'})
  }
})
$TeamSpeak.on('disconnected',()=>{
  for(let context in ACTION_CACHES){
    console.warn('===app TeamSpeak disconnected',context)
    ACTION_CACHES[context].updatePluginParams({connectState:'disconnected'})
  }
  
})



//把插件某个功能配置到按键上 
$UD.onAdd(jsn => {
  const context = jsn.context; //唯一id
  const instance = ACTION_CACHES[context];
  console.warn('===add:', context, typeof instance)
  if (!instance) {
    const uuid = jsn.uuid
    console.warn('===add in :',uuid)
    // ACTION_CACHES[context] = new [uuid](context,$UD); 
    if(uuid  === 'com.ulanzi.ulanzideck.teamspeak5.micmute'){
      ACTION_CACHES[context] = new MicMute(context,$UD,$TeamSpeak); 
    }else if(uuid  === 'com.ulanzi.ulanzideck.teamspeak5.soundmute'){
      ACTION_CACHES[context] = new SoundMute(context,$UD,$TeamSpeak); 
    }else if(uuid  === 'com.ulanzi.ulanzideck.teamspeak5.afk'){
      ACTION_CACHES[context] = new AFK(context,$UD,$TeamSpeak); 
    }else if(uuid  === 'com.ulanzi.ulanzideck.teamspeak5.overlay'){
      ACTION_CACHES[context] = new OverlayUsers(context,$UD,$TeamSpeak); 
    }else if(uuid  === 'com.ulanzi.ulanzideck.teamspeak5.ptt'){
      ACTION_CACHES[context] = new PTT(context,$UD,$TeamSpeak); 
    }else if(uuid  === 'com.ulanzi.ulanzideck.teamspeak5.ptm'){
      ACTION_CACHES[context] = new PTM(context,$UD,$TeamSpeak); 
    }else if(uuid  === 'com.ulanzi.ulanzideck.teamspeak5.rwhisper'){
      ACTION_CACHES[context] = new RWhisper(context,$UD,$TeamSpeak); 
    }else if(uuid  === 'com.ulanzi.ulanzideck.teamspeak5.qwhisper'){
      ACTION_CACHES[context] = new QWhisper(context,$UD,$TeamSpeak); 
    }else if(uuid  === 'com.ulanzi.ulanzideck.teamspeak5.lwhisper'){
      ACTION_CACHES[context] = new LWhisper(context,$UD,$TeamSpeak); 
    }
  }else{
    ACTION_CACHES[context].add()
  }
})

//插件功能活跃状态设置
$UD.onSetActive(jsn =>{
  const context = jsn.context
  const instance = ACTION_CACHES[context];
  if (instance) {
    if (typeof instance.setActive === 'function') instance.setActive(jsn.active)
  }
})

//按键按下时发送的事件
$UD.onRun(jsn =>{
  const context = jsn.context
  const instance = ACTION_CACHES[context];
  if (!instance){
    $UD.emit('add',jsn);
  }else {
    console.warn('===instance onRun tun====',typeof instance.run)
    if (typeof instance.run === 'function') instance.run(jsn)
  }
})

//移除插件的功能配置信息
$UD.onClear(jsn =>{
  if(jsn.param){
    for(let i = 0; i<jsn.param.length; i++){
      const context = jsn.param[i].context
      const instance = ACTION_CACHES[context];
      console.log('=====jsn.param[i]',jsn.param[i])
      console.log('=====context',context)
      console.log('=====instance',typeof instance)
      if (typeof instance.clear === 'function') instance.clear(context)
      delete ACTION_CACHES[context]
    }
  }
})

//重载插件功能配置信息变化
$UD.onParamFromApp(jsn =>{
  onSetParams(jsn)
})

//监听插件功能配置信息变化
$UD.onParamFromPlugin(jsn =>{
  onSetParams(jsn)
})


//更新参数
function onSetParams(jsn){
  const settings = jsn.param ||  {}
  const context = jsn.context
  const instance = ACTION_CACHES[context];
  if(!settings || !instance || JSON.stringify(settings) === '{}') return;

  if (typeof instance.setParams === 'function') instance.setParams(settings);
}