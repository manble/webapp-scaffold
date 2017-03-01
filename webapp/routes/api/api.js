/**
* @description：
* @author: manble@live.com
*/
'use strict';

var express = require('express');
var Router = express.Router();
var request = require('../../models/request.js');
var utils = require('../../dependencies/utils.js');

Router.get('/', function(req, res, next) {
    // {
    //     url: '/api/xxxx',
    //     mothed: 'POST',
    //     qs: {} 
    // }
    Promise.all([request(utils.extend(req.query, req.body))]).then(data => {
        res.send(utils.isObj(data[0]) ? data[0] : JSON.parse(data[0]));
    }, reason=> {
        res.send(reason);
    });
});

module.exports = Router;