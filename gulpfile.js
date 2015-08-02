var gulp = require('gulp');
var csslint = require('gulp-csslint');
var htmlReporter = require('gulp-csslint-report');
var livereload = require('gulp-livereload');
var deploy = require('gulp-gh-pages');
var gulpkss = require('gulp-kss');
var gulpconcat = require('gulp-concat');
var phantomcss = require('gulp-phantomcss');
var argv = require('yargs').argv;
var jsonfile = require('jsonfile');
var clone = require('lodash.clone');

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
  var config,
      configfile,
      debug;

  configfile = typeof(argv.configfile) !== 'undefined' ? argv.configfile : false;
  if (configfile) {
    config = jsonfile.readFileSync(configfile);
  } else {
    config.tests = [{
      'page': typeof argv.page !== 'undefined' ? argv.page : '/',
      'selector': typeof argv.selector !== 'undefined' ? argv.selector : 'body'
    }];
  }

  config.url = 'http://' + (typeof argv.url !== 'undefined' ? argv.url : 'drupal8.dev');
  if (config.url.substr(-1) == '/') {
    config.url = config.url.substr(0, url.length - 1);
  }

  config.user = typeof argv.user !== 'undefined' ? argv.user : 'admin';
  config.password = typeof argv.password !== 'undefined' ? argv.password : 'admin';

  debug = typeof(argv.debug) !== 'undefined' ? 'debug' : 'error';

  config.tests.forEach(function (test) {
    var testConfig = clone(config);
    delete testConfig.tests;
    testConfig.page = test.page;
    testConfig.selector = test.selector;

    gulp.src('./phantomcss/testSinglePage.js')
      .pipe(phantomcss({
        screenshots: './phantomcss/references',
        failures: './phantomcss/failures',
        logLevel: debug,
        drupalTestConfig: testConfig
      }));
  });
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
