/**
 * @description：
 * @author: manble@live.com
 */
'use strict';
const through = require('through2');
const gutil = require('gulp-util');
const path = require('path');
const fs = require('fs');

module.exports = function(opts) {
    opts = opts || {
            prefix: '/images/base64/',
            src: './public/'
        };
    let types = {
        '.gif': 'image/gif',
        '.ico': 'image/vnd.microsoft.icon',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp'
    };
   let urlReg = new RegExp(`(?:[\\(\'"])(${opts.prefix}[^\.]*(?:${Object.keys(types).join('|')}))`, 'gi');

    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('img 2 base64', 'Streams are not su pported!'));
            return cb();
        }
        let urlList = [];
        let contents = file.contents.toString();
        let match = urlReg.exec(contents);
        while (match) {
            urlList.push(match[1]);
            match = urlReg.exec(contents);
        }
        urlList.forEach((item) => {
            let imgPath = path.join(process.cwd(), opts.src, item);
            try{
                let img = fs.readFileSync(imgPath, 'base64');
                contents = contents.replace(new RegExp(`([\\(\'"])${item}`), function($1, $2){
                    return `${$2}data:${types[path.extname(imgPath)]};base64,${img}`;
                });
            } catch(err) {
                cb(err, contents);
            }
        });
        file.contents = new Buffer(contents);
        cb(null, file);
    });
};
