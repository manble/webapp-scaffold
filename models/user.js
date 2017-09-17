/**
 * @description：
 * @author: manble@live.com
 */
'use strict';

const request = require('../utils/request');

module.exports = {
    info: (req, userId) => {
        return request.get({
            uri: '/api/index/news', qs: {
                userId
            }
        }, req).then((res) => {
            if(res.code == 200) {
                return res;
             } else { throw `${JSON.stringify(res)}` }
        });
    }
};