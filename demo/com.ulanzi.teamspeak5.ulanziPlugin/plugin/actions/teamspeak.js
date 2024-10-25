
import fs from 'fs';
import WebSocket from 'ws';
import EventEmitter from 'events';

export default class TeamSpeakPlugin extends EventEmitter {
  constructor() {
    super();

    this.TeamSpeakWebsocket = null;
    this.TeamSpeakConnectState = 'disconnected';  // 'connecting' | 'connected' | 'disconnected'
    this.userList = {};
    this.globalData = {
      inputMuted:false,
      outputMuted:false,
      away:false,
      inputDeactivated:false,
      buttonPress:{
        qwhisper:false,
        rwhisper:false,

      }
    };
    this.talkingUserList = {};
    this.baseImgCache = new Map();

    this.apiKey = ''


    this.createTeamSpeakSocket();
  }

  get localApiKey(){
    if(!this.apiKey){
      try {
        // 读取文件
        this.apiKey = fs.readFileSync('teamspeak_api_key.txt', 'utf8') || '';
    
        console.log('文件内容:', this.apiKey);
      } catch (err) {
        console.error('读取文件时出错: ', err);
      }
    }
    return this.apiKey;
  }

  set localApiKey(value){
    this.apiKey = value
    try {
        // 同步写入文件
        fs.writeFileSync('teamspeak_api_key.txt', value);
    
        console.log('文件写入成功');
    } catch (err) {
        console.error('写入文件时出错: ', err);
    }
  }

  createTeamSpeakSocket(){
    console.log('==eamSpeak== createTeamSpeakSocket')
    if (this.TeamSpeakConnectState == 'disconnected') {
    console.log('==eamSpeak in== createTeamSpeakSocket')

      this.TeamSpeakWebsocket = new WebSocket("ws://127.0.0.1:5899");
      this.TeamSpeakWebsocket.onopen = () => {
        this.TeamSpeakConnectState = 'connecting';
        this.emit('connecting');
        console.warn("TeamSpeak -- Connecting: ");
        this.TeamSpeakWebsocket.send(
          JSON.stringify({
            type: "auth",
            payload: {
                identifier: "com.ulanzi.ulanzideck.teamspeak5",
                version: "1.0.0",
                name: "Ulanzi Deck Plugin",
                description: "Ulanzi Deck Plugin",
                content: {
                  apiKey:  this.localApiKey, 
                },
            },
          })
        );
      };


      this.TeamSpeakWebsocket.onmessage = async (event) => {
        const paramsTags = ["inputMuted", "outputMuted", "away", "inputDeactivated"]
        const data = JSON.parse(event.data);
        console.warn('=====TeamSpeak onmessage:',event.data);
        if (data.status && data.status.code !== 0) {
          console.warn("TeamSpeak -- Error msg: ");
          console.warn(data.status.message);
          this.TeamSpeakConnectState = 'disconnected';
          this.emit('disconnected');
          return;
        }
        if (data.type === "auth") {
          console.warn("TeamSpeak -- connected: ");
          this.TeamSpeakConnectState = 'connected';
          this.emit('connected');

          this.localApiKey = data.payload.apiKey;

          if (data.payload.connections.length != 0) {
            data.payload.connections.forEach((connection) => {
              connection.clientInfos.forEach(async (element) => {
                this.saveUserInfo(connection.id,element.id, element.properties.nickname, element.properties.myteamspeakAvatar)
                if(element.id === connection.clientId){
                  paramsTags.map((key)=>{
                    this.globalData[key] = element.properties[key];
                  })
                }
              });
            });
            console.log('==this.userList',this.userList,this.globalData)
          }
        } else if (data.type === "clientSelfPropertyUpdated") {
          console.warn("TeamSpeak -- clientSelfPropertyUpdated: ",data.payload.flag);
          if (paramsTags.indexOf(data.payload.flag) != -1) {
            console.warn("TeamSpeak -- clientSelfPropertyUpdated in: ",data.payload.flag);
            this.globalData[data.payload.flag] = data.payload.newValue;
            this.emit(data.payload.flag,data.payload.newValue)
          }
        } else if (data.type === "talkStatusChanged") {

          const cId = data.payload.connectionId + '___' + data.payload.clientId;
          if (data.payload.status === 1) {
            console.log('===this.userList[cId]',this.userList[cId])
            this.talkingUserList[cId] = this.userList[cId].avatar
          }else{
            delete this.talkingUserList[cId];
          }
          let list = []
          for (const k in this.talkingUserList){
            list.push(this.talkingUserList[k])
          }
          this.globalData.talkingUsers = list
          console.warn('==this.talkingUserList',JSON.stringify(this.talkingUserList))
          console.warn('==this.globalData',JSON.stringify(this.globalData))
          this.emit('talkinguser',list)
          

        } else if (data.type === "clientMoved") {
          if (
            data.payload.oldChannelId == "0" &&
            data.payload.properties !== null
          ) {
            this.saveUserInfo(data.payload.connectionId, data.payload.clientId, data.payload.properties.nickname, data.payload.properties.myteamspeakAvatar)
          }else{
            delete this.userList[data.payload.connectionId +'___'+ data.payload.clientId]
          }
        } else if (data.type === 'buttonPress'){
          this.globalData.buttonPress[data.payload.button] = data.payload.state;
          this.emit('buttonPress___'+data.payload.button,data.payload.state)
        }
      }


       // Error handling if connection could not be opend
       this.TeamSpeakWebsocket.onerror = (err) => {
        console.warn("TeamSpeak -- Error: ", err.data);
        this.TeamSpeakConnectState = 'disconnected';
        this.emit('disconnected');

      };

      // Reconnect if the connection is closed
      this.TeamSpeakWebsocket.onclose = (event) => {
        console.warn("TeamSpeak -- Disconnected: ", event.data); //TODO remove users from overlay when closing client
        this.TeamSpeakConnectState = 'disconnected';
        this.emit('disconnected');

        this.reconnectTeamSpeak();
      };
 




    } 
  }

  async saveUserInfo(connectionId, clientId, nickname, avatarStr){
    this.userList[connectionId +'___'+ clientId] = {};
    this.userList[connectionId +'___'+ clientId].user = nickname;
    const avatar = avatarStr
            .split(";")
            .sort(
              (a, b) =>
                ["2", "3", "4", "1"].indexOf(a[0]) -
                ["2", "3", "4", "1"].indexOf(b[0])
            )[0]
            .split(",")[1];
            
    this.userList[connectionId +'___'+ clientId].avatar = avatar;
    // this.userList[connectionId +'___'+ clientId].avatarImage = avatar && await this.loadImagePromise(avatar) || '';

    console.warn('==this.userList',this.userList)
  }
  
  loadImagePromise(url){
		return new Promise(resolve => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.src = url;
		});
	}



  async reconnectTeamSpeak (){
    await new Promise((r) => setTimeout(r, 5000));
    console.warn("TeamSpeak -- Trying to reconnect: ");
    this.createTeamSpeakSocket();
  }


  send(payload){
    if (this.TeamSpeakConnectState != 'connected') {
      return;
    }
    this.TeamSpeakWebsocket.send(
      JSON.stringify({
        type: "buttonPress",
        payload: payload,
      })
    );
  }




}