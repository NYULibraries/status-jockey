const applyStatusFilter = (data, statuses) =>
  data.filter(({ status }) => statuses.includes(status));

const applyComponentsFilter = (data, components) =>
  data.filter(({ incident_updates }) =>
    incident_updates.some(({ affected_components }) =>
      // first check if null matches
      components.includes(affected_components) ||
      // if an array, check if name matches one of the affected components
      Array.isArray(affected_components) &&
      affected_components.some(({ name, code }) =>
        components.includes(name) || components.includes(code)
      )
    )
  );

const applyKeysFilter = (data, keys) =>
  data.map(incident =>
    Object.keys(incident)
      .filter(key => keys.includes(key))
      .reduce((obj, key) => ({...obj, [key]: incident[key]}), {})
  );

const applyMaps = (data, maps) =>
  data.map(incident => {
    return Object.keys(maps).reduce((obj, mapKey) => {
        const mapper = maps[mapKey];
        const mapVal =
          typeof mapper === 'string' ? incident[mapper]
          : typeof mapper === 'function' ? mapper(incident)
          : null;

        return {...obj, [mapKey]: mapVal};
      }, incident);
  });

const applyCustomFilter = (data, filterFunction) => data.filter(filterFunction);

const filterFunctionsByConfigKey = {
  filterByStatus: applyStatusFilter,
  filterByComponents: applyComponentsFilter,
  customFilter: applyCustomFilter,
  keys: applyKeysFilter,
  maps: applyMaps,
};

module.exports.applyFilter = (filterKey, data, filterConfig) =>
    (filterFunctionsByConfigKey)[filterKey](data, filterConfig);
