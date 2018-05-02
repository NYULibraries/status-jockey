'use strict';

const BASE_API_URL = "https://api.statuspage.io/v1/pages/";
const { applyFilter } = require("./lib/filters.js");
const { get: axiosGet } = require('axios');

module.exports = function statusJockey(params, config, key) {
  checkArguments(arguments);
  const { limit, page_id } = params;
  return (
    fetchIncidents(params, key)
      .then(({ data }) => {
        data = data.slice(0, limit); // limit param optional.
        return filterIncidents(data, config[page_id]);
      })
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

function fetchIncidents({ page_id, type }, token) {

  let requestEndpoint;
  switch (type) {
    case "all":
      requestEndpoint = "incidents.json";
      break;
    case "unresolved":
      requestEndpoint = "incidents/unresolved.json";
      break;
    case "scheduled":
      requestEndpoint = "incidents/scheduled.json";
      break;
    default:
      requestEndpoint = "incidents.json";
  }

  const url = BASE_API_URL + `${page_id}/${requestEndpoint}`;

  return axiosGet(url, {
    headers: { Authorization: `OAuth ${token}`}
  });
}

function filterIncidents(data, pageConfig) {
  if (!pageConfig) { return data; }

  const filterOrder = [
    'filterByStatus',
    'filterbyComponents',
    'maps',
    'keys'
  ];

  return filterOrder.reduce(
    (filteredData, filter) =>
      applyFilter(filter, filteredData, pageConfig),
    data
  );
}
