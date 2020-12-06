const nock = require('nock');
const LoggingClient = require('../../src/clients/LoggingClient')

const mockAnySuccessfulLogRequest = () => {
  nock.cleanAll();

  nock(LoggingClient.baseURL())
    .post('/api/log', body => true)
    .reply(200);
};

const mockSuccessfulLogRequest = (message, object) => {
  nock.cleanAll();

  return nock(LoggingClient.baseURL())
    .post('/api/log', { message, object })
    .reply(200);
};

module.exports = {
  mockAnySuccessfulLogRequest,
  mockSuccessfulLogRequest
};
