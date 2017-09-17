/**
 * @description：
 * @author: manble@live.com
 */
'use strict';

import request from 'utils/request';

module.exports = {
    info: (userId) => (request.get('/api/user/info', {userId}))
};