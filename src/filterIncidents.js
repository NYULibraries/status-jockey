const applyFilter = require("./lib/applyFilter");

const ORDERED_FILTER_EXECUTION_LIST = Object.freeze([
  'filterByStatus',
  'filterbyComponents',
  'customFilter',
  'maps',
  'keys'
]);

function filterIncidents(data, pageConfig) {
  return ORDERED_FILTER_EXECUTION_LIST
    .reduce((res, key) => pageConfig[key] ?
      applyFilter(key, res, pageConfig[key])
      : res
    , data);
}

module.exports = filterIncidents;
