/**
 * Created by xiangwenwen on 2017/3/27.
 */

//@flow

import dt_nuva from 'weex-dingtalk-require';

const runtimePermission: string = 'runtime.permission';

export default function permissionJsApis(cb: Function,jsApisConfig:?Object, errorCb: ?Function){
  if (!jsApisConfig){
    cb(null);
    return;
  }
  dt_nuva.ready(function(){
    const permission = dt_nuva.require(runtimePermission);
    let apisConf = jsApisConfig ? jsApisConfig : {};
    let errCb = errorCb ? errorCb : null;
    apisConf.onSuccess = function(response){
      cb(null, response);
    };
    apisConf.onFail = function(error){
      if (typeof errCb === 'function'){
        errCb(error);
      } else {
        cb(error, null);
      }
    };
    permission.requestJsApis(apisConf);
  });
}
