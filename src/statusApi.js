'use strict';

const { get: axiosGet } = require('axios');
const incidentsFilter = require('./incidentsFilter');
const checkArguments = require('./lib/checkArguments');

function fetchFromStatusApi({ page_id, type, limit }) {
  type = type || 'incidents';
  const dataProp = {
    status: 'status',
    components: 'components',
    incidents: 'incidents',
    ['incidents/unresolved']: 'incidents',
    ['scheduled-maintenances/upcoming']: 'scheduled_maintenances',
    ['scheduled-maintenances/active']: 'scheduled_maintenances',
    ['scheduled-maintenances']: 'scheduled_maintenances',
  }[type] || 'incidents';

  return axiosGet(`https://${page_id}.statuspage.io/api/v2/${type}.json`)
    .then(({ data }) => {
      let result;
      if (type === 'summary') {
        const sliced = ['scheduled_maintenances', 'incidents']
          .reduce((res, key) => (
            { ...res, ...{ [key]: data[key].slice(0, limit) } }
          ), {});
        result = { ...data, ...sliced };
      } else {
        const responseData = data[dataProp];
        result = Array.isArray(responseData) ? responseData.slice(0, limit) : responseData;
      }
      return result;
    })
    .catch(err => console.error(err));
}

const statusApi = config => params => {
  checkArguments(params, config);
  const filterIncidents = incidentsFilter(config);
  return fetchFromStatusApi(params)
  .then(filterIncidents)
  .catch(err => console.error(err));
};

module.exports = statusApi;
