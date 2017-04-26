
/* @flow */

import initNativeEvent from './nativeEvent.js';

function initWebDingtalkSDK () : Object {
  const GLOBALWINDOW:GLOBALWINDOW = (function(){
    return (function(){
      return window || this;
    })();
  })();
  if (!GLOBALWINDOW.dd){
    console.error('Not Found Dingtalk.js');
    throw new Error()
  }
  initNativeEvent(GLOBALWINDOW.dd);
  return GLOBALWINDOW.dd;
}

export default initWebDingtalkSDK;
