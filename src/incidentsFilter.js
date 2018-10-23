import { applyStatusFilter, applyCustomFilter, applyMaps, applyKeysFilter } from './lib/filters';

// controls execution order of filters (more optimized to filter incidents first, then map)
const ORDERED_FILTER_EXECUTION_LIST = Object.freeze([
  { filterKey: 'filterByStatus', filter: applyStatusFilter },
  { filterKey: 'customFilter', filter: applyCustomFilter },
  { filterKey: 'maps', filter: applyMaps},
  { filterKey: 'keys', filter: applyKeysFilter },
]);

export const incidentsFilter = config => data =>
  ORDERED_FILTER_EXECUTION_LIST.reduce((newData, { filterKey, filter }) =>
    config[filterKey] ? filter(newData, config[filterKey]) : newData,
  data);
