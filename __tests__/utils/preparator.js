const path = require('path');
const { fs } = require('@vuepress/shared-utils');
const { createApp } = require('@vuepress/core');

module.exports = docsBaseDir => () => {
  const docsModeNames = fs.readdirSync(docsBaseDir);

  const docsModes = docsModeNames.map((name) => {
    const docsPath = path.resolve(docsBaseDir, name);
    const docsTempPath = path.resolve(docsPath, '.vuepress/.temp');
    return { name, docsPath, docsTempPath };
  });

  return Promise.all(docsModes.map(async ({ docsPath, docsTempPath }) => {
    await fs.ensureDir(docsTempPath);
    const context = createApp({
      sourceDir: docsPath,
      theme: '@vuepress/theme-default',
      temp: docsTempPath,
    });
    await context.process();
    return { context, docsPath };
  }));
};
