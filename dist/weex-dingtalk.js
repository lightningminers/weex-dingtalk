'use strict';

function initEnv() {
  var weexEnv = {};
  if (typeof weex !== 'undefined') {
    weexEnv.platform = weex.config.env.platform;
  } else {
    // Rax Weex
    if (typeof callNative === 'function') {
      weexEnv.platform = navigator.platform;
    } else {
      // Rax Web
      weexEnv.platform = 'Web';
    }
  }
  return weexEnv;
}

function initRequireModule() {
  var requireModule = function requireModule(name) {
    var moduleName = '@weex-module/' + name;
    return __weex_require__(moduleName);
  };
  if (typeof weex !== 'undefined') {
    requireModule = weex.requireModule;
  }
  return requireModule;
}

function polyfills() {
  var weexVar = {
    env: initEnv(),
    requireModule: initRequireModule()
  };
  return weexVar;
}

var weexInstanceVar = void 0;
if (!weexInstanceVar) {
  weexInstanceVar = polyfills();
}

var weexInstanceVar$1 = weexInstanceVar;

function initNativeEvent(dt) {
  dt.on = function (type, listener, useCapture) {
    document.addEventListener(type, listener, useCapture);
  };
  dt.off = function (type, listener, useCapture) {
    document.removeEventListener(type, listener, useCapture);
  };
}

function initApis(dt) {
  dt.apis = dt;
}

function initWebDingtalkSDK() {
  var GLOBALWINDOW = function () {
    return function () {
      return window || this;
    }();
  }();
  if (!GLOBALWINDOW.dd) {
    console.error('Not Found Dingtalk.js');
    throw new Error();
  }
  initNativeEvent(GLOBALWINDOW.dd);
  initApis(GLOBALWINDOW.dd);
  return GLOBALWINDOW.dd;
}

/**
 * Created by xiangwenwen on 2017/3/24.
 */

function android_exec(exec, config) {
  var body = config.body;
  var win = config.onSuccess;
  var fail = config.onFail;
  var context = config.context;
  var STATUS_NO_RESULT = '0';
  var STATUS_OK = '1';
  var STATUS_ERROR = '2';
  if (exec && typeof exec === 'function') {
    exec(body, function (response) {
      if (typeof response !== "undefined" && response.__status__) {
        var status = response.__status__;
        var message = response.__message__;
        if (STATUS_OK === status) {
          win && win.call(context, message);
        } else if (STATUS_ERROR === status) {
          fail && fail.call(context, message);
        }
      } else {
        fail && fail.call('-1', "");
      }
    });
  } else {
    fail && fail.call('-1', "");
  }
}

/**
 * Created by xiangwenwen on 2017/3/24.
 */

function ios_exec(exec, config) {
  var body = config.body;
  var win = config.onSuccess;
  var fail = config.onFail;
  var context = config.context;
  if (exec && typeof exec === 'function') {
    exec(body, function (response) {
      if (typeof response !== "undefined") {
        if ('0' === response.errorCode) {
          win && win.call(context, response.result);
        } else {
          fail && fail.call(context, response.result);
        }
      } else {
        fail && fail.call('-1', "");
      }
    });
  } else {
    fail && fail.call('-1', "");
  }
}

/**
 * Created by xiangwenwen on 2017/3/24.
 */

var platform$2 = weexInstanceVar$1.env.platform;
var nativeExec = null;
if (platform$2 !== 'Web') {
  nativeExec = weexInstanceVar$1.requireModule('nuvajs-exec').exec;
}

function exec(config) {
  var native_exec = nativeExec ? nativeExec : function () {};
  if (platform$2 === 'iOS') {
    ios_exec(native_exec, config);
  } else {
    if (platform$2 === 'android') {
      android_exec(native_exec, config);
    }
  }
}

/**
 * Created by xiangwenwen on 2017/3/24.
 */

var __ship_modules__ = {};
var requireStack = [];
var inProgressModules = {};

function build(__ship_module__) {
  var factory = __ship_module__.factory;
  __ship_module__.__ship_exports__ = {};
  delete __ship_module__.factory;
  factory(__ship_require__, __ship_module__.__ship_exports__, __ship_module__);
  return __ship_module__.__ship_exports__;
}
function __ship_require__(id) {
  if (!__ship_modules__[id]) {
    throw '__ship_module__ ' + id + ' not found';
  } else if (id in inProgressModules) {
    var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
    throw 'Cycle in require graph: ' + cycle;
  }
  if (__ship_modules__[id].factory) {
    try {
      inProgressModules[id] = requireStack.length;
      requireStack.push(id);
      return build(__ship_modules__[id]);
    } finally {
      delete inProgressModules[id];
      requireStack.pop();
    }
  }
  return __ship_modules__[id].__ship_exports__;
}

