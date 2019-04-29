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
    enhancer({
      Vue,
      options: {},
      router: { beforeEach },
      siteData: null
    });
  });

  it('does not add route guard if is being server rendered', () => {
    const Vue = createLocalVue();
    const beforeEach = jest.fn();
    enhancer({
      Vue,
      options: {},
      isServer: true,
      router: { beforeEach },
      siteData: null
    });
    expect(beforeEach).not.toHaveBeenCalled();
  });
});
