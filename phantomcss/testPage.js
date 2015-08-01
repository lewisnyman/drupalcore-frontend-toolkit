var require = patchRequire(require);
var slug = require('slug');
var utils = require('utils');

var testPage = function () {
  this.casper = null;
  this.config = {};
  slug.charmap['/'] = '-';
  slug.charmap['#'] = '-';
};

testPage.prototype.test = function (casper, phantomcss, config) {
  var responseHandler = function (response) {
    // This seems hacky, but casperjs is nasty and thats the only reliable way at the moment.
    if (response.status == 403) {
      this.casper.echo('Looks like we need to login...');
      this.login();
    } else if (response.status == 200 && response.url == this.config.url + this.config.page){
      this.casper.then(this.takeScreenshot.bind(this));
    }
  }
  this.casper = casper;
  this.phantomcss = phantomcss;
  this.config = config;
  if (this.config.page.substr(0, 1) !== '/') {
    this.config.page = '/' + this.config.page;
  }

  // We need to listen to the responses since thats the only reliable source to see if we are logged in.
  casper.on('http.status.403', responseHandler.bind(this));
  casper.on('http.status.200', responseHandler.bind(this));
  this.casper.thenOpen(this.config.url + this.config.page);
};

testPage.prototype.login = function () {
  var login = function () {
    // Wait for the form to be rendered
    casper
      .waitForSelector("form#user-login-form input", fillForm.bind(this), true)
      .then(function() {
        // Check if we could log in.
        if (this.exists('.messages.messages--error')) {
          this.casper.die('Login failed, check login data');
        } else {
          console.log('Login successful.');
        }
      })
      // Finally go the the page.
      .thenOpen(this.config.url + this.config.page);
  }
  var fillForm = function () {
    // Fill and submit the form
    this.casper.fill('form#user-login-form', {
      'name': this.config.user,
      'pass': this.config.password
    }, true);
  }

  this.casper
    .thenOpen(this.config.url + '/user/login')
    .then(login.bind(this));
};

testPage.prototype.takeScreenshot = function () {
  var takeScreenshot = function () {
    var title = this.config.page;

    // Remove the first slash
    if (title.substr(0, 1) === '/') {
      title = title.substr(1);
    }

    // Use "frontpage" for <front>
    if (title === '') {
      title = 'frontpage';
    }

    // Make sure we have only valid filenames.
    title = slug(title);

    // If we do not screenshot the whole page, we add the selector to the title.
    if (this.config.selector !== 'body') {
      title = title + '--' + slug(this.config.selector);
    }

    // If we do not screenshot the whole page, we add the selector to the title.
    if (typeof this.config.issue !== 'undefined') {
      title = this.config.issue + '--' + title;
    }

    this.phantomcss.screenshot(this.config.selector, 0, '', 'screenshot--' + title);
  };
  casper.then(takeScreenshot.bind(this));
};

module.exports = new testPage();