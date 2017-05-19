/* @flow */

import initEnv from './core/env.js';
import initRequire from './core/requireModule.js';

function polyfills () : Object{
  let weexVar = {
    env: initEnv(),
    requireModule: initRequire()
  };
  return weexVar;
}

let weexInstanceVar;
if (!weexInstanceVar){
  weexInstanceVar = polyfills();
}

export default weexInstanceVar;
