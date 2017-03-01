/**
 * @description：
 * @author: manble@live.com
 */
'use strict';
var path = require('path');
var slash = require('slash');
var webpack = require('webpack');
var utils = require('./utils.js');

var getConfig = function(env) {
    var isDev = env == 'development';
    var plugins = [];
    if (!isDev) {
        plugins = [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                }
            })
        ];
    }
    return {
        cache: true,
        entry: {
            'common': ['./public/scripts/pages/common.js'],
            'index': ['./public/scripts/pages/index.js']
        },
        output: {
            path: path.join(process.cwd(), './public/dist/scripts/pages'),
            filename: '[name].js'
        },
        externals: {},
        module: {
            loaders: [{
                test: /\.css$/,
                loader: 'style!css'
            }, {
                test: /\.scss/,
                exclude: /node_modules/,
                loader: 'style!css!sass',
                options: {
                    includePaths: ['./public/scss/includes/', './public/scss/includes/tools/']
                }
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    cacheDirectory: true
                }
            }, {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader'
                    }
                }
            }, ]
        },
        devtool: isDev ? 'cheap-source-map' : '',
        resolve: {
            modules: [path.resolve('./public/scripts/'), path.resolve('./node_modules/')],
            alias: {
                'vue': 'vue/dist/vue.common.js' //https://cn.vuejs.org/v2/guide/installation.html
            }
        },
        plugins: plugins
    };
};


module.exports = function(conf, env) {
    var filelist = [],
        entry = {};
    var _path = path.resolve(process.cwd(), conf.src);
    utils.getFiles(_path, function(_path) {
        filelist.push(_path);
    });
    filelist.forEach(function(item) {
        var arr = slash(item).match(conf.regexp);
        entry[arr[1]] = ['.' + arr[0]];
    });
    filelist = [];

    return utils.extend(getConfig(env), {
        entry: entry
    });
};
