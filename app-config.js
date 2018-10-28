/**
* @description：
* @author: manble@live.com
*/

/**
 *
 * @param {string} node_env development|preview|production
 * @param {object} req
 * @returns object
 */
module.exports = function (node_env, req) {
    let config = {
        development: {
            mode: 0,
            origin: {
                client: '', // 值为 '' 时走node端代理，如果想使用本地mock将此值身为空字符串
                server: 'https://api.github.com' // node端请求，代理浏览器请求
            },
            apiProxyPrefix: '/api/proxy', // api数据接口通过node server代理时用，client设置为 ‘’ 时开启， /api/example > /api/proxy/api/example
            mockPrefix: '/mock' // /api/example > /mock/api/example， 通过 ?ismock=1 启用。
        },
        preview: {
            mode: 1,
            origin: {
                client: '//preview.example.com',
                server: 'http://preview.example.com'
            }
        },
        production: {
            mode: 2,
            origin: {
                client: 'https://api.github.com',
                server: 'https://api.github.com'
            }
        }
    };
    return Object.assign({
        px2rem: false,
    }, config[node_env]);
};