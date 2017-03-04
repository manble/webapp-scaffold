/**
 * @description：
 * @author: manble@live.com
 */
var gulp = require('gulp');
var runSequence = require('run-sequence');
var spritesmith = require('gulp.spritesmith');
var newer = require('gulp-newer');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");
var del = require('del');
var gls = require('gulp-live-server');
var webpack = require("webpack");

var devConf = require('./dependencies/conf.js');
var spriteConfig = require('./dependencies/sprite.js');
var webpackConfig = require('./dependencies/webpack.js');
var cssMinify = require('./dependencies/cssMinify.js');
var toHtml = require('./dependencies/html.js');
var ftp = require('./dependencies/ftp.js');

var env = 'development';
var runServer = function() {
    var server = gls('app.js', {
        env: {
            NODE_ENV: env
        }
    });
    server.start();
    return server;
};

gulp.task('del', function(cb) {
    return del(devConf.del);
});

gulp.task('copy:img', function(cb) {
    var conf = devConf.copyImg;
    return gulp.src(conf.src).pipe(gulp.dest(conf.dist));
});

gulp.task('sprite', function(cb) {
    var conf = devConf.sprite,
        spriteData = null;
    var config = spriteConfig(conf);

    Object.keys(config).forEach(function(key) {
        var item = config[key];
        spriteData = gulp.src(item.src).pipe(spritesmith(item)).pipe(gulp.dest(conf.dist));
    });
    return spriteData;
});

gulp.task('scss2css', function(cb) {
    var conf = devConf.scss2css;
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
        .pipe(cssMinify({}, env))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('webpack', function(cb) {
    webpack(webpackConfig(devConf.webpackjs, env), function(err, stats) {
        cb();
    });
});

gulp.task("rev:img", function(cb) {
    var conf = devConf.revImg;
    return gulp.src(conf.src, {
        base: conf.base
    }).pipe(rev()).pipe(gulp.dest(conf.build)).pipe(rev.manifest()).pipe(gulp.dest(conf.dist));
});

gulp.task("rev:css-js", function(cb) {
    var conf = devConf.revCssJs;
    return gulp.src(conf.src, {
        base: conf.base
    }).pipe(rev()).pipe(gulp.dest(conf.build)).pipe(rev.manifest()).pipe(gulp.dest(conf.dist));
});

gulp.task('replace:img-hash', function(cb) {
    var conf = devConf.replaceImgHash;
    var manifest = gulp.src(conf.manifest);
    return gulp.src(conf.src)
        .pipe(revReplace({
            manifest: manifest,
            prefix: devConf.cdn
        }))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('replace:css-js-hash', function(cb) {
    var conf = devConf.replaceCssJsHash;
    var manifest = gulp.src(conf.manifest);
    return gulp.src(conf.src)
        .pipe(revReplace({
            replaceInExtensions: conf.replaceInExtensions,
            manifest: manifest,
            prefix: devConf.cdn
        }))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('ftp', function(cb) {
    ftp(function() {
        cb();
    });
});

gulp.task('html', function(cb) {
    toHtml(function() {});
});

//
gulp.task('dev', function() {
    var conf = devConf.watch;
    env = 'development';
    runSequence(['del'], ['copy:img'], ['sprite'], ['scss2css'], ['webpack'], function() {
        var server = runServer();
        gulp.watch(conf.restart, function(file) {
            server.start.bind(server)();
        });
        gulp.watch(conf.notify, function(file) {
            server.notify.apply(server, [file]);
        });
        gulp.watch(conf.sprite, ['sprite']);
        gulp.watch(conf.scss2css, ['scss2css']);
        gulp.watch(conf.webpackjs, ['webpack']);
    });
});

gulp.task('preview', function() {
    env = 'preview';
    runSequence(
        ['del'], ['copy:img'], ['sprite'], ['scss2css'], ['webpack'],
        function() {
            runServer();
        });
});

gulp.task('cdn', function(cb) {
    env = 'production';
    runSequence(
        ['del'], ['copy:img'], ['sprite'], ['scss2css'], ['webpack'], ['rev:img'], ['replace:img-hash'], ['rev:css-js'], ['replace:css-js-hash'], ['ftp'],
        function() {
            cb();
        });
});

gulp.task('release', function() {
    runSequence(
        ['cdn'],
        function() {
            runServer();
        });
});
