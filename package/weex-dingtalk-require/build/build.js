var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var alias = require('rollup-plugin-alias');
var commonjs = require("rollup-plugin-commonjs");

rollup.rollup({
    entry: './src/index.js',
    plugins: [ resolve(),commonjs(),babel() ]
}).then(function(bundle){
    bundle.write({
        dest:'./dist/weex-dingtalk-require.js',
        format: 'cjs',
        sourceMap: true
    });
});
