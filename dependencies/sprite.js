/**
* @description：
* @author: manble@live.com
*/
'use strict';
const path = require('path');
const fs = require('fs');
const utils = require('../utils/utils');
const sprites = function (name, conf) {
    return {
        src: conf.src + name + '/**/*.png',
        imgName: conf.imgName + name + '.png',
        cssName: conf.cssName + name + '.scss',
        algorithm: 'binary-tree',
        cssTemplate: conf.cssTemplate,
        cssHandlebarsHelpers: {
            replaceImgPath: function (context) {
                let root = context.data.root,
                    pathReg = /(?:..\/)+dist\/images/;
                root.sprites.map((item) => {
                    item.escaped_image = item.escaped_image.replace(pathReg, '/images');
                })
                root.spritesheet.escaped_image = root.spritesheet.escaped_image.replace(pathReg, '/images');
            }
        },
        cssVarMap: (function (prefix) {
            return function (sprite) {
                let arr = utils.slash(sprite.source_image).match(new RegExp(prefix + '/(.*)/' + sprite.name));
                sprite.name = prefix + '-' + (Array.isArray(arr) ? arr[1].split('/').join('-') + '-' : '') + sprite.name;
                /-hover$/.test(sprite.name) && (sprite.name = sprite.name.replace('-hover', ':hover'));
            };
        })(name)
    };
};

module.exports = function (conf) {
    let config = {};
    let files = fs.readdirSync(path.resolve(process.cwd(), conf.src))
    files = files.filter(function (item) {
        return !/\./.test(item);
    });
    files.forEach(function (item) {
        config[item] = sprites(item, conf);
    });
    return config;
};
