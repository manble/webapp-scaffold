/**
 * @description：
 * @author: manble@live.com
 */

'use strict';

let type = type => (data => (type === Object.prototype.toString.call(data).slice(8, -1)));

let isObject = type('Object');
let isFunction = type('Function');
let isArray = type('Array');
let isString = type('String');
let isNull = type('Null');

module.exports = {
    isObject,
    isFunction,
    isArray,
    isString,
    isNull
};