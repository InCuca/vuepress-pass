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

const createURI = options => URI(options.url).query({
  response_type: 'token',
  state: 'foo',
  redirectUri: options.redirectUri,
  clientId: options.clientId,
}).toString();

describe('route-guard', () => {
  it('calls unauthenticated callback', async () => {
    const options = createOptions({
      unauthenticated: jest.fn(),
    });
    const expectedUri = createURI(options);
    const router = new VueRouter(createRoutes());
    router.beforeEach(routeGuard(options));
    router.push('/');

    expect(options.unauthenticated).toBeCalledWith(
      expectedUri,
      expect.any(Function),
    );
  });

  it('redirects to auth URL', (done) => {
    const options = createOptions();
    const expectedURI = createURI(options);
    const router = new VueRouter(createRoutes());
    const success = jest.fn();
    const error = jest.fn();
    global.window.location.assign = jest.fn(() => {
      expect(success).not.toBeCalled();
      expect(global.window.location.assign).toBeCalledWith(
        expectedURI,
      );
      done();
    });

    router.beforeEach(routeGuard(options));
    router.push('/', success, error);
  });
});
