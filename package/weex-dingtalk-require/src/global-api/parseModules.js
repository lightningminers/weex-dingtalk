/**
 * Created by xiangwenwen on 2017/3/24.
 */

// @flow

import exec from 'weex-dingtalk-exec';
import { __ship_define__ } from './system-modules.js';

export default function parseModules(map: Object){
  for (let name in map) {
    let methods = map[name];
    (function(_name, _methods) {
      __ship_define__(_name, function(__ship_require__, __ship_exports__,__ship_module__) {
        let p = {};
        p._name = _name;
        for (let i in _methods) {
          let action = _methods[i];
          p[action] = (function(_action) {
            return function(params) {
              if (!params) {
                params = {};
              }
              let onSuccess = params.onSuccess;
              let onFail = params.onFail;
              delete params.onSuccess;
              delete params.onFail;
              delete params.onCancel;
              const config = {
                body: {
                  plugin: _name,
                  action: _action,
                  args: params
                },
                onSuccess: onSuccess,
                onFail: onFail
              };
              return exec(config);
            };
          })(action);
        };
        __ship_module__.__ship_exports__ = p;
      });
    })(name, methods);
  }
}
