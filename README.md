# VuePress Pass

[![Travis](https://img.shields.io/travis/InCuca/vuepress-pass/master.svg)](https://travis-ci.org/InCuca/vuepress-pass/branches)

> VuePress oAuth2 - Implicity Grant plugin

Another options (behind a proxy server): [Pomerium](https://www.pomerium.io), [Okta](https://scotch.io/tutorials/add-authentication-and-personalization-to-vuepress), [vuepress-pomerium](https://github.com/InCuca/vuepress-pomerium)

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
            setState(state) { localStorage.setItem('auth', state); }, // optional
            getState() { return localStorage.getItem('auth'); }, // optional
        }],
    ]
};
```

* **authenticated** is called when user comes back from provider authentication
* **unauthenticated** is called when user need's authentication on provide and will redirect (through redirect function)

[more details](https://vuepress.vuejs.org/plugin/using-a-plugin.html#using-a-plugin)
