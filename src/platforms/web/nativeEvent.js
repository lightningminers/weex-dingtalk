
/* @flow */

function initNativeEvent(dt:Object){
  dt.on = function(type, listener, useCapture){
    document.addEventListener(type, listener, useCapture);
  }
  dt.off = function(type, listener, useCapture){
    document.removeEventListener(type, listener, useCapture);
  }
}

export default initNativeEvent;
