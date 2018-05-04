const rewire = require('rewire');
const allFilters = rewire('../../lib/filters.js');
const data = require('../fixtures/statuspage-all.fixture.json');

const filterFunctions = {
  applyStatusFilter: allFilters.__get__('applyStatusFilter'),
  applyComponentsFilter: allFilters.__get__('applyComponentsFilter'),
  applyKeysFilter: allFilters.__get__('applyKeysFilter'),
  applyMaps: allFilters.__get__('applyMaps'),
  applyCustomFilter: allFilters.__get__('applyCustomFilter')
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
      body: "this is a body",
      shortlink: "http://url.com",
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

describe('applyCustomFilter', () => {
  const { applyCustomFilter } = filterFunctions;

  it('should appy a custom filter function', () => {
    const customFilterFunction = ({ backfilled }) => backfilled;

    const expectedResult = [
      {
        "name": "Network Disruption",
        "status": "resolved",
        "created_at": "2018-03-15T12:00:00.000Z",
        "updated_at": "2018-03-15T12:00:00.000Z",
        "monitoring_at": null,
        "resolved_at": "2018-03-15T12:00:00.000Z",
        "impact": "none",
        "shortlink": "http://stspg.io/15a2dbc4b",
        "postmortem_ignored": false,
        "postmortem_body": null,
        "postmortem_body_last_updated_at": null,
        "postmortem_published_at": null,
        "postmortem_notified_subscribers": false,
        "postmortem_notified_twitter": false,
        "backfilled": true,
        "scheduled_for": null,
        "scheduled_until": null,
        "scheduled_remind_prior": false,
        "scheduled_reminded_at": null,
        "impact_override": null,
        "scheduled_auto_in_progress": false,
        "scheduled_auto_completed": false,
        "id": "j92m3ctr23tq",
        "page_id": "kyyfz4489y7m",
        "incident_updates": [
          {
            "status": "investigating",
            "body": "Resolved - 12:17 (ET) — \r\nThe issue was identified, corrected, and services restored. \r\n\r\nInvestigating - 11:15 (ET) —\r\nLibrary Systems reported a networking issue in the Bobst server room. The issue affected the availability of many online systems. Libraries Systems engaged NYU IT for assistance.",
            "created_at": "2018-03-16T15:53:01.104Z",
            "wants_twitter_update": false,
            "twitter_updated_at": null,
            "updated_at": "2018-03-16T15:53:01.104Z",
            "display_at": "2018-03-15T12:00:00.000Z",
            "affected_components": null,
            "custom_tweet": null,
            "deliver_notifications": true,
            "tweet_id": null,
            "id": "1ftcfcqjvn3w",
            "incident_id": "j92m3ctr23tq"
          }
        ]
      }

    ];

    expect(applyCustomFilter(data, customFilterFunction)).toEqual(expectedResult);
  });
});
