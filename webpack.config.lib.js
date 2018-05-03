var merge = require('webpack-merge');
var baseConfig = require('./webpack.config.base.js');

module.exports = merge(baseConfig, {
    entry: {
        'k-paint': './src/lib/index.ts'
    },
    output: {
        library: 'k-paint',
        libraryTarget: 'umd'
    }
});
