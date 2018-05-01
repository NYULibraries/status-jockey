const rewire = require('rewire');
const checkArguments = rewire('../../index.js').__get__("checkArguments");

describe('checkArguments', () => {
  it('should check first argument (params) is an object', () => {
    const error = [
      TypeError,
      'Status jockey requires a search parameters object'
    ];

    expect(() => checkArguments(undefined))
      .toThrowError(...error);

    expect(() => checkArguments(null))
      .toThrowError(...error);

    expect(() => checkArguments({ page_id: 'abcd123'}))
      .not.toThrowError(...error);
  });

  it("should check first argument (params) has key 'page_id'", () => {
    expect(() => checkArguments({}, null, 'abc123'))
      .toThrowError(TypeError,
      'Status jockey query params require a page_id to be defined'
    );

    expect(() => checkArguments({ page_id: 'abcd123'}, null, 'abc123'))
      .not.toThrow();
  });

  it('should check second argument (config) is an object', () => {
    expect(() => checkArguments({ page_id: 'abcd123'}, undefined, 'abc123'))
      .toThrowError(
        TypeError,
        'Status jockey requires a configuration object (or null)'
      );

    expect(() => checkArguments({ page_id: 'abcd123'}, null, 'abc123'))
      .not.toThrow();
  });

  it('should check first argument (key) is a string', () => {
    expect(() => checkArguments({ page_id: 'abcd123'}, null, undefined))
      .toThrowError(
        TypeError,
        'Status jockey requires a statuspage.io API key'
      );
  });
});
