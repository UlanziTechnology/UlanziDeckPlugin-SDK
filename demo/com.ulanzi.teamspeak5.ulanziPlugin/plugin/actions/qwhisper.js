export default class QWhisper {
  constructor(context,$UD,$TeamSpeak) {
    this.$UD = $UD
    this.$TeamSpeak = $TeamSpeak
    this.context = context
    this.config = {
      qwhisper:false
    }

    this.onActionEvents()
    this.setStateIcon()
  }

  onActionEvents() {
    this.$TeamSpeak.on('buttonPress___qwhisper',(newState) => {
      console.warn('==qwhisper',newState)
      this.setStateIcon()
    })
  }


  add(){
    this.setStateIcon()
  }

  run(){
    console.warn('=-----qwhisper run',this.$TeamSpeak.globalData.buttonPress.qwhisper)

    this.$TeamSpeak.globalData.buttonPress.qwhisper = !this.$TeamSpeak.globalData.buttonPress.qwhisper
    this.$TeamSpeak.send({ button: "qwhisper", state: this.$TeamSpeak.globalData.buttonPress.qwhisper })
    
    // this.$TeamSpeak.globalData.buttonPress.qwhisper = !this.$TeamSpeak.globalData.buttonPress.qwhisper
    // this.$TeamSpeak.send({ button: "qwhisper", state: this.$TeamSpeak.globalData.buttonPress.qwhisper })

    // this.$TeamSpeak.globalData.qwhisper = !this.$TeamSpeak.globalData.qwhisper
    // this.$TeamSpeak.send({ button: "qwhisper", state: false })
    // setTimeout(()=>{
    //   this.$TeamSpeak.send({ button: "qwhisper", state: true })
    // },300)
  }

  setActive(){
    this.setStateIcon()
  }


  async setParams(params){
    console.warn('qwhisper setParams',params)
    this.config = {
      ...this.config,
      ...params
    }

  }


  setStateIcon(){
    console.warn('===setStateIcon this.$TeamSpeak.globalData.qwhisper:',this.$TeamSpeak.globalData.buttonPress.qwhisper)
    const state = this.$TeamSpeak.globalData.buttonPress.qwhisper ? 1: 0
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

    const state = this.$TeamSpeak.globalData.buttonPress.qwhisper ? 1: 0
    if(this.config.state != state){
      this.$UD.setStateIcon(this.context,state)
    }
  }

}