const gulp = require('gulp');
const watch = require('gulp-watch'); //watch files
const pump = require('pump'); //better error handling (fixes pipe)
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel'); //converts es6
const uglify = require('gulp-uglify'); //doesn't understand es6 -> needs babel
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const grep = require('gulp-grep-stream'); //exclude/include files & folders

/**
 * CONFIGURATION
 */
const _project_DIR = 'app';

const _source_DIR = {
    style: _project_DIR + '/scss/*.scss',
    html: _project_DIR + '/**/*.html',
    js: _project_DIR + '/js/src/**/*.js',
    img: _project_DIR + '/img/src/**/*'
}

const _destination_DIR = {
    style: _project_DIR + '/css',
    html: _project_DIR + '',
    js: _project_DIR + '/js/dist',
    img: _project_DIR + '/img/dist/'
}

const _watch_DIR = {
    style: _project_DIR + '/scss/**/*.scss',
    html: _project_DIR + '/**/*.html',
    js: _project_DIR + '/js/src/**/*.js',
    img: _project_DIR + '/img/src/**/*'
}

/**
 * TASKS
 */

gulp.task('html', function(cb) {
    return pump([
        gulp.src(_source_DIR.html),
        //validation
        gulp.dest(_destination_DIR.html),
        browserSync.stream()
    ], cb)
});

gulp.task('sass', function(cb) {
    return pump([
        gulp.src(_source_DIR.style),
        autoprefixer(),
        concat('main.css'),
        sass(),
        gulp.dest(_destination_DIR.style),
        browserSync.stream()
    ], cb)
});

gulp.task('js', function(cb) {
    return pump([
            gulp.src(_source_DIR.js),
            babel({
                presets: ['@babel/env']
            }),
            uglify(),
            concat('index.js'),
            minify(),
            gulp.dest(_destination_DIR.js),
            browserSync.stream()
        ],
        cb);
});

gulp.task('img', function(cb) {
    pump([
        gulp.src(_source_DIR.img),
        changed(_source_DIR.img),
        imagemin(),
        gulp.dest(_destination_DIR.img)
    ], cb);
});

gulp.task('serve', function() {
    browserSync.init({
        server: _project_DIR
    });

    gulp.watch(_watch_DIR.style, gulp.series('sass'));
    //gulp.watch(_watch_DIR.html, gulp.series('html'));
    gulp.watch(_watch_DIR.js, gulp.series('js'));
    gulp.watch(_watch_DIR.img, gulp.series('img'));
    gulp.watch(_watch_DIR.html).on('change', browserSync.reload);
});

/**
 * DEFAULT TASK
 */

gulp.task('default', gulp.series('serve'));