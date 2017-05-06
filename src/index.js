/**
 * Created by xiangwenwen on 2017/3/27.
 */

// @flow
import weexInstanceVar from 'weex-dingtalk-polyfills';
import initWebDingtalkSDK from './platforms/web/index.js';
import initWeexDingtalkSDK from './platforms/weex/index.js';
import logger from 'shared/logger.js';

let dingtalkInit: boolean = true;
let platform: string = weexInstanceVar.env.platform;
let isDingtalk: boolean = weexInstanceVar.env.isDingtalk;
let dingtalkSDK: Object = {};

if (!isDingtalk){
  logger.warn('can only open the page be Dingtalk Container');
}

if (dingtalkInit){
  dingtalkInit = false;
  switch (platform){
    case 'Web':
        dingtalkSDK = initWebDingtalkSDK();
      break;
    default:
        dingtalkSDK = initWeexDingtalkSDK();
      break
  }
  dingtalkSDK.init();
}

export default dingtalkSDK;
