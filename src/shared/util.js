/* @flow */

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj: Object, key: string): boolean{
  return hasOwnProperty.call(obj,key);
}

export function isPrimitive(val: any): boolean{
  return typeof val === 'string' || typeof val === 'number';
}

export function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}
