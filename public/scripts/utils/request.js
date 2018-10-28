/**
 * @description：
 * @author: manble@live.com
 */
import url from 'utils/url';

const myHeaders = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded'
});

const request = function (input, init) {
    const originRegs = [new RegExp(`^https?:\/\/${location.host}`)];
    return fetch(input, Object.assign({
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        credentials: originRegs.some(reg => reg.test(input)) ? 'include' : 'omit'
    }, init));
};

const uri = uri => !/^(?:https?:)?\/\//.test(uri) ? (() => {
   let appConfig = process.env.CONFIG;
    if (appConfig.mode === 0) {
        if (/ismock=1/i.test(location.search)) {
            return `/mock${uri}`;
        }
        if (appConfig.origin.client === '') {
            return appConfig.apiProxyPrefix + uri;
        }
    }
    return appConfig.origin.client + uri;
})() : uri;

export default {
    get: async function (input, data = '', options = {
        isStr: false,
        init: {}
    }) {
        input = uri(input);
        let flag = data ? 1 : 0;
        let res = await request(`${input}${url.parse(data, flag)}`);
        return options.isStr ? res.text() : res.json();
    },
    post: async function (input, data, options = {
        isStr: false,
        init: {}
    }) {
        input = uri(input);
        let res = await request(input, {
            method: 'POST',
            body: url.parse(data)
        });
        return options.isStr ? res.text() : res.json();
    }
};