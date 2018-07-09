export function checkArguments(params, config, key) {
  if (params === null || typeof params !== 'object') {
    throw new TypeError(
      'Status jockey requires a search parameters object'
    );
  } else if (typeof params.page_id === 'undefined') {
    throw new TypeError(
      'Status jockey query params require a page_id to be defined'
    );
  }

  if (config === null || typeof config !== 'object') {
    throw new TypeError(
      'Status jockey requires a configuration object'
    );
  }

  return ({
    withKey: () => {
      if (typeof key !== 'string') {
        throw new TypeError(
          'Status jockey requires a statuspage.io API key'
        );
      }
      return this;
    },
  });
}
