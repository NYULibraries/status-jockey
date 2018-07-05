const rewire = require('rewire');
const nock = require('nock');

const fetchFromStatusApi = rewire('../../../statusApi').__get__('fetchFromStatusApi');
const BASE_API_URL = 'http://${page_id}.statuspage.io/api/v2/';
