var rollup = require("rollup");
var babel = require("rollup-plugin-babel");
var commonjs = require("rollup-plugin-commonjs");
var resolve = require("rollup-plugin-node-resolve");

rollup.rollup({
    entry: './src/index.js',
    plugins: [ resolve(),commonjs(),babel() ]
}).then(function(bundle){
    bundle.write({
        dest:'./dist/weex-dingtalk-exec.js',
        format: 'cjs',
        sourceMap: true
    });
});
