/* @flow */

// DingTalk
function initEnv() : Object{
  let weexEnv = {};
  if (typeof weex !== 'undefined'){
    weexEnv.platform = weex.config.env.platform;
    if (weexEnv.platform !== 'Web'){
      weexEnv.appName = weex.config.env.appName;
    }
  } else {
    // Rax Weex
    if (typeof callNative === 'function'){
      weexEnv.platform = navigator.platform;
      weexEnv.appName = navigator.appName;
    } else {
      // Rax Web
      weexEnv.platform = 'Web';
    }
  }
  if (weexEnv.platform === 'Web'){
    weexEnv.isDingtalk = /DingTalk/.test(navigator.userAgent);
  } else {
    weexEnv.isDingtalk = weexEnv.appName === 'DingTalk';
  }

  return weexEnv;
}

export default initEnv;
