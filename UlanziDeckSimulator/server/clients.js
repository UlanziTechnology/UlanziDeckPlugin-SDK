
import EventEmitter from 'events';
import menu from './menu.js';
import DeckClient from './deckClient.js';
import utils from './utils.js';

export default class Clients extends EventEmitter {
  constructor(config) {
    super();

    this.config = config;
    this.clientList = {};  //存储插件列表
    this.contextDatas = {};  //存储插件数据

    this.activeKeys = {};//已使用的key

    this.deckClient = null; //上位机模拟器客户端

    this.plugins = menu.plugins;
    menu.on('listUpdated', (data) => {
      // console.log('=== listUpdatedmenu',data)
      this.plugins = data;
      this.deckClient && this.deckClient.listUpdated(data)
      this.checkMainState()
    })


  }

  addClient(client, type) {
    if (type === 'deckClient') {
      this.deckClient = new DeckClient(client);
      this.log('连接上位机模拟器成功！等待加载插件...')
      this.deckClient.send('init',{
        rootPath:utils.getRootPath(),
        activeKeys:this.activeKeys
      })
      if (this.plugins) {
        this.deckClient.listUpdated(this.plugins);
        this.checkMainState()
      }
      if(Object.keys(this.activeKeys).length != 0){
        this.log('键盘重载，向已启动的主服务发送setactive事件，主服务应发送当前状态的icon数据。')
        for(const k in this.activeKeys){
          const {  uuid, key, actionid } = this.activeKeys[k]
          const mainUuid = this.getMainUuid(uuid)
          if (this.clientList[mainUuid] && this.clientList[mainUuid].readyState == 1){

            this.clientList[mainUuid].send(JSON.stringify({
              cmd: 'setactive',
              uuid, key, actionid, 
              active: true
            }))
          }
        }

      }
      this.deckClient.on('refreshList', () => {
        this.refreshList()
      })
      this.deckClient.on('add', (data) => {
        console.log('===DE add',data)
        const { uuid,key,actionid } = data;
        const context = utils.encodeContext(data)
        const param = this.contextDatas[context] || null
        this.send('add',{
          uuid,key,actionid,param
        },true)
        this.send('paramfromapp',{
          uuid,key,actionid,param
        },true)
      })
      this.deckClient.on('activeKeys', (data) => {
        this.activeKeys = data.activeKeys
      })

      this.deckClient.on('run', (data) => {
        const { uuid,key,actionid } = data;
        const context = utils.encodeContext(data)
        const param = this.contextDatas[context] || null
        this.send('run',{
          uuid,key,actionid,param
        },true)
      })

      this.deckClient.on('setactive', (data) => {
        this.send('setactive',data,true)
      })
      this.deckClient.on('clear', (data) => {
        this.send('clear',data,true)
      })

    }else{
      client.on('message', (msg)=>{
        const data = JSON.parse(msg.toString());
        // console.log('Received message from client:', data);

        if(data.cmd === 'connected') {
          this.connected(client, data)
        }
        if(data.cmd === 'state') {
          this.deckClient && this.deckClient.send('state', data)
        }
        if(data.cmd === 'paramfromplugin' && typeof data.code == 'undefined') {
          this.paramfromplugin(data, client)
        }
      });
      client.on('close', (msg)=>{
        // console.log('Received close from client:');
        for(const k in this.clientList){
          if(this.clientList[k] == client){
            delete this.clientList[k]
            break;
          }
        }
      });

    }
    // this.clients.push(client);
  }

  paramfromplugin(data,client){
    const { uuid,param } = data;
    const context = utils.encodeContext(data)
    this.contextDatas[context] = param

    const mainUuid = this.getMainUuid(uuid)

    //回复
    client.send(JSON.stringify({
      cmd: 'paramfromplugin',
      ...data,
      code: 0
    }))

    const isMainSend = this.clientList[mainUuid] == client  // 判断是不是主服务发送的
    //转发
    if(isMainSend){
      if (this.clientList[context] && this.clientList[context].readyState == 1){
        this.clientList[context].send(JSON.stringify({
          cmd: 'paramfromplugin',
          ...data
        }))
      }
    }else{
      if (this.clientList[mainUuid] && this.clientList[mainUuid].readyState == 1){
        this.clientList[mainUuid].send(JSON.stringify({
          cmd: 'paramfromplugin',
          ...data
        }))
      }
    }


  }


