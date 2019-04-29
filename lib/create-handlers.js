const URI = require('urijs');

/* eslint-disable no-param-reassign */
module.exports = OPTIONS => ({
  authenticated: (query, next) => {
    OPTIONS.authState = URI(query.replace('#', '?')).query(true);
    next('/');
  },
});
