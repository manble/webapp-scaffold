/**
* @description：配置文件
* @author: manble@live.com
*/
'use strict';
module.exports = {
    cdn: 'http://127.0.0.1:8080/webapp', //前端静态资源上传cdn，替换本地相对路径
    ftp: {
        connect: {
            host: "127.0.0.1",
            port: 21,
            user: "manble",
            password: "123456"
        },
        localDir: './build/',
        remoteDir: '/webapp/' // 上传静态资源目标目录(ftp://127.0.0.1:21/webapp/)
    },
    dist: './public/dist/',
    del: ['./build', './public/dist/**', './public/scss/includes/sprites/**', './views/release/', './rev-manifest.json'],
    sprite: {
        src: './public/images/sprites/',
        imgName: './public/dist/images/sprites/',
        cssName: './public/scss/includes/sprites/',
        cssTemplate: './dependencies/sprite.scss.template.handlebars',
        dist: './'
    },
    watch: {
        copyImg: ['./public/images/**/*'],
        sprite: ['./public/images/sprites/**/*'],
        scss2css: ['./public/scss/**/*.scss'],
        webpackjs: ['./public/scripts/**/*'],
        restart: ['./app.js', './routes/**/*.js', './models/*', './utils/**/*.js'],
        notify: ['./views/**/*.ejs','./public/images/**/*','./public/dist/styles/**/*.css','./public/dist/**/*.js']
    },
    webpackjs: {
        src: './public/scripts/pages/',
        regexp: /\/public\/scripts\/pages\/(.*)\.js$/
    },
    copyImg: {
        src: ['./public/images/**/*.png', '!./public/images/sprites/**/*.png'],
        dist: './public/dist/images'
    },
    scss2css: {
        src: ['./public/scss/**/*.scss', '!./public/scss/**/includes/**/*.scss'],
        includePaths: ['./public/scss/', './public/scss/includes', './public/scripts/'],
        dist: './public/dist/styles'
    },
    revImg: {
        src: ['./public/dist/images/**/*'],
        base: './public/dist/',
        build: './build/',
        dist: './'
    },
    revCssJs: {
        src: ['./public/dist/**', '!./public/dist/images', '!/public/dist/scripts/**/*.js.map'],
        base: './public/dist/',
        build: './build/',
        dist: './'
    },
    replaceImgHash: {
        src: ['./public/dist/**/*.css', './public/dist/**/*.js'],
        manifest: './rev-manifest.json',
        dist: './public/dist/'
    },
    replaceCssJsHash: {
        src: ['./views/**/*', '!./views/release/'],
        manifest: './rev-manifest.json',
        dist: './views/release/',
        replaceInExtensions: ['.js', '.css', '.html', '.hbs', '.ejs']
    }
};
