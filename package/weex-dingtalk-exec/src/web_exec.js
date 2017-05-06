/* @flow */

import weexInstanceVar from 'weex-dingtalk-polyfills';

let platform = weexInstanceVar.env.platform;
let isAndroid = null;
let isIOS = null;

if (platform === 'Web'){
  const UA = window.navigator.userAgent.toLowerCase();
  isAndroid = UA && UA.indexOf('android') > -1;
  isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
}

function ios_exec(config:Object){
  const webViewJavascriptBridge = window._WebViewJavascriptBridge;
  if (!webViewJavascriptBridge){
    throw 'runtime and bridge are not ready';
  }
  const { body, onSuccess, onFail, context } = config;
  webViewJavascriptBridge.callHandler('exec',body,function(response){
    if (typeof response !== 'undefined'){
      if ('0' === response.errorCode){
        typeof onSuccess === 'function' && onSuccess.call(context,response.result);
      } else {
        typeof onFail === 'function' && onFail.call(context,response.result);
      }
    }
    typeof onFail === 'function' && onFail.call('-1','');
  });
}

function android_exec(config:Object){
  const webViewJavascriptBridge = window.WebViewJavascriptBridge;
  if (!webViewJavascriptBridge){
    throw 'runtime and bridge are not ready';
  }
  let { body, onSuccess, onFail, context } = config;
  let { plugin, action, args } = body;
  if (plugin && 'function' === typeof plugin && action && 'function' === typeof action) {
    const t1 = plugin;
    const t2 = action;
    plugin = args;
    action = onSuccess;
    args = onFail;
    onSuccess = t1;
    onFail = t2;
  }
  if (plugin && 'string' === typeof plugin && action && 'string' === typeof action) {
    if (args && 'function' === typeof args) {
      context = onFail;
      onFail = onSuccess;
      onSuccess = args;
      args = {};
    }
  }
  const api = plugin + '.' + action;
  const jsonArgs = JSON.stringify(args);
  const callbackId = callback.register({
    onSuccess: onSuccess,
    onFail: onFail,
    context: context,
  });
  webViewJavascriptBridge.callHandler(api, jsonArgs, callbackId);
}

const STATUS_NO_RESULT:string = '0';
const STATUS_OK:string = '1';
const STATUS_ERROR:string = '2';

let _callbackId:number = 0;
let _handlers:Object = {};

function register(handler: Object){
  _callbackId++;
	_handlers[_callbackId] = handler;
	return _callbackId;
}

function dispatch(callbackId: number, result: Object){
  const handler = _handlers[callbackId];
	if (handler) {
  	if (!result || !result.__keep__) {
  		delete _handlers[callbackId];
  	}
  	if (result && result.__status__) {
  		const status = result.__status__;
  		const message = result.__message__;
  		if (STATUS_OK === status && typeof handler.onSuccess === 'function') {
  			handler.onSuccess.call(handler.context, message);
  		} else if (STATUS_ERROR === status && typeof handler.onFail === 'function') {
  			handler.onFail.call(handler.context, message);
  		}
  	}
	}
}

export default function web_exec(config:Object){
  if (isIOS){
    ios_exec(config);
  } else if (isAndroid) {
    android_exec(config);
  } 
}
