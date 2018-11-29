/* eslint-disable no-unused-vars */
const path = require('path');

module.exports = (options, context) => ({
  enhanceAppFiles: [path.resolve(__dirname, 'lib/enhancer.js')],
});
