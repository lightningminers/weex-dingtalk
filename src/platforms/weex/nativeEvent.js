/* @flow */

import ship from 'weex-dingtalk-runtime';

function installNativeEvent(dingtalk:Object){
  dingtalk.on = ship.on;
  dingtalk.off = ship.off;
}

export default installNativeEvent;
