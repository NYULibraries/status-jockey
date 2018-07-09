import { applyFilter } from './lib/applyFilter';

const ORDERED_FILTER_EXECUTION_LIST = Object.freeze([
  'filterByStatus',
  'customFilter',
  'maps',
  'keys'
]);

export const incidentsFilter = config => data =>
  ORDERED_FILTER_EXECUTION_LIST
    .reduce((res, key) =>
      config[key] ? applyFilter(key, res, config[key]) : res, data
    );
