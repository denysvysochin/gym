'use strict';

const gulp = require('gulp'),
    del = require('del'),
    babel = require('gulp-babel'),
    livereload = require('gulp-livereload'),
    connectLiveReload = require('connect-livereload'),
    express = require('express'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    gutil = require('gutil'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    less = require('gulp-less'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    ngAnnotate = require('gulp-ng-annotate'),
    stringify = require('stringify'),
    karma = require('karma');

gulp.task('default', ['build']);

gulp.task('build', ['scripts', 'scripts:hint', 'script','html', 'main', 'styles']);

gulp.task('styles', () => {
    return gulp.src('app/public/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/app/public/css'))
        .pipe(livereload());
});

/*gulp.task('scripts', () => {
    return gulp.src('app/main.js')
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});*/

gulp.task('scripts', () => {
    let b = browserify({
        entries: ['app/view/js/index.js'],
        cache: {},
        packageCache: {},
        debug: true
    });
    b.transform(babelify, {presets: ['es2015']});
    b.transform(stringify);
    b.on('error', gutil.log);
    b.on('time', gutil.log);

    return b.bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(ngAnnotate())
        //.pipe(uglify())
        .pipe(gulp.dest('dist/app/view/js'))
        .pipe(livereload());
});

gulp.task('scripts:hint', () => {
    return gulp.src(['app/view/js/modules/*.js'])
        .pipe(jshint({esnext: true}))
        .pipe(jshint.reporter(jshintStylish));
});

gulp.task('main', () => {
    return gulp.src('app/main.js')
        .pipe(gulp.dest('dist/app'))
        .pipe(livereload());
});

gulp.task('script', () => {
    return gulp.src('app/view/libs/*.js')
        .pipe(gulp.dest('dist/app/view/libs'))
        .pipe(livereload());
});

gulp.task('html', () => {
    return gulp.src('app/public/html/*.html')
        .pipe(gulp.dest('dist/app/public/html'))
        .pipe(livereload());
});
gulp.task('clean', () => {
    del(['dist'], cb);
});

/*gulp.task('watch', ['build', 'serve'], () => {
    livereload.listen();
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        autoWatch: false,
        singleRun: false
    }).start();

    gulp.task('test:run', ['scripts'], (done) => {
        karma.runner.run({
            configFile: __dirname + '/karma.conf.js'
        }, done);
    });

    gulp.watch('app/index.html', ['html']);
    gulp.watch(['app/js/!**!/!*.js', 'app/partials/!**!/!*', 'tests/!**!/!*.js'], ['scripts:hint', 'test:run']);
    gulp.watch('app/styles/!*.less', ['styles']);
});*/

/*gulp.task('serve', () => {
    express()
        .use(connectLiveReload())
        .use(express.static('dist'))
        .listen(4000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:4000');
        });
});

gulp.task('test', ['scripts'], (done) => {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        autoWatch: false,
        singleRun: true
    }, done).start();
});*/
