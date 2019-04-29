/* eslint-disable no-unused-vars */
const URI = require('urijs');
const hash = require('./generate-hash');

function isCallback(route, cbURL, base) {
  const cbURI = URI(cbURL);
  const cbPath = cbURI.path();
  const routeFullPath = URI.joinPaths(base, route.path).toString();
  console.log('isCallback?', cbPath, routeFullPath);
  return  cbPath === routeFullPath;
}

module.exports = function routeGuard(pluginOptions, base) {
  const opts = {
    unauthenticated: (url, redirect) => redirect(url),
    authenticated: (to, next) => next(),
    ...pluginOptions,
  };
  const { redirectUri, clientId } = opts;
  const unauthURI = URI(opts.url).query({
    response_type: 'token',
    state: hash(),
    redirect_uri: redirectUri,
    client_id: clientId,
  });
  return (to, from, next) => {
    const redirect = (url) => {
      next(false);
      window.location.assign(url);
    };
    if (isCallback(to, opts.redirectUri, base)) {
      console.log('isCallback');
      opts.authenticated(to.fullPath);
      next();
    } else {
      console.log('notCallback');
      opts.unauthenticated(unauthURI.toString(), redirect);
    }
  };
};