function __ship_define__(id, factory) {
  if (__ship_modules__[id]) {
    throw 'module ' + id + ' already defined';
  }
  __ship_modules__[id] = {
    id: id,
    factory: factory
  };
}

/**
 * Created by xiangwenwen on 2017/3/24.
 */

var cat = {};
var EventEmitter = {
  on: function on(event, fun) {
    var cbs = cat[event];
    cbs ? cbs.push(fun) : cat[event] = [];
    if (!cbs) {
      cat[event].push(fun);
    }
  },
  off: function off(event, fun) {
    var cbs = cat[event];
    if (!cbs) {
      return false;
    }
    if (!event && !fun) {
      cat = {};
      return true;
    }
    if (event && !fun) {
      cat[event] = null;
      return true;
    }
    var cb = void 0;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fun || cb.fun === fun) {
        cbs.splice(i, 1);
        break;
      }
    }
    return true;
  },
  once: function once(event, fun) {
    function _on() {
      EventEmitter.off(event, _on);
      fun.apply(this, arguments);
    }
    _on.fun = fun;
    EventEmitter.on(event, _on);
  },
  emit: function emit(event) {
    var isString = typeof event === 'string';
    if (!isString) {
      return;
    }
    var cbs = cat[event];
    var args = toArray(arguments, 1);
    if (cbs) {
      var i = 0;
      var j = cbs.length;
      for (; i < j; i++) {
        var cb = cbs[i];
        cb.apply(this, args);
      }
    }
  }
};

function toArray(list, index) {
  var _index = index || 0;
  var i = list.length - _index;
  var _array = new Array(i);
  while (i--) {
    _array[i] = list[i + _index];
  }
  return _array;
}

/**
 * Created by xiangwenwen on 2017/3/24.
 */

