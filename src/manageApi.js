'use strict';

const { get: axiosGet } = require('axios');
const filterIncidents = require('./filterIncidents');
const checkArguments = require('./lib/checkArguments');

function fetchFromManagedApi({ page_id, type, limit }, key) {
  const requestEndpoint = {
    incidents: 'incidents',
    unresolved: 'incidents/unresolved',
    scheduled: 'incidents/scheduled',
  }[type] || 'incidents';

  return axiosGet(`https://api.statuspage.io/v1/pages/${page_id}/${requestEndpoint}.json`, {
    headers: { Authorization: `OAuth ${key}`}
  }).then(({ data }) => data.slice(0, limit));
}

function manageApi(params, config, key) {
  checkArguments(params, config, key).withKey();

  return fetchFromManagedApi(params, key)
    .then(data => filterIncidents(data, config));
}

module.exports = manageApi;
