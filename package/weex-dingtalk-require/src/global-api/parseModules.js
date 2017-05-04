/**
 * Created by xiangwenwen on 2017/3/24.
 */

// @flow

import exec from 'weex-dingtalk-exec';
import { __nuva_define__ } from './system-modules.js';

export default function parseModules(map: Object){
  for (let name in map) {
    let methods = map[name];
    (function(_name, _methods) {
      __nuva_define__(_name, function(__nuva_require__, __nuva_exports__,__nuva_module__) {
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
        __nuva_module__.__nuva_exports__ = p;
      });
    })(name, methods);
  }
}
