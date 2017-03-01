/**
* @description：
* @author: manble@live.com
*/
'use strict';
var api = require('./api/api');
var index = require('./pages/index');

module.exports = function(app) {
    app.use('/', index);
    app.use('/api', api);


    app.use(function(req, res, next) {
        res.status(404).render('pages/error/404');
    });

    app.use(function(error, req, res, next) {
        res.status(500).render('pages/error/500');
    });
};
