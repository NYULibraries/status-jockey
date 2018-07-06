const rewire = require('rewire');
const nock = require('nock');

const fetchFromStatusApi = rewire('../../../statusApi').__get__('fetchFromStatusApi');
const page_id = 'abcd123';
const BASE_API_URL = `https://${page_id}.statuspage.io/api/v2/`;

const endpointMap = {
  status: 'status',
  components: 'components',
  incidents: 'incidents',
  ['incidents/unresolved']: 'incidents',
  ['scheduled-maintenances/upcoming']: 'scheduled_maintenances',
  ['scheduled-maintenances/active']: 'scheduled_maintenances',
  ['scheduled-maintenances']: 'scheduled_maintenances',
};

describe('fetchFromStatusApi', () => {

  Object.keys(endpointMap).forEach((key) => {
    const type = key;
    const endpoint = key;
    const dataProp = endpointMap[key];
    const data = require('../../fixtures/statusApi.fixture.json');
    const expectedResults = data[dataProp];

    describe(`when fetching ${endpoint}`, () => {
      it(`should data fetch from ${endpoint}`, (done) => {
        const request =
          nock(BASE_API_URL)
            .get(`/${endpoint}.json`)
            .reply(200, data);

        fetchFromStatusApi({ page_id, type })
          .then(response => {
            expect(request.isDone()).toBe(true);
            expect(response).toEqual(expectedResults);
            done();
        });
      });
    });
  });

  describe('without a type parameter', () => {
    const data = require('../../fixtures/statusApi.fixture.json');
    const expectedResults = data.incidents;

    it('should fetch incidents', (done) => {
      const request =
        nock(BASE_API_URL)
        .get('/incidents.json')
        .reply(200, data);

      fetchFromStatusApi({ page_id })
        .then(res => {
          expect(request.isDone()).toBe(true);
          expect(res).toEqual(expectedResults);
          done();
        });
    });
  });

  describe('summary', () => {
    const data = require('../../fixtures/statusApi.fixture.json');

    it('should return all data', (done) => {
      const request = nock(BASE_API_URL)
        .get('/summary.json')
        .reply(200, data);

      fetchFromStatusApi({ page_id, type: 'summary' })
        .then(res => {
          expect(request.isDone()).toBe(true);
          expect(res).toEqual(data);
          done();
      });
    });
  });

  describe('limits parameter', () => {
    const data = require('../../fixtures/statusApi.fixture.json');
    const type = 'incidents';
    const limit = 2;

    it('should limit output of array', (done) => {
      const request =
        nock(BASE_API_URL)
          .get('/incidents.json')
          .reply(200, data);

      fetchFromStatusApi({ page_id, type, limit: 2 })
        .then(res => {
          expect(request.isDone()).toBe(true);
          expect(res).toEqual(data.incidents.slice(0, limit));
          done();
      });
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

});
