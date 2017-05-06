/**
 * Created by xiangwenwen on 2017/3/24.
 */

// @flow

let __ship_modules__: Object = {};
let requireStack: Array<string> = [];
let inProgressModules: Object = {};

function build(__ship_module__: Object) {
  let factory = __ship_module__.factory;
  __ship_module__.__ship_exports__ = {};
  delete __ship_module__.factory;
  factory(__ship_require__, __ship_module__.__ship_exports__, __ship_module__);
  return __ship_module__.__ship_exports__;
}
export function __ship_require__(id: string) : any {
  if (!__ship_modules__[id]) {
    throw '__ship_module__ ' + id + ' not found';
  } else if (id in inProgressModules) {
    const cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
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
};

export function __ship_define__(id: string, factory: Function) {
  if (__ship_modules__[id]) {
    throw 'module ' + id + ' already defined';
  }
  __ship_modules__[id] = {
    id: id,
    factory: factory
  };
};

export function __ship_define_remove__(id: string){
  delete __ship_modules__[id];
}
