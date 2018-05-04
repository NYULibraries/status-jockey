function applyFilter(filterKey, data, filterConfig) {
    const filters = {
      filterByStatus: applyStatusFilter,
      filterByComponents: applyComponentsFilter,
      customFilter: applyCustomFilter,
      keys: applyKeysFilter,
      maps: applyMaps,
    };

    return filters[filterKey](data, filterConfig);
}

function applyStatusFilter(data, statuses) {
  return data.filter(({ status }) => statuses.includes(status));
}

function applyComponentsFilter(data, components) {
  return data.filter(({ incident_updates }) =>
    incident_updates.find(
      ({ affected_components }) =>
      // first check if null matches
      components.includes(affected_components) ||
      affected_components && (
        // if an array, check if name matches one of the affected components
        affected_components.find(
          ({ name, code }) => components.includes(name) ||
                              components.includes(code))
      )
    )
  );
}

function applyKeysFilter(data, keys) {
  return data.map(incident =>
    Object.keys(incident)
      .filter(key => keys.includes(key))
      .reduce((obj, key) => ({...obj, [key]: incident[key]}), {})
  );
}

function applyMaps(data, maps) {
  return data.map(incident => {
    return Object.keys(maps).reduce((obj, mapKey) => {
        // string or a function
        const mapper = maps[mapKey];

        let mapVal = null;
        if (typeof mapper === 'string') {
          // get corresponding mapper value from incident
          mapVal = incident[mapper];
        } else if (typeof mapper === 'function') {
          // invoke mapper function with incident as argument
          mapVal = mapper(incident);
        }

        return {...obj, [mapKey]: mapVal};
      }, incident);
  });
}

function applyCustomFilter(data, filterFunction) {
  return data.filter(filterFunction);
}

module.exports.applyFilter = applyFilter;
