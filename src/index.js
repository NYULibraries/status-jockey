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

const manageRequestEndpointsByType = {
  all: "incidents",
  unresolved: "incidents/unresolved",
  scheduled: "incidents/scheduled",
};

const fetchIncidents = ({ page_id, type }, key) => {
  const requestEndpoint =
    manageRequestEndpointsByType[type] || "incidents";

  return axiosGet(`${BASE_API_URL}${page_id}/${requestEndpoint}.json`, {
    headers: { Authorization: `OAuth ${key}`}
  });
};

function manageApi(params, config, key) {
  checkArguments(params, config, key);
  const { limit, page_id, type } = params;

  return (
    fetchIncidents({ page_id, type}, key)
      .then(({ data }) => {
        data = data.slice(0, limit); // limit param optional.
        return filterIncidents(data, config);
      })
  );
}

function statusApi({ page_id, type, limit }, config) {
  const url = `http://${page_id}.statuspage.io/api/v2/summary.json`;
  return axiosGet(url)
          .then(({ data }) => {
            const targetData = data[type].slice(0, limit);
            return filterIncidents(targetData, config);
          });
}

module.exports = {
  manageApi,
  statusApi,
  filterIncidents
};
