function applyFilter(filterKey, data, config) {
    const filters = {
      filterByStatus: applyStatusFilter,
      filterByComponents: applyComponentsFilter,
      keys: applyKeysFilter,
      maps: applyMaps,
    };

    return filters[filterKey] &&
      // if key matches named filter
      filters[filterKey](data, config[filterKey]) ||
      // else, return the original data
      data;
}

function applyStatusFilter(data, statuses) {
  return data.filter(({ status }) => statuses.includes(status));
}

function applyComponentsFilter(data, components) {
  return data.filter(incident =>
    incident.incident_updates && // in case not an array
    incident.incident_updates.find(
      update =>
      // first check if null matches
      components.includes(update.affected_components) || (
        // if not null, then...
        update.affected_components && (
          // if an object, check if name matches
          update.affected_components.find(component => components.includes(component.name)) ||
          // or check if code matches
          update.affected_components.find(component => components.includes(component.code))
        )
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
    const remappedKeys = new Set();
    const mapped =
      Object.keys(maps)
        .reduce((obj, mapKey) => {
          const mapper = maps[mapKey];

          let mapVal = null;
          if (typeof mapper === 'string') {
            // get corresponding mapper value from incident
            mapVal = incident[mapper];
            // delete from original incident object
            remappedKeys.add(mapper);
          } else if (typeof mapper === 'function') {
            // invoke mapper function with incident as argument
            mapVal = mapper(incident);
          }

          return {...obj, [mapKey]: mapVal};
        }, incident);

    // delete all remapped keys
    remappedKeys.forEach(key => {
      delete mapped[key];
    });

    return mapped;
  });
}

module.exports.applyFilter = applyFilter;
