let ACTION_SETTING = {}
let form = ''
$UD.connect()

$UD.onConnected(conn => {
  //获取表单
  form = document.querySelector('#property-inspector');


  //连接上socket,显示配置项
  const el = document.querySelector('.udpi-wrapper');
  el.classList.remove('hidden');

  //渲染option
  renderFn()


  //监听表单变化，发送参数到上位机
  form.addEventListener(
    'input',
    Utils.debounce(async () => {
      const value = Utils.getFormValue(form);
      console.log('==value', value)
      ACTION_SETTING = value
        //绿色反馈
      if(value.enable_success_indicator){
        ACTION_SETTING.enable_success_indicator = 'on'
      }else{
        ACTION_SETTING.enable_success_indicator = false
      }

      //响应
      if(value.response_parse){
        ACTION_SETTING.response_parse = 'on'
      }else{
        ACTION_SETTING.response_parse = false
      }

      //轮询
      if(value.poll_status){
        ACTION_SETTING.poll_status = 'on'
      }else{
        ACTION_SETTING.poll_status = false
      }

      //轮询字段
      if(value.poll_status_parse){
        ACTION_SETTING.poll_status_parse = 'on'
      }else{
        ACTION_SETTING.poll_status_parse = false
      }
      await showHideSettingsFn()
      $UD.sendParamFromPlugin(ACTION_SETTING);
    })
  );
});

//获取初始化参数，两个事件都监听，防止遗漏
$UD.onAdd(jsonObj => {
  if (jsonObj && jsonObj.param) {
    settingSaveParam(jsonObj.param)
  }
})

//获取初始化参数
$UD.onParamFromApp(jsonObj => {

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
  showHideSettingsFn()
}



//特殊处理表单数据
async function showHideSettingsFn() {
  console.log('===showHideSettings:', JSON.stringify(ACTION_SETTING))
  var d;

  d = document.getElementById('poll_status_settings');
  d.style.display = ACTION_SETTING.poll_status ? "" : "none";

  d = document.getElementById('poll_status_parse_settings');
  d.style.display = ACTION_SETTING.poll_status_parse ? "" : "none";


}


async function renderFn() {

  const oColorSelectors = document.querySelectorAll(".color-selector");
  console.log('===oColorSelectors', oColorSelectors)
  oColorSelectors.forEach(oColorSelector => {
    oColorSelector.innerHTML = '';
    Object.keys(COLORS).map(e => {
      // console.log('---oColorSelector:', oColorSelector)
      let option = document.createElement('option');
      option.setAttribute('value', e);
      option.setAttribute('label', $UD.t(COLORS[e].name));
      option.setAttribute('data-localize', COLORS[e].name);
      oColorSelector.appendChild(option);
    })
  });



}