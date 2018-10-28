/**
 * @description：配置文件
 * @author: manble@live.com
 */
'use strict';
module.exports = {
    cdn: 'http://127.0.0.1:7777/webapp', //前端静态资源上传cdn，替换本地相对路径
    ftp: {
        connect: {
            host: '127.0.0.1',
            port: 21,
            user: 'manble',
            password: '123456'
        },
        localDir: './build/',
        remoteDir: '/webapp/' // 上传静态资源目标目录(ftp://127.0.0.1:21/webapp/)
    },
    dist: './dist/',
    del: ['./build', './dist/**', './public/scss/includes/sprites/**', './views/release/', './rev-manifest.json'],
    sprite: {
        src: './public/images/sprites/',
        imgName: './dist/images/sprites/',
        cssName: './public/scss/includes/sprites/',
        cssTemplate: './dependencies/sprite.scss.template.handlebars',
        dist: './'
    },
    watch: {
        sprite: ['./public/images/sprites/**/*'],
        scss2css: ['./public/scss/**/*.scss'],
        webpack: ['./public/scripts/**/*'],
        restart: ['./app.js', './app-config.js', './routes/**/*.js', './models/*', './utils/**/*.js', './mocks/**/*'],
        notify: ['./views/**/*.ejs', './public/images/**/*', './dist/styles/**/*.css', './dist/**/*.js']
    },
    webpack: {
        entry: {
            // common: ['vue', 'vue-router', 'vuex', 'whatwg-fetch']
            common: ['react', 'react-dom', 'redux', 'react-redux', 'react-router-dom', 'react-router-config', 'whatwg-fetch', 'react-addons-transition-group']
        },
        commonManifest: './dist/scripts/pages/common-manifest.json',
        src: './public/scripts/pages/',
        dist: './dist/scripts/pages/',
        public: '',
        regexp: /\/public\/scripts\/pages\/(.*)\.js$/
    },
    img2base64: {
        cssjs: {
            src: ['./dist/**/*', '!./dist/images/**/*'],
            dist: './dist/'
        },
        ejs: {
            src: ['./views/release/**/*'],
            dist: './views/release/'
        }
    },
    scss2css: {
        src: ['./public/scss/**/*.scss', '!./public/scss/includes/**/*.scss'],
        includePaths: ['./public/scss/', './public/scss/includes', './public/scripts/'],
        dist: './dist/styles'
    },
    revAssets: {
        src: ['./public/**/*', './dist/images/**/*', '!./public/scss/**/*', '!./public/scripts/**/*', '!./public/images/sprites/**/*', '!./public/images/base64/**/*'],
        base: './dist/',
        build: './build/',
        dist: './dist/'
    },
    revCssjs: {
        src: ['./dist/**', '!./dist/images', '!./dist/scripts/**/*.js.map', '!./dist/rev-manifest.json'],
        base: './dist/',
        build: './build/',
        dist: './dist/'
    },
    replaceCssJsHash: {
        src: ['./dist/**/*.css', './dist/**/*.js'],
        manifest: './dist/rev-manifest.json',
        dist: './dist/'
    },
    replaceEjsHash: {
        src: ['./views/**/*', '!./views/release/'],
        manifest: './dist/rev-manifest.json',
        dist: './views/release/',
        replaceInExtensions: ['.js', '.css', '.html', '.hbs', '.ejs']
    }
};