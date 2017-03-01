/**
 * @description：
 * @author: manble@live.com
 */
var request = require('request');
var url = require('url');
var utils = require('../dependencies/utils.js');

module.exports = function(config) {
    var conf = {
        method: 'GET',
        encoding: '',
        gzip: true
    };
    return new Promise(function(resolve, reject) {
        request(utils.extend(conf, config), function(error, response, body) {
            if (error) {
                reject(error);
            } else if (response.statusCode != 200) {
                reject(options.url + ': ' + response.statusCode);
            } else {
                resolve(body);
            }
        });
    });
};
