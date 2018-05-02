const rewire = require('rewire');
const filterIncidents = rewire('../../index.js').__get__("filterIncidents");

describe('filterIncidents', () => {

  let data;
  beforeEach(() => {
    data = require('../fixtures/statuspage-all.fixture.json');
  });

  it('should return unfiltered data with null configuration', () => {
    expect(filterIncidents(data, null)).toEqual(data);
  });

  it('should return filtered data with configuration', () => {
    const pageConfig = {
      // only return incidents with the following statuses. Otherwise, return all.
      filterByStatus: ["investigating", "completed"],
      // only return incidents from the following components. Otherwise, return all.
      filterByComponents: ["EZProxy"],
      // only returns the following keys
      keys: ["id", "message", "incident_link", "created_at", "status", "hashtags"],
      // map Statuspage.io response key values to custom key values. Non-mapped values in keys are given the default key.
      maps: {
        // can map each entry to new key based on string identifying the mapped key
        title: "name",
        incident_link: "shortlink",
        // or based on a function which takes the incident item object
        message: ({ incident_updates }) => incident_updates[0].body,
        status: ({ status }) => {
          switch (status) {
            case "investigating":
              return "red";
            case "identified":
              return "orange";
            case "monitoring":
              return "green";
            default:
              return "red";
          }
        },
        hashtags: ({ incident_updates }) => {
          const body = incident_updates[0].body;
          return body && body.match(/#\w+/g) ? body.match(/#\w+/g).map(v => v.replace('#', '')) : [];
        }
      }
    };

    const expectedResult = [
      {
        status: 'red',
        created_at: '2018-04-30T16:54:12.954Z',
        id: 'yk38z6cwh8l1',
        incident_link: 'http://stspg.io/47dab52e5',
        message: 'Please be advised that all services on NYU\'s network (NYU-NET) are currently unavailable due to a network outage. NYU IT is investigating this issue and will post updates to the IT Service Status page (https://www.nyu.edu/life/information-technology/help-and-service-status/it-service-status.html) and the appropriate notification lists as they become available.\r\n\r\n#majoroutage',
        hashtags: [
          'majoroutage'
        ]
      },
      {
        status: 'red',
        created_at: '2018-03-12T13:19:51.276Z',
        id: '35qzmvylkqzf',
        incident_link: 'http://stspg.io/15ca9d060',
        message: 'All online library systems have been restored. \r\n\r\nNYU-NY: Bobst Library will reopen at 2 PM (ET) with normal spring break hours.',
        hashtags: []
      },
      {
        status: 'red',
        created_at: '2018-02-14T22:14:11.053Z',
        id: '0rhvhj7r6ljj',
        incident_link: 'http://stspg.io/6e49d0938',
        message: 'All systems are operational.',
        hashtags: []
      },
      {
        status: 'red',
        created_at: '2018-01-08T22:38:27.164Z',
        id: '7h49j2z74ys8',
        incident_link: 'http://stspg.io/01c4cdad3',
        message: 'All systems are fully operational.',
        hashtags: []
      }
    ];

    expect(filterIncidents(data, pageConfig)).toEqual(expectedResult);
  });

});
