const { filterIncidents } = require('../../index.js');

describe('filterIncidents', () => {
  const pageConfig = require('../fixtures/config.fixture.js');
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

  let data;
  beforeEach(() => {
    data = require('../fixtures/statuspage-all.fixture.json');
  });

  it('should return unfiltered data with null configuration', () => {
    expect(filterIncidents(data, null)).toEqual(data);
  });

  it('should return filtered data with configuration', () => {
    expect(filterIncidents(data, pageConfig)).toEqual(expectedResult);
  });

  it('should be composed of pure functions', () => {
    data = Object.freeze(data);
    expect(() => filterIncidents(data, pageConfig)).not.toThrow();
  });

  it('should work without all config parameters defined', () => {
    const config = { keys: ["id", "status"] };
    expect(() => filterIncidents(data, config)).not.toThrow();
  });

  it('should not throw error with invalid filters defined', () => {
    const config = { keysX: ["id", "status"] };
    expect(() => filterIncidents(data, config)).not.toThrow();
  });

});
