const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const browserSync = require('browser-sync').create();

// Конфигурация
const config = {
  src: './src',
  dest: './docs',
  sass: {
    outputStyle: 'expanded',
    includePaths: ['src/scss']
  }
};

// Очистка только при первом запуске
function clean() {
  return del([`${config.dest}/**`, `!${config.dest}`]);
}

// Компиляция Sass с кешированием
function compileSass() {
  return src(`${config.src}/scss/**/*.scss`)
    .pipe(sass(config.sass).on('error', sass.logError))
    .pipe(dest(`${config.dest}/css`))
    .pipe(browserSync.stream());
}

// Копирование HTML
function copyHtml() {
  return src(`${config.src}/*.html`)
    .pipe(dest(config.dest))
    .pipe(browserSync.stream());
}

// Сервер с автообновлением
function serve() {
  browserSync.init({
    server: config.dest,
    notify: false,
    open: false
  });

  watch(`${config.src}/scss/**/*.scss`, compileSass).on('change', browserSync.reload);
  watch(`${config.src}/*.html`, copyHtml).on('change', browserSync.reload);
}

// Задачи
exports.build = series(clean, parallel(compileSass, copyHtml));
exports.serve = series(clean, parallel(compileSass, copyHtml), serve);
exports.default = exports.serve;

// const { src, dest, watch, series } = require('gulp');
// const sass = require('gulp-sass')(require('sass'), { // Объединяем настройки здесь
//   outputStyle: 'expanded',
//   includePaths: ['src/scss', 'node_modules']
// });
// const deleteAsync = require('del');

// // Очистка папки docs
// function clean() {
//   return deleteAsync(['docs/**', '!docs']);
// }

// // Компиляция SCSS в CSS
// function compileSass() {
//   return src('src/scss/main.scss')
//     .pipe(sass().on('error', sass.logError)) // Настройки уже переданы выше
//     .pipe(dest('docs/css'));
// }

// // Остальные функции без изменений
// function copyHtml() {
//   return src('src/*.html')
//     .pipe(dest('docs'));
// }

// function watchFiles() {
//   watch('src/scss/**/*.scss', compileSass);
//   watch('src/*.html', copyHtml);
// }

// exports.default = series(clean, compileSass, copyHtml, watchFiles);
// exports.build = series(clean, compileSass, copyHtml);