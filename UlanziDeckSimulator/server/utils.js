class UlanziUtils {

  	/**
   * 获取根目录
   */
	getRootPath(){
		const currentFilePath = process.argv[1];
    let split_tag = '/'
    if(currentFilePath.indexOf('\\') > -1){
      split_tag = '\\'
    }
    const pathArr = currentFilePath.split(split_tag);
    const idx = pathArr.findIndex(f => f.endsWith('UlanziDeckSimulator'));
    const __folderpath = `${pathArr.slice(0, idx + 1).join("/")}`;
	
		return __folderpath;
	
	}

  time(){
    return new Date().toLocaleString('zh-CN', {hour12: false})
  }

  /**
   * 创建唯一值
  */
  encodeContext(jsn) {
    return jsn.uuid + '___' + jsn.key + '___' + jsn.actionid
  }

  /**
   * 解构唯一值
  */
  decodeContext(context) {
    const de_ctx = context.split('___')
    return {
      uuid: de_ctx[0],
      key: de_ctx[1],
      actionid: de_ctx[2]
    }
  }
}


const utils = new UlanziUtils();
export default utils;