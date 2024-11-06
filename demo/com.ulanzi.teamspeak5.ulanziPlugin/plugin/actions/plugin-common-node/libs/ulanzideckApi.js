

import WebSocket from 'ws';
import EventEmitter from 'events';


import { Events, SocketErrors } from "./constants.js";
import Utils from "./utils.js";


class UlanzideckApi extends EventEmitter {
  
  constructor() {
    super();

    this.key = '';
    this.uuid = '';
    this.actionid = '';
    this.websocket = null;
    // language = 'en';
    // localization = null;
    // localPathPrefix = '../../langs/';
    // on = EventEmitter.on;
    // emit = EventEmitter.emit;
  }


  connect(uuid, port = 3906, address = '127.0.0.1') {
    
    //动态获取ip和端口
    const [ argv_address, argv_port ] = process.argv.splice(2);

    this.address = argv_address || address;
    this.port = argv_port || port;

    this.uuid = uuid;

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    //判断是否为主服务,约定主服务 uuid 为4位，action应大于4位
    const isMain = this.uuid.split('.').length == 4;

    this.websocket = new WebSocket(`ws://${this.address}:${this.port}`);

    this.websocket.onopen = () => {
      Utils.log('[ULANZIDECK] WEBSOCKET OPEN:', uuid);
      const json = {
        code: 0,
        cmd: Events.CONNECTED,
        uuid
      };

      this.websocket.send(JSON.stringify(json));

      this.emit(Events.CONNECTED, {});

      //如果是主服务，则不进行本地化
      if (!isMain) {
        // this.localizeUI();  //node 不做本地化
      }
    };

    this.websocket.onerror = (evt) => {
      const error = `[ULANZIDECK] WEBSOCKET ERROR: ${JSON.stringify(evt)}, ${ JSON.stringify(evt.data)}, ${SocketErrors[evt?.code || 'DEFAULT']}`;
      Utils.warn(error);

      this.emit(Events.ERROR, error);
    };

    this.websocket.onclose = (evt) => {
      Utils.warn('[ULANZIDECK] WEBSOCKET CLOSED:', SocketErrors[evt?.code || 'DEFAULT']);
      this.emit(Events.CLOSE);
    };

    this.websocket.onmessage = (evt) => {
      Utils.log('[ULANZIDECK] WEBSOCKET MESSGE ');

      const data = evt?.data ? JSON.parse(evt.data) : null;


      Utils.log('[ULANZIDECK] WEBSOCKET MESSGE DATA:', JSON.stringify(data));


      //没有数据或者有data.code属性,且cmdType不等于REQUEST，则返回
      if (!data || (typeof data.code !== 'undefined' && data.cmdType !== 'REQUEST')) return;



      Utils.log('[ULANZIDECK] WEBSOCKET MESSGE IN');

      //没有key时，保存key
      if (!this.key && data.uuid == this.uuid && data.key) {
        this.key = data.key
      }
       //没有actionid时，保存actionid
      if(!this.actionid && data.uuid == this.uuid && data.actionid){
        this.actionid = data.actionid
      }

      if (isMain) {
        //主服务回应上位机
        this.send(data.cmd, {
          code: 0,
          ...data
        })
      }


      //特殊处理clear,因为clear事件变量是数组形式
      if(data.cmd == 'clear'){
        if(data.param){
          for(let i = 0; i<data.param.length; i++){
            const context = this.encodeContext(data.param[i])
            data.param[i].context = context
          }
        }
      }else{
        //拼接唯一id给功能页
        const context = this.encodeContext(data)
        data.context = context
      }

      //引发事件
      this.emit(data.cmd, data)
    };
  }


  /**
   * 本地化
  */
  async localizeUI() {
    const el = document.querySelector('.udpi-wrapper');
    if (!el) return Utils.warn("No element found to localize");

    this.language = Utils.getLanguage() || 'en';
    if (!this.localization) {
      try {
        const localJson = await Utils.readJson(`${this.localPathPrefix}${this.language}.json`)
        this.localization = localJson['Localization'] ?? null
      } catch (e) {
        Utils.log(`${this.localPathPrefix}${this.language}.json`)
        Utils.warn("No FILE found to localize " + this.language);
      }
    }
    if (!this.localization) return;

    const selectorsList = '[data-localize]';
    el.querySelectorAll(selectorsList).forEach(e => {
      const s = e.innerText.trim();
      e.innerHTML = e.innerHTML.replace(s, this.localization[s] || s);
      if (e.placeholder && e.placeholder.length) {
        e.placeholder = this.localization[e.placeholder] || e.placeholder;
      }
      if (e.title && e.title.length) {
        e.title = this.localization[e.title] || e.title;
      }
      if(e.label){
          e.label = this.localization[e.label] || e.label;
      }
    });
  };

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

