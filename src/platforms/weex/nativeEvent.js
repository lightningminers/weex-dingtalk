/* @flow */

import ship from 'weex-dingtalk-require';

function installNativeEvent(dingtalk:Object){
  dingtalk.on = ship.on;
  dingtalk.off = ship.off;
}

export default installNativeEvent;
