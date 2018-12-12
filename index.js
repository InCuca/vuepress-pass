/* eslint-disable no-unused-vars */
const path = require('path');

module.exports = (options, context) => ({
  enhanceAppFiles: [path.resolve(__dirname, 'lib/enhancer.js')],
  clientDynamicModules: () => ({
    name: 'vuepress-pass.js',
    content: `export const OPTIONS = ${JSON.stringify(options)}`,
  }),
});
