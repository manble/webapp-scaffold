/**
* @description：
* @author: manble@live.com
*/
'use strict';
const path = require('path');
const Ftp = require('ftp');
const ftp = new Ftp();

const utils = require('../utils/utils');
module.exports = function (config, cb) {
    let uploadList = [];
    let uploadDirectory = path.resolve(process.cwd(), config.localDir);
    let push = function () {
        if (uploadList.length) {
            console.log('------ ' + uploadList.length + ' files need to upload  ----------------');
            uploadList.map(function (item, idx, arr) {
                mkdir(path.dirname(item.remotePath), function () {
                    ftp.put(item.path, item.remotePath, function (err) {
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

    let upload = function () {
        let files = [];
        utils.getFiles(uploadDirectory, function (_path) {
            !/(html\/pages\/|images\/base64|.map$)/.test(_path) && files.push(utils.slash(_path));
        });

        files.forEach(function (_path, idx) {
            let remotePath = _path.replace(utils.slash(uploadDirectory) + '/', '');
            ftp.list(remotePath, function (err, file) {
                err && uploadList.push({
                    path: _path,
                    remotePath: remotePath
                });
                idx >= files.length - 1 && push();
            });
        });
    };

    let end = function (idx, len) {
        if (idx >= len - 1) {
            console.log('------ upload done ---------------------------');
            ftp.end();
            typeof cb == 'function' && cb();
        }
    };

    let mkdir = function (_path, callback) {
        ftp.mkdir(_path, true, callback);
    };

    let ready = function () {
        console.log('------ upload ready --------------------------');
        ftp.cwd(config.remoteDir, function (err) {
            err ? mkdir(config.remoteDir, function () {
                ftp.cwd(config.remoteDir, function (err) {
                    upload();
                });
            }) : upload();
        });
    };

    ftp.on('ready', ready);
    ftp.connect(Object.assign({
        pasvTimeout: 20000,
        keepalive: 20000,
        secure: true,
        secureOptions: {
            key: undefined,
            cert: undefined,
            requestCert: true,
            rejectUnauthorized: false
        }
    }, config.connect));
};