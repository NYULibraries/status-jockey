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

function applyKeysFilter(data, config) {

}

function applyMaps(data, config) {

}

module.exports.applyFilter = applyFilter;
