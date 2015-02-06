var gulp = require('gulp');
var csslint = require('gulp-csslint');
var livereload = require('gulp-livereload');

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