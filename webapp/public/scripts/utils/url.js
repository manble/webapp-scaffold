/**
* @description：
* @author: manble@live.com
*/
'use strict';
var Url = {
    query: function(query) {
        var query, obj = {};
        query = query.substring(query.indexOf('?') + 1);
        query && query.split('&').forEach(function(item) {
            var kv = item.split('=');
            obj[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1])
        });
        return obj;
    },

    val: function(name) {
        var query = window.location.search;
        return query ? decodeURIComponent((query.substring(query.indexOf('?') + 1).match(new RegExp('(?:(?:^|&)' + name + '=)([^&]*)')) || ['', ''])[1]) : '';
    },

    parse: function(data, flag) {
        var arr = [];
        if (Object.prototype.toString.call(data) == "[object Object]") {
            for (var k in data) {
                data.hasOwnProperty(k) && arr.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
            }
            return flag ? '?' + arr.join('&') : arr.join('&');
        } else {
            return flag ? '?' + data : data;
        }
    }
};
export default Url;