'use strict';

const BASE_API_URL = "https://api.statuspage.io/v1/pages/";
const { applyFilter } = "./lib/filters.js";

module.exports = function statusJockey(params, config, key) {
  checkArguments(arguments);

  return (
    fetchIncidents(params)
      .then(data => filterIncidents(data, config))
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

function fetchIncidents(params) {

}

function filterIncidents(data, config) {
  if (!config) { return data; }

  const filterOrder = [
    'filterByStatus',
    'filterbyComponents',
    'keys',
    'maps'
  ];
  
  filterOrder.forEach(filterKey => {
    applyFilter(filterKey, data, config);
  });
}
