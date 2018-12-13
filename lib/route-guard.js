/* eslint-disable no-unused-vars */
const URI = require('urijs');
const hash = require('./generate-hash');

module.exports = function routeGuard(pluginOptions) {
  const opts = {
    unauthenticated: (url, redirect) => redirect(url),
    ...pluginOptions,
  };
  const { redirectUri, clientId } = opts;
  const uri = URI(opts.url).query({
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
    opts.unauthenticated(uri.toString(), redirect);
  };
};
