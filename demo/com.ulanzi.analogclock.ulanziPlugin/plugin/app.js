const ACTION_CACHES = {}
$UD.connect('com.ulanzi.ulanzideck.analogclock')
$UD.onConnected(conn => {})


//把插件某个功能配置到按键上
$UD.onAdd(jsn => {
  const context = jsn.context; //唯一id
  const instance = ACTION_CACHES[context];
  if (!instance) {
    ACTION_CACHES[context] = new AnalogClock(context);
    onSetSettings(jsn);
  } else {
    instance.drawClock()
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
  else instance.toggleClock();
})

//移除插件的功能配置信息
$UD.onClear(jsn =>{
  if(jsn.param){
    for(let i = 0; i<jsn.param.length; i++){
      // const context = $UD.encodeContext(jsn.param[i])
      const context = jsn.param[i].context
      // console.log('===context clear', context)
      ACTION_CACHES[context].destroyClock()
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
function onSetSettings(jsn){
  const settings = jsn.param ||  {}
  const context = jsn.context
  const clock = ACTION_CACHES[context];
  if(!settings || !clock) return;

  if(settings.hasOwnProperty('clock_index')) { 
      const clockIdx = Number(settings.clock_index);
      clock.setClockFaceNum(clockIdx);
      ACTION_CACHES[context] = clock;
  }
  if(settings.hasOwnProperty('clock_type')) {
    clock.setClockType(settings.clock_type);
  }
}