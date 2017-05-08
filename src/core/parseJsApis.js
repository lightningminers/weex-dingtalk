/**
 * Created by xiangwenwen on 2017/3/27.
 */

//@flow

import ship from 'weex-dingtalk-require';

export default function parseJsApis(jsApis: Object) : Object{
  let apis: Object = {};
  for (let name: string in jsApis) {
    let node: Array<string> = name.split('.');
    let staging = null;
    let i: number = 0;
    let j: number = node.length;
    while (true) {
      if (!staging) {
        if (1 === j) {
          let h = false;
          let p = apis[node[i]];
          let s = ship.require(name);
          for (let x in p){
            if (p.hasOwnProperty(x)){
              h = true;
              break;
            }
          }
          if (h){
            for (let k in s){
              if (s.hasOwnProperty(k)){
                p[k] = s[k];
              }
            }
          } else {
            apis[node[i]] = ship.require(name);
          }
          break;
        }
        if (apis[node[i]]){
          staging = apis[node[i]];
          i++;
          continue;
        }
        apis[node[i]] = {};
        staging = apis[node[i]];
        i++;
        continue;
      } else {
        if ((j - 1) === i) {
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
