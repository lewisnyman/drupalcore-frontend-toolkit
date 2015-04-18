var slug = require('slug'),
    args = JSON.parse(casper.cli.args),
    config = args.drupalTestConfig;

slug.charmap['/'] = '-';
slug.charmap['#'] = '-';

casper.start(config.url + config.page);

casper
  .then(function() {
    var status = this.status(false);
    if (status.currentHTTPStatus === 403) {
      login();
    } else {
      takeScreenshot();
    }
  });

casper.run();

function login() {
  casper
    .thenOpen(config.url + '/user/login')
    .then(function() {
      // Wait for the form to be rendered
      casper
        .waitForSelector("form#user-login-form input", function() {
          // Fill and submit the form
          casper.fill('form#user-login-form', {
            'name': config.user,
            'pass': config.password
          }, true);
        }, true)
        .then(function() {
          // Check if we could log in.
          if (this.exists('.messages.messages--error')) {
            this.die('Login failed, check login data');
          }
        })
        // Finally go the the page and take the screenshot.
        .thenOpen(config.url + config.page)
        .then(function() {
          takeScreenshot();
        });
    })
}

function takeScreenshot() {
  casper.then(function() {
    var title = config.page;

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
    if (config.selector !== 'body') {
      title = title + '--' + slug(config.selector);
    }

    phantomcss.screenshot(config.selector, 0, '', 'screenshot--' + title);
  })
}