let ACTION_SETTING = {}
let form = ''
let connect_form = ''
$UD.connect('com.ulanzi.ulanzideck.teamspeak5.afk')

$UD.onConnected(conn => {
  //获取表单
 
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

}


document.getElementById('form-help').addEventListener('click',() => {
  const ln = Utils.getLanguage();

  $UD.openUrl(`https://www.ulanzistudio.com/doc/teamspeak5_${ln}`);
})


//特殊处理表单数据
function renderForm(params){



  document.getElementById('connect-state').innerText = $UD.t(params.connectState || 'disconnected')


}
