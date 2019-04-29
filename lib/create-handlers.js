const URI = require('urijs');

/* eslint-disable no-param-reassign */
module.exports = OPTIONS => ({
  authenticated: (query) => {
    OPTIONS.authState = URI(query.replace('#', '?')).query();
    console.log(OPTIONS);
  },
});
