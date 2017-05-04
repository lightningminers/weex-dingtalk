/* @flow */

function initEnv() : Object{
  let weexEnv = {};
  if (typeof weex !== 'undefined'){
    weexEnv.platform = weex.config.env.platform;
    if (weexEnv.platform !== 'Web'){
      weexEnv.dingtalk = {
        bundleUrl: weex.config.bundleUrl,
        originalUrl: weex.config.originalUrl
      };
    }
  } else {
    // Rax Weex
    if (typeof callNative === 'function'){
      weexEnv.platform = navigator.platform;
      weexEnv.dingtalk = {
        bundleUrl: __weex_options__.bundleUrl,
        originalUrl: __weex_options__.originalUrl
      };
    } else {
      // Rax Web
      weexEnv.platform = 'Web';
    }
  }
  return weexEnv;
}

export default initEnv;
