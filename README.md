# A frontend toolkit for working with Drupal core
## Install

1. Clone this repository into your local Drupal repository
2. Change directory into your newly cloned repo
3. Install dependancies

```
git clone https://github.com/lewisnyman/drupalcore-frontend-toolkit.git
cd drupalcore-frontend-toolkit
npm install
```

This package is intended to help developers who are working on frontend components of Drupal core. It includes the following commands:

```
gulp csslint
```

Lint all the CSS files in Drupal core, uses the rules defined in Drupal's .csslintrc.


```
gulp watch
```

Livereload CSS files when working on core. Requires the [LiveReload Google Chrome Extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en).

