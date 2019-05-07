const URI = require('urijs');

module.exports = (setAuthState) => ({
  authenticated: async (query, next) => {
    if (typeof query === 'string') {
      // set authState in local storage
      await setAuthState(URI(query.replace('#', '?')).query(true));
    }
    next('/');
  },
});
