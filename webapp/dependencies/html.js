/**
* @description：
* @author: manble@live.com
*/
'use strict';
var slash = require('slash');
var path = require('path');
var fs = require('fs');
var utils = require('./utils.js');

var filesList = [];
var cache = {};

module.exports = function() {
    try {
        var dir = path.resolve(process.cwd(), 'views/release/');
        utils.getFiles(dir, function(filePath) {
            filesList.push(filePath);
        });
        filesList.forEach(function(item, idx) {
            var content = fs.readFileSync(item, 'utf8');
            cache[slash(item.replace(dir, ''))] = content;
        });
        Object.keys(cache).map(function(item, idx) {
            if (/pages/.test(item)) {
                var layoutReg = /<%\s?layout\(\'\/partials\/layout.ejs\'\)\s*-?%>/;
                var blockObj = {};
                var includeObj = {};
                var layout = '';
                var content = cache[item];
                var blocks = content.match(/<%\s*block\((.*)\)\s*-?%>/g);
                var includes = content.match(/<%(?:-|=|_|#)?\s*include.*%>/g);
                var layoutBlocks = null;
                if (blocks) {
                    blocks.forEach(function(item) {
                        var arr = item.match(/<%\s*block\(\'(\w*)\',\s*\'([^\'\)].*)\'\)\s*(?:-|=)?%>/);
                        if (arr && arr[1]) {
                            blockObj[arr[1]] = arr[2];
                        }
                        content = content.replace(item, '');
                    });
                }
                if (layoutReg.test(content)) {
                    layout = cache['/partials/layout.ejs'];
                    content = content.replace(layoutReg, '');
                    layoutBlocks = layout.match(/<%(?:-|=)?\s*blocks\.(\w*)\s*(?:-|=)?%>/g);
                    layoutBlocks && layoutBlocks.forEach(function(item) {
                        var arr = item.match(/<%(?:-|=)?\s*blocks\.(\w*)\s*(?:-|=)?%>/)
                        if (arr) {
                            layout = layout.replace(item, blockObj[arr[1]]);
                        }
                    });
                    content = layout.replace(/<%(-|=)\s*body\s*(-|=)%>/, content).replace(/(\r?\n){2,}/g, '');
                }
                utils.writeFile('build/html' + item.replace('.ejs', '.html'), content, function(err, item) {
                    err && console.log(err);
                });
            }
        });
        cache = null;
        filesList = null;
        console.log('-------- ejs 2 html success! path:build/html/ ----------');
    } catch (err) {
        console.log('-------- ejs 2 html wrong!!! ---------');
    }
};
