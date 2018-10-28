/**
* @description：
* @author: manble@live.com
*/
'use strict';

const express = require('express');
const Router = express.Router();
const request = require('../../utils/request');

['get', 'post', 'put', 'delete'].forEach(method => {
    Router[method]('/*', (req, res, next) => {
        request[method]({
            uri: req.originalUrl.replace(res.locals.apiProxyPrefix, ''),
            qs: req[({ get: 'query', post: 'body', put: 'query', delete: 'query' })[method]]
        }, req, next).then((json) => {
            res.send(json);
        }).catch((err) => {
            res.send(err);
        });
    });
});

module.exports = Router;