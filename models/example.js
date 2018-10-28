/**
 * @description：
 * @author: manble@live.com
 */
'use strict';

const request = require('../utils/request');

module.exports = {
    example: (req, type = 1) => {
        return request.get({
            uri: '/api/example', qs: {
                type
            }
        }, req).then((res) => {
            if(res.code == 200) {
                return res;
             } else { throw `${JSON.stringify(res)}` }
        });
    }
};