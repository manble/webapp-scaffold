/**
* @description：
* @author: manble@live.com
*/
'use strict';

const express = require('express');
const Router = express.Router();
const request = require('../../utils/request');

Router.get('/*', (req, res, next) => {
   request.get({
      uri: req.originalUrl,
      qs: req.query
   }, req, next).then((json) => {
      res.send(json);
   }).catch((err) => {
      res.send(err);
   });
});

Router.post('/*', (req, res, next) => {
   request.post({
      uri: req.originalUrl,
      qs: req.body
   }, req, next).then((json) => {
      res.send(json);
   }).catch((err) => {
      res.send(err);
   });
});

Router.put('/*', (req, res, next) => {
   request.put({
      uri: req.originalUrl,
      qs: req.body
   }, req, next).then((json) => {
      res.send(json);
   }).catch((err) => {
      res.send(err);
   });
});

Router.delete('/*', (req, res, next) => {
   request.del({
      uri: req.originalUrl,
      qs: req.query
   }, req, next).then((json) => {
      res.send(json);
   }).catch((err) => {
      res.send(err);
   });
});

module.exports = Router;