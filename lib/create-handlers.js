const URI = require('urijs');

/* eslint-disable no-param-reassign */
module.exports = OPTIONS => ({
  authenticated: (query, next) => {
    if (typeof query === 'string') {
      // set authState in local storage
      OPTIONS.authState = URI(query.replace('#', '?')).query(true);
      console.log('authState set', OPTIONS.authState);
    } else {
      console.log('authState already set', OPTIONS.authState);
    }
    next('/');
  },
});
