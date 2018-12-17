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

const createAuthURI = options => URI(options.url).query({
  response_type: 'token',
  state: 'foo',
  redirectUri: options.redirectUri,
  clientId: options.clientId,
}).toString();

const createRedirectURI = (path, params) => URI(path)
  .query(params)
  .toString();

describe('route-guard', () => {
  it('calls unauthenticated callback', () => {
    const options = createOptions({
      unauthenticated: jest.fn(),
    });
    const expectedUri = createAuthURI(options);
    const router = new VueRouter(createRoutes());
    router.beforeEach(routeGuard(options));
    router.push('/');

    expect(options.unauthenticated).toBeCalledWith(
      expectedUri,
      expect.any(Function),
    );
  });

  it('does not calls unauthenticated if authState is set', () => {
    const options = createOptions({
      unauthenticated: jest.fn(),
      authState: true,
    });
    const router = new VueRouter(createRoutes());
    router.beforeEach(routeGuard(options));
    router.push('/');

    expect(options.unauthenticated).not.toBeCalled();
  });

  it('redirects to auth URL', (done) => {
    const options = createOptions();
    const expectedURI = createAuthURI(options);
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

  it('calls authenticated callback', (done) => {
    const error = jest.fn();
    const success = jest.fn(() => {
      expect(error).not.toBeCalled();
      done();
    });
    const expectedPath = '/oauth/redirect';
    const expectedParams = {
      access_token: 'foo',
      token_type: 'bearer',
      state: 'bar',
    };
    const options = createOptions({
      authState: expectedParams,
      authenticated: jest.fn((authState) => {
        expect(options.authState).toMatchObject(expectedParams);
        expect(authState).toEqual(options.authState);
      }),
    });
    const router = new VueRouter(createRoutes());
    router.beforeEach(routeGuard(options));
    router.push(
      createRedirectURI(expectedPath, expectedParams),
      success,
      error,
    );
  });
});
