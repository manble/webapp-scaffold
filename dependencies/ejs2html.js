/**
 * @description：
 * @author: manble@live.com
 */
'use strict';
let path = require('path');
let fs = require('fs');
let ejs = require('ejs');
let utils = require('../utils/utils');
let appConfig = require('../app-config');
const minify = require('html-minifier').minify;
let Block = function () {
    this.html = [];
};
Block.prototype = {
    toString: function () {
        return this.html.join('\n');
    },
    append: function (more) {
        this.html.push(more);
    },
    prepend: function (more) {
        this.html.unshift(more);
    },
    replace: function (instead) {
        this.html = [instead];
    }
};

let render = function (file, opts, fn) {
    if (!opts.blocks) {
        opts.blocks = {};
        opts.block = (function (name, html) {
            let block = this[name];
            !block && (block = this[name] = new Block());
            html && block.append(html);
            return block;
        }).bind(opts.blocks);
    }
    opts.layout = (function (layoutPath) {
        this.layoutPath = layoutPath;
    }).bind(opts);
    ejs.renderFile(file, opts, function (err, html) {
        if (err) {
            return fn(err, html);
        }
        opts.body = html;
        if (opts.layoutPath) {
            let layoutPath = opts.settings.views + opts.layoutPath;
            !/.ejs/.test(layoutPath) && (layoutPath = `${opts.layoutPath}.ejs`);
            delete opts.layoutPath;
            render(layoutPath, opts, fn);
        } else {
            fn(null, html);
        }
    })
};

module.exports = function (opts, env, cb) {
    opts = Object.assign(opts, {
        views: '/views/release',
        pages: '/pages',
        dist: '/build/html'
    });
    let processDir = process.cwd();
    let viewsDir = utils.slash(`${path.resolve(processDir)}${opts.views}`);
    let filesList = [];
    utils.getFiles(`${viewsDir}${opts.pages}`, function (filePath) {
        filesList.push(filePath);
    });
    filesList.forEach(function (file) {
        render(file, Object.assign({}, {
            settings: {
                views: viewsDir
            }
        }, appConfig(env)), function (err, html) {
            if (err) {
                console.error(err);
            } else {
                utils.writeFile(`${processDir}${opts.dist}${utils.slash(file).replace(viewsDir, '').replace('.ejs', '.html')}`, minify(html, { collapseWhitespace: true, conservativeCollapse: true, minifyJS: true, minifyCSS: true}), function (err, item) {
                    err && console.log(err);
                });
            }
        });
    });
    cb();
};