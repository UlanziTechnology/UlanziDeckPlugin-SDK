

function AnalogClock(ctx) {
  var context = ctx,
      clockTimer = 0,
      clock = null,
      clockface = clockfaces[0],
      currentClockFaceIdx = 0,
      origContext = ctx,
      canvas = null,
      demo = false,
      count = Math.floor(Math.random() * Math.floor(10)),
      allowSend = true, // 是否可以发送消息（上位机的绝对控制
      type = 'analog';




  function isDemo() {
      return demo;
  }

  function createClock(settings) {
      canvas = document.createElement('canvas');
      canvas.width = 144;
      canvas.height = 144;
      clock = new Clock(canvas);
      clock.setColors(clockface.colors);
      clock.type = type;
      toggleClock();
  }

  function toggleClock() {

      if(clockTimer === 0) {
          clockTimer = setInterval(function(sx) {

              if(demo) {
                  let c = -1;
                  if(count % 21 == 6) {
                      c = 0;
                  } else if(count % 21 === 3) {
                      c = 1;
                  } else if(count % 21 === 9) {
                      c = 2;
                  } else if(count % 21 === 12) {
                      c = 3;
                  } else if(count % 21 === 15) {
                      c = 4;
                  } else if(count % 21 === 18) {
                      c = 5;
                  }

                  if(c !== -1) {
                      setClockFaceNum(c, demo);
                  } else {
                      drawClock();
                  }
              } else {
                  drawClock();
              }

              count++;
          }, 1000);
      } else {
          window.clearInterval(clockTimer);
          clockTimer = 0;
      }
  }

  function drawClock(jsn) {
      clock.drawClock();
      // clockface.text === true && $SD.api.setTitle(context, new Date().toLocaleTimeString(), null);
      // $SD.api.setImage(
      //     context,
      //     clock.getImageData()
      // );

      setIcon()
  }

  function setActive(active) {
    if(active && active.toString() === "true"){
      allowSend = true
      setIcon()
    }else{
      setIcon()
      allowSend = false
    }
  }

  function setIcon() {
    const text = new Date().toLocaleTimeString()
    const icon = clock.getImageData()
    if(!allowSend) return

    $UD.setBaseDataIcon(context, icon ,text)

  }

  function setClockFace(newClockFace, isDemo) {
      clockface = newClockFace;
      demo = clockface.demo || isDemo;
      clock.setColors(clockface.colors);
      // clockface.text !== true && $SD.api.setTitle(context, '', null);
      drawClock();
  }

  function setClockFaceNum(idx, isDemo) {
      currentClockFaceIdx = idx < clockfaces.length ? idx : 0;
      this.currentClockFaceIdx = currentClockFaceIdx;
      setClockFace(clockfaces[currentClockFaceIdx], isDemo);
  }

  function setClockType(type) {
      clock.type = type;
      this.drawClock();
  }

  function getClockType() {
      clock.type;
  }

  function destroyClock() {
      if(clockTimer !== 0) {
          window.clearInterval(clockTimer);
          clockTimer = 0;
      }
  }

  createClock();

  return {
      clock: clock,
      clockTimer: clockTimer,
      clockface: clockface,
      currentClockFaceIdx: currentClockFaceIdx,
      name: name,
      drawClock: drawClock,
      toggleClock: toggleClock,
      origContext: origContext,
      setClockFace: setClockFace,
      setClockFaceNum: setClockFaceNum,
      destroyClock: destroyClock,
      demo: demo,
      isDemo: isDemo,
      setClockType: setClockType,
      getClockType: getClockType,
      setActive:setActive
  };
}
