const applyStatusFilter = (data, statuses) =>
  applyCustomFilter(data, ({ status }) => statuses.includes(status));

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

export function applyFilter(filterKey, data, filterConfig) {
  return {
    filterByStatus: applyStatusFilter,
    customFilter: applyCustomFilter,
    keys: applyKeysFilter,
    maps: applyMaps,
  }[filterKey](data, filterConfig);
}
