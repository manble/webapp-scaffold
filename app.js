/**
* @description：
* @author: manble@live.com
*/

'use strict';
const express = require('express');
const engine = require('ejs-mate');
const app = module.exports.app = exports.app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const server = require('http').Server(app);
const appConfig = require('./app-config');

app.set('port', process.env.PORT || 8181);
// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
app.set('views', __dirname + '/views' + (/production|preview-cdn/.test(process.env.NODE_ENV) ? '/release' : ''));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public/dist'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

/development/.test(process.env.NODE_ENV) && app.use(require('connect-livereload')({
    port: process.env.LIVE_RELOAD_PORT || 35729
}));
app.use(function (req, res, next) {
    Object.assign(res.locals, appConfig(process.env.NODE_ENV, req));
    next();
});
require('./routes/entry')(app);

server.listen(app.get('port'));