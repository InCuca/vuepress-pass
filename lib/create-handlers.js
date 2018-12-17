/* eslint-disable no-param-reassign */
module.exports = OPTIONS => ({
  authenticated: (query) => {
    OPTIONS.authState = query;
  },
});
