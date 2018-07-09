const nock = require('nock');
const configFixture = require('./fixtures/config.fixture.js');

const config = {
  ...configFixture,
  filterByStatus: undefined
};

const statusApiResponse = require('./fixtures/statusApi.fixture.json');
const page_id = 'nyulibraries';
const BASE_API_URL = `https://${page_id}.statuspage.io/api/v2/`;

const { statusApi } = require('../statusApi');
const fetchStatusApi = statusApi(config);

describe('statusApi', () => {
  const incidentsResult = [
    {
      status: 'orange',
      created_at: "2014-05-14T14:22:39.441-06:00",
      id: 'cp306tmzcl0y',
      incident_link: 'http://stspg.dev:5000/Q0E',
      message: "Our master database has ham sandwiches flying out of the rack, and we're working our hardest to stop the bleeding. The whole site is down while we restore functionality, and we'll provide another update within 30 minutes. #majoroutage",
      hashtags: ['majoroutage']
    },
    {
      status: 'green',
      created_at: '2014-05-12T14:22:39.441-06:00',
      id: '2z5g29qrrxvl',
      incident_link: 'http://stspg.dev:5000/Q0R',
      message: 'A small display issue with the display of the website was discovered after a recent deploy. The deploy has been rolled back and the website is again functioning correctly.',
      hashtags: []
    },
  ];

  describe('incidents request', () => {
    beforeEach(() => {
      nock(BASE_API_URL)
      .get('/incidents.json')
      .reply(200, statusApiResponse);
    });

    it('should transform incidents', (done) => {
      fetchStatusApi({ page_id, type: 'incidents'  }).then((res) => {
        expect(res).toEqual(incidentsResult);
        done();
      });
    });
  });

  describe('scheduled_maintenances', () => {
    const scheduledMaintenancesResult = [
      {
        id: "w1zdr745wmfy",
        message: "Our data center has informed us that they will be performing routine network maintenance. No interruption in service is expected. Any issues during this maintenance should be directed to our support center #scheduledmaintenance",
        incident_link: "http://stspg.dev:5000/Q0F",
        created_at: "2014-05-14T14:24:40.430-06:00",
        status: "green",
        hashtags: ['scheduledmaintenance']
      },
      {
        id: "k7mf5z1gz05c",
        message: "Scheduled maintenance is currently in progress. We will provide updates as necessary.",
        incident_link: "http://stspg.dev:5000/Q0G",
        created_at: "2014-05-14T14:27:17.303-06:00",
        status: "orange",
        hashtags: []
      },
    ];

    beforeEach(() => {
      nock(BASE_API_URL)
      .get('/scheduled-maintenances.json')
      .reply(200, statusApiResponse);
    });

    it('should transform scheduled_maintenances', (done) => {
      fetchStatusApi({ page_id: 'nyulibraries', type: 'scheduled-maintenances'}).then((res) => {
        expect(res).toEqual(scheduledMaintenancesResult);
        done();
      });
    });

    afterEach(() => {
      nock.cleanAll();
    });
  });
});
