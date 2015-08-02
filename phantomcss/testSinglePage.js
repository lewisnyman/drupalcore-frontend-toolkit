var testPage = require('./testPage.js'),
    args = JSON.parse(casper.cli.args),
    config = args.drupalTestConfig;

casper.start(config.url);
testPage.test(casper, phantomcss, config);
casper.run();