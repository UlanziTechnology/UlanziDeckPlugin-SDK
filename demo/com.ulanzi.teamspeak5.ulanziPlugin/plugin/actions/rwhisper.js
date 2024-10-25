export default class RWhisper {
  constructor(context,$UD,$TeamSpeak) {
    this.$UD = $UD
    this.$TeamSpeak = $TeamSpeak
    this.context = context
    this.config = {
      rwhisper:false
    }

    this.onActionEvents()
    this.setStateIcon()
  }

  onActionEvents() {
    this.$TeamSpeak.on('buttonPress___rwhisper',(newState) => {
      console.warn('==rwhisper',newState)
      this.setStateIcon()
    })
  }


  add(){
    this.setStateIcon()
  }

  run(){
    console.warn('=-----rwhisper run',this.$TeamSpeak.globalData.buttonPress.rwhisper)

    // this.config.rwhisper = !this.config.rwhisper
    // this.$TeamSpeak.send({ button: "rwhisper", state:this.config.rwhisper })
    
    this.$TeamSpeak.globalData.buttonPress.rwhisper = !this.$TeamSpeak.globalData.buttonPress.rwhisper
    this.$TeamSpeak.send({ button: "rwhisper", state: this.$TeamSpeak.globalData.buttonPress.rwhisper })
    
    
    // this.$TeamSpeak.globalData.buttonPress.rwhisper = !this.$TeamSpeak.globalData.buttonPress.rwhisper
    // this.$TeamSpeak.send({ button: "rwhisper", state: this.$TeamSpeak.globalData.buttonPress.rwhisper })

    // this.$TeamSpeak.globalData.rwhisper = !this.$TeamSpeak.globalData.rwhisper
    // this.$TeamSpeak.send({ button: "rwhisper", state: false })
    // setTimeout(()=>{
    //   this.$TeamSpeak.send({ button: "rwhisper", state: true })
    // },300)
  }

  setActive(){
    this.setStateIcon()
  }


  async setParams(params){
    console.warn('rwhisper setParams',params)
    this.config = {
      ...this.config,
      ...params
    }

  }


  setStateIcon(){
    console.warn('===setStateIcon this.$TeamSpeak.globalData.rwhisper:',this.$TeamSpeak.globalData.buttonPress.rwhisper)
    const state = this.$TeamSpeak.globalData.buttonPress.rwhisper ? 1: 0
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

    const state = this.$TeamSpeak.globalData.buttonPress.rwhisper ? 1: 0
    if(this.config.state != state){
      this.$UD.setStateIcon(this.context,state)
    }
  }

}