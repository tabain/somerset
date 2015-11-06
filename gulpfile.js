'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');
var through = require('through2');
var path = require('path');

var baseDevDir = 'client/';
var baseLibs = 'public-debug/libs/';
var debugDevDir = 'public-debug/';
var distDevDir = 'public/';

var isDebugBuild = !(process.env.NODE_ENV == 'production');
var isProd = !isDebugBuild;

var copyDir = isDebugBuild ? debugDevDir : distDevDir;
var LOCALS = {
    isDebug: isDebugBuild,
    isProd: !isDebugBuild
};

var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

gulp.task('jshint', function () {
    return gulp.src([baseDevDir + 'js/*.js', baseDevDir + '*/js/**/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('images', function () {
    return gulp.src(baseDevDir + 'imgs/**/*')
        .pipe($.imagemin({
            progressive: true,
            interlaced: false
        }))
        .pipe(gulp.dest(copyDir + 'imgs'))
        .pipe($.size({title: 'imgs'}));
});
//$.cache(
gulp.task('fonts', function () {
    return gulp.src([baseDevDir + 'fonts/**'])
        .pipe($.changed(copyDir + 'fonts'))
        .pipe(gulp.dest(copyDir + 'fonts'))
        .pipe($.size({title: 'fonts'}));
});

gulp.task('assets', function () {
    return gulp.src([baseDevDir + 'assets/**'])
        .pipe($.changed(copyDir + 'assets'))
        .pipe(gulp.dest(copyDir + 'assets'))
        .pipe($.size({title: 'assets'}));
});

gulp.task('styles', function () {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src([
        baseDevDir + 'css/*.scss',
        baseDevDir + 'css/*.sass'
    ])
        .pipe($.changed('css', {extension: '.scss'}))
        .pipe($.changed('css', {extension: '.sass'}))
        .pipe($.sass({
            style: 'expanded',
            precision: 10,
            bundleExec: false
        }))
        .on('error', console.error.bind(console))
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(gulp.dest('.tmp/css'))
        // Concatenate And Minify Styles
        .pipe($.if('*.css', isProd ? $.csso() : $.util.noop()))
        .pipe(gulp.dest(copyDir + 'css'))
        .pipe($.size({title: 'css'}));
});

gulp.task('clean', del.bind(null, ['.tmp', copyDir]));

gulp.task('html', function () {

    var assets = $.useref.assets({searchPath: '{.tmp,static/debug}'});
    gulp.src([baseDevDir + 'views/**/*.jade'])
        .pipe($.jade({
            locals: LOCALS
        }))
        .on('error', $.util.log)
        .pipe(!isProd ? $.prettify({indent_size: 2}) : $.util.noop())
        .pipe(gulp.dest(copyDir + 'views'))

});

gulp.task('scripts', ['jshint'], function () {

    return gulp.src([
        baseDevDir + 'js/**/*.js',
        baseDevDir + 'js/*.js'
    ])
        .pipe(isProd ? $.uglify() : $.beautify({indentSize: 2}))
        .pipe($.size({title: 'js'}))
        .pipe(gulp.dest(copyDir + 'js'));

});


// Watch Files For Changes & Reload
gulp.task('watch', ['build'], function () {

    // TODO: Add watch for bower files
    // TODO: Add watch for responsive images
    // TODO: Add watch for audio and fonts
    //gulp.watch([debugDevDir + '**/*'], ['bower']);
    gulp.watch([baseDevDir + '**/views/**/*.jade',], ['html']);
    gulp.watch([baseDevDir + '**/css/**/*.{scss,css,sass}'], ['styles']);
    gulp.watch([baseDevDir + '**/js/*.js', baseDevDir + '**/js/**/*.js'], ['scripts']);
    gulp.watch([baseDevDir + '**/imgs/**/*', baseDevDir + '**/fonts/**/*'], ['images', 'fonts']);

});

gulp.task('build', ['assets', 'fonts', 'images'], function (cb) {
    runSequence('styles', ['scripts', 'html'], cb);
});
