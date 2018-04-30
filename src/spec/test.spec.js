const statusJockey = require('../index.js');

describe('test', () => {

  it('status jockey should hello world', () => {
    expect(statusJockey()).toEqual('hello world!');
  });

});
