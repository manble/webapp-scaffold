/**
 * @description：
 * @author: manble@live.com
 */
'use strict';

const express = require('express');
const Router = express.Router();
const index = require('../../models/index');

Router.get('/', (req, res, next)=> {
    Promise.all([
        // index.newsList(req)
    ]).then((data) => {
        res.render('pages/index', {});
    }).catch((err) => {
        next(err)
    });
});

module.exports = Router;