/**
 * @description：
 * @author: manble@live.com
 */
'use strict';

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const crypto = require('crypto');

const getFiles = (dir, cb) => {
    let isDir = (dir) => (fs.statSync(dir).isDirectory());
    dir = slash(dir);
    if (isDir(dir)) {
        let files = fs.readdirSync(dir);
        files.forEach((src) => {
            src = path.join(dir, src);
            isDir(src) ? getFiles(src, cb) : cb(src);
        });
    } else {
        cb(dir);
    }
};
const type = type => (data => (Object.prototype.toString.call(data).slice(8, -1).toLowerCase() === (type).toLowerCase()));

module.exports = {
    getFiles,
    isObj: type('Object'),
    isDev: () => (/development/.test(process.env.NODE_ENV)),
    env: () => (process.env.NODE_ENV || 'development'),
    webpackConfigMerge: (a, b) => {
        let config = {};
        Object.keys(b).map((key) => { Array.isArray(a[key]) && Array.isArray(b[key]) && (config[key] = [].concat(a[key], b[key])); });
        return Object.assign({}, a, b, config);
    },
    crypto: (txt = '') => {
        return crypto.createHash('md5').update(new Buffer(txt)).digest('hex');
    },
    slash: function (str) {
        if (/^\\\\\?\\/.test(str) || /[^\x00-\x80]+/.test(str)) {
            return str;
        }
        return str.replace(/\\/g, '/');
    },
    mkdir: function (dir, callback) {
        let mkdir = function (p, opts, made) {
            if (!opts || typeof opts !== 'object') {
                opts = {
                    mode: opts || function (err) {
                        console.log(res);
                    }
                };
            }
            if (!made) made = null;
            p = path.resolve(p);
            try {
                fs.mkdirSync(p, opts.mode);
                made = made || p;
            } catch (err0) {
                switch (err0.code) {
                    case 'ENOENT':
                        made = mkdir(path.dirname(p), opts, made);
                        mkdir(p, opts, made);
                        break;
                    default:
                        let stat;
                        try {
                            stat = fs.statSync(p);
                        } catch (err1) {
                            throw err0;
                        }
                        if (!stat.isDirectory()) throw err0;
                        break;
                }
            }
            return made;
        };
        mkdir(path.dirname(dir), callback);
    },

    writeFile: function (filePath, content, callback) {
        this.mkdir(filePath, function (err) {
            if (err) {
                return callback(err)
            }
        });
        fs.writeFile(filePath, content, callback);
    }
};