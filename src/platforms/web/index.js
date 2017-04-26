
/* @flow */

import initNativeEvent from './nativeEvent.js';
import initApis from './apis.js';

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
  initApis(GLOBALWINDOW.dd);
  return GLOBALWINDOW.dd;
}

export default initWebDingtalkSDK;
