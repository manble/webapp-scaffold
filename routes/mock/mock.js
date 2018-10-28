/**
* @description：
* @author: manble@live.com
*/

'use strict';

const express = require('express');
const Router = express.Router();
const fs = require('fs');
const path = require('path');
const utils = require('../../utils/utils');
const { isArray, isObject } = require('../../utils/type');
const request = require('../../utils/request');

try {
    let files = [];
    utils.getFiles(`${process.cwd()}/mocks`, file => {
        files.push(file);
    });
    files = files.filter((file) => /\.mock\.json$/.test(file));
    files.forEach(file => {
        let content = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (isObject(content) && isArray(content.mocks)) {
            content.mocks.forEach(config => {
                let method = config.method.toLowerCase();
                Router[method](config.path, (req, res, next) => {
                    let params = req[({ get: 'query', post: 'body' })[method] || 'query'];
                    if (config.state === 'on') {
                        res.send(require(path.join(process.cwd(), config.response))(params));
                    } else {
                        request[method]({ uri: config.path, qs: params }, req).then(data => {
                            res.send(data);
                        });
                    }
                });

            });
        }
    });
} catch (err) {
    console.error(err);
}


Router.post('/*', async (req, res, next) => {
    res.send({ code: 200, url: req.originalUrl, params: req.body });
});

Router.get('/*', async (req, res, next) => {
    res.send({ code: 200, url: req.originalUrl, params: req.query });
});

Router.delete('/*', async (req, res, next) => {
    res.send({ code: 200, url: req.originalUrl, params: req.query });
});


module.exports = Router;