/**
 * @description：
 * @author: manble@live.com
 */
'use strict';
const gulp = require('gulp');
const runSequence = require('run-sequence');
const spritesmith = require('gulp.spritesmith');
const newer = require('gulp-newer');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rev = require('gulp-rev');
const revReplace = require("gulp-rev-replace");
const del = require('del');
const gls = require('gulp-live-server');
const webpack = require("webpack");

const devConf = require('./dependencies/conf');

let mode = 'development';
let runServer = () => {
    let server = gls('app.js', undefined, process.env.LIVE_RELOAD_PORT);
    server.start();
    return server;
};

gulp.task('del', (cb) => {
    return del(devConf.del);
});

gulp.task('copy:img', (cb) => {
    let conf = devConf.copyImg;
    return gulp.src(conf.src).pipe(gulp.dest(conf.dist));
});

gulp.task('sprite', (cb) => {
    let conf = devConf.sprite,
        spriteData = null;
    let config = require('./dependencies/sprite')(conf);

    Object.keys(config).forEach(function (key) {
        let item = config[key];
        spriteData = gulp.src(item.src).pipe(spritesmith(item)).pipe(gulp.dest(conf.dist));
    });
    return spriteData;
});

gulp.task('scss2css', (cb) => {
    let conf = devConf.scss2css;
    return gulp
        .src(conf.src)
        .pipe(newer(conf.dist))
        .pipe(sass({
                includePaths: conf.includePaths,
                outputStyle: 'expanded',
                sourceComments: true
            })
            .on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['chrome >= 34', 'ios >= 7', 'android >= 2.0']
        }))
        .pipe(require('./dependencies/cssMinify')({}, mode))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('webpack', (cb) => {
    webpack(require('./dependencies/webpack')(devConf.webpackjs, mode), function (err, stats) {
        if (err || stats.hasErrors()) {
            let errors = [err];
            !err && (errors = stats.toJson({
                errorDetails: true
            }).errors);
            errors.map((error) => {
                console.log('----------------- webpack error --------------------\n', error);
            });
            if (mode != 'development') {
                process.exit();
                return;
            }
        }
        cb();
    });
});

gulp.task('cssjs:img2base64', (cb) => {
    let conf = devConf.img2base64.cssjs;
    return gulp.src(conf.src)
        .pipe(img2base64())
        .pipe(gulp.dest(conf.dist));
});

gulp.task('ejs:img2base64', (cb) => {
    let conf = devConf.img2base64.ejs;
    return gulp.src(conf.src)
        .pipe(img2base64())
        .pipe(gulp.dest(conf.dist));
});

gulp.task("rev:img", (cb) => {
    let conf = devConf.revImg;
    return gulp.src(conf.src, {
        base: conf.base
    }).pipe(rev()).pipe(gulp.dest(conf.build)).pipe(rev.manifest()).pipe(gulp.dest(conf.dist));
});

gulp.task("rev:css-js", (cb) => {
    let conf = devConf.revCssJs;
    return gulp.src(conf.src, {
        base: conf.base
    }).pipe(rev()).pipe(gulp.dest(conf.build)).pipe(rev.manifest()).pipe(gulp.dest(conf.dist));
});

gulp.task('replace:img-hash', (cb) => {
    let conf = devConf.replaceImgHash;
    let manifest = gulp.src(conf.manifest);
    return gulp.src(conf.src)
        .pipe(revReplace({
            manifest: manifest,
            prefix: devConf.cdn
        }))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('replace:css-js-hash', (cb) => {
    let conf = devConf.replaceCssJsHash;
    let manifest = gulp.src(conf.manifest);
    return gulp.src(conf.src)
        .pipe(revReplace({
            replaceInExtensions: conf.replaceInExtensions,
            manifest: manifest,
            prefix: devConf.cdn
        }))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('ftp', (cb) => {
    const ftp = require('./dependencies/ftp');
    ftp(() => {
        cb();
    });
});

gulp.task('common', (cb) => {
    runSequence(['del'], ['copy:img'], ['sprite'], ['scss2css'], ['webpack'], () => {
        cb();
    });
});

gulp.task('advance', (cb) => {
    runSequence(['common'], ['cssjs:img2base64'], ['rev:img'], ['replace:img-hash'], ['rev:css-js'], ['replace:css-js-hash'], ['ejs:img2base64'], ['ftp'], () => {
        cb();
    });
});

//
gulp.task('dev', () => {
    let conf = devConf.watch;
    mode = 'development';
    /--prod/.test(process.argv.slice(2)[1]) && (mode = 'compress');
    runSequence(['common'], () => {
        let server = runServer();
        const watch = require('chokidar').watch;
        [
            [conf.restart, () => {server.start.bind(server)();}],
            [conf.notify, (file) => {server.notify(file);}],
            [conf.sprite, ['sprite']],
            [conf.copyImg, ['copy:img']],
            [conf.scss2css, ['scss2css']],
            [conf.webpackjs, ['webpack']]
        ].map((item) => {
            let exec = (file) => {typeof item[1] == 'function' ? item[1](file) : gulp.start(item[1]);};
            watch(item[0], { ignoreInitial: true}).on('all', (event, path) => {exec({type: 'added',path});});
        });
    });
});

gulp.task('preview', (cb) => {
    let task = 'common';
    mode = 'compress';
    /--cdn/.test(process.argv.slice(2)[1]) && (task = 'advance');
    runSequence([`${task}`], () => {
        cb();
    });
});

gulp.task('production', (cb) => {
    mode = 'compress';
    runSequence(['advance'], () => {
        cb();
    });
});