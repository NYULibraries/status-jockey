'use strict';

const BASE_API_URL = "https://api.statuspage.io/v1/pages/";
const { applyFilter } = "./lib/filters.js";

module.exports = function statusJockey(params, config, key) {
  checkArguments(arguments);
  const { limit, page_id } = params;
  return (
    fetchIncidents(params)
      .then(data => data.slice(0, limit)) // limit param optional.
      .then(data => filterIncidents(data, config[page_id]))
  );
};

function checkArguments(...args) {
  const [params, config, key] = [...args];

  if (params === null || typeof params !== 'object') {
    throw new TypeError(
      'Status jockey requires a search parameters object'
    );
  } else if (typeof params.page_id === 'undefined') {
    throw new TypeError(
      'Status jockey query params require a page_id to be defined'
    );
  }

  if (typeof config !== 'object') {
    throw new TypeError(
      'Status jockey requires a configuration object (or null)'
    );
  }

  if (typeof key !== 'string') {
    throw new TypeError(
      'Status jockey requires a statuspage.io API key'
    );
  }
}

function fetchIncidents({ page_id, type }) {
  return BASE_API_URL + page_id;
}

function filterIncidents(data, config) {
  if (!config) { return data; }

  const filterOrder = [
    'filterByStatus',
    'filterbyComponents',
    'maps',
    'keys'
  ];

  filterOrder.forEach(filterKey => {
    applyFilter(filterKey, data, config);
  });
}
