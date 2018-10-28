/**
 * @description：
 * @author: manble@live.com
 */
'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = function (conf, env) {
    return {
        cache: true,
        context: path.join(process.cwd(), ''),
        entry: {
            common: conf.entry.common
        },
        output: {
            path: path.join(process.cwd(), conf.dist),
            filename: '[name].js',
            library: '[name]'
        },
        plugins: [new webpack.DllPlugin({
            context: path.join(process.cwd(), ''),
            path: path.join(process.cwd(), conf.dist, '[name]-manifest.json'),
            name: '[name]'
        })]
    };
};