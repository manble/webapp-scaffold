/**
* @description：
* @author: manble@live.com
*/
'use strict';
var dateTool = {
    //format(1480564800000, 'yyyy/MM/dd hh:mm:ss 第q季度') == 2016/12/01 12:00:00 第4季度
    format: function(timestamp, format) {
        var format = format || 'yyyy-MM-dd hh:mm:ss',
            list = (function(date) {
                return [
                    ['y+', date.getFullYear()],
                    ['M+', date.getMonth() + 1],
                    ['d+', date.getDate()],
                    ['h+', date.getHours()],
                    ['m+', date.getMinutes()],
                    ['s+', date.getSeconds()],
                    ['S+', date.getMilliseconds()],
                    ['q+', Math.floor((date.getMonth() + 3) / 3)]
                ];
            })(new Date(parseInt(timestamp) || 0));

        for (var i = 0, l = list.length; i < l; i++) {
            format = format.replace(new RegExp(list[i][0]), function(match) {
                var val = String(list[i][1]);
                !i && (val = val.substr(val.length - match.length));
                match.length > val.length && (val = '0' + val);
                return val;
            });
        }

        return format;
    },
    //
    toObj: function(timestamp) {
        var timestamp = parseInt(timestamp, 10) || 0,
            date = new Date(timestamp);
        return {
            year: date.getFullYear() || 0,
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        };
    },

    //timestamp('2016-12-01 12:00:00') == 1480564800000
    timestamp: function(date) {
        var list, str, item = [];
        if (date) {
            list = date.split(' ');
            for (var i = 0, l = list.length; i < l; i++) {
                /-/.test(list[i]) && (item = item.concat(list[i].split('-')));
                /:/.test(list[i]) && (item = item.concat(list[i].split(':')));
            }
            for (var j = 0; j < 6; j++) {
                item[j] = j == 1 ? (Number(item[j]) - 1) : Number(item[j]) || 0;
            }
        }
        return new Date(item[0], item[1], item[2], item[3], item[4], item[5]).getTime();

    },
    // time(100000) == 00:01:40
    time: function(milliseconds) {
        var hour, min, sec, ms = milliseconds;
        hour = parseInt(ms / (60 * 60 * 1000));
        ms = ms % (60 * 60 * 1000);
        min = parseInt(ms / (60 * 1000));
        ms = ms % (60 * 1000);
        sec = Math.floor(ms / 1000);
        (hour < 10) && (hour = '0' + hour);
        (min < 10) && (min = '0' + min);
        (sec < 10) && (sec = '0' + sec);

        return (hour + ':' + min + ':' + sec);
    },

    //计时(正计时，倒计时) 00:00:00 setInterval(function(){stopwatch(1480406800086)}, 1000);
    //end > start ? 正计时 : 倒计时
    stopwatch: function(start, end) {
        if (String(parseInt(start, 10)) == 'NaN') {
            return '';
        }
        end = String(parseInt(end, 10)) != 'NaN' ? end : new Date().getTime();

        return this.time(end - start);
    },

    //subtraction(1480406800086, '12:00:00') 根据时间戳返回距当日某个时间点的毫秒数
    subtraction: function(timestamp, time) {
        var timeObj = this.toObj(timestamp),
            list = time.split(':');

        return new Date(timeObj.year, timeObj.month - 1, timeObj.day, parseInt(list[0], 10) || 0, parseInt(list[1], 10) || 0, parseInt(list[2], 10) || 0).getTime() - timestamp;

    }
};


export default dateTool;