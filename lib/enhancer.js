/* eslint-disable no-unused-vars */

const beforeRouteHandler = require('./route-guard');

module.exports = (
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
) => {
  router.beforeEach(beforeRouteHandler);
};
