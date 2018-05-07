'use strict';

const BASE_API_URL = "https://api.statuspage.io/v1/pages/";
const { applyFilter } = require("./lib/filters.js");
const { get: axiosGet } = require('axios');

const ORDERED_FILTER_EXECUTION_LIST = Object.freeze([
  'filterByStatus',
  'filterbyComponents',
  'customFilter',
  'maps',
  'keys'
]);

const filterIncidents =
  (data, pageConfig) =>
    pageConfig ?
      ORDERED_FILTER_EXECUTION_LIST
        .reduce((filteredData, filterKey) =>
          pageConfig[filterKey] ?
            applyFilter(filterKey, filteredData, pageConfig[filterKey])
            : filteredData
        , data)
      : data;

function checkArguments(...args) {
  const [params, config, key] = args;

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

const requestEndpointsByType = {
  all: "incidents.json",
  unresolved: "incidents/unresolved.json",
  scheduled: "incidents/scheduled.json"
};

const fetchIncidents = ({ page_id, type }, key) => {
  const requestEndpoint =
    requestEndpointsByType[type] || "incidents.json";

  return axiosGet(`${BASE_API_URL}${page_id}/${requestEndpoint}`, {
    headers: { Authorization: `OAuth ${key}`}
  });
};

module.exports = function statusJockey(params, config, key) {
  checkArguments(params, config, key);
  const { limit, page_id, type } = params;

  return (
    fetchIncidents({ page_id, type}, key)
      .then(({ data }) => {
        data = data.slice(0, limit); // limit param optional.
        return filterIncidents(data, config);
      })
  );
};
