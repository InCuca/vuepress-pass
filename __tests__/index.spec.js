const path = require('path');
const fs = require('fs');
const preparator = require('./utils/preparator');
const getEnhancers = require('./utils/get-enhancers');
const getModuleFn = require('./utils/get-module-fn');

const docsBaseDir = path.resolve(__dirname, 'fixtures');
const doPrepare = preparator(docsBaseDir);

describe('Pass', () => {
  it('should not throw error', async () => {
    const docs = await doPrepare(docsBaseDir);
    docs.forEach(({ context, docsPath }) => {
      expect(context.sourceDir).toBe(docsPath);
    });
  });

  it('should add enhancer', async () => {
    const docs = await doPrepare();
    docs.forEach(({ context }) => {
      const enhancer = getEnhancers(context);
      const enhancerSrc = path.resolve(__dirname, '../lib/enhancer.js');
      expect(() => fs.readFileSync(enhancerSrc)).not.toThrow();
      expect(enhancer).toMatchObject({ items: expect.any(Array) });
      expect(enhancer.items).toContainEqual(
        expect.objectContaining({ value: enhancerSrc }),
      );
    });
  });

  it('should add vuepress-pass-options.js module', async () => {
    const docs = await doPrepare();
    docs.forEach(({ context }) => {
      const modules = getModuleFn(context).appliedItems;
      expect(modules).toContainEqual(
        expect.objectContaining({
          value: {
            name: 'vuepress-pass-options.js',
            content: expect.stringMatching(/^export const OPTIONS = /),
          },
        }),
      );
    });
  });
});
