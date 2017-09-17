/**
* @description：
* @author: manble@live.com
*/

module.exports = function (node_env, req) {
    let config = {
        development: {
            mode: 0,
            origin: {
                client: '//dev.example.com',
                server: 'http://dev.example.com'
            }
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
                client: '//www.example.com',
                server: 'http://www.example.com'
            }
        }
    };
    return config[node_env];
};