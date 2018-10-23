const hasStatus = statuses => ({ status }) => statuses.indexOf(status) > -1;
export const applyStatusFilter = (data, statuses) => data.filter(hasStatus(statuses));

export const applyKeysFilter = (data, keys) => {
  const keysFilter = keys => obj => Object.keys(obj).reduce(
    (acc, k) => keys.indexOf(k) > -1 ? { ...acc, [k]: obj[k] } : acc
  , {});

  return data.map(keysFilter(keys));
};

export const applyMaps = (data, maps) => {
  // applyMap to single object with given string or function
  const applyMap = mapper => obj =>
    typeof mapper === 'string' ? obj[mapper]
    : typeof mapper === 'function' ? mapper(obj)
    : null;

  const mapsApplier = maps => incident => Object.keys(maps).reduce(
    (acc, mapKey) => ({ ...acc, [mapKey]: applyMap(maps[mapKey])(incident) })
  , incident);

  return data.map(mapsApplier(maps));
};

export const applyCustomFilter = (data, filterFunction) => data.filter(filterFunction);