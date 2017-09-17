/**
 * @description：
 * @author: manble@live.com
 */
'use strict';

import request from 'utils/request';

module.exports = {
    newsList: (pageNo = 1, pageSize = 20) => (request.get('/api/index/news', {
        pageNo,
        pageSize,
    }))
};