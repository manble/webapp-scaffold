/**
 * @description：
 * @author: manble@live.com
 */
import url from 'utils/url';

const myHeaders = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded'
});

const request = function (input, init) {
    return fetch(input, Object.assign({
        method: 'GET',
        headers: myHeaders,
        mode: 'cros',
        credentials: 'include'
    }, init));
};

const uri = (uri) => (!/https?:\/\//.test(uri) ? `${window.CONFIG.origin}${uri}` : uri);

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