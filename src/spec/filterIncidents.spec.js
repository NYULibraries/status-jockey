const rewire = require('rewire');
const filterIncidents = rewire('../index.js').__get__("filterIncidents");

describe('filterIncidents', () => {
  const allIncidents = require('./fixtures/statuspage-all.fixture.json');
  it('should return unfiltered data with null configuration', () => {
    expect(filterIncidents(allIncidents, null)).toEqual(allIncidents);
  });

});
