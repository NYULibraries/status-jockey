const rewire = require('rewire');
const nock = require('nock');

const fetchIncidents = rewire('../../../manageApi').__get__('fetchIncidents');
const BASE_API_URL = "https://api.statuspage.io/v1/pages/";

describe('fetchIncidents', () => {
  const page_id = 'abcd123';
  const TOKEN = "dffa6323-4996-44a1-9dc3-01a994ed9e5f";

  describe('when fetching all incidents', () => {
    const data = require('../../fixtures/statuspage-all.fixture.json');
    const requestEndpoint = "incidents.json";
    const type = "all";

    it('should data fetch from /{page_id}', (done) => {
      const allIncidentsRequest =
        nock(BASE_API_URL)
          .get(`/${page_id}/${requestEndpoint}`)
          .reply(200, data);

      fetchIncidents({ page_id, type })
        .then(response => {
          expect(allIncidentsRequest.isDone()).toBe(true);
          expect(response.data).toEqual(data);
          done();
      });
    });

    it('should use required OAuth key', (done) => {
      const allIncidentsRequestWithHeaders =
        nock(BASE_API_URL)
          .get(`/${page_id}/${requestEndpoint}`)
          .matchHeader('Authorization', `OAuth ${TOKEN}`)
          .reply(200, data);

      fetchIncidents({ page_id }, TOKEN)
        .then(_res => {
          expect(allIncidentsRequestWithHeaders.isDone()).toBe(true);
          done();
      });
    });

    it('should fetch all without a type parameter', (done) => {
      const allIncidentsRequest =
        nock(BASE_API_URL)
          .get(`/${page_id}/${requestEndpoint}`)
          .reply(200, data);

      fetchIncidents({ page_id, type })
        .then(response => {
          expect(allIncidentsRequest.isDone()).toBe(true);
          expect(response.data).toEqual(data);
          done();
      });
    });
  });

  describe('when fetching scheduled incidents', () => {
    const data = require('../../fixtures/statuspage-scheduled.fixture.json');
    const requestEndpoint = 'incidents/scheduled.json';
    const type = "scheduled";

    it('should data fetch from /{page_id}/incidents/', (done) => {
      const allIncidentsRequest =
        nock(BASE_API_URL)
          .get(`/${page_id}/${requestEndpoint}`)
          .reply(200, data);

      fetchIncidents({ page_id, type })
        .then(response => {
          expect(allIncidentsRequest.isDone()).toBe(true);
          expect(response.data).toEqual(data);
          done();
      });
    });
  });

  describe('when fetching scheduled incidents', () => {
    const data = require('../../fixtures/statuspage-unresolved.fixture.json');
    const requestEndpoint = 'incidents/unresolved.json';
    const type = "unresolved";

    it('should data fetch from /{page_id}/incidents/', (done) => {
      const allIncidentsRequest =
        nock(BASE_API_URL)
          .get(`/${page_id}/${requestEndpoint}`)
          .reply(200, data);

      fetchIncidents({ page_id, type })
        .then(response => {
          expect(allIncidentsRequest.isDone()).toBe(true);
          expect(response.data).toEqual(data);
          done();
      });
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

});
