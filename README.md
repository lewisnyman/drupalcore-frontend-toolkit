# A frontend toolkit for working with Drupal core
## Install

1. Clone this repository into your local Drupal repository
2. Change directory into your newly cloned repo
3. Install dependencies

```
git clone https://github.com/lewisnyman/drupalcore-frontend-toolkit.git
cd drupalcore-frontend-toolkit
npm install
```

This package is intended to help developers who are working on frontend components of Drupal core. It includes the following commands:

```
npm test
```

Lint all the CSS files in Drupal core, uses the rules defined in Drupal's .csslintrc.


```
npm start
```

Livereload CSS files when working on core. Requires the [LiveReload Google Chrome Extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en).


```
npm run report
```

Build an HTML report of the CSSLint logs in the `build` directory.

```
npm run styleguide
```

Generates an HTML styleguide, by parsing all KSS comments in core, in the `build/styleguide` directory.


```
npm run deploy
```

Will deploy the previously built CSSLint HTML report to the remote git
repository in the `gh-pages` branch.
