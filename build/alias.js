var path = require('path');

function absolute (str) {
  return path.resolve(__dirname, '..', str)
}

module.exports = {
  'weex-dingtalk-polyfills': absolute('package/weex-dingtalk-polyfills/index.js'),
  'weex-dingtalk-exec': absolute('package/weex-dingtalk-exec/index.js'),
  'weex-dingtalk-runtime': absolute('package/weex-dingtalk-runtime/index.js'),
  'shared': absolute('src/shared'),
  'core': absolute('src/core')
};
