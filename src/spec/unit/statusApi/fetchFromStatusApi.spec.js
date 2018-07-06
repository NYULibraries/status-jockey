const rewire = require('rewire');
const nock = require('nock');

const config = require('../../fixtures/config.fixture.js');
const fetchFromStatusApi = rewire('../../../statusApi').__get__('fetchFromStatusApi')(config);
const BASE_API_URL = 'http://${page_id}.statuspage.io/api/v2/';
const data = require('./fixtures/statusApi.fixture.json');
const { incidents, scheduled_maintenances } = data;

describe('fetchFromStatusApi', () => {
  const incidentsResult = [
    {
      status: 'orange',
      created_at: "2014-05-14T14:22:39.441-06:00",
      id: 'cp306tmzcl0y',
      incident_link: 'http://stspg.dev:5000/Q0E',
      message: "Our master database has ham sandwiches flying out of the rack, and we're working our hardest to stop the bleeding. The whole site is down while we restore functionality, and we'll provide another update within 30 minutes. #majoroutage",
      hashtags: [
        'majoroutage'
      ]
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
      .get(`/incidents.json`)
      .reply(200, incidents);
    });
  });

  describe('scheduled_maintenances', () => {
    const scheduledMaintenancesResult = [
      {

      }
    ]

    beforeEach(() => {
      nock(BASE_API_URL)
      .get(`/incidents.json`)
      .reply(200, scheduled_maintenances);
    });


  });

  afterEach(() => {
    nock.cleanAll();
  });
});
