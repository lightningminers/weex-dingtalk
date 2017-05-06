/* @flow */

import ship from 'weex-dingtalk-require';
import { extend } from 'shared/util.js';
import logger from 'shared/logger.js';
import parseJsApis from 'core/parseJsApis.js';
import permissionJsApis from 'core/permissionJsApis.js';

let dingtalkJsApisConfig: ?Object = null;
let dingtalkQueue: ?Array<Function> = null;
let dingtalkErrorCb: ?Function = null;

function performQueue (){
  if (dingtalkQueue && dingtalkQueue.length > 0){
    dingtalkQueue.forEach(function(task){
      task();
    });
    dingtalkQueue.length = 0;
  }
}

function initWeexDingtalkSDK() : Object{
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
      ship.init();
      ship.ready(function(){
        dingtalk.isSync = true;
        dingtalk.apis = parseJsApis(ship.getModules ? ship.getModules : {});
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
    on: ship.on,
    off: ship.off
  };
  return dingtalk;
}

export default initWeexDingtalkSDK;
