var gulp = require('gulp');
var csslint = require('gulp-csslint');
var htmlReporter = require('gulp-csslint-report');
var livereload = require('gulp-livereload');
var deploy = require('gulp-gh-pages');
var gulpkss = require('gulp-kss');
var gulpconcat = require('gulp-concat');
var phantomcss = require('gulp-phantomcss');
var argv = require('yargs').argv;

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

gulp.task('phantomcss', function () {
  var url,
      page,
      selector,
      user,
      password,
      debug;

  url = 'http://' + (typeof(argv.url) !== 'undefined' ? argv.url : 'drupal8.dev');
  if (url.substr(-1) == '/') {
    url = url.substr(0, url.length - 1);
  }

  page = typeof(argv.page) !== 'undefined' ? argv.page : '/';
  if (page.substr(0, 1) !== '/') {
    page = '/' + page;
  }

  selector = typeof(argv.selector) !== 'undefined' ? argv.selector : 'body';
  user = typeof(argv.user) !== 'undefined' ? argv.user : 'admin';
  password = typeof(argv.password) !== 'undefined' ? argv.password : 'admin';
  debug = typeof(argv.debug) !== 'undefined' ? 'debug' : 'error';

  gulp.src('./phantomcss/testSinglePage.js')
    .pipe(phantomcss({
      screenshots: './phantomcss/references',
      failures: './phantomcss/failures',
      logLevel: debug,
      drupalTestConfig: {
        'url': url,
        'page': page,
        'selector': selector,
        'user': user,
        'password': password
      }
    }));
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
