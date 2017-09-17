/**
 * @description：
 * @author: manble@live.com
 */
'use strict';
const path = require('path');
const webpack = require('webpack');
const utils = require('../utils/utils');

const getConfig = function(env) {
    let isDev = env == 'development';
    let plugins = [new webpack.optimize.CommonsChunkPlugin({name: 'common', filename: 'common.js'})];
    if (!isDev) {
        plugins = plugins.concat([
           new webpack.optimize.UglifyJsPlugin({
              compress: {
                 warnings: false
              },
              output: {
                 comments: false,
                 ascii_only: true
              }
           }),
           new webpack.DefinePlugin({
              'process.env': {
                 NODE_ENV: JSON.stringify('production')
              }
           }),
           new webpack.NamedModulesPlugin()
        ]);
     }
    return {
        cache: true,
        context: path.join(process.cwd(), ''),
        entry: {
            common: ['vue', 'vue-router', 'vuex', 'whatwg-fetch']
            // common: ['react', 'react-dom', 'redux', 'react-redux', 'whatwg-fetch', 'react-addons-transition-group']
            // index: ['./public/scripts/pages/index.js']
        },
        output: {
            path: path.join(process.cwd(), './public/dist/scripts/pages'),
            filename: '[name].js',
            publicPath: './public/dist/'
        },
        externals: {},
        module: {
            loaders: [{
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: "url-loader",
                query: {}
            }, {
                test: /\.css$/,
                loader: 'style!css'
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader',
                    options: {
                        indentedSyntax: true,
                        includePaths: [path.resolve('./public/scss/')]
                    }
                }]
            }, {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
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
            }]
        },
        devtool: isDev ? 'cheap-source-map' : '',
        resolve: {
            extensions: ['.js', '.jsx', '.vue', '.scss'],
            modules: [path.resolve('./public/scripts/'), path.resolve('./public/scss/'), path.resolve('./node_modules/')],
            alias: {
                scss: path.resolve('./public/scss/'),
                'vue': 'vue/dist/vue.esm.js'
            }
        },
        plugins: plugins
    };
};


module.exports = function(conf, env) {
    let filelist = [],
        entry = {};
    let _path = path.resolve(process.cwd(), conf.src);
    utils.getFiles(_path, function(_path) {
        filelist.push(_path);
    });
    filelist.forEach(function(item) {
        var arr = utils.slash(item).match(conf.regexp);
        entry[arr[1]] = ['.' + arr[0]];
    });
    filelist = [];

    return Object.assign(getConfig(env), {
        entry: entry
    });
};
