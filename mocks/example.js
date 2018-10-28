/**
* @description：
* @author: manble@live.com
* @example: http://mockjs.com/examples.html
*/

'use strict';
const mockjs = require('mockjs');
const { mock, Random } = mockjs;


module.exports = params => {
   const data = mock({
      'code': 200,
      'data': {
         'boolean|1': true,
         'test|1-3': 'test ',
         'strs': '@string(1, 15)',
         'number|+1': 100,
         'list|3': [{
            'id': '@id',
            'num|1-100.1-2': 1
         }]
      }
   });
   return data;
};