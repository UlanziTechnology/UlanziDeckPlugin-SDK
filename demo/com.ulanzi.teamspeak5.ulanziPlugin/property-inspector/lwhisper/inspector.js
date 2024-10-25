let ACTION_SETTING = {}
let form = ''
$UD.connect('com.ulanzi.ulanzideck.teamspeak5.lwhisper')

$UD.onConnected(conn => {
  //获取表单
  form = document.querySelector('#property-inspector');
 
  //渲染option



  //连接上socket,显示配置项
  const el = document.querySelector('.udpi-wrapper');
  el.classList.remove('hidden');


});

//获取初始化参数，两个事件都监听，防止遗漏
$UD.onAdd( jsonObj => {
  if (jsonObj && jsonObj.param) {
    settingSaveParam(jsonObj.param)
  }
})

//获取初始化参数
$UD.onParamFromApp( jsonObj => {

  if (jsonObj && jsonObj.param) {
    settingSaveParam(jsonObj.param)
  }

})


//获取初始化参数
$UD.onParamFromPlugin( jsonObj => {
  console.log('====record onParamFromPlugin',jsonObj)
  if (jsonObj && jsonObj.param) {
    settingSaveParam(jsonObj.param)
  }

})



//重载表单数据
function settingSaveParam(params) {
  // console.log('===setSetting', params)

  renderForm(params)
  
  ACTION_SETTING = params;


  //渲染表单数据
  Utils.setFormValue(ACTION_SETTING, form);
}

document.getElementById('form-submit').addEventListener('click',() => {
  const value = Utils.getFormValue(form);

  if(!value.whisperlistName){
    $UD.toast('请输入密语列表名称')
    return;
  }
  $UD.sendParamFromPlugin({
    ...value
  });
})

document.getElementById('form-help').addEventListener('click',() => {
  const ln = Utils.getLanguage();

  $UD.openUrl(`https://www.ulanzistudio.com/doc/teamspeak5_${ln}`);
})



//特殊处理表单数据
function renderForm(params){

  console.warn('===renderForm',JSON.stringify(params))


  document.getElementById('connect-state').innerText = $UD.t(params.connectState || 'disconnected')


}
