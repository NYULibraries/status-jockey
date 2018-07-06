'use strict';

const { get: axiosGet } = require('axios');
const incidentsFilter = require('./incidentsFilter');
const checkArguments = require('./lib/checkArguments');

function fetchFromStatusApi(params) {
  const { page_id, type, limit } = params;

  const dataProp = {
    summary: 'summary',
    status: 'status',
    components: 'components',
    incidents: 'incidents',
    ['incidents/unresolved']: 'incidents',
    ['scheduled-maintenances/upcoming']: 'scheduled_maintenances',
    ['scheduled-maintenances/active']: 'scheduled_maintenances',
    ['scheduled-maintenances']: 'scheduled_maintenances',
  }[type] || 'incidents';

  return (
    axiosGet(`http://${page_id}.statuspage.io/api/v2/${type}.json`)
      .then(({ data }) => data[dataProp].slice(0, limit))
      .catch(err => console.error(err))
  );
}

const statusApi = config => params => {
  checkArguments(params, config);
  const filterIncidents = incidentsFilter(config);

  return fetchFromStatusApi(params, config)
  .then(filterIncidents)
  .catch(err => console.error(err));
};

module.exports = statusApi;
