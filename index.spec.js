const Pass = require('./index');

describe('Pass', () => {
  it('exposes a vuepress plugin', () => {
    expect(Pass).toBeInstanceOf(Function);
    expect(Pass({}, {})).toBeInstanceOf(Object);
  });
});
