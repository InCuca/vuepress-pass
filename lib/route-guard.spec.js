/* eslint-disable no-new */
const VueRouter = require('vue-router');
const URI = require('urijs');
const routeGuard = require('./route-guard');

jest.mock('./generate-hash', () => () => 'foo');

const createRoutes = () => ([
  { path: '/', component: { render: h => h('div') } },
]);

const createOptions = opts => ({
  ...opts,
  url: 'https://foo.bar/oauth',
  redirectUri: 'https://foo.bar/callback',
  clientId: 'foo',
});

describe('route-guard', () => {
  it('calls unauthenticated callback', async () => {
    const options = createOptions({
      unauthenticated: jest.fn(),
    });
    const router = new VueRouter(createRoutes());
    router.beforeEach(routeGuard(options));
    router.push('/');

    const expectedUri = URI(options.url).query({
      response_type: 'token',
      state: 'foo',
      redirectUri: options.redirectUri,
      clientId: options.clientId,
    });
    expect(options.unauthenticated).toBeCalledWith(
      expectedUri.toString(),
      expect.any(Function),
    );
  });
});
