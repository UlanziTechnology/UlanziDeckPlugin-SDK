export default class MicMute {
  constructor(context,$UD,$TeamSpeak) {
    this.$UD = $UD
    this.$TeamSpeak = $TeamSpeak
    this.context = context
    this.config = {}

    this.onActionEvents()
    this.setStateIcon()
  }

  onActionEvents() {
    this.$TeamSpeak.on('inputMuted',(newState) => {
      console.warn('==inputMuted',newState)
      this.setStateIcon()
    })
  }


  add(){
    this.setStateIcon()
  }

  run(){
    console.warn('=-----inputMuted run',this.$TeamSpeak.globalData.inputMuted)
    // this.$TeamSpeak.globalData.inputMuted = !this.$TeamSpeak.globalData.inputMuted
    this.$TeamSpeak.send({ button: "micmute", state: false })
    setTimeout(()=>{
      this.$TeamSpeak.send({ button: "micmute", state: true })
    },300)
  }

  setActive(){
    this.setStateIcon()
  }


  async setParams(params){
    console.warn('inputMuted setParams',params)
    this.config = {
      ...this.config,
      ...params
    }

  }


  setStateIcon(){
    console.warn('===setStateIcon this.$TeamSpeak.globalData.inputMuted:',this.$TeamSpeak.globalData.inputMuted)
    const state = this.$TeamSpeak.globalData.inputMuted ? 1: 0
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

    const state = this.$TeamSpeak.globalData.inputMuted ? 1: 0
    if(this.config.state != state){
      this.$UD.setStateIcon(this.context,state)
    }
  }

}