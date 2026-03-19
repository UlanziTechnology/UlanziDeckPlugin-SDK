let ACTION_SETTING = {}
let form = ''
$UD.connect('com.ulanzi.ulanzideck.APIRequest.request')

$UD.onConnected(conn => {
  //获取表单
  form = document.querySelector('#property-inspector');


  //连接上socket,显示配置项
  const el = document.querySelector('.udpi-wrapper');
  el.classList.remove('hidden');


  //监听表单变化，发送参数到上位机
  form.addEventListener(
    'input',
    Utils.debounce(async () => {
        const value = Utils.getFormValue(form);
        console.log('==value',value)
        ACTION_SETTING = {
          ...value,
          image_matched_filename:ACTION_SETTING.image_matched_filename,
          image_unmatched_filename:ACTION_SETTING.image_unmatched_filename,
          image_matched:ACTION_SETTING.image_matched,
          image_unmatched:ACTION_SETTING.image_unmatched
        }
        await renderForm()
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
  renderForm()
}



//特殊处理表单数据
async function renderForm(){
  console.log('===showHideSettings:',JSON.stringify(ACTION_SETTING))
  var d;
  d = document.getElementById('response_parse_settings');
  d.style.display = ACTION_SETTING.response_parse ? "" : "none";

  d = document.getElementById('poll_status_settings');
  d.style.display = ACTION_SETTING.poll_status ? "" : "none";

  d = document.getElementById('poll_status_parse_settings');
  d.style.display = ACTION_SETTING.poll_status_parse ? "" : "none";
  if(ACTION_SETTING.image_matched_file && ACTION_SETTING.image_matched_file.size > 0 && Utils.isFile(ACTION_SETTING.image_matched_file)){
    ACTION_SETTING.image_matched_filename = ACTION_SETTING.image_matched_file.name
    ACTION_SETTING.image_matched = await Utils.htmlFileToBase64(ACTION_SETTING.image_matched_file)
  }

  if(ACTION_SETTING.image_unmatched_file && ACTION_SETTING.image_unmatched_file.size > 0 && Utils.isFile(ACTION_SETTING.image_unmatched_file)){
    ACTION_SETTING.image_unmatched_filename = ACTION_SETTING.image_unmatched_file.name
    ACTION_SETTING.image_unmatched = await Utils.htmlFileToBase64(ACTION_SETTING.image_unmatched_file)
  }


  document.querySelector(`.udpi-file-info[for="image_matched"]`).textContent = ACTION_SETTING.image_matched_filename || '...';
  document.querySelector(`.udpi-file-info[for="image_unmatched"]`).textContent = ACTION_SETTING.image_unmatched_filename || '...';

  //删除不需要to发送的参数
  delete ACTION_SETTING.image_matched_file
  delete ACTION_SETTING.image_unmatched_file
}