/* eslint-disable no-unused-vars */
const URI = require('urijs');

module.exports = function routeGuard(options) {
  const opts = {
    unauthenticated: (url, redirect) => redirect(url),
    ...options,
  };
  const { redirectUri, clientId } = opts;
  const uri = URI(opts.url).query({
    redirectUri,
    clientId,
  });
  return (to, from, next) => {
    const redirect = (url) => {
      next(url);
    };
    opts.unauthenticated(uri.toString(), redirect);
  };
};
