const rewire = require('rewire');
const nock = require('nock');

const fetchIncidents = rewire('../../index.js').__get__('fetchIncidents');
const BASE_API_URL = "https://api.statuspage.io/v1/pages/";

describe('fetchIncidents', () => {
  const page_id = 'abcd123';
  const data = require('../fixtures/statuspage-all.fixture.json');

  let allIncidentsRequest;
  beforeEach(() => {
    allIncidentsRequest =
      nock(BASE_API_URL)
        .get(`/${page_id}`)
        .reply(200, data);
  });

  it('should fetch from /{page_id}', (done) => {
    fetchIncidents({ page_id })
      .then(response => {
        expect(allIncidentsRequest.isDone()).toBe(true);
        done();
      });
  });

});
