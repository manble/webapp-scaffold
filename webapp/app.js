/**
* @description：
* @author: manble@live.com
*/
'use strict';
var express = require('express');
var engine = require('ejs-mate');
var app = module.exports.app = exports.app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var server = require('http').Server(app);

var isDev = process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'preview';
app.set('port', process.env.PORT || 8080);
// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
app.set('views', __dirname + '/views' + (isDev ? '' : '/release'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public/dist'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

isDev && app.use(require('connect-livereload')());

require('./routes/entry')(app);

server.listen(app.get('port'));