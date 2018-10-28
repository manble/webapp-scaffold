/**
 * @description：
 * @author: manble@live.com
 */
'use strict';
const path = require('path');
const webpack = require('webpack');
const utils = require('../utils/utils');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const appConfig = require('../app-config');
const slash = require('slash');

const getConfig = function (conf) {
    let plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(conf.env),
                CONFIG: JSON.stringify(appConfig(conf.env))
            }
        })
    ];
    if (!conf.isMinify) {
        plugins = plugins.concat([
            new webpack.NamedModulesPlugin(),
            new webpack.DllReferencePlugin({
                context: path.join(process.cwd(), ''),
                manifest: require(path.join(process.cwd(), conf.commonManifest))
            })
        ]);
    } else {
        plugins = plugins.concat([
            new webpack.HashedModuleIdsPlugin({
                hashFunction: 'sha256',
                hashDigest: 'hex',
                hashDigestLength: 6
            })
        ]);
    }
    return {
        cache: true,
        context: path.join(process.cwd(), ''),
        entry: {},
        mode: conf.isMinify ? 'production' : 'development',
        output: {
            path: path.join(process.cwd(), conf.dist),
            filename: '[name].js',
            publicPath: conf.public
        },
        externals: {},
        module: {
            rules: [{
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
                enforce: 'pre',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    fix: false
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
            }].filter(item => conf.eslint === 'off' && item.loader === 'eslint-loader' ?
                false :
                true)
        },
        devtool: conf.isMinify ?
            'source-map' : 'cheap-source-map',
        resolve: {
            extensions: [
                '.js', '.jsx', '.vue', '.scss'
            ],
            modules: [
                path.resolve('./public/scripts/'),
                path.resolve('./public/scss/'),
                path.resolve('./node_modules/')
            ],
            alias: {
                scss: path.resolve('./public/scss/'),
                'vue': 'vue/dist/vue.esm.js'
            }
        },
        plugins: plugins,
        optimization: {
            minimizer: [new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false
                    },
                    output: {
                        comments: false,
                        ascii_only: true
                    }
                }
            })]
        },
        performance: {
            hints: 'warning',
            maxAssetSize: 350000,
            maxEntrypointSize: 500000
        }
    };
};

module.exports = function (conf) {
    let filelist = [],
        entry = conf.isMinify ?
        conf.entry : {};
    let _path = path.resolve(process.cwd(), conf.src);
    utils.getFiles(_path, function (_path) {
        filelist.push(_path);
    });
    filelist.forEach(function (item) {
        let arr = slash(item).match(conf.regexp);
        entry[arr[1]] = ['.' + arr[0]];
    });
    filelist = [];

    return Object.assign(getConfig(conf), {
        entry: entry
    });
};