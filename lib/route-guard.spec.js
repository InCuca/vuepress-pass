const VueRouter = require('vue-router');
const URI = require('urijs');
const routeGuard = require('./route-guard');

const routes = () => ([
  { path: '/' },
]);

describe('route-guard', () => {
  it('calls unauthenticated callback', () => {
    const router = new VueRouter(routes());
    const redirectUri = 'https://foo.bar/callback';
    const clientId = 'foo';
    const options = {
      url: 'https://foo.bar/oauth',
      redirectUri,
      clientId,
      unauthenticated: jest.fn(),
    };

    router.beforeEach(routeGuard(options));

    const expectedUri = URI(options.url).query({
      redirectUri,
      clientId,
    });
    expect(options.unauthenticated).toBeCalledWith(
      expectedUri.toString(),
    );
  });
});
