/* @flow */

function initEnv() : Object{
  let weexEnv = {};
  if (typeof weex !== 'undefined'){
    weexEnv.platform = weex.config.env.platform;
  } else {
    // Rax Weex
    if (typeof callNative === 'function'){
      weexEnv.platform = navigator.platform;
    } else {
      // Rax Web
      weexEnv.platform = 'Web';
    }
  }
  return weexEnv;
}

export default initEnv;
