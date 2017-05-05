var path = require('path');

function absolute (str) {
  return path.resolve(__dirname, '..', str)
}

module.exports = {
  'weex-dingtalk-polyfills': absolute('package/weex-dingtalk-polyfills/src/index.js'),
  'weex-dingtalk-exec': absolute('package/weex-dingtalk-exec/src/index.js'),
  'weex-dingtalk-require': absolute('package/weex-dingtalk-require/src/index.js'),
  'shared': absolute('src/shared'),
  'core': absolute('src/core')
};
