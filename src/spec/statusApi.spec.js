const statusApi = require('../statusApi');
const nock = require('nock');

const BASE_API_URL = 'http://${page_id}.statuspage.io/api/v2/';

describe('statusApi', () => {
  const { incidents } = require('./fixtures/statusApi.fixture.json');
  const page_id = "abcd1234";
  const config = require('./fixtures/config.fixture.js');
  const fetchStatusApi = statusApi(config);

  beforeEach(() => {
    nock(BASE_API_URL)
      .get(`/summary.json`)
      .reply(200, incidents);
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
      it('should apply filter to scheduled_maintenances', () => {

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
