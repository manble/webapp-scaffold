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
var isDev = false;
var isRelease = false;
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
    var config = require('./dependencies/sprite.js')(conf);

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
                outputStyle: isDev ? 'expanded' : 'compressed',
                sourceComments: isDev ? true : false
            })
            .on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['chrome >= 34', 'ios >= 7', 'android >= 2.0']
        }))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('webpack', function(cb) {
    webpack(require('./dependencies/webpack.js')(devConf.webpackjs, env), function(err, stats) {
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

gulp.task('ftp', function() {
    require('./dependencies/ftp.js')(function() {
        isRelease && runServer();
    });
});

gulp.task('html', function() {
    require('./dependencies/html.js')(function() {});
});

//
gulp.task('dev', function() {
    var conf = devConf.watch;
    isDev = true;
    isRelease = false;
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
    isDev = false;
    isRelease = false;
    env = 'preview';
    runSequence(
        ['del'], ['copy:img'], ['sprite'], ['scss2css'], ['webpack'],
        function() {
            runServer();
        });
});

gulp.task('cdn', function() {
    isDev = false;
    isRelease = false;
    env = 'production';
    runSequence(
        ['del'], ['copy:img'], ['sprite'], ['scss2css'], ['webpack'], ['rev:img'], ['replace:img-hash'], ['rev:css-js'], ['replace:css-js-hash'], ['ftp'],
        function() {});
});

gulp.task('release', function() {
    isDev = false;
    isRelease = true;
    env = 'production';
    runSequence(
        ['cdn'],
        function() {});
});