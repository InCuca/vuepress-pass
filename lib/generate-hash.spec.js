const hash = require('./generate-hash');

describe('generate-hash', () => {
  it('generate random strings', () => {
    const str1 = hash();
    const str2 = hash();
    expect(str1).not.toEqual(str2);
  });
});
