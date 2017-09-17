/**
 * @description：
 * @author: manble@live.com
 */
'use strict';

const request = require('../utils/request');

module.exports = {
    newsList: (req, pageNo = 1, pageSize = 20) => {
        return request.get({
            uri: '/api/index/news', qs: {
                pageNo,
                pageSize,
            }
        }, req).then((res) => {
            if(res.code == 200) {
                return res;
             } else { throw `${JSON.stringify(res)}` }
        });
    }
};