/* eslint-disable no-unused-vars */
const URI = require('urijs');
const localforage = require('localforage');
const hash = require('./generate-hash');

function isCallback(route, cbURL) {
  const cbURI = URI(cbURL);
  const cbPath = cbURI.path();
  const routeFullPath = URI.joinPaths(base, route.path).toString();
  return  cbPath === routeFullPath;
}

module.exports = function routeGuard(pluginOptions, base = '/') {
  const opts = {
    unauthenticated: (url, redirect) => redirect(url),
    authenticated: (_, next) => next('/'),
    setState: (state) => localforage.setItem('auth', state),
    getState: () => localforage.getItem('auth'),
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
    const authState = opts.getState();
    const redirect = (url) => {
      next(false);
      window.location.assign(url);
    };
    // console.log('route guard', opts);

    if (!authState && isCallback(to, opts.redirectUri, base)) {
      opts.authenticated(to.fullPath, next);
    } else if (authState) {
      opts.authenticated(authState, next);
    } else {
      opts.unauthenticated(unauthURI.toString(), redirect);
    }
  };
};
