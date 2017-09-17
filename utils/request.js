/**
 * @description：
 * @author: manble@live.com
 */
'use strict';

const request = require('request');
const url = require('url');

const _request = function (config, req) {
   let locals = req.res.locals;
   let origin = req.headers.host;
   !/https?:\/\//.test(config.uri) && (config.uri = locals.origin.server + config.uri);
   let options = Object.assign({
      encoding: 'utf8',
      gzip: true,
      headers: ((head) => {
         let headers = Object.assign({}, head);
         headers.host = url.parse(config.uri).host;
         headers.accept = '*/*';
         return headers;
      })(req.headers)
   }, config);

   locals.mode != 2 && console.log('-------- request options: --------------\n', {
      uri: options.uri,
      qs: options.qs || {},
      method: options.method,
      headers: {
         host: options.headers.host,
         cookie: options.headers.cookie
      }
   }, '\n-------- /request options -------------');

   return new Promise(function (resolve, reject) {
      let startTime = new Date().getTime();
      request(options, function (error, response, body) {
         if (error) {
            reject({
               desc: 'requeset error',
               info: error,
               options
            });
         } else if (response.statusCode != 200) {
            reject(JSON.stringify({
               code: response.statusCode,
               desc: 'response.statusCode != 200',
               response,
               options
            }));
         } else {
            locals.mode != 2 && console.log('======\n' + options.uri +'\n耗时：' + (new Date().getTime() - startTime) + ' 毫秒\n============');
            try {
               resolve(JSON.parse(body));
            } catch (e) {
               reject({
                  desc: 'response JSON.parse syntaxError',
                  info: e.message,
                  options,
                  body
               });
            }
         }
         options = null;
      });
   });
};


module.exports = {
   /*
    @param {Object} config
      @property {string}  uri 请求的地址
      @property {object}  qs 请求的参数
    @param {Object} req
    get({}, req);
    */

   get: function (config, req) {
      config.method = 'GET';
      config.cache = false;
      return _request(config, req);
   },

   post: function (config, req) {
      config.method = 'POST';
      return _request(config, req);
   },

   del: function(config, req) {
      config.method = 'DELETE';
      return _request(config, req);
   },

   put: function(config, req) {
      config.method = 'PUT';
      return _request(config, req);
   }
};