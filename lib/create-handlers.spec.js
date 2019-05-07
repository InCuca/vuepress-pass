jest.mock('localforage');

const createHandlers = require('./create-handlers');
const localforage = require('localforage');

describe('create-handlers', () => {

  beforeEach(() => {
    jest.clearAllMocks().resetModules();
  });

  it('call next and set localforage on authenticated callback', async () => {
    const options = createHandlers();
    const next = jest.fn();

    expect(options.getState).toBeDefined();
    expect(options.setState).toBeDefined();

    await options.authenticated('#foo=bar', next);
    expect(localforage.setItem).toBeCalledWith(
      'auth',
      expect.objectContaining({foo: 'bar'})
    );
    expect(next).toBeCalledWith('/');
  });

  it('call next and on authenticated callback', async () => {
    const options = createHandlers();
    const next = jest.fn();

    expect(options.getState).toBeDefined();
    expect(options.setState).toBeDefined();

    await options.authenticated({foo: 'bar'}, next);
    expect(localforage.setItem).not.toBeCalled();
    expect(next).toBeCalledWith('/');
  });
});