  /**
   * Send JSON params to StreamDeck
   * @param {string} cmd
   * @param {object} params
   */
  send(cmd, params) {
    this.websocket && this.websocket.send(JSON.stringify({
      cmd,
      uuid: this.uuid,
      key: this.key,
      actionid: this.actionid,
      ...params
    }));
  }

  /**
   * 向上位机发送配置参数
   * @param {object} settings 必传 | 配置参数
   * @param {object} context 可选 | 唯一id。非必传，由action页面发出时可以不传，由主服务发出必传
  */
  sendParamFromPlugin(settings, context) {
    const { uuid, key, actionid } = context ? this.decodeContext(context) : {}
    this.send(Events.PARAMFROMPLUGIN, {
      uuid: uuid || this.uuid,
      key: key || this.key,
      actionid: actionid || this.actionid,
      param: settings
    })
  }

   /**
   * 请求上位机使⽤浏览器打开url
   * @param {string} url 必传 | 直接远程地址和本地地址，⽀持打开插件根⽬录下的url链接（以/ ./ 起始的链接）。
   *                           只能是基本路径，不能带参数，需要带参数请设置在param值里面
   * @param {local} boolean 可选 | 若为本地地址为true
   * @param {object} param 可选 | 路径的参数值
  */
   openUrl(url, local, param) {
    this.send(Events.OPENURL, {
      url,
      local: local ? true : false,
      param: param ? param : null
    })
  }

  /**
   * 请求上位机机显⽰弹窗；弹窗后，test.html需要主动关闭，测试到window.close()可以通知弹窗关闭
   *  @param {string} url 必传 | 本地html路径，只能是基本路径，不能带参数，需要带参数请设置在param值里面
   * @param {string} width 可选 | 窗口宽度，默认200
   * @param {string} height 可选 | 窗口高度，默认200
   * @param {string} x 可选 | 窗口x坐标，不传值默认居中
   * @param {string} y 可选 | 窗口y坐标，不传值默认居中
   * @param {object} param 可选 | 路径的参数值
  */
  openView(url, width = 200, height = 200, x, y, param) {
    const params = {
      url,
      width,
      height
    }
    if(x){
      params.x = x
    }
    if(y){
      params.y = y
    }
    if(param){
      params.param = param
    }
    this.send(Events.OPENVIEW, params)
  }

  /**
   * 请求上位机弹出Toast消息提⽰
   *  @param {string} msg 必传 | 窗口级消息提示
  */
  toast(msg) {
    this.send(Events.TOAST, {
      msg
    })
  }

  /**
   * 请求上位机弹出选择对话框:选择文件
   *  @param {string} filter 可选 | 文件过滤器。筛选文件的类型，例如 "filter": "image(*.jpg *.png *.gif)" 或者 筛选文件 file(*.txt *.json) 等
   * 该请求的选择结果请通过 onSelectdialog 事件接收
  */
  selectFileDialog(filter) {
    this.send(Events.SELECTDIALOG, {
      type: 'file',
      filter
    })
  }

  /**
   * 请求上位机弹出选择对话框:选择文件夹
   * 该请求的选择结果请通过 onSelectdialog 事件接收
  */
  selectFolderDialog() {
    this.send(Events.SELECTDIALOG, {
      type: 'folder'
    })
  }


  /**
   * 设置图标-使⽤配置⾥的图标列表编号，请对照manifest.json
   * @param {string} context 必传 |唯一id,每个message里面common库会自动拼接给出
   * @param {number} state 必传 | 图标列表编号，
   * @param {string} text 可选 | icon是否显示文字
  */
  setStateIcon(context, state, text) {
    const { uuid, key, actionid } = this.decodeContext(context)
    this.send(Events.STATE, {
      param: {
        statelist: [{
          uuid,
          key,
          actionid,
          type: 0,
          state,
          textData: text || '',
          showtext: text ? true : false
        }]
      }
    })
  }

  /**
   * 设置图标-使⽤⾃定义图标
   * @param {string} context 必传 |唯一id,每个message里面common库会自动拼接给出
   * @param {string} data 必传 | base64格式的icon
   * @param {string} text 可选 | icon是否显示文字
  */
  setBaseDataIcon(context, data, text) {
    const { uuid, key, actionid } = this.decodeContext(context)
    this.send(Events.STATE, {
      param: {
        statelist: [{
          uuid,
          key,
          actionid,
          type: 1,
          data,
          textData: text || '',
          showtext: text ? true : false
        }]
      }
    })
  }

