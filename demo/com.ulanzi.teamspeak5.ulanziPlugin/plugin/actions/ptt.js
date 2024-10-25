export default class PTT {
  constructor(context,$UD,$TeamSpeak) {
    this.$UD = $UD
    this.$TeamSpeak = $TeamSpeak
    this.context = context
    this.config = {
      ptt:false
    }

    this.onActionEvents()
    this.setStateIcon()
  }

  onActionEvents() {
    this.$TeamSpeak.on('inputDeactivated',(newState) => {
      console.warn('==ptt',newState)
      this.setStateIcon()
    })
  }


  add(){
    this.setStateIcon()
  }

  run(){
    console.warn('=-----ptt run',this.$TeamSpeak.globalData.inputDeactivated)

    this.config.ptt = !this.config.ptt
    this.$TeamSpeak.send({ button: "ptt", state:this.config.ptt })
    
    // this.$TeamSpeak.globalData.inputDeactivated = !this.$TeamSpeak.globalData.inputDeactivated
    // this.$TeamSpeak.send({ button: "ptt", state: this.$TeamSpeak.globalData.inputDeactivated })

    // this.$TeamSpeak.globalData.ptt = !this.$TeamSpeak.globalData.ptt
    // this.$TeamSpeak.send({ button: "ptt", state: false })
    // setTimeout(()=>{
    //   this.$TeamSpeak.send({ button: "ptt", state: true })
    // },300)
  }

  setActive(){
    this.setStateIcon()
  }


  async setParams(params){
    console.warn('ptt setParams',params)
    this.config = {
      ...this.config,
      ...params
    }

  }


  setStateIcon(){
    console.warn('===setStateIcon this.$TeamSpeak.globalData.ptt:',this.$TeamSpeak.globalData.inputDeactivated)
    const state = this.$TeamSpeak.globalData.inputDeactivated ? 0: 1
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

    const state = this.$TeamSpeak.globalData.inputDeactivated ? 0: 1
    if(this.config.state != state){
      this.$UD.setStateIcon(this.context,state)
    }
  }

}