/**
 * @description：
 * @author: manble@live.com
 */
'use strict';
const through = require('through2');
const CleanCSS = require('clean-css');
const gutil = require('gulp-util');
const utils = require('../utils/utils');

module.exports = function(opts, env) {
    let isDev = env == 'development';
    let options = {
        pathReplace: [
            ['.debug', '']
        ],
        // showLog: isDev ? true : false,
        level: {
            2: {
                all: true
            }
        }
    };
    options = Object.assign(options, opts);
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('css minify', 'Streams are not supported!'));
            return cb();
        }
        if(!isDev) {
            var minimize = new CleanCSS(options).minify(file.contents.toString()).styles;
            file.contents = new Buffer(minimize);
            file.path && options.pathReplace.forEach((item) => {
                file.path = file.path.replace(item[0], item[1]);
            });
        }
        options.showLog && console.log('--- css mimify: --- ', file.relative);
        cb(null, file);
    });
};
