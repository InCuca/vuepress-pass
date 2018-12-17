/* eslint-disable no-unused-vars */
const URI = require('urijs');
const hash = require('./generate-hash');

module.exports = function routeGuard(pluginOptions) {
  const opts = {
    unauthenticated: (url, redirect) => redirect(url),
    authenticated: (to, next) => next(),
    ...pluginOptions,
  };
  const { redirectUri, clientId } = opts;
  const unauthURI = URI(opts.url).query({
    response_type: 'token',
    state: hash(),
    redirectUri,
    clientId,
  });
  return (to, from, next) => {
    const redirect = (url) => {
      next(false);
      global.window.location.assign(url);
    };
    if (opts.authState) {
      opts.authenticated(to.query);
      next();
    } else {
      opts.unauthenticated(unauthURI.toString(), redirect);
    }
  };
};
