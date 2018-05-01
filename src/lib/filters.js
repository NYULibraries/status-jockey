module.exports.applyFilter = function applyFilter(filterKey, data) {
    const filters = {
      filterByStatus: applyStatusFilter,
      filterByComponents: applyComponentsFilter,
      keys: applyKeysFilter,
      maps: applyMaps,
    };

    return filters[filterKey] &&
      // if key matches named filter
      filters[filterKey](data) ||
      // else, return the original data
      data;
};

function applyStatusFilter(data) {

}

function applyComponentsFilter(data) {

}

function applyKeysFilter(data) {

}

function applyMaps(data) {

}
