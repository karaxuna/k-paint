var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var baseConfig = require('./webpack.config.base.js');

module.exports = merge(baseConfig, {
    entry: {
        'demo': './src/demo/index.ts'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/demo/index.html',
            inject: true,
            excludeChunks: ['k-table']
        })
    ],
    devServer: {
        hot: true,
        inline: true
    }
});
