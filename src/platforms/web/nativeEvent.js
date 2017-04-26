
function initNativeEvent(dt:Object){
  dt.on = document.addEventListener;
  dt.off = document.removeEventListener;
}

export default initNativeEvent;
