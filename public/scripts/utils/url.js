/**
* @description：
* @author: manble@live.com
*/
'use strict';
const Url = {
   query: function(queryStr) {
      let query, obj = {};
      query = queryStr.substring(queryStr.indexOf('?') + 1);
      query && query.split('&').forEach(function(item) {
         let kv = item.split('=');
         obj[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1])
      });
      return obj;
   },

   val: function(name, url) {
      let query = url || window.location.search;
      return query ? decodeURIComponent((query.substring(query.indexOf('?') + 1).match(new RegExp('(?:(?:^|&)' + name + '=)([^&]*)')) || ['', ''])[1]) : '';
   },

   parse: function(data = '', flag) {
      let arr = [];
      if (Object.prototype.toString.call(data) == "[object Object]") {
         Object.keys(data).map((key) => {
            arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
         });
         return flag ? `?${arr.join('&')}` : arr.join('&');
      } else {
         return flag ? '?' + data : data;
      }
   }
};
export default Url;