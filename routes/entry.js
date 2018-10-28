/**
 * @description：
 * @author: manble@live.com
 */
'use strict';
const api = require('./api/api');
const mock = require('./mock/mock');
const index = require('./pages/index');



module.exports = (app) => {
    if (/development/.test(app.get('env'))) {
        app.use('/api', api);
        app.use(require('../app-config')('development').mockPrefix, mock);
    }
    app.use('/', index);
    // app.use('/*', index);

    app.use((req, res, next) => {
        res.status(404).render('pages/error/404');
    });

    app.use((error, req, res, next) => {
        if (req.res.locals.mode != 2 || /feDebug=1/.test(req.originalUrl)) {
            console.log('----------- 500 : ------------------- \n', error, '\n----------- /500 : -------------------');
        }
        res.status(500).render('pages/error/500');
    });
};