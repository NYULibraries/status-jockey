'use strict';

const { get: axiosGet } = require('axios');
const filterIncidents = require('./filterIncidents');
const checkArguments = require('./lib/checkArguments');

function fetchFromStatusApi(params) {
  const { page_id, type, limit } = params;

  const dataProp = {
    summary: 'summary',
    status: 'status',
    components: 'components',
    incidents: 'incidents',
    unresolved: 'incidents',
    upcoming: 'scheduled_maintenances',
    active: 'scheduled_maintenances',
    ['scheduled-maintenances']: 'scheduled_maintenances',
  }[type] || 'incidents';

  return (
    axiosGet(`http://${page_id}.statuspage.io/api/v2/${type}.json`)
      .then(({ data }) => {
        return data[dataProp].slice(0, limit);
      })
  );
}

function statusApi(params, config) {
  checkArguments(params, config);
  return fetchFromStatusApi(params, config).then(data => filterIncidents(data, config));
}

module.exports = statusApi;
