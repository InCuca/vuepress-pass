const { createLocalVue } = require('@vue/test-utils');
const enhancer = require('./enhancer');
const routeGuard = require('./route-guard');

describe('enhancer', () => {
  it('adds the route guard', () => {
    const Vue = createLocalVue();
    const beforeEach = jest.fn();
    enhancer(Vue, {}, { beforeEach }, null);
    expect(beforeEach).toBeCalledWith(routeGuard);
  });
});