  /**
   * 设置图标-使⽤本地图片文件
   * @param {string} context 必传 |唯一id,每个message里面common库会自动拼接给出
   * @param {string} path  必传 | 本地图片路径，⽀持打开插件根⽬录下的url链接（以/ ./ 起始的链接）
   * @param {string} text 可选 | icon是否显示文字
  */
  setPathIcon(context, path, text) {
    const { uuid, key, actionid } = this.decodeContext(context)
    this.send(Events.STATE, {
      param: {
        statelist: [{
          uuid,
          key,
          actionid,
          type: 2,
          path,
          textData: text || '',
          showtext: text ? true : false
        }]
      }
    })
  }


  /**
   * 设置图标-使⽤⾃定义的动图
   * @param {string} context 必传 |唯一id,每个message里面common库会自动拼接给出
   * @param {string} gifdata  必传 | ⾃定义gif的base64编码数据
   * @param {string} text 可选 | icon是否显示文字
  */
  setGifDataIcon(context, gifdata, text) {
    const { uuid, key, actionid } = this.decodeContext(context)
    this.send(Events.STATE, {
      param: {
        statelist: [{
          uuid,
          key,
          actionid,
          type: 3,
          gifdata,
          textData: text || '',
          showtext: text ? true : false
        }]
      }
    })
  }

  /**
   * 设置图标-使⽤本地gif⽂件
   * @param {string} context 必传 |唯一id,每个message里面common库会自动拼接给出，
   * @param {string} gifdata  必传 | 本地gif图片路径，⽀持打开插件根⽬录下的url链接（以/ ./ 起始的链接）
   * @param {string} text 可选 | icon是否显示文字
  */
  setGifPathIcon(context, gifpath, text) {
    const { uuid, key, actionid } = this.decodeContext(context)
    this.send(Events.STATE, {
      param: {
        statelist: [{
          uuid,
          key,
          actionid,
          type: 3,
          gifpath,
          textData: text || '',
          showtext: text ? true : false
        }]
      }
    })
  }


  /**
   * 监听socket连接事件
  */
  onConnected(fn) {
    if (!fn) {
      Utils.error(
        'A callback function for the connected event is required for onConnected.'
      );
    }

    this.on(Events.CONNECTED, (jsn) => fn(jsn));
    return this;
  }


  /**
   * 监听socket断开事件
  */
  onClose(fn) {
    if (!fn) {
      Utils.error(
        'A callback function for the close event is required for onClose.'
      );
    }

    this.on(Events.CLOSE, (jsn) => fn(jsn));
    return this;
  }


  /**
   * 监听socket错误事件
  */
  onError(fn) {
    if (!fn) {
      Utils.error(
        'A callback function for the error event is required for onError.'
      );
    }

    this.on(Events.ERROR, (jsn) => fn(jsn));
    return this;
  }


  /**
   * 接收上位机事件：add
  */
  onAdd(fn) {
    if (!fn) {
      Utils.error(
        'A callback function for the add event is required for onAdd.'
      );
    }

    this.on(Events.ADD, (jsn) => fn(jsn));
    return this;
  }


  /**
   * 接收上位机事件：paramfromapp
  */
  onParamFromApp(fn) {
    if (!fn) {
      Utils.error(
        'A callback function for the paramfromapp event is required for onParamFromApp.'
      );
    }

    this.on(Events.PARAMFROMAPP, (jsn) => fn(jsn));
    return this;
  }

  /**
   * 接收上位机事件：paramfromplugin
  */
  onParamFromPlugin(fn) {
    if (!fn) {
      Utils.error(
        'A callback function for the paramfromplugin event is required for onParamFromPlugin.'
      );
    }

    this.on(Events.PARAMFROMPLUGIN, (jsn) => fn(jsn));
    return this;
  }

  /**
   * 接收上位机事件：run
  */
  onRun(fn) {
    if (!fn) {
      Utils.error(
        'A callback function for the run event is required for onRun.'
      );
    }

    this.on(Events.RUN, (jsn) => fn(jsn));
    return this;
  }

  /**
   * 接收上位机事件：setactive
  */
  onSetActive(fn) {
    if (!fn) {
      Utils.error(
        'A callback function for the setactive event is required for onSetActive.'
      );
    }

    this.on(Events.SETACTIVE, (jsn) => fn(jsn));
    return this;
  }

  /**
   * 接收上位机事件：clear
  */
  onClear(fn) {
    if (!fn) {
      Utils.error(
        'A callback function for the clear event is required for onClear.'
      );
    }

    this.on(Events.CLEAR, (jsn) => fn(jsn));
    return this;
  }

  /**
   * 接收上位机事件：返回选择弹窗结果
  */
  onSelectdialog(fn) {
    if (!fn) {
      Utils.error(
        'A callback function for the selectdialog event is required for onSelectdialog.'
      );
    }

    this.on(Events.SELECTDIALOG, (jsn) => fn(jsn));
    return this;
  }


}


export default UlanzideckApi;