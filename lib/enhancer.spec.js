const { createLocalVue } = require('@vue/test-utils');
const enhancer = require('./enhancer');
const { OPTIONS } = require('./__mocks__/@dynamic/vuepress-pass');

jest.mock('./route-guard', () => plgOpts => () => plgOpts);

describe('enhancer', () => {
  it('adds the route guard with given options', (done) => {
    const Vue = createLocalVue();
    const beforeEach = (guard) => {
      expect(guard()).toEqual(OPTIONS);
      done();
    };
    enhancer(Vue, {}, { beforeEach }, null);
  });
});