  connected(client, data){
    const { uuid,key,actionid } = data;
    const isMain = uuid.split('.').length == 4;
    if(isMain){
      this.log('主服务 '+uuid + ' 已连接！')
      this.clientList[uuid] = client;
      this.checkMainState('onlyCheck')
    }else{
      console.log('==data',data)
      const context = utils.encodeContext(data)
      this.clientList[context] = client;
      const param = this.contextDatas[context] || null
      if(this.activeKeys[key] && this.activeKeys[key].uuid === uuid && this.activeKeys[key].actionid === actionid){
        
        this.log(`配置项 ${uuid} 已连接！键值为${key},actionid为${actionid}。上位机模拟器向该action页面发送paramfromapp事件。`)
        this.send('paramfromapp',{
          uuid,key,actionid,param
        })
      }else{
        this.log(`配置项 ${uuid} 已连接！键值为${key},actionid为${actionid}。上位机模拟器向该action页面发送add和paramfromapp事件。`)
        this.send('add',{
          uuid,key,actionid,param
        })
        this.send('paramfromapp',{
          uuid,key,actionid,param
        })
      }
    }
  }


  refreshList() {
    this.log('正在加载插件列表...')
    menu.getList()
  }


  checkMainState(onlyCheck) {
    let connectedMain = []
    for (const k in this.plugins) {
      const v = this.plugins[k]
      const renderDate = this.config.language === 'zh_CN' ? v.zhData : v
  
      if (this.clientList[v.UUID] && this.clientList[v.UUID].readyState == 1) { //存在并且还是连接状态
          if(!onlyCheck)this.log(renderDate.Name + ' 主服务 '+ v.UUID +' 已连接！')
          connectedMain.push(v)
      } else {
          let code = ''
          let msg = ''
          if (v.CodePath.indexOf('.js') >= 0) {
              msg = renderDate.Name  + ' 主服务 '+ v.UUID +' 未连接，请到插件的根目录下运行以下代码启动主服务'
              code = `node ${v.CodePath} 127.0.0.1 ${this.config.serverPort} ${this.config.language}`
          } else {
              msg = renderDate.Name + '主服务未连接，请使用浏览器打开以下链接启动主服务'
              code = `http://127.0.0.1:${this.config.serverPort}/plugins/${k}/${v.CodePath}?address=127.0.0.1&port=${this.config.serverPort}&language=${this.config.language}&uuid=${v.UUID}`
          }
          if(!onlyCheck)this.log(msg, code)
      }
    }
    this.deckClient && this.deckClient.send('connectedMain', {connectedMain})
  }

  removeClient(client) {
    const index = this.clients.indexOf(client);
    if (index > -1) {
      this.clients.splice(index, 1);
    }
  }



  log(msg, code) {
    this.deckClient && this.deckClient.log(msg, code)
  }

  send(cmd, data, isMain) {
    let uuid = ''
    if(cmd === 'clear'){
      uuid = data.param[0].uuid
    }else{
      uuid = data.uuid
    }
    if(isMain){
      uuid = this.getMainUuid(uuid)
    }else{
      uuid = utils.encodeContext(data)
    }
    console.log('==uuid',uuid)
    console.log('==typeof uuid',this.clientList[uuid])
    console.log('==typeof data',data)
    this.clientList[uuid] && this.clientList[uuid].send(JSON.stringify({
      cmd,
      ...data
    }))
    
  }


  getMainUuid(uuid){
    const parts = uuid.split('.'); // 将字符串按 . 分割成数组
    return parts.slice(0, 4).join('.');
  }
}