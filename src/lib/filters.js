const hasStatus = statuses => ({ status }) => statuses.indexOf(status) > -1;
export const applyStatusFilter = (data, statuses) => data.filter(hasStatus(statuses));

export const applyKeysFilter = (data, keys) => {
  const keysFilter = keys => obj => Object.entries(obj).reduce(
    (acc, [k, v]) => keys.indexOf(k) > -1 ? { ...acc, [k]: v } : acc
  , {});

  return data.map(keysFilter(keys));
};

export const applyMaps = (data, maps) => {
  // applyMap to single object with given string or function
  const applyMap = mapper => obj =>
    typeof mapper === 'string' ? obj[mapper]
    : typeof mapper === 'function' ? mapper(obj)
    : null;

  const mapsApplier = maps => incident => Object.entries(maps).reduce(
    (acc, [mapKey, mapper]) => ({ ...acc, [mapKey]: applyMap(mapper)(incident) })
  , incident);

  return data.map(mapsApplier(maps));
};

export const applyCustomFilter = (data, filterFunction) => data.filter(filterFunction);