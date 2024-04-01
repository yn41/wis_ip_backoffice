/**
 * Created by yuna on 2023-11-17.
 */
'use strict';
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const html = require('gulp-html-tag-include');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');


const paths = {
  port: '3000',
  input: './src/**/*',
  output: './dist/',
  html: {
    input: './src/html/**',
    output: './dist/html/'
  },
  style: {
    input: './src/scss/*.scss',
    output: './dist/css'
  },
  js: {
    input: './src/js/*.js',
    output: './dist/js/'
  }
};

function browserSync(done) {
  console.log("start sync...");
  browsersync.init({
    port: paths.port,
    server: {
      baseDir: paths.output
    },
    startPath: './html/index.html' 
  });
  done();
}


function htmlComp() {
  return gulp.src(paths.html.input)
    .pipe(html())
    .pipe(gulp.dest(paths.html.output))
    .pipe(browsersync.reload({stream: true}));
}

function sassComp(done) {
  gulp.src(paths.style.input, {sourcemaps: true})
    // .pipe(sass().on('error', sass.logError))
    // .pipe(autoprefixer())
    // .pipe(sass({outputStyle: 'expanded'})) //nested, expanded, compact, compressed
    // .pipe(sourcemaps.write())
    // .pipe(gulp.dest(paths.style.output))
    // .pipe(browsersync.reload({stream: true}));
  // // 압축버전 - 이버전은 소스맵이 안맞아서 배포용으로 따로 뺌
  gulp.src(paths.style.input, {sourcemaps: true})
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'compressed'})) //nested, expanded, compact, compressed
    // .pipe(gulp.dest(paths.style.output + '/min'))
    .pipe(gulp.dest(paths.style.output))
    .pipe(browsersync.reload({stream: true}));
  done();
}

function js() {
  return gulp.src(paths.js.input)
    // .pipe(gulp.dest(paths.js.output))
    // .pipe(uglify())
    .pipe(gulp.dest(paths.js.output))
    // .pipe(gulp.dest(paths.js.output + '/min'))
    .pipe(browsersync.reload({stream: true}));
}



function watchFiles() {
  gulp.watch(paths.html.input, htmlComp);
  gulp.watch(paths.style.input, sassComp);
  gulp.watch(paths.js.input, js);
}

// exports.default = gulp.series(gulp.parallel(htmlComp, sassComp, img, js, font), browserSync, watchFiles);
exports.default = gulp.series(gulp.parallel(htmlComp, sassComp, js), browserSync, watchFiles);