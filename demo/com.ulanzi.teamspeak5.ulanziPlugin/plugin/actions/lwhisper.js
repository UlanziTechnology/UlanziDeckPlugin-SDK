export default class LWhisper {
  constructor(context,$UD,$TeamSpeak) {
    this.$UD = $UD
    this.$TeamSpeak = $TeamSpeak
    this.context = context
    this.config = {
      whisperlistName:'',
      lwhisper:false
    }

    this.setStateIcon()
  }

  onActionEvents() {
    this.$TeamSpeak.on('buttonPress___'+this.config.whisperlistName+'_lwhisper',(newState) => {
      console.warn('==lwhisper',newState)
      this.setStateIcon()
    })
  }


  add(){
    this.setStateIcon()
  }

  run(){
    console.warn('=-----lwhisper run',this.$TeamSpeak.globalData.buttonPress[this.config.whisperlistName+'_lwhisper'])

    if(!this.config.whisperlistName){
      this.$UD.toast('请输入密语列表名称')
      return;
    }
    this.config.lwhisper = !this.config.lwhisper
    this.$TeamSpeak.send({ button: this.config.whisperlistName+"_lwhisper", state:!this.config.lwhisper })


    
    
    // this.$TeamSpeak.globalData.buttonPress[this.config.whisperlistName+'.lwhisper'] = !this.$TeamSpeak.globalData.buttonPress[this.config.whisperlistName+'.lwhisper']
    // this.$TeamSpeak.send({ button: "lwhisper", state: this.$TeamSpeak.globalData.buttonPress[this.config.whisperlistName+'.lwhisper'] })

    // this.$TeamSpeak.globalData.lwhisper = !this.$TeamSpeak.globalData.lwhisper
    // this.$TeamSpeak.send({ button: "lwhisper", state: false })
    // setTimeout(()=>{
    //   this.$TeamSpeak.send({ button: "lwhisper", state: true })
    // },300)
  }

  setActive(){
    this.setStateIcon()
  }


  async setParams(params){
    console.warn('lwhisper setParams',params)
    if(this.config.whisperlistName && this.config.whisperlistName != params.whisperlistName){
      this.$TeamSpeak.off('buttonPress___'+this.config.whisperlistName+'_lwhisper')
      
      this.config = {
        ...this.config,
        ...params
      }

      this.onActionEvents()
    }else if(!this.config.whisperlistName){
      this.config = {
        ...this.config,
        ...params
      }

      this.onActionEvents()
    }



  }


  setStateIcon(){
    console.warn('===setStateIcon this.$TeamSpeak.globalData.lwhisper:',this.$TeamSpeak.globalData.buttonPress[this.config.whisperlistName+'_lwhisper'])
    const state = this.$TeamSpeak.globalData.buttonPress[this.config.whisperlistName+'_lwhisper'] ? 1: 0
    this.$UD.setStateIcon(this.context,state)


    console.warn('===this.config.connectState , this.$TeamSpeak.TeamSpeakConnectState',this.config.connectState , this.$TeamSpeak.TeamSpeakConnectState)
    if(this.config.connectState != this.$TeamSpeak.TeamSpeakConnectState){
      this.updatePluginParams({connectState:this.$TeamSpeak.TeamSpeakConnectState})
    }
  }

  updatePluginParams(params){
    if(!params) return 
    this.config = {
      ...this.config,
      ...params
    }
    this.$UD.sendParamFromPlugin(this.config,this.context)

    const state = this.$TeamSpeak.globalData.buttonPress[this.config.whisperlistName+'_lwhisper'] ? 1: 0
    if(this.config.state != state){
      this.$UD.setStateIcon(this.context,state)
    }
  }

}