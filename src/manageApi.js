'use strict';

const { get: axiosGet } = require('axios');
const incidentsFilter = require('./incidentsFilter');
const checkArguments = require('./lib/checkArguments');

function fetchFromManagedApi({ page_id, type, limit }, key) {
  const requestEndpoint = {
    incidents: 'incidents',
    unresolved: 'incidents/unresolved',
    scheduled: 'incidents/scheduled',
  }[type] || 'incidents';

  return axiosGet(
    `https://api.statuspage.io/v1/pages/${page_id}/${requestEndpoint}.json`,
    { headers: { Authorization: `OAuth ${key}`} }
  ).then(({ data }) => data.slice(0, limit))
    .catch(err => console.error(err));
}

const manageApi = (config, key) => params => {
  checkArguments(params, config, key).withKey();
  const filterIncidents = incidentsFilter(config);

  return fetchFromManagedApi(params, key)
    .then(filterIncidents)
    .catch(err => console.error(err));
};

module.exports = manageApi;
