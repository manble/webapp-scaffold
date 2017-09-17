/**
* @description：
* @author: manble@live.com
*/
'use strict';
const callbacksMap = {},
    on = function(key, callback, context, flag) {
        let callbacks,
            bind = function(key) {
                callbacks = callbacksMap[key] || [];
                callback.context = context || null;
                callbacks.push(flag ? function(res) {
                    callback.call(context || null, res);
                    return 'del';
                } : callback);
                callbacksMap[key] = callbacks;
            };
        if (typeof callback == 'function') {
            if (typeof key == 'string') {
                bind(key);
            } else if (Object.prototype.toString.call(key) == '[object Array]') {
                for (let i = 0, l = key.length; i < l; i++) {
                    let item = key[i];
                    typeof item == 'string' && bind(item);
                }
            }
        }
    };

let Observer = function() {};
Observer.prototype = {
    on: function(key, callback, context) {
        on(key, callback, context);
    },

    once: function(key, callback, context) {
        on(key, callback, context, 1);
    },

    off: function(key, callback, context) {
        let i, callBacks = callbacksMap[key] || [];
        callback.context = context || null;
        for (i = callBacks.length - 1; i >= 0; i--) {
            if (callback === callBacks[i]) {
                callBacks.splice(i, 1);
                break;
            }
        };
    },

    emit: function(key, res) {
        let callback, callbacks = callbacksMap[key] || [],
            i = 0,
            l = callbacks.length;
        for (i; i < l; i++) {
            callback = callbacks[i];
            try {
                if (callback.call(callback.context || null, res) === 'del') {
                    callbacks.splice(i, 1);
                    i--;
                    l--;
                }!callbacks.length && (delete callbacksMap[key]);
            } catch (e) {
                typeof(window.console || {}).error == 'function' && console.error('Error in emit: \n' + '%ckey: ' + key, 'background: #222; color: #FFFF00;', '\nfunc: ', callback.toString(), '\n\n', e, e.stack);
            }
        }
    }
};

Observer = typeof Observer == 'function' ? new Observer() : Observer;

export default Observer;