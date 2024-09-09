let ACTION_SETTING = {}
let form = ''
$UD.connect('com.ulanzi.ulanzideck.analogclock.clock')

$UD.onConnected(conn => {
  //获取表单
  form = document.querySelector('#property-inspector');

  //渲染option
  const oClockSelector = document.querySelector(".clockSelector");
  Object.keys(clockfaces).map(e => {
    let option = document.createElement('option');
    option.setAttribute('value', e);
    option.setAttribute('label', clockfaces[e].name);
    option.setAttribute('data-localize', clockfaces[e].name);
    oClockSelector.appendChild(option);
  });


  //连接上socket,显示配置项
  const el = document.querySelector('.udpi-wrapper');
  el.classList.remove('hidden');


  //监听表单变化，发送参数到上位机
  form.addEventListener(
    'input',
    Utils.debounce(() => {
        const value = Utils.getFormValue(form);
        ACTION_SETTING = value
        if(!ACTION_SETTING.clock_type) ACTION_SETTING.clock_type = 'analog'
        $UD.sendParamFromPlugin(ACTION_SETTING);
    })
  );
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

//重载表单数据
function settingSaveParam(params) {
  // console.log('===setSetting', params)
  ACTION_SETTING = params;

  //渲染表单数据
  Utils.setFormValue(ACTION_SETTING, form);

}
