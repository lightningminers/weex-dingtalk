/**
 * Created by xiangwenwen on 2017/3/24.
 */

// @flow

let __nuva_modules__: Object = {};
let requireStack: Array<string> = [];
let inProgressModules: Object = {};

function build(__nuva_module__: Object) {
  let factory = __nuva_module__.factory;
  __nuva_module__.__nuva_exports__ = {};
  delete __nuva_module__.factory;
  factory(__nuva_require__, __nuva_module__.__nuva_exports__, __nuva_module__);
  return __nuva_module__.__nuva_exports__;
}
export function __nuva_require__(id: string) : any {
  if (!__nuva_modules__[id]) {
    throw '__nuva_module__ ' + id + ' not found';
  } else if (id in inProgressModules) {
    const cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
    throw 'Cycle in require graph: ' + cycle;
  }
  if (__nuva_modules__[id].factory) {
    try {
      inProgressModules[id] = requireStack.length;
      requireStack.push(id);
      return build(__nuva_modules__[id]);
    } finally {
      delete inProgressModules[id];
      requireStack.pop();
    }
  }
  return __nuva_modules__[id].__nuva_exports__;
};

export function __nuva_define__(id: string, factory: Function) {
  if (__nuva_modules__[id]) {
    throw 'module ' + id + ' already defined';
  }
  __nuva_modules__[id] = {
    id: id,
    factory: factory
  };
};

export function __nuva_define_remove__(id: string){
  delete __nuva_modules__[id];
}
