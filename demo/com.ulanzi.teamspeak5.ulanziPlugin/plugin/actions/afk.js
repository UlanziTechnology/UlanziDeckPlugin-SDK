export default class AFK {
  constructor(context,$UD,$TeamSpeak) {
    this.$UD = $UD
    this.$TeamSpeak = $TeamSpeak
    this.context = context
    this.config = {}

    this.onActionEvents()
    this.setStateIcon()
  }

  onActionEvents() {
    this.$TeamSpeak.on('away',(newState) => {
      this.setStateIcon()
    })
  }


  add(){
    this.setStateIcon()
  }

  run(){
    console.log('=-----away run')
    // this.$TeamSpeak.globalData.away = !this.$TeamSpeak.globalData.away
    this.$TeamSpeak.send({ button: "afk", state: false })
    setTimeout(()=>{
      this.$TeamSpeak.send({ button: "afk", state: true })
    },300)
  }

  setActive(){
    this.setStateIcon()
  }


  async setParams(params){
    console.log('away setParams',params)
    this.config = {
      ...this.config,
      ...params
    }
  }


  setStateIcon(){
    const state = this.$TeamSpeak.globalData.away ? 1: 0
    this.$UD.setStateIcon(this.context,state)

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

    const state = this.$TeamSpeak.globalData.away ? 1: 0
    if(this.config.state != state){
      this.$UD.setStateIcon(this.context,state)
    }
  }


}