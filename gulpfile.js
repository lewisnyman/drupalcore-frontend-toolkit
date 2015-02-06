var gulp = require('gulp');
var csslint = require('gulp-csslint');
var htmlReporter = require('gulp-csslint-report');
var livereload = require('gulp-livereload');
var deploy = require('gulp-gh-pages');

// Config
var cssfiles = ['../core/modules/**/*.css', '../core/themes/**/*.css', '/../core/misc/**/*.css'];

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

gulp.task('default', function () {
});

/**
 * Build an HTML report.
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
 * Deploy the built report to GitHub Pages.
 */
gulp.task('deploy', ['report'], function() {
  return gulp.src('./build/**/*')
  .pipe(deploy());
});
