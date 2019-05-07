const createHandlers = require('./create-handlers');

describe('create-handlers', () => {
  it('call setAuthState on authenticated callback', () => {
    const setAuthState = jest.fn();
    const { authenticated } = createHandlers(setAuthState);
    const query = '#foo=bar';
    const next = jest.fn();
    authenticated(query, next);
    expect(setAuthState).toBeCalledWith(
      expect.objectContaining({foo: 'bar'})
    );
    expect(next).toBeCalledWith('/');
  });
});
