const createHandlers = require('./create-handlers');

describe('create-handlers', () => {
  it('set authState object on OPTIONS on authenticated callback', () => {
    const OPTIONS = {};
    const { authenticated } = createHandlers(OPTIONS);
    const query = '#foo=bar';
    const next = jest.fn();
    authenticated(query, next);
    expect(OPTIONS).toHaveProperty('authState');
    expect(OPTIONS.authState).toMatchObject({foo: 'bar'});
    expect(next).toBeCalledWith('/');
  });
});
