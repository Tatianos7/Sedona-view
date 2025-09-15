const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const browserSync = require('browser-sync').create();

const config = {
  src: './src',
  dest: './docs',
  sass: {
    outputStyle: 'expanded',
    includePaths: ['src/scss']
  }
};

function clean() {
  return del([`${config.dest}/**`, `!${config.dest}`]);
}

function compileSass() {
  return src(`${config.src}/scss/**/*.scss`)
    .pipe(sass(config.sass).on('error', sass.logError))
    .pipe(dest(`${config.dest}/css`))
    .pipe(browserSync.stream());
}


function copyHtml() {
  return src(`${config.src}/*.html`)
    .pipe(dest(config.dest))
    .pipe(browserSync.stream());
}

function copyImages() {
  return src(`${config.src}/images/**/*`)
    .pipe(dest(`${config.dest}/images`));
}

function serve() {
  browserSync.init({
    server: config.dest,
    notify: false,
    open: false
  });

  watch(`${config.src}/scss/**/*.scss`, compileSass).on('change', browserSync.reload);
  watch(`${config.src}/*.html`, copyHtml).on('change', browserSync.reload);
  watch(`${config.src}/images/**/*`, copyImages).on('change', browserSync.reload);
}


exports.build = series(clean, parallel(compileSass, copyHtml, copyImages));
exports.serve = series(clean, parallel(compileSass, copyHtml, copyImages), serve);
exports.default = exports.serve;

