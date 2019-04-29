# VuePress Pass

[![Travis](https://img.shields.io/travis/InCuca/vuepress-pass/master.svg)](https://travis-ci.org/InCuca/vuepress-pass/branches)

> VuePress oauth2 plugin

## Usage

`npm i --save InCuca/vuepress-pass`

.vuepress/config.js:

```js
const Pass = require('vuepress-pass');

module.exports = {
  plugins: [
        [Pass, {
            url: 'https://foo.bar/oauth',
            redirectUri: 'https://foo.bar/callback',
            clientId: 'foobar',
            authenticated(redirectQuery, redirect) { redirect('/'); }, // optional
            unauthenticated(authQuery, redirect) { redirect(authQuery); }, // optional
        }],
    ]
};
```

* **authenticated** is called when user comes back from provider authentication
* **unauthenticated** is called when user need's authentication on provide and will redirect (through redirect function)

[more details](https://vuepress.vuejs.org/plugin/using-a-plugin.html#using-a-plugin)
