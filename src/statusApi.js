'use strict';

const { get: axiosGet } = require('axios');
const filterIncidents = require('./filterIncidents');
const checkArguments = require('./lib/checkArguments');

function statusApi(params, config) {
  checkArguments(params, config);
  const { page_id, type, limit } = params;

  return axiosGet(`http://${page_id}.statuspage.io/api/v2/summary.json`)
          .then(({ data }) => {
            const targetData = data[type].slice(0, limit);
            return filterIncidents(targetData, config);
          });
}

module.exports = statusApi;
