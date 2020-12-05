const nock = require('nock');
const LoggingClient = require('../../src/clients/LoggingClient')

const mockAnySuccessfulLogRequest = () => {
  nock.cleanAll();

  nock(LoggingClient.baseURL())
    .post('/api/log', body => true)
    .reply(200);
};

const mockSuccessfulLogRequest = (updatedObjectType, action, objectType, serializedObject) => {
  nock.cleanAll();

  return nock(LoggingClient.baseURL())
    .post('/api/log', { updatedObjectType, action, objectType, serializedObject })
    .reply(200);
};

module.exports = {
  mockAnySuccessfulLogRequest,
  mockSuccessfulLogRequest
};
