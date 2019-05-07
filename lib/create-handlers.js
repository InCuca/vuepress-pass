const URI = require('urijs');

module.exports = (setAuthState) => ({
  authenticated: (query, next) => {
    if (typeof query === 'string') {
      // set authState in local storage
      setAuthState(URI(query.replace('#', '?')).query(true));
    }
    next('/');
  },
});
