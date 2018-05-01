const rewire = require('rewire');
const { applyFilter } = require('../../lib/filters.js');
const allFilters = rewire('../../lib/filters.js');
const data = require('../fixtures/statuspage-all.fixture.json');

const filterFunctions = {
  applyStatusFilter: allFilters.__get__('applyStatusFilter'),
  applyComponentsFilter: allFilters.__get__('applyComponentsFilter'),
  applyKeysFilter: allFilters.__get__('applyKeysFilter'),
  applyMaps: allFilters.__get__('applyMaps')
};

describe('applyStatusFilter', () => {
  const { applyStatusFilter } = filterFunctions;
  it('should filter only status specified', () => {
    // check single filter
    expect(applyStatusFilter(data, ["investigating"]).length).toBe(1);
    expect(applyStatusFilter(data, ["investigating"])[0].status).toEqual('investigating');

    // check multiple
    expect(applyStatusFilter(data, ["investigating", "completed"]).length).toBe(4);
    applyStatusFilter(data, ["investigating", "completed"]).forEach(incident => {
      expect(incident.status).toMatch(/(investigating|completed)/);
    });
  });
});

describe('applyComponentsFilter', () => {
  const { applyComponentsFilter } = filterFunctions;
  it('should filter affected components by name', () => {
    expect(applyComponentsFilter(data, ["EZProxy"]).length).toEqual(1);
  });

  it('should filter affected components by code', () => {
    expect(applyComponentsFilter(data, ["q23q1ggvgj60"]).length).toEqual(1);
  });

  it('should include filter of \'null\' components if specified', () => {
    expect(applyComponentsFilter(data, ["EZProxy", null]).length).toEqual(12);
  });
});

describe('applyKeysFilter', () => {
  const { applyKeysFilter } = filterFunctions;
  it('should only include specified keys in each incident', () => {
    const keys = ["name", "status", "shortlink"];
    applyKeysFilter(data, keys).forEach(incident => {
      expect(Object.keys(incident)).toEqual(keys);
    });
  });
});

describe('applyMaps', () => {
  const { applyMaps } = filterFunctions;
  it('should work with mapping strings', () => {
    const mockData = [{
      body: "this is a body",
      shortlink: "http://url.com",
      otherField: ['a', 'b', 'c']
    }];

    const maps = {
      message: "body",
      incident_link: "shortlink",
    };

    const mappedData = [{
      message: "this is a body",
      incident_link: "http://url.com",
      otherField: ['a', 'b', 'c']
    }];

    expect(applyMaps(mockData, maps)).toEqual(mappedData);
  });

  it('should work with mapping with functions', () => {
    const mockData = [{
      id: 123456,
      body: "this is a body",
      shortlink: "http://url.com",
      otherField: ['a', 'b', 'c']
    }];

    const maps = {
      message: ({ body }) => body + "!",
      incident_link: ({id}) => `http://mysite/${id}`,
    };

    const mappedData = [{
      id: 123456,
      body: "this is a body",
      shortlink: "http://url.com",
      message: "this is a body!",
      incident_link: "http://mysite/123456",
      otherField: ['a', 'b', 'c']
    }];

    expect(applyMaps(mockData, maps)).toEqual(mappedData);
  });
});
