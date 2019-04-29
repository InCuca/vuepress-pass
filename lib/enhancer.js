/* eslint-disable no-unused-vars */

/* eslint-disable import/no-unresolved */
const { OPTIONS } = require('@dynamic/vuepress-pass');
/* eslint-enable import/no-unresolved */

const routeGuard = require('./route-guard');
const createHandlers = require('./create-handlers');

module.exports = ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the vueOptions for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
  isServer, // true if is being server rendered
}) => {
  if (isServer) return;

  const beforeRouteHandler = routeGuard({
    ...createHandlers(Vue),
    ...OPTIONS,
  });
  router.beforeEach(beforeRouteHandler);
};
