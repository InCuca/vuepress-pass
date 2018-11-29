/* eslint-disable no-new */
const VueRouter = require('vue-router');
const URI = require('urijs');
const routeGuard = require('./route-guard');

const createRoutes = () => ([
  { path: '/', component: { render: h => h('div') } },
]);

describe('route-guard', () => {
  it('calls unauthenticated callback', async () => {
    const redirectUri = 'https://foo.bar/callback';
    const clientId = 'foo';
    const options = {
      url: 'https://foo.bar/oauth',
      redirectUri,
      clientId,
      unauthenticated: jest.fn(),
    };
    const router = new VueRouter(createRoutes());
    router.beforeEach(routeGuard(options));
    router.push('/');

    const expectedUri = URI(options.url).query({
      redirectUri,
      clientId,
    });
    expect(options.unauthenticated).toBeCalledWith(
      expectedUri.toString(),
      expect.any(Function),
    );
  });
});
