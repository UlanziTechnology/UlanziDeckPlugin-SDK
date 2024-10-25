export default class PTM {
  constructor(context,$UD,$TeamSpeak) {
    this.$UD = $UD
    this.$TeamSpeak = $TeamSpeak
    this.context = context
    this.config = {
      ptm:false
    }

    this.onActionEvents()
    this.setStateIcon()
  }

  onActionEvents() {
    this.$TeamSpeak.on('inputDeactivated',(newState) => {
      console.warn('==ptm',newState)
      this.setStateIcon()
    })
  }


  add(){
    this.setStateIcon()
  }

  run(){
    console.warn('=-----ptm run',this.$TeamSpeak.globalData.inputDeactivated)
    this.config.ptm = !this.config.ptm
    this.$TeamSpeak.send({ button: "ptm", state: this.config.ptm })

    // this.$TeamSpeak.send({ button: "ptm", state: false })
    // setTimeout(()=>{
    //   this.$TeamSpeak.send({ button: "ptm", state: true })
    // },300)
  }

  setActive(){
    this.setStateIcon()
  }


  async setParams(params){
    console.warn('ptm setParams',params)
    this.config = {
      ...this.config,
      ...params
    }

  }


  setStateIcon(){
    console.warn('===setStateIcon this.$TeamSpeak.globalData.ptm:',this.$TeamSpeak.globalData.inputDeactivated)
    const state = this.$TeamSpeak.globalData.inputDeactivated ? 1: 0
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

    const state = this.$TeamSpeak.globalData.inputDeactivated ? 1: 0
    if(this.config.state != state){
      this.$UD.setStateIcon(this.context,state)
    }
  }

}