const rewire = require('rewire');
const nock = require('nock');

const fetchIncidents = rewire('../../index.js').__get__('fetchIncidents');
const BASE_API_URL = "https://api.statuspage.io/v1/pages/";

describe('fetchIncidents', () => {
  const page_id = 'abcd123';
  const data = require('../fixtures/statuspage-all.fixture.json');
  const TOKEN = "dffa6323-4996-44a1-9dc3-01a994ed9e5f";

  let allIncidentsRequest;
  beforeEach(() => {
    allIncidentsRequest = nock(BASE_API_URL)
                            .get(`/${page_id}/incidents.json`)
                            .query(true)
                            .reply(200, data);
  });

  it('should data fetch from /{page_id}', (done) => {
    fetchIncidents({ page_id })
      .then(response => {
        expect(allIncidentsRequest.isDone()).toBe(true);
        expect(response.data).toEqual(data);
        done();
      });
  });

  it('should use required OAuth key', (done) => {
    allIncidentsRequest = nock(BASE_API_URL)
                            .get(`/${page_id}/incidents.json`, {
                              reqheaders: {
                                Authorization: `OAuth ${TOKEN}`
                              }
                            })
                            .reply(200, data)
                            .log(console.log);

    fetchIncidents({ page_id }, TOKEN)
      .then(response => {
        expect(allIncidentsRequest.isDone()).toBe(true);
        expect(response.data).toEqual(data);
        done();
      });
  });

});
