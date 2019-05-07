/* eslint-disable no-new */
jest.mock('./generate-hash', () => () => 'foo');

const VueRouter = require('vue-router');
const URI = require('urijs');
const routeGuard = require('./route-guard');

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
  redirect_uri: options.redirectUri,
  client_id: options.clientId,
}).toString();

describe('route-guard', () => {
  it('calls unauthenticated callback', (done) => {
    const options = createOptions({
      unauthenticated: jest.fn((uri, redirect) => {
        expect(uri).toEqual(expectedUri);
        expect(redirect).toBeDefined();
        done();
      }),
    });
    const expectedUri = createAuthURI(options);
    const router = new VueRouter (createRoutes());
    router.beforeEach(routeGuard(options));
    router.push('/');
  });

  it('does not calls unauthenticated if auth state is set', async () => {
    const state = {};
    const options = createOptions({
      unauthenticated: jest.fn(),
      getState: () => Promise.resolve(state),
    });
    const next = jest.fn();
    const guard = routeGuard(options);
    await guard({ fullPath: '/bar', path: 'bar' }, '/foo', next);
    expect(options.unauthenticated).not.toBeCalled();
  });

  it('redirects to auth URL', (done) => {
    const options = createOptions();
    const expectedURI = createAuthURI(options);
    const router = new VueRouter(createRoutes());
    const success = jest.fn();
    const error = jest.fn();
    window.location.assign = jest.fn(() => {
      expect(success).not.toBeCalled();
      expect(window.location.assign).toBeCalledWith(
        expectedURI,
      );
      done();
    });

    router.beforeEach(routeGuard(options));
    router.push('/', success, error);
  });

  it('calls authenticated callback if auth state is set and to path not callback', async () => {
    const authenticated = jest.fn();
    const expectedParams = {
      access_token: 'foo',
      token_type: 'bearer',
      state: 'bar',
    };
    const options = createOptions({
      getState: () => expectedParams,
      authenticated,
      redirectUri: '/callback',
    });
    const next = jest.fn();
    const guard = routeGuard(options);
    await guard({fullPath: '/notCallback', path: 'notCallback'}, '/foo', next);
    expect(authenticated).toBeCalledWith(expectedParams, next);
  });

  it('calls authenticated callback if auth state is empty and is callback', async () => {
    const authenticated = jest.fn();
    const options = createOptions({
      authenticated,
      redirectUri: '/callback',
    });
    const next = jest.fn();
    const guard = routeGuard(options);
    await guard({fullPath: '/callback', path: 'callback'}, '/foo', next);
    expect(authenticated).toBeCalledWith('/callback', next);
  });
});
