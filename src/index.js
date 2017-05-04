/**
 * Created by xiangwenwen on 2017/3/27.
 */

// @flow

import dt_nuva from 'weex-dingtalk-require';
import weexInstanceVar from 'weex-dingtalk-polyfills';
import permissionJsApis from './core/permissionJsApis.js';
import { extend } from './shared/util.js';
import parseJsApis from './core/parseJsApis.js';
import initWebDingtalkSDK from './platforms/web/index.js';
import logger from './shared/logger.js';

let dingtalkJsApisConfig: ?Object = null;
let dingtalkQueue: ?Array<Function> = null;
let dingtalkErrorCb: ?Function = null;
let dingtalkInit: boolean = true;
let platform = weexInstanceVar.env.platform;

function performQueue (){
  if (dingtalkQueue && dingtalkQueue.length > 0){
    dingtalkQueue.forEach(function(task){
      task();
    });
    dingtalkQueue.length = 0;
  }
}

let dingtalkSDK: Object = {};
let dingtalk: {
  isSync: boolean,
  apis: Object,
  config: Function,
  init: Function,
  ready: Function,
  on: Function,
  off: Function,
  error: Function
} = {
  isSync: false,
  apis: {},
  config: function(config: Object){
    if (!config){
      logger.warn('config is undefined,you must configure Dingtalk parameters');
      return;
    }
    dingtalkJsApisConfig = config;
  },
  init: function(){
    // 初始化一次
    dingtalkQueue = [];
    dt_nuva.init();
    dt_nuva.ready(function(){
      dingtalk.isSync = true;
      dingtalk.apis = parseJsApis(dt_nuva.getModules ? dt_nuva.getModules : {});
      performQueue();
    });
  },
  ready: function(cb: Function){
    if (!cb || typeof cb !== 'function'){
      logger.warn('callback is undefined');
      return;
    }
    if (dingtalk.isSync){
      permissionJsApis(cb,dingtalkJsApisConfig,dingtalkErrorCb);
    } else {
      function bufferFunction(cb){
        return function(){
          permissionJsApis(cb,dingtalkJsApisConfig,dingtalkErrorCb);
        }
      }
      dingtalkQueue && dingtalkQueue.push(bufferFunction(cb));
    }
  },
  error: function(cb){
    if (typeof cb === 'function'){
      dingtalkErrorCb = cb;
    }
  },
  on: dt_nuva.on,
  off: dt_nuva.off
};

if (dingtalkInit){
  dingtalkInit = false;
  switch (platform){
    case 'Web':
        dingtalkSDK = initWebDingtalkSDK();
      break;
    default:
        dingtalkSDK = dingtalk;
        dingtalk.init();
      break
  }
}

export default dingtalkSDK;
