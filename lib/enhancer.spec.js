const { createLocalVue } = require('@vue/test-utils');
const enhancer = require('./enhancer');
const { OPTIONS } = require('./__mocks__/@dynamic/vuepress-pass');

jest.mock('./create-handlers', () => () => ({ foo: 'bar' }));
jest.mock('./route-guard', () => plgOpts => () => plgOpts);

describe('enhancer', () => {
  it('adds the route guard with given options', (done) => {
    const Vue = createLocalVue();
    const beforeEach = (guard) => {
      const guardOptions = guard();
      expect(guardOptions).toMatchObject({
        foo: 'bar',
        ...OPTIONS,
      });
      done();
    };
    enhancer(Vue, {}, { beforeEach }, null);
  });
});
