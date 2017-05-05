/**
 * Created by xiangwenwen on 2017/3/27.
 */

// @flow


import weexInstanceVar from 'weex-dingtalk-polyfills';
import initWebDingtalkSDK from './platforms/web/index.js';
import initWeexDingtalkSDK from './platforms/weex/index.js';

let dingtalkInit: boolean = true;
let platform: string = weexInstanceVar.env.platform;
let dingtalkSDK: Object = {};

if (dingtalkInit){
  dingtalkInit = false;
  switch (platform){
    case 'Web':
        dingtalkSDK = initWebDingtalkSDK();
      break;
    default:
        // default weex env SDK
        dingtalkSDK = initWeexDingtalkSDK();
        dingtalkSDK.init();
      break
  }
}

export default dingtalkSDK;
