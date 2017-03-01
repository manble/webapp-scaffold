/**
* @description：
* @author: manble@live.com
*/
'use strict';
var slash = require('slash');
var path = require('path');
var fs = require('fs');
var Ftp = require('ftp');
var ftp = new Ftp();
var config = require('./conf.js').ftp;
var utils = require('./utils.js');

module.exports = function(cb) {
    var uploadList = [];
    var uploadDirectory = path.resolve(process.cwd(), config.localDir);
    var push = function() {
        if (uploadList.length) {
            console.log('------ ' + uploadList.length + ' files need to upload  ----------------');
            uploadList.map(function(item, idx, arr) {
                mkdir(path.dirname(item.remotePath), function() {
                    ftp.put(item.path, item.remotePath, function(err) {
                        err ? console.log('------error: ' + err) : console.log('------ uploaded: ' + item.remotePath);
                        end(idx, arr.length);
                    });
                });
            });
        } else {
            console.log('------ no file need to upload ----------------');
            end(0, 0);
        };
    };

    var upload = function() {
        var files = [];
        utils.getFiles(uploadDirectory, function(_path) {
            !/(html\/pages\/|.map$)/.test(_path) && files.push(slash(_path));
        });

        files.forEach(function(_path, idx) {
            var remotePath = _path.replace(slash(uploadDirectory) + '/', '');
            ftp.list(remotePath, function(err, file) {
                err && uploadList.push({
                    path: _path,
                    remotePath: remotePath
                });
                idx >= files.length - 1 && push();
            });
        });
    };

    var end = function(idx, len) {
        if (idx >= len - 1) {
            console.log('------ upload done ---------------------------');
            ftp.end();
            typeof cb == 'function' && cb();
        }
    };

    var mkdir = function(_path, callback) {
        ftp.mkdir(_path, true, callback);
    };

    var ready = function() {
        console.log('------ upload ready --------------------------');
        ftp.cwd(config.remoteDir, function(err) {
            err ? mkdir(config.remoteDir, function() {
                ftp.cwd(config.remoteDir, function(err) {
                    upload();
                });
            }) : upload();
        });
    };

    ftp.on('ready', ready);
    ftp.connect(utils.extend({
        pasvTimeout: 20000,
        keepalive: 20000,
        secure: false,
        secureOptions: {
            key: undefined,
            cert: undefined,
            requestCert: true,
            rejectUnauthorized: false
        }
    }, config.connect));
};
