/**
* @description：
* @author: manble@live.com
*/
'use strict';
var Char = {
    // 生成长度为4的随机字符
    s4: function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },

    // strLen('测试test') == 8
    // strLen('测试test', true) == 6
    strLen: function(str, equal) {
        str = (str || '').replace(/^\s*/, '').replace(/\s*$/, '');
        return (equal ? str : str.replace(/[^\x00-\xff]/g, '**')).length;
    },

    // encodeHtml('<p>') == '&lt;p&gt;'
    encodeHtml: function(str) {
        str && (str = str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;'));

        return str || '';
    },

    // encodeHtml('&lt;p&gt;') == '<p>'
    decodeHtml: function(str) {
        var arr = [
                ['&amp;', '&'],
                ['&lt;', '<'],
                ['&gt;', '>'],
                ['&quot;', '"'],
                ['&apos;', '\'']
            ],
            i = arr.length;

        if (str) {
            while (i--) {
                str = str.replace(new RegExp(arr[i][0], "g"), arr[i][1]);
            }
        }

        return str || '';
    },

    // equal ? 一个中文等于一个英文 : 一个中文等于两个英文字符
    // subStr('中国<p>--&lt;p&gt;', 6, true) == '中国<p...'
    // subStr('中国<p>--&lt;p&gt;', 6, true, true) == '中国<p>-...'
    subStr: function(str, len, flag, equal) {
        var str = str || '',
            strLen = str.length,
            count = 0,
            newStr = '';
        if (len >= strLen) {
            return str;
        } else {
            for (var i = 0; i < strLen; i++) {
                var item = str.charAt(i);
                if (count < len) {
                    newStr += item;
                    !equal && /[^\x00-\xff]/.test(item) ? (count += 2) : (count += 1);
                } else {
                    break;
                }
            }
        }
        return newStr + (flag ? '...' : '');
    },

    // equal ? 一个中文等于一个英文 : 一个中文等于两个英文字符
    // subStrEncode('中<p>--&lt;p&gt;-- <p>', 6, true) == '中国&lt;p...'
    // subStrEncode('中<p>--&lt;p&gt;-- <p>', 6, true, true) == '中国&lt;p&gt;-...'
    // decode ==> 截取 ==> encode
    subStrEncode: function(str, len, flag, equal) {
        var decodeStr = this.decodeHtml(str),
            realLen = decodeStr.length,
            count = 0,
            newStr = '';
        if (len >= realLen) {
            return str;
        } else {
            newStr = this.subStr(decodeStr, len, flag, equal);
        }
        return this.encodeHtml(newStr);
    }
};
export default Char;