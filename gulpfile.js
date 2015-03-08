var gulp = require('gulp');
var csslint = require('gulp-csslint');
var htmlReporter = require('gulp-csslint-report');
var livereload = require('gulp-livereload');
var deploy = require('gulp-gh-pages');
var gulpkss = require('gulp-kss');
var gulpconcat = require('gulp-concat');

// Config
var cssfiles = ['../core/modules/**/*.css', '../core/themes/**/*.css', '/../core/misc/**/*.css'];
var styleguidecssfiles = [ '/../core/misc/**/*.css', '../core/modules/**/*.css', '../core/themes/seven/**/*.css'];

gulp.task('csslint', function() {
  gulp.src(cssfiles)
    .pipe(csslint('../.csslintrc'))
    .pipe(csslint.reporter());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(cssfiles, ['reloadcss']);
});

gulp.task('reloadcss', function(vinyl) {
  gulp.src(cssfiles)
    .pipe(livereload());
});

gulp.task('styleguide', function(vinyl) {
  gulp.src(styleguidecssfiles)
  .pipe(gulpkss({
        overview: '../core/themes/seven/css/styleguide.md'
    }))
    .pipe(gulp.dest('build/styleguide/'));
  gulp.src(styleguidecssfiles)
    .pipe(gulpconcat('public/style.css'))
    .pipe(gulp.dest('build/styleguide/'));
});

gulp.task('default', function () {
});

/**
 * Build an HTML report in the `build` directory.
 */
gulp.task('report', function() {
  gulp.src(cssfiles)
  .pipe(csslint('../.csslintrc'))
  .pipe(htmlReporter({
    filename: 'index.html',
    directory: './build/'
  }));
});

/**
 * Deploy the built HTML report to GitHub Pages.
 */
gulp.task('deploy', function() {
  return gulp.src('./build/**/*').pipe(deploy());
});
