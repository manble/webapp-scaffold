/**
 * @description：
 * @author: manble@live.com
 */
'use strict';

import request from 'utils/request';

export default {
    example: (q = 'language:javascript', sort = 'stars') => request.get('/search/repositories', { q, sort })
};