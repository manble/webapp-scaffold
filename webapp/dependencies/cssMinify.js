/**
 * @description：
 * @author: manble@live.com
 */
'use strict';
var through = require('through2');
var CleanCSS = require('clean-css');
var gutil = require('gulp-util');
var utils = require('./utils.js');

module.exports = function(opts, env) {
    var isDev = env == 'development';
    var options = {
        pathReplace: [
            ['.debug', '']
        ],
        // showLog: isDev ? true : false,
        level: isDev ? 0 : {
            2: {
                all: true
            }
        }
    };
    options = utils.extend(options, env);
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('css minify', 'Streams are not supported!'));
            return cb();
        }
        var minimize = new CleanCSS(options).minify(file.contents.toString()).styles;
        file.contents = new Buffer(minimize);
        file.path && options.pathReplace.forEach((item) => {
            file.path = file.path.replace(item[0], item[1]);
        });
        options.showLog && console.log('--- css mimify: --- ', file.relative);
        cb(null, file);
    });
};
