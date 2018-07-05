const statusApi = require('../statusApi');
const nock = require('nock');

const BASE_API_URL = 'http://${page_id}.statuspage.io/api/v2/';

describe('statusApi', () => {
  const data = require('./fixtures/summary.fixture.json');
  const page_id = "abcd1234";
  const config = require('./fixtures/config.fixture.js');
  const fetchStatusApi = statusApi(config);

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

  beforeEach(() => {
    nock(BASE_API_URL)
      .get(`/summary.json`)
      .reply(200, data);
  });

  it('should return a Promise', (done) => {
    const promise = fetchStatusApi(
      { page_id, type: 'incidents' }
    );

    expect(promise.__proto__.constructor).toBe(Promise);
    done();
  });

  describe('request type of', () => {
    describe('unresolved', () => {

    });

    describe('incidents', () => {
      it('should apply filter to incidents', () => {

      });
    });

    describe('scheduled_maintenances', () => {
      it('should apply filter to scheduled_maintenance', () => {

      });
    });

    describe('undefined', () => {
      it('should default to incidents', () => {

      });
    });
  });

  it('thenable promise should use filtered data', () => {
    // statusApi(
    //   { page_id, type: 'incidents' },
    //   config
    // ).then((filteredData) => {
    //   expect(filteredData).toEqual(expectedResult);
    //   done();
    // });
  });

  afterEach(() => {
    nock.cleanAll();
  });
});
