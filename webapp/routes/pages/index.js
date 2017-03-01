/**
* @description：
* @author: manble@live.com
*/
'use strict';

var express = require('express');
var Router = express.Router();

Router.get('/', function(req, res, next) {
    res.render('pages/index', {
        page: 'index'
    });
});

module.exports = Router;