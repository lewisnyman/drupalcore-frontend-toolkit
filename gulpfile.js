var gulp = require('gulp');
var csslint = require('gulp-csslint');

var cssfiles = ['../core/modules/**/*.css', '../core/themes/**/*.css', '/../core/misc/**/*.css'];

gulp.task('csslint', function() {
  gulp.src(cssfiles)
    .pipe(csslint('../.csslintrc'))
    .pipe(csslint.reporter());
});

gulp.task('default', function () {
});