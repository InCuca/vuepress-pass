/* eslint-disable no-new */
jest.mock('./generate-hash', () => () => 'foo');

const VueRouter = require('vue-router');
const URI = require('urijs');
const routeGuard = require('./route-guard');

const localforage = require('localforage');

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

const createRedirectURI = (path, params) => URI(path)
  .query(params)
  .toString();

describe('route-guard', () => {
  it('calls unauthenticated callback', () => {
    const options = createOptions({
      unauthenticated: jest.fn(),
    });
    const expectedUri = createAuthURI(options);
    const router = new VueRouter (createRoutes());
    router.beforeEach(routeGuard(options));
    router.push('/');

    expect(options.unauthenticated).toBeCalledWith(
      expectedUri,
      expect.any(Function),
    );
  });

  it ('does call localforage getItem with def options on route change', () => {
    const options = createOptions();
    const router = new VueRouter(createRoutes());
    router.beforeEach(routeGuard(options));
    router.push('/');
    expect(localforage.getItem).toBeCalledWith('auth');
  });

  it('does call getState on route change', () => {
    const getState = jest.fn();
    const options = createOptions({getState});
    const router = new VueRouter(createRoutes());
    router.beforeEach(routeGuard(options));
    router.push('/');
    expect(getState).toBeCalled();
  });

  it('does not calls unauthenticated if auth state is set', () => {
    const state = {};
    const options = createOptions({
      unauthenticated: jest.fn(),
      getState: () => state,
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
