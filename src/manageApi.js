'use strict';

import { get as axiosGet } from 'axios';
import { incidentsFilter } from './incidentsFilter';
import { checkArguments } from './lib/checkArguments';

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

export const manageApi = (config, key) => params => {
  checkArguments(params, config, key).withKey();
  const filterIncidents = incidentsFilter(config);

  return fetchFromManagedApi(params, key)
    .then(filterIncidents)
    .catch(err => console.error(err));
};
