'use strict';

const { get: axiosGet } = require('axios');
const filterIncidents = require('./filterIncidents');
const checkArguments = require('./lib/checkArguments');

function fetchIncidents({ page_id, type }, key) {
  const requestEndpoint = {
    all: "incidents",
    unresolved: "incidents/unresolved",
    scheduled: "incidents/scheduled",
  }[type] || "incidents";

  return axiosGet(`https://api.statuspage.io/v1/pages/${page_id}/${requestEndpoint}.json`, {
    headers: { Authorization: `OAuth ${key}`}
  });
}

function manageApi(params, config, key) {
  checkArguments(params, config, key).withKey();
  const { limit, page_id, type } = params;

  return (
    fetchIncidents({ page_id, type}, key)
      .then(({ data }) => {
        data = data.slice(0, limit); // limit param optional.
        return filterIncidents(data, config);
      })
  );
}

module.exports = manageApi;