function parseModules(map) {
  for (var name in map) {
    var methods = map[name];
    (function (_name, _methods) {
      __ship_define__(_name, function (__ship_require__$$1, __ship_exports__, __ship_module__) {
        var p = {};
        p._name = _name;
        for (var i in _methods) {
          var action = _methods[i];
          p[action] = function (_action) {
            return function (params) {
              if (!params) {
                params = {};
              }
              var onSuccess = params.onSuccess;
              var onFail = params.onFail;
              delete params.onSuccess;
              delete params.onFail;
              delete params.onCancel;
              var config = {
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
          }(action);
        }
        __ship_module__.__ship_exports__ = p;
      });
    })(name, methods);
  }
}

/**
 * Created by xiangwenwen on 2017/3/24.
 */

var platform$1 = weexInstanceVar$1.env.platform;
var globalEvent = {};
if (platform$1 !== 'Web') {
  globalEvent = weexInstanceVar$1.requireModule('globalEvent');
}

function rtFunc(method) {
  return function (cb) {
    var config = {
      body: {
        plugin: 'runtime',
        action: method,
        args: {}
      },
      onSuccess: function onSuccess(response) {
        if (typeof cb === 'function') {
          cb(response);
        }
      },
      onFail: function onFail() {},
      context: null
    };
    exec(config);
  };
}

function initDingtalkRequire(cb) {
  rtFunc('getModules')(cb);
}

var ship = {
  getModules: null,
  isReady: false,
  define: __ship_define__,
  require: function require(id) {
    if (!id) {
      return exec;
    } else {
      return __ship_require__(id);
    }
  },
  runtime: {
    info: rtFunc('info'),
    _interceptBackButton: rtFunc('interceptBackButton'),
    _interceptNavTitle: rtFunc('interceptNavTitle'),
    _recoverNavTitle: rtFunc('recoverNavTitle'),
    _getModules: rtFunc('getModules')
  },
  init: function init() {
    initDingtalkRequire(function (response) {
      if (response) {
        parseModules(response);
        ship.isReady = true;
        ship.getModules = response;
        EventEmitter.emit('__ship_ready__');
      }
    });
  },
  ready: function ready(cb) {
    if (ship.isReady) {
      if (typeof cb === 'function') {
        cb();
      }
    } else {
      if (typeof cb === 'function') {
        EventEmitter.once('__ship_ready__', function () {
          cb();
        });
      }
    }
  },
  on: function on(type, handler) {
    globalEvent.addEventListener(type, function (e) {
      var event = {
        preventDefault: function preventDefault() {
          console.warn('当前环境不支持 preventDefault');
        },
        detail: e
      };
      handler.call(this, event);
    });
  },
  off: globalEvent.removeEventListener,
  EventEmitter: EventEmitter
};

var logger = {
  warn: function warn(msg, e) {
    console.warn('[DINGTALK JS SDK Warning]:', msg);
    if (e) {
      throw e;
    } else {
      var warning = new Error('WARNING STACK TRACE');
      console.warn(warning.stack);
    }
  },
  info: function info(msg) {
    console.info('[DINGTALK JS SDK INFO]:', msg);
  },
  error: function error(msg) {
    console.error('[DINGTALK JS SDK ERROR]:', msg);
  }
};

/**
 * Created by xiangwenwen on 2017/3/27.
 */

function parseJsApis(jsApis) {
  var apis = {};
  for (var name in jsApis) {
    var node = name.split('.');
    var staging = null;
    var i = 0;
    var j = node.length;
    while (true) {
      if (!staging) {
        if (1 === j) {
          apis[node[i]] = ship.require(name);
          break;
        }
        if (apis[node[i]]) {
          staging = apis[node[i]];
          i++;
          continue;
        }
        apis[node[i]] = {};
        staging = apis[node[i]];
        i++;
        continue;
      } else {
        if (j - 1 === i) {
          staging[node[i]] = ship.require(name);
          break;
        }
        if (staging[node[i]]) {
          i++;
          continue;
        }
        staging[node[i]] = {};
        staging = staging[node[i]];
      }
      i++;
    }
  }
  return apis;
}

/**
 * Created by xiangwenwen on 2017/3/27.
 */

var runtimePermission = 'runtime.permission';

function permissionJsApis(cb, jsApisConfig, errorCb) {
  if (!jsApisConfig) {
    cb(null);
    return;
  }
  ship.ready(function () {
    var permission = ship.require(runtimePermission);
    var apisConf = jsApisConfig ? jsApisConfig : {};
    var errCb = errorCb ? errorCb : null;
    apisConf.onSuccess = function (response) {
      cb(null, response);
    };
    apisConf.onFail = function (error) {
      if (typeof errCb === 'function') {
        errCb(error);
      } else {
        cb(error, null);
      }
    };
    permission.requestJsApis(apisConf);
  });
}

var dingtalkJsApisConfig = null;
var dingtalkQueue = null;
var dingtalkErrorCb = null;

function performQueue() {
  if (dingtalkQueue && dingtalkQueue.length > 0) {
    dingtalkQueue.forEach(function (task) {
      task();
    });
    dingtalkQueue.length = 0;
  }
}

function initWeexDingtalkSDK() {
  var dingtalk = {
    isSync: false,
    apis: {},
    config: function (_config) {
      function config(_x) {
        return _config.apply(this, arguments);
      }

      config.toString = function () {
        return _config.toString();
      };

      return config;
    }(function (config) {
      if (!config) {
        logger.warn('config is undefined,you must configure Dingtalk parameters');
        return;
      }
      dingtalkJsApisConfig = config;
    }),
    init: function init() {
      // 初始化一次
      dingtalkQueue = [];
      ship.init();
      ship.ready(function () {
        dingtalk.isSync = true;
        dingtalk.apis = parseJsApis(ship.getModules ? ship.getModules : {});
        performQueue();
      });
    },
    ready: function ready(cb) {
      if (!cb || typeof cb !== 'function') {
        logger.warn('callback is undefined');
        return;
      }
      if (dingtalk.isSync) {
        permissionJsApis(cb, dingtalkJsApisConfig, dingtalkErrorCb);
      } else {
        var bufferFunction = function bufferFunction(cb) {
          return function () {
            permissionJsApis(cb, dingtalkJsApisConfig, dingtalkErrorCb);
          };
        };

        dingtalkQueue && dingtalkQueue.push(bufferFunction(cb));
      }
    },
    error: function error(cb) {
      if (typeof cb === 'function') {
        dingtalkErrorCb = cb;
      }
    },
    on: ship.on,
    off: ship.off
  };
  return dingtalk;
}

/**
 * Created by xiangwenwen on 2017/3/27.
 */

var dingtalkInit = true;
var platform = weexInstanceVar$1.env.platform;
var dingtalkSDK = {};

if (dingtalkInit) {
  dingtalkInit = false;
  switch (platform) {
    case 'Web':
      dingtalkSDK = initWebDingtalkSDK();
      break;
    default:
      // default weex env SDK
      dingtalkSDK = initWeexDingtalkSDK();
      dingtalkSDK.init();
      break;
  }
}

var dingtalkSDK$1 = dingtalkSDK;

module.exports = dingtalkSDK$1;
//# sourceMappingURL=weex-dingtalk.js.map
